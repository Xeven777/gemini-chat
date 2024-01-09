"use client";

import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Send, ImagePlus } from "lucide-react";
const { markdownToTxt } = require("markdown-to-txt");

const ImageVision = () => {
  const messagesEndRef = useRef(null);
  const [input, setinput] = useState("");
  const [loading, setloading] = useState(false);
  const [text, settext] = useState(
    "Hola ! I am Gemini. Pick an image and ask a question!"
  );
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCRE7nLlAa49i-3UfEOVcMbnZLCI2xdTE0"
  );
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [text]);

  async function fileToGenerativePart(file) {
    const base64EncodedDataPromise = new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          const resultString = reader.result;
          resolve(resultString.split(",")[1]);
        } else {
          console.error("FileReader result is null");
        }
      };
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
  }

  async function run() {
    const fileInputEl = document.querySelector("input[type=file]");
    setinput("");
    if (fileInputEl && fileInputEl.files.length > 0) {
      setloading(true);
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const imageParts = await Promise.all(
          [...fileInputEl.files].map(fileToGenerativePart)
        );

        const result = await model.generateContentStream([
          input,
          ...imageParts,
        ]);
        setloading(false);
        let newText = "";
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          newText += chunkText;
          settext(markdownToTxt(newText));
        }
      } catch (error) {
        console.log(error);
        setloading(false);
        settext("Oops, Error occured.");
      }
    } else {
      alert("Please select an image");
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      run();
    }
  }

  return (
    <div className="relative flex px-2 justify-center max-w-3xl min-h-dvh w-full pt-5 bg-gray-900 rounded-t-3xl max-h-screen shadow shadow-slate-900">
      <div className="flex text-sm md:text-base flex-col pt-10 pb-16 w-full flex-grow flex-1 rounded-3xl shadow-md overflow-y-auto">
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-6 md:w-10 rounded-full">
              <Image alt="o" src="/geminis.jpeg" width={50} height={50} />
            </div>
          </div>
          <div className="chat-header mx-2 font-semibold opacity-80">
            Gemini
          </div>
          <div className="chat-bubble font-medium chat-bubble-primary">
            {loading ? (
              <span className="loading loading-dots loading-md"></span>
            ) : (
              text
            )}
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className="absolute px-2 bottom-2 w-full flex gap-1">
        <button
          className="btn btn-accent rounded-3xl shadow-md btn-outline backdrop-blur"
          onClick={() => document.getElementById("my_modal_1").showModal()}
        >
          <ImagePlus />
        </button>
        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-3">Select image</h3>
            <input
              type="file"
              accept="image/*"
              className="file-input w-full file-input-primary"
              placeholder="image"
              title="image"
            />
            <div className="modal-action">
              <form method="dialog">
                <button className="btn">Done</button>
              </form>
            </div>
          </div>
        </dialog>
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
          onClick={run}
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

export default ImageVision;
