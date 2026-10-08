import { describe, expect, it } from "vitest";
import {
  formatDocumentMoment,
  formatMediumDay,
  formatMediumMoment,
} from "./off-platform.ts";

const AT = new Date("2026-09-24T04:30:00Z");

describe("a document's moment", () => {
  it("writes the long month, a 24-hour clock and the zone's offset", () => {
    expect(formatDocumentMoment(AT, "Asia/Hong_Kong")).toBe(
      "September 24, 2026, 12:30 GMT+8",
    );
  });

  it("reads the clock of the zone it is given", () => {
    expect(formatDocumentMoment(AT, "America/New_York")).toBe(
      "September 24, 2026, 00:30 GMT-4",
    );
  });

  it("takes epoch milliseconds as it takes a Date", () => {
    expect(formatDocumentMoment(AT.getTime(), "Asia/Hong_Kong")).toBe(
      formatDocumentMoment(AT, "Asia/Hong_Kong"),
    );
  });

  it("stops on a zone it does not know and names it", () => {
    expect(() => formatDocumentMoment(AT, "Mars/Olympus")).toThrow(
      "Mars/Olympus",
    );
  });

  it("stops on an instant that is not one", () => {
    expect(() => formatDocumentMoment(Number.NaN, "Asia/Hong_Kong")).toThrow(
      RangeError,
    );
  });
});

describe("a runtime-worded medium date", () => {
  const options = { locale: "en-HK", timeZone: "Asia/Hong_Kong" };

  it("words a day in the locale's own medium style", () => {
    expect(formatMediumDay(AT, options)).toMatch(/^24 Sept? 2026$/);
  });

  it("adds the locale's own short time", () => {
    expect(formatMediumMoment(AT, options)).toMatch(
      /^24 Sept? 2026, 12:30\s?pm$/i,
    );
  });

  it("reads the clock of the zone it is given", () => {
    expect(
      formatMediumMoment(AT, { locale: "en-HK", timeZone: "UTC" }),
    ).toMatch(/4:30\s?am$/i);
  });
});
