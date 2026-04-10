import { useNavigate } from "react-router-dom";
import { nextDifficulty, difficultyCompleteConfig } from "../../config/difficultyConfig";
import { useTranslation } from 'react-i18next';



type Props = {
    difficulty: string;
};

export function DifficultyComplete({ difficulty }: Props) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const completeConfig = difficultyCompleteConfig[difficulty];
    const next = nextDifficulty[difficulty];

    return (
        <main className="game-page">
            <div className="game-box complete-screen">
                <div className="complete-emoji">{completeConfig.emoji}</div>
                <h1 className="complete-title">{completeConfig.title}</h1>
                <p className="complete-subtitle">{completeConfig.subtitle}</p>

                {next ? (
                    <button className="complete-btn" onClick={() => navigate(`/game/${next}`)}>
                        {completeConfig.nextLabel}
                    </button>
                ) : (
                    <button className="complete-btn" onClick={() => navigate("/game")}>
                        {t('settings.subtitle')}
                    </button>
                )}
            </div>
        </main>
    );
}