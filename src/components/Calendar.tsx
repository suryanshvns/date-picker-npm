import { useCallback, useMemo } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import type { WeekDay } from "../utils/dateHelpers";
import { getMonthGrid, isSameDay } from "../utils/dateHelpers";
import { getWeekdayLabels } from "../utils/locale";
import type { DayRenderProps } from "../types";
import { DayCell } from "./DayCell";
import { cn } from "../utils/cn";

export type CalendarProps = {
  visibleMonth: Date;
  weekStartsOn: WeekDay;
  locale: string;
  /** Calendar day used for “today” highlight */
  today: Date;
  focusedDate: Date;
  onFocusedDateChange: (d: Date) => void;
  onPageMonth: (delta: number) => void;
  getDayPropsBase?: (date: Date) => Record<string, unknown>;
  renderDay?: (props: DayRenderProps) => ReactNode;
  isInSelection: (date: Date) => boolean;
  isDateDisabled: (date: Date) => boolean;
  getRangePosition: (date: Date) => DayRenderProps["rangePosition"];
  selectDay: (date: Date) => void;
  classNames?: { grid?: string; weekRow?: string; weekdayHeader?: string; dayCell?: string };
};

export function Calendar(props: CalendarProps) {
  const {
    visibleMonth,
    weekStartsOn,
    locale,
    today,
    focusedDate,
    onFocusedDateChange,
    onPageMonth,
    getDayPropsBase,
    renderDay,
    isInSelection,
    isDateDisabled,
    getRangePosition,
    selectDay,
    classNames,
  } = props;

  const days = useMemo(() => getMonthGrid(visibleMonth, weekStartsOn), [visibleMonth, weekStartsOn]);
  const weekdayLabels = useMemo(
    () => getWeekdayLabels(locale, weekStartsOn, "short"),
    [locale, weekStartsOn],
  );

  const weeks = useMemo(() => {
    const rows: Date[][] = [];
    for (let r = 0; r < 6; r++) rows.push(days.slice(r * 7, r * 7 + 7)!);
    return rows;
  }, [days]);

  const moveFocus = useCallback(
    (date: Date) => {
      onFocusedDateChange(date);
    },
    [onFocusedDateChange],
  );

  const onGridKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const fd = focusedDate;
      const idx = days.findIndex((x) => isSameDay(x, fd));
      if (idx < 0) return;

      let n = idx;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          n = idx - 1;
          break;
        case "ArrowRight":
          e.preventDefault();
          n = idx + 1;
          break;
        case "ArrowUp":
          e.preventDefault();
          n = idx - 7;
          break;
        case "ArrowDown":
          e.preventDefault();
          n = idx + 7;
          break;
        case "Home":
          e.preventDefault();
          n = idx - (idx % 7);
          break;
        case "End":
          e.preventDefault();
          n = idx + (6 - (idx % 7));
          break;
        case "PageUp":
          e.preventDefault();
          onPageMonth(-1);
          return;
        case "PageDown":
          e.preventDefault();
          onPageMonth(1);
          return;
        case "Enter":
        case " ":
          e.preventDefault();
          selectDay(fd);
          return;
        default:
          return;
      }

      const next = days[n];
      if (n >= 0 && n < days.length && next) moveFocus(next);
    },
    [focusedDate, days, moveFocus, onPageMonth, selectDay],
  );

  return (
    <div
      role="grid"
      aria-label="Calendar"
      onKeyDown={onGridKeyDown}
      className={cn("outline-none", classNames?.grid)}
      tabIndex={-1}
    >
      <div
        className={cn(
          "mb-3 grid grid-cols-7 gap-x-0.5 gap-y-1 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--dp-fg-muted)]",
          classNames?.weekRow,
          classNames?.weekdayHeader,
        )}
      >
        {weekdayLabels.map((l) => (
          <div key={l} role="columnheader">
            {l}
          </div>
        ))}
      </div>
      {weeks.map((week, wi) => (
        <div
          key={wi}
          role="row"
          className={cn("grid grid-cols-7 gap-x-0.5 gap-y-1.5", classNames?.weekRow)}
        >
          {week.map((date) => {
            const inCurrentMonth =
              date.getMonth() === visibleMonth.getMonth() &&
              date.getFullYear() === visibleMonth.getFullYear();
            const isToday = isSameDay(date, today);
            const selected = isInSelection(date);
            const disabled = isDateDisabled(date);
            const focused = isSameDay(date, focusedDate);
            const rangePosition = getRangePosition(date);

            const getDayProps = (): Record<string, unknown> => ({
              role: "gridcell",
              "aria-selected": selected,
              "aria-disabled": disabled || undefined,
              "data-today": isToday || undefined,
              ...getDayPropsBase?.(date),
            });

            const dayProps: DayRenderProps = {
              date,
              inCurrentMonth,
              isToday,
              selected,
              disabled,
              rangePosition,
              focused,
              tabIndex: focused ? 0 : -1,
              onSelect: () => selectDay(date),
              getDayProps,
            };

            if (renderDay) return <div key={date.toISOString()}>{renderDay(dayProps)}</div>;

            return (
              <div key={date.toISOString()} className="flex min-h-[2.75rem] items-center justify-center">
                <DayCell {...dayProps} className={classNames?.dayCell} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
