"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { getNote, updateNote, deleteNote } from "../../lib/localNotes";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Trash2, Save } from "lucide-react"; // ShadCN / lucide-react icons
import GridBackground from "../../components/GridBackground";

export default function EditNotePage() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.get("id");

  const [note, setNote] = useState(null);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      const fetchedNote = getNote(id, user.id);
      setNote(fetchedNote);
    }, 0);
    return () => clearTimeout(timer);
  }, [id, user]);

  if (!note) return <div className="p-6 text-center text-gray-500">Note not found.</div>;

  const save = () => {
    if (!note.title.trim() && !note.content.trim()) {
      alert("Note cannot be empty!");
      return;
    }
    updateNote(id, note, user.id);
    router.push("/notes");
  };

  const remove = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(id, user.id);
      router.push("/notes");
    }
  };

  return (
    <div
      className="min-h-screen w-full p-6 flex justify-center"
      style={{ backgroundColor: "#f7f5f2" }} // plain page background
    >
      <div className="relative w-full max-w-4xl">
        {/* Main Note Container */}
        <div className="relative z-10 p-6 rounded-2xl shadow-xl flex flex-col gap-6 bg-white border-2 border-[var(--color-card)]">
          
          {/* Buttons */}
          <div className="flex justify-end gap-3 w-full">
            <button
              onClick={remove}
              className="flex items-center gap-2 px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-full shadow-md hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Trash2 className="h-5 w-5" />
              <span className="hidden sm:inline">Delete</span>
            </button>


            <button
              onClick={save}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white rounded-full shadow hover:shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Save className="h-5 w-5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>

      
          {/* Title */}
          <input
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="Title"
            className="w-full p-4 text-xl md:text-2xl font-bold rounded-xl border-2 border-[var(--color-card)] bg-[var(--color-accent-light)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
            style={{
              fontFamily: "var(--font-appname)",
              letterSpacing: "1.2px", // increased spacing for title
            }}
          />


          {/* Textarea with grid */}
          <div className="relative w-full rounded-xl overflow-hidden">
            {/* Grid background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <GridBackground inContainer={true} />
            </div>

            {/* Textarea */}
            <textarea
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              placeholder="Write your note here..."
              className="relative z-10 w-full p-4 md:p-6 bg-transparent border-0 min-h-[500px] resize-none focus:ring-2 focus:ring-[var(--color-accent)] outline-none text-lg sm:text-xl leading-relaxed"
              style={{
                fontFamily: "var(--font-appname)",
                lineHeight: "28px", // align text with grid
                letterSpacing: "0.5px", // subtle spacing for the note text
              }}
            />

            {/* Stickers */}
            <div className="absolute inset-0 z-20 pointer-events-auto">
                <StickerContainer />
            </div>

          </div>



        </div>
      </div>
    </div>
  );
}
