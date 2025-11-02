import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const API_URL = process.env.API_URL;
export const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
