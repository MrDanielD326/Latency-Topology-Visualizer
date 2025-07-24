import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLatency(latency: number): string {
  return `${latency.toFixed(1)}ms`;
}

export function getLatencyColor(latency: number): string {
  if (latency < 50) return "#10b981"; // green
  if (latency < 100) return "#f59e0b"; // yellow
  return "#ef4444"; // red
}

export function generateMockLatency(): number {
  return Math.random() * 200 + 10; // 10-210ms
}

export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
