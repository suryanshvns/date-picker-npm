/**
 * Timezone-aware calendar parts using Intl (no extra deps).
 */

export type DateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const cache = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string, locale: string): Intl.DateTimeFormat {
  const key = `${locale}|${timeZone}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    });
    cache.set(key, f);
  }
  return f;
}

export function getPartsInTimeZone(date: Date, timeZone: string, locale: string): DateParts {
  const f = getFormatter(timeZone, locale);
  const parts = f.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return {
    year: Number(map.year),
    month: Number(map.month) - 1,
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
  };
}

/** “Today” as calendar date in the given zone */
export function getTodayInTimeZone(timeZone: string, locale: string, now = new Date()): Date {
  const p = getPartsInTimeZone(now, timeZone, locale);
  return new Date(p.year, p.month, p.day);
}

export function formatDateInTimeZone(
  date: Date,
  timeZone: string | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!timeZone) {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }
  return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(date);
}
