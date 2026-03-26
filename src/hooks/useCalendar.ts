import { useCallback, useMemo, useState } from "react";
import type { CalendarView } from "../types";
import { addMonths, addYears, startOfMonth } from "../utils/dateHelpers";

export type UseCalendarOptions = {
  defaultMonth?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  defaultView?: CalendarView;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
};

export type UseCalendarReturn = {
  visibleMonth: Date;
  setVisibleMonth: (d: Date) => void;
  view: CalendarView;
  setView: (v: CalendarView) => void;
  goToPrev: () => void;
  goToNext: () => void;
  goToDate: (date: Date) => void;
};

function normalizeMonth(d: Date): Date {
  return startOfMonth(d);
}

export function useCalendar(options: UseCalendarOptions = {}): UseCalendarReturn {
  const {
    defaultMonth = new Date(),
    month: monthControlled,
    onMonthChange,
    defaultView = "day",
    view: viewControlled,
    onViewChange,
  } = options;

  const [monthUncontrolled, setMonthUncontrolled] = useState(() =>
    normalizeMonth(defaultMonth),
  );
  const [viewUncontrolled, setViewUncontrolled] = useState<CalendarView>(defaultView);

  const isMonthControlled = monthControlled !== undefined;
  const visibleMonth = isMonthControlled ? normalizeMonth(monthControlled) : monthUncontrolled;

  const setVisibleMonth = useCallback(
    (d: Date) => {
      const next = normalizeMonth(d);
      if (!isMonthControlled) setMonthUncontrolled(next);
      onMonthChange?.(next);
    },
    [isMonthControlled, onMonthChange],
  );

  const isViewControlled = viewControlled !== undefined;
  const view = isViewControlled ? viewControlled : viewUncontrolled;

  const setView = useCallback(
    (v: CalendarView) => {
      if (!isViewControlled) setViewUncontrolled(v);
      onViewChange?.(v);
    },
    [isViewControlled, onViewChange],
  );

  const goToPrev = useCallback(() => {
    if (view === "day") setVisibleMonth(addMonths(visibleMonth, -1));
    else if (view === "month") setVisibleMonth(addYears(visibleMonth, -1));
    else setVisibleMonth(addYears(visibleMonth, -10));
  }, [view, visibleMonth, setVisibleMonth]);

  const goToNext = useCallback(() => {
    if (view === "day") setVisibleMonth(addMonths(visibleMonth, 1));
    else if (view === "month") setVisibleMonth(addYears(visibleMonth, 1));
    else setVisibleMonth(addYears(visibleMonth, 10));
  }, [view, visibleMonth, setVisibleMonth]);

  const goToDate = useCallback(
    (date: Date) => {
      setVisibleMonth(normalizeMonth(date));
    },
    [setVisibleMonth],
  );

  return useMemo(
    () => ({
      visibleMonth,
      setVisibleMonth,
      view,
      setView,
      goToPrev,
      goToNext,
      goToDate,
    }),
    [visibleMonth, setVisibleMonth, view, setView, goToPrev, goToNext, goToDate],
  );
}
