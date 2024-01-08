"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect } from "react";
import { Send, Trash } from "lucide-react";
import Image from "next/image";
const { markdownToTxt } = require("markdown-to-txt");

const ChatArea = () => {
  const [input, setinput] = useState("");
  const [loading, setloading] = useState(false);
  const [history, setHistory] = useState([
    {
      role: "model",
      parts: "Great to meet you. Im Gemini, your chatbot.",
    },
  ]);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCRE7nLlAa49i-3UfEOVcMbnZLCI2xdTE0"
  );
  const [chat, setchat] = useState(null);

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    // the moment i felt , im the GOD
    if (!chat) {
      setchat(
        model.startChat({
          generationConfig: {
            maxOutputTokens: 500,
          },
        })
      );
      console.log("chat started");
    }
  }, []);

  async function chatting() {
    setHistory((oldHistory) => [
      ...oldHistory,
      {
        role: "user",
        parts: input,
      },
    ]);
    setloading(true);
    setinput("");
    try {
      const result = await chat.sendMessage(input);
      const response = await result.response;
      console.log(response.candidates[0].content.role);
      const text = markdownToTxt(response.text());
      setloading(false);
      setHistory((oldHistory) => [
        ...oldHistory,
        {
          role: "model",
          parts: text,
        },
      ]);
    } catch (error) {
      console.log(error);
      setloading(false);
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
    <div className="relative flex justify-center px-2 max-w-3xl min-h-dvh w-full pt-5 bg-gray-900 rounded-t-3xl max-h-screen">
      <div className="flex text-sm md:text-base flex-col my-16 w-full flex-grow flex-1 overflow-y-scroll">
        {history.map((item, index) => (
          <div
            key={index}
            className={`chat ${
              item.role === "model" ? "chat-start" : "chat-end"
            }`}
          >
            <div className="chat-image avatar">
              <div className="w-[22px] md:w-10 rounded-full">
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
      </div>

      <div className="absolute px-2 bottom-2 w-full flex gap-1">
        <button
          className="btn btn-outline btn-error rounded-3xl"
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
          className="textarea textarea-primary w-full mx-auto bg-opacity-70 font-medium shadow rounded-3xl"
        />
        <button
          className="btn btn-primary rounded-3xl"
          title="send"
          onClick={chatting}
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
