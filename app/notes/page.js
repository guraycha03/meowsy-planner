// pages/notes/index.js (Full and Fixed Code)
"use client";

import { useRouter } from "next/navigation";
import { createNote, getAllNotes } from "../../lib/localNotes"; // Assuming this utility is available
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"; // Assuming AuthContext is available
// Import the new modular components
import NotesHeader from "../../components/NotesHeader"; 
import NotesGrid from "../../components/NotesGrid";


export default function NotesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);

  // 1. Fetch Notes (Client-Side)
  useEffect(() => {
    // Only fetch if a user is logged in
    if (!user) return;
    
    // Load notes locally without blocking UI (simulates async data fetch)
    const timer = setTimeout(() => {
      // NOTE: Ensure getAllNotes is robust if user.id is null/undefined
      const all = getAllNotes(user.id); 
      setNotes(all);
    }, 0);
    
    return () => clearTimeout(timer);
  }, [user]);

  // 2. Handle Add Note Logic: Creates a new note and redirects to the edit page
  const handleAddNote = () => {
    if (!user) return;
    const newNote = createNote(user.id);
    router.push(`/edit-note?id=${newNote.id}`);
  };

  // 3. Render Modular Structure
  // Responsive layout with a defined max-width
  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto flex flex-col gap-8 min-h-[80vh]">
      
      {/* HEADER SECTION (Modularized) */}
      <NotesHeader onAddNote={handleAddNote} /> 

      {/* NOTES GRID SECTION (Modularized) */}
      <NotesGrid notes={notes} />
      
    </div>
  );
}