import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";
import "./Contact.css";

type Content = {
    title: string;
    description: string;
    email: string[];
};

export default function Contact() {
    const [data, setData] = useState<Content | null>(null);

    useEffect(() => {
        api.get<Content>("/api/content/contact")
            .then((r) => {
                console.log("Response:", r.data);
                setData(r.data);
            })
            .catch((err) => console.error("API Fehler:", err));
    }, []);

    if (!data) {
        return <main style={{ padding: 24, color: "white" }}>Lade…</main>;
    }

    return (
        <main className="contact-page" style={{ padding: 24, color: "white" }}>
            <h1 style={{color: "black"}}>{data.title}</h1>
            <p style={{color: "black"}}>{data.description}</p>
            <p style={{color: "black"}}>{data.email}</p>

        </main>
    );
}