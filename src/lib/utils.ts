import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSectionAnchorId(value?: string | null) {
  const rawValue = value?.trim();

  if (!rawValue) {
    return undefined;
  }

  const normalizedValue = rawValue
    .replace(/^#+/, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedValue || undefined;
}
