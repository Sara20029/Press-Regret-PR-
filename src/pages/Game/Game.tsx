import "./Game.css";
import {useCallback, useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import {difficultyConfig, difficultyMap} from "../../config/difficultyConfig";
import {api} from "../../api/http.ts";
import {DifficultyComplete} from "./DifficultyComplete.tsx";
import {useTranslation} from "react-i18next";
import {useSound} from "../../context/SoundContext.tsx";
import {AchievementPopup} from "../../components/AchievementPopup.tsx";


const buttonClickSound = new Audio('/src/assets/sounds/buttonClick.mp3');
const difficultySuccessSound = new Audio('/src/assets/sounds/difficultySuccess.mp3');
const gameOverSound = new Audio('/src/assets/sounds/gameOver.wav');


type LevelResponse = {
    levelId: number;
    difficulty: number;
    number: number;
    instruction: string;
    type: string;
    imageUrl: string | null;
};

const imagePositionMap: Record<number, { position: "corner" | "center", size: "small" | "large" }> = {
    11: {position: "corner", size: "small"},
    14: {position: "corner", size: "small"},
    12: {position: "center", size: "small"},
    22: {position: "center", size: "large"},
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
    const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);
    const [completionAchievement, setCompletionAchievement] = useState<string | null>(null);
    const [prevDifficulty, setPrevDifficulty] = useState(difficulty);

    const {t} = useTranslation();
    const {soundEnabled} = useSound();

    const handleAchievement = (key: string | null) => {
        if (key) {
            setUnlockedAchievement(key);
            setTimeout(() => setUnlockedAchievement(null), 3000);
        }
    };

    const handleNextLevel = useCallback(async () => {
        const nextIndex = currentLevelIndex + 1;

        if (nextIndex >= levels!.length) {
            if (soundEnabled) void difficultySuccessSound.play();
            setCompletionAchievement(unlockedAchievement);
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

        const nextLevel = levels![nextIndex];
        const response = await api.post('/api/runs', {levelId: nextLevel.levelId});
        setRunId(response.data.runId);
        setTimeLeft(config.timer);
    }, [currentLevelIndex, levels, soundEnabled, unlockedAchievement, config.timer]);


    useEffect(() => {
        if (!difficultyId) return;
        api.get<LevelResponse[]>(`/api/difficulties/${difficultyId}/levels`)
            .then((r) => {
                setLevels(r.data);
                setDifficultyComplete(false);
            })
            .catch((err) => console.error(err));
    }, [difficultyId]);


    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            api.post(`api/runs/${runId}/finish`)
                .then(async r => {
                    if (r.data.status === "SUCCESS") {
                        handleAchievement(r.data.unlockedAchievementKey);
                        await new Promise(resolve => setTimeout(resolve, 100));
                        await handleNextLevel();
                    } else {
                        if (!result) {
                            if (soundEnabled) void gameOverSound.play();
                            setResult("FAILED");
                        }
                    }
                });
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(t => t! - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, runId, result, soundEnabled, handleNextLevel]);


    if (prevDifficulty !== difficulty) {
        setPrevDifficulty(difficulty);
        setGameStarted(false);
        setCurrentLevelIndex(0);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);
        setDifficultyComplete(false);
    }


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
        return <DifficultyComplete
            difficulty={difficulty}
            achievementKey={completionAchievement}
            onReset={() => {
                setCurrentLevelIndex(0);
                setRunId(null);
                setTimeLeft(null);
                setResult(null);
                setGameStarted(false);
                setDifficultyComplete(false);
            }}
        />;
    }


    const currentLevel = levels[currentLevelIndex];
    const imageConfig = imagePositionMap[currentLevel.levelId] ?? {position: "corner", size: "small"};

    const handleStart = async () => {
        setGameStarted(true);
        const response = await api.post('/api/runs', {levelId: currentLevel.levelId});
        setRunId(response.data.runId);
        setTimeLeft(config.timer);
        setResult(null);
    };

    const handlePress = async () => {
        if (!runId) return;
        if (soundEnabled) {
            buttonClickSound.currentTime = 0;
            void buttonClickSound.play();
        }
        const response = await api.post(`/api/runs/${runId}/press`);
        const status = response.data.status;
        if (status === "SUCCESS") {
            handleAchievement(response.data.unlockedAchievementKey);
            await new Promise(resolve => setTimeout(resolve, 100));
            await handleNextLevel();
        } else if (status === "FAILED") {
            if (!result) {
                buttonClickSound.pause();
                buttonClickSound.currentTime = 0;
                if (soundEnabled) void gameOverSound.play();
                setResult("FAILED");
            }
        }
    };

    const handleMouseDown = async () => {
        if (!runId) return;
        if (soundEnabled) void buttonClickSound.play();
        await api.post(`/api/runs/${runId}/press`);
    };

    const handleMouseUp = async () => {
        if (!runId) return;
        const response = await api.post(`/api/runs/${runId}/release`);
        const status = response.data.status;
        if (status === "SUCCESS") {
            handleAchievement(response.data.unlockedAchievementKey);
            await new Promise(resolve => setTimeout(resolve, 100));
            await handleNextLevel();
        } else if (status === "FAILED") {
            if (!result) {
                if (soundEnabled) void gameOverSound.play();
                setResult("FAILED");
            }
        }
    };

    const handleReset = () => {
        setCurrentLevelIndex(0);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);
        setGameStarted(false);
    }

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

                {unlockedAchievement && (
                    <AchievementPopup
                        achievementKey={unlockedAchievement}
                        onClose={() => setUnlockedAchievement(null)}
                    />
                )}

                <div className="center">
                    <div className="start-button">
                        {!gameStarted && (
                            <button onClick={handleStart}>{t('game.start')}</button>
                        )}
                    </div>

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
                        <div className="game-over-screen">
                            <div className="game-over-content">
                                <div className="game-over-image-container">
                                    <img
                                        src="/src/assets/images/game-over-skull.png"
                                        alt="Game Over"
                                        className="game-over-image"
                                        draggable={false}
                                    />
                                </div>

                                <h1 className="game-over-title">{t('game.gameOver')}</h1>
                                <button onClick={handleReset}>{t('game.reset')}</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
