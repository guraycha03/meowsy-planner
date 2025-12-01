"use client";

import { useState } from "react";
import QuickCreateModal from "../components/QuickCreateModal";
import NoteCard from "../components/NoteCard";
import DailyQuote from "../components/DailyQuote"; // adjust path if needed



export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // SAMPLE NOTES — later you can fetch these from DB
  const notes = [
    {
      id: "n1",
      styleId: "lavender",
      title: "Birthday Ideas",
      content: "Buy cat-themed balloons 🍥",
    },
    {
      id: "n2",
      styleId: "minty",
      title: "Groceries",
      content: "Milk • Eggs • Tuna • Coffee",
    },
    {
      id: "n3",
      styleId: "rose",
      title: "Projects",
      content: "Projects Projects Projects >.<",
    },
  ];

  return (
    <div className="p-6 lg:p-12 max-w-full lg:max-w-[1200px] mx-auto space-y-8">
  <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
    Welcome, Meowsy!
  </h1>

  {/* Daily Quote */}
  <DailyQuote />

  {/* Notes */}
  <section>
    <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
      Your Notes
    </h2>
    <div className="grid md:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard key={note.id} styleId={note.styleId} title={note.title}>
          <p className="text-[var(--color-foreground)] text-sm leading-relaxed">
            {note.content}
          </p>
        </NoteCard>
      ))}
    </div>
  </section>

  {/* Quick Add Modal */}
  <QuickCreateModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

  {/* Floating Create Button */}
  <button
    onClick={() => setIsModalOpen(true)}
    className="fixed bottom-24 right-8 w-16 h-16 rounded-full bg-[var(--color-accent-dark)] text-white text-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
  >
    +
  </button>
</div>




  );
}
