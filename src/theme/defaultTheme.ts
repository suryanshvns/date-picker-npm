import type { CSSProperties } from "react";

/**
 * Design tokens — override any `--dp-*` key via `themeVars` or global CSS on `.datepicker-root`.
 */
export const DATEPICKER_CSS_VARS = {
  "--dp-font":
    'ui-sans-serif, system-ui, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  "--dp-radius-sm": "8px",
  "--dp-radius-md": "12px",
  "--dp-radius-lg": "20px",
  /** Panel depth */
  "--dp-shadow":
    "0 0 0 1px rgb(15 23 42 / 0.05), 0 2px 4px rgb(15 23 42 / 0.03), 0 28px 56px -16px rgb(15 23 42 / 0.18)",
  "--dp-shadow-inner": "inset 0 1px 0 0 rgb(255 255 255 / 0.92), inset 0 0 0 1px rgb(255 255 255 / 0.4)",
  "--dp-border": "rgb(226 232 240 / 0.85)",
  "--dp-surface": "#ffffff",
  "--dp-surface-muted": "rgb(248 250 252)",
  "--dp-surface-glow": "rgb(255 255 255)",
  "--dp-fg": "rgb(15 23 42)",
  "--dp-fg-muted": "rgb(100 116 139)",
  "--dp-fg-subtle": "rgb(148 163 184)",
  /** Primary + secondary accent (headers, gradient bar) */
  "--dp-primary": "rgb(0 149 255)",
  "--dp-primary-hover": "rgb(0 132 230)",
  "--dp-on-primary": "#ffffff",
  "--dp-accent": "rgb(99 102 241)",
  "--dp-accent-soft": "rgb(99 102 241 / 0.12)",
  /** Selection */
  "--dp-range-mid": "rgb(224 242 254 / 0.95)",
  "--dp-range-mid-hover": "rgb(191 219 254 / 0.95)",
  "--dp-cell-hover": "rgb(241 245 249)",
  "--dp-today-ring": "rgb(0 149 255 / 0.55)",
  "--dp-cell-selected-glow": "rgb(0 149 255 / 0.35)",
  /** Preset chips */
  "--dp-preset-bg": "rgb(255 255 255 / 0.75)",
  "--dp-preset-border": "rgb(0 149 255 / 0.35)",
  "--dp-danger": "rgb(220 38 38)",
  "--dp-danger-border": "rgb(239 68 68)",
  "--dp-danger-surface": "#ffffff",
  "--dp-input-border": "rgb(226 232 240 / 0.95)",
  "--dp-input-inset": "inset 0 1px 2px rgb(15 23 42 / 0.05)",
  "--dp-focus-ring": "rgb(0 149 255 / 0.28)",
} as const;

export type DatepickerCssVar = keyof typeof DATEPICKER_CSS_VARS;

export function getDefaultDatepickerRootStyle(
  overrides?: Partial<Record<string, string>>,
): CSSProperties {
  const base = { ...DATEPICKER_CSS_VARS, ...overrides } as Record<string, string>;
  return Object.fromEntries(Object.entries(base)) as CSSProperties;
}
