import "./Game.css";
import {useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import {api} from "../../api/http.ts";


type LevelResponse = {
    levelId: number;
    difficulty: number;
    number: number;
    instruction: string;
};

const difficultyMap: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
}

const difficultyConfig = {
    easy: {
        title: "Press & Regret: Easy",
        timer: 45,
    },
    medium: {
        title: "Press & Regret: Medium",
        timer: 30,
    },
    hard: {
        title: "Press & Regret: Hard",
        timer: 15,
    },
};

export default function Game() {
    const {difficulty} = useParams();
    const [levels, setLevels] = useState<LevelResponse[] | null>(null);

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


    const difficultyId = difficulty ? difficultyMap[difficulty] : undefined;

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

    if (!difficultyId) {
        return <Navigate to="/game" replace/>;
    }

    if (!levels) {
        return <main style={{padding: 24}}>Lade…</main>;
    }

    if (levels.length === 0) {
        return <main style={{padding: 24}}>Keine Level gefunden.</main>;
    }

    const firstLevel = levels[0];
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig];

    return (
        <main className="game-page">
            <div className="game-box">
                <header className="nav">
                    <h1>{config.title}</h1>
                </header>

                <div className="status">
                    <div className="level">Level {firstLevel.number}</div>
                    <div className="timer">{config.timer}</div>
                </div>

                <div className="center">
                    <button className={`circle-button ${difficulty}`}>
                        {firstLevel.instruction}
                    </button>
                </div>
            </div>
        </main>
    );
}
