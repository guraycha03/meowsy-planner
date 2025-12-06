"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase"; // your Firebase config


export default function SidePanel({ isOpen, onClose }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-end z-40"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-accent-light)] w-72 h-full p-6 shadow-lg flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">Menu</h2>

        {/* Account & Profile */}
        <button
          className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/profile")}
        >
          Profile
        </button>
        <button
          className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/account-settings")}
        >
          Account Settings
        </button>

        {/* Export / Help */}
        <button
          className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/export-backup")}
        >
          Export / Backup
        </button>
        <button
          className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/help")}
        >
          Help & FAQ
        </button>
        <button
          className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
          onClick={() => router.push("/about")}
        >
          About / Version
        </button>

        {/* Logout button */}
        <button
        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-transform"
        onClick={async () => {
          try {
            await signOut(auth); // actually log out
            router.push("/login"); // redirect after logout
          } catch (err) {
            console.error("Failed to log out:", err);
          }
        }}
      >
        Log Out
      </button>


        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Preview NoteCard */}
        <button
          onClick={() => {
            onClose();
            router.push("/preview-note");
          }}
          className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
        >
          Preview NoteCard
        </button>

        {/* Close menu */}
        <button
          className="mt-2 p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
