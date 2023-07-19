import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";

const OPENAI_API_KEY = "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";

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
    basePath: "https://api.openai.com/v1", // Specify the correct API version
});

const openai = new OpenAIApi(configuration);

function ImageGenerator() {
    const [userInput, setUserInput] = useState("");
    const [generatedImage, setGeneratedImage] = useState("");

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
    };

    const generateImage = async () => {
        const response = await openai.createImage({
            prompt: userInput,
            n: 1,
            size: "1024x1024",
        });
        const imageUrl = response.data.data[0].url;
        setGeneratedImage(imageUrl);
    };

    return (
        <div>
            <input type="text" value={userInput} onChange={handleInputChange} />
            <button onClick={generateImage}>Generate Image</button>
            {generatedImage && <img src={generatedImage} alt="Generated" />}
        </div>
    );
}

export default ImageGenerator;
