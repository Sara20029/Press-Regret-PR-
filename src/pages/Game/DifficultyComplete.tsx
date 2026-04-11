import { useNavigate } from "react-router-dom";
import { nextDifficulty, difficultyCompleteConfig } from "../../config/difficultyConfig";
import { useTranslation } from 'react-i18next';
import { AchievementPopup } from "../../components/AchievementPopup.tsx";
import "./DifficultyComplete.css"

type Props = {
    difficulty: string;
    achievementKey?: string | null;
    onReset: () => void;
};

export function DifficultyComplete({ difficulty, achievementKey, onReset }: Props) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const completeConfig = difficultyCompleteConfig[difficulty];
    const next = nextDifficulty[difficulty];

    return (
        <main className="game-page">
            {achievementKey && (
                <AchievementPopup achievementKey={achievementKey} onClose={() => {}}/>
            )}
            <div className="complete-screen">
                <div className="complete-emoji">{completeConfig.emoji}</div>
                <h1 className="complete-title">{t(completeConfig.titleKey)}</h1>
                <p className="complete-subtitle">{t(completeConfig.subtitleKey)}</p>

                <div className="complete-buttons">
                    {next && (
                        <button className="complete-btn complete-btn-primary" onClick={() => navigate(`/game/${next}`)}>
                            {t(completeConfig.nextLabelKey!)}
                        </button>
                    )}

                    {!next && (
                        <button className="complete-btn complete-btn-primary" onClick={() => navigate("/game")}>
                            {t('difficultyComplete.backToHome')}
                        </button>
                    )}
                    <button className="complete-btn complete-btn-secondary" onClick={onReset}>
                        {t('game.reset')}
                    </button>
                </div>
            </div>
        </main>
    );
}