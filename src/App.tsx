import {BrowserRouter, Routes, Route, NavLink, Navigate} from "react-router-dom";
import {Game} from "./pages/Game/Game.tsx";
import About from "./pages/Content/About.tsx";
import HowToPlay from "./pages/Content/HowToPlay.tsx";
import Contact from "./pages/Content/Contact.tsx";
import Home from "./pages/Home/Home.tsx";
import Feedback from "./pages/Feedback/Feedback.tsx";
import Achievements from "./pages/Achievements/Achievements.tsx";
import {Setting} from "./pages/Setting/Setting.tsx";

import "./App.css";

function Nav() {
    return (
        <header className="nav-wrapper">
            <nav className="nav">
                <NavLink to="/game" end>Home</NavLink>

                <NavLink to="/game/easy">Easy</NavLink>
                <NavLink to="/game/medium">Medium</NavLink>
                <NavLink to="/game/hard">Hard</NavLink>

                <NavLink to="/content/how-to-play">How to play</NavLink>
                <NavLink to="/content/about">About</NavLink>
                <NavLink to="/content/contact">Contact</NavLink>

                <NavLink to="/feedback">Feedback</NavLink>
                <NavLink to="/achievements">Achievements</NavLink>
                <NavLink to="/setting">Setting</NavLink>
            </nav>
        </header>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div className="app-layout">
                <Nav />
                <main className="page-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/game" replace />} />
                        <Route path="/game" element={<Home />} />
                        <Route path="/game/:difficulty" element={<Game />} />

                        <Route path="/content/about" element={<About />} />
                        <Route path="/content/how-to-play" element={<HowToPlay />} />
                        <Route path="/content/contact" element={<Contact />} />

                        <Route path="/feedback" element={<Feedback />} />
                        <Route path="/achievements" element={<Achievements />} />
                        <Route path="/setting" element={<Setting />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}