import type { WeekDay } from "./dateHelpers";

/**
 * Map Intl.Locale weekInfo.firstDay (1=Mon … 7=Sun) to JS getDay() (0=Sun … 6=Sat).
 */
type LocaleWithWeekInfo = Intl.Locale & {
  weekInfo?: { firstDay?: number };
};

export function getWeekStartsOnFromLocale(locale: string): WeekDay | undefined {
  try {
    const loc = new Intl.Locale(locale) as LocaleWithWeekInfo;
    const wi = loc.weekInfo;
    if (wi?.firstDay == null) return undefined;
    const fd = wi.firstDay;
    // 1..7 ISO-like: 1 Monday, 7 Sunday
    if (fd === 7) return 0;
    return fd as WeekDay;
  } catch {
    return undefined;
  }
}

export function getWeekdayLabels(
  locale: string,
  weekStartsOn: WeekDay,
  format: "narrow" | "short" | "long" = "short",
): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
  const base = new Date(2024, 6, 7); // Sunday
  const byWeekday: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    byWeekday[d.getDay()] = formatter.format(d);
  }
  const out: string[] = [];
  for (let i = 0; i < 7; i++) {
    const idx = (weekStartsOn + i) % 7;
    out.push(byWeekday[idx]!);
  }
  return out;
}
