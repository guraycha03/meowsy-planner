// components/Sticker.js - FIXED FOR STICKER SIZE AWARENESS

"use client";

import { useState, useRef, useEffect } from "react"; 
import Image from "next/image";

// Reduced sticker size for calculation (used 50 in previous context)
const STICKER_SIZE = 50; 

export default function Sticker({ 
    id, 
    src, 
    initialXPercent = 0.1, 
    initialYPercent = 0.1, 
    onDragStop, 
    stickerSize = STICKER_SIZE // Use prop if passed, otherwise default
}) {
  const stickerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null); 

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const posRef = useRef(pos); 
  
  useEffect(() => {
    posRef.current = pos;
  }, [pos]);


  // --- Calculate Initial Position and Handle Container Resize ---
  useEffect(() => {
    const container = document.getElementById("note-area");
    containerRef.current = container;

    if (!container) return;

    const calculatePosition = () => {
      // Calculate maximum pixel bounds where the sticker's top-left corner can be
      const maxClientWidth = container.clientWidth - stickerSize;
      const maxClientHeight = container.clientHeight - stickerSize;

      setPos({
        // Calculate position based on saved percentage * max available space
        x: initialXPercent * maxClientWidth,
        y: initialYPercent * maxClientHeight,
      });
    };

    calculatePosition();

    // Listen for container resizing
    const observer = new ResizeObserver(calculatePosition);
    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };

  }, [initialXPercent, initialYPercent, stickerSize]); 


  // --- Drag Logic ---

  const onMouseUp = () => {
    dragging.current = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);

    if (onDragStop) {
      // Pass the current pixel coordinates to the parent
      onDragStop(id, posRef.current.x, posRef.current.y);
    }
  };

  const onMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;

    const rect = stickerRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!dragging.current || !containerRef.current) return;

    const bounds = containerRef.current.getBoundingClientRect();

    let newX = e.clientX - bounds.left - offset.current.x;
    let newY = e.clientY - bounds.top - offset.current.y;

    // Recalculate max boundaries on the fly
    const maxX = bounds.width - stickerSize;
    const maxY = bounds.height - stickerSize;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    setPos({ x: newX, y: newY });
  };
  
  // --- Render ---

  return (
    <div
      ref={stickerRef}
      onMouseDown={onMouseDown}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: 50,
        width: stickerSize,
        height: stickerSize,
      }}
    >
      <Image
        src={src}
        alt="sticker"
        width={stickerSize}
        height={stickerSize}
        draggable={false}
        className="w-full h-full"
      />
    </div>
  );
}