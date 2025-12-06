"use client";

import React from "react";

export const NOTE_STYLES = [
  {
    id: "cutesy-peach",
    headerColor: "#fff6f2ff",
    borderColor: "#f3c5afff",
    fontColor: "#4B3C34",
    radius: "xl",
  },
  {
    id: "minty",
    headerColor: "#e9f7ebff",
    borderColor: "#ceebcaff",
    fontColor: "#3B5249",
    radius: "2xl",
  },
  {
    id: "sunshine",
    headerColor: "#f7f3e6ff",
    borderColor: "#eed58aff",
    fontColor: "#7A5C00",
    radius: "lg",
  },
  {
    id: "lavender",
    headerColor: "#ede6f7ff",
    borderColor: "#9683ccff",
    fontColor: "#4B3066",
    radius: "xl",
  },
  {
    id: "coral",
    headerColor: "#FFD9D0",
    borderColor: "#f1a282ff",
    fontColor: "#66332F",
    radius: "xl",
  },
  {
    id: "sky",
    headerColor: "#edf3f8ff",
    borderColor: "#ced9ecff",
    fontColor: "#1D3C6A",
    radius: "lg",
  },

  {
    id: "rose",
    headerColor: "#fff2f5ff",
    borderColor: "#fdd5dfff",
    fontColor: "#6A2C3A",
    radius: "xl",
  },
 
];

export default function NoteCard({ styleId, title, children }) {
  const style = NOTE_STYLES.find((s) => s.id === styleId);

  if (!style) return null;

  return (
    <div
      className="flex flex-col w-64 border shadow-md overflow-hidden transition-transform hover:scale-105"
      style={{
        borderColor: style.borderColor,
        borderWidth: "2px",
        borderRadius:
          style.radius === "2xl"
            ? "1rem"
            : style.radius === "xl"
            ? "0.75rem"
            : "0.5rem",
      }}
    >
      {/* Header now uses the NOTE TITLE */}
      <div
        className="px-4 py-2 font-bold text-lg truncate"
        style={{
          backgroundColor: style.headerColor,
          color: style.fontColor,
        }}
      >
        {title ?? "Untitled Note"}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 text-[var(--color-foreground)] text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}
