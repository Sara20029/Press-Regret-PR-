import { useState } from "react";
import "./Setting.css";

export default function Setting() {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [difficulty, setDifficulty] = useState("medium");
    const [language, setLanguage] = useState("de");

    const handleSave = () => {
        alert("Einstellungen wurden gespeichert.");
    };

    return (
        <div className="settings-page">
            <div className="settings-card">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">
                    Passe hier deine Spieleinstellungen an.
                </p>

                <div className="settings-section">
                    <h2>Profil</h2>
                    <div className="setting-item">
                        <label htmlFor="username">Benutzername</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Dein Name"
                            className="settings-input"
                        />
                    </div>
                </div>

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
                        <input
                            id="darkmode"
                            type="checkbox"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                    </div>

                    <div className="setting-item">
                        <label htmlFor="difficulty">Schwierigkeit</label>
                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value)}
                            className="settings-input"
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
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

                <button className="save-button" onClick={handleSave}>
                    Einstellungen speichern
                </button>
            </div>
        </div>
    );
}