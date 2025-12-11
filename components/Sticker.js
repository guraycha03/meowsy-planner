"use client";

import { useState } from "react";
import Draggable from "react-draggable";

export default function Sticker({ src, initialX = 0, initialY = 0 }) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  const handleDrag = (e, data) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <Draggable
      position={position}
      onDrag={handleDrag}
      bounds="parent"
    >
      <img
        src={src}
        alt="sticker"
        className="w-16 h-16 cursor-grab select-none"
        style={{ userSelect: "none" }}
      />
    </Draggable>
  );
}
