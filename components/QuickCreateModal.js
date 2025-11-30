"use client";

export default function QuickCreateModal({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-20">
      <div className="bg-[var(--color-card)] p-6 rounded-2xl w-80 flex flex-col space-y-4 shadow-lg">
        <h2 className="text-xl font-bold text-[var(--color-foreground)]">
          Add New
        </h2>
        <button className="p-2 bg-[var(--color-accent)] text-white rounded-lg hover:scale-105 transition-transform">
          Task
        </button>
        <button className="p-2 bg-[var(--color-accent2)] text-white rounded-lg hover:scale-105 transition-transform">
          Note
        </button>
        <button
          className="mt-2 p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          onClick={() => setIsOpen(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
