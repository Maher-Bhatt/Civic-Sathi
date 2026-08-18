import { format } from "date-fns";

/**
 * Safely format a date value. Returns the formatted string if the date is valid,
 * otherwise returns the fallback string (defaults to "—").
 */
export function safeFormat(
  value: string | number | Date | null | undefined,
  pattern: string,
  fallback = "—"
): string {
  if (value == null || value === "") return fallback;
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return fallback;
    return format(d, pattern);
  } catch {
    return fallback;
  }
}
