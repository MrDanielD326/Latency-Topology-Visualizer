import { CursorConfig } from "@/types";
import { useCallback } from "react";

export const useCursor = () => {
  const setCursorHover = useCallback((isHovering: boolean) => {
    const event = new CustomEvent("cursor-hover", { detail: { isHovering } });
    document.dispatchEvent(event);
  }, []);

  const setCursorClicking = useCallback((isClicking: boolean) => {
    const event = new CustomEvent("cursor-clicking", {
      detail: { isClicking }
    });
    document.dispatchEvent(event);
  }, []);

  const setCursorVariant = useCallback(
    (variant: "default" | "hovering" | "clicking" | "hidden") => {
      const event = new CustomEvent("cursor-variant", { detail: { variant } });
      document.dispatchEvent(event);
    }, []
  );

  const setCursorConfig = useCallback((config: CursorConfig) => {
    const event = new CustomEvent("cursor-config", { detail: { config } });
    document.dispatchEvent(event);
  }, []);

  return { setCursorHover, setCursorClicking, setCursorVariant, setCursorConfig };
};
