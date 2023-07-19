import React, { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import { AiOutlineSend, AiFillRobot } from 'react-icons/ai';
import { FaRobot } from 'react-icons/fa';
import { GiRobotGolem } from 'react-icons/gi';

const ChatComponent = () => {
    const [userQuestions, setUserQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state
    const [imageURL, setImageURL] = useState("");

    const Chat = async () => {
        setLoading(true); // Show loader

        const configuration = new Configuration({
            apiKey: "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",
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
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false); // Hide loader
        }
    };

    const handleQuestionChange = (e) => {
        setCurrentQuestion(e.target.value);
    };

    const handleButtonClick = () => {
        if (currentQuestion) {
            Chat();
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
