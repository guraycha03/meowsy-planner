"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function EditNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = Number(searchParams.get("id"));

  // Lazy initializer to load note from localStorage
  const getInitialNote = () => {
    if (typeof window === "undefined") return { title: "", content: "" }; // SSR safety
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const note = storedNotes.find((n) => n.id === noteId);
    return note ? { title: note.title, content: note.content } : { title: "", content: "" };
  };

  const [{ title, content }, setNote] = useState(getInitialNote);

  const setTitle = (t) => setNote((prev) => ({ ...prev, title: t }));
  const setContent = (c) => setNote((prev) => ({ ...prev, content: c }));

  const saveNote = () => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updatedNotes = storedNotes.filter((n) => n.id !== noteId);
    updatedNotes.push({ id: noteId, title, content });
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    router.push("/notes");
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 bg-[var(--color-background)]">
      <div className="w-full max-w-[1200px] flex justify-between items-center mb-6">
        <button
          onClick={() => router.push("/notes")}
          className="px-4 py-2 rounded bg-[var(--color-muted)] text-[var(--color-foreground)] font-semibold"
        >
          Back
        </button>
        <button
          onClick={saveNote}
          className="px-4 py-2 rounded bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-dark)]"
        >
          Save
        </button>
      </div>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full max-w-[1200px] p-4 mb-4 text-lg font-bold border rounded"
      />
      <textarea
        placeholder="Write your note here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full max-w-[1200px] p-4 h-64 border rounded resize-none"
      />
    </div>
  );
}
