// lib/checklistUtils.js

/**
 * Get checklist data for a specific user.
 * @param {string | null} userId - The ID of the currently logged-in user.
 * @returns {Array} - The saved checklist data or an empty array.
 */
export function getChecklistData(userId) {
    // If running server-side (Next.js) or no userId is provided, return empty array.
    if (typeof window === 'undefined' || !userId) return [];
    
    // Use a unique key based on the user's ID
    const savedData = localStorage.getItem(`plannerChecklist_${userId}`);
    
    // Log the user ID being used for clarity
    console.log(`[ChecklistUtil] Loading data for user ID: ${userId}`);
    
    return savedData ? JSON.parse(savedData) : [];
}

/**
 * Save checklist for the current user
 * @param {string | null} userId - The ID of the currently logged-in user.
 * @param {Array} data - The checklist data array to save.
 */

export function saveChecklistData(userId, data) {
    if (!userId || typeof window === 'undefined') return;
    localStorage.setItem(`plannerChecklist_${userId}`, JSON.stringify(data));
    console.log(`[ChecklistUtil] Saved data for user ID: ${userId}`);
    // no need to dispatch storage event
}


/**
 * Calculates total progress
 * @param {string | null} userId - The ID of the currently logged-in user.
 */
export function calculateChecklistProgress(userId) {
    // We must pass the userId to the getter function now
    const checklistData = getChecklistData(userId); 
    const allItems = checklistData.flatMap(c => c.items);
    const total = allItems.length;
    const completed = allItems.filter(i => i.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { totalTasks: total, completedTasks: completed, progressPercent: percent };
}