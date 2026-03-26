import { useId, useMemo } from "react";
import type { DatePickerSelectionValue } from "../hooks/useDatePicker";
import { cn } from "../utils/cn";

export type TimePickerProps = {
  value: DatePickerSelectionValue;
  onChange: (next: DatePickerSelectionValue) => void;
  mode: "single" | "range" | "multiple";
  stepMinutes?: number;
  use12Hour?: boolean;
  showSeconds?: boolean;
  className?: string;
  /** Row label, e.g. "Start time" */
  label?: string;
  labelClassName?: string;
  fieldClassName?: string;
  /** Which range end to edit when mode is range */
  rangeTarget?: "start" | "end";
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function withTime(base: Date, h: number, m: number, s: number): Date {
  const d = new Date(base);
  d.setHours(h, m, s, 0);
  return d;
}

function partsFromDate(d: Date): { h: number; m: number; s: number } {
  return { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() };
}

function from24(h24: number): { h12: number; ap: "AM" | "PM" } {
  const ap: "AM" | "PM" = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return { h12, ap };
}

function to24(h12: number, ap: "AM" | "PM"): number {
  if (ap === "AM") return h12 === 12 ? 0 : h12;
  return h12 === 12 ? 12 : h12 + 12;
}

const selectCls = cn(
  "dp-select rounded-[var(--dp-radius-md)] border border-[color:var(--dp-input-border)]",
  "bg-gradient-to-b from-[color:var(--dp-surface)] to-[color:var(--dp-surface-muted)]",
  "px-2.5 py-2 text-sm font-bold tabular-nums text-[color:var(--dp-fg)]",
  "shadow-[var(--dp-input-inset),0_1px_2px_rgb(15_23_42/0.04)]",
  "transition-[border-color,box-shadow] duration-200 hover:border-[color:var(--dp-primary)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--dp-focus-ring)]",
);

export function TimePicker(props: TimePickerProps) {
  const {
    value,
    onChange,
    mode,
    stepMinutes = 1,
    use12Hour = false,
    showSeconds = false,
    className,
    label,
    labelClassName,
    fieldClassName,
    rangeTarget = "start",
  } = props;

  const uid = useId().replace(/:/g, "");

  const { baseDate, apply } = useMemo(() => {
    if (mode === "single") {
      const d = (value as Date | null) ?? new Date();
      return {
        baseDate: d,
        apply: (next: Date) => onChange(next),
      };
    }
    if (mode === "range") {
      const r = value as { start: Date | null; end: Date | null };
      const d =
        rangeTarget === "end"
          ? (r.end ?? r.start ?? new Date())
          : (r.start ?? r.end ?? new Date());
      return {
        baseDate: d,
        apply: (next: Date) => {
          if (rangeTarget === "end") onChange({ ...r, end: next });
          else onChange({ ...r, start: next });
        },
      };
    }
    const arr = (value as Date[]) ?? [];
    const d = arr.length ? arr[arr.length - 1]! : new Date();
    return {
      baseDate: d,
      apply: (next: Date) => {
        if (!arr.length) {
          onChange([next]);
          return;
        }
        const copy = [...arr];
        copy[copy.length - 1] = next;
        onChange(copy);
      },
    };
  }, [mode, onChange, value, rangeTarget]);

  const { h, m, s } = partsFromDate(baseDate);
  const hours24 = h;
  const { h12, ap } = from24(hours24);

  const hourOptions = useMemo(() => {
    if (use12Hour) return Array.from({ length: 12 }, (_, i) => i + 1);
    return Array.from({ length: 24 }, (_, i) => i);
  }, [use12Hour]);

  const minuteOptions = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < 60; i += stepMinutes) out.push(i);
    return out;
  }, [stepMinutes]);

  const setFromParts = (nextH: number, nextM: number, nextS: number) => {
    apply(withTime(baseDate, nextH, nextM, nextS));
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <div
          className={cn(
            "text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--dp-fg-muted)]",
            labelClassName,
          )}
        >
          {label}
        </div>
      ) : null}
      <div className={cn("flex flex-wrap items-center gap-1.5", fieldClassName)}>
        <label className="sr-only" htmlFor={`dp-h-${uid}`}>
          Hours
        </label>
        <select
          id={`dp-h-${uid}`}
          className={cn(selectCls, "min-w-[3.25rem]")}
          value={use12Hour ? h12 : hours24}
          onChange={(e) => {
            const hv = Number(e.target.value);
            if (use12Hour) setFromParts(to24(hv, ap), m, s);
            else setFromParts(hv, m, s);
          }}
        >
          {hourOptions.map((opt) => (
            <option key={opt} value={opt}>
              {pad2(opt)}
            </option>
          ))}
        </select>
        <span className="text-[color:var(--dp-fg-muted)]" aria-hidden>
          :
        </span>
        <label className="sr-only" htmlFor={`dp-m-${uid}`}>
          Minutes
        </label>
        <select
          id={`dp-m-${uid}`}
          className={cn(selectCls, "min-w-[3.25rem]")}
          value={m}
          onChange={(e) => setFromParts(hours24, Number(e.target.value), s)}
        >
          {minuteOptions.map((opt) => (
            <option key={opt} value={opt}>
              {pad2(opt)}
            </option>
          ))}
        </select>
        {use12Hour ? (
          <select
            aria-label="AM or PM"
            className={cn(selectCls, "min-w-[4.5rem]")}
            value={ap}
            onChange={(e) => {
              const nextAp = e.target.value as "AM" | "PM";
              setFromParts(to24(h12, nextAp), m, s);
            }}
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        ) : null}
        {showSeconds ? (
          <>
            <span className="text-[color:var(--dp-fg-muted)]" aria-hidden>
              :
            </span>
            <label className="sr-only" htmlFor={`dp-s-${uid}`}>
              Seconds
            </label>
            <select
              id={`dp-s-${uid}`}
              className={cn(selectCls, "min-w-[3.25rem]")}
              value={s}
              onChange={(e) => setFromParts(hours24, m, Number(e.target.value))}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {pad2(i)}
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>
    </div>
  );
}
