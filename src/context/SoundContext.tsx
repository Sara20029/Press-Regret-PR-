import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/http.ts";

type SoundContextType = {
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
};

export const SoundContext = createContext<SoundContextType>({
    soundEnabled: true,
    setSoundEnabled: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [soundEnabled, setSoundEnabled] = useState(true);

    useEffect(() => {
        api.get('/api/settings')
            .then(r => setSoundEnabled(r.data.soundEnabled));
    }, []);

    return (
        <SoundContext.Provider value={{ soundEnabled, setSoundEnabled }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSound() {
    return useContext(SoundContext);
}