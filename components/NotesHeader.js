// components/NotesHeader.js
// Handles the page title and the Add Note button logic.
"use client";

import { Plus } from "lucide-react";

export default function NotesHeader({ onAddNote }) {
  // Define the stable class string for the interactive button
  const buttonClass = `
    flex items-center gap-2 px-5 py-2 bg-[#EDA8B1] text-white rounded-full shadow-lg font-semibold text-base
    transition-all duration-300 
    hover:bg-[#D9A7A4] hover:scale-[1.05] 
    active:scale-[0.95]
  `.replace(/\s+/g, ' ').trim(); // Clean up the string for stability

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D9A7A4]">
        My Cutesy Notes
      </h1>
      
      {/* INTERACTIVE ADD NOTE BUTTON (Fixed Class Structure) */}
      <button
        onClick={onAddNote}
        // Using the defined stable class string
        className={buttonClass}
      >
        <Plus className="h-5 w-5" />
        <span>Add New Note</span>
      </button>
    </div>
  );
}