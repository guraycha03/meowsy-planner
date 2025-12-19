"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getAllNotes } from "../lib/localNotes";
import { calculateChecklistProgress } from "../lib/checklistUtils";
import DateTimeCard from "../components/DateTimeCard";
import WelcomeCard from "../components/WelcomeCard";
import { CheckSquare } from "lucide-react";
import { QUOTES } from "../data/quotes";

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  const [currentQuote, setCurrentQuote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [checklistProgress, setChecklistProgress] = useState(calculateChecklistProgress());
  const WELCOME_MESSAGES = [
    "Welcome back! Wishing you a productive and organized day.",
    "Greetings! Ready to plan and accomplish your tasks efficiently?",
    "Hello! Let's make your day structured and inspiring.",
    "Welcome! Keep your focus and creativity flowing today.",
    "Good day! Time to tackle your notes and checklist with clarity."
  ];
  const [welcomeMessage] = useState(() => WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)]);

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      const allNotes = getAllNotes(user.id).sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setChecklistProgress(calculateChecklistProgress());
    }, 0);

    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

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

          {/* DateTimeCard on small screens */}
          <div className="flex justify-center mt-4 lg:hidden">
            <DateTimeCard />
          </div>

          {/* Checklist */}
          <div
            onClick={() => router.push("/checklist")}
            className="w-full p-4 rounded-2xl shadow-xl bg-white border-2 border-[var(--color-card)] relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] sm:max-w-md sm:mx-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-[var(--color-dark-green)]">
                <CheckSquare className="w-6 h-6" />
                <span className="text-lg font-bold">Overall Checklist Progress</span>
              </div>
              <span className="text-xl font-extrabold text-[var(--color-accent)]">{checklistProgress.progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 relative">
              <div className="absolute top-0 left-0 h-full rounded-full bg-[var(--color-accent)] transition-all duration-500 ease-out"
                   style={{ width: `${checklistProgress.progressPercent}%` }}/>
            </div>
            <p className="mt-2 text-sm text-gray-500 text-right">
              {checklistProgress.completedTasks} of {checklistProgress.totalTasks} tasks completed.
            </p>
          </div>
        </div>

        {/* Right Column - Daily Inspiration */}
        <div className="flex-1 flex flex-col gap-6">
          {/* DateTimeCard on large screens above quote board */}
          <div className="flex justify-center mb-4 hidden lg:flex">
            <DateTimeCard />
          </div>

          <div className="flex justify-center">
  <div
    className="relative w-full max-w-md shadow-lg rounded-3xl border-2 border-[#d2b48c]
               flex flex-col items-center text-center bg-[#f4e1c1] overflow-hidden"
    style={{ minHeight: "280px" }}
  >
    {/* Board texture */}
    <div
      className="absolute inset-0 bg-no-repeat bg-center opacity-20 pointer-events-none"
      style={{
        backgroundImage: 'url("/images/noteboard-bg.png")',
        backgroundSize: "cover",
      }}
    />

    <h3 className="relative z-10 text-sm font-light uppercase tracking-widest text-[#a07850] mt-4 mb-2">
      Daily Inspiration
    </h3>

    {/* Sticky note */}
    <div
      className="relative z-10 w-11/12 max-w-[90%] p-5 bg-[#fffef9] shadow-md rounded-2xl transform rotate-[1.5deg]"
      style={{
        minHeight: "80px",
        maxHeight: "180px",
        overflowY: "auto",
      }}
    >
      {/* Washi tape */}
      <div
        className="absolute -top-3 left-1/4 w-1/2 h-3 rounded-md shadow-sm"
        style={{
          backgroundImage: 'url("/images/washi-tape.png")',
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      <p
        className="text-[#5a4a32] font-['Patrick Hand', cursive] text-lg md:text-xl leading-relaxed italic break-words"
        dangerouslySetInnerHTML={{ __html: `&ldquo;${currentQuote}&rdquo;` }}
      />
    </div>

    {/* Optional cute pin */}
    <div
      className="absolute top-2 right-6 w-3 h-3 bg-pink-300 rounded-full shadow-md z-20"
      style={{ transform: "rotate(-15deg)" }}
    ></div>
  </div>
</div>


          
        </div>

      </div>
    </div>
  );
}
