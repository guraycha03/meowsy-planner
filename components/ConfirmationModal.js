// components/ConfirmationModal.js
import { Trash2, X } from "lucide-react";

/**
 * A highly reusable, responsive confirmation dialog modal.
 */
export default function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = "Confirm" 
}) {
    if (!isOpen) return null;

    const buttonBase =
        "py-3 rounded-lg shadow-md transition-all duration-200 active:scale-[0.98] font-semibold flex-1";

    return (
        <div 
            className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-[10000]"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm sm:max-w-md transform transition-all duration-300 scale-100 opacity-100 border-4 border-red-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4 border-b pb-3">
                    <h3 className="text-2xl font-bold text-red-700 flex items-center gap-2">
                        <Trash2 className="w-6 h-6" />
                        {title}
                    </h3>

                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <p className="text-gray-700 mb-6 text-base">{message}</p>
                
                {/* Footer Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">

                    <button
                        onClick={onClose}
                        className={`${buttonBase} bg-gray-200 text-gray-800 hover:bg-gray-300`}
                    >
                        Cancel
                    </button>

                    {/* DELETE BUTTON — soft hover, no brightness spike */}
                    <button
                        onClick={onConfirm}
                        className={`${buttonBase}
                            bg-red-500/80
                            text-white
                            hover:bg-red-500/90
                            shadow-inner
                            flex items-center justify-center gap-2
                        `}
                    >
                        <Trash2 className="w-5 h-5" />
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
