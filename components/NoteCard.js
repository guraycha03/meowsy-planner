// components/NoteCard.js
// This component replicates the 9 unique, artistic note card designs using React and Tailwind CSS.
"use client";

import React, { useMemo } from "react";
// 1. IMPORT Next.js Image Component for optimized image loading
import Image from "next/image"; 

// --- 1. NOTE STYLES (9 Unique, Artistic Variants) ---
export const NOTE_STYLES = [
  { id: "blushing-pink", borderColor: "#EDCFD3", headerColor: "#ffe7e9", fontColor: "#4B3C34", cardBgColor: "#fcfcfc", variation: "index-card" }, 
  { id: "creamy-beige", borderColor: "#E3D5CA", headerColor: "#f7f5f2", fontColor: "#4B3C34", cardBgColor: "#fefefe", variation: "lined-card" }, 
  // --- UPDATED: New light range palette for Scrapbook Grid Header Note Card ---
  { id: "soft-pastel-grid", borderColor: "#E8D4D7", headerColor: "#F9EAEA", fontColor: "#93737C", cardBgColor: "#FEFDFB", variation: "scrapbook-card" },
  { id: "dusty-rose", borderColor: "#D9A7A4", headerColor: "#f9f0ef", fontColor: "#4B3C34", cardBgColor: "#f7f3e6", variation: "clipped-card" },
  { id: "minty-tape", borderColor: "#ceebca", headerColor: "#e9f7eb", fontColor: "#3B5249", cardBgColor: "#fcfcfc", variation: "washi-card" },
  { id: "soft-lilac", borderColor: "#CDB4DB", headerColor: "#f0e7f7", fontColor: "#4B3C34", cardBgBgColor: "#fdfdfd", variation: "stitched-card" },
  { id: "cozy-brown", borderColor: "#b8a39a", headerColor: "#fefefe", fontColor: "#4B3C34", cardBgColor: "#eee00d5", variation: "clipboard-card" },
  { id: "graph-coffee", borderColor: "#E8DCDC", headerColor: "#F5EFEB", fontColor: "#4B3C34", cardBgColor: "#fcfcfc", variation: "graph-card" },
  { id: "corner-dusty-rose", borderColor: "#D4B6C1", headerColor: "#F7EBF0", fontColor: "#4B3C34", cardBgColor: "#FEFDFB", variation: "corner-card" },
];

/**
 * Common Header for all NoteCard variants.
 * @param {object} props
 * @param {object} props.noteStyle - The selected style object from NOTE_STYLES (used for color).
 * @param {React.ReactNode} props.children - The title content.
 * @param {string} props.className - Additional Tailwind class names.
 * @param {object} props.customStyle - Any specific inline styles for this instance.
 */
const CommonCardHeader = ({ noteStyle, children, className = "", customStyle = {} }) => (
  <div
    // Merging base font color, applying 'Patrick Hand' font, and adding letter spacing
    className={`px-4 py-3 font-semibold text-lg z-10 ${className}`}
    style={{ 
      color: noteStyle.fontColor, 
      fontFamily: `'Patrick Hand', cursive`, 
      letterSpacing: '0.02em', // ADDED: Subtle letter spacing for the title
      ...customStyle 
    }}
  >
    {children ?? "Untitled Note"}
  </div>
);

/**
 * Common Content Area for all NoteCard variants.
 * @param {object} props
 * @param {React.ReactNode} props.children - The note content/preview.
 * @param {string} props.className - Additional class names.
 * @param {object} props.style - Specific inline styles for content.
 */
const CommonCardContent = ({ children, className = "", style = {} }) => (
  <div
    className={`p-4 flex-1 text-sm leading-relaxed z-5 relative ${className}`}
    // Base font color for content, applying 'Patrick Hand' font, and adding letter spacing
    style={{ 
      color: '#4B3C34', 
      fontFamily: `'Patrick Hand', cursive`, 
      letterSpacing: '0.05em', // ADDED: More noticeable letter spacing for content/preview
      ...style 
    }}
  >
    {children}
  </div>
);


/**
 * Renders one of the 9 custom note card designs.
 * @param {object} props
 * @param {string} props.styleId - ID of the style from NOTE_STYLES
 * @param {string} props.title - The title of the note
 * @param {React.ReactNode} props.children - The content/preview of the note
 * @param {string} props.href - The URL to navigate to on click
 */
