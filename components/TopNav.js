"use client";

import Image from "next/image";
import { MoreVertical } from "lucide-react";

export default function TopNav() {
  return (
    <header className="flex justify-between items-center sticky top-0 z-10 px-4 py-2 border-b border-[rgba(160,160,160,0.3)] bg-[var(--color-background)]">
      {/* Left: Image + App Name */}
      <div className="flex items-center gap-3">
        <Image
          src="/images/meowsy-cat.png"
          alt="Meowsy mascot"
          width={36}
          height={36}
          className="rounded-full"
          priority
        />
        <h1
          className="text-2xl font-bold"
          style={{
            fontFamily: "var(--font-appname)",
            color: "#685955ff",
            letterSpacing: "0.15em",
          }}
        >
          Meowsy
        </h1>


      </div>

      {/* Right: Icon menu */}
      <button className="p-1.5 rounded-full hover:bg-[var(--color-accent2)] transition-colors">
        <MoreVertical className="w-5 h-5 text-[rgba(58,58,58,0.6)]" />
      </button>
    </header>
  );
}
