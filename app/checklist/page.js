// ChecklistPage.js
"use client";

import { useState, useEffect, useMemo, useRef } from "react"; 
import { Plus, Trash2, CheckSquare, ChevronDown } from "lucide-react";
import ChecklistItem from "../../components/ChecklistItem"; 
import { getChecklistData } from "../../lib/checklistUtils"; 
import { useNotification } from "../../context/NotificationContext";
import ConfirmationModal from "../../components/ConfirmationModal";
import { v4 as uuidv4 } from "uuid";

// Define colors outside the component so they are not recalculated unnecessarily
const LIGHT_BG_COLORS = [
    "#fff5f1",
    "#edf3e9ff",
    "#fef3e7",
    "#f5ece3ff",
    "#f7f0ff"
];

// Define the duration for a long press in milliseconds (UX best practice is ~500ms)
const LONG_PRESS_DURATION = 500; 

export default function ChecklistPage() {
    
    const [bgColor, setBgColor] = useState(LIGHT_BG_COLORS[0]); 
    const { showNotification } = useNotification();
    const [checklistData, setChecklistData] = useState([]);
    const [newCategoryTitle, setNewCategoryTitle] = useState("");
    const [collapsedCategories, setCollapsedCategories] = useState({});
    
    // --- New States for Deletion Modal Logic ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Tracks the context for the modal: 'clearCompleted' or 'deleteCategory'
    const [modalContext, setModalContext] = useState(null); 
    // Tracks the ID of the category to delete
    const [categoryToDeleteId, setCategoryToDeleteId] = useState(null); 

    // Ref to manage the long-press timer
    const longPressTimerRef = useRef(null); 
    // State to visually indicate which category is in "edit/delete mode"
    const [deleteModeCategoryId, setDeleteModeCategoryId] = useState(null); 
    // --- End New States ---

    // --- Persistence: Load from Local Storage on Mount ---
      useEffect(() => {
        const savedData = getChecklistData();
        // Schedule state update after mount
        const id = setTimeout(() => {
            setChecklistData(savedData);
        }, 0);

        // Cleanup timeout on unmount
        return () => clearTimeout(id);
    }, []);


    // --- Persistence: Save to Local Storage on Update ---
    useEffect(() => {
        if (checklistData.length > 0 || localStorage.getItem("plannerChecklist")) {
            localStorage.setItem("plannerChecklist", JSON.stringify(checklistData));
        }
        window.dispatchEvent(new Event('storage'));
    }, [checklistData]);


    const toggleItem = (categoryId, itemId) => {
        // ... (toggleItem remains the same) ...
        let wasCompleted;
        let itemText = '';

        const updatedChecklistData = checklistData.map(category => {
            if (category.id === categoryId) {
                const updatedItems = category.items.map(item => {
                    if (item.id === itemId) {
                        wasCompleted = item.completed; // Capture current state (before change)
                        itemText = item.text;
                        return { ...item, completed: !item.completed }; // Toggle state
                    }
                    return item;
                });
                return { ...category, items: updatedItems };
            }
            return category;
        });

        setChecklistData(updatedChecklistData);

        if (!wasCompleted) {
            showNotification(`Task completed: "${itemText}"!`, 'success');
        } else {
            showNotification(`Task marked incomplete: "${itemText}".`, 'warning');
        }
    };

    const addItem = (categoryId, text) => {
        const trimmedText = text.trim();
        if (!trimmedText) {
            showNotification("Task cannot be empty.", 'warning');
            return;
        }

        // State update
        setChecklistData(prevData =>
            prevData.map(category => {
                if (category.id === categoryId) {
                    return {
                        ...category,
                        items: [...category.items, { id: uuidv4(), text: trimmedText, completed: false }],
                    };
                }
                return category;
            })
        );
        
        // Notification (executed once)
        showNotification(`Added new task: "${trimmedText}".`, 'success');
    };

    const addCategory = (e) => {
        e.preventDefault();
        const trimmedTitle = newCategoryTitle.trim();
        if (!trimmedTitle) {
            showNotification("Category title cannot be empty.", 'warning');
            return;
        }

        const newCategory = {
            id: uuidv4(),
            title: trimmedTitle,
            items: [],
        };
        setChecklistData(prevData => [...prevData, newCategory]);
        setNewCategoryTitle("");
        showNotification(`New list created: "${trimmedTitle}"!`, 'success');
    };
    
    // --- CATEGORY DELETION LOGIC (NEW) ---

    // 1. Function to open the category deletion confirmation modal
    const handleCategoryDeleteRequest = (categoryId) => {
        const category = checklistData.find(c => c.id === categoryId);
        if (!category) return;
        
        setCategoryToDeleteId(categoryId);
        setModalContext('deleteCategory');
        
        // Open the modal
        setIsModalOpen(true); 
    };

    // 2. Function to execute deletion upon confirmation
    const performDeleteCategory = () => {
        const categoryTitle = checklistData.find(c => c.id === categoryToDeleteId)?.title || 'list';
        setChecklistData(prevData =>
            prevData.filter(category => category.id !== categoryToDeleteId)
        );
        showNotification(`List deleted: "${categoryTitle}"!`, 'error');
        setCategoryToDeleteId(null);
        handleModalClose(); // Use the general closer
    };

    // 3. Helper to reset all modal states
    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalContext(null);
        setCategoryToDeleteId(null);
    };

    // --- MOBILE GESTURE LOGIC (NEW) ---

    // 1. Start the long press timer
    const handleLongPressStart = (e, categoryId) => {
        // Prevent default text selection on desktop/mobile hold
        e.preventDefault(); 
        
        // Clear any existing timer just in case
        clearTimeout(longPressTimerRef.current);
        
        // Set a timer for LONG_PRESS_DURATION
        longPressTimerRef.current = setTimeout(() => {
            setDeleteModeCategoryId(categoryId);
            showNotification("Long press detected! Press the red trash icon to delete.", 'warning');
        }, LONG_PRESS_DURATION);
    };

    // 2. Clear the timer if the click/touch is released too early (i.e., it's a regular click)
    const handlePressEnd = (categoryId) => {
        clearTimeout(longPressTimerRef.current);
    };

    // 3. Toggle collapse on a regular click/tap, but prevent it if the category is in delete mode
    const handleCategoryClick = (categoryId) => {
        // If we are already in delete mode, a click should open the delete modal for quick action
        if (deleteModeCategoryId === categoryId) {
            handleCategoryDeleteRequest(categoryId);
            // After modal opens, reset the delete mode
            setDeleteModeCategoryId(null); 
            return;
        }
        
        // If we are not in delete mode, perform the regular collapse toggle
        toggleCollapse(categoryId);
    };
    
    // --- CLEAR COMPLETED LOGIC (UPDATED to use modal context) ---
    
    // 1. Function to open the confirmation modal for clearing tasks
    const handleClearCompletedClick = () => {
        if (completedTasks === 0) {
            showNotification("No completed tasks to clear.", 'warning');
            return;
        }
        setModalContext('clearCompleted');
        setIsModalOpen(true); 
    };

    // 2. Function that executes deletion upon confirmation
    const performClearCompleted = () => {
        setChecklistData(prevData =>
            prevData.map(category => ({
                ...category,
                items: category.items.filter(item => !item.completed),
            }))
        );
        showNotification(`Successfully cleared ${completedTasks} completed tasks!`, 'success');
        handleModalClose(); 
    };
    
    // 3. Determine which confirmation function to run based on the context
    const handleModalConfirm = () => {
        if (modalContext === 'clearCompleted') {
            performClearCompleted();
        } else if (modalContext === 'deleteCategory') {
            performDeleteCategory();
        }
    };
    
    // --- END LOGIC UPDATES ---


    const toggleCollapse = (categoryId) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };
    
    const getCompletedTasks = () =>
        checklistData.flatMap(c => c.items).filter(item => item.completed).length;

    // Usage
    const completedTasks = getCompletedTasks();



    const buttonBase = "p-3 rounded-xl shadow-md transition-all duration-200 active:scale-[0.98] focus:outline-none";

    // Dynamic Modal Content
    const getModalContent = () => {
        if (modalContext === 'clearCompleted') {
            return {
                title: "Confirm Clear Tasks",
                message: `Are you absolutely sure you want to permanently clear all ${completedTasks} completed tasks? This action cannot be undone.`,
                confirmText: `Clear ${completedTasks} Tasks`,
            };
        } else if (modalContext === 'deleteCategory') {
            const categoryTitle = checklistData.find(c => c.id === categoryToDeleteId)?.title || 'this list';
            return {
                title: `Confirm Delete List: ${categoryTitle}`,
                message: `WARNING: Deleting "${categoryTitle}" will permanently remove all its tasks. Are you sure you want to proceed?`,
                confirmText: `Delete List`,
            };
        }
        return {};
    };
    const modalContent = getModalContent();

    return (
        <div 
            className="flex flex-col items-center min-h-screen w-full px-4 sm:px-6 py-8 relative transition-colors duration-1000 pb-24"
            style={{ backgroundColor: bgColor }} 
        >
            
            {/* 📝 Page Title: Consistent Styling */}
            <div className="w-full max-w-4xl pt-16 pb-3 px-4 sm:px-0 relative">
                <header className="page-title-label">
                    Checklist 
                </header>
            </div>
            
            {/* MAIN CONTENT AREA */}
            <div className="mt-[30px] w-full max-w-4xl flex flex-col gap-6 pb-4"> 
                
                {/* TOP CONTROLS */}
                {checklistData.length > 0 && (
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-2xl font-bold text-[var(--color-foreground)] hidden sm:block">Task Categories</h2>
                        
                        {/* Clear Completed Button (Calls the handler to open the modal) */}
                        <button
                            onClick={handleClearCompletedClick}
                            disabled={completedTasks === 0}
                            className={`${buttonBase} bg-red-400 text-white hover:bg-red-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:shadow-none flex items-center`}
                        >
                            <Trash2 className="h-5 w-5 mr-1 sm:mr-2" />
                            Clear Completed ({completedTasks})
                        </button>
                    </div>
                )}

                {checklistData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-lg border-2 border-dashed border-[var(--color-muted)] mt-12">
                        <CheckSquare className="w-12 h-12 text-[var(--color-accent)] mb-4" />
                        <h3 className="text-xl font-bold mb-2">Ready to plan?</h3>
                        <p className="text-gray-600 text-center mb-6">Start by creating your first task list below!</p>
                    </div>
                ) : (
                    checklistData.map(category => (
                        <section 
                            key={category.id} 
                            className={`w-full rounded-2xl shadow-xl bg-white border-4 overflow-hidden 
                                ${deleteModeCategoryId === category.id ? 'border-red-500/50 scale-[1.01] transition-all duration-300' : 'border-[var(--color-card)]'}`}
                        >
                            {/* Category Header (Interactive and Engaging Button Style) */}
                            <div 
                                className="flex justify-between items-center p-4 cursor-pointer bg-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)/80] transition-colors duration-150 active:scale-[0.99]"
                                // Standard click handler (handles collapse or opens delete modal)
                                onClick={() => handleCategoryClick(category.id)}
                                // Long press handlers for mobile (touch) and desktop (mouse)
                                onTouchStart={(e) => handleLongPressStart(e, category.id)}
                                onTouchEnd={() => handlePressEnd(category.id)}
                                onTouchCancel={() => handlePressEnd(category.id)}
                                onMouseDown={(e) => handleLongPressStart(e, category.id)}
                                onMouseUp={() => handlePressEnd(category.id)}
                                onMouseLeave={() => handlePressEnd(category.id)}
                            >
                                <h3 className="text-xl font-bold text-[var(--color-dark-green)]">
                                    {category.title}
                                </h3>
                                
                                {/* Dynamic Delete Button / Collapse Icon */}
                                {deleteModeCategoryId === category.id ? (
                                    // DELETE BUTTON APPEARS ON LONG PRESS
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the main click handler from running
                                            handleCategoryDeleteRequest(category.id);
                                        }}
                                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all"
                                        title={`Delete list: ${category.title}`}
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                ) : (
                                    // DEFAULT COLLAPSE ICON
                                    <ChevronDown 
                                        className={`w-6 h-6 text-[var(--color-dark-green)] transition-transform duration-300 ${collapsedCategories[category.id] ? 'rotate-180' : 'rotate-0'}`} 
                                    />
                                )}
                            </div>
                            
                            {/* Category Content (Collapsible) */}
                            <div 
                                className={`transition-all duration-500 ease-in-out ${collapsedCategories[category.id] ? 'max-h-0' : 'max-h-[1000px]'} overflow-hidden`}
                            >
                                {/* Task List */}
                                <ul className="divide-y divide-[var(--color-card)] p-4">
                                    {category.items.map(item => (
                                        <ChecklistItem
                                            key={item.id}
                                            item={item}
                                            onToggle={() => toggleItem(category.id, item.id)}
                                        />
                                    ))}
                                    {category.items.length === 0 && (
                                        <p className="py-2 text-gray-500 italic">This list is empty. Add a new task below!</p>
                                    )}
                                </ul>

                                {/* Add New Item Input */}
                                <form 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const input = e.target.elements.newItem;
                                        addItem(category.id, input.value);
                                        input.value = "";
                                    }}
                                    className="p-4 border-t border-[var(--color-card)] flex gap-2"
                                >
                                    <input
                                        name="newItem"
                                        type="text"
                                        placeholder={`Add a new task to ${category.title}...`}
                                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-shadow"
                                    />
                                    <button type="submit" className={`${buttonBase} bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] px-4 py-2`}>
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </section>
                    ))
                )}

                {/* ADD NEW CATEGORY INPUT (Interactive) */}
                <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-2 p-4 rounded-2xl bg-white shadow-xl border-2 border-dashed border-[var(--color-muted)]">
                    <input
                        type="text"
                        value={newCategoryTitle}
                        onChange={(e) => setNewCategoryTitle(e.target.value)}
                        placeholder="Create New Category Title"
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] outline-none transition-shadow"
                    />
                    <button 
                        type="submit" 
                        className={`${buttonBase} bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] flex items-center justify-center gap-2`}
                    >
                        <CheckSquare className="w-5 h-5" />
                        <span className="font-semibold">Add New List</span>
                    </button>
                </form>
            </div>
            
            {/* -------------------------------------- */}
            {/* CONFIRMATION MODAL INTEGRATION */}
            {/* -------------------------------------- */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleModalConfirm} // Runs the appropriate confirm function
                title={modalContent.title || "Confirm Action"}
                message={modalContent.message || "Are you sure you want to proceed?"}
                confirmText={modalContent.confirmText || "Confirm"}
            />

        </div>
    );
}