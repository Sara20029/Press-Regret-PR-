import "./Medium.css";

type MediumProps = {
    title: string;
    levelNumber: number;
    buttonText: string;
    timer: number;
};

export default function Medium({ title, levelNumber, timer, buttonText }: MediumProps) {
    return (
        <main className="medium">
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