import { describe, expect, it } from "vitest";
import { formatDuration, formatMonth, formatRange, monthsInclusive, parseYearMonth, roleDuration, toYearMonth } from "./duration";

describe("monthsInclusive", () => {
  it("counts both the start and end month, like LinkedIn", () => {
    expect(monthsInclusive("2025-12", "2026-09")).toBe(10);
    expect(monthsInclusive("2025-06", "2026-09")).toBe(16);
    expect(monthsInclusive("2025-03", "2025-06")).toBe(4);
    expect(monthsInclusive("2023-11", "2025-11")).toBe(25);
    expect(monthsInclusive("2025-01", "2025-01")).toBe(1);
  });
});

describe("formatDuration", () => {
  it("formats years and months with correct plurals", () => {
    expect(formatDuration(1)).toBe("1 mo");
    expect(formatDuration(10)).toBe("10 mos");
    expect(formatDuration(12)).toBe("1 yr");
    expect(formatDuration(16)).toBe("1 yr 4 mos");
    expect(formatDuration(25)).toBe("2 yrs 1 mo");
    expect(formatDuration(24)).toBe("2 yrs");
  });
  it("rejects zero or negative spans (end before start)", () => {
    expect(() => formatDuration(0)).toThrow(RangeError);
    expect(() => formatDuration(monthsInclusive("2025-06", "2025-03"))).toThrow(RangeError);
  });
});

describe("parseYearMonth", () => {
  it("rejects malformed values", () => {
    expect(() => parseYearMonth("2025-13")).toThrow();
    expect(() => parseYearMonth("Dec 2025")).toThrow();
    expect(parseYearMonth("2025-12")).toEqual({ y: 2025, m: 12 });
  });
});

describe("labels", () => {
  it("formats months and ranges without locale drift", () => {
    expect(formatMonth("2025-12")).toBe("Dec 2025");
    expect(formatRange("2025-12")).toBe("Dec 2025 – Present");
    expect(formatRange("2025-03", "2025-06")).toBe("Mar 2025 – Jun 2025");
  });
  it("computes open-ended roles against a given date", () => {
    expect(toYearMonth(new Date(2026, 8, 28))).toBe("2026-09");
    expect(roleDuration("2025-12", undefined, new Date(2026, 8, 28))).toBe("10 mos");
    expect(roleDuration("2023-11", "2025-11")).toBe("2 yrs 1 mo");
  });
});
