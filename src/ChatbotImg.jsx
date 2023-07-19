import React, { useState } from "react";
import './App.css';
import { Configuration, OpenAIApi } from "openai";
import { AiOutlineSend, AiFillRobot } from 'react-icons/ai';
import { FaRobot } from 'react-icons/fa';
import { GiRobotGolem } from 'react-icons/gi';
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
const ChatComponent = () => {
    const [userQuestions, setUserQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state
    const [imageURL, setImageURL] = useState("");


    const Chat = async () => {
        setLoading(true);

        const configuration = new Configuration({
            apiKey: "",
        });

        const openai = new OpenAIApi(configuration);

        async function chat(input) {
            const messages = [{ role: "user", content: input }];
            const response = await openai.createChatCompletion({
                model: "gpt-4-0613",
                messages: messages,
                temperature: 0,
            });
            return response.data.choices[0].message.content;
        }

        const promptTemplate = `
      Be answer in acurate
      Question: {question}
    `;
        const prompt = promptTemplate.replace("{question}", currentQuestion);

        try {
            const response = await chat(prompt);
            setUserQuestions((prevQuestions) => [
                ...prevQuestions,
                currentQuestion,
            ]);
            setResponses((prevResponses) => [...prevResponses, response]);
            generateImage();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const generateImage = async () => {
        const configuration = new Configuration({
            apiKey: "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",
        });

        const openai = new OpenAIApi(configuration);

        const response = await openai.createImage({
            prompt: currentQuestion,
            n: 1,
            size: "512x512",
        });

        const image_url = response.data.data[0].url;
        setImageURL(image_url);
    };

    const handleQuestionChange = (e) => {
        setCurrentQuestion(e.target.value);
    };

    const handleButtonClick = () => {
        if (currentQuestion) {
            Chat();
            generateImage(); // Generate the image after getting the response
            setCurrentQuestion("");
        }
    };


    return (
        <>
            <div className="chatbot_div">
                <div className="header">
                    <h1> <GiRobotGolem /> ChatBot</h1>
                </div>
                <div className="chatting_div">
                    <div className="chat_box">
                        {userQuestions.map((question, index) => (
                            <>
                                <div className="chat_box_question">{question}</div>
                                <div className="chat_box_answer">
                                    <FaRobot color="white" /> {responses[index]}
                                    {imageURL && <img src={imageURL} alt="Generated" />}

                                </div>
                            </>
                        ))}
                        {loading && ( // Render loader if loading is true
                            <div class="loader"></div>
                        )}
                    </div>
                    <div className="inputDiv">
                        <input
                            className="Userinput"
                            id="questionInput"
                            type="text"
                            value={currentQuestion}
                            onChange={handleQuestionChange}
                            placeholder="Send a message"
                        />
                        <AiOutlineSend
                            onClick={handleButtonClick}
                            color="white"
                            size={20}
                            className="send_btn"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatComponent;
