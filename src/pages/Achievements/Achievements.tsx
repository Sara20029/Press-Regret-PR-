import "./Achievements.css";
import {useEffect, useState} from "react";
import {api} from "../../api/http.ts";
import { useTranslation } from "react-i18next";
import * as React from "react";

// Shape of a single achievement returned by the backend
type Achievement = {
    id: number;
    key: string;
    title: string;
    description: string;
    unlocked: boolean;
};

/**
 * Achievements page displaying all available achievements with their unlock status
 * Shows a progress bar and a card for each achievement
 */
export function Achievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { t } = useTranslation();

    useEffect(() => {
        api.get<Achievement[]>('/api/achievements')
            .then(r => {
                setAchievements(r.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load achievements.");
                setLoading(false);
            });
    }, []);

    // Calculates progress for the progress bar
    const unlockedCount = achievements.filter(
        (achievement) => achievement.unlocked
    ).length;

    const progressPercent =
        achievements.length > 0
            ? Math.round((unlockedCount / achievements.length) * 100)
            : 0;

    if (loading) {
        return (
            <main className="achievements-page">
                <h1>{t('achievements.title')}</h1>
                <p>{t('achievements.loading')}</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="achievements-page">
                <h1>{t('achievements.title')}</h1>
                <p>{error}</p>
            </main>
        );
    }


    return (
        <main className="achievements-page">
            <section className="achievements-header">
                <h1>{t('achievements.title')}</h1>
                <p>{t('achievements.subtitle')}</p>

                {/*Progress counter and bar*/}
                <p>
                    {t('achievements.subtitle')}: {unlockedCount} / {achievements.length} ({progressPercent}
                    %)
                </p>

                <div className="progress-bar">
                    {/*Width is set dynamically via CSS custom property*/}
                    <div
                        className="progress-fill"
                        style={{ '--progress': `${progressPercent}%` } as React.CSSProperties}
                    ></div>
                </div>
            </section>

            {/*Achievement cards. Unlocked cards show a trophy, locked one show a lock*/}
            <section className="achievements-list">
                {achievements.map((achievement) => (
                    <article
                        key={achievement.id}
                        className={`achievement-card ${achievement.unlocked ? "unlocked" : "locked"}`}
                    >
                        <div className="achievement-icon">
                            {achievement.unlocked ? "🏆" : "🔒"}
                        </div>
                        <div className="achievement-content">
                            <h2>{t(`achievements.${achievement.key}.title`)}</h2>
                            <p>{t(`achievements.${achievement.key}.description`)}</p>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    );
}

