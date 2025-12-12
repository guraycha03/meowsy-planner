// components/NotesGrid.js
// Displays the list of notes using the NoteCard component.
"use client";

import NoteCard, { NOTE_STYLES } from "./NoteCard";

export default function NotesGrid({ notes }) {
  if (notes.length === 0) {
    return (
      <p className="text-gray-500 col-span-full text-center py-10">
        Create your first note to see it displayed here!
      </p>
    );
  }

  return (
    // RESPONSIVE GRID CONTAINER for Note Cards
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
      {notes.map((note, index) => {
        // Cycle through all 9 available styles
        const styleId = NOTE_STYLES[index % NOTE_STYLES.length].id;
        
        return (
          <NoteCard
            key={note.id}
            styleId={styleId}
            title={note.title || "Untitled"}
            href={`/edit-note?id=${note.id}`}
          >
            {/* Note content preview */}
            <p className="line-clamp-3 text-sm text-[#4B3C34] mb-2">
              {note.content || "No content yet. Click to edit."}
            </p>

            {/* Sticker preview */}
            {note.stickers?.length > 0 && (
              <div className="flex flex-wrap mt-2 gap-1 justify-end">
                {note.stickers.slice(0, 5).map((s, i) => (
                  <img
                    key={i}
                    src={s.src}
                    alt="sticker"
                    className="w-6 h-6 object-cover rounded-full shadow-sm"
                  />
                ))}
                {note.stickers.length > 5 && (
                  <span className="text-xs text-gray-500 ml-1 mt-1">+{note.stickers.length - 5}</span>
                )}
              </div>
            )}
          </NoteCard>
        );
      })}
    </div>
  );
}