import type { CalendarView } from "../types";
import { cn } from "../utils/cn";

export type MonthYearViewProps = {
  view: CalendarView;
  visibleMonth: Date;
  locale: string;
  setVisibleMonth: (d: Date) => void;
  setView: (v: CalendarView) => void;
  className?: string;
};

const tile = cn(
  "rounded-[var(--dp-radius-md)] px-2 py-3 text-sm font-bold tracking-tight transition-[transform,box-shadow] duration-200",
  "border border-transparent text-[color:var(--dp-fg)]",
  "bg-gradient-to-b from-[color:var(--dp-surface)] to-[color:var(--dp-surface-muted)]",
  "shadow-[0_1px_2px_rgb(15_23_42/0.04)]",
  "hover:-translate-y-0.5 hover:border-[color:var(--dp-border)] hover:shadow-[0_12px_28px_-18px_rgb(15_23_42/0.15)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dp-focus-ring)]",
);

export function MonthYearView(props: MonthYearViewProps) {
  const { view, visibleMonth, locale, setVisibleMonth, setView, className } = props;
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  if (view === "month") {
    const labels = Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat(locale, { month: "short" }).format(new Date(year, i, 1)),
    );
    return (
      <div className={cn("grid grid-cols-3 gap-2", className)} role="grid" aria-label="Months">
        {labels.map((label, i) => (
          <button
            key={label}
            type="button"
            role="gridcell"
            className={cn(
              tile,
              i === month &&
                "border-[color:var(--dp-primary)] bg-gradient-to-br from-[color:var(--dp-primary)] to-[color:var(--dp-accent)] text-[color:var(--dp-on-primary)] shadow-[0_12px_28px_-14px_var(--dp-cell-selected-glow)] hover:!translate-y-0",
            )}
            onClick={() => {
              setVisibleMonth(new Date(year, i, 1));
              setView("day");
            }}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  if (view === "year") {
    const decadeStart = Math.floor(year / 10) * 10;
    const years = Array.from({ length: 12 }, (_, i) => decadeStart + i - 1);
    return (
      <div className={cn("grid grid-cols-3 gap-2", className)} role="grid" aria-label="Years">
        {years.map((y) => (
          <button
            key={y}
            type="button"
            role="gridcell"
            className={cn(
              tile,
              y === year &&
                "border-[color:var(--dp-primary)] bg-gradient-to-br from-[color:var(--dp-primary)] to-[color:var(--dp-accent)] text-[color:var(--dp-on-primary)] shadow-[0_12px_28px_-14px_var(--dp-cell-selected-glow)] hover:!translate-y-0",
              (y < decadeStart || y > decadeStart + 9) &&
                "text-[color:var(--dp-fg-subtle)] opacity-75",
            )}
            onClick={() => {
              setVisibleMonth(new Date(y, month, 1));
              setView("month");
            }}
          >
            {y}
          </button>
        ))}
      </div>
    );
  }

  return null;
}
