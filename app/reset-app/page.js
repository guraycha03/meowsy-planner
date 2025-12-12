"use client";

import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

export default function ResetAppPage() {
  const router = useRouter();

  const resetStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--color-foreground)]">
        Reset Local Storage
      </h1>

      <button
        onClick={resetStorage}
        className="flex items-center gap-3 px-6 py-4 bg-orange-500 text-white rounded-2xl shadow-lg
        hover:bg-orange-600 hover:scale-105 transition-all duration-200"
      >
        <RefreshCcw size={24} /> Reset Local Storage (Fix Login Issues)
      </button>

      <p className="text-sm text-[var(--color-text-dark)] mt-4 text-center">
        This clears saved user data, settings, and cached sessions.  
        Useful when the app behaves incorrectly after updates.
      </p>
    </div>
  );
}
