// components/StickerContainer.js

"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image"; 

// Dynamically import Sticker to avoid SSR issues
const Sticker = dynamic(() => import("./Sticker"), { ssr: false });

export default function StickerContainer() { 
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef();

  const stickers = [
    { src: "/stickers/bear.png" },
    { src: "/stickers/goose.png" },
    { src: "/stickers/sky.png" },
    { src: "/stickers/kiss.png" },
  ];

  // Function to handle the drag start event
  const handleDragStart = (e, src) => {
    // Set the sticker's source URL in the data transfer object
    e.dataTransfer.setData("text/plain", src);
    // Add a custom data type to easily check if the dragged item is a sticker
    e.dataTransfer.setData("application/x-sticker-src", src); 
    
    // Optional: Set a custom drag image
    if (e.target instanceof HTMLImageElement) {
        e.dataTransfer.setDragImage(e.target, e.target.width / 2, e.target.height / 2);
    }
  };


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
      {/* Floating Toggle Icon (Interactive Button) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-[var(--color-accent)] text-white shadow-xl flex items-center justify-center text-2xl hover:bg-[var(--color-accent-dark)] transition-transform hover:scale-105 active:scale-95"
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
            <Image
              key={idx}
              src={sticker.src}
              alt="sticker"
              width={64} 
              height={64}
              draggable="true" 
              onDragStart={(e) => handleDragStart(e, sticker.src)}
              className="cursor-grab hover:scale-110 transition-transform" 
            />
          ))}
        </div>
      </div>
    </>
  );
}