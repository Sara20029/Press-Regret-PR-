import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/http.ts";

// Shape of the theme context value
type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
};

/**
 * Context providing global theme state across the app
 * Default is "dark" before the backend setting is loaded
 */
export const ThemeContext = createContext<ThemeContextType>({
    theme: "dark",
    setTheme: () => {},
});

/**
 * Provider that loads the theme from the backend on mount
 * and applies it as a CSS class on document.body
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        api.get('/api/settings')
            .then(r => setTheme(r.data.theme))
            .catch(err => console.error("Failed to load theme settings:", err));
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

// Hook for accessing and changing the current theme from any component
export function useTheme() {
    return useContext(ThemeContext);
}