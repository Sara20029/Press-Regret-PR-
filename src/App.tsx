import {BrowserRouter, Routes, Route, NavLink, Navigate} from "react-router-dom";
import {Game} from "./pages/Game/Game.tsx";
import About from "./pages/Content/About.tsx";
import HowToPlay from "./pages/Content/HowToPlay.tsx";
import Contact from "./pages/Content/Contact.tsx";
import Home from "./pages/Home/Home.tsx";
import Feedback from "./pages/Feedback/Feedback.tsx";
import {Achievements} from "./pages/Achievements/Achievements.tsx";
import {Setting} from "./pages/Setting/Setting.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { useTranslation } from 'react-i18next';

import "./App.css";
import {SoundProvider} from "./context/SoundContext.tsx";

/**
 * Global navigation bar rendered on every page
 * Uses NavLink to automatically highlight the active route
 */
function Nav() {
    const { t } = useTranslation();
    return (
        <header className="nav-wrapper">
            <nav className="nav">
                {/* Difficulty navigation*/}
                <NavLink to="/game" end>{t('nav.home')}</NavLink>
                <NavLink to="/game/easy">{t('nav.easy')}</NavLink>
                <NavLink to="/game/medium">{t('nav.medium')}</NavLink>
                <NavLink to="/game/hard">{t('nav.hard')}</NavLink>

                {/*Content pages*/}
                <NavLink to="/content/how-to-play">{t('nav.howToPlay')}</NavLink>
                <NavLink to="/content/about">{t('nav.about')}</NavLink>
                <NavLink to="/content/contact">{t('nav.contact')}</NavLink>

                {/*Other pages*/}
                <NavLink to="/feedback">{t('nav.feedback')}</NavLink>
                <NavLink to="/achievements">{t('nav.achievements')}</NavLink>
                <NavLink to="/setting">{t('nav.setting')}</NavLink>
            </nav>
        </header>
    );
}

/**
 * Root application component
 * Wraps the app in Themeprovider and Soundprovider for global state, and defines all client-side routes
 */
export default function App() {
    return (
        <ThemeProvider>
            <SoundProvider>
                <BrowserRouter>
                    <div className="app-layout">
                        <Nav />
                        <main className="page-content">
                            <Routes>
                                {/*Redirect root to game home*/}
                                <Route path="/" element={<Navigate to="/game" replace />} />

                                {/* Game routes*/}
                                <Route path="/game" element={<Home />} />
                                <Route path="/game/:difficulty" element={<Game />} />

                                {/*Content pages*/}
                                <Route path="/content/about" element={<About />} />
                                <Route path="/content/how-to-play" element={<HowToPlay />} />
                                <Route path="/content/contact" element={<Contact />} />

                                {/*Other pages*/}
                                <Route path="/feedback" element={<Feedback />} />
                                <Route path="/achievements" element={<Achievements />} />
                                <Route path="/setting" element={<Setting />} />
                            </Routes>
                        </main>
                    </div>
                </BrowserRouter>
            </SoundProvider>
        </ThemeProvider>
    );
}