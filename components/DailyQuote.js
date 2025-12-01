"use client";

import { useEffect, useState } from "react";
import { QUOTES } from "../data/quotes";

const LIGHT_BG_COLORS = [
  "#fff5f1",
  "#e3f0db",
  "#fef3e7",
  "#f0d9c4",
  "#f7f0ff",
];

export default function DailyQuote() {
  // Initialize with a random quote and bg color
  const [currentQuote, setCurrentQuote] = useState(() => 
    QUOTES[Math.floor(Math.random() * QUOTES.length)]
  );
  const [bgColor, setBgColor] = useState(() =>
    LIGHT_BG_COLORS[Math.floor(Math.random() * LIGHT_BG_COLORS.length)]
  );
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const getRandomQuote = () =>
      QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const getRandomBg = () =>
      LIGHT_BG_COLORS[Math.floor(Math.random() * LIGHT_BG_COLORS.length)];

    const interval = setInterval(() => {
      setFade(true); // fade out
      setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setBgColor(getRandomBg());
        setFade(false); // fade in
      }, 500);
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
          className={`p-6 border-2 border-dashed border-[var(--color-muted)] rounded-2xl
            transition-all duration-500 ease-in-out text-center`}
          style={{
            backgroundColor: bgColor,
            minHeight: "4rem",
          }}
        >
          <p
            className={`text-sm md:text-base opacity-90 italic transition-opacity duration-500 ease-in-out ${
              fade ? "opacity-0" : "opacity-90"
            }`}
          >
            {currentQuote}
          </p>
        </div>
      </div>
    </div>
  );
}
