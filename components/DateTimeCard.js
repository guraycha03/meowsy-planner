"use client";

import { useEffect, useState } from "react";

export default function DateTimeCard() {
  const [currentDay, setCurrentDay] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();
      const dayOptions = { weekday: "long" };
      const dateOptions = { month: "short", day: "numeric", year: "numeric" };
      const timeOptions = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };

      setCurrentDay(now.toLocaleDateString("en-PH", dayOptions));
      setCurrentDate(now.toLocaleDateString("en-PH", dateOptions));
      setCurrentTime(now.toLocaleTimeString("en-PH", timeOptions));
    }

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="datetime-card mx-auto w-full max-w-[450px] rounded-2xl overflow-hidden flex flex-row shadow-lg bg-white">
      {/* Left Section: Day & Date */}
      <div className="date-info-section flex-1 flex flex-col justify-center items-start text-left p-4 sm:p-6 bg-white">
        <div className="day-display text-gray-400 uppercase tracking-wider font-bold mb-1 text-sm sm:text-base">
          {currentDay}
        </div>
        <div className="date-display text-gray-700 font-semibold text-base sm:text-lg">
          {currentDate}
        </div>
      </div>

      {/* Right Section: Time */}
      <div className="time-section flex-[1.2] flex justify-center items-center bg-[#F8F5F1] p-4 sm:p-6 transition-colors duration-300 hover:bg-rose-200">
        <div className="time-display text-gray-700 font-bold text-xl sm:text-2xl tracking-wide transition-colors duration-300 hover:text-white">
          {currentTime}
        </div>
      </div>

      {/* Mobile responsiveness: stack vertically */}
      <style jsx>{`
        @media (max-width: 400px) {
          .datetime-card {
            flex-direction: column;
          }
          .date-info-section {
            align-items: center;
            text-align: center;
            width: 100%;
            padding-bottom: 0.5rem;
          }
          .time-section {
            width: 100%;
            padding-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
