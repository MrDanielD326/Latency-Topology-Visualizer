"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CursorPosition, CustomCursorProps } from "@/types";

const CustomCursor: React.FC<CustomCursorProps> = ({ size = 1, color = "#fbf7f5", hideOnLeave = true }) => {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isOverModal, setIsOverModal] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      // Check if cursor is over modal elements
      const target = e.target as HTMLElement;
      const isOverModalElement = target?.closest('[data-testid="modal-overlay"], [data-testid="modal-content"], .modal-overlay, .modal-content') !== null;
      setIsOverModal(isOverModalElement);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => hideOnLeave && setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener("mousemove", updateCursorPosition);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", updateCursorPosition);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "auto";
    };
  }, [hideOnLeave]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
      style={{
        backgroundColor: isOverModal ? "#ffffff" : color,
        boxShadow: isClicking
          ? `0 0 4px ${isOverModal ? "#ffffff" : color}, 0 0 2px ${isOverModal ? "#ffffff" : color
          }40`
          : `0 0 2px ${isOverModal ? "#ffffff" : color}60, 0 0 1px ${isOverModal ? "#ffffff" : color
          }80`,
      }}
      animate={{
        width: isOverModal ? size / 1.5 : size / 2,
        height: isOverModal ? size / 1.5 : size / 2,
        x: cursorPosition.x - (isOverModal ? size / 3 : size / 4),
        y: cursorPosition.y - (isOverModal ? size / 3 : size / 4),
        scale: isClicking ? 1.2 : isOverModal ? 1.1 : 1,
        opacity: isVisible ? 1 : 0
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.5
      }}
      initial={{ opacity: 0, scale: 0 }}
    />
  );
};

export default CustomCursor;
