"use client";

import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNotification } from "../../context/NotificationContext"; 

export default function CalendarPage() {
  const containerRef = useRef(null);
  const { showNotification } = useNotification(); 

  // FIXED: Lazy Initial State (No more cascading render error)
  const [events, setEvents] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("calendar_events");
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error("Failed to parse calendar events", e);
        return [];
      }
    }
    return [];
  });

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "" });

  // Browser Permission Request
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem("calendar_events", JSON.stringify(events));
  }, [events]);

  // ... rest of your logic (checker, addEvent, etc.)
  

  // --- UPDATED NOTIFICATION CHECKER ---
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentDate = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);

      events.forEach((event, index) => {
        if (event.date === currentDate && event.time === currentTime && !event.notified) {
          
          // 1. Internal UI Notification (Your Toast)
          showNotification(`It's time for: ${event.title}`, "success");

          // 2. Browser/System Notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Event Reminder", {
              body: `It's time for: ${event.title}`,
              icon: "/logo.png" // Replace with your actual logo path
            });
          }

          const updatedEvents = [...events];
          updatedEvents[index].notified = true;
          setEvents(updatedEvents);
        }
      });
    }, 30000); 

    return () => clearInterval(checkInterval);
  }, [events, showNotification]);

  // --- REMAINDER OF YOUR CODE ---
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
        showNotification("Please fill all fields!", "warning");
        return;
    }
    setEvents([...events, { ...newEvent, id: Date.now(), notified: false }]);
    setShowModal(false);
    setNewEvent({ title: "", date: "", time: "" });
    showNotification(`${newEvent.title} has been scheduled.`, "success");
  };

  const generateMonths = (centerDate, count = 7) => {
    const arr = [];
    const startOffset = -Math.floor(count / 2);
    for (let i = startOffset; i < startOffset + count; i++) {
      arr.push(new Date(centerDate.getFullYear(), centerDate.getMonth() + i, 1));
    }
    return arr;
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [months, setMonths] = useState(() => generateMonths(new Date(), 7));

  const formatMonth = (date) =>
    date.toLocaleString("en-US", { month: "long", year: "numeric" });

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    const container = containerRef.current;
    if (!container) return;
    const index = months.findIndex(
      (m) => m.getFullYear() === today.getFullYear() && m.getMonth() === today.getMonth()
    );
    if (index >= 0) {
      const monthEl = container.children[index];
      if (!monthEl) return;
      const topOffset = 120;
      container.scrollTo({ top: monthEl.offsetTop - topOffset, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollTop < 100) {
      const firstMonth = months[0];
      const prevMonth = new Date(firstMonth.getFullYear(), firstMonth.getMonth() - 1, 1);
      setMonths((prev) => [prevMonth, ...prev]);
      container.scrollTop = scrollTop + 300;
    }
    if (scrollTop + clientHeight > scrollHeight - 100) {
      const lastMonth = months[months.length - 1];
      const nextMonth = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1);
      setMonths((prev) => [...prev, nextMonth]);
    }
  };

  useEffect(() => { 
    requestAnimationFrame(goToToday); 
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full px-4 sm:px-8 items-center relative pb-20">
      <header className="page-title-label">Calendar</header>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full flex flex-col overflow-y-auto no-scrollbar"
        style={{ height: 'calc(100vh - 100px)', marginTop: '80px' }}
      >
        {months.map((monthDate, idx) => (
          <div key={idx} className="w-full calendar-wrapper mb-8">
            <div className="calendar-month-title flex flex-col items-center mb-4">
              <span className="text-xl font-bold text-[var(--color-dark-green)]">{formatMonth(monthDate)}</span>
              <div className="w-16 h-1 bg-[var(--color-accent)] rounded-full mt-1"></div>
            </div>
            <Calendar
              value={currentDate}
              onClickDay={(date) => {
                setCurrentDate(date);
                setNewEvent({...newEvent, date: date.toISOString().split('T')[0]});
              }}
              activeStartDate={monthDate}
              showNeighboringMonth={false}
              showNavigation={false}
              className="responsive-calendar mx-auto"
            />
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] px-6">
          <div className="bg-white p-6 rounded-3xl w-full max-w-sm shadow-2xl border-2 border-[var(--color-card)] animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-dark-green)]">New Event</h2>
            <input 
              type="text" 
              placeholder="Event Title" 
              className="w-full p-3 mb-3 border-2 border-gray-100 rounded-xl focus:border-[var(--color-accent)] outline-none transition-all"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
            />
            <div className="flex gap-2">
                <input 
                  type="date" 
                  className="w-full p-3 mb-3 border-2 border-gray-100 rounded-xl text-sm outline-none"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
                <input 
                  type="time" 
                  className="w-full p-3 mb-3 border-2 border-gray-100 rounded-xl text-sm outline-none"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
            </div>
            <div className="flex gap-3 mt-2">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="flex-1 p-3 rounded-xl bg-gray-100 font-semibold active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddEvent} 
                  className="flex-1 p-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold shadow-lg active:scale-95 transition-transform"
                >
                  Save
                </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-24 right-6 flex flex-col gap-3 z-50">
        <button
          onClick={() => setShowModal(true)}
          className="w-14 h-14 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all text-2xl font-bold"
        >
          +
        </button>
        <button
          onClick={goToToday}
          className="px-5 py-3 rounded-full bg-white text-[var(--color-dark-green)] font-bold shadow-lg hover:scale-105 active:scale-95 transition-all border-2 border-[var(--color-card)]"
        >
          Today
        </button>
      </div>
    </div>
  );
}