import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSanitizedClientName(name: string | undefined | null): string {
  if (!name || !name.trim()) return '';
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.includes('select or enter client') ||
    lower.includes('select saved client') ||
    lower.includes('enter client...')
  ) {
    return '';
  }
  return trimmed;
}

