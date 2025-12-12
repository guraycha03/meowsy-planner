// components/NoticePopup.js
"use client";

import { CheckCircle, AlertTriangle, XCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

// Reusable Notification Style Component
export default function NoticePopup({ id, type = "success", message, onClose }) {
  // We use Tailwind's `pointer-events-auto` to make the individual popup clickable, 
  // while the container in the context remains `pointer-events-none` until a hover/click.
  
  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 flex-shrink-0" />,
  };

  return (
    <div
      id={id}
      className={`relative max-w-sm w-full p-4 rounded-xl border flex items-center gap-3 font-semibold shadow-lg transition-all duration-300 transform 
      // Styles for placement and interaction
      pointer-events-auto opacity-100 translate-y-0
      ${typeStyles[type]}`}
      role="alert"
    >
      {icons[type]} 
      <span className="flex-1 text-sm">{message}</span>
      
      {/* Explicit Close Button (Interactive) */}
      <button
        onClick={onClose}
        aria-label="Close notification"
        className={`ml-4 p-1 rounded-full hover:bg-opacity-70 transition-colors flex-shrink-0 opacity-80 ${type === 'success' ? 'hover:bg-green-200' : type === 'warning' ? 'hover:bg-yellow-200' : 'hover:bg-red-200'}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}