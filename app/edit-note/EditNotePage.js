// app/edit-note/EditNotePage.js

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { getNote, updateNote, deleteNote } from "../../lib/localNotes"; 
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Trash2, Save } from "lucide-react";
import GridBackground from "../../components/GridBackground";
import dynamic from "next/dynamic";
import { v4 as uuidv4 } from 'uuid'; 

// Dynamically import StickerContainer & Sticker
const StickerContainer = dynamic(() => import("../../components/StickerContainer"), { ssr: false });
const Sticker = dynamic(() => import("../../components/Sticker"), { ssr: false });

// Define sticker size (used for centering the drop position)
const STICKER_SIZE = 80;

export default function EditNotePageContent() {
  // This component is now wrapped in <Suspense>
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  // Safe use of useSearchParams inside a Suspense boundary
  const id = params.get("id"); 

  const [note, setNote] = useState(null);
  const [stickers, setStickers] = useState([]);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      const fetchedNote = getNote(id, user.id);
      setNote(fetchedNote);
      setStickers(fetchedNote?.stickers || []); 
    }, 0);
    return () => clearTimeout(timer);
  }, [id, user]);

  if (!note) return <div className="p-6 text-center text-gray-500">Note not found.</div>;

  const save = () => {
    if (!note.title.trim() && !note.content.trim()) {
      alert("Note cannot be empty!");
      return;
    }
    updateNote(id, { ...note, stickers }, user.id); 
    router.push("/notes");
  };

  const remove = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNote(id, user.id);
      router.push("/notes");
    }
  };

  // Drag-and-Drop Handler
  const handleDropSticker = (e) => {
    e.preventDefault();
    
    const stickerSrc = e.dataTransfer.getData("application/x-sticker-src");
    if (!stickerSrc) return; 

    // Get the note container's position and boundaries
    const noteRect = e.currentTarget.getBoundingClientRect();
    
    // Calculate drop position relative to the note container, centered on cursor
    let dropX = e.clientX - noteRect.left - (STICKER_SIZE / 2);
    let dropY = e.clientY - noteRect.top - (STICKER_SIZE / 2);

    // Constrain within note bounds (better UX)
    dropX = Math.max(0, Math.min(dropX, noteRect.width - STICKER_SIZE));
    dropY = Math.max(0, Math.min(dropY, noteRect.height - STICKER_SIZE));

    setStickers(prevStickers => [...prevStickers, { 
      id: uuidv4(), 
      src: stickerSrc, 
      x: dropX, 
      y: dropY 
    }]);
  };

  const handleDragOver = (e) => {
    // Necessary to allow dropping
    e.preventDefault(); 
  };


  const handleStickerMove = (stickerId, newX, newY) => {
    setStickers(prevStickers => 
      prevStickers.map(sticker => 
        sticker.id === stickerId ? { ...sticker, x: newX, y: newY } : sticker
      )
    );
  };

  return (
    // pb-24 ensures space below the note container
    <div className="min-h-screen w-full p-6 pb-24 relative" style={{ backgroundColor: "#f7f5f2" }}>
      <StickerContainer /> 

      {/* 🌟 Drop Target Area 🌟 */}
      <div 
        className="relative w-full max-w-4xl mx-auto"
        onDragOver={handleDragOver} // Allows dropping
        onDrop={handleDropSticker}  // Handles the drop and positioning
      >
  
        <div className="relative z-10 p-6 rounded-2xl shadow-xl flex flex-col gap-6 bg-white border-2 border-[var(--color-card)]">
          
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

          <input
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="Title"
            className="w-full p-4 text-xl md:text-2xl font-bold rounded-xl border-2 border-[var(--color-card)] bg-[var(--color-accent-light)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
            style={{ fontFamily: "var(--font-appname)", letterSpacing: "1.2px" }}
          />

          <div className="relative w-full rounded-xl overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <GridBackground inContainer={true} />
            </div>
            
            {/* Text Area (z-20 is always on top) */}
            <textarea
              value={note.content}
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              placeholder="Write your note here..."
              className="relative z-20 w-full p-4 md:p-6 bg-transparent border-0 min-h-[500px] resize-none focus:ring-2 focus:ring-[var(--color-accent)] outline-none text-lg sm:text-xl leading-relaxed"
              style={{
                fontFamily: "var(--font-appname)",
                lineHeight: "28px",
                letterSpacing: "0.5px",
              }}
            />

            {/* Sticker Wrapper (z-10 is behind the text) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {stickers.map((sticker) => (
                // Sticker component must allow pointer events to be draggable
                <Sticker
                  key={sticker.id} 
                  id={sticker.id} 
                  src={sticker.src}
                  initialX={sticker.x}
                  initialY={sticker.y}
                  onStopDrag={handleStickerMove} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}