import { useState, useEffect } from "react";

type AboutContent = {
    title: string;
    description: string;
};

export default function About() {
    const [content, setContent] = useState<AboutContent | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/content/about")
            .then(response => response.json())
            .then(data => {
                setContent(data)
            });
    }, []);

    if(!content){
        return <div>Loading...</div>
    }
    return (
        <div>
            <h1>{content.title}</h1>
            <p>{content.description}</p>
        </div>
    );
}