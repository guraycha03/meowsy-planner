"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Sticker({
  id,
  src,
  initialXPercent = 0.1,
  initialYPercent = 0.1,
  onDragStop,
  stickerSize = 50,
}) {
  const stickerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const posRef = useRef(pos);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // --- Initialize sticker position ---
  useEffect(() => {
    const content = document.getElementById("virtual-note-content");
    if (!content) return;

    const maxX = content.clientWidth - stickerSize;
    const maxY = content.clientHeight - stickerSize;

    // Defer setting state to avoid cascading render warning
    const id = requestAnimationFrame(() => {
        setPos({
        x: initialXPercent * maxX,
        y: initialYPercent * maxY,
        });
    });

    return () => cancelAnimationFrame(id);
    }, [initialXPercent, initialYPercent, stickerSize]);

  // --- Drag functions ---
  const getCoords = (e) =>
    e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

  const handleDragMove = (e) => {
    if (!dragging.current) return;
    if (e.type.startsWith("touch")) e.preventDefault();

    const content = document.getElementById("virtual-note-content");
    const rect = content.getBoundingClientRect();
    const coords = getCoords(e);

    let newX = coords.x - rect.left - offset.current.x + content.scrollLeft;
    let newY = coords.y - rect.top - offset.current.y + content.scrollTop;

    // Clamp inside content
    newX = Math.max(0, Math.min(newX, content.clientWidth - stickerSize));
    newY = Math.max(0, Math.min(newY, content.clientHeight - stickerSize));

    setPos({ x: newX, y: newY });
  };

  const handleDragStop = () => {
    if (!dragging.current) return;
    dragging.current = false;

    document.removeEventListener("mousemove", handleDragMove);
    document.removeEventListener("mouseup", handleDragStop);
    document.removeEventListener("touchmove", handleDragMove);
    document.removeEventListener("touchend", handleDragStop);

    if (onDragStop) onDragStop(id, posRef.current.x, posRef.current.y);
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    if (e.type === "mousedown" && e.button !== 0) return;

    dragging.current = true;

    const rect = stickerRef.current.getBoundingClientRect();
    const content = document.getElementById("virtual-note-content");
    const coords = getCoords(e);

    offset.current = {
      x: coords.x - rect.left + content.scrollLeft,
      y: coords.y - rect.top + content.scrollTop,
    };

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragStop);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("touchend", handleDragStop);
  };

  return (
    <div
      ref={stickerRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{
        left: pos.x,
        top: pos.y,
        width: stickerSize,
        height: stickerSize,
        zIndex: 50,
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
