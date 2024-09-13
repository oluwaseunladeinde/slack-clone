import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getInitialCharacters = (fullName: string | undefined): string => {

  if (fullName === undefined) {
    return '';
  }
  // Split the full name into an array of words
  const words = fullName.split(' ');

  // Extract the first character from the first and last words
  const firstNameInitial = words[0][0];
  const lastNameInitial = words[words.length - 1][0];

  // Combine the initials
  return `${firstNameInitial}${lastNameInitial}`;
}
