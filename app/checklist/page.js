"use client";

import { useState, useEffect, useMemo, useRef } from "react";
// 1. IMPORT useRouter
import { useRouter } from "next/navigation"; 
import { Plus, Trash2, CheckSquare, ChevronDown } from "lucide-react";
import { getChecklistData, saveChecklistData, calculateChecklistProgress } from "../../lib/checklistUtils"; 
import { useAuth } from "../../context/AuthContext";
import ChecklistItem from "../../components/ChecklistItem";
import { useNotification } from "../../context/NotificationContext";
import ConfirmationModal from "../../components/ConfirmationModal";
import { v4 as uuidv4 } from "uuid";

// Define colors outside the component
const LIGHT_BG_COLORS = [
    "#fff5f1",
    "#edf3e9ff",
    "#fef3e7",
    "#f5ece3ff",
    "#f7f0ff"
];

const LONG_PRESS_DURATION = 500;

export default function ChecklistPage() {
    // 2. INITIALIZE useRouter
    const router = useRouter(); 
    const { user, loading } = useAuth(); 

    const [bgColor, setBgColor] = useState(LIGHT_BG_COLORS[0]);
    const { showNotification } = useNotification();
    const [checklistData, setChecklistData] = useState([]);
    const [newCategoryTitle, setNewCategoryTitle] = useState("");
    const [collapsedCategories, setCollapsedCategories] = useState({});
    
    // Deletion Modal Logic
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContext, setModalContext] = useState(null);
    const [categoryToDeleteId, setCategoryToDeleteId] = useState(null);

    // Mobile Gesture Logic
    const longPressTimerRef = useRef(null);
    const [deleteModeCategoryId, setDeleteModeCategoryId] = useState(null);

    // Function to load the checklist data
    const loadData = (currentUserId) => {
        if (!currentUserId || typeof window === 'undefined') {
            setChecklistData([]);
            return;
        }
        const savedData = getChecklistData(currentUserId);
        setChecklistData(savedData);
    };

    // 1. Load Data Effect
    useEffect(() => {
      if (!loading && user?.id) {
        (async () => {
          const savedData = getChecklistData(user.id);
          setChecklistData(savedData);
        })();
      }
    }, [user, loading]);

    // Save checklist whenever it changes
    useEffect(() => {
      if (!loading && user?.id) {
        saveChecklistData(user.id, checklistData);
      }
    }, [checklistData, user, loading]);

    // Cross-tab sync
    useEffect(() => {
      if (!user?.id) return;

      const handleStorageChange = (e) => {
        if (e.key === `plannerChecklist_${user.id}`) {
          loadData(user.id);
        }
      };

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }, [user?.id]);

    const completedTasks = useMemo(() => 
      checklistData.flatMap(c => c.items).filter(i => i.completed).length
    , [checklistData]);

    const toggleItem = (categoryId, itemId) => {
        let wasCompleted;
        let itemText = '';

        const updatedChecklistData = checklistData.map(category => {
            if (category.id === categoryId) {
                const updatedItems = category.items.map(item => {
                    if (item.id === itemId) {
                        wasCompleted = item.completed;
                        itemText = item.text;
                        return { ...item, completed: !item.completed };
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
    
    const handleCategoryDeleteRequest = (categoryId) => {
        const category = checklistData.find(c => c.id === categoryId);
        if (!category) return;
        
        setCategoryToDeleteId(categoryId);
        setModalContext('deleteCategory');
        setIsModalOpen(true);
    };

    const performDeleteCategory = () => {
        const categoryTitle = checklistData.find(c => c.id === categoryToDeleteId)?.title || 'list';
        setChecklistData(prevData =>
            prevData.filter(category => category.id !== categoryToDeleteId)
        );
        showNotification(`List deleted: "${categoryTitle}"!`, 'error');
        setCategoryToDeleteId(null);
        handleModalClose();
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setModalContext(null);
        setCategoryToDeleteId(null);
    };

    const handleLongPressStart = (e, categoryId) => {
        clearTimeout(longPressTimerRef.current);
        longPressTimerRef.current = setTimeout(() => {
            setDeleteModeCategoryId(categoryId);
            showNotification("Long press detected! Press the red trash icon to delete.", 'warning');
        }, LONG_PRESS_DURATION);
    };

    const handlePressEnd = () => {
        clearTimeout(longPressTimerRef.current);
    };

    const handleCategoryClick = (categoryId) => {
        if (deleteModeCategoryId === categoryId) {
            handleCategoryDeleteRequest(categoryId);
            setDeleteModeCategoryId(null); 
            return;
        }
        toggleCollapse(categoryId);
    };
    
    const handleClearCompletedClick = () => {
        if (completedTasks === 0) {
            showNotification("No completed tasks to clear.", 'warning');
            return;
        }
        setModalContext('clearCompleted');
        setIsModalOpen(true);
    };

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
    
    const handleModalConfirm = () => {
        if (modalContext === 'clearCompleted') {
            performClearCompleted();
        } else if (modalContext === 'deleteCategory') {
            performDeleteCategory();
        }
    };
    
    const toggleCollapse = (categoryId) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };
    
    const buttonBase = "p-3 rounded-xl shadow-md transition-all duration-200 active:scale-[0.98] focus:outline-none";

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-xl font-semibold text-[var(--color-accent)]">Loading Checklist...</p>
            </div>
        );
    }
    
    if (!user) {
        return (
            <div 
                className="flex flex-col items-center justify-center min-h-screen w-full px-4 py-8 transition-colors duration-1000"
                style={{ backgroundColor: bgColor }}
            >
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-[var(--color-dark-green)]">Access Denied</h2>
                    <p className="text-gray-700 mb-6">You must be logged in to view and manage your personal checklist.</p>
                    <button
                        onClick={() => router.push("/login")} 
                        className={`${buttonBase} bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] px-6 py-3`}
                    >
                        Go to Login Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div 
            className="flex flex-col items-center min-h-screen w-full px-4 sm:px-6 py-8 relative transition-colors duration-1000 pb-24"
            style={{ backgroundColor: bgColor }} 
        >
            <div className="w-full max-w-4xl pt-6 pb-3 px-4 sm:px-0 relative">
                <header className="page-title-label">Checklist</header>
            </div>

            <div className="mt-4 w-full max-w-4xl flex flex-col gap-6 pb-4">
                {checklistData.length > 0 && (
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-2xl font-bold text-[var(--color-foreground)] hidden sm:block">Task Categories</h2>
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
                            <div 
                                className="flex justify-between items-center p-4 cursor-pointer bg-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)/80] transition-colors duration-150 active:scale-[0.99]"
                                onClick={() => handleCategoryClick(category.id)}
                                onTouchStart={(e) => handleLongPressStart(e, category.id)}
                                onTouchEnd={handlePressEnd}
                                onTouchCancel={handlePressEnd}
                                onMouseDown={(e) => handleLongPressStart(e, category.id)}
                                onMouseUp={handlePressEnd}
                                onMouseLeave={handlePressEnd}
                            >
                                <h3 className="text-xl font-bold text-[var(--color-dark-green)]">{category.title}</h3>
                                {deleteModeCategoryId === category.id ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCategoryDeleteRequest(category.id);
                                        }}
                                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                ) : (
                                    <ChevronDown className={`w-6 h-6 text-[var(--color-dark-green)] transition-transform duration-300 ${collapsedCategories[category.id] ? 'rotate-180' : 'rotate-0'}`} />
                                )}
                            </div>
                            
                            <div className={`transition-all duration-500 ease-in-out ${collapsedCategories[category.id] ? 'max-h-0' : 'max-h-[1000px]'} overflow-hidden`}>
                                <ul className="divide-y divide-[var(--color-card)] p-4">
                                    {category.items.map(item => (
                                        <ChecklistItem
                                            key={item.id}
                                            item={item}
                                            onToggle={() => toggleItem(category.id, item.id)}
                                        />
                                    ))}
                                    {category.items.length === 0 && (
                                        <p className="py-2 text-gray-500 italic">This list is empty. Add a new task!</p>
                                    )}
                                </ul>

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
                                        placeholder={`Add a new task...`}
                                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
                                    />
                                    <button type="submit" className={`${buttonBase} bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] px-4 py-2`}>
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </section>
                    ))
                )}

                <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-2 p-4 rounded-2xl bg-white shadow-xl border-2 border-dashed border-[var(--color-muted)]">
                    <input
                        type="text"
                        value={newCategoryTitle}
                        onChange={(e) => setNewCategoryTitle(e.target.value)}
                        placeholder="Create New Category Title"
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-accent)] outline-none"
                    />
                    <button type="submit" className={`${buttonBase} bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] flex items-center justify-center gap-2`}>
                        <CheckSquare className="w-5 h-5" />
                        <span className="font-semibold">Add New List</span>
                    </button>
                </form>
            </div>
            
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleModalConfirm}
                title={modalContent.title || "Confirm Action"}
                message={modalContent.message || "Are you sure you want to proceed?"}
                confirmText={modalContent.confirmText || "Confirm"}
            />
        </div>
    );
}