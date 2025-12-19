"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { calculateChecklistProgress } from "../lib/checklistUtils";
import DateTimeCard from "../components/DateTimeCard";
import WelcomeCard from "../components/WelcomeCard";
import { CheckSquare, Heart } from "lucide-react";
import { QUOTES } from "../data/quotes";

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  
  // States
  const [isClient, setIsClient] = useState(false);
  const [fade, setFade] = useState(true);
  const [currentQuote, setCurrentQuote] = useState("");
  const [checklistProgress, setChecklistProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    progressPercent: 0
  });

  // Fixed Welcome Message logic to avoid hydration mismatch
  const WELCOME_MESSAGES = [
    "Welcome back! Wishing you a productive and organized day.",
    "Greetings! Ready to plan and accomplish your tasks efficiently?",
    "Hello! Let's make your day structured and inspiring.",
    "Welcome! Keep your focus and creativity flowing today.",
    "Good day! Time to tackle your notes and checklist with clarity."
  ];
  const [welcomeMessage] = useState(() => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]);

  // --- EFFECT 1: Initialization & Mounting ---
  useEffect(() => {
    setIsClient(true);
    // Set random quote once mounted
    setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  // --- EFFECT 2: Real-time Progress Syncing ---
  useEffect(() => {
    // Only run if we are on client and have a user
    if (!isClient || !user?.id) return;

    // Standardized function to fetch latest progress
    const updateProgress = () => {
      const data = calculateChecklistProgress(user.id);
      setChecklistProgress(data);
    };

    // Initial load of progress
    updateProgress();

    // Event Listeners for sync
    const handleSync = (e) => {
      // If it's a storage event, check the specific key
      if (e.key && e.key !== `plannerChecklist_${user.id}`) return;
      updateProgress();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("checklistUpdated", updateProgress);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("checklistUpdated", updateProgress);
    };
  }, [isClient, user?.id]);

  // --- EFFECT 3: Quote Rotation Logic ---
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setFade(true);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, [isClient]);

  // Prevent hydration mismatch by returning null until client-side
  if (!isClient) return null;

  return (
    <div className="relative w-full min-h-screen px-4 py-12 flex flex-col gap-8 pb-40"
         style={{
           backgroundImage: 'url("/images/home-contour-line.svg")',
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
           backgroundColor: "#ffffff",
         }}>
      <div className="flex flex-col lg:flex-row gap-8 relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          <WelcomeCard user={user} welcomeMessage={welcomeMessage} />

          {/* DateTimeCard Mobile */}
          <div className="flex justify-center mt-4 lg:hidden">
            <DateTimeCard />
          </div>

          {/* SYNCED CHECKLIST CARD */}
          <div
            onClick={() => router.push("/checklist")}
            className="group w-full p-6 rounded-2xl shadow-xl bg-white border-2 border-[var(--color-card)] relative overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] sm:max-w-md sm:mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[var(--color-dark-green)]">
                <CheckSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="text-lg font-bold">Today's Progress</span>
              </div>
              <span className="text-2xl font-black text-[var(--color-accent)]">
                {checklistProgress.progressPercent}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-3 w-full rounded-full bg-gray-100 relative shadow-inner overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[var(--color-accent-light)] to-[var(--color-accent)] transition-all duration-1000 ease-out"
                style={{ width: `${checklistProgress.progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-3">
               <p className="text-xs text-gray-400 italic">
                {checklistProgress.completedTasks === checklistProgress.totalTasks && checklistProgress.totalTasks > 0 
                  ? "✨ All tasks complete!" 
                  : "Keep going, you're doing great!"}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {checklistProgress.completedTasks} / {checklistProgress.totalTasks}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Inspiration */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-center mb-4 hidden lg:flex">
            <DateTimeCard />
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md bg-[#FEFDFB] rounded-3xl shadow-xl border-2 border-[#E3D5CA] overflow-hidden transition-all duration-500 hover:shadow-2xl"
                 style={{ minHeight: "340px" }}>
              
              {/* Scrapbook Washi Tape */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-9 z-20 rotate-[-1.5deg]"
                   style={{
                     backgroundImage: `repeating-linear-gradient(45deg, #ceebca 0, #ceebca 10px, #e9f7eb 10px, #e9f7eb 20px)`,
                     opacity: 0.85
                   }} />

              {/* Grid Header */}
              <div className="h-20 flex items-end justify-center pb-3 relative" 
                   style={{
                     backgroundColor: "#F9EAEA", 
                     backgroundImage: `linear-gradient(90deg, #E8D4D7 1px, transparent 1px), 
                                       linear-gradient(180deg, #E8D4D7 1px, transparent 1px)`,
                     backgroundSize: '16px 16px',
                   }}>
                <h3 className="text-xl font-bold tracking-[0.15em] text-[#93737C] uppercase"
                    style={{ fontFamily: `'Patrick Hand', cursive` }}>
                  Daily Inspiration
                </h3>
              </div>

              {/* Animated Quote Section */}
              <div className="p-10 flex flex-col items-center justify-center text-center relative min-h-[220px]">
                <span className="absolute top-6 left-8 text-7xl text-[#E3D5CA] opacity-30 font-serif">“</span>
                
                <div className={`transition-all duration-500 ease-in-out transform ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  <p className="text-[#4B3C34] font-['Patrick Hand', cursive] text-2xl md:text-3xl leading-relaxed italic"
                     dangerouslySetInnerHTML={{ __html: currentQuote }} />
                </div>
              </div>

              <button className="absolute bottom-6 left-8 text-[#D9A7A4] hover:scale-125 active:scale-90 transition-all">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}