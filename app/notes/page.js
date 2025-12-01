"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import NoteCard, { NOTE_STYLES } from "../../components/NoteCard";

// Lazy initializer function for notes
function getInitialNotes() {
  if (typeof window === "undefined") return []; // SSR safety
  const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
  return storedNotes.map((note) => ({
    ...note,
    styleId: note.styleId || NOTE_STYLES[Math.floor(Math.random() * NOTE_STYLES.length)].id,
  }));
}

export default function NotesPage() {
  const router = useRouter();
  const [notes, setNotes] = useState(() => getInitialNotes()); // lazy state init

  const addNote = () => {
    const newId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
    router.push(`/edit-note?id=${newId}&new=true`);
  };

  const removeNote = (id) => {
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const previewNote = (id) => router.push(`/edit-note?id=${id}`);

  return (
    <div className="flex flex-col items-center min-h-screen w-full px-4 sm:px-8 py-8 bg-[var(--color-background)] relative">
      <header className="fixed top-12 left-1/2 -translate-x-1/2 inline-block px-6 py-3 text-[1rem] font-semibold text-[var(--color-dark-green)] bg-[var(--color-accent-light)] border-2 border-dashed border-[var(--color-muted)] rounded-b-[28px] shadow-[0_6px_16px_rgba(0,0,0,0.08)] z-9">
        Notes
      </header>

      <div className="mt-24 flex flex-col items-center w-full max-w-[1200px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {notes.map((note) => (
            <div key={note.id} onClick={() => previewNote(note.id)} className="cursor-pointer">
              <NoteCard styleId={note.styleId} title={note.title || "Untitled Note"}>
                {note.content || "Click to edit..."}
              </NoteCard>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeNote(note.id);
                }}
                className="mt-2 self-end text-red-600 hover:text-red-800 font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="flex flex-col items-center mt-12 text-[var(--color-muted)]">
            <p>No notes yet. Click + Add Note to create one.</p>
          </div>
        )}
      </div>

      {/* Floating Add Note Button */}
      <button
        type="button"
        onClick={addNote}
        className="fixed bottom-24 right-8 px-6 py-4 rounded-full font-semibold shadow-lg text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] transition z-10"
      >
        + Add Note
      </button>
    </div>
  );
}
