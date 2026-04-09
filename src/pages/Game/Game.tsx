import "./Game.css";
import {useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import { difficultyMap, difficultyConfig } from "../../config/difficultyConfig";
import {api} from "../../api/http.ts";
import {DifficultyComplete} from "./DifficultyComplete.tsx";
import { useTranslation } from "react-i18next";




type LevelResponse = {
    levelId: number;
    difficulty: number;
    number: number;
    instruction: string;
    type: string;
    imageUrl: string | null;
};

const imagePositionMap: Record<number, { position: "corner" | "center", size: "small" | "large" }> = {
    11: { position:"corner", size: "small" },
    14: { position:"corner", size: "small" },
    12: { position:"center", size: "small" },
    21: { position:"center", size: "small" },
    22: { position:"center", size: "large" },
};

export function Game() {
    const {difficulty} = useParams();
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig];
    const difficultyId = difficulty ? difficultyMap[difficulty] : undefined;

    const [levels, setLevels] = useState<LevelResponse[] | null>(null);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [runId, setRunId] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [difficultyComplete, setDifficultyComplete] = useState(false);
    const { t } = useTranslation();


    useEffect(() => {
        if (!difficultyId) return;
        setLevels(null);
        setDifficultyComplete(false);
        api.get<LevelResponse[]>(`/api/difficulties/${difficultyId}/levels`)
            .then((r) => {
                console.log(r.data);
                setLevels(r.data);
            })
            .catch((err) => console.error(err));
    }, [difficultyId]);


    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            api.post(`api/runs/${runId}/finish`)
                .then(async r => {
                    if (r.data.status === "SUCCESS") {
                        await handleNextLevel();
                    } else {
                        setResult("FAILED");
                    }
                });
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(t => t! - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);


    useEffect(() => {
        setGameStarted(false);
        setCurrentLevelIndex(0);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);
        setDifficultyComplete(false);
    }, [difficulty]);


    if (!difficulty) {
        return (
            <main style={{padding: 24}}>
                <h1>{t('home.title')}</h1>
                <div style={{display: "flex", gap: 12, marginTop: 16}}>
                    <Link to="/game/easy">{t('nav.easy')}</Link>
                    <Link to="/game/medium">{t('nav.medium')}</Link>
                    <Link to="/game/hard">{t('nav.hard')}</Link>
                </div>
            </main>
        );
    }

    if (!difficultyId) return <Navigate to="/game" replace/>;
    if (!levels) return <main style={{padding: 24}}>{t('game.loading')}…</main>;
    if (levels.length === 0) return <main style={{padding: 24}}>{t('game.noLevels')}.</main>;

    if (difficultyComplete && difficulty) {
        return <DifficultyComplete difficulty={difficulty}/>;
    }

    const currentLevel = levels[currentLevelIndex];

    const handleStart = async () => {
        setGameStarted(true);
        const response = await api.post('/api/runs', {levelId: currentLevel.levelId});
        setRunId(response.data.runId);
        setTimeLeft(config.timer);
        setResult(null);
    };

    const handlePress = async () => {
        if (!runId) return;
        const response = await api.post(`/api/runs/${runId}/press`);
        const status = response.data.status;
        if (status === "SUCCESS") {
            await handleNextLevel();
        } else if (status === "FAILED") {
            setResult("FAILED");
        }
    };

    const handleNextLevel = async () => {
        const nextIndex = currentLevelIndex + 1;

        // All levels of this difficulty done → show complete screen
        if (nextIndex >= levels.length) {
            setRunId(null);
            setTimeLeft(null);
            setResult(null);
            setDifficultyComplete(true);
            return;
        }

        setCurrentLevelIndex(nextIndex);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);

        const nextLevel = levels[nextIndex];
        const response = await api.post('/api/runs', {levelId: nextLevel.levelId});
        setRunId(response.data.runId);
        setTimeLeft(config.timer);
    };

    const handleMouseDown = async () => {
        if (!runId) return;
        await api.post(`/api/runs/${runId}/press`);
    };

    const handleMouseUp = async () => {
        if (!runId) return;
        const response = await api.post(`/api/runs/${runId}/release`);
        const status = response.data.status;
        if (status === "SUCCESS") {
            await handleNextLevel();
        } else if (status === "FAILED") {
            setResult("FAILED");
        }
    };

    const imageConfig = imagePositionMap[currentLevel.levelId] ?? { position: "corner", size: "small" };

    return (
        <main className="game-page">
            <div className="game-box">
                <header className="nav">
                    <h1>{config.title}</h1>
                </header>

                <div className="status">
                    <div className="level">Level {currentLevel.number}</div>
                    <div className="timer">{timeLeft ?? config.timer}</div>
                </div>

                <div className={`level-visual-corner-${imageConfig.size}`}>
                    {gameStarted && currentLevel.imageUrl && imageConfig.position === "corner" && (
                        <img
                            src={`/src/assets/images/${currentLevel.imageUrl}`}
                            alt=""
                            draggable={false}
                        />
                    )}
                </div>

                <div className="center">
                    {!gameStarted && (
                        <button onClick={handleStart}>{t('game.start')}</button>
                    )}

                    {gameStarted && result === null && (
                        <button
                            className={`circle-button ${difficulty}`}
                            onClick={currentLevel.type !== "HOLD" ? handlePress : undefined}
                            onMouseDown={currentLevel.type === "HOLD" ? handleMouseDown : undefined}
                            onMouseUp={currentLevel.type === "HOLD" ? handleMouseUp : undefined}
                            disabled={currentLevel.type === "READ_ONLY"}
                        >
                            {currentLevel.instruction}
                            {currentLevel.imageUrl && imageConfig.position === "center" && (
                                <div className={`level-visual-center-${imageConfig.size}`}>
                                    <img
                                        src={`/src/assets/images/${currentLevel.imageUrl}`}
                                        alt=""
                                        draggable={false}
                                    />
                                </div>
                            )}
                        </button>
                    )}

                    {result === "FAILED" && (
                        <p>❌ {t('game.gameOver')}!</p>
                    )}
                </div>
            </div>
        </main>
    );
}
