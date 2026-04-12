import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/http.ts";

// Shape of the sound context value
type SoundContextType = {
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
};

/**
 * Context providing global sound enabled/disabled state across the app
 * Default is true (sound on) before the backend setting is loaded
 */
export const SoundContext = createContext<SoundContextType>({
    soundEnabled: true,
    setSoundEnabled: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        api.get('/api/settings')
            .then(r => setSoundEnabled(r.data.soundEnabled))
            .catch(err => console.error("Failed to load sound settings:", err));
    }, []);

    return (
        <SoundContext.Provider value={{ soundEnabled, setSoundEnabled }}>
            {children}
        </SoundContext.Provider>
    );
}

// Hook for accessing and toggling sound state from any component
export function useSound() {
    return useContext(SoundContext);
}