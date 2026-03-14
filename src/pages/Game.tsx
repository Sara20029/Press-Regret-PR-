import Easy from "./Levels/Easy";
import { useEffect, useState } from "react";
import { api } from "../api/http";

type LevelResponse = {
    id: number;
    difficultyId: number;
    levelNumber: number;
    description: string;
};

export default function Game() {
    const [levels, setLevels] = useState<LevelResponse[] | null>(null);

    useEffect(() => {
        api.get<LevelResponse[]>("/api/difficulties/1/levels")
            .then((r) => {
                console.log(r.data);
                setLevels(r.data);
            })
            .catch((err) => console.error(err));
    }, []);

    if (!levels) {
        return <main style={{ padding: 24 }}>Lade…</main>;
    }

    if (levels.length === 0) {
        return <main style={{ padding: 24 }}>Keine Level gefunden.</main>;
    }

    const firstLevel = levels[0];

    return (
        <Easy
            title="Press & Regret: Easy"
            levelNumber={firstLevel.levelNumber}
            buttonText={firstLevel.description}
            timer={45}
        />
    );
}