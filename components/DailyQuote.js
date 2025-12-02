"use client";

import { useEffect, useState } from "react";
import { QUOTES } from "../data/quotes";

const LIGHT_BG_COLORS = ["#fff5f1", "#e3f0db", "#fef3e7", "#f0d9c4", "#f7f0ff"];

export default function DailyQuote() {
  // stable SSR-rendered values
  const [currentQuote, setCurrentQuote] = useState("");
  const [bgColor, setBgColor] = useState("#fff5f1");
  const [fade, setFade] = useState(false);

  useEffect(() => {
  const pickRandom = () => ({
    quote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
    bg: LIGHT_BG_COLORS[Math.floor(Math.random() * LIGHT_BG_COLORS.length)],
  });

  // schedule state changes, not synchronous
  queueMicrotask(() => {
    const { quote, bg } = pickRandom();
    setCurrentQuote(quote);
    setBgColor(bg);
  });

  const interval = setInterval(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      const { quote, bg } = pickRandom();
      setCurrentQuote(quote);
      setBgColor(bg);
      setFade(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, 6000);

  return () => clearInterval(interval);
}, []);


  return (
    <div className="mx-auto md:mx-0 md:ml-0 md:w-1/3 rounded-2xl shadow-lg shadow-gray-300 bg-white overflow-visible">
      <div className="p-4">
        <h2 className="text-lg md:text-xl font-semibold opacity-70 mb-2 text-center">
          Daily Quote
        </h2>
        <div
          className="p-6 border-2 border-dashed border-[var(--color-muted)] rounded-2xl transition-all duration-500 ease-in-out text-center"
          style={{ backgroundColor: bgColor, minHeight: "4rem" }}
        >
          <p
            className={`text-sm md:text-base italic transition-opacity duration-500 ease-in-out ${
              fade ? "opacity-0" : "opacity-90"
            }`}
          >
            {currentQuote || "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
}
