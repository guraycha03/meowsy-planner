// pages/notes/edit/EditNotePageContent.js - FIXED FOR SCROLLING STICKERS

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { getNote, updateNote, deleteNote } from "../../lib/localNotes";
import { useEffect, useState, useRef } from "react";
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


  const [draggingStickerId, setDraggingStickerId] = useState(null);


const STICKER_SIZE = 50;

  const [note, setNote] = useState(null);
  const [stickers, setStickers] = useState([]);
  // We need a ref for the virtual scrollable content to get its height
  const noteContentRef = useRef(null); 
  // ADDED: Ref for the sticker container to measure its width for percentage calculations
  const virtualNoteContentRef = useRef(null); 
  const [virtualNoteHeight, setVirtualNoteHeight] = useState(500); // State for the height of the inner scrolling content

  useEffect(() => {
    if (!user || !id) return;

    const fetchedNote = getNote(id, user.id);
    if (fetchedNote) {
      Promise.resolve().then(() => {
        setNote(fetchedNote);
        setStickers(fetchedNote.stickers || []);
      });
    }
  }, [id, user]);

  // --- Content Height Calculation (Reintroduced to drive inner container height) ---
  useEffect(() => {
    const adjustHeight = () => {
      if (noteContentRef.current) {
        // Calculate the required height of the text area. 
        // We use scrollHeight to get the content's full height.
        const contentScrollHeight = noteContentRef.current.scrollHeight;
        
        // Set the virtual note height to be at least 500px, 
        // or the height needed to fit the content (plus a little padding).
        const newHeight = Math.max(500, contentScrollHeight + 40); // 40px buffer for bottom padding
        setVirtualNoteHeight(newHeight);
      }
    };

    adjustHeight();
    // Re-adjust height when content changes
    const timeoutId = setTimeout(adjustHeight, 0); // Ensure calculation runs after render

    return () => clearTimeout(timeoutId);
    
  }, [note?.content]);




const [textareaHeight, setTextareaHeight] = useState("auto");

