// app/preview-note/page.js
"use client";

import NoteCard, { NOTE_STYLES } from "@/components/NoteCard";

export default function PreviewNotePage() {
  return (
    <div className="flex flex-col items-center p-6 min-h-screen bg-[var(--color-background)] gap-6">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
        NoteCard Preview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full justify-center">
        {NOTE_STYLES.map((style) => (
          <NoteCard key={style.id} styleId={style.id} title={`Preview: ${style.id}`}>
            <p className="text-sm opacity-50">
              This is a preview of the {style.headerText} style.
            </p>
          </NoteCard>
        ))}
      </div>
    </div>
  );
}
