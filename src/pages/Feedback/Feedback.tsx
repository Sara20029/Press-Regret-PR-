import { useState } from "react";
import "./Feedback.css";
import {api} from "../../api/http.ts";
import * as React from "react";

export default function Feedback() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState("5");
    const [submitted, setSubmitted] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await api.post('/api/feedback', {
            name,
            rating: parseInt(rating),
            message,
        });

        setSubmitted(true);
        setName("");
        setMessage("");
        setRating("5");
    }

    return (
        <main className="feedback-page">
            <section className="feedback-card">
                <h1>Feedback</h1>
                <p className="feedback-intro">
                    Teile uns mit, wie dir das Spiel gefällt oder was wir verbessern können.
                </p>

                {submitted && (
                    <div className="success-message">
                        Vielen Dank für dein Feedback!
                    </div>
                )}

                <form className="feedback-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Dein Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rating">Bewertung</label>
                        <select
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value="5">5 - Sehr gut</option>
                            <option value="4">4 - Gut</option>
                            <option value="3">3 - Okay</option>
                            <option value="2">2 - Weniger gut</option>
                            <option value="1">1 - Schlecht</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Nachricht</label>
                        <textarea
                            id="message"
                            placeholder="Schreibe hier dein Feedback..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        Feedback absenden
                    </button>
                </form>
            </section>
        </main>
    );
}