/** Calendar arithmetic on `YYYY-MM` and `YYYY-MM-DD` strings — the shop's own
 * calendar, so no zone is consulted. Internal. */

const MONTH = /^(\d{4})-(\d{2})$/;
const DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseMonth(month: string): { year: number; monthIndex: number } {
  const match = MONTH.exec(month);
  if (!match) throw new Error(`Not a month: ${month}`);
  return { year: Number(match[1]), monthIndex: Number(match[2]) - 1 };
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function formatMonth(year: number, monthIndex: number): string {
  return `${year}-${pad(monthIndex + 1)}`;
}

/** Every date of the month, first to last. */
function datesOf(month: string): string[] {
  const { year, monthIndex } = parseMonth(month);
  const count = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  return Array.from({ length: count }, (_, day) => `${month}-${pad(day + 1)}`);
}

/** Monday is 0, Sunday is 6. */
function weekdayOf(date: string): number {
  const match = DATE.exec(date);
  if (!match) throw new Error(`Not a date: ${date}`);
  const day = new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])),
  ).getUTCDay();
  return (day + 6) % 7;
}

function dayOf(date: string): number {
  return Number(date.slice(8, 10));
}

function shiftMonth(month: string, by: number): string {
  const { year, monthIndex } = parseMonth(month);
  const shifted = new Date(Date.UTC(year, monthIndex + by, 1));
  return formatMonth(shifted.getUTCFullYear(), shifted.getUTCMonth());
}

/** The first instant of the month as UTC, for wording its name. */
function monthInstant(month: string): number {
  const { year, monthIndex } = parseMonth(month);
  return Date.UTC(year, monthIndex, 1);
}

export { datesOf, dayOf, monthInstant, shiftMonth, weekdayOf };
