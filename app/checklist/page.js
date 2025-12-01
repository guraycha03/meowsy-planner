import Image from "next/image";

export default function ChecklistPage() {
  return (
    <div className="flex flex-col items-center min-h-screen w-full px-4 sm:px-8 py-8 bg-[var(--color-background)] relative">
      
      {/* Fixed Checklist Label */}
      <header
        className="
          fixed top-12 left-1/2 -translate-x-1/2
          inline-block px-6 py-3 text-[1rem] font-semibold
          text-[var(--color-dark-green)] bg-[var(--color-accent-light)]
          border-2 border-dashed border-[var(--color-muted)]
          rounded-b-[28px] shadow-[0_6px_16px_rgba(0,0,0,0.08)]
          z-9
        "
      >
        Checklist
      </header>

      {/* Page content */}
      <div className="mt-24 flex flex-col items-center">
        <Image
          src="/images/page-img.png"
          alt="Checklist Placeholder"
          width={300}
          height={300}
          className="mb-6 rounded-lg"
        />
        <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
          Coming soon — checklist content
        </h2>
      </div>
    </div>
  );
}
