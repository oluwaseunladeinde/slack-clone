import { clsx, type ClassValue } from "clsx"
import { format, isToday, isYesterday } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getInitialCharacters = (fullName: string | undefined, firstOnly: boolean = true): string => {

  if (fullName === undefined) {
    return '';
  }
  // Split the full name into an array of words
  const words = fullName.split(' ');

  // Extract the first character from the first and last words
  const firstNameInitial = words[0][0];

  if (firstOnly) {
    return `${firstNameInitial}`;
  }

  const lastNameInitial = words[words.length - 1][0];
  // Combine the initials
  return `${firstNameInitial}${lastNameInitial}`;
}


export const generateWorkspaceCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");

  return code;
};


export const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
}