export default function NoteCard({ styleId, title, children, href }) {
  // Check for the new ID first, fall back to the old one if needed for existing data
  const style = useMemo(() => 
    NOTE_STYLES.find((s) => s.id === styleId) || NOTE_STYLES.find((s) => s.id === "rosy-blush"), 
    [styleId]
  );

  if (!style) return null;

  // CSS Variables for Theming - used for certain background colors via var()
  const customStyles = {
    '--border-color': style.borderColor,
    '--header-color': style.headerColor,
    '--font-color': style.fontColor,
    '--card-bg-color': style.cardBgColor,
  };

  // Base card classes: responsive max-width, shadow, hover effects, cursor (Interactive UI)
  const baseClasses = `note-card flex flex-col w-full max-w-xs overflow-hidden rounded-lg shadow-xl transition-all duration-300 relative cursor-pointer
                         hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]`;


  // 1. Index Card
  if (style.variation === "index-card") {
    return (
      <a href={href} className={`${baseClasses} bg-white`} style={customStyles}>
        <CommonCardHeader 
          noteStyle={style} 
          className="border-b-2 border-dashed" 
          customStyle={{ borderColor: style.borderColor, backgroundColor: style.headerColor }} 
        >
          {title}
        </CommonCardHeader>
        <CommonCardContent>{children}</CommonCardContent>
      </a>
    );
  }

  // 2. Lined Notepad Paper (Hole Punched)
  if (style.variation === "lined-card") {
    const holePunchStyle = (top) => ({
      content: '""',
      position: 'absolute',
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#F8EDEB', // Matches body background
      border: '1px solid #ccc',
      left: '-5px',
      zIndex: 20,
      top: top,
    });
    
    return (
      <a 
        href={href} 
        className={`${baseClasses} rounded-md border-l-[5px] shadow-lg`} 
        style={{...customStyles, borderColor: style.borderColor, backgroundColor: style.cardBgColor}}
      >
        <div style={{ ...holePunchStyle('15%') }}></div>
        <div style={{ ...holePunchStyle('80%') }}></div>

        <CommonCardHeader noteStyle={style}>{title}</CommonCardHeader>
        <CommonCardContent 
          style={{ 
            backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent 20px, #a5d8ff 21px, #a5d8ff 22px)`,
            lineHeight: '23px', 
            paddingTop: '1.5rem',
          }}
        >
          {children}
        </CommonCardContent>
      </a>
    );
  }
  
  // 3. Scrapbook Grid Header Note Card
  if (style.variation === "scrapbook-card") {
    return (
      <a 
        href={href} 
        className={`${baseClasses} rounded-xl shadow-md p-0 overflow-hidden bg-white`} 
        style={customStyles}
      >
        {/* Header with grid pattern (Note: This is one of the exceptions that keeps its unique font) */}
        <div 
          className="h-10 flex items-center px-4 relative" 
          style={{
            backgroundColor: style.headerColor, // Base color
            // Using the lighter borderColor for the grid lines
            backgroundImage: `linear-gradient(90deg, ${style.borderColor} 1px, transparent 1px), 
                              linear-gradient(180deg, ${style.borderColor} 1px, transparent 1px)`,
            backgroundSize: '15px 15px',
            fontFamily: '"Parisienne", cursive', // KEEPING unique header font for design
            color: style.fontColor
          }}
        >
          {/* Apply Patrick Hand and letter spacing directly to the title span */}
          <span 
            className="font-bold text-lg" 
            style={{ 
              fontFamily: `'Patrick Hand', cursive`,
              letterSpacing: '0.02em', 
            }}
          >
            {title}
          </span>
          {/* Separator line, using the header font color which is now softer */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-0.5 opacity-50" 
            style={{ backgroundColor: style.fontColor }}
          ></div>
        </div>
        
        {/* Content area now uses 'Patrick Hand' and letter spacing via CommonCardContent's default */}
        <CommonCardContent className="pt-4">
          {children}
        </CommonCardContent>
      </a>
    );
  }

  // 4. Clipped Photo (Pin)
  if (style.variation === "clipped-card") {
    return (
      <a 
        href={href} 
        className={`${baseClasses} bg-[var(--card-bg-color)] pt-8 shadow-md`} 
        style={customStyles}
      >
        {/* Pin Image (Using Next.js Image component, ensuring proper import) */}
        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 rotate-[-10deg] w-8 h-8 z-10">
          <Image 
            src="/images/pushpin.png"
            alt="Push Pin Icon"
            // Since the parent div has w-8 h-8, use width/height props instead of 'fill'
            width={32} // Equivalent to w-8 (32px)
            height={32} // Equivalent to h-8 (32px)
            className="object-contain"
          />
        </div>

        
        <CommonCardHeader 
          noteStyle={style}
          className="" // Removed the border classes
          customStyle={{ borderColor: style.borderColor, fontStyle: 'italic', backgroundColor: 'transparent' }}
        >
          {title}
        </CommonCardHeader>
        <CommonCardContent>{children}</CommonCardContent>
      </a>
    );
  }

  // 5. Washi Tape Header
  if (style.variation === "washi-card") {
    return (
      <a 
        href={href} 
        className={`${baseClasses} bg-white border border-gray-200`} 
        style={customStyles}
      >
        <div 
          className="px-5 py-3 text-center text-xl font-bold shadow-md rounded-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${style.borderColor} 0, ${style.borderColor} 10px, ${style.headerColor} 10px, ${style.headerColor} 20px)`,
            color: style.fontColor,
            fontFamily: `'Patrick Hand', cursive`, // Applied the font here
            letterSpacing: '0.02em', // ADDED: Letter spacing for the title
          }}
        >
          {title}
        </div>
        {/* Content area now uses 'Patrick Hand' and letter spacing via CommonCardContent's default */}
        <CommonCardContent>{children}</CommonCardContent>
      </a>
    );
  }
  
  // 6. Stitched Border Card
  if (style.variation === "stitched-card") {
    return (
      <a 
        href={href} 
        className={`${baseClasses} bg-white shadow-none border-2 border-dashed rounded-2xl hover:shadow-lg`} 
        style={{...customStyles, borderColor: style.borderColor}}
      >
        <CommonCardHeader 
          noteStyle={style}
          className="rounded-t-xl border-b" 
          customStyle={{ backgroundColor: style.headerColor, borderColor: style.borderColor }}
        >
          {title}
        </CommonCardHeader>
        <CommonCardContent>{children}</CommonCardContent>
      </a>
    );
  }
  
  // 7. Clip Board Note
  if (style.variation === "clipboard-card") {
    return (
      <a 
        href={href} 
        className={`${baseClasses} bg-[var(--card-bg-color)] p-4 shadow-xl`} 
        style={customStyles}
      >
        <div className="bg-white rounded-md shadow-md overflow-hidden flex flex-col">
          <CommonCardHeader noteStyle={style} className="pt-3 pb-2">{title}</CommonCardHeader>
          <CommonCardContent className="pb-4">{children}</CommonCardContent>
        </div>
      </a>
    );
  }
  
  // 8. Graph Paper Note
  if (style.variation === "graph-card") {
    return (
      <a 
        href={href} 
        className={`${baseClasses} bg-white border border-gray-300`} 
        style={customStyles}
      >
        <CommonCardHeader 
          noteStyle={style}
          className="border-b-4" 
          customStyle={{ backgroundColor: style.headerColor, borderColor: style.borderColor }}
        >
          {title}
        </CommonCardHeader>
        <CommonCardContent 
          style={{ 
            backgroundImage: `
              repeating-linear-gradient(to right, transparent, transparent 19px, ${style.borderColor} 20px, ${style.borderColor} 21px),
              repeating-linear-gradient(to bottom, transparent, transparent 19px, ${style.borderColor} 20px, ${style.borderColor} 21px)
            `,
            lineHeight: '22px', 
            paddingTop: '1.5rem',
            opacity: 0.9, // Slightly fade the text over the grid
          }}
        >
          {children}
        </CommonCardContent>
      </a>
    );
  }
  
  // 9. Corner-Pinned Photo
  if (style.variation === "corner-card") {
    const cornerStyle = (clip, position) => ({
      content: '""',
      position: 'absolute',
      width: '30px',
      height: '30px',
      backgroundColor: style.headerColor,
      border: '2px solid ' + style.borderColor,
      clipPath: clip,
      zIndex: 10,
      ...position,
    });

    return (
      <a 
        href={href} 
        className={`${baseClasses} p-6 bg-[var(--card-bg-color)]`} 
        style={customStyles}
      >
        {/* Top Left Corner */}
        <div 
          style={{ ...cornerStyle('polygon(0 0, 100% 0, 0 100%)', { top: 0, left: 0, borderRight: 'none', borderBottom: 'none' }) }}
        ></div>
        {/* Bottom Right Corner */}
        <div 
          style={{ ...cornerStyle('polygon(100% 100%, 0% 100%, 100% 0%)', { bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none' }) }}
        ></div>

        <CommonCardHeader 
          noteStyle={style}
          className="border-b border-dotted" 
          customStyle={{ borderColor: style.borderColor, fontStyle: 'italic', backgroundColor: 'transparent', paddingLeft: 0, paddingRight: 0 }}
        >
          {title}
        </CommonCardHeader>
        <CommonCardContent className="p-0 pt-4">{children}</CommonCardContent>
      </a>
    );
  }
}