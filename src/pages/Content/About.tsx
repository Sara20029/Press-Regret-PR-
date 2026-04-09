import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";
import "./About.css";
import { useTranslation } from 'react-i18next';




type Content = { title: string; description: string };

export default function About() {
    const [data, setData] = useState<Content | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        api.get<Content>("/api/content/about").then((r) => setData(r.data));
    }, []);

    if (!data) return <main>{t('game.loading')}…</main>;

    return (
        <main className="about-page">
            <h1>{data.title}</h1>
            <p>{data.description}</p>
        </main>
    );
}