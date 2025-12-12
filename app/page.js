// pages/index.js (HomePage)
"use client";

import { useEffect, useState } from "react";
import { QUOTES } from "../data/quotes"; 
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getAllNotes } from "../lib/localNotes";
import { calculateChecklistProgress } from "../lib/checklistUtils"; // Import the utility

import DateTimeCard from "../components/DateTimeCard"; 
import { CheckSquare } from "lucide-react"; // Import Icon

const LIGHT_BG_COLORS = [
  "#fff5f1", // A warm, light pinkish-white
  "#edf3e9ff", // A soft, light greenish-white
  "#fef3e7", // A creamy, light yellow
  "#f5ece3ff", // A pale beige
  "#f7f0ff" // A light lavender
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [bgColor, setBgColor] = useState(() => LIGHT_BG_COLORS[Math.floor(Math.random() * LIGHT_BG_COLORS.length)]);
  const [fade, setFade] = useState(false); 
  // New State for Checklist Progress
  const [checklistProgress, setChecklistProgress] = useState(calculateChecklistProgress()); 

  const WELCOME_MESSAGES = [
    "Hope you have a productive day!",
    "Let's make today amazing!",
    "Ready to create some awesome notes?",
    "Your creativity awaits!",
    "Time to organize your thoughts!"
  ];
  const [welcomeMessage] = useState(() => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]);

  // 🌟 FIX: Function to safely encode HTML special characters, especially quotes 🌟
  const encodeHTML = (str) => {
    if (!str) return '';
    // Replace special characters with HTML entities to prevent rendering issues
    return str
      .replace(/&/g, "&amp;") 
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;") 
      .replace(/'/g, "&#039;"); 
  };
  
  // SSR fix (deferred)
  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Load notes
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      const allNotes = getAllNotes(user.id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setNotes(allNotes);
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  // Load Checklist Progress (Trigger refresh when component mounts or gains focus)
  useEffect(() => {
    // This function will refresh the checklist progress every time the page loads or returns to focus
    const refreshProgress = () => {
        setChecklistProgress(calculateChecklistProgress());
    };

    // Load once on mount
    refreshProgress();

    // Listen for storage changes (e.g., if user checks an item on the checklist page)
    window.addEventListener('storage', refreshProgress); 
    return () => window.removeEventListener('storage', refreshProgress);
  }, []);


  // Quote & background animation
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true); 
      setTimeout(() => {
        setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setBgColor(LIGHT_BG_COLORS[Math.floor(Math.random() * LIGHT_BG_COLORS.length)]);
        setFade(false);
      }, 500);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div 
      className="relative w-full min-h-screen px-4 py-12 flex flex-col gap-8 pb-40 transition-colors duration-1000"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex flex-col lg:flex-row gap-8 relative z-10 max-w-6xl mx-auto w-full">
        {/* Left Column (Welcome & Stats) */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Welcome Message Card */}
          <div className="p-6 text-center rounded-2xl shadow-lg relative mx-auto w-full"
               style={{
                 backgroundColor: "var(--color-accent-light)",
                 border: "2px dashed var(--color-accent-dark)",
                 outline: "10px solid var(--color-accent-light)",
                 maxWidth: "90%",
                 minWidth: "280px",
               }}>
            <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-appname)" }}>
              Welcome back, {user?.displayName || user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className="text-base opacity-90">{welcomeMessage}</p>
          </div>

          <div className="flex justify-center mt-4">
            <DateTimeCard />
          </div>

          {/* CHECKLIST PROGRESS CARD (New addition) */}
          <div 
            onClick={() => router.push("/checklist")} // Interactive: Click to go to checklist
            className="w-full p-4 rounded-2xl shadow-xl bg-white border-2 border-[var(--color-card)] relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] sm:max-w-md sm:mx-auto"
          >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-[var(--color-dark-green)]">
                    <CheckSquare className="w-6 h-6" />
                    <span className="text-lg font-bold">Overall Checklist Progress</span>
                </div>
                <span className="text-xl font-extrabold text-[var(--color-accent)]">{checklistProgress.progressPercent}%</span>
            </div>

            {/* Progress Track (Same premium style) */}
            <div className="h-2 w-full rounded-full bg-gray-100 relative">
              <div 
                className="absolute top-0 left-0 h-full rounded-full bg-[var(--color-accent)] transition-all duration-500 ease-out shadow-inner"
                style={{ width: `${checklistProgress.progressPercent}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm text-gray-500 text-right">
              {checklistProgress.completedTasks} of {checklistProgress.totalTasks} tasks completed.
            </p>
          </div>


          {/* Action Buttons (Interactive) */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* My Notes Button */}
            <button 
              onClick={() => router.push("/notes")}
              className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl shadow-md font-semibold
                          hover:bg-[var(--color-accent-dark)] transition-all transform hover:scale-105 active:scale-95"
            >
              My Notes
            </button>
            {/* Add Note Button (Interactive) */}
            <button 
              onClick={() => router.push("/edit-note")}
              className="px-6 py-3 bg-[var(--color-accent-dark2)] text-white rounded-xl shadow-md font-semibold
                          hover:bg-[var(--color-foreground)] transition-all transform hover:scale-105 active:scale-95"
            >
              + Add Note
            </button>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Total Notes */}
            <div className="p-4 bg-[var(--color-accent-light)] rounded-xl shadow-md text-center flex-1 min-w-[120px]">
              <h3 className="font-bold">Total Notes</h3>
              <p className="text-3xl text-[var(--color-accent-dark2)] font-bold mt-1">{notes.length}</p>
            </div>
            {/* Last Edited */}
            <div className="p-4 bg-[var(--color-accent-light)] rounded-xl shadow-md text-center flex-1 min-w-[120px]">
              <h3 className="font-bold">Last Edited</h3>
              <p className="text-lg text-gray-700 mt-2">
                {notes.length > 0 
                  // Use the first element (most recent) from the sorted array
                  ? new Date(notes[0].updatedAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (Quote of the Day) */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-center lg:mt-8 mt-4">
            <div className="relative max-w-md w-full bg-[var(--color-accent-light2)]
                            rounded-2xl shadow-xl p-8
                            border-2 border-[var(--color-card)]
                            flex flex-col items-center text-center
                            transition-colors duration-300 hover:shadow-2xl">
              
              <h3 className="text-sm font-light uppercase tracking-widest text-[var(--color-accent-dark)] mb-4">Daily Inspiration</h3>
              
              <p 
                className="text-[var(--color-foreground)] font-['Patrick Hand'] text-xl md:text-2xl leading-relaxed italic"
                dangerouslySetInnerHTML={{ __html: `&ldquo;${encodeHTML(currentQuote)}&rdquo;` }}
              />
              
              <div className="w-16 h-1 bg-[var(--color-accent)] rounded-full mt-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}