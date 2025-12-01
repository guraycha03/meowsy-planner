"use client";

import { useState, useEffect } from "react";
import QuickCreateModal from "../components/QuickCreateModal";
import NoteCard, { NOTE_STYLES } from "../components/NoteCard";
import DailyQuote from "../components/DailyQuote";
import GridBackground from "../components/GridBackground"; // import here

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(storedNotes);
  }, []);

  const getRandomStyle = () =>
    NOTE_STYLES[Math.floor(Math.random() * NOTE_STYLES.length)].id;

  return (
    <div className="relative min-h-screen bg-white">
      {/* Reusable Grid Background */}
      <GridBackground />

      {/* Content wrapper */}
      <div className="relative z-10 p-6 lg:p-12 max-w-full lg:max-w-[1200px] mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          Welcome, Meowsy!
        </h1>

        <DailyQuote />

        <section>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
            Your Notes
          </h2>

          {notes.length === 0 ? (
            <p className="text-[var(--color-muted)]">No notes yet.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  styleId={note.styleId || getRandomStyle()}
                  title={note.title || "Untitled Note"}
                >
                  <p className="text-[var(--color-foreground)] text-sm leading-relaxed">
                    {note.content || "Click to edit..."}
                  </p>
                </NoteCard>
              ))}
            </div>
          )}
        </section>

        <QuickCreateModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-8 w-16 h-16 rounded-full bg-[var(--color-accent-dark)] text-white text-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}
