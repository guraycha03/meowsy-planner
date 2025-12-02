"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

function EditNotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = Number(searchParams.get("id"));
  const isNewNote = searchParams.get("new");

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [note, setNote] = useState(() => {
    if (typeof window === "undefined") return { title: "", content: "" };
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const existing = storedNotes.find((n) => n.id === noteId);
    return existing ? { title: existing.title, content: existing.content } : { title: "", content: "" };
  });

  const setTitle = (t) => setNote((prev) => ({ ...prev, title: t }));
  const setContent = (c) => setNote((prev) => ({ ...prev, content: c }));

  const saveNote = () => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updated = storedNotes.filter((n) => n.id !== noteId);
    updated.push({ id: noteId, ...note });
    localStorage.setItem("notes", JSON.stringify(updated));
    router.push("/notes");
  };

  const confirmDelete = () => setShowDeleteModal(true);

  const deleteNote = () => {
    const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    const updated = storedNotes.filter((n) => n.id !== noteId);
    localStorage.setItem("notes", JSON.stringify(updated));
    router.push("/notes");
  };

  if (!noteId) return null;

  return (
    <div className="flex flex-col items-center min-h-screen px-4 py-8 bg-[var(--color-background)]">

      {/* Top Bar */}
      {/* Top Bar */}
<div className="w-full max-w-[1200px] flex items-center justify-between mb-6">

  {/* BACK BUTTON (left) */}
  <button
    onClick={() => router.push("/notes")}
    className="
      p-3 rounded-xl 
      bg-[var(--color-accent-light)] 
      border border-[var(--color-muted)] 
      shadow-sm 
      hover:shadow-md hover:scale-[1.03] 
      transition-all duration-200
    "
  >
    <ArrowLeft className="w-6 h-6 opacity-70" />
  </button>

  {/* RIGHT ACTION GROUP */}
  <div className="flex items-center gap-3">
    {/* DELETE BUTTON (only for existing notes) */}
    {!isNewNote && (
      <button
        onClick={confirmDelete}
        className="
          p-3 rounded-xl 
          bg-red-50 
          border border-red-200 
          shadow-sm 
          hover:shadow-md hover:scale-[1.03] 
          transition-all duration-200
        "
      >
        <Trash2 className="w-6 h-6 text-red-400 opacity-80" />
      </button>
    )}

    {/* SAVE BUTTON */}
    <button
      onClick={saveNote}
      className="
        px-6 py-3 rounded-xl 
        bg-[var(--color-accent)] 
        text-white font-semibold 
        hover:bg-[var(--color-accent-dark)] 
        transition
      "
    >
      Save
    </button>
  </div>
</div>


      {/* NOTE TITLE */}
      {/* NOTE TITLE */}
<input
  type="text"
  placeholder="Title"
  value={note.title}
  onChange={(e) => setTitle(e.target.value)}
  className="
    w-full max-w-[1200px] p-4 mb-4 text-lg font-bold font-[var(--font-sans)]
    rounded-xl border-2 border-[var(--color-muted)]
    bg-white/60
    focus:border-[var(--color-accent)] focus:bg-white
    outline-none transition-all duration-200
    placeholder:opacity-60
  "
/>

{/* NOTE CONTENT */}
<textarea
  placeholder="Write your note here..."
  value={note.content}
  onChange={(e) => setContent(e.target.value)}
  className="
    w-full max-w-[1200px] p-4 h-64 font-[var(--font-sans)]
    rounded-xl border-2 border-[var(--color-muted)]
    bg-white/60 resize-none
    focus:border-[var(--color-accent)] focus:bg-white
    outline-none transition-all duration-200
    placeholder:opacity-60
  "
/>

      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-[var(--color-muted)] w-[90%] max-w-md text-center">
            <h2 className="text-lg font-semibold mb-4 text-[var(--color-text-dark)]">
              Delete this note?
            </h2>
            <p className="text-sm opacity-80 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-[var(--color-accent-light)] border border-[var(--color-muted)]"
              >
                Cancel
              </button>
              <button
                onClick={deleteNote}
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditNotePage />
    </Suspense>
  );
}
