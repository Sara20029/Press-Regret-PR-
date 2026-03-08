import "./Game.css";

export default function Game() {
    return (
        <main className="game">
            <header className="nav">
                <h1>Game</h1>
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
        </main>
    );
}