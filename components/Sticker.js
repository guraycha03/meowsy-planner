"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Reduced sticker size for calculation (used 50 in previous context)
const STICKER_SIZE = 50; 

export default function Sticker({ 
    id, 
    src, 
    initialXPercent = 0.1, 
    initialYPercent = 0.1, 
    onDragStop, 
    stickerSize = STICKER_SIZE // Use prop if passed, otherwise default
}) {
    const stickerRef = useRef(null);
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null); 

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const posRef = useRef(pos); 
    
    // Keep a reference to the latest position for drag stop
    useEffect(() => {
        posRef.current = pos;
    }, [pos]);


    // --- Calculate Initial Position and Handle Container Resize ---
    useEffect(() => {
        const container = document.getElementById("note-area");
        containerRef.current = container;

        if (!container) return;

        const calculatePosition = () => {
            // Calculate maximum pixel bounds where the sticker's top-left corner can be
            const maxClientWidth = container.clientWidth - stickerSize;
            const maxClientHeight = container.clientHeight - stickerSize;
            
            // Check if bounds are valid (avoid NaN/Infinity on initial load)
            if (maxClientWidth <= 0 || maxClientHeight <= 0) return;

            setPos({
                // Calculate position based on saved percentage * max available space
                x: initialXPercent * maxClientWidth,
                y: initialYPercent * maxClientHeight,
            });
        };

        calculatePosition();

        // Listen for container resizing
        const observer = new ResizeObserver(calculatePosition);
        observer.observe(container);

        return () => {
            observer.unobserve(container);
        };

    }, [initialXPercent, initialYPercent, stickerSize]); 


    // --- Core Drag Handling Logic (Shared by Mouse and Touch) ---

    // Utility function to get coordinates from either mouse or touch event
    const getCoords = (e) => {
        if (e.touches) {
            // Use the first touch point for simplicity
            return {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
        }
        return {
            x: e.clientX,
            y: e.clientY,
        };
    };

    const handleDragMove = (e) => {
        if (!dragging.current || !containerRef.current) return;
        
        // Prevent scrolling/other default touch actions while dragging
        if (e.type.startsWith('touch')) {
            e.preventDefault();
        }

        const bounds = containerRef.current.getBoundingClientRect();
        const coords = getCoords(e);

        let newX = coords.x - bounds.left - offset.current.x;
        let newY = coords.y - bounds.top - offset.current.y;

        // Recalculate max boundaries on the fly
        const maxX = bounds.width - stickerSize;
        const maxY = bounds.height - stickerSize;

        // Clamp the position to be within the note area boundaries
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        setPos({ x: newX, y: newY });
    };

    const handleDragStop = () => {
        if (!dragging.current) return;
        dragging.current = false;
        
        // Remove event listeners for both mouse and touch
        document.removeEventListener("mousemove", handleDragMove);
        document.removeEventListener("mouseup", handleDragStop);
        document.removeEventListener("touchmove", handleDragMove);
        document.removeEventListener("touchend", handleDragStop);

        if (onDragStop) {
            // Pass the current pixel coordinates to the parent
            onDragStop(id, posRef.current.x, posRef.current.y);
        }
    };

    const handleDragStart = (e) => {
        e.preventDefault(); // Prevent default browser drag behavior
        
        // Check for right-click on mouse events
        if (e.type === 'mousedown' && e.button !== 0) return; 

        dragging.current = true;

        const rect = stickerRef.current.getBoundingClientRect();
        const coords = getCoords(e);
        
        // Calculate offset (where the mouse/touch is relative to the sticker's top-left)
        offset.current = {
            x: coords.x - rect.left,
            y: coords.y - rect.top,
        };
        
        // Add event listeners based on the event type
        if (e.type === 'mousedown') {
            document.addEventListener("mousemove", handleDragMove);
            document.addEventListener("mouseup", handleDragStop);
        } else if (e.type === 'touchstart') {
            document.addEventListener("touchmove", handleDragMove, { passive: false }); // Use passive: false for e.preventDefault()
            document.addEventListener("touchend", handleDragStop);
        }
    };
    
    // --- Render ---

    return (
        <div
            ref={stickerRef}
            // MOUSE Events
            onMouseDown={handleDragStart}
            // TOUCH Events
            onTouchStart={handleDragStart}
            
            className="absolute cursor-grab active:cursor-grabbing select-none"
            style={{
                left: pos.x,
                top: pos.y,
                zIndex: 50,
                width: stickerSize,
                height: stickerSize,
            }}
        >
            <Image
                src={src}
                alt="sticker"
                width={stickerSize}
                height={stickerSize}
                draggable={false}
                className="w-full h-full"
            />
        </div>
    );
}