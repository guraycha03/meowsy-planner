"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import NoteCard, { NOTE_STYLES } from "../components/NoteCard";
import { QUOTES } from "../data/quotes";
import { useAuth } from "../context/AuthContext";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useRouter } from "next/navigation";

const LIGHT_BG_COLORS = ["#fff5f1", "#e3f0db", "#fef3e7", "#f0d9c4", "#f7f0ff"];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const [notes, setNotes] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);
  const [bgColor, setBgColor] = useState(LIGHT_BG_COLORS[0]);
  const [fade, setFade] = useState(false);

  // Firestore: Real-time notes fetching
  useEffect(() => {
    if (!user) return;
    setIsClient(true);

    const notesRef = collection(db, "users", user.uid, "notes");
    const q = query(notesRef, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        styleId: doc.data().styleId || NOTE_STYLES[Math.floor(Math.random() * NOTE_STYLES.length)].id,
      }));
      setNotes(list);
    });

    return () => unsubscribe();
  }, [user]);

  // Daily Quote rotation
  useEffect(() => {
    const getRandomQuote = () => QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const getRandomBg = () => LIGHT_BG_COLORS[Math.floor(Math.random() * LIGHT_BG_COLORS.length)];

    const interval = setInterval(() => {
      setFade(true);
      const timeout = setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setBgColor(getRandomBg());
        setFade(false);
      }, 500);
      return () => clearTimeout(timeout);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full px-4 py-12 flex flex-col md:flex-row md:items-start md:gap-8 lg:gap-16">
      {/* Welcome Section */}
      <div
        className="flex flex-col items-center md:items-center gap-4 p-6 bg-white shadow-lg"
        style={{
          borderRadius: "1.5rem",
          border: "3px solid var(--color-muted)",
          minWidth: "280px",
        }}
      >
        <h2 className="text-2xl md:text-3xl font-bold opacity-80 text-center">
          Welcome Back{user?.displayName ? `, ${user.displayName}` : user?.email ? `, ${user.email}` : ""}!
        </h2>
        <div className="flex justify-center w-full">
          <Image
            src="/images/cat_img.png"
            alt="Cat illustration"
            width={150}
            height={150}
            className="rounded-2xl"
          />
        </div>

        {/* Notes Section */}
        <div className="mt-6 w-full flex flex-col gap-4">
          {notes.length > 0 ? (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                styleId={note.styleId}
                title={note.title || "Untitled Note"}
                onClick={() => router.push(`/edit-note?id=${note.id}`)}
              >
                {note.content || "Click to edit..."}
              </NoteCard>
            ))
          ) : (
            <div
              className="p-4 text-center text-[var(--color-muted)] bg-white rounded-xl border-2 border-[var(--color-muted)]"
            >
              No notes yet. Click + Add Note to create one.
            </div>
          )}
        </div>
      </div>

      {/* Daily Quote Section */}
      <div className="flex justify-center w-full md:w-1/2 mt-8 md:mt-0">
        <div
          className="w-full p-6 shadow-lg flex flex-col items-center"
          style={{
            borderRadius: "1.5rem",
            border: "3px solid var(--color-muted)",
            backgroundColor: bgColor,
            minHeight: "6rem",
          }}
        >
          <h2 className="text-lg md:text-xl font-semibold opacity-70 mb-3 text-center">
            Daily Quote
          </h2>
          <p
            className={`text-sm md:text-base italic text-center transition-opacity duration-500 ease-in-out ${
              fade ? "opacity-0" : "opacity-100"
            }`}
          >
            {currentQuote}
          </p>
        </div>
      </div>
    </div>
  );
}
