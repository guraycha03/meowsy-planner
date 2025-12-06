"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { QUOTES } from "../data/quotes";

const LIGHT_BG_COLORS = ["#fff5f1", "#e3f0db", "#fef3e7", "#f0d9c4", "#f7f0ff"];

export default function DailyQuote() {
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [bgColor, setBgColor] = useState(LIGHT_BG_COLORS[0]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const getRandomBg = () => LIGHT_BG_COLORS[Math.floor(Math.random() * LIGHT_BG_COLORS.length)];

    const interval = setInterval(() => {
      setFade(true);
      const timeout = setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setBgColor(getRandomBg());
        setFade(false);
      }, 500);
      return () => clearTimeout(timeout);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-4 mb-6 flex flex-col items-center gap-6 md:items-start md:pl-12 md:pt-12 lg:pl-24 lg:pt-24">

      {/* Welcome Section */}
      <div
        className="flex flex-col items-center gap-4 mt-6 p-6 bg-white shadow-lg"
        style={{
          borderRadius: "1.5rem",
          border: "3px solid var(--color-muted)"
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold opacity-80 text-center md:text-left">
          Welcome Back!
        </h2>
        {/* Image always centered */}
        <div className="flex justify-center w-full">
          <Image
            src="/images/cat_img.png"
            alt="Cat illustration"
            width={150}
            height={150}
            className="rounded-2xl"
          />
        </div>
      </div>

      {/* Daily Quote Section */}
      <div className="flex justify-center w-full max-w-lg mt-6">
        <div
          className="w-full p-6 shadow-lg"
          style={{
            borderRadius: "1.5rem",
            border: "3px solid var(--color-muted)",
            backgroundColor: bgColor,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            minHeight: "4rem"
          }}
        >
          <h2 className="text-lg md:text-xl font-semibold opacity-70 mb-3 text-center">
            Daily Quote
          </h2>
          <p
            className={`text-sm md:text-base italic text-center transition-opacity duration-500 ease-in-out ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          >
            {currentQuote}
          </p>
        </div>
      </div>

    </div>
  );
}
