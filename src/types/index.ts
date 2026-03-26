import type { CSSProperties, ReactNode } from "react";

export type DatePickerMode = "single" | "range" | "multiple";

export type CalendarView = "day" | "month" | "year";

export type SingleValue = Date | null;
export type RangeValue = { start: Date | null; end: Date | null };
export type MultipleValue = Date[];

export type DatePickerValue<M extends DatePickerMode = DatePickerMode> = M extends "single"
  ? SingleValue
  : M extends "range"
    ? RangeValue
    : MultipleValue;

export type OnDatePickerChange<M extends DatePickerMode = DatePickerMode> = (
  value: DatePickerValue<M>,
) => void;

export type DisabledMatcher =
  | Date
  | ((date: Date) => boolean)
  | ((date: Date) => boolean)[];

export type DayRenderProps = {
  date: Date;
  /** True if this date is in the currently displayed month */
  inCurrentMonth: boolean;
  /** Today in the active calendar timezone */
  isToday: boolean;
  selected: boolean;
  disabled: boolean;
  /** Range: first/last/middle day of selected span */
  rangePosition?: "start" | "end" | "middle" | "single";
  /** Focused cell for keyboard nav */
  focused: boolean;
  tabIndex: 0 | -1;
  onSelect: () => void;
  onMouseEnter?: () => void;
  /** Pass to the interactive element */
  getDayProps: () => Record<string, unknown>;
};

export type HeaderRenderProps = {
  visibleMonth: Date;
  view: CalendarView;
  goToPrev: () => void;
  goToNext: () => void;
  setView: (v: CalendarView) => void;
  titleId: string;
  /** BCP 47 locale (for dropdown labels) */
  locale?: string;
  /** Set visible month (required for dropdown navigation) */
  setVisibleMonth?: (d: Date) => void;
  /** `"dropdowns"` = month/year selects in day view */
  navigationVariant?: "title" | "dropdowns";
};

export type FooterRenderProps = {
  visibleMonth: Date;
};

export type DatePickerClassNames = {
  root?: string;
  calendar?: string;
  header?: string;
  grid?: string;
  weekRow?: string;
  weekdayHeader?: string;
  dayCell?: string;
  footer?: string;
  /** Preset chip row (range) */
  presetsRow?: string;
  presetButton?: string;
  /** Hint above the calendar */
  instruction?: string;
  timeSection?: string;
  actionBar?: string;
  applyButton?: string;
  cancelButton?: string;
};

export type DatePickerTheme = {
  /** Prefix for data-theme or class names — consumers can map to CSS variables */
  name?: string;
};

export type PresetRange = {
  id: string;
  label: string;
  getRange: (now: Date) => { start: Date; end: Date };
};

export type DatePickerPlugin = {
  id: string;
  /** Called when DatePicker mounts */
  setup?: (ctx: DatePickerPluginContext) => void | (() => void);
};

export type DatePickerPluginContext = {
  mode: DatePickerMode;
  locale: string;
  timeZone?: string;
};

export type DatePickerBaseProps<M extends DatePickerMode = DatePickerMode> = {
  mode?: M;
  /** Controlled value */
  value?: DatePickerValue<M>;
  /** Uncontrolled default */
  defaultValue?: DatePickerValue<M>;
  onChange?: OnDatePickerChange<M>;
  minDate?: Date;
  maxDate?: Date;
  /** Extra disabled logic */
  disabledDates?: DisabledMatcher;
  /** First day of week: 0=Sunday … 6=Saturday. If omitted, derived from locale when possible */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
  /** IANA timezone for labels and “today” (e.g. America/New_York). Uses runtime local zone if omitted */
  timeZone?: string;
  /** Initial calendar month shown */
  defaultMonth?: Date;
  /** Controlled visible month */
  month?: Date;
  onMonthChange?: (month: Date) => void;
  /** Default view when opening */
  defaultView?: CalendarView;
  view?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  /** Show time UI (optional: import `TimePicker` from the package `/time` subpath for standalone use) */
  showTime?: boolean;
  timeStepMinutes?: number;
  use12HourClock?: boolean;
  showSeconds?: boolean;
  className?: string;
  classNames?: DatePickerClassNames;
  theme?: DatePickerTheme;
  /**
   * CSS variables on the root, e.g. `{ "--dp-primary": "#6366f1" }`.
   * See `DATEPICKER_CSS_VARS` / `getDefaultDatepickerRootStyle` in package exports.
   */
  themeVars?: Partial<Record<string, string>>;
  style?: CSSProperties;
  /** Hint above the calendar (default for range: start/end instructions). Pass "" to hide. */
  instruction?: string;
  /** `dropdowns` = month/year selects (day view). Default: `dropdowns`. */
  navigationVariant?: "title" | "dropdowns";
  id?: string;
  presets?: PresetRange[];
  plugins?: DatePickerPlugin[];
  renderDay?: (props: DayRenderProps) => ReactNode;
  renderHeader?: (props: HeaderRenderProps) => ReactNode;
  renderFooter?: (props: FooterRenderProps) => ReactNode;
  /** Modal-style confirmation (optional) */
  onApply?: () => void;
  onCancel?: () => void;
  applyLabel?: string;
  cancelLabel?: string;
  /**
   * When false, hides the small summary footer. Default: true if no action bar, false if Apply/Cancel shown.
   */
  footerSummary?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};
