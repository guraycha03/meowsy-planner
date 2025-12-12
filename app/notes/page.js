"use client";

import { useRouter } from "next/navigation";
import { createNote, getAllNotes } from "../../lib/localNotes";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

import NotesGrid from "../../components/NotesGrid";

export default function NotesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      const all = getAllNotes(user.id); 
      setNotes(all);
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  const handleAddNote = () => {
    if (!user) return;
    const newNote = createNote(user.id);
    router.push(`/edit-note?id=${newNote.id}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto flex flex-col gap-8 min-h-[80vh] relative">

      {/* Floating label at the top */}
      <header className="page-title-label">
        Notes
      </header>

      {/* Notes Grid only; header buttons removed */}
      <div className="pt-[100px] flex flex-col gap-8">

        <NotesGrid notes={notes} />
      </div>

      {/* Floating Add Note Button */}
      <button
        onClick={handleAddNote}
        className="fixed bottom-24 right-4 px-5 py-3 rounded-full shadow-lg bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)] transition z-20"
      >
        + Add Note
      </button>
    </div>
  );
}
