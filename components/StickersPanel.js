"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function StickersPanel({ onAddSticker }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const stickerList = [
    { name: "Sky", src: "/stickers/sky.png" },
    { name: "Strawberry", src: "/stickers/strawberry.png" },
    { name: "Flower", src: "/stickers/flower.png" },
    { name: "Half Moon", src: "/stickers/half-moon.png" },
    { name: "Cute Bear", src: "/stickers/cute-bear.png" },
    { name: "Blue Flower", src: "/stickers/blue-flower.png" },
    { name: "Ghost", src: "/stickers/ghost.png" },
    { name: "Rabbit", src: "/stickers/rabbit.png" },
    { name: "Lollipop", src: "/stickers/lollipop.png" },
    { name: "Goose", src: "/stickers/goose.png" },
    { name: "Heart", src: "/stickers/heart.png" },
    
    { name: "Cat", src: "/stickers/cat.png" },
    { name: "Butterflies", src: "/stickers/butterflies.png" },

    { name: "Blue Bird", src: "/stickers/blue-bird.png" },

  ];

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed top-1/2 right-6 z-[100] transform -translate-y-1/2 flex items-center"
    >
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 p-0 shadow-md rounded-full overflow-hidden bg-transparent"
      >
        <Image
          src="/images/meowsy-cat.png"
          alt="Toggle"
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </button>

      {/* Sliding panel content */}
      <div
        className={`transition-all duration-300 overflow-hidden bg-white shadow-xl rounded-l-xl
          ${open ? "w-28 p-3 ml-1 border border-[var(--color-muted)] max-h-[60vh] overflow-y-auto" : "w-0 p-0 ml-0"}`}
      >
        {open && (
          <div className="flex flex-col items-center gap-2">
            {stickerList.map((s) => (
              <Image
                key={s.name}
                src={s.src}
                alt={s.name}
                width={64}
                height={64}
                onClick={() => onAddSticker(s.src)}
                className="rounded-lg cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
