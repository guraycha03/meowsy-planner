"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Sticker({
  id,
  src,
  initialXPercent = 0.1,
  initialYPercent = 0.1,
  onDragStop,
  onDragStart,
  stickerSize = 50,
}) {
  const stickerRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const posRef = useRef(pos);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  // Initialize sticker position
  useEffect(() => {
    const content = document.getElementById("virtual-note-content");
    if (!content) return;
    const maxX = content.clientWidth - stickerSize;
    const maxY = content.clientHeight - stickerSize;

    const id = requestAnimationFrame(() => {
      setPos({ x: initialXPercent * maxX, y: initialYPercent * maxY });
    });
    return () => cancelAnimationFrame(id);
  }, [initialXPercent, initialYPercent, stickerSize]);

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

  // RESPONSIVE AUTO-REALIGNING STICKER POSITION
  useEffect(() => {
    const content = document.getElementById("virtual-note-content");
    if (!content) return;

    const updatePosition = () => {
      const maxX = content.clientWidth - stickerSize;
      const maxY = content.clientHeight - stickerSize;

      setPos({
        x: initialXPercent * maxX,
        y: initialYPercent * maxY
      });
    };

    // Run once on load
    updatePosition();

    // Watch for container resize
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(content);

    return () => resizeObserver.disconnect();
  }, [initialXPercent, initialYPercent, stickerSize]);


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

    setSelected(true); // select on drag start
    if (onDragStart) onDragStart(id);

    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragStop);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("touchend", handleDragStop);
  };

  // Deselect when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (stickerRef.current && !stickerRef.current.contains(e.target)) {
        setSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Toggle selection on tap/click (without dragging)
  const handleClick = (e) => {
    e.stopPropagation();
    setSelected(true); // always select on click
  };

  return (
    <div
      ref={stickerRef}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={handleClick}
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

      {selected && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDragStop(id, -1, -1); // delete
          }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs z-50"
        >
          ✕
        </button>
      )}
    </div>
  );
}
