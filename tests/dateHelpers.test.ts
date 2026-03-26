import { describe, expect, it } from "vitest";
import { addDays, compareDay, getMonthGrid, isSameDay, startOfMonth } from "../src/utils/dateHelpers";

describe("dateHelpers", () => {
  it("isSameDay", () => {
    const a = new Date(2025, 2, 15, 10, 0);
    const b = new Date(2025, 2, 15, 22, 0);
    expect(isSameDay(a, b)).toBe(true);
  });

  it("compareDay", () => {
    expect(compareDay(new Date(2025, 0, 1), new Date(2025, 0, 2))).toBeLessThan(0);
  });

  it("getMonthGrid length 42 weekStartsOn Sunday", () => {
    const march = startOfMonth(new Date(2025, 2, 1));
    const grid = getMonthGrid(march, 0);
    expect(grid).toHaveLength(42);
    expect(grid[0]?.getDay()).toBe(0);
  });

  it("addDays", () => {
    const d = new Date(2025, 2, 26);
    expect(addDays(d, 1).getDate()).toBe(27);
  });
});
