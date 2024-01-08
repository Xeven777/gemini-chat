"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
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
  const [text, settext] = useState("");
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

  async function run() {
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
      settext(text);
      console.log(text);
    } catch (error) {
      console.log(error);
      setloading(false);
      settext("Oops, Error occured.");
    }
  }

  return (
    <div className="relative flex justify-center max-w-3xl border min-h-dvh overflow-y-scroll w-full pt-5 bg-slate-800 rounded-t-3xl">
      <div className="border flex flex-col my-16 w-full flex-grow flex-1 max-h-dvh">
        {history.map((item, index) => (
          <div
            key={index}
            className={`flex border border-red-400 flex-col ${
              item.role === "model" ? "items-start" : "items-end"
            }`}
          >
            <div
              className={`bg-slate-700 border border-yellow-400 rounded-3xl p-4 max-w-3xl ${
                item.role === "model" ? "text-left" : "text-right"
              }`}
            >
              {item.parts}
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 w-full flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setinput(e.target.value)}
          placeholder="Start Chatting..."
          className="input input-bordered w-full mx-auto bg-opacity-70 backdrop-blur shadow"
        />
        <button
          className="btn btn-primary rounded-3xl"
          title="send"
          onClick={run}
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
