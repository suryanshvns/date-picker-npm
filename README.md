# Lattice Date Picker

**React · Next.js · TypeScript · Tailwind CSS**

A modern calendar and **date / range / multi** picker with **optional time**, **preset ranges**, **CSS-variable theming**, and **accessible** keyboard + screen-reader support. Built for **React 18+** and works in **Next.js App Router** (client components), **Pages Router**, **Vite**, **Remix**, and plain **CRA-style** setups.

## Why Lattice

| You get | Details |
| -------- | -------- |
| **Next.js-ready** | Uses client hooks — add `"use client"` once in App Router |
| **Modes** | Single date, full **range**, **multiple** selection |
| **Time** | Optional start/end time on range; standalone `TimePicker` export |
| **Tailwind-native** | Utility classes + `classNames` slots; ship a polished default via `theme.css` |
| **Theme control** | `--dp-*` tokens, `themeVars`, or override `.datepicker-root` |
| **Headless hooks** | `useDatePicker`, `useCalendar` for custom UIs |
| **Ship weight** | ESM + CJS, TypeScript types, tree-shakeable entry points |

*Discoverability on npm also depends on stars, downloads, and links over time — clear docs and keywords help people **find** the package; growth comes from real adoption.*

---

## Install

```bash
npm install lattice-react-datepicker
```

Peers:

```bash
npm install react react-dom
```

**Styles:** import the theme once (uses CSS variables under `.datepicker-root`):

```css
@import "lattice-react-datepicker/theme.css";
```

**Tailwind:** ensure JIT scans the library output so arbitrary classes resolve:

```js
// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/lattice-react-datepicker/dist/**/*.{js,cjs,mjs}",
  ],
};
```

---

## Next.js (App Router)

1. Mark the file (or a thin wrapper) as a **client component**:

```tsx
"use client";
```

2. Import the package + `theme.css` as in the examples below.

3. **Server Components:** keep `DatePicker` in a leaf `client` file; pass serializable props from server parents if needed.

---

## Quick start

### Single date

```tsx
"use client";

import { useState } from "react";
import { DatePicker } from "lattice-react-datepicker";
import "lattice-react-datepicker/theme.css";

export function SingleExample() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <DatePicker
      mode="single"
      value={value}
      onChange={(v) => setValue(v as Date | null)}
      aria-label="Choose a date"
    />
  );
}
```

### Range — presets, time, Apply / Cancel

```tsx
"use client";

import { useState } from "react";
import { DatePicker, createCommonPresets } from "lattice-react-datepicker";
import "lattice-react-datepicker/theme.css";

export function RangeExample() {
  const [value, setValue] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  return (
    <DatePicker
      mode="range"
      value={value}
      onChange={(v) => setValue(v as { start: Date | null; end: Date | null })}
      presets={createCommonPresets()}
      showTime
      use12HourClock
      onApply={() => undefined}
      onCancel={() => undefined}
      aria-label="Choose a date range"
    />
  );
}
```

### Multiple dates

```tsx
"use client";

import { useState } from "react";
import { DatePicker } from "lattice-react-datepicker";
import "lattice-react-datepicker/theme.css";

export function MultipleExample() {
  const [value, setValue] = useState<Date[]>([]);

  return (
    <DatePicker
      mode="multiple"
      value={value}
      onChange={(v) => setValue(v as Date[])}
      aria-label="Choose dates"
    />
  );
}
```

### Time only (subpath)

```tsx
import { TimePicker } from "lattice-react-datepicker/time";
```

---

## Theming

```tsx
<DatePicker
  themeVars={{
    "--dp-primary": "#6366f1",
    "--dp-accent": "#a855f7",
    "--dp-radius-lg": "24px",
  }}
/>
```

```tsx
import { getDefaultDatepickerRootStyle, DATEPICKER_CSS_VARS } from "lattice-react-datepicker";
```

Override tokens on `.datepicker-root` or fork `theme.css`.

---

## Custom layout

```tsx
<DatePicker
  className="max-w-md"
  classNames={{
    root: "shadow-2xl",
    presetButton: "rounded-lg",
    dayCell: "",
  }}
/>
```

`renderDay`, `renderHeader`, `renderFooter` for full composition.

---

## Development (this repo)

| Command              | Purpose       |
| -------------------- | ------------- |
| `pnpm install`       | Dependencies  |
| `pnpm run build`     | Build `dist/` |
| `pnpm run dev`       | Watch build   |
| `pnpm test`          | Tests         |
| `pnpm run storybook` | UI demos      |

---

## License

MIT
# date-picker-npm
