// components/NoticePopup.js
"use client";

import { CheckCircle, AlertTriangle, XCircle, X, Info } from "lucide-react";

export default function NoticePopup({ id, type = "success", message, onClose }) {
  
  const typeStyles = {
    success: "bg-white border-green-200 text-green-800 shadow-green-100",
    warning: "bg-white border-yellow-200 text-yellow-800 shadow-yellow-100",
    error:   "bg-white border-red-200 text-red-800 shadow-red-100",
    info:    "bg-white border-blue-200 text-blue-800 shadow-blue-100",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    error:   <XCircle className="w-5 h-5 text-red-500" />,
    info:    <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div
      id={id}
      className={`
        notification-item
        relative max-w-sm w-full p-4 rounded-2xl border-2 flex items-center gap-3 
        font-bold shadow-xl transition-all duration-500 transform 
        pointer-events-auto animate-in slide-in-from-top-full fade-in
        ${typeStyles[type]}
      `}
      role="alert"
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div> 
      <span className="flex-1 text-sm tracking-tight">{message}</span>
      
      <button
        onClick={onClose}
        className="ml-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}