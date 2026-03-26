import { useEffect, useId, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { DatePickerBaseProps, HeaderRenderProps } from "../types";
import { useCalendar } from "../hooks/useCalendar";
import { useDatePicker } from "../hooks/useDatePicker";
import type { DatePickerSelectionValue } from "../hooks/useDatePicker";
import { addMonths, isSameDay } from "../utils/dateHelpers";
import type { WeekDay } from "../utils/dateHelpers";
import { getWeekStartsOnFromLocale } from "../utils/locale";
import { getTodayInTimeZone } from "../utils/timezone";
import { formatDateInTimeZone } from "../utils/timezone";
import { cn } from "../utils/cn";
import { Calendar } from "./Calendar";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MonthYearView } from "./MonthYearView";
import { TimePicker } from "../time/TimePicker";
import { getDefaultDatepickerRootStyle } from "../theme/defaultTheme";

export type DatePickerProps = DatePickerBaseProps;

export function DatePicker(props: DatePickerProps) {
  const {
    mode = "single",
    value,
    defaultValue,
    onChange,
    minDate,
    maxDate,
    disabledDates,
    weekStartsOn: weekStartsOnProp,
    locale = typeof navigator !== "undefined" ? navigator.language : "en-US",
    timeZone,
    defaultMonth,
    month,
    onMonthChange,
    defaultView,
    view,
    onViewChange,
    showTime = false,
    timeStepMinutes = 1,
    use12HourClock = true,
    showSeconds = false,
    className,
    classNames,
    theme,
    themeVars,
    style: styleProp,
    instruction,
    navigationVariant = "dropdowns",
    id,
    presets,
    plugins,
    renderDay,
    renderHeader,
    renderFooter,
    onApply,
    onCancel,
    applyLabel = "Apply",
    cancelLabel = "Cancel",
    footerSummary,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  } = props;

  const calendar = useCalendar({
    defaultMonth,
    month,
    onMonthChange,
    defaultView,
    view,
    onViewChange,
  });

  const selection = useDatePicker({
    mode,
    value: value as DatePickerSelectionValue | undefined,
    defaultValue: defaultValue as DatePickerSelectionValue | undefined,
    onChange: onChange as ((v: DatePickerSelectionValue) => void) | undefined,
    minDate,
    maxDate,
    disabledDates,
  });

  useEffect(() => {
    const cleanups = plugins?.map((p) => p.setup?.({ mode, locale, timeZone }));
    return () => {
      cleanups?.forEach((c) => {
        if (typeof c === "function") c();
      });
    };
  }, [plugins, mode, locale, timeZone]);

  const weekStartsOn = useMemo((): WeekDay => {
    if (weekStartsOnProp != null) return weekStartsOnProp;
    return (getWeekStartsOnFromLocale(locale) ?? 0) as WeekDay;
  }, [weekStartsOnProp, locale]);

  const today = useMemo(() => {
    if (timeZone) return getTodayInTimeZone(timeZone, locale);
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }, [timeZone, locale]);

  const [focusedDate, setFocusedDate] = useState(() => today);

  const titleId = useId();

  const headerTitle = useMemo(() => {
    const { visibleMonth, view: v } = calendar;
    if (v === "day") {
      return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        visibleMonth,
      );
    }
    if (v === "month") {
      return new Intl.DateTimeFormat(locale, { year: "numeric" }).format(visibleMonth);
    }
    const y = visibleMonth.getFullYear();
    const start = Math.floor(y / 10) * 10;
    return `${start}–${start + 9}`;
  }, [calendar.visibleMonth, calendar.view, locale]);

  const instructionText =
    instruction !== undefined
      ? instruction || undefined
      : mode === "range"
        ? "Select start date, then select end date."
        : undefined;

  const onPageMonth = (delta: number) => {
    if (calendar.view === "day") {
      const next = addMonths(calendar.visibleMonth, delta);
      calendar.setVisibleMonth(next);
      const nextFocus = addMonths(focusedDate, delta);
      setFocusedDate(nextFocus);
    }
  };

  const headerProps: HeaderRenderProps = {
    visibleMonth: calendar.visibleMonth,
    view: calendar.view,
    goToPrev: calendar.goToPrev,
    goToNext: calendar.goToNext,
    setView: calendar.setView,
    titleId,
    locale,
    setVisibleMonth: calendar.setVisibleMonth,
    navigationVariant,
  };

  const footerHint =
    mode === "range" && selection.value && typeof selection.value === "object" && "start" in selection.value
      ? (() => {
          const r = selection.value as { start: Date | null; end: Date | null };
          if (!r.start) return undefined;
          const fmt = (d: Date) =>
            formatDateInTimeZone(d, timeZone, locale, { dateStyle: "medium" });
          if (!r.end) return `${fmt(r.start)} – …`;
          return `${fmt(r.start)} – ${fmt(r.end)}`;
        })()
      : mode === "single" && selection.value instanceof Date
        ? formatDateInTimeZone(selection.value, timeZone, locale, { dateStyle: "full" })
        : undefined;

  const hasActionBar = Boolean(onApply || onCancel);
  const showFooterHint = footerSummary ?? !hasActionBar;

  const rootStyle = useMemo(
    () =>
      ({
        ...getDefaultDatepickerRootStyle(themeVars),
        ...styleProp,
      }) as CSSProperties,
    [themeVars, styleProp],
  );

  const presetBtn = cn(
    "rounded-full border px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide",
    "border-[color:var(--dp-preset-border)] bg-[color:var(--dp-preset-bg)] text-[color:var(--dp-primary)]",
    "backdrop-blur-md shadow-[0_1px_2px_rgb(15_23_42/0.04)]",
    "transition-[transform,box-shadow,background-color] duration-200 ease-out",
    "hover:-translate-y-0.5 hover:bg-[color:var(--dp-range-mid)] hover:shadow-[0_10px_24px_-14px_var(--dp-cell-selected-glow)]",
    "active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dp-focus-ring)]",
    classNames?.presetButton,
  );

  return (
    <section
      id={id}
      style={rootStyle}
      className={cn(
        "datepicker-root relative isolate w-full max-w-[400px] overflow-hidden px-6 pb-6 pt-5",
        className,
        classNames?.root,
      )}
      data-theme={theme?.name}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy ?? titleId}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--dp-primary)] to-transparent opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-[color:var(--dp-accent-soft)] blur-3xl"
      />

      {presets && mode === "range" ? (
        <div className={cn("relative mb-4 flex flex-wrap gap-2", classNames?.presetsRow)}>
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className={presetBtn}
              onClick={() => {
                const { start, end } = p.getRange(new Date());
                selection.setValue({ start, end });
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : null}

      {instructionText ? (
        <p
          className={cn(
            "relative mb-4 text-[13px] font-medium leading-relaxed text-[color:var(--dp-fg-muted)]",
            classNames?.instruction,
          )}
        >
          {instructionText}
        </p>
      ) : null}

      {renderHeader ? (
        renderHeader(headerProps)
      ) : (
        <Header {...headerProps} className={classNames?.header} title={headerTitle} />
      )}

      <div className={cn("relative", classNames?.calendar)}>
        {calendar.view === "day" ? (
          <Calendar
            visibleMonth={calendar.visibleMonth}
            weekStartsOn={weekStartsOn}
            locale={locale}
            today={today}
            focusedDate={focusedDate}
            onFocusedDateChange={setFocusedDate}
            onPageMonth={onPageMonth}
            renderDay={renderDay}
            isInSelection={selection.isInSelection}
            isDateDisabled={selection.isDateDisabled}
            getRangePosition={selection.getRangePosition}
            selectDay={(d) => {
              selection.selectDay(d);
              if (!isSameDay(d, focusedDate)) setFocusedDate(d);
              calendar.goToDate(d);
            }}
            classNames={{
              grid: classNames?.grid,
              weekRow: classNames?.weekRow,
              weekdayHeader: classNames?.weekdayHeader,
              dayCell: classNames?.dayCell,
            }}
          />
        ) : (
          <MonthYearView
            view={calendar.view}
            visibleMonth={calendar.visibleMonth}
            locale={locale}
            setVisibleMonth={calendar.setVisibleMonth}
            setView={calendar.setView}
          />
        )}
      </div>

      {showTime && mode === "range" ? (
        <div
          className={cn(
            "relative mt-5 space-y-4 border-t border-[color:var(--dp-border)] pt-5",
            classNames?.timeSection,
          )}
        >
          <TimePicker
            label="Start time"
            mode={mode}
            value={selection.value}
            onChange={selection.setValue}
            stepMinutes={timeStepMinutes}
            use12Hour={use12HourClock}
            showSeconds={showSeconds}
            rangeTarget="start"
          />
          <TimePicker
            label="End time"
            mode={mode}
            value={selection.value}
            onChange={selection.setValue}
            stepMinutes={timeStepMinutes}
            use12Hour={use12HourClock}
            showSeconds={showSeconds}
            rangeTarget="end"
          />
        </div>
      ) : showTime ? (
        <div
          className={cn(
            "relative mt-5 border-t border-[color:var(--dp-border)] pt-5",
            classNames?.timeSection,
          )}
        >
          <TimePicker
            mode={mode}
            value={selection.value}
            onChange={selection.setValue}
            stepMinutes={timeStepMinutes}
            use12Hour={use12HourClock}
            showSeconds={showSeconds}
          />
        </div>
      ) : null}

      {hasActionBar ? (
        <div className={cn("relative mt-6 flex justify-end gap-2.5", classNames?.actionBar)}>
          {onCancel ? (
            <button
              type="button"
              className={cn(
                "rounded-[var(--dp-radius-md)] border-2 border-[color:var(--dp-danger-border)] bg-[color:var(--dp-danger-surface)] px-5 py-2.5 text-sm font-bold text-[color:var(--dp-danger)]",
                "shadow-[0_1px_2px_rgb(15_23_42/0.04)] transition-[transform,background-color] duration-200",
                "hover:bg-[color:var(--dp-surface-muted)] active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dp-focus-ring)]",
                classNames?.cancelButton,
              )}
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
          ) : null}
          {onApply ? (
            <button
              type="button"
              className={cn(
                "rounded-[var(--dp-radius-md)] bg-gradient-to-br from-[color:var(--dp-primary)] to-[color:var(--dp-accent)]",
                "px-6 py-2.5 text-sm font-bold text-[color:var(--dp-on-primary)]",
                "shadow-[0_12px_28px_-14px_var(--dp-cell-selected-glow),0_2px_6px_-2px_rgb(15_23_42/0.12)]",
                "transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dp-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--dp-surface)]",
                classNames?.applyButton,
              )}
              onClick={onApply}
            >
              {applyLabel}
            </button>
          ) : null}
        </div>
      ) : null}

      {renderFooter ? (
        renderFooter({ visibleMonth: calendar.visibleMonth })
      ) : showFooterHint ? (
        <Footer visibleMonth={calendar.visibleMonth} hint={footerHint} className={classNames?.footer} />
      ) : null}
    </section>
  );
}
