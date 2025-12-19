"use client";

import { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useNotification } from "../../context/NotificationContext";
import { Plus, Clock, Trash2, Calendar as CalendarIcon } from "lucide-react";
// Import your custom modal
import ConfirmationModal from "../../components/ConfirmationModal"; 

export default function CalendarPage() {
  const { showNotification } = useNotification();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  
  // --- STATES FOR DELETE CONFIRMATION ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [newEvent, setNewEvent] = useState({ title: "", date: "", time: "" });

  const [events, setEvents] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("planner_events");
      try {
        return saved ? JSON.parse(saved) : [];
      } catch (e) { return []; }
    }
    return [];
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    localStorage.setItem("planner_events", JSON.stringify(events));
  }, [events]);

  const selectedDateStr = currentDate.toISOString().split("T")[0];
  
  const dayEvents = useMemo(() => {
    return events
      .filter((e) => e.date === selectedDateStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [events, selectedDateStr]);

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);       
    setActiveStartDate(today);   
    showNotification("Back to Today", "info");
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      showNotification("Please fill all fields!", "warning");
      return;
    }
    setEvents([...events, { ...newEvent, id: Date.now(), notified: false }]);
    setShowModal(false);
    setNewEvent({ title: "", date: selectedDateStr, time: "" });
    showNotification("Event added!", "success");
  };

  // --- TRIGGER DELETE MODAL ---
  const openDeleteConfirm = (event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  // --- ACTUAL DELETE LOGIC ---
  const confirmDelete = () => {
    if (eventToDelete) {
      setEvents(events.filter((e) => e.id !== eventToDelete.id));
      showNotification("Event deleted", "info");
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dStr = date.toISOString().split("T")[0];
      const hasEvent = events.some((e) => e.date === dStr);
      return hasEvent ? (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-green)] opacity-60 animate-pulse" />
        </div>
      ) : null;
    }
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="relative w-full min-h-screen px-4 py-8 flex flex-col items-center gap-6 pb-40 bg-[#ffffff]">
      
      <header className="page-title-label">Calendar</header>

      <div className="w-full max-w-6xl mt-24 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start animate-in fade-in slide-in-from-top-4 duration-700">
        
        {/* Left Card: Calendar */}
        <div className="w-full bg-[#FEFDFB] rounded-[32px] p-6 shadow-sm border border-[#F5EBE0]">
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-xs font-bold text-[#93737C] flex items-center gap-2 uppercase tracking-[0.2em]">
              <CalendarIcon size={14} className="text-[var(--color-green)]" />
              Schedule
            </h2>
            <button 
              onClick={handleGoToToday}
              className="text-[10px] font-black uppercase tracking-widest text-[#B89AA4] hover:text-[var(--color-green)] transition-all active:scale-95 px-3 py-1.5 hover:bg-[var(--color-accent-light)] rounded-full border border-transparent hover:border-[#F5EBE0]"
            >
              Today
            </button>
          </div>

          <Calendar
            onChange={setCurrentDate}
            value={currentDate}
            activeStartDate={activeStartDate}
            onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate)}
            tileContent={tileContent}
            className="modern-calendar-main"
            next2Label={null}
            prev2Label={null}
          />
        </div>

        {/* Right Card: Agenda */}
        <div className="flex-1 w-full">
          <div className="bg-[#FEFDFB] rounded-[32px] p-6 sm:p-10 border border-[#F5EBE0] shadow-sm min-h-[520px] flex flex-col">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-[var(--color-accent-dark)] font-extrabold uppercase tracking-widest text-[10px] mb-2">Selected Day</p>
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-dark-green)] tracking-tight">
                  {currentDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </h1>
              </div>
              <button
                onClick={() => {
                  setNewEvent(p => ({ ...p, date: selectedDateStr }));
                  setShowModal(true);
                }}
                className="w-14 h-14 bg-[var(--color-accent2)] text-[var(--color-dark-green)] rounded-[20px] flex items-center justify-center hover:rotate-90 transition-all duration-500 shadow-md active:scale-95 group"
              >
                <Plus size={28} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="flex-1 space-y-4">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => (
                  <div key={event.id} className="group flex items-center gap-5 p-5 bg-white rounded-[24px] border border-[#F5EBE0]/80 hover:shadow-lg hover:border-[var(--color-green)]/30 transition-all animate-in slide-in-from-bottom-4 duration-300">
                    <div className="w-12 h-12 bg-[var(--color-accent-light)] rounded-2xl flex items-center justify-center text-[var(--color-accent-dark2)]">
                      <Clock size={22} />
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-[#B89AA4] tracking-wider uppercase">{event.time}</span>
                      <h4 className="text-[var(--color-foreground)] text-lg font-bold leading-tight">{event.title}</h4>
                    </div>
                    
                    {/* IMPROVED DELETE BUTTON: Visible on mobile, hover-only on desktop */}
                    <button 
                      onClick={() => openDeleteConfirm(event)}
                      className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-3 text-red-300/60 hover:text-red-500 transition-all active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 bg-[var(--color-accent-light)] rounded-full flex items-center justify-center mb-4 opacity-40">
                    <CalendarIcon size={32} className="text-[var(--color-accent-dark)]" />
                  </div>
                  <p className="font-bold text-[#4B3C34] opacity-30 italic">No plans yet for this date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD EVENT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-[#4B3C34]/30 backdrop-blur-md z-[110] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 shadow-2xl border-[8px] border-[var(--color-accent-light)] animate-in zoom-in duration-300">
            <div className="mb-8">
               <h3 className="text-2xl font-black text-[var(--color-foreground)]">Add Plan</h3>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">New Event Details</p>
            </div>
            
            <div className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#B89AA4] uppercase ml-2">Event Title</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Study Session"
                  className="w-full p-4 bg-[#FEFDFB] border-2 border-[#F5EBE0] rounded-2xl outline-none focus:border-[var(--color-green)] transition-all font-bold text-[#4B3C34]"
                  value={newEvent.title}
                  onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#B89AA4] uppercase ml-2">Date</label>
                  <input type="date" className="w-full p-4 bg-[#FEFDFB] border-2 border-[#F5EBE0] rounded-2xl text-xs font-bold" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#B89AA4] uppercase ml-2">Time</label>
                  <input type="time" className="w-full p-4 bg-[#FEFDFB] border-2 border-[#F5EBE0] rounded-2xl text-xs font-bold" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-10">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors">Cancel</button>
              <button onClick={handleAddEvent} className="flex-[2] py-4 bg-[var(--color-green)] text-white rounded-2xl font-black shadow-lg shadow-green-100 hover:brightness-105 active:scale-95 transition-all">Save Event</button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODAL --- */}
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Plan?"
        message={`Are you sure you want to remove "${eventToDelete?.title}" from your schedule? This cannot be undone.`}
        confirmText="Delete Plan"
      />
      
    </div>
  );
}