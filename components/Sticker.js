"use client";

import { useState, useRef } from "react";
import Image from "next/image"; 

export default function Sticker({ src, id, initialX = 50, initialY = 50, onStopDrag }) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  
  // 🌟 FIX 1: Introduce a state variable to control the visual drag effect
  const [isDragging, setIsDragging] = useState(false); 
  
  const stickerRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // Start drag
  const handlePointerDown = (e) => {
    e.preventDefault();
    
    // 🌟 FIX 2: Set the state variable when dragging starts
    setIsDragging(true); 
    
    if (stickerRef.current) {
        stickerRef.current.style.zIndex = 999; 
    }

    const rect = stickerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    offset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    
    // Use window document events to track movement even if the pointer leaves the sticker
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchmove", handlePointerMove, { passive: false });
    document.addEventListener("touchend", handlePointerUp);
  };

  // Dragging
  const handlePointerMove = (e) => {
    if (!isDragging) return; // Check state instead of ref
    e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const newX = clientX - offset.current.x;
    const newY = clientY - offset.current.y;

    setPosition({ x: newX, y: newY });
  };

  // Stop drag
  const handlePointerUp = () => {
    if (!isDragging) return;
    
    // 🌟 FIX 3: Set the state variable when dragging stops
    setIsDragging(false);
    
    if (stickerRef.current) {
        stickerRef.current.style.zIndex = 10; 
    }
    
    if (onStopDrag) {
      onStopDrag(id, position.x, position.y);
    }
    
    // Cleanup event listeners
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("touchmove", handlePointerMove);
    document.removeEventListener("touchend", handlePointerUp);
  };

  return (
    <div
        ref={stickerRef}
        onPointerDown={handlePointerDown} 
        onTouchStart={handlePointerDown}
        style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: 80, 
            height: 80, 
            cursor: "grab",
            userSelect: "none",
            zIndex: 10, 
            touchAction: "none", 
            transition: "transform 0.1s ease-out", 
            // 🌟 FIX 4: Read the reactive state variable, not the ref 🌟
            transform: isDragging ? "scale(1.05)" : "scale(1)", 
        }}
    >
      <Image 
        src={src}
        alt="sticker"
        width={80}  
        height={80} 
      />
    </div>
  );
}