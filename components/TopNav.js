"use client";

import Image from "next/image";
import { MoreVertical } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <header className="flex justify-between items-center sticky top-0 z-10 px-4 py-2 border-b-2 border-[rgba(160,160,160,0.3)] bg-[var(--color-background)]">
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
        <button
          className="p-2 rounded-[18px] transition-all hover:bg-[var(--color-accent-light2)] hover:shadow-sm"
          style={{
            borderRadius: "22%", // squircley shape
          }}
          onClick={() => setIsPanelOpen(true)}
        >
          <MoreVertical className="w-5 h-5 text-[rgba(58,58,58,0.6)]" />
        </button>
      </header>

      {/* Side panel */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 flex justify-end z-40"
          onClick={() => setIsPanelOpen(false)} // click outside closes panel
        >
          <div
            className="bg-[var(--color-accent-light)] w-72 h-full p-6 shadow-lg flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <h2 className="text-xl font-bold text-[var(--color-foreground)]">
              Menu
            </h2>

            {/* Placeholder items */}
            <button className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform">
              Placeholder 1
            </button>
            <button className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform">
              Placeholder 2
            </button>

            {/* NEW: NoteCard preview button */}
            <button
              onClick={() => {
                setIsPanelOpen(false);
                router.push("/preview-note");
              }}
              className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
            >
              Preview NoteCard
            </button>

            <button
              className="mt-auto p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => setIsPanelOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
