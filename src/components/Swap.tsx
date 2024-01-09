"use client";
import { Bot, Eye } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

const Swap = () => {
  const router = useRouter();
  const [isChecked, setIsChecked] = React.useState(false);

  function swap() {
    setIsChecked(!isChecked);
    if (isChecked) {
      router.push("/");
    } else {
      router.push("/vision");
    }
  }
  return (
    <div>
      <label className="btn btn-outline backdrop-blur bg-gray-800/10 rounded-3xl swap swap-rotate z-50 fixed top-2 right-1 md:right-52 shadow-md shadow-slate-800">
        <input
          type="checkbox"
          aria-label="Swap"
          checked={isChecked}
          onChange={swap}
        />
        <div className="swap-on">
          <Bot />
        </div>
        <div className="swap-off">
          <Eye />
        </div>
      </label>
    </div>
  );
};

export default Swap;
