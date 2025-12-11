"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image"; // 🌟 ADDED: Import Next.js Image component

// Dynamically import Sticker to avoid SSR issues
const Sticker = dynamic(() => import("./Sticker"), { ssr: false });

export default function StickerContainer({ onPickSticker }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef();

  const stickers = [
    { src: "/stickers/bear.png" },
    { src: "/stickers/goose.png" },
    { src: "/stickers/sky.png" },
    { src: "/stickers/kiss.png" },
  ];

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Floating Toggle Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-[var(--color-accent)] text-white shadow-xl flex items-center justify-center text-2xl hover:bg-[var(--color-accent-dark)] transition"
        title={isOpen ? "Close Stickers" : "Open Stickers"}
      >
        🖼️
      </button>

      {/* Sliding Panel */}
      <div
        ref={containerRef}
        className={`fixed top-0 right-0 h-full w-60 bg-white shadow-xl z-40 p-4 flex flex-col gap-4 transition-transform duration-300`}
        style={{ transform: isOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <h3 className="text-lg font-bold text-center">Stickers</h3>
        <div className="flex flex-col gap-3 mt-2">
          {stickers.map((sticker, idx) => (
            // 🌟 Replaced <img> with Image 🌟
            <Image
              key={idx}
              src={sticker.src}
              alt="sticker"
              width={64} // w-16 = 64px
              height={64} // h-16 = 64px
              className="cursor-pointer hover:scale-110 transition-transform"
              onClick={() => onPickSticker(sticker.src)}
            />
          ))}
        </div>
      </div>
    </>
  );
}