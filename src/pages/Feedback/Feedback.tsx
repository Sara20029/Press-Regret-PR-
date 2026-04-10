import { useState } from "react";
import "./Feedback.css";
import {api} from "../../api/http.ts";
import * as React from "react";
import { useTranslation } from "react-i18next";



export default function Feedback() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState("5");
    const [submitted, setSubmitted] = useState(false);
    const { t } = useTranslation();

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
                <p className="feedback-intro">{t('feedback.intro')}.</p>

                {submitted && (
                    <div className="success-message">
                        {t('feedback.success-message')}!
                    </div>
                )}

                <form className="feedback-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">{t('feedback.name')}</label>
                        <input
                            id="name"
                            type="text"
                            placeholder={t('feedback.your-name')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="rating">{t('feedback.rating')}</label>
                        <select
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                        >
                            <option value="5">5 - {t('feedback.very-good')}</option>
                            <option value="4">4 - {t('feedback.good')}</option>
                            <option value="3">3 - {t('feedback.okay')}</option>
                            <option value="2">2 - {t('feedback.less-good')}</option>
                            <option value="1">1 - {t('feedback.bad')}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">{t('feedback.message')}</label>
                        <textarea
                            id="message"
                            placeholder={t('feedback.write')}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={6}
                            required
                        />
                    </div>

                    <button type="submit" className="submit-button">
                        {t('feedback.submit-button')}
                    </button>
                </form>
            </section>
        </main>
    );
}