"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { Settings, Archive, HelpCircle, Info, LogOut, RefreshCcw } from "lucide-react";

export default function SidePanel({ isOpen, onClose }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const buttonClasses = `flex items-center gap-3 p-3 bg-[var(--color-accent-dark2)] text-white rounded-xl shadow
    hover:bg-[var(--color-accent-dark)] hover:scale-105 hover:shadow-lg transition-all duration-200`;

  const logoutClasses = `flex items-center gap-3 p-3 bg-red-500/80 text-white rounded-xl shadow
    hover:bg-red-500/90 hover:scale-105 hover:shadow-lg transition-all duration-200`;

  const resetClasses = `flex items-center gap-3 p-3 bg-orange-500/80 text-white rounded-xl shadow
    hover:bg-orange-500/90 hover:scale-105 hover:shadow-lg transition-all duration-200`;

  return (
    <div className="fixed inset-0 z-[1000] flex justify-end">
      <div
        className="absolute inset-0 bg-[rgba(255,255,255,0.08)] backdrop-blur-[1px]"
        onClick={onClose}
      />

      <div
        className="relative bg-gradient-to-b from-[var(--color-accent-light2)] to-[var(--color-accent-light)]
        w-72 h-full p-6 shadow-2xl flex flex-col space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Card */}
        {user && (
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white font-bold text-xl">
              {user.username ? user.username[0].toUpperCase() : "U"}
            </div>
            <h3 className="font-bold text-lg text-[var(--color-foreground)]">
              {user.username || "User"}
            </h3>
            <p className="text-sm text-[var(--color-text-dark)] truncate">{user.email}</p>
          </div>
        )}

        {/* Tools */}
        <div className="flex flex-col gap-3">
          <button className={buttonClasses} onClick={() => router.push("/account-settings")}>
            <Settings size={20} /> Account Settings
          </button>
          <button className={buttonClasses} onClick={() => router.push("/export-backup")}>
            <Archive size={20} /> Export / Backup
          </button>
          <button className={buttonClasses} onClick={() => router.push("/help")}>
            <HelpCircle size={20} /> Help & FAQ
          </button>
          <button className={buttonClasses} onClick={() => router.push("/about")}>
            <Info size={20} /> About / Version
          </button>
        </div>

        {/* Logout (if user exists) */}
        {user && (
          <button
            className={logoutClasses}
            onClick={() => {
              logout();
              router.push("/login");
            }}
          >
            <LogOut size={20} /> Log Out
          </button>
        )}

        {/* Always available fallback */}
        <button className={resetClasses} onClick={() => router.push("/reset-app")}>
          <RefreshCcw size={20} /> Reset App Storage
        </button>
      </div>
    </div>
  );
}
