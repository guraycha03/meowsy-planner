// lib/checklistUtils.js

const initialChecklistData = [
  {
    id: 'initial1',
    title: "Today's Tasks 🚀",
    items: [
      { id: 't1', text: "Review JavaScript code for notes editor", completed: false },
      { id: 't2', text: "Finalize checklist UI/UX design", completed: true },
      { id: 't3', text: "Read two articles on Next.js best practices", completed: false },
    ],
  },
];

/**
 * Calculates the total checklist progress (tasks completed / total tasks).
 * Returns { totalTasks, completedTasks, progressPercent }
 */
export function calculateChecklistProgress() {
  if (typeof window === 'undefined') {
    return { totalTasks: 0, completedTasks: 0, progressPercent: 0 };
  }

  const savedData = localStorage.getItem("plannerChecklist");
  let checklistData;

  try {
    checklistData = savedData ? JSON.parse(savedData) : initialChecklistData;
  } catch (error) {
    console.error("Error parsing checklist data from localStorage:", error);
    checklistData = initialChecklistData;
  }

  const allItems = checklistData.flatMap(c => c.items);
  const total = allItems.length;
  const completed = allItems.filter(item => item.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { totalTasks: total, completedTasks: completed, progressPercent: percent };
}

/**
 * Returns the raw checklist data (used by the ChecklistPage).
 */
export function getChecklistData() {
    if (typeof window === 'undefined') return initialChecklistData;
    const savedData = localStorage.getItem("plannerChecklist");
    return savedData ? JSON.parse(savedData) : initialChecklistData;
}