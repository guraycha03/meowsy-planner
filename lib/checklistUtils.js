// lib/checklistUtils.js

/**
 * Get checklist data for a specific user.
 */
export function getChecklistData(userId) {
    if (typeof window === 'undefined' || !userId) return [];
    const savedData = localStorage.getItem(`plannerChecklist_${userId}`);
    return savedData ? JSON.parse(savedData) : [];
}

/**
 * Save checklist for the current user and alert other components.
 */
export function saveChecklistData(userId, data) {
    if (!userId || typeof window === 'undefined') return;
    
    localStorage.setItem(`plannerChecklist_${userId}`, JSON.stringify(data));
    
    // PROFESSIONAL UX TIP: 
    // We dispatch a custom event so the Homepage can listen for changes 
    // happening in the SAME tab, not just different tabs.
    window.dispatchEvent(new Event("checklistUpdated"));
    
    console.log(`[ChecklistUtil] Saved and notified for user ID: ${userId}`);
}

/**
 * Calculates total progress
 */
export function calculateChecklistProgress(userId) {
    const checklistData = getChecklistData(userId); 
    const allItems = checklistData.flatMap(c => c.items || []);
    const total = allItems.length;
    const completed = allItems.filter(i => i.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { 
        totalTasks: total, 
        completedTasks: completed, 
        progressPercent: percent 
    };
}