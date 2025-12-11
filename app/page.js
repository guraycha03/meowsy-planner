"use client";

import { useEffect, useState } from "react";
import { QUOTES } from "../data/quotes";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { getAllNotes } from "../lib/localNotes";

import DateTimeCard from "../components/DateTimeCard";


const LIGHT_BG_COLORS = ["#fff5f1", "#edf3e9ff", "#fef3e7", "#f5ece3ff", "#f7f0ff"];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [notes, setNotes] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const [bgColor, setBgColor] = useState(LIGHT_BG_COLORS[0]);
  const [fade, setFade] = useState(false);

  const WELCOME_MESSAGES = [
    "Hope you have a productive day!",
    "Let's make today amazing!",
    "Ready to create some awesome notes?",
    "Your creativity awaits!",
    "Time to organize your thoughts!"
  ];

  const [welcomeMessage, setWelcomeMessage] = useState("");

  // Random welcome message and initial quote
  useEffect(() => {
    const randomWelcomeIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    const randomQuoteIndex = Math.floor(Math.random() * QUOTES.length);
    setWelcomeMessage(WELCOME_MESSAGES[randomWelcomeIndex]);
    setCurrentQuote(QUOTES[randomQuoteIndex]);
  }, []);

  // SSR fix
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load notes
  useEffect(() => {
    if (!isClient || !user) return;
    const allNotes = getAllNotes(user.id);
    setNotes(allNotes);
  }, [isClient, user]);

  // Quote animation
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
      className="relative w-full min-h-screen px-4 py-12 flex flex-col gap-8 pb-40"
      style={{ backgroundColor: "white" }}
    >


      {/* Top Section: Welcome + Clock on left, Quote + Stats on right */}
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Left Column */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Welcome card with dashed border and outline */}
          <div
            className="p-6 text-center rounded-2xl shadow-lg relative mx-auto w-full"
            style={{
              backgroundColor: "var(--color-accent-light)",
              border: "2px dashed var(--color-accent-dark)",
              outline: "10px solid var(--color-accent-light)",
              maxWidth: "90%",
              minWidth: "280px",
            }}
          >
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.displayName ? user.displayName : user?.email?.split("@")[0] || "User"}!
            </h1>
            <p className="text-base opacity-90">{welcomeMessage}</p>
          </div>

          {/* Date & Time card */}
          <div className="flex justify-center mt-4">
            <DateTimeCard />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/notes")}
              className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl shadow hover:scale-105 transition-transform"
            >
              My Notes
            </button>
            <button
              onClick={() => router.push("/edit-note")}
              className="px-6 py-3 bg-[var(--color-accent-dark2)] text-white rounded-xl shadow hover:scale-105 transition-transform"
            >
              + Add Note
            </button>
          </div>

          {/* Stats Panel */}
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="p-4 bg-[var(--color-accent-light)] rounded-xl shadow text-center flex-1">
              <h3 className="font-bold">Total Notes</h3>
              <p className="text-2xl">{notes.length}</p>
            </div>
            <div className="p-4 bg-[var(--color-accent-light)] rounded-xl shadow text-center flex-1">
              <h3 className="font-bold">Last Edited</h3>
              <p>{notes.length ? new Date(notes[notes.length - 1].updatedAt).toLocaleDateString() : "-"}</p>
            </div>
          </div>

        </div>

            


        {/* Right Column */}
        <div className="flex-1 flex flex-col gap-6">
          

          {/* Calendar Section */}
           

            {/* Minimalistic Quote Card */}
          <div className="flex justify-center mt-8">
            <div className="relative max-w-md w-full bg-[var(--color-accent-light2)]
                            rounded-2xl shadow-md p-6
                            border border-transparent
                            flex flex-col items-center text-center
                            transition-colors duration-300 hover:bg-[var(--color-accent-light)]">
              
              {/* Quote Text */}
              <p className={`text-[var(--color-foreground)] font-[Patrick Hand] text-lg md:text-xl leading-relaxed`}>
                "{currentQuote}"
              </p>

              {/* Optional subtle underline for aesthetic touch */}
              <div className="w-16 h-1 bg-[var(--color-accent)] rounded-full mt-4"></div>
            </div>
          </div>


          

      


        </div>
      </div>

      {/* Removed notes grid since we only have buttons now */}
    </div>
  );
}
