// context/NotificationContext.js
"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import NoticePopup from '../components/NoticePopup'; 
import { v4 as uuidv4 } from "uuid";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const handleClose = useCallback((idToClose) => {
        setNotifications(prev => prev.filter(n => n.id !== idToClose));
    }, []);
    
    const showNotification = useCallback((message, type = 'success') => {
        const id = uuidv4();
        
        setNotifications(prev => [
            ...prev, 
            { id, message, type }
        ]);
        
        const duration = 3000;
        setTimeout(() => {
            handleClose(id); 
        }, duration);

    }, [handleClose]);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            
            {/* FIXED: Changed bottom-0 to top-6 and added notification-container class.
              This ensures it appears at the top, away from the BottomNav.
            */}
            <div className="notification-container fixed top-6 left-0 right-0 z-[9999] pointer-events-none flex flex-col items-center gap-3 px-4">
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