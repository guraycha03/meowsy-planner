"use client";

import React from "react";

export const NOTE_STYLES = [
  {
    id: "cutesy-peach",
    headerColor: "#F7D9CD",
    borderColor: "#EABFA7",
    fontColor: "#4B3C34",
    radius: "xl",
  },
  {
    id: "minty",
    headerColor: "#DFF7E7",
    borderColor: "#B7E4C7",
    fontColor: "#3B5249",
    radius: "2xl",
  },
  {
    id: "sunshine",
    headerColor: "#FFF5CC",
    borderColor: "#FFE599",
    fontColor: "#7A5C00",
    radius: "lg",
  },
  {
    id: "lavender",
    headerColor: "#E9D9FF",
    borderColor: "#C9B3FF",
    fontColor: "#4B3066",
    radius: "xl",
  },
  {
    id: "coral",
    headerColor: "#FFD9D0",
    borderColor: "#FFA799",
    fontColor: "#66332F",
    radius: "xl",
  },
  {
    id: "sky",
    headerColor: "#D0E7FF",
    borderColor: "#A3C4FF",
    fontColor: "#1D3C6A",
    radius: "lg",
  },
  {
    id: "forest",
    headerColor: "#DFFFE1",
    borderColor: "#A8E6A2",
    fontColor: "#2F4F2F",
    radius: "2xl",
  },
  {
    id: "rose",
    headerColor: "#FFE0E8",
    borderColor: "#FFB3C6",
    fontColor: "#6A2C3A",
    radius: "xl",
  },
  {
    id: "buttercup",
    headerColor: "#FFF7D9",
    borderColor: "#FFE599",
    fontColor: "#7A5C00",
    radius: "xl",
  },
  {
    id: "aqua",
    headerColor: "#D0FFF5",
    borderColor: "#9DF0EB",
    fontColor: "#0C4A4A",
    radius: "2xl",
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
