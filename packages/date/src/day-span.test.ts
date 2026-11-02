import { describe, expect, it } from "vitest";
import {
  formatWeekdayList,
  formatWeekdaySpan,
  formatWeekdaySpanInYear,
} from "./day-span.ts";

describe("a show's days worded as one", () => {
  it("says the month and year once over two days", () => {
    expect(formatWeekdaySpan("2026-12-12", "2026-12-13", "en")).toBe(
      "Sat 12 and Sun 13 Dec 2026",
    );
    expect(formatWeekdaySpanInYear("2026-12-12", "2026-12-13", "en")).toBe(
      "Sat 12 and Sun 13 Dec",
    );
  });

  it("names every day whole where the page heads its days", () => {
    expect(formatWeekdayList("2026-12-12", "2026-12-13", "en")).toBe(
      "Sat 12 Dec and Sun 13 Dec 2026",
    );
  });

  it("names a day alone", () => {
    expect(formatWeekdaySpan("2026-12-12", "2026-12-12", "en")).toBe(
      "Sat 12 Dec 2026",
    );
  });

  it("lists three days and spans a longer run", () => {
    expect(formatWeekdaySpan("2026-12-11", "2026-12-13", "en")).toBe(
      "Fri 11, Sat 12 and Sun 13 Dec 2026",
    );
    expect(formatWeekdaySpan("2026-12-10", "2026-12-13", "en")).toBe(
      "Thu 10 – Sun 13 Dec 2026",
    );
  });

  it("names each month, and each year, the days do not share", () => {
    expect(formatWeekdaySpan("2027-01-31", "2027-02-01", "en")).toBe(
      "Sun 31 Jan and Mon 1 Feb 2027",
    );
    expect(formatWeekdaySpanInYear("2026-12-31", "2027-01-01", "en")).toBe(
      "Thu 31 Dec 2026 and Fri 1 Jan 2027",
    );
  });

  it("writes Chinese largest unit first, with its own and", () => {
    expect(formatWeekdaySpan("2026-12-12", "2026-12-13", "zh-Hant")).toBe(
      "2026年12月12日 週六及13日 週日",
    );
  });

  it("refuses a run that ends before it starts", () => {
    expect(() => formatWeekdaySpan("2026-12-13", "2026-12-12", "en")).toThrow();
  });
});
