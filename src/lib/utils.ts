import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared easing — typed as a cubic-bezier tuple so Framer Motion's `Variants`
// type-checks (a bare `number[]` is not assignable to its `Easing` type).
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Convertit un numéro FR (0X XX…) au format international +33X… pour tel:/wa.me.
function intlFr(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `33${digits.slice(1)}`;
  if (digits.startsWith("33")) return digits;
  return digits;
}

export function telLink(raw: string) {
  return `tel:+${intlFr(raw)}`;
}

export function waLink(raw: string, message?: string) {
  const base = `https://wa.me/${intlFr(raw)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
