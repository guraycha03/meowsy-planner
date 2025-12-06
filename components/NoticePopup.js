"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function NoticePopup({ id, type = "success", message, duration = 2000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const typeStyles = {
    success: "bg-green-100 border-green-400 text-green-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    error: "bg-red-100 border-red-400 text-red-700",
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };

  return (
    <div
      id={id}
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[999] px-6 py-3 rounded-xl border flex items-center justify-center gap-2 font-semibold shadow-lg ${typeStyles[type]} animate-slide-up`}
    >
      {icons[type]} {message}
    </div>
  );
}
