import "./Game.css";
import {useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import { difficultyMap, difficultyConfig } from "../../config/difficultyConfig";
import {api} from "../../api/http.ts";
import {DifficultyComplete} from "./DifficultyComplete.tsx";


type LevelResponse = {
    levelId: number;
    difficulty: number;
    number: number;
    instruction: string;
    type: string;
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
                <h1>Wähle eine Schwierigkeit</h1>
                <div style={{display: "flex", gap: 12, marginTop: 16}}>
                    <Link to="/game/easy">Easy</Link>
                    <Link to="/game/medium">Medium</Link>
                    <Link to="/game/hard">Hard</Link>
                </div>
            </main>
        );
    }

    if (!difficultyId) return <Navigate to="/game" replace/>;
    if (!levels) return <main style={{padding: 24}}>Lade…</main>;
    if (levels.length === 0) return <main style={{padding: 24}}>Keine Level gefunden.</main>;

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

                <div className="center">
                    {!gameStarted && (
                        <button onClick={handleStart}>Start</button>
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
                        </button>
                    )}

                    {result === "FAILED" && (
                        <p>❌ Verloren!</p>
                    )}
                </div>
            </div>
        </main>
    );
}
