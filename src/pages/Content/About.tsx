import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";
import "./About.css";
import { useTranslation } from 'react-i18next';

type Content = { title: string; description: string };

export default function About() {
    const [data, setData] = useState<Content | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        api.get<Content>("/api/content/about")
            .then((r) => setData(r.data))
            .catch((err) => console.error("Failed to load about:", err));
    }, []);

    if (!data) return <main>{t('game.loading')}…</main>;

    return (
        <main className="about-page">
            <div className="about-box">
                <div className="about-header">
                    <span className="about-icon">🎮</span>
                    <h1 className="about-title">{t(data.title)}</h1>
                    <p className="about-desc">{t(data.description)}</p>
                </div>

                <div className="about-team-section">
                    <h2 className="about-team-label">{t('about.team')}</h2>
                    <div className="about-team">
                        <article className="about-member">
                            <div className="about-avatar">S</div>
                            <span className="about-member-name">{t('about.Sara')}</span>
                            <span className="about-member-role">{t('about.role')}</span>
                        </article>
                        <div className="about-member">
                            <div className="about-avatar">E</div>
                            <span className="about-member-name">{t('about.Emily')}</span>
                            <span className="about-member-role">{t('about.role')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}