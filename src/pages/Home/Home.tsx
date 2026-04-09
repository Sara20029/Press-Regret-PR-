import {Link} from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function Home() {

    const { t } = useTranslation();

    return (
        <main className="home-page">
            <h1>{t('home.title')}</h1>
            <div className="home-buttons">
                <Link to="/game/easy">
                    <button>{t('nav.easy')}</button>
                </Link>
                <Link to="/game/medium">
                    <button>{t('nav.medium')}</button>
                </Link>
                <Link to="/game/hard">
                    <button>{t('nav.hard')}</button>
                </Link>
            </div>
        </main>
    );
}