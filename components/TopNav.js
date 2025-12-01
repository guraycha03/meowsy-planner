"use client";

import Image from "next/image";
import { MoreVertical, Home, Calendar, FileText, CheckSquare } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function TopNav() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home },
    { href: "/calendar", icon: Calendar },
    { href: "/notes", icon: FileText },
    { href: "/checklist", icon: CheckSquare },
  ];

  return (
    <>
      <header className="flex justify-between items-center sticky top-0 z-[1000] px-4 py-2 border-b-2 border-[rgba(160,160,160,0.2)] bg-[var(--color-background)]">

        {/* Left: Logo + App name */}
        <div className="flex items-center gap-3">
          <Image src="/images/meowsy-cat.png" alt="Meowsy" width={36} height={36} />
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-appname)" }}>
            Meowsy
          </h1>
        </div>

        {/* Right: Icons + 3-dot menu */}
        <div className="flex items-center gap-4">
          {/* Top nav icons for wide screens */}
          <div className="hidden lg:flex gap-4">
            {navItems.map(({ href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <button
                  key={href}
                  onClick={() => router.push(href)}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-[var(--color-accent-light2)] text-[rgba(104,89,85,0.9)]"
                      : "text-[var(--color-nav-inactive)] hover:text-[var(--color-dark-green)] hover:bg-[var(--color-accent-light)]"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                </button>
              );
            })}
          </div>

          {/* 3-dot menu always visible */}
          <button
            className="p-2 rounded-[18px] hover:bg-[var(--color-accent-light2)]"
            onClick={() => setIsPanelOpen(true)}
          >
            <MoreVertical className="w-5 h-5 text-[rgba(58,58,58,0.6)]" />
          </button>
        </div>
      </header>

      {/* Side panel */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 flex justify-end z-40"
          onClick={() => setIsPanelOpen(false)}
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
            <button
              className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
              onClick={() => alert("Signed Out!")}
            >
              Sign Out
            </button>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Preview NoteCard */}
            <button
              onClick={() => {
                setIsPanelOpen(false);
                router.push("/preview-note");
              }}
              className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform"
            >
              Preview NoteCard
            </button>

            {/* Close menu */}
            <button
              className="mt-2 p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
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
