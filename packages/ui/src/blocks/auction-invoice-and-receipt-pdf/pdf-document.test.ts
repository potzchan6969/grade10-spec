import { describe, expect, it } from "vitest";
import { formatDateTime } from "./pdf-document";

describe("formatDateTime", () => {
  it("renders fixed to Hong Kong time with the HKT zone name, regardless of the machine's own zone", () => {
    // 2026-09-24T04:30:00.000Z is 2026-09-24T12:30:00 in Asia/Hong_Kong (UTC+8).
    const value = new Date("2026-09-24T04:30:00.000Z");
    expect(formatDateTime(value)).toBe("September 24, 2026, 12:30 HKT");
  });
});
