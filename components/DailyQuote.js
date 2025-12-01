"use client";

import { useEffect, useState } from "react";
import { QUOTES } from "../app/data/quotes"; // adjust path

const LIGHT_BG_COLORS = [
  "#fff5f1",
  "#e3f0db",
  "#fef3e7",
  "#f0d9c4",
  "#f7f0ff",
];

export default function DailyQuote() {
  const [currentQuote, setCurrentQuote] = useState(""); // start empty
  const [bgColor, setBgColor] = useState(LIGHT_BG_COLORS[0]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const getRandomBg = () => LIGHT_BG_COLORS[Math.floor(Math.random() * LIGHT_BG_COLORS.length)];

    // initialize after mount
    setCurrentQuote(getRandomQuote());
    setBgColor(getRandomBg());

    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setBgColor(getRandomBg());
        setFade(false);
      }, 1000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={`p-6 border-2 border-dashed border-[var(--color-muted)] rounded-2xl
        transition-all duration-1000 ease-in-out text-center
        mx-auto md:mx-0 md:ml-0 md:w-1/3`}
      style={{
        backgroundColor: bgColor,
        opacity: fade ? 0 : 1,
        minHeight: "4rem",
      }}
    >
      <h2 className="text-lg md:text-xl font-semibold opacity-70 mb-2">
        Daily Quote
      </h2>
      <p className="text-sm md:text-base opacity-90 italic transition-opacity duration-1000 ease-in-out">
        {currentQuote}
      </p>
    </section>
  );
}
