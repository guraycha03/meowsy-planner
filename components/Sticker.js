"use client";

import { useState, useRef } from "react";
import Image from "next/image"; 

export default function Sticker({ src, id, initialX = 50, initialY = 50, onStopDrag }) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false); 
  const stickerRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // Start drag (mouse or touch)
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsDragging(true);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = stickerRef.current.getBoundingClientRect();
    offset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchmove", handlePointerMove, { passive: false });
    document.addEventListener("touchend", handlePointerUp);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setPosition({
      x: clientX - offset.current.x,
      y: clientY - offset.current.y,
    });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (onStopDrag) {
      onStopDrag(id, position.x, position.y);
    }

    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("touchmove", handlePointerMove);
    document.removeEventListener("touchend", handlePointerUp);
  };

  return (
    <div
      ref={stickerRef}
      onPointerDown={handlePointerDown}
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: 80,
        height: 80,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        zIndex: isDragging ? 999 : 10,
        touchAction: "none",
        transition: isDragging ? "none" : "transform 0.1s ease-out",
        transform: isDragging ? "scale(1.05)" : "scale(1)",
      }}
    >
      <Image src={src} alt="sticker" width={80} height={80} draggable="false" />
    </div>
  );
}
