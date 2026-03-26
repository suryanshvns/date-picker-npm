import type { CalendarView, HeaderRenderProps } from "../types";
import { cn } from "../utils/cn";

export type HeaderComponentProps = HeaderRenderProps & {
  className?: string;
  title?: string;
  onTitleClick?: () => void;
};

function viewCycle(v: CalendarView): CalendarView {
  if (v === "day") return "month";
  if (v === "month") return "year";
  return "day";
}

function ChevronLeft(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

function ChevronRight(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function Header(props: HeaderComponentProps) {
  const {
    className,
    title,
    visibleMonth,
    view,
    goToPrev,
    goToNext,
    setView,
    titleId,
    onTitleClick,
    locale = "en-US",
    setVisibleMonth,
    navigationVariant = "title",
  } = props;

  const defaultTitleClick = () => setView(viewCycle(view));
  const y = visibleMonth.getFullYear();
  const m = visibleMonth.getMonth();

  const monthLabels = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, i, 1)),
  );

  const yearFrom = y - 60;
  const yearTo = y + 24;
  const years = Array.from({ length: yearTo - yearFrom + 1 }, (_, i) => yearFrom + i);

  const navBtn = cn(
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--dp-radius-md)]",
    "border border-[color:var(--dp-border)] bg-gradient-to-b from-[color:var(--dp-surface)] to-[color:var(--dp-surface-muted)]",
    "text-[color:var(--dp-fg-subtle)] shadow-[0_1px_2px_rgb(15_23_42/0.04)]",
    "transition-[color,transform,box-shadow] duration-200 ease-out",
    "hover:border-[color:var(--dp-primary)] hover:text-[color:var(--dp-primary)] hover:shadow-[0_6px_16px_-8px_var(--dp-cell-selected-glow)]",
    "active:scale-[0.96]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dp-focus-ring)]",
  );

  const selectCls = cn(
    "dp-select min-w-0 rounded-[var(--dp-radius-md)] border border-[color:var(--dp-input-border)]",
    "bg-gradient-to-b from-[color:var(--dp-surface)] to-[color:var(--dp-surface-muted)]",
    "pl-3 pr-9 py-2 text-sm font-semibold tracking-tight text-[color:var(--dp-fg)]",
    "shadow-[var(--dp-input-inset),0_1px_2px_rgb(15_23_42/0.04)]",
    "transition-[border-color,box-shadow] duration-200",
    "hover:border-[color:var(--dp-primary)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dp-focus-ring)]",
  );

  const showDropdowns = navigationVariant === "dropdowns" && view === "day" && setVisibleMonth;

  return (
    <div className={cn("mb-5 flex items-center gap-2.5", className)}>
      <button type="button" className={navBtn} aria-label="Previous" onClick={goToPrev}>
        <ChevronLeft className="h-4 w-4" />
      </button>

      {showDropdowns ? (
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <label className="sr-only" htmlFor={`${titleId}-month`}>
            Month
          </label>
          <select
            id={`${titleId}-month`}
            className={cn(selectCls, "max-w-[52%] flex-1")}
            value={m}
            onChange={(e) => setVisibleMonth(new Date(y, Number(e.target.value), 1))}
          >
            {monthLabels.map((label, idx) => (
              <option key={label} value={idx}>
                {label}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor={`${titleId}-year`}>
            Year
          </label>
          <select
            id={`${titleId}-year`}
            className={cn(selectCls, "max-w-[44%] flex-1")}
            value={y}
            onChange={(e) => setVisibleMonth(new Date(Number(e.target.value), m, 1))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <button
          type="button"
          id={titleId}
          className={cn(
            "min-w-0 flex-1 truncate rounded-[var(--dp-radius-md)] px-3 py-2 text-center text-sm font-bold tracking-tight text-[color:var(--dp-fg)]",
            "transition-colors hover:bg-[color:var(--dp-surface-muted)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dp-focus-ring)]",
          )}
          onClick={onTitleClick ?? defaultTitleClick}
        >
          {title ?? visibleMonth.toLocaleDateString()}
        </button>
      )}

      <button type="button" className={navBtn} aria-label="Next" onClick={goToNext}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
