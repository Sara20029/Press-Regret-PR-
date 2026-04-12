import { useNavigate } from "react-router-dom";
import { nextDifficulty, difficultyCompleteConfig } from "../../config/difficultyConfig";
import { useTranslation } from 'react-i18next';
import { AchievementPopup } from "../../components/AchievementPopup.tsx";
import "./DifficultyComplete.css"

// Props for the DifficultyComplete component
type Props = {
    difficulty: string;
    achievementKey?: string | null;
    onReset: () => void;
};

/**
 * Screen displayed after all levels of a difficulty have been completed
 * Shows a congratulation message and offers navigation to the next difficulty or a reset.
 */
export function DifficultyComplete({ difficulty, achievementKey, onReset }: Props) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const completeConfig = difficultyCompleteConfig[difficulty];

    // null if this is the last difficulty (hard)
    const next = nextDifficulty[difficulty];

    return (
        <main className="game-page">
            {/* Shows achievement popup if one was unlocked on completion*/}
            {achievementKey && (
                <AchievementPopup achievementKey={achievementKey} onClose={() => {}}/>
            )}
            <section className="complete-screen">
                <div className="complete-emoji">{completeConfig.emoji}</div>
                <h1 className="complete-title">{t(completeConfig.titleKey)}</h1>
                <p className="complete-subtitle">{t(completeConfig.subtitleKey)}</p>

                <div className="complete-buttons">
                    {/*Navigate to next difficulty if available*/}
                    {next && (
                        <button className="complete-btn complete-btn-primary" onClick={() => navigate(`/game/${next}`)}>
                            {t(completeConfig.nextLabelKey!)}
                        </button>
                    )}

                    {/*If no next difficulty, go back to home*/}
                    {!next && (
                        <button className="complete-btn complete-btn-primary" onClick={() => navigate("/game")}>
                            {t('difficultyComplete.backToHome')}
                        </button>
                    )}
                    <button className="complete-btn complete-btn-secondary" onClick={onReset}>
                        {t('game.reset')}
                    </button>
                </div>
            </section>
        </main>
    );
}