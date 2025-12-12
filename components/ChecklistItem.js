// components/ChecklistItem.js
"use client";

import { Check } from "lucide-react";

export default function ChecklistItem({ item, onToggle }) {
  // Determine if the item text should have a specific class for completion
  const textClass = item.completed
    ? "line-through text-gray-500 italic"
    : "text-[var(--color-foreground)]";
  
  // Custom Checkbox Style - Premium, tactile feedback
  const checkboxClass = item.completed
    ? "bg-[var(--color-dark-green)] border-[var(--color-dark-green)] shadow-md" // Checked state
    : "bg-white border-gray-400 hover:border-[var(--color-accent)]"; // Unchecked state

  return (
    <li 
        // Entire row is clickable and provides visual feedback on hover/click (Interactive)
        className={`flex items-center gap-4 py-3 cursor-pointer transition-all duration-300 rounded-lg px-2 -mx-2 ${item.completed ? 'opacity-70 hover:opacity-100' : 'hover:bg-gray-50'}`} 
        onClick={onToggle}
    >
      
      {/* Custom, Interactive Checkbox */}
      <div 
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${checkboxClass} active:scale-90`}
      >
        <Check 
          className={`w-4 h-4 text-white transition-opacity duration-200 ${item.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
        />
      </div>

      {/* Task Text */}
      <p className={`flex-grow text-lg sm:text-xl font-medium ${textClass}`}>
        {item.text}
      </p>

    </li>
  );
}