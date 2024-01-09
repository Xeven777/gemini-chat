"use client";
import { Bot, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Swap = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/") {
      setIsChecked(false);
    } else {
      setIsChecked(true);
    }
  }, [pathname]);

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
      <label className="btn-sm btn btn-circle btn-outline backdrop-blur bg-gray-800/10 rounded-3xl swap swap-rotate z-50 fixed top-4 right-1 sm:right-16 md:right-52 shadow-md shadow-slate-800">
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
