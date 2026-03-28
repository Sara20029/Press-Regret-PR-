import "./Hard.css";

type HardProps = {
    title: string;
    levelNumber: number;
    buttonText: string;
    timer: number;
};

export default function Hard({ title, levelNumber, timer, buttonText }: HardProps) {
    return (
        <main className="hard">
            <div className="game-box">
                <header className="nav">
                    <h1>{title}</h1>
                </header>

                <div className="status">
                    <div className="level">Level {levelNumber}</div>
                    <div className="timer">{timer}</div>
                </div>

                <div className="center">
                    <button className="circle-button">
                        {buttonText}
                    </button>
                </div>
            </div>
        </main>
    );
}