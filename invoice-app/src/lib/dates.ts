const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns a new Date that is `days` after `date`. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS);
}

/** True when `due` is strictly before `now`. */
export function isOverdue(due: Date, now: Date = new Date()): boolean {
  return due <= now;
}

/** Formats a date as YYYY-MM-DD in UTC. */
export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
