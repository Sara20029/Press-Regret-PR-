
export const difficultyMap: Record<string, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
}

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

export const nextDifficulty: Record<string, string | null> = {
    easy: "medium",
    medium: "hard",
    hard: null,
};

export const difficultyCompleteConfig: Record<string, {
    titleKey: string;
    subtitleKey: string;
    emoji: string;
    nextLabelKey: string | null;
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