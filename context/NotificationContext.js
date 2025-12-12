// context/NotificationContext.js
"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import NoticePopup from '../components/NoticePopup'; // Import your reusable component
import { v4 as uuidv4 } from "uuid";

const NotificationContext = createContext();

/**
 * Custom hook to use the notification system.
 * Use: const { showNotification } = useNotification();
 */
export const useNotification = () => useContext(NotificationContext);

/**
 * Provider component to wrap your application or main layout.
 * @param {object} children - The child components to wrap.
 */
export function NotificationProvider({ children }) {
    // State to hold multiple notifications (for queuing if needed)
    const [notifications, setNotifications] = useState([]);

    // FIXED: Declare handleClose BEFORE showNotification
    const handleClose = useCallback((idToClose) => {
        setNotifications(prev => prev.filter(n => n.id !== idToClose));
    }, []);
    
    /**
     * Function to trigger a new notification.
     * @param {string} message - The message to display.
     * @param {('success'|'warning'|'error')} type - The style/icon type.
     */
    const showNotification = useCallback((message, type = 'success') => {
        const id = uuidv4();
        
        // Add new notification to the list
        setNotifications(prev => [
            ...prev, 
            { id, message, type }
        ]);
        
        // Automatically remove the notification after a short delay (e.g., 3000ms)
        const duration = 3000;
        setTimeout(() => {
            // Now handleClose is correctly declared and accessible
            handleClose(id); 
        }, duration);

    }, [handleClose]); // Dependency added for handleClose

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            
            {/* Notification Portal: Renders all active notifications */}
            <div className="fixed bottom-0 left-0 right-0 z-[9999] pointer-events-none flex flex-col items-center gap-2 px-4 pb-4">
                {notifications.map(n => (
                    <NoticePopup 
                        key={n.id}
                        id={n.id}
                        type={n.type}
                        message={n.message}
                        onClose={() => handleClose(n.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
}