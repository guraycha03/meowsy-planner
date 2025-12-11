// components/Sticker.js

"use client";

import { useState, useRef } from "react";
import Image from "next/image"; 

export default function Sticker({ src, id, initialX = 50, initialY = 50, onStopDrag }) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false); 
  
  const stickerRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  // Start drag (handles both mouse and touch down events)
  const handlePointerDown = (e) => {
    // Prevent default touch behavior (like scrolling)
    if (e.pointerType === 'touch') { 
        e.stopPropagation();
        e.preventDefault();
    }
    
    setIsDragging(true); 
    
    // Determine current client coordinates
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const rect = stickerRef.current.getBoundingClientRect();

    // Calculate the offset (where the user grabbed the sticker relative to its top-left corner)
    offset.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    
    // 🌟 FIX: Bind events to the document so dragging continues even if cursor leaves the sticker 🌟
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchmove", handlePointerMove, { passive: false });
    document.addEventListener("touchend", handlePointerUp);
  };

  // Dragging
  const handlePointerMove = (e) => {
    if (!isDragging) return; 
    
    if (e.pointerType === 'touch') { 
        e.stopPropagation();
        e.preventDefault();
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Calculate new position based on cursor and offset
    const newX = clientX - offset.current.x;
    const newY = clientY - offset.current.y;

    setPosition({ x: newX, y: newY });
  };

  // Stop drag
  const handlePointerUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
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
        style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: 80, 
            height: 80, 
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            zIndex: isDragging ? 999 : 10, // Control zIndex via state
            touchAction: "none", // Critical for mobile to prevent scroll on drag
            transition: isDragging ? "none" : "transform 0.1s ease-out", 
            transform: isDragging ? "scale(1.05)" : "scale(1)", 
        }}
    >
      <Image 
        src={src}
        alt="sticker"
        width={80}  
        height={80} 
        draggable="false" // Prevent native image drag
      />
    </div>
  );
}