"use client";

import Sticker from "./Sticker";

export default function StickerContainer() {
  // List of stickers with initial positions
  const stickers = [
    { src: "/stickers/smile.png", x: 40, y: 50 },
    { src: "/stickers/love.png", x: 120, y: 80 },
    { src: "/stickers/kiss.png", x: 200, y: 120 },
    // Add more stickers here
  ];

  return (
    <>
      {stickers.map((sticker, index) => (
        <Sticker
          key={index}
          src={sticker.src}
          initialX={sticker.x}
          initialY={sticker.y}
        />
      ))}
    </>
  );
}
