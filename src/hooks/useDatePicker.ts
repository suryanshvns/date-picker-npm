import { useCallback, useMemo, useState } from "react";
import type { DatePickerMode, DisabledMatcher, RangeValue } from "../types";
import { compareDay, isSameDay } from "../utils/dateHelpers";
import { isDisabledByMatchers, isOutOfRange } from "../utils/validation";

export type DatePickerSelectionValue = Date | null | RangeValue | Date[];

function defaultValueForMode(mode: DatePickerMode): DatePickerSelectionValue {
  if (mode === "single") return null;
  if (mode === "range") return { start: null, end: null };
  return [];
}

export type UseDatePickerOptions = {
  mode: DatePickerMode;
  value?: DatePickerSelectionValue;
  defaultValue?: DatePickerSelectionValue;
  onChange?: (value: DatePickerSelectionValue) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: DisabledMatcher;
};

export type UseDatePickerReturn = {
  mode: DatePickerMode;
  value: DatePickerSelectionValue;
  setValue: (next: DatePickerSelectionValue) => void;
  selectDay: (date: Date) => void;
  isInSelection: (date: Date) => boolean;
  getRangePosition: (date: Date) => "start" | "end" | "middle" | "single" | undefined;
  isDateDisabled: (date: Date) => boolean;
};

export function useDatePicker(options: UseDatePickerOptions): UseDatePickerReturn {
  const { mode, value: valueControlled, defaultValue, onChange, minDate, maxDate, disabledDates } =
    options;

  const [internal, setInternal] = useState<DatePickerSelectionValue>(
    () => defaultValue ?? defaultValueForMode(mode),
  );

  const isControlled = valueControlled !== undefined;
  const value = isControlled ? valueControlled : internal;

  const setValue = useCallback(
    (next: DatePickerSelectionValue) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const isDateDisabled = useCallback(
    (date: Date) => {
      if (isOutOfRange(date, minDate, maxDate)) return true;
      return isDisabledByMatchers(date, disabledDates);
    },
    [minDate, maxDate, disabledDates],
  );

  const selectDay = useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) return;

      if (mode === "single") {
        setValue(date);
        return;
      }

      if (mode === "range") {
        const r = (value as RangeValue) ?? { start: null, end: null };
        if (!r.start || (r.start != null && r.end != null)) {
          setValue({ start: date, end: null });
          return;
        }
        let start = r.start;
        let end = date;
        if (compareDay(end, start) < 0) {
          const t = start;
          start = end;
          end = t;
        }
        setValue({ start, end });
        return;
      }

      const arr = [...((value as Date[]) ?? [])];
      const idx = arr.findIndex((d) => isSameDay(d, date));
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(date);
      arr.sort((a, b) => a.getTime() - b.getTime());
      setValue(arr);
    },
    [mode, value, setValue, isDateDisabled],
  );

  const isInSelection = useCallback(
    (date: Date) => {
      if (mode === "single") {
        const d = value as Date | null;
        return !!d && isSameDay(d, date);
      }
      if (mode === "range") {
        const r = value as RangeValue;
        if (!r?.start) return false;
        if (!r.end) return isSameDay(r.start, date);
        if (isSameDay(r.start, r.end)) return isSameDay(r.start, date);
        return compareDay(date, r.start) >= 0 && compareDay(date, r.end) <= 0;
      }
      return ((value as Date[]) ?? []).some((d) => isSameDay(d, date));
    },
    [mode, value],
  );

  const getRangePosition = useCallback(
    (date: Date): "start" | "end" | "middle" | "single" | undefined => {
      if (mode !== "range") return undefined;
      const r = value as RangeValue;
      if (!r?.start || !r?.end) {
        if (r?.start && isSameDay(r.start, date)) return "single";
        return undefined;
      }
      if (isSameDay(r.start, r.end) && isSameDay(r.start, date)) return "single";
      if (isSameDay(r.start, date)) return "start";
      if (isSameDay(r.end, date)) return "end";
      if (compareDay(date, r.start) > 0 && compareDay(date, r.end) < 0) return "middle";
      return undefined;
    },
    [mode, value],
  );

  return useMemo(
    () => ({
      mode,
      value,
      setValue,
      selectDay,
      isInSelection,
      getRangePosition,
      isDateDisabled,
    }),
    [mode, value, setValue, selectDay, isInSelection, getRangePosition, isDateDisabled],
  );
}
