import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFromAndTo(page: number, perPage: number) {
  let from = page * perPage;
  const to = from + perPage;

  if (page > 0) {
    from += 1;
  }

  return { from, to };
}
