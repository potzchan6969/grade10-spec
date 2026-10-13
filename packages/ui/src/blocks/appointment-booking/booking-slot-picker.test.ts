import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BookingSlotPicker } from "./booking-slot-picker";
import { SLOT_PICKER_COPY } from "./fixtures";

function zoneHeader(props: {
  month: string;
  selectedDate?: string;
  selectedStart?: number;
}): string {
  const markup = renderToStaticMarkup(
    createElement(BookingSlotPicker, {
      copy: SLOT_PICKER_COPY,
      days: { status: "ready", data: [] },
      slots: { status: "ready", data: [] },
      timeZone: "America/New_York",
      onMonthChange: () => undefined,
      onSelectDay: () => undefined,
      onSelectSlot: () => undefined,
      ...props,
    }),
  );
  const header = markup.match(
    /data-slot="booking-zone"[^>]*>([^<]*(?:<!-- -->[^<]*)*)</,
  );
  if (header === null) throw new Error("the picker drew no zone header");
  return (header[1] ?? "").replace(/<!-- -->/g, "");
}

describe("a slot picker's default zone label", () => {
  // The name a reader sees is the one in force at the times shown. No scenario
  // reads the booking blocks (tasks 2.2 and 2.7), so this test cites none.
  it("names the zone on the picked day, not on the first of the month", () => {
    // New York leaves daylight saving on 1 Nov 2026 at 06:00 UTC: the month
    // opens in EDT and 10 Nov reads EST.
    expect(
      zoneHeader({ month: "2026-11", selectedDate: "2026-11-10" }),
    ).toContain("EST");
  });

  it("names the zone at the picked slot's start", () => {
    expect(
      zoneHeader({
        month: "2026-11",
        selectedDate: "2026-11-10",
        selectedStart: Date.UTC(2026, 10, 10, 15, 0),
      }),
    ).toContain("EST");
  });

  it("names the zone at the month's opening before a day is picked", () => {
    expect(zoneHeader({ month: "2026-11" })).toContain("EDT");
  });
});
