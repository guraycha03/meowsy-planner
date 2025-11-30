"use client";

import { useRouter } from "next/navigation";

export default function QuickCreateModal({ isOpen, setIsOpen }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-20"
      onClick={() => setIsOpen(false)}
    >
      {/* Modal Box */}
      <div
        className="bg-[var(--color-accent-light)] p-6 rounded-2xl w-80 flex flex-col space-y-4 shadow-xl border"
        style={{
          borderColor: "var(--color-muted)", // subtle dusty border
          borderWidth: "2px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">
          Add New
        </h2>

        <button className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform">
          Task
        </button>

        <button className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform">
          Note
        </button>

        {/* Cancel: slim, oval, distinct */}
        <button
          className="self-center px-6 py-2 bg-gray-300 rounded-full text-[var(--color-foreground)] transition-all hover:bg-gray-500 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>

      </div>
    </div>
  );
}
