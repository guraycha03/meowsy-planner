"use client";

import { useState, useEffect, useRef } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarPage() {
  const containerRef = useRef(null);

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

      // Scroll slightly above top so last dates aren't hidden
      const topOffset = 120; // adjust based on bottom nav height
      container.scrollTo({
        top: monthEl.offsetTop - topOffset,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;

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
    <div className="flex flex-col min-h-screen w-full px-4 sm:px-8 items-center relative">
      {/* Calendar container */}
      <div className="w-full max-w-[1400px] calendar-page-container relative">
        <header className="calendar-page-label">Calendar</header>

        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="w-full flex flex-col overflow-y-auto"
          style={{ maxHeight: 'calc(100vh - 140px)' }}
        >


          {months.map((monthDate, idx) => (
  <div key={idx} className="w-full mb-12 calendar-wrapper">
    <div className="calendar-month-title flex flex-col">
      <span>{formatMonth(monthDate)}</span>
      <div
        className="mt-2"
        style={{ borderBottom: "2px solid var(--color-accent)" }}
      ></div>
    </div>
    <Calendar
      value={currentDate}
      onClickDay={setCurrentDate}
      activeStartDate={monthDate}
      showNeighboringMonth={false}
      showNavigation={false}
      className="responsive-calendar calendar-wrapper"
    />
  </div>
))}



        </div>
      </div>

      {/* Floating buttons at bottom-right above nav */}
<div className="fixed bottom-24 right-4 flex flex-col gap-3 z-20">

  {/* Add Event */}
  <button
    onClick={() => alert("Add Event clicked!")}
    className="px-5 py-2 rounded-full shadow-md font-semibold
               text-[var(--color-text-dark)]
               bg-[var(--color-accent-dark)]
               hover:bg-[var(--color-accent)]
               transition"
  >
    + Add Event
  </button>

  {/* Today */}
  <button
    onClick={goToToday}
    className="px-5 py-2 rounded-full shadow-md font-semibold
               text-[var(--color-background)]
               bg-[var(--color-dark-green)]
               hover:bg-[var(--color-green)]
               transition"
  >
    Today
  </button>
</div>





    </div>
  );
}
