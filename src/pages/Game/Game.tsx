import "./Game.css";
import {useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import {api} from "../../api/http.ts";


type LevelResponse = {
    levelId: number;
    difficulty: number;
    number: number;
    instruction: string;
    type: string;
};

const difficultyMap: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
}

const difficultyConfig = {
    easy: {
        title: "Press & Regret: Easy",
        timer: 8,
    },
    medium: {
        title: "Press & Regret: Medium",
        timer: 5,
    },
    hard: {
        title: "Press & Regret: Hard",
        timer: 3,
    },
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

    useEffect(() => {
        if (!difficultyId) return;
        setLevels(null);
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
                .then(r => setResult(r.data.status));
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(t => t! - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    useEffect(() => {
        if (result === "SUCCESS") {
            void handleNextLevel();
        }
    }, [result]);

    useEffect(() => {
        setGameStarted(false);
        setCurrentLevelIndex(0);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);
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
        setResult(response.data.status);
    };

    const handleNextLevel = async () => {
        setCurrentLevelIndex(i => i + 1);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);

        const nextLevel = levels[currentLevelIndex + 1];
        const response = await api.post('/api/runs', {levelId: nextLevel.levelId});
        setRunId(response.data.runId);
        setTimeLeft(config.timer);
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
                        <button className={`circle-button ${difficulty}`} onClick={handlePress}>
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
