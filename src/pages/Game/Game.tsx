import "./Game.css";
import {useCallback, useEffect, useRef, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import {difficultyConfig, difficultyMap} from "../../config/difficultyConfig";
import {api} from "../../api/http.ts";
import {DifficultyComplete} from "./DifficultyComplete.tsx";
import {useTranslation} from "react-i18next";
import {useSound} from "../../context/SoundContext.tsx";
import {AchievementPopup} from "../../components/AchievementPopup.tsx";


// Shape of a level returned by the backend
type LevelResponse = {
    levelId: number;
    difficulty: number;
    number: number;
    instruction: string;
    type: string;
    imageUrl: string | null;
};

// Maps specific level IDs to their image display position and size
const imagePositionMap: Record<number, { position: "corner" | "center", size: "small" | "large" }> = {
    11: {position: "corner", size: "small"},
    14: {position: "corner", size: "small"},
    12: {position: "center", size: "small"},
    22: {position: "center", size: "large"},
};

/**
 * Main game component managing the full game loop
 * Fetches levels from the backend, handles timer countdown, button interactions and level progression.
 */
export function Game() {
    const {difficulty} = useParams();
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig];
    const difficultyId = difficulty ? difficultyMap[difficulty] : undefined;

    // Game state
    const [levels, setLevels] = useState<LevelResponse[] | null>(null);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [runId, setRunId] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [gameStarted, setGameStarted] = useState(false);
    const [difficultyComplete, setDifficultyComplete] = useState(false);
    const [unlockedAchievement, setUnlockedAchievement] = useState<string | null>(null);
    const [completionAchievement, setCompletionAchievement] = useState<string | null>(null);
    const [prevDifficulty, setPrevDifficulty] = useState(difficulty);

    // Sound effects for game interactions
    const buttonClickSound = useRef(new Audio('/src/assets/sounds/buttonClick.mp3'));
    const difficultySuccessSound = useRef(new Audio('/src/assets/sounds/difficultySuccess.mp3'));
    const gameOverSound = useRef(new Audio('/src/assets/sounds/gameOver.wav'));

    const {t} = useTranslation();
    const {soundEnabled} = useSound();

    // Shows the achievement popup briefly, then hides it after 3 seconds.
    const handleAchievement = useCallback((key: string | null) => {
        if (key) {
            setUnlockedAchievement(key);
            setTimeout(() => setUnlockedAchievement(null), 3000);
        }
    }, []);


    // Advances to the next level or triggers the difficulty completion screen, if all levels have been completed
    const handleNextLevel = useCallback(async (achievementKey: string | null = null) => {
        const nextIndex = currentLevelIndex + 1;

        if (nextIndex >= levels!.length) {
            if (soundEnabled) void difficultySuccessSound.current.play();
            setCompletionAchievement(unlockedAchievement);
            setRunId(null);
            setTimeLeft(null);
            setResult(null);

            // Wait for achievement popup to finish before showing completion screen
            if (achievementKey) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            setDifficultyComplete(true);
            return;
        }

        // Move to next level
        setCurrentLevelIndex(nextIndex);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);

        const nextLevel = levels![nextIndex];
        const response = await api.post('/api/runs', {levelId: nextLevel.levelId});
        setRunId(response.data.runId);
        setTimeLeft(config.timer);
    }, [currentLevelIndex, levels, soundEnabled, unlockedAchievement, config.timer]);


    // Get levels for the current difficulty on difficulty change
    useEffect(() => {
        if (!difficultyId) return;
        api.get<LevelResponse[]>(`/api/difficulties/${difficultyId}/levels`)
            .then((r) => {
                setLevels(r.data);
                setDifficultyComplete(false);
            })
            .catch((err) => console.error(err));
    }, [difficultyId]);


    // Countdown timer. Calls finish endpoint when time runs out. Sound for game over screen
    useEffect(() => {
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            const finish = async () => {
                const r = await api.post(`/api/runs/${runId}/finish`);
                if (r.data.status === "SUCCESS") {
                    const key = r.data.unlockedAchievementKey ?? null;
                    handleAchievement(key);
                    await handleNextLevel(key);
                } else {
                    if (!result) {
                        if (soundEnabled) void gameOverSound.current.play();
                        setResult("FAILED");
                    }
                }
            };
            void finish();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(t => t! - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, runId, result, soundEnabled, handleNextLevel]);


    // Reset game state when difficulty changes
    if (prevDifficulty !== difficulty) {
        setPrevDifficulty(difficulty);
        setGameStarted(false);
        setCurrentLevelIndex(0);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);
        setDifficultyComplete(false);
    }

    // Fallback if no difficulty is selected
    if (!difficulty) {
        return (
            <main className="game-fallback">
                <h1>{t('home.title')}</h1>
                <div className="game-fallback-links">
                    <Link to="/game/easy">{t('nav.easy')}</Link>
                    <Link to="/game/medium">{t('nav.medium')}</Link>
                    <Link to="/game/hard">{t('nav.hard')}</Link>
                </div>
            </main>
        );
    }

    if (!difficultyId) return <Navigate to="/game" replace/>;
    if (!levels) return <main className="game-fallback">{t('game.loading')}…</main>;
    if (levels.length === 0) return <main className="game-fallback">{t('game.noLevels')}.</main>;

    if (difficultyComplete && difficulty) {
        return <DifficultyComplete
            difficulty={difficulty}
            achievementKey={completionAchievement}
            onReset={() => {
                setCurrentLevelIndex(0);
                setRunId(null);
                setTimeLeft(null);
                setResult(null);
                setGameStarted(false);
                setDifficultyComplete(false);
            }}
        />;
    }


    const currentLevel = levels[currentLevelIndex];
    // Use configured image position if defined, otherwise default to corner/small
    const imageConfig = imagePositionMap[currentLevel.levelId] ?? {position: "corner", size: "small"};

    // Starts a new run for the current level and initializes the timer
    const handleStart = async () => {
        setGameStarted(true);
        const response = await api.post('/api/runs', {levelId: currentLevel.levelId});
        setRunId(response.data.runId);
        setTimeLeft(config.timer);
        setResult(null);
    };

    // Handles a button click for standard (non-HOLD) level types.
    const handlePress = async () => {
        if (!runId) return;
        if (soundEnabled) {
            buttonClickSound.current.currentTime = 0;
            void buttonClickSound.current.play();
        }
        const response = await api.post(`/api/runs/${runId}/press`);
        const status = response.data.status;
        if (status === "SUCCESS") {
            const key = response.data.unlockedAchievementKey ?? null;
            handleAchievement(key);
            await new Promise(resolve => setTimeout(resolve, 100));
            await handleNextLevel(key);
        } else if (status === "FAILED") {
            if (!result) {
                buttonClickSound.current.pause();
                buttonClickSound.current.currentTime = 0;
                if (soundEnabled) void gameOverSound.current.play();
                setResult("FAILED");
            }
        }
    };

    // Registers the start of a button hold (used for HOLD-type levels)
    const handleMouseDown = async () => {
        if (!runId) return;
        if (soundEnabled) void buttonClickSound.current.play();
        await api.post(`/api/runs/${runId}/press`);
    };

    // Registers the release of a button hold (used for HOLD-type levels)
    const handleMouseUp = async () => {
        if (!runId) return;
        const response = await api.post(`/api/runs/${runId}/release`);
        const status = response.data.status;
        if (status === "SUCCESS") {
            const key = response.data.unlockedAchievementKey ?? null;
            handleAchievement(key);
            await new Promise(resolve => setTimeout(resolve, 100));
            await handleNextLevel(key);
        } else if (status === "FAILED") {
            if (!result) {
                if (soundEnabled) void gameOverSound.current.play();
                setResult("FAILED");
            }
        }
    };

    // Resets the game to the initial state for replaying
    const handleReset = () => {
        setCurrentLevelIndex(0);
        setRunId(null);
        setTimeLeft(null);
        setResult(null);
        setGameStarted(false);
    };

    // Level-Design for the 3 difficulties
    return (
        <main className="game-page">
            <div className="game-box">
                <header className="nav">
                    <h1>{config.title}</h1>
                </header>

                <section className="status">
                    <span className="level">Level {currentLevel.number}</span>
                    <div className="timer">{timeLeft ?? config.timer}</div>
                </section>

                {/* Corner image displayed for certain levels*/}
                <div className={`level-visual-corner-${imageConfig.size}`}>
                    {gameStarted && currentLevel.imageUrl && imageConfig.position === "corner" && (
                        <img
                            src={`/src/assets/images/${currentLevel.imageUrl}`}
                            alt={currentLevel.imageUrl?.replace('.png', '') ?? ''}
                            draggable={false}
                        />
                    )}
                </div>

                {unlockedAchievement && (
                    <AchievementPopup
                        achievementKey={unlockedAchievement}
                        onClose={() => setUnlockedAchievement(null)}
                    />
                )}

                <div className="center">
                    <div className="start-button">
                        {!gameStarted && (
                            <button onClick={handleStart}>{t('game.start')}</button>
                        )}
                    </div>

                    {/* Main game button, behavior changes based on level type*/}
                    {gameStarted && result === null && (
                        <button
                            className={`circle-button ${difficulty}`}
                            onClick={currentLevel.type !== "HOLD" ? handlePress : undefined}
                            onMouseDown={currentLevel.type === "HOLD" ? handleMouseDown : undefined}
                            onMouseUp={currentLevel.type === "HOLD" ? handleMouseUp : undefined}
                            disabled={currentLevel.type === "READ_ONLY"}
                        >
                            {currentLevel.instruction}
                            {/* Center image displayed inside the button for certain levels*/}
                            {currentLevel.imageUrl && imageConfig.position === "center" && (
                                <div className={`level-visual-center-${imageConfig.size}`}>
                                    <img
                                        src={`/src/assets/images/${currentLevel.imageUrl}`}
                                        alt={currentLevel.imageUrl?.replace('.png', '') ?? ''}
                                        draggable={false}
                                    />
                                </div>
                            )}
                        </button>
                    )}

                    {result === "FAILED" && (
                        <section className="game-over-screen">
                            <div className="game-over-content">
                                <div className="game-over-image-container">
                                    <img
                                        src="/src/assets/images/game-over-skull.png"
                                        alt="Game Over"
                                        className="game-over-image"
                                        draggable={false}
                                    />
                                </div>

                                <h1 className="game-over-title">{t('game.gameOver')}</h1>
                                <div className="reset-button">
                                    <button  onClick={handleReset}>{t('game.reset')}</button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    );
}