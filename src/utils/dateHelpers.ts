/** Calendar math using local Date; pair with timezone helpers for display */

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + amount);
  if (d.getDate() < day) {
    d.setDate(0);
  }
  return d;
}

export function addYears(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + amount);
  return d;
}

export function startOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isSameYear(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear();
}

export function compareDay(a: Date, b: Date): number {
  const da = startOfDay(a).getTime();
  const db = startOfDay(b).getTime();
  return da === db ? 0 : da < db ? -1 : 1;
}

export function clampDate(date: Date, min?: Date, max?: Date): Date {
  let d = date;
  if (min && compareDay(d, min) < 0) d = startOfDay(min);
  if (max && compareDay(d, max) > 0) d = startOfDay(max);
  return d;
}

export function getDaysInMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Build a month grid: 6 rows × 7 columns, weekStartsOn 0 = Sunday.
 */
export function getMonthGrid(visibleMonth: Date, weekStartsOn: WeekDay): Date[] {
  const start = startOfMonth(visibleMonth);
  const startWeekday = start.getDay();
  const offset = (startWeekday - weekStartsOn + 7) % 7;
  const firstCell = addDays(start, -offset);
  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(addDays(firstCell, i));
  }
  return days;
}

export function toMonthIndex(date: Date): number {
  return date.getMonth();
}

export function toYear(date: Date): number {
  return date.getFullYear();
}
