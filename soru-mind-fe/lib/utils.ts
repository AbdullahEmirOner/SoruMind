import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatExplanation(text: string): string {
  if (!text) return "";
  
  // 1. Ensure options A) B) C) etc. are on new lines
  // Replace space followed by option letter+paren with double newline + letter+paren
  let formatted = text.replace(/\s+([A-E]\))/g, "\n$1");
  
  // 2. Add newline before "Cevap" or "Sonuç" if they exist and are buried
  formatted = formatted.replace(/\s(Cevap|Sonuç):/g, "\n\n$1:");

  // 3. Add newline before "Diğer" if it starts a concluding sentence (common pattern)
  // formatted = formatted.replace(/\s(Diğer)/g, "\n\n$1");
  
  return formatted;
}
