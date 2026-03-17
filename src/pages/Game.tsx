import Easy from "./Levels/Easy";
import Medium from "./Levels/Medium";
import Hard from "./Levels/Hard";
import { useEffect, useState } from "react";
import {useParams, Navigate} from "react-router-dom";
import { api } from "../api/http";


type LevelResponse = {
    levelId: number;
    difficulty: number;
    number: number;
    instruction: string;
};

export default function Game() {
    const { difficulty } = useParams();
    const [levels, setLevels] = useState<LevelResponse[] | null>(null);

    const difficultyMap: Record<string, number> = {
        easy: 1,
        medium: 2,
        hard: 3,
    }
    const difficultyId = difficulty ? difficultyMap[difficulty] : undefined;

    useEffect(() => {
        if(!difficultyId) return;

        setLevels(null);

        api.get<LevelResponse[]>(`/api/difficulties/${difficultyId}/levels`)
            .then((r) => {
                console.log(r.data);
                setLevels(r.data);
            })
            .catch((err) => console.error(err));
    }, [difficultyId]);

    if(!difficultyId){
        return <Navigate to="/game/easy" replace />;
    }

    if (!levels) {
        return <main style={{ padding: 24 }}>Lade…</main>;
    }

    if (levels.length === 0) {
        return <main style={{ padding: 24 }}>Keine Level gefunden.</main>;
    }

    const firstLevel = levels[0];

    if(difficulty === "easy"){
        return(
            <Easy title={"Press & Regret: Easy"}
                  levelNumber={firstLevel.number}
                  buttonText={firstLevel.instruction}
                  timer={45}
            />
        );
    }
    if(difficulty === "medium"){
        return(
            <Medium title={"Press & Regret: Medium"}
                  levelNumber={firstLevel.number}
                  buttonText={firstLevel.instruction}
                  timer={30}
            />
        );
    }
    if(difficulty === "hard"){
        return(
            <Hard title={"Press & Regret: Hard"}
                  levelNumber={firstLevel.number}
                  buttonText={firstLevel.instruction}
                  timer={15}
            />
        );
    }

    return <Navigate to="/game/easy" replace />;
}