import {useEffect, useState} from "react";
import "./Setting.css";
import {api} from "../../api/http.ts";
import { useTheme } from "../../context/ThemeContext.tsx";
import {useSound} from "../../context/SoundContext.tsx";
import { useTranslation } from "react-i18next";
import i18n from '../../i18n.ts';

/**
 * Settings page allowing the player to configure theme, language and sound
 * Load current settings from the backend on mount and saves changes on submit
 */
export function Setting() {
    // Local state mirrors the backend settings before saving
    const [theme, setThemeMode] = useState("dark");
    const [language, setLanguage] = useState("en");
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [saved, setSaved] = useState(false);

    // Global context setters to apply changes app-wide immediately on save
    const { setTheme: setGlobalTheme } = useTheme();
    const { setSoundEnabled: setGlobalSound } = useSound();
    const { t } = useTranslation();

    // Fetches current settings from the backend and initializes local state
    useEffect(() => {
        api.get('/api/settings')
            .then(r => {
                setThemeMode(r.data.theme);
                setLanguage(r.data.language);
                setSoundEnabled(r.data.soundEnabled);
                void i18n.changeLanguage(r.data.language);
            })
            .catch(err => console.error("Failed to load settings:", err));
    }, []);

    /**
     * Saves the current settings to the backend and updates global app state.
     * Also changes the active i18n language immediately.
     */
    async function handleSave() {
        await api.put('/api/settings', { theme, language, soundEnabled });
        setGlobalTheme(theme);
        setGlobalSound(soundEnabled);
        void i18n.changeLanguage(language);
        setSaved(true);
    }

    return (
        <div className="settings-page">
            <div className="settings-card">
                <h1 className="settings-title">{t('settings.title')}</h1>
                <p className="settings-subtitle">{t('settings.subtitle')}.</p>

                <div className="settings-section">
                    <h2>{t('settings.section')}</h2>

                    <div className="setting-item row">
                        <label htmlFor="sound">{t('settings.sound')}</label>
                        <input
                            id="sound"
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={() => setSoundEnabled(!soundEnabled)}
                        />
                    </div>

                    <div className="setting-item row">
                        <label htmlFor="themeMode">{t('settings.themeMode')}</label>
                        <select
                            value={theme}
                            onChange={(e) => setThemeMode(e.target.value)}
                            className="settings-input"
                        >
                            <option value="dark">{t('settings.dark')}</option>
                            <option value="light">{t('settings.light')}</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <label htmlFor="language">{t('settings.language')}</label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="settings-input"
                        >
                            <option value="de">{t('settings.de')}</option>
                            <option value="en">{t('settings.en')}</option>
                        </select>
                    </div>
                </div>

                {/* Success message shown after saving*/}
                {saved && <p>✅ {t('settings.saved')}</p>}

                <button className="save-button" onClick={ handleSave }>
                    {t('settings.save')}
                </button>
            </div>
        </div>
    );
}