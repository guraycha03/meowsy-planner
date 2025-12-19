"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { QUOTES } from "../data/quotes";

export default function DailyQuote() {
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];

    const interval = setInterval(() => {
      setFade(true);
      const timeout = setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setFade(false);
      }, 400); // fade duration
      return () => clearTimeout(timeout);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full px-4 mb-6 flex flex-col items-center gap-6 md:items-start md:pl-12 md:pt-12 lg:pl-24 lg:pt-24">
      
      {/* Welcome Section */}
      <div
        className="flex flex-col items-center gap-4 mt-6 p-6 shadow-lg"
        style={{
          borderRadius: "1.5rem",
          border: "3px solid #d1cfc7",
          backgroundColor: "#fffaf0"
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold opacity-80 text-center md:text-left">
          Welcome Back!
        </h2>
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

      {/* Daily Inspiration Board */}
      <div className="flex justify-center w-full max-w-md lg:max-w-lg mt-6">
        <div
          className="relative w-full shadow-xl rounded-2xl border-2 border-[#8b6d5c]
                     flex flex-col items-center text-center bg-[#a67c52] overflow-hidden"
          style={{ minHeight: "280px" }} // fixed board height
        >
          {/* Board texture or illustration */}
          <div
            className="absolute inset-0 bg-no-repeat bg-center opacity-30 pointer-events-none"
            style={{
              backgroundImage: 'url("/images/noteboard-bg.png")',
              backgroundSize: "cover",
            }}
          />

          <h3 className="relative z-10 text-sm font-light uppercase tracking-widest text-[#5c3a21] mt-4 mb-2">
            Daily Inspiration
          </h3>

          {/* Sticky Note */}
          <div
            className={`relative z-10 w-11/12 max-w-[90%] p-4 bg-[#fff69f] shadow-lg rounded-md
                        transition-all duration-300 ease-in-out`}
            style={{ minHeight: "4rem" }}
          >
            <p
              className={`text-[#4a3f2b] font-['Patrick Hand'] text-lg md:text-xl leading-relaxed italic break-words transition-opacity duration-400 ${
                fade ? "opacity-0" : "opacity-100"
              }`}
              dangerouslySetInnerHTML={{ __html: `&ldquo;${currentQuote}&rdquo;` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
