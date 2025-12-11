// pages/notes/edit/EditNotePageContent.js - FIXED FOR RESPONSIVE SCALING

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { getNote, updateNote, deleteNote } from "../../lib/localNotes";
import { useEffect, useState, useRef } from "react"; // Added useRef
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Trash2, Save } from "lucide-react";

import GridBackground from "../../components/GridBackground";
import { v4 as uuidv4 } from "uuid";

import StickersPanel from "../../components/StickersPanel";

import Sticker from "../../components/Sticker";
import { Patrick_Hand } from "next/font/google";

const patrickHand = Patrick_Hand({ subsets: ["latin"], weight: "400" });


export default function EditNotePageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params.get("id");

const STICKER_SIZE = 50;

  const [note, setNote] = useState(null);
  const [stickers, setStickers] = useState([]);
  const contentRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(500); // Initial height


  useEffect(() => {
    if (!user || !id) return;

    const fetchedNote = getNote(id, user.id);
    if (fetchedNote) {
      Promise.resolve().then(() => {
        setNote(fetchedNote);
        // IMPORTANT: We now expect stickers to store xPercent and yPercent
        setStickers(fetchedNote.stickers || []);
      });
    }
  }, [id, user]);

  // --- NOTE AREA HEIGHT ADJUSTMENT ---
  useEffect(() => {
    // Function to adjust the note container height based on textarea content
    const adjustHeight = () => {
      if (contentRef.current) {
        // Reset height to recalculate scrollHeight
        contentRef.current.style.height = '0px'; 
        const newHeight = Math.max(500, contentRef.current.scrollHeight + contentRef.current.offsetHeight - contentRef.current.clientHeight);
        setContainerHeight(newHeight);
      }
    };

    // Initial adjustment and re-adjustment on content change
    adjustHeight();

    // Add resize observer to handle screen size changes (responsive container)
    const observer = new ResizeObserver(adjustHeight);
    const noteArea = document.getElementById("note-area");
    if (noteArea) observer.observe(noteArea);

    return () => {
      if (noteArea) observer.unobserve(noteArea);
    };

  }, [note?.content]); // Rerun when content changes

  // -----------------------------------


  if (!note) return <div className="p-6 text-center text-gray-500">Note not found.</div>;

  const save = () => {
    if (!note.title.trim() && !note.content.trim() && stickers.length === 0) {
      alert("Note cannot be empty!");
      return;
    }
    // IMPORTANT: Save also includes the final sticker positions, but they are already persisted in real-time.
    updateNote(id, { title: note.title, content: note.content }, user.id);
    router.push("/notes");
  };

  const addSticker = (src) => {
    setStickers(prev => {
      // Use percentage for initial position (10% from top/left)
      const newSticker = { id: uuidv4(), src, xPercent: 0.1, yPercent: 0.1 }; 
      const newStickers = [...prev, newSticker];
      setNote(prevNote => ({ ...prevNote, stickers: newStickers }));
      updateNote(id, { stickers: newStickers }, user.id);
      return newStickers;
    });
  };

  const handleStickerDrag = (stickerId, x, y) => {
    const container = document.getElementById("note-area");
    if (!container) return;
    
    // Calculate the available space for the sticker's top-left corner
    // This ensures that 100% means the sticker's right/bottom edge is at the container's edge.
    const containerWidth = container.clientWidth - STICKER_SIZE;
    const containerHeight = container.clientHeight - STICKER_SIZE;

    // Calculate percentage relative to the available space
    const xPercent = x / containerWidth;
    const yPercent = y / containerHeight;

    setStickers(prev => {
      const updated = prev.map(sticker =>
        // Ensure percentages don't go below 0 or above 1 (100%)
        sticker.id === stickerId ? { 
            ...sticker, 
            xPercent: Math.max(0, Math.min(xPercent, 1)), 
            yPercent: Math.max(0, Math.min(yPercent, 1)) 
        } : sticker
      );
      setNote(prevNote => ({ ...prevNote, stickers: updated }));
      updateNote(id, { stickers: updated }, user.id); 
      return updated;
    });
  };


  const remove = () => {
    if (window.confirm("Delete this note?")) {
      deleteNote(id, user.id);
      router.push("/notes");
    }
  };

  const buttonBaseClasses =
    "flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 w-auto justify-center";

  
          return (
  <div className="min-h-screen w-full p-6 pb-24 relative bg-[#f7f5f2]">
    <StickersPanel onAddSticker={addSticker} />

    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative z-10 p-6 rounded-2xl shadow-xl flex flex-col gap-6 bg-white border-2 border-[var(--color-card)]">
        
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center w-full gap-2">
          <button
            onClick={() => router.back()}
            className={`${buttonBaseClasses} px-5 py-2 bg-[var(--color-accent-light)] hover:bg-[var(--color-accent)] text-[var(--color-foreground)] font-semibold`}
          >
            <ArrowLeft className="h-5 w-5" />
            Back
          </button>

          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={remove}
              className={`${buttonBaseClasses} bg-red-400 hover:bg-red-500 text-white`}
            >
              <Trash2 className="h-5 w-5" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            <button
              onClick={save}
              className={`${buttonBaseClasses} bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white`}
            >
              <Save className="h-5 w-5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <input
          value={note.title}
          onChange={(e) => setNote({ ...note, title: e.target.value })}
          placeholder="Title"
          className={`w-full p-4 text-xl md:text-2xl font-bold rounded-xl border-2 border-[var(--color-card)] bg-[var(--color-accent-light)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none ${patrickHand.className} tracking-wide`}
        />

        {/* NOTE AREA - Height is dynamic */}
        <div
          id="note-area"
          className="relative w-full rounded-xl overflow-hidden"
          style={{ minHeight: `${containerHeight}px`, transition: 'min-height 0.2s ease-out' }}
        >
          <div className="absolute inset-0 z-0 pointer-events-none">
            <GridBackground inContainer={true} />
          </div>

          <textarea
            ref={contentRef}
            value={note.content}
            onChange={(e) => setNote({ ...note, content: e.target.value })}
            placeholder="Write your note here..."
            className={`relative z-20 w-full p-6 bg-transparent border-0 h-full resize-none outline-none text-lg sm:text-xl leading-relaxed ${patrickHand.className} tracking-wide`}
            style={{ minHeight: '500px', height: '100%' }}
          />

          {stickers.map((s) => (
            <Sticker
              key={s.id}
              id={s.id}
              src={s.src}
              initialXPercent={s.xPercent}
              initialYPercent={s.yPercent}
              onDragStop={handleStickerDrag}
              stickerSize={STICKER_SIZE}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

}