import Image from "next/image";

export default function ChecklistPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <Image
        src="/images/page-img.png"
        alt="Checklist Placeholder"
        width={300}
        height={300}
        className="mb-6 rounded-lg"
      />
      <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
        Checklist Page
      </h1>
    </div>
  );
}
