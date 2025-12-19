"use client";

import { useState, useEffect } from "react";

const ILLUSTRATION_IMAGES = [
  "/images/home-illus/apple.png",
  "/images/home-illus/communication.png",
  "/images/home-illus/donut.png",
  "/images/home-illus/education.png",
  "/images/home-illus/grade.png",
  "/images/home-illus/idea.png",
  "/images/home-illus/in-love.png",
  "/images/home-illus/kiss.png",
  "/images/home-illus/love.png",
  "/images/home-illus/love-1.png",
  "/images/home-illus/love-2.png",
  "/images/home-illus/sleep.png",
  "/images/home-illus/reading.png",
  "/images/home-illus/sleep.png",
  "/images/home-illus/smile.png",
  "/images/home-illus/winter.png",
  
];

export default function WelcomeCard({ user, welcomeMessage }) {
  const [flowers, setFlowers] = useState([]);
  const [currentImage, setCurrentImage] = useState(ILLUSTRATION_IMAGES[0]);

  const createFlower = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newFlower = {
      id: Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      size: 40, // adjust as needed
    };
    setFlowers((prev) => [...prev, newFlower]);
  };

  const changeImageRandomly = () => {
    const otherImages = ILLUSTRATION_IMAGES.filter((img) => img !== currentImage);
    setCurrentImage(otherImages[Math.floor(Math.random() * otherImages.length)]);
  };

  useEffect(() => {
    if (flowers.length === 0) return;
    const timer = setTimeout(() => {
      setFlowers([]);
    }, 1000); // flower disappears after 1 second
    return () => clearTimeout(timer);
  }, [flowers]);

  return (
    <div
      onClick={createFlower}
      className="relative p-6 rounded-3xl shadow-2xl mx-auto w-full flex flex-col items-center gap-4
                 bg-gradient-to-br from-[#fff5f7] via-[#fff9f0] to-[#f0faff] border border-white/30
                 backdrop-blur-md hover:scale-[1.02] transition-transform duration-300 ease-out"
      style={{ maxWidth: "90%", minWidth: "280px", cursor: "pointer" }}
    >
      <h1 className="text-3xl font-extrabold mb-2 text-[#6b4e4b]">
        Welcome back, {user?.displayName || user?.email?.split("@")[0] || "User"}!
      </h1>
      <p className="text-base opacity-95 font-medium text-center">{welcomeMessage}</p>

      {/* Illustration */}
      <div className="relative mt-4">
        <img
          src={currentImage}
          alt="Illustration"
          className="w-52 h-52 object-contain transition-transform duration-500 ease-out hover:scale-110"
          onClick={(e) => { e.stopPropagation(); changeImageRandomly(); }}
        />
      </div>

      {/* Flower effect */}
      {flowers.map((f) => (
        <img
          key={f.id}
          src="/images/flower.png"
          className="absolute pointer-events-none"
          style={{
            top: f.y,
            left: f.x,
            width: f.size,
            height: f.size,
            transform: "translate(-50%, -50%)",
            opacity: 0.8,
            transition: "opacity 0.8s ease-out",
          }}
        />
      ))}
    </div>
  );
}
