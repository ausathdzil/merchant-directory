import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const API_URL = process.env.API_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
