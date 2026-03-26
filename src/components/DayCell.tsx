import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import type { DayRenderProps } from "../types";
import { cn } from "../utils/cn";

export type DayCellProps = DayRenderProps & {
  children?: ReactNode;
  className?: string;
};

export function DayCell(props: DayCellProps): ReactNode {
  const {
    children,
    className,
    date,
    getDayProps,
    onSelect,
    onMouseEnter,
    disabled,
    inCurrentMonth,
    selected,
    rangePosition,
    focused,
    tabIndex,
    isToday,
  } = props;

  const uid = useId();
  const p = getDayProps() as ButtonHTMLAttributes<HTMLButtonElement>;

  const isRangeMiddle = selected && rangePosition === "middle";
  const isRangeCaps =
    selected &&
    !isRangeMiddle &&
    (rangePosition === "start" ||
      rangePosition === "end" ||
      rangePosition === "single" ||
      rangePosition === undefined);

  return (
    <button
      {...p}
      type="button"
      disabled={disabled}
      tabIndex={tabIndex}
      id={p.id ?? `dp-day-${uid}`}
      data-datepicker-day=""
      data-selected={selected ? "" : undefined}
      data-range={rangePosition}
      data-outside-month={!inCurrentMonth ? "" : undefined}
      data-focused={focused ? "" : undefined}
      onClick={(e) => {
        p.onClick?.(e);
        if (!disabled) onSelect();
      }}
      onMouseEnter={(e) => {
        p.onMouseEnter?.(e);
        onMouseEnter?.();
      }}
      className={cn(
        "relative flex h-11 w-11 items-center justify-center rounded-[var(--dp-radius-md)]",
        "text-[13px] font-semibold tabular-nums tracking-tight text-[color:var(--dp-fg)]",
        "transition-[background-color,color,box-shadow,transform,border-radius] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        !inCurrentMonth && "text-[color:var(--dp-fg-subtle)] opacity-50",
        disabled && "cursor-not-allowed opacity-35",
        !disabled &&
          !selected &&
          inCurrentMonth &&
          "hover:z-[1] hover:scale-[1.06] hover:bg-[color:var(--dp-cell-hover)] hover:text-[color:var(--dp-fg)] hover:shadow-[0_8px_20px_-12px_rgb(15_23_42/0.18)]",
        isRangeMiddle &&
          cn(
            "z-0 rounded-[10px] bg-[color:var(--dp-range-mid)] text-[color:var(--dp-fg)]",
            "hover:bg-[color:var(--dp-range-mid-hover)]",
          ),
        isRangeCaps &&
          cn(
            "z-[1] rounded-[var(--dp-radius-md)] bg-[color:var(--dp-primary)] text-[color:var(--dp-on-primary)]",
            "shadow-[0_10px_26px_-10px_var(--dp-cell-selected-glow),0_2px_6px_-2px_rgb(15_23_42/0.12)]",
            "hover:bg-[color:var(--dp-primary-hover)] hover:shadow-[0_14px_32px_-12px_var(--dp-cell-selected-glow)]",
          ),
        !disabled &&
          !isRangeCaps &&
          inCurrentMonth &&
          isToday &&
          !selected &&
          "ring-[1.5px] ring-inset ring-[color:var(--dp-today-ring)]",
        focused &&
          "z-[2] ring-2 ring-[color:var(--dp-focus-ring)] ring-offset-2 ring-offset-[color:var(--dp-surface)]",
        className,
      )}
    >
      {children ?? date.getDate()}
    </button>
  );
}
