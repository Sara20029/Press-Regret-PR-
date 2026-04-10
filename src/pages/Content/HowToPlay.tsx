import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";
import "./HowToPlay.css";
import { useTranslation } from 'react-i18next';



type Content = {
    title: string;
    description: string;
    instructions: string[];
};

export default function HowToPlay() {
    const [data, setData] = useState<Content | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        api.get<Content>("/api/content/how-to-play")
            .then((r) => {
                console.log("Response:", r.data);
                setData(r.data);
            })
            .catch((err) => console.error("API Fehler:", err));
    }, []);

    if (!data) {
        return <main>{t('game.loading')}…</main>;
    }

    return (
        <main className="howToPlay-page">
            <h1>{data.title}</h1>
            <p>{data.description}</p>
            <ul style={{ marginTop: 16 }}>
                {data.instructions.map((instruction, index) => (
                    <li key={index} style={{ marginTop: 8 }}>
                        {instruction}
                    </li>
                ))}
            </ul>
        </main>
    );
}