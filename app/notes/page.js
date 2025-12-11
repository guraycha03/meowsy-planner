"use client";

import { useRouter } from "next/navigation";
import { createNote, getAllNotes } from "../../lib/localNotes";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

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
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Your Notes</h1>
        <button
          onClick={handleAddNote}
          className="px-5 py-2 bg-[var(--color-accent-dark2)] text-white rounded-xl shadow hover:scale-105 transition-transform"
        >
          + Add Note
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length > 0 ? (
          notes.map((note) => (


            <div
              key={note.id}
              className="
                p-5 rounded-2xl shadow-sm 
                bg-[var(--color-accent-light2)]
                border border-[var(--color-accent-light)]
                hover:shadow-md hover:scale-[1.01]
                transition-all cursor-pointer
                flex flex-col
              "
              onClick={() => router.push(`/edit-note?id=${note.id}`)}
            >
              <h3 className="font-semibold text-lg mb-2 text-[var(--color-foreground)] truncate">
                {note.title || "Untitled"}
              </h3>

              <p className="text-sm text-gray-600 line-clamp-4">
                {note.content || "No content yet."}
              </p>
            </div>



          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">No notes yet.</p>
        )}
      </div>
    </div>
  );
}
