import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import Game from "./pages/Game/Game.tsx";
import About from "./pages/Content/About.tsx";
import HowToPlay from "./pages/Content/HowToPlay.tsx";
import Contact from "./pages/Content/Contact.tsx";
import Home from "./pages/Home/Home.tsx";
import Feedback from "./pages/Feedback/Feedback.tsx";
import Achievements from "./pages/Achievements/Achievements.tsx";
import Setting from "./pages/Setting/Setting.tsx";
import Profile from "./pages/Profile/Profile.tsx";

function Nav() {
    return (
        <nav style={{ display: "flex", gap: 12, padding: 16, borderBottom: "1px solid #ddd" }}>
            <Link to="/game">Home</Link>

            <Link to="/game/easy">Easy</Link>
            <Link to="/game/medium">Medium</Link>
            <Link to="/game/hard">Hard</Link>

            <Link to="/content/how-to-play">How to play</Link>
            <Link to="/content/about">About</Link>
            <Link to="/content/contact">Contact</Link>

            <Link to="/feedback">Feedback</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/setting">Setting</Link>
            <Link to="/profile">Profile</Link>
        </nav>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Nav />
            <Routes>
                <Route path="/game" element={<Home />} />
                <Route path="/game/:difficulty" element={<Game />} />

                <Route path="/content/about" element={<About />} />
                <Route path="/content/how-to-play" element={<HowToPlay />} />
                <Route path="/content/contact" element={<Contact />} />

                <Route path="/feedback" element={<Feedback />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/setting" element={<Setting />} />
                <Route path="/profile" element={<Profile />} />
                {/*<Route path="*" element={<Navigate to="/game/easy" replace />} />*/}
            </Routes>
        </BrowserRouter>
    );
}