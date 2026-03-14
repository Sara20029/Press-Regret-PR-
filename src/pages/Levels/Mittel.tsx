import "./Mittel.css";

export default function Mittel() {
    return (
        <main className="easy">
            <div className="game-box">

                <header className="nav">
                    <h1>Press & Regret: Easy</h1>
                </header>

                <div className="status">
                    <div className="level">Level 1</div>
                    <div className="timer">45</div>
                </div>

                <div className="center">
                    <button className="circle-button">
                        Test Level
                    </button>
                </div>

            </div>
        </main>
    );
}