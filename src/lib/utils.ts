import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared easing — typed as a cubic-bezier tuple so Framer Motion's `Variants`
// type-checks (a bare `number[]` is not assignable to its `Easing` type).
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
