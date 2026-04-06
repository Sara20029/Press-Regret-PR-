import {useEffect, useState} from "react";
import "./Setting.css";
import {api} from "../../api/http.ts";

export function Setting() {
    const [theme, setThemeMode] = useState("dark");
    const [language, setLanguage] = useState("de");
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        api.get('/api/settings')
            .then(r => {
                setThemeMode(r.data.theme);
                setLanguage(r.data.language);
                setSoundEnabled(r.data.soundEnabled);
            });
    }, []);

    async function handleSave() {
        await api.put('/api/settings', {
            theme,
            language,
            soundEnabled,
        });
        setSaved(true);
    }



    return (
        <div className="settings-page">
            <div className="settings-card">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">
                    Passe hier deine Spieleinstellungen an.
                </p>

                <div className="settings-section">
                    <h2>Gameplay</h2>

                    <div className="setting-item row">
                        <label htmlFor="sound">Sound</label>
                        <input
                            id="sound"
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={() => setSoundEnabled(!soundEnabled)}
                        />
                    </div>

                    <div className="setting-item row">
                        <label htmlFor="darkmode">Dark Mode</label>
                        <select
                            value={theme}
                            onChange={(e) => setThemeMode(e.target.value)}
                            className="settings-input"
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>

                    <div className="setting-item">
                        <label htmlFor="language">Sprache</label>
                        <select
                            id="language"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="settings-input"
                        >
                            <option value="de">Deutsch</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>
                {saved && <p>✅ Einstellungen gespeichert!</p>}
                <button className="save-button" onClick={() => handleSave()}>
                    Einstellungen speichern
                </button>
            </div>
        </div>
    );
}