"use client";

import { ModalPortalProps } from "@/types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ModalPortal({ children, isOpen }: ModalPortalProps) {
  const [mounted, setMounted] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Ensure we're in the browser
    setMounted(true);

    // Create or get modal portal element
    let modalRoot = document.getElementById("modal-root");
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "modal-root";
      modalRoot.style.position = "relative";
      modalRoot.style.zIndex = "9999";
      document.body.appendChild(modalRoot);
    }

    setPortalElement(modalRoot);

    return () => {
      // Clean up if this was the last modal
      if (modalRoot && modalRoot.children.length === 0) {
        document.body.removeChild(modalRoot);
      }
    };
  }, []);

  // Don't render anything on server-side or if not mounted
  if (!mounted || !portalElement || !isOpen) {
    return null;
  }

  try {
    return createPortal(children, portalElement);
  } catch (error) {
    console.error("Modal portal error:", error);
    // Fallback: render inline if portal fails
    return <div className="modal-fallback">{children}</div>;
  }
}
