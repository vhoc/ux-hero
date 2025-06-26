import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compares two arrays for equality by value and order.
 * Returns true if both arrays have the same values in the same order.
 * Handles arrays of any type, including null/undefined values.
 */
export function arraysEqual<T>(a: T[] | null | undefined, b: T[] | null | undefined): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}