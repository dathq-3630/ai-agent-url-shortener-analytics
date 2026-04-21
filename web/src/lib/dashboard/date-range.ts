/**
 * Shared dashboard + CSV export filters (single source of truth).
 */

export type DashboardSearchParams = {
  days?: string;
  view?: string;
};

/** Mirrors the dashboard rolling window: last N calendar days ending “now”. */
export function parseDashboardDays(raw: string | undefined): number {
  const n = Number.parseInt(raw ?? "7", 10);
  if (Number.isNaN(n)) return 7;
  return Math.min(90, Math.max(1, n));
}

/** Same `{ start, end }` logic as `app/dashboard/page.tsx`. */
export function analyticsWindow(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setUTCDate(start.getUTCDate() - days);
  start.setUTCHours(0, 0, 0, 0);
  return { start, end };
}
