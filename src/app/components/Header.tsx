import { Bot } from "lucide-react";
import React from "react";

const Header = () => {
  return (
    <div className="position fixed top-2 w-full z-10 ">
      <h1 className="text-2xl md:text-4xl font-semibold bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-400 text-center bg-clip-text text-transparent px-4 py-1 rounded-full border w-fit mx-auto border-slate-500/60 backdrop-blur shadow-md">
        Gemini Pro <Bot color="white" size={35} className="inline-flex" />✨
      </h1>
    </div>
  );
};

export default Header;
