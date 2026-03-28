import "./Achievements.css";
import {useEffect, useState} from "react";

type Achievement = {
    id: number;
    title: string;
    description: string;
    unlocked: boolean;
};

export default function Achievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/achievements")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load achievements.");
                }
                return response.json();
            })
            .then((data) => {
                setAchievements(data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load achievements.");
                setLoading(false);
            });
    }, []);

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
                <h1>Achievements</h1>
                <p>Achievements are loading...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="achievements-page">
                <h1>Achievements</h1>
                <p>{error}</p>
            </main>
        );
    }


    return (
        <main className="achievements-page">
            <section className="achievements-header">
                <h1>Achievements</h1>
                <p>Here you can see all unlocked and locked achievements.</p>
                <p>
                    Progress: {unlockedCount} / {achievements.length} ({progressPercent}
                    %)
                </p>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
            </section>

            <section className="achievements-list">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className={`achievement-card ${achievement.unlocked ? "unlocked" : "locked"}`}
                    >
                        <div className="achievement-icon">
                            {achievement.unlocked ? "🏆" : "🔒"}
                        </div>
                        <div className="achievement-content">
                            <h2>{achievement.title}</h2>
                            <p>{achievement.description}</p>
                        </div>
                    </div>
                ))}
            </section>
        </main>
    );
}

