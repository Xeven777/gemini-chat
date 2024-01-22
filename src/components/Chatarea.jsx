"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState, useEffect, useRef } from "react";
import { Send, Trash } from "lucide-react";
import Image from "next/image";
const { markdownToTxt } = require("markdown-to-txt");

const ChatArea = () => {
  const messagesEndRef = useRef(null);
  const [input, setinput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([
    {
      role: "model",
      parts: "Great to meet you. Im Gemini, your chatbot.",
    },
  ]);
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_APIKEY);
  const [chat, setchat] = useState(null);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);
  useEffect(() => {
    // the moment i felt , im the GOD
    if (!chat) {
      setchat(
        model.startChat({
          generationConfig: {
            maxOutputTokens: 400,
          },
        })
      );
    }
  }, [chat, model]);

  async function chatting() {
    setLoading(true);
    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: input,
      },
      {
        role: "model",
        parts: "Thinking...",
      },
    ]);
    setinput("");
    try {
      const result = await chat.sendMessage(input);
      const response = await result.response;
      const text = markdownToTxt(response.text());
      setLoading(false);
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: text,
        });
        return newHistory;
      });
    } catch (error) {
      setHistory((oldHistory) => {
        const newHistory = oldHistory.slice(0, oldHistory.length - 1);
        newHistory.push({
          role: "model",
          parts: "Oops! Something went wrong.",
        });
        return newHistory;
      });
      setLoading(false);
      console.log(error);
      alert("Oops! Something went wrong.");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      chatting();
    }
  }

  function reset() {
    setHistory([
      {
        role: "model",
        parts: "Great to meet you. Im Gemini, your chatbot.",
      },
    ]);
    setinput("");
    setchat(null);
  }

  return (
    <div className="relative flex px-2 justify-center max-w-3xl min-h-dvh w-full pt-6 bg-gray-900 rounded-t-3xl max-h-screen shadow shadow-slate-900">
      <div className="flex text-sm md:text-base flex-col pt-10 pb-16 w-full flex-grow flex-1 rounded-3xl shadow-md overflow-y-auto">
        {history.map((item, index) => (
          <div
            key={index}
            className={`chat ${
              item.role === "model" ? "chat-start" : "chat-end"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-6 md:w-10 rounded-full">
                <Image
                  alt="o"
                  src={item.role === "model" ? "/geminis.jpeg" : "/user.jpg"}
                  width={50}
                  height={50}
                />
              </div>
            </div>
            <div className="chat-header mx-2 font-semibold opacity-80">
              {item.role === "model" ? "Gemini" : "You"}
            </div>
            <div
              className={`chat-bubble font-medium ${
                item.role === "model" ? "chat-bubble-primary" : ""
              }`}
            >
              {item.parts}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute px-2 bottom-2 w-full flex gap-1">
        <button
          className="btn btn-outline shadow-md btn-error rounded-3xl backdrop-blur"
          title="send"
          onClick={reset}
        >
          <Trash />
        </button>
        <textarea
          type="text"
          value={input}
          required
          rows={1}
          onKeyDown={handleKeyDown}
          onChange={(e) => setinput(e.target.value)}
          placeholder="Start Chatting..."
          className="textarea backdrop-blur textarea-primary w-full mx-auto bg-opacity-60 font-medium shadow rounded-3xl"
        />
        <button
          className={`btn rounded-3xl shadow-md ${
            loading
              ? "btn-accent cursor-wait pointer-events-none"
              : "btn-primary"
          }`}
          title="send"
          onClick={chatting}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Send />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
