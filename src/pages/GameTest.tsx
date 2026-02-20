import { useState } from "react";
import { api } from "../api/http";

export default function GameTest() {
    const [count, setCount] = useState(0);
    const [backendMsg, setBackendMsg] = useState<string>("(noch nicht geladen)");
    const [error, setError] = useState<string | null>(null);

    async function pingBackend() {
        setError(null);
        try {
            const res = await api.get<string>("/test");
            setBackendMsg(res.data);
        } catch {
            setError("Ping fehlgeschlagen (Backend aus oder CORS). Schau in die Browser-Konsole.");
        }
    }

    return (
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", gap: 16, padding: 24 }}>
            <div style={{ textAlign: "center" }}>
                <h1 style={{ marginBottom: 8 }}>Press & Regret</h1>
                <p style={{ marginTop: 0 }}>Test-Screen</p>
            </div>

            <button
                onClick={() => setCount((c) => c + 1)}
                style={{ width: 260, height: 260, borderRadius: "50%", fontSize: 28, fontWeight: 700, border: "none", cursor: "pointer" }}
            >
                PRESS
            </button>

            <p style={{ fontSize: 18 }}>Pressed: {count}</p>

            <div style={{ textAlign: "center" }}>
                <button onClick={pingBackend} style={{ padding: "10px 14px" }}>
                    Backend ping (/test)
                </button>

                <p style={{ marginTop: 12 }}>
                    Backend says: <b>{backendMsg}</b>
                </p>

                {error && <p style={{ color: "crimson" }}>{error}</p>}
            </div>
        </main>
    );
}