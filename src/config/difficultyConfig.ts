
// Maps difficulty names to their numeric backend IDs
export const difficultyMap: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
}

// UI and gameplay configuration per difficulty
export const difficultyConfig = {
    easy: {
        title: "Press & Regret: Easy",
        timer: 5,
    },
    medium: {
        title: "Press & Regret: Medium",
        timer: 5,
    },
    hard: {
        title: "Press & Regret: Hard",
        timer: 5,
    },
};

/**
 * Maps each difficulty to the next one for progression
 * null indicates the last difficulty (no next step)
 */
export const nextDifficulty: Record<string, string | null> = {
    easy: "medium",
    medium: "hard",
    hard: null,
};

// i18n keys, emoji and navigation config for the difficulty completion screen
export const difficultyCompleteConfig: Record<string, {
    titleKey: string;
    subtitleKey: string;
    emoji: string;
    nextLabelKey: string | null; // null if this is the last difficulty
}> = {
    easy: {
        titleKey: "difficultyComplete.easy.title",
        subtitleKey: "difficultyComplete.easy.subtitle",
        emoji: "🎉",
        nextLabelKey: "difficultyComplete.easy.nextLabel",
    },
    medium: {
        titleKey: "difficultyComplete.medium.title",
        subtitleKey: "difficultyComplete.medium.subtitle",
        emoji: "🔥",
        nextLabelKey: "difficultyComplete.medium.nextLabel",
    },
    hard: {
        titleKey: "difficultyComplete.hard.title",
        subtitleKey: "difficultyComplete.hard.subtitle",
        emoji: "🏆",
        nextLabelKey: null,
    },
};