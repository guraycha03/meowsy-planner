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
    updateNote(id, { title: note.title, content: note.content }, user.id);
    router.push("/notes");
  };



  const addSticker = (src) => {
  const container = document.getElementById("note-area");
  const content = document.getElementById("virtual-note-content");
  if (!container || !content) return;

  // Horizontal: spawn at 10% from left
  const x = 0.1 * (content.clientWidth - STICKER_SIZE);
  // Vertical: spawn at current scroll position + some offset (20px)
  const y = container.scrollTop + 20;

  // Convert to percentage of available area
  const xPercent = x / (content.clientWidth - STICKER_SIZE);
  const yPercent = y / (content.clientHeight - STICKER_SIZE);

  setStickers(prev => {
    const newSticker = { id: uuidv4(), src, xPercent, yPercent };
    const newStickers = [...prev, newSticker];
    setNote(prevNote => ({ ...prevNote, stickers: newStickers }));
    updateNote(id, { stickers: newStickers }, user.id);
    return newStickers;
  });
};


  const handleStickerDrag = (stickerId, x, y) => {
  if (x === -1 && y === -1) {
    // Delete sticker directly
    setStickers(prev => prev.filter(s => s.id !== stickerId));
    setNote(prevNote => ({
      ...prevNote,
      stickers: prevNote.stickers.filter(s => s.id !== stickerId)
    }));
    updateNote(id, { stickers: stickers.filter(s => s.id !== stickerId) }, user.id);
    return;
  }

  const container = document.getElementById("virtual-note-content");
  if (!container) return;

  const containerWidth = container.clientWidth - STICKER_SIZE;
  const containerHeight = virtualNoteHeight - STICKER_SIZE;

  const xPercent = x / containerWidth;
  const yPercent = y / containerHeight;

  setStickers(prev => {
    const updated = prev.map(sticker =>
      sticker.id === stickerId
        ? { ...sticker, xPercent: Math.max(0, Math.min(xPercent, 1)), yPercent: Math.max(0, Math.min(yPercent, 1)) }
        : sticker
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
            <div className="w-full px-2 py-2 relative bg-[#f7f5f2]">
 
              {/* Sticker Toggle */}
              <div
                className="fixed bottom-4 flex items-center gap-2 z-[100]"
                style={{ right: "3rem" }} // moves it 32px from the edge
              >
                <StickersPanel onAddSticker={addSticker} />
              </div>





              <div className="relative w-full max-w-4xl mx-auto my-0">

               <div className="relative z-10 p-3 mt-0 mb-0 rounded-2xl shadow-xl flex flex-col gap-2 bg-white border-2 border-[var(--color-card)]">


              
              {/* Header and Title unchanged... */}
              {/* HEADER */}
              <div className="flex flex-wrap justify-between items-center w-full gap-1 mt-0 mb-1">


              {/* Back Button */}
              <button
                onClick={() => router.back()}
                className={`${buttonBaseClasses} px-5 py-2 bg-[var(--color-accent-light)] hover:bg-[var(--color-accent)] text-[var(--color-foreground)] font-semibold`}
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
    className="relative w-full"
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