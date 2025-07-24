"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import ModalPortal from "./ModalPortal";
import { ModalProps } from "@/types";

export default function Modal({ isOpen, onClose, title, children, size = "md", className, closeOnBackdropClick = true, closeOnEscape = true }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const firstFocusableElement = useRef<HTMLElement | null>(null);
  const lastFocusableElement = useRef<HTMLElement | null>(null);

  // Memoized close handler to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    if (typeof onClose === "function") {
      onClose();
    }
  }, [onClose]);

  // Handle escape key press
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape, true);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape, true);
    };
  }, [isOpen, handleClose, closeOnEscape]);

  // Focus management and accessibility
  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Find focusable elements within the modal
    const focusableElements = modalRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

    if (focusableElements && focusableElements.length > 0) {
      firstFocusableElement.current = focusableElements[0] as HTMLElement;
      lastFocusableElement.current = focusableElements[focusableElements.length - 1] as HTMLElement;
      // Focus the first focusable element
      firstFocusableElement.current?.focus();
    }

    return () => {
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen]);

  // Handle tab key for focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab (backward)
        if (document.activeElement === firstFocusableElement.current) {
          e.preventDefault();
          lastFocusableElement.current?.focus();
        }
      } else {
        // Tab (forward)
        if (document.activeElement === lastFocusableElement.current) {
          e.preventDefault();
          firstFocusableElement.current?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Prevent body scroll when modal is open with better cross-browser support
  useEffect(() => {
    if (!isOpen) return;

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Store original values
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Apply modal styles
    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      // Restore original styles
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  // Handle backdrop click - moved before early return to fix hooks rule
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (closeOnBackdropClick && e.target === e.currentTarget) {
        handleClose();
      }
    },
    [closeOnBackdropClick, handleClose]
  );

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-[95vw] max-h-[95vh]"
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 modal-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={handleBackdropClick}
        data-testid="modal-overlay"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 modal-backdrop"
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className={cn(
            "relative w-full mx-auto bg-gray-900/95 border border-gray-700 rounded-lg shadow-2xl modal-content",
            "transform transition-all duration-300 ease-out",
            "animate-in fade-in-0 zoom-in-95",
            "focus:outline-none",
            sizeClasses[size],
            className
          )}
          onClick={(e) => e.stopPropagation()}
          data-testid="modal-content"
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <h2 id="modal-title" className="text-lg font-semibold text-white">
                {title}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Close modal"
                data-testid="modal-close-button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Close button when no title */}
          {!title && (
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Close modal"
              data-testid="modal-close-button"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Content */}
          <div className={cn("overflow-auto flex-1", title ? "p-6" : "p-6 pt-12", "max-h-[calc(100vh-8rem)]")}>
            {children}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
