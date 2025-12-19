"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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

  // --- 1. STATE INITIALIZATION ---
  const [mounted, setMounted] = useState(false);
  const [fade, setFade] = useState(true);
  const [currentQuote, setCurrentQuote] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  
  const [checklistProgress, setChecklistProgress] = useState({
    totalTasks: 0,
    completedTasks: 0,
    progressPercent: 0
  });

  const WELCOME_MESSAGES = useMemo(() => [
    "Welcome back! Wishing you a productive and organized day.",
    "Greetings! Ready to plan and accomplish your tasks efficiently?",
    "Hello! Let's make your day structured and inspiring.",
    "Welcome! Keep your focus and creativity flowing today.",
    "Good day! Time to tackle your notes and checklist with clarity."
  ], []);

  // --- 2. THE FIX: ASYNC INITIALIZATION ---
  // By using a small timeout or ensuring the logic is grouped, we prevent
  // the "cascading render" warning which happens when React thinks 
  // an effect is fighting with the initial render.
  useEffect(() => {
    const initPage = () => {
      // 1. Mark as mounted
      setMounted(true);
      
      // 2. Set Random Strings (Client-Side Only)
      const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
      const randomWelcome = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
      
      setCurrentQuote(randomQuote);
      setWelcomeMessage(randomWelcome);

      // 3. Initial Progress Load
      if (user?.id) {
        const data = calculateChecklistProgress(user.id);
        setChecklistProgress(data);
      }
    };

    // Use requestAnimationFrame to ensure the browser has painted the "loading"
    // state before we trigger the client-side state updates.
    requestAnimationFrame(() => {
        initPage();
    });
  }, [user, WELCOME_MESSAGES]);

  // --- 3. SYNC LOGIC (FOR EXTERNAL UPDATES) ---
  const updateProgress = useCallback(() => {
    if (!user?.id) return;
    const data = calculateChecklistProgress(user.id);
    setChecklistProgress(data);
  }, [user]);

  useEffect(() => {
    if (!mounted || !user?.id) return;

    const handleSync = (e) => {
      if (e && e.key && e.key !== `plannerChecklist_${user?.id}`) return;
      updateProgress();
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("checklistUpdated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("checklistUpdated", handleSync);
    };
  }, [mounted, user, updateProgress]);

  // --- 4. QUOTE ROTATION ---
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
        setFade(true);
      }, 500);
    }, 7000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Render a clean shell while mounting to maintain UX responsiveness
  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

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
        
        {/* Left Column: Greeting & Progress */}
        <div className="flex-1 flex flex-col gap-6">
          <WelcomeCard user={user} welcomeMessage={welcomeMessage} />

          <div className="flex justify-center mt-4 lg:hidden">
            <DateTimeCard />
          </div>

          <div
            onClick={() => router.push("/checklist")}
            className="group w-full p-6 rounded-2xl shadow-xl bg-white border-2 border-[#E3D5CA] relative overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] sm:max-w-md sm:mx-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-[#4B3C34]">
                <CheckSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                <span className="text-lg font-bold">Today&apos;s Progress</span>
              </div>
              <span className="text-2xl font-black text-[#D9A7A4]">
                {checklistProgress.progressPercent}%
              </span>
            </div>

            <div className="h-3 w-full rounded-full bg-gray-100 relative shadow-inner overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[#E8D4D7] to-[#D9A7A4] transition-all duration-[1500ms] ease-in-out"
                style={{ width: `${checklistProgress.progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-3">
               <p className="text-xs text-gray-400 italic">
                {checklistProgress.completedTasks === checklistProgress.totalTasks && checklistProgress.totalTasks > 0 
                  ? "✨ All tasks complete!" 
                  : "Keep going, you&apos;re doing great!"}
              </p>
              <p className="text-xs font-medium text-gray-500">
                {checklistProgress.completedTasks} / {checklistProgress.totalTasks}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Date & Quote */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex justify-center mb-4 hidden lg:flex">
            <DateTimeCard />
          </div>

          <div className="flex justify-center">
            <div className="relative w-full max-w-md bg-[#FEFDFB] rounded-3xl shadow-xl border-2 border-[#E3D5CA] overflow-hidden transition-all duration-500 hover:shadow-2xl"
                 style={{ minHeight: "340px" }}>
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-9 z-20 rotate-[-1.5deg]"
                   style={{
                     backgroundImage: `repeating-linear-gradient(45deg, #ceebca 0, #ceebca 10px, #e9f7eb 10px, #e9f7eb 20px)`,
                     opacity: 0.85
                   }} />

              <div className="h-20 flex items-end justify-center pb-3 relative" 
                   style={{
                     backgroundColor: "#F9EAEA", 
                     backgroundImage: `linear-gradient(90deg, #E8D4D7 1px, transparent 1px), 
                                       linear-gradient(180deg, #E8D4D7 1px, transparent 1px)`,
                     backgroundSize: '16px 16px',
                   }}>
                <h3 className="text-xl font-bold tracking-[0.15em] text-[#93737C] uppercase font-appname">
                  Daily Inspiration
                </h3>
              </div>

              <div className="p-10 flex flex-col items-center justify-center text-center relative min-h-[220px]">
                <span className="absolute top-6 left-8 text-7xl text-[#E3D5CA] opacity-30 font-serif">“</span>
                <div className={`transition-all duration-500 ease-in-out transform ${fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                  <p className="text-[#4B3C34] text-2xl md:text-3xl leading-relaxed italic font-appname">
                    {currentQuote}
                  </p>
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