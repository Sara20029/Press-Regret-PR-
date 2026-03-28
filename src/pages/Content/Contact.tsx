import { useEffect, useState } from "react";
import { api } from "../../api/http.ts";

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
        <main style={{ padding: 24, color: "white" }}>
            <h1>{data.title}</h1>
            <p>{data.description}</p>
            <p>{data.email}</p>

        </main>
    );
}