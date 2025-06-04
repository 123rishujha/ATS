// File: routes/candidates/[applicationId]/chat.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { main_backend_url } from "@/imports/mainExports";
import ReactMarkdown from "react-markdown";

const CandidateChat = () => {
  const { applicationId } = useParams();
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${main_backend_url}api/ai/chat/candidate/${applicationId}`,
        {
          query: userInput,
        }
      );
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Try again." },
      ]);
    } finally {
      setIsLoading(false);
      setUserInput("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">How can I help you today:)</h2>
      <div className="bg-gray-100 p-4 rounded-md h-[400px] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-4 py-2 rounded-lg ${
                msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {msg.sender === "bot" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </span>
          </div>
        ))}
        {isLoading && <div className="text-gray-500 text-sm">Thinking...</div>}
      </div>
      <div className="flex mt-4">
        <input
          className="flex-1 border border-gray-300 rounded-l-md p-2"
          placeholder="Ask something..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r-md"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default CandidateChat;
