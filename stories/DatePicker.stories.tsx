import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { DatePicker } from "@/components/DatePicker";
import { createCommonPresets } from "@/presets";

const meta = {
  title: "DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "canvas",
      values: [{ name: "canvas", value: "#e8eef7" }],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-[560px] p-10">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <DatePicker
        mode="single"
        value={value}
        onChange={(v) => setValue(v as Date | null)}
        aria-label="Single date"
      />
    );
  },
};

/** Presets, instructions, month/year selects, optional Apply/Cancel — closest to the reference panel. */
export const RangePanelModern: Story = {
  render: () => {
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
        themeVars={{
          "--dp-primary": "rgb(0 149 255)",
          "--dp-primary-hover": "rgb(0 132 230)",
        }}
        aria-label="Date range"
      />
    );
  },
};

export const RangeWithPresets: Story = {
  render: () => {
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
        footerSummary
        aria-label="Date range"
      />
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<Date[]>([]);
    return (
      <DatePicker
        mode="multiple"
        value={value}
        onChange={(v) => setValue(v as Date[])}
        navigationVariant="dropdowns"
        aria-label="Multiple dates"
      />
    );
  },
};

export const CustomBrand: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <DatePicker
        mode="single"
        value={value}
        onChange={(v) => setValue(v as Date | null)}
        themeVars={{
          "--dp-primary": "#7c3aed",
          "--dp-primary-hover": "#6d28d9",
          "--dp-range-mid": "#ede9fe",
          "--dp-range-mid-hover": "#ddd6fe",
          "--dp-today-ring": "#7c3aed",
        }}
        aria-label="Brand colors via CSS variables"
      />
    );
  },
};

export const DarkSurface: Story = {
  render: () => {
    const [value, setValue] = useState<Date | null>(null);
    return (
      <div className="dark rounded-2xl bg-slate-950 p-6">
        <DatePicker
          mode="single"
          value={value}
          onChange={(v) => setValue(v as Date | null)}
          className="border-slate-700 shadow-2xl shadow-black/40"
          aria-label="Dark"
        />
      </div>
    );
  },
};
