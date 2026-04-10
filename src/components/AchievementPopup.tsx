import { useTranslation } from "react-i18next";
import "./AchievementPopup.css";

type Props = {
    achievementKey: string;
    onClose: () => void;
};

export function AchievementPopup({ achievementKey, onClose }: Props) {
    const { t } = useTranslation();

    return (
        <div className="achievement-popup" onClick={onClose}>
            <div className="achievement-popup-icon">🏆</div>
            <div className="achievement-popup-content">
                <p className="achievement-popup-label">{t('popup.unlocked')}</p>
                <p className="achievement-popup-title">{t(`achievements.${achievementKey}.title`)}</p>
            </div>
        </div>
    );
}