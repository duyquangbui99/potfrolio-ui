import { useState, useRef, useEffect } from "react";
import chatPrompt from "../chatbotConfig";
import botIcon from '../assets/images/bot.svg';
import upArrowIcon from '../assets/images/up-arrow.svg';
import githubIcon from '../assets/images/githubIcon.svg';


import '../styles/project.css';

function Chatbot({ isOpen }) {
    const [messages, setMessages] = useState([
        { from: "bot", text: "Feel free to ask anything!" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatBoxRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, loading]);


    const handleSend = async () => {
        if (!input.trim()) return;

        // Update UI immediately
        setMessages(prev => [...prev, { from: "user", text: input }]);
        setLoading(true);

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [{ role: "user", content: chatPrompt + input }]
                }),
            });

            const data = await response.json();
            const botReply = data.choices?.[0]?.message?.content || "No response from API";

            setMessages(prev => [...prev, { from: "bot", text: botReply }]);
        } catch (error) {
            setMessages(prev => [...prev, { from: "bot", text: "Error: " + error.message }]);
        } finally {
            setInput("");
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <div className="chatbot-project-div">
            <div className="chatbot-info-div">
                <h3>GPT-4o-mini Assistant</h3>
                <p>
                    This project is a React-based AI Chatbot Web Application that leverages OpenAI's GPT models
                    to provide conversational interactions. The chatbot is designed to respond to user inquiries
                    with context-specific answers based on a predefined script about me.
                </p>
                <a href="https://github.com/duyquangbui99" target="_blank" rel="noreferrer">
                    <img src={githubIcon} alt="Github Logo" className="github-icon" />
                </a>
            </div>
            {!isOpen && (
                <div className="chat-container">
                    <div id="chat-box" ref={chatBoxRef}>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={msg.from === "bot" ? "bot-response-container" : "user-message"}
                            >
                                {msg.from === "bot" && <img src={botIcon} alt="botIcon" className="bot-icon" />}
                                <div className={msg.from === "bot" ? "bot-message" : ""}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="bot-response-container">
                                <img src={botIcon} alt="botIcon" className="bot-icon" />
                                <div className="bot-message"><p>Loading...</p></div>
                            </div>
                        )}
                    </div>

                    <div className="input-container">
                        <input
                            id="user-input"
                            type="text"
                            placeholder="Ask a question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div id="send-button" onClick={handleSend}>
                            <img src={upArrowIcon} alt="up-arrow" className="up-arrow-icon" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chatbot;
