"use client";

// Accepts a prop to switch between full-screen fixed and container-bound absolute positioning
export default function GridBackground({ inContainer = false }) {
  // Use 'absolute inset-0' when inside a parent container
  const positionClass = inContainer ? "absolute inset-0" : "fixed inset-0";

  return (
    <div className={`${positionClass} pointer-events-none z-0`}>
      {/* Main grid lines */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            /* Horizontal lines (Notebook lines) */
            linear-gradient(to bottom, transparent 29px, var(--color-muted) 30px),
            /* Vertical line (Margin line - optional) */
            linear-gradient(to right, var(--color-accent) 2px, transparent 2px)
          `,
          // 30px is a standard notebook line height
          backgroundSize: "100% 30px, 30px 100%", 
          backgroundPosition: "0 0, 30px 0", // Offset the vertical line to act as a margin
          opacity: 0.3, // Subtle effect
        }}
      />
    </div>
  );
}