useEffect(() => {
  if (noteContentRef.current) {
    noteContentRef.current.style.height = "auto"; // reset
    noteContentRef.current.style.height = noteContentRef.current.scrollHeight + "px"; // auto-grow
    setTextareaHeight(noteContentRef.current.scrollHeight + "px"); // optional, in case you want inline style
  }
}, [note?.content]);



  // --------------------------------------------------------------------------


  if (!note) return <div className="p-6 text-center text-gray-500">Note not found.</div>;

  const save = () => {
    if (!note.title.trim() && !note.content.trim() && stickers.length === 0) {
      alert("Note cannot be empty!");
      return;
    }
    // IMPORTANT: Update stickers array on save to ensure the latest positions are persisted
    updateNote(id, { title: note.title, content: note.content, stickers: stickers }, user.id);
    router.push("/notes");
  };



  const addSticker = (src) => {
  const container = document.getElementById("note-area");
  const content = document.getElementById("virtual-note-content");
  if (!container || !content) return;

  // Horizontal: spawn at 10% from left
  // Use virtualNoteContentRef for accurate width
  const contentWidth = virtualNoteContentRef.current ? virtualNoteContentRef.current.clientWidth : content.clientWidth;
  
  const x = 0.1 * (contentWidth - STICKER_SIZE);
  // Vertical: spawn at current scroll position + some offset (20px)
  const y = container.scrollTop + 20;

  // Convert to percentage of available area
  const xPercent = x / (contentWidth - STICKER_SIZE);
  // Use virtualNoteHeight for the container height, which represents the full note content area
  const yPercent = y / (virtualNoteHeight - STICKER_SIZE); 

  setStickers(prev => {
    // Ensure initial percentage is bounded between 0 and 1
    const newSticker = { 
      id: uuidv4(), 
      src, 
      xPercent: Math.max(0, Math.min(xPercent, 1)), // ADDED LIMITING
      yPercent: Math.max(0, Math.min(yPercent, 1))  // ADDED LIMITING
    };
    const newStickers = [...prev, newSticker];
    // No need to setNote here, as handleStickerDrag/save will handle persistence
    return newStickers;
  });
};


  const handleStickerDrag = (stickerId, x, y) => {
  if (x === -1 && y === -1) {
    // Delete sticker directly
    const updated = stickers.filter(s => s.id !== stickerId);
    setStickers(updated);
    // Persist immediately on delete for better UX
    updateNote(id, { stickers: updated }, user.id); 
    return;
  }

  // Use the ref for the sticker container to get accurate responsive width
  const container = virtualNoteContentRef.current;
  if (!container) return;

  // The total available space for the sticker's top-left corner
  const containerWidth = container.clientWidth - STICKER_SIZE;
  // Use virtualNoteHeight for the total height of the scrollable content area
  const containerHeight = virtualNoteHeight - STICKER_SIZE;

  // Calculate percentage of available drag space (0 to 1)
  const xPercent = x / containerWidth;
  const yPercent = y / containerHeight;

  setStickers(prev => {
    const updated = prev.map(sticker =>
      sticker.id === stickerId
        // The most important fix: Always clamp the percentages between 0 and 1 (100%)
        ? { 
            ...sticker, 
            xPercent: Math.max(0, Math.min(xPercent, 1)), 
            yPercent: Math.max(0, Math.min(yPercent, 1)) 
          }
        : sticker
    );
    // Update state immediately, persistence (updateNote) moved to save button for efficiency.
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
  "flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-transform hover:scale-105 active:scale-95 w-auto justify-center cursor-pointer touch-manipulation";

    
             return (
              <div className="w-full px-2 py-2 relative bg-[#f7f5f2]">
 
                {/* Sticker Toggle */}
                {/* Sticker Toggle - Updated to let clicks pass through the empty space */}
                <div
                  className="fixed bottom-4 flex items-center gap-2 z-[100] pointer-events-none"
                  style={{ right: "3rem" }}
                >
                  <div className="pointer-events-auto">
                    <StickersPanel onAddSticker={addSticker} />
                  </div>
                </div>





                <div className="relative w-full max-w-4xl mx-auto my-0">

                  <div className="relative z-10 p-3 mt-0 mb-0 rounded-2xl shadow-xl flex flex-col gap-2 bg-white border-2 border-[var(--color-card)]">


                  
                  {/* HEADER - Forced high z-index and disabled global transition for responsiveness */}
                  <div
                    className="sticky top-0 z-[2000] bg-white flex flex-wrap justify-between items-center gap-2 p-2"
                    style={{ transition: "none" }}
                  >

                    {/* Back Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation(); // Prevents the click from bubbling to the note area
                        router.back();
                      }}
                      className={`${buttonBaseClasses} px-5 py-2 bg-[var(--color-accent-light)] hover:bg-[var(--color-accent)] text-[var(--color-foreground)] font-semibold relative z-[1000]`}
                      style={{ transition: 'none' }}
                    >
                      <ArrowLeft className="h-5 w-5" />
                      <span>Back</span>
                    </button>

                  {/* Right-Side Buttons */}
                  <div className="flex gap-2">
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


                <input
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                  placeholder="Title"
                  className={`w-full p-2 text-xl md:text-2xl font-bold rounded-xl border-2 border-[var(--color-card)] bg-[var(--color-accent-light)] focus:ring-2 focus:ring-[var(--color-accent)] outline-none ${patrickHand.className} tracking-wide`}
                />

                {/* MAIN NOTE SCROLLABLE CONTAINER (The window) */}
                <div
                  id="note-area"
                  className="relative w-full rounded-xl border-2 border-[var(--color-card)] min-h-[450px] max-h-[65vh] overflow-y-auto"
                >

                  
                  {/* VIRTUAL NOTE CONTENT (The piece of paper) */}
 
  {/* VIRTUAL NOTE CONTENT */}
  <div
    id="virtual-note-content"
    ref={virtualNoteContentRef} 
    // ADDED: overflow-x-hidden to prevent horizontal stretching
    // Ensure w-full is used to take up the full container width
    className="relative w-full overflow-x-hidden" 
    style={{ minHeight: `${virtualNoteHeight}px` }}
  >
    {/* Grid Background - stays below */}
    <GridBackground inContainer={true} className="absolute inset-0 z-0 pointer-events-none" />

    {/* TEXTAREA */}
    <textarea
      ref={noteContentRef}
      value={note.content}
      onChange={(e) => setNote({ ...note, content: e.target.value })}
      placeholder="Write your note here..."
      className={`relative z-10 w-full p-4 bg-transparent border-0 outline-none text-lg sm:text-xl leading-relaxed ${patrickHand.className} tracking-wide`}
      style={{
        height: textareaHeight, 
        overflow: "hidden",
        resize: "none",
      }}
    />


    {/* Stickers */}
    {stickers.map((s) => (
      <Sticker
        key={s.id}
        id={s.id}
        src={s.src}
        initialXPercent={s.xPercent}
        initialYPercent={s.yPercent}
        onDragStop={handleStickerDrag}
        onDragStart={(id) => setDraggingStickerId(id)}
        stickerSize={STICKER_SIZE}
      />

    ))}


  </div>
</div>





          </div>
        </div>
      </div>
);

}