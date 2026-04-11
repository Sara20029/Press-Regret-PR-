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
            .then((r) => setData(r.data))
            .catch((err) => console.error("API Fehler:", err));
    }, []);

    if (!data) {
        return <main>{t('game.loading')}…</main>;
    }

    return (
        <main className="howToPlay-page">
            <div className="howToPlay-box">
                <div className="howToPlay-header">
                    <span className="howToPlay-icon">🎮</span>
                    <h1 className="howToPlay-title">{t(data.title)}</h1>
                    <p className="howToPlay-desc">{t(data.description)}</p>
                </div>
                <ol className="howToPlay-list">
                    {data.instructions.map((key, index) => (
                        <li key={index} className="howToPlay-item">
                            <span className="howToPlay-number">{index + 1}</span>
                            <span>{t(key)}</span>
                        </li>
                    ))}
                </ol>
            </div>
        </main>
    );
}