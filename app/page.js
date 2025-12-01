"use client";

import { useState } from "react";
import QuickCreateModal from "../components/QuickCreateModal";
import NoteCard, { NOTE_STYLES } from "../components/NoteCard";
import DailyQuote from "../components/DailyQuote";
import GridBackground from "../components/GridBackground";

// Lazy initializer function for notes
function getInitialNotes() {
  const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  return storedNotes.map((note) => ({
    ...note,
    styleId: note.styleId || NOTE_STYLES[Math.floor(Math.random() * NOTE_STYLES.length)].id,
  }));
}

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notes, setNotes] = useState(() => getInitialNotes()); // lazy init

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background */}
      <GridBackground />

      {/* Main content */}
      <div className="relative z-10 p-6 lg:p-12 max-w-full lg:max-w-[1200px] mx-auto space-y-8">
        {/* Greeting */}
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          Welcome, Meowsy!
        </h1>

        {/* Daily Quote */}
        <DailyQuote />

        {/* Notes Section */}
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
                  styleId={note.styleId}
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

        {/* Quick Create Modal */}
        <QuickCreateModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

        {/* Floating Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-24 right-8 w-16 h-16 rounded-full bg-[var(--color-accent-dark)] text-white text-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20"
        >
          +
        </button>
      </div>
    </div>
  );
}
