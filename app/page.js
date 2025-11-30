"use client";

import { useState } from "react";
import DashboardCard from "../components/DashboardCard";
import QuickCreateModal from "../components/QuickCreateModal";

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasks = [
    { id: 1, title: "Finish Math Assignment", completed: false },
    { id: 2, title: "Read Chapter 4 - History", completed: true },
    { id: 3, title: "Design Meowsy Sticker", completed: false },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
        Welcome, Meowsy!
      </h1>

      <div className="grid md:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <DashboardCard key={task.id} task={task} />
        ))}
      </div>

      <QuickCreateModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-8 w-16 h-16 rounded-full bg-[var(--color-accent)] text-white text-3xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        +
      </button>
    </div>
  );
}
