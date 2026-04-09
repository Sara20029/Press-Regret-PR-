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
        return <main>Lade…</main>;
    }

    return (
        <main className="contact-page">
            <h1>{data.title}</h1>
            <p>{data.description}</p>
            <p>{data.email}</p>
        </main>
    );
}