const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function parseYearMonth(value: string): { y: number; m: number } {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid year-month "${value}" (expected YYYY-MM)`);
  const m = Number(match[2]);
  if (m < 1 || m > 12) throw new Error(`Invalid month in "${value}"`);
  return { y: Number(match[1]), m };
}

/** Months between two YYYY-MM values, counting both ends (LinkedIn style). */
export function monthsInclusive(start: string, end: string): number {
  const a = parseYearMonth(start);
  const b = parseYearMonth(end);
  return (b.y - a.y) * 12 + (b.m - a.m) + 1;
}

export function formatDuration(months: number): string {
  if (!Number.isInteger(months) || months < 1) {
    throw new RangeError(`Duration must be at least 1 month, got ${months}`);
  }
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  const parts: string[] = [];
  if (yrs) parts.push(`${yrs} ${yrs === 1 ? "yr" : "yrs"}`);
  if (mos) parts.push(`${mos} ${mos === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}

export function toYearMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function roleDuration(start: string, end?: string, now: Date = new Date()): string {
  return formatDuration(monthsInclusive(start, end ?? toYearMonth(now)));
}

/**
 * Browser-side variant: a visitor's clock can sit before a role's start month (time zones,
 * wrong device clocks), so fall back to the server-rendered value instead of throwing.
 * The strict `roleDuration` still fails loudly at build and test time.
 */
export function safeRoleDuration(start: string, end: string | undefined, fallback: string, now: Date = new Date()): string {
  try {
    return roleDuration(start, end, now);
  } catch {
    return fallback;
  }
}

export function formatMonth(ym: string): string {
  const { y, m } = parseYearMonth(ym);
  return `${MONTHS[m - 1]} ${y}`;
}

export function formatRange(start: string, end?: string): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
