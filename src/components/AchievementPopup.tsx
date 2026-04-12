import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./AchievementPopup.css";

// Props for the AchievementPopup component
type Props = {
    achievementKey: string;
    onClose: () => void;
};

/**
 * Popup displayed briefly when a new achievement is unlocked
 * Auto-Dismiss after 3 seconds or when clicked
 * Re-triggers the timer if a new achievement key is passed
 */
export function AchievementPopup({ achievementKey, onClose }: Props) {
    const { t } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [achievementKey, onClose]);

    return (
        <aside className="achievement-popup" onClick={onClose}>
            <div className="achievement-popup-icon">🏆</div>
            <div className="achievement-popup-content">
                <p className="achievement-popup-label">{t('popup.unlocked')}</p>
                <p className="achievement-popup-title">{t(`achievements.${achievementKey}.title`)}</p>
            </div>
        </aside>
    );
}