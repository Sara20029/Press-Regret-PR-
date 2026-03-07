import { useState, useEffect } from "react";

type HowToPlayContent = {
    title: string;
    description: string;
    instructions: string[];
};

export default function HowToPlay() {
    const [content, setContent] = useState<HowToPlayContent | null>(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/content/how-to-play")
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

            <ul>
                {content.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                ) )}
            </ul>
        </div>
    );
}