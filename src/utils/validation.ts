import type { DisabledMatcher } from "../types";
import { compareDay, startOfDay } from "./dateHelpers";

export function isDisabledByMatchers(
  date: Date,
  matchers: DisabledMatcher | undefined,
): boolean {
  if (!matchers) return false;
  const list = Array.isArray(matchers) ? matchers : [matchers];
  for (const m of list) {
    if (m instanceof Date) {
      if (compareDay(date, m) === 0) return true;
    } else if (typeof m === "function") {
      if (m(date)) return true;
    }
  }
  return false;
}

export function isOutOfRange(date: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate && compareDay(date, startOfDay(minDate)) < 0) return true;
  if (maxDate && compareDay(date, startOfDay(maxDate)) > 0) return true;
  return false;
}

export function isWeekend(date: Date): boolean {
  const d = date.getDay();
  return d === 0 || d === 6;
}
