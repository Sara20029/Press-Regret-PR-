
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
        timer: 3,
    },
};

export const nextDifficulty: Record<string, string | null> = {
    easy: "medium",
    medium: "hard",
    hard: null,
};

export const difficultyCompleteConfig: Record<string, {
    title: string;
    subtitle: string;
    emoji: string;
    nextLabel: string | null;
}> = {
    easy: {
        title: "Easy gemeistert!",
        subtitle: "Du hast alle Easy-Level geschafft. Bereit für mehr?",
        emoji: "🎉",
        nextLabel: "Weiter zu Medium",
    },
    medium: {
        title: "Medium gemeistert!",
        subtitle: "Nicht schlecht! Jetzt wird's richtig ernst.",
        emoji: "🔥",
        nextLabel: "Weiter zu Hard",
    },
    hard: {
        title: "Spiel geschafft!",
        subtitle: "Unglaublich – du hast alle Level gemeistert. Respekt!",
        emoji: "🏆",
        nextLabel: null,
    },
};