import { isAround } from "malachite-ui/predicate";

function get_percentage(amount: number, max: number) {
  return (amount / max) * 100;
}

export function get_char_count_colour(char_count: number, min: number, max: number) {
  if (isAround(char_count, { min: 0, max: min })) return "text-rose-400";
  const percentage = get_percentage(char_count, max);
  if (isAround(percentage, { min: 0, max: 50 })) return "text-lime-400";
  if (isAround(percentage, { min: 50, max: 80 })) return "text-orange-400";
  return "text-rose-400";
}