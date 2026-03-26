import type { PresetRange } from "./types";
import { addDays, startOfDay } from "./utils/dateHelpers";

export function createCommonPresets(): PresetRange[] {
  return [
    {
      id: "today",
      label: "Today",
      getRange: (now) => {
        const d = startOfDay(now);
        return { start: d, end: d };
      },
    },
    {
      id: "yesterday",
      label: "Yesterday",
      getRange: (now) => {
        const d = startOfDay(addDays(now, -1));
        return { start: d, end: d };
      },
    },
    {
      id: "last7",
      label: "Last 7 days",
      getRange: (now) => {
        const end = startOfDay(now);
        const start = addDays(end, -6);
        return { start, end };
      },
    },
    {
      id: "last30",
      label: "Last 30 days",
      getRange: (now) => {
        const end = startOfDay(now);
        const start = addDays(end, -29);
        return { start, end };
      },
    },
    {
      id: "thisMonth",
      label: "This month",
      getRange: (now) => {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return { start: startOfDay(start), end: startOfDay(end) };
      },
    },
  ];
}
