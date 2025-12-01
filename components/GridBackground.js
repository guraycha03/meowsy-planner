"use client";

export default function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Main grid lines */}
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ebd9d18f 2px, transparent 4px),
            linear-gradient(to bottom, #ebd9d18f 2px, transparent 4px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.6,
        }}
      />
      {/* Optional subtle rough effect */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"4\" height=\"4\"><line x1=\"0\" y1=\"0\" x2=\"4\" y2=\"4\" stroke=\"%23b8e0d2\" stroke-width=\"0.5\"/></svg>')",
          opacity: 0.2,
        }}
      />
    </div>
  );
}
