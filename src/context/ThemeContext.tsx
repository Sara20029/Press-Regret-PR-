import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/http.ts";

type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        api.get('/api/settings')
            .then(r => setTheme(r.data.theme));
    }, []);

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}