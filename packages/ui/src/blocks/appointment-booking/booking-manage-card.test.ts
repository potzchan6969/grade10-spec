import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BookingManageCard } from "./booking-manage-card";
import { LIVE_RECORD, MANAGE_CARD_COPY } from "./fixtures";

const NEW_YORK_VISIT = {
  ...LIVE_RECORD,
  timeZone: "America/New_York",
  start: Date.UTC(2026, 8, 3, 14, 15),
  end: Date.UTC(2026, 8, 3, 14, 45),
};

function renderedText(): string {
  return renderToStaticMarkup(
    createElement(BookingManageCard, {
      copy: MANAGE_CARD_COPY,
      record: NEW_YORK_VISIT,
      onMove: () => undefined,
      onCancel: () => undefined,
    }),
  )
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

describe("a booking block's default zone label", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  // shared-dates-and-times-SC-30: the name a reader sees is the one in force at
  // the instant it labels, never the one in force on the machine's date.
  it("is the zone's name at the slot's start, whatever the machine's date", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2027-01-15T12:00:00Z"));
    expect(renderedText()).toContain("3 Sep 2026, 10:15–10:45 (EDT)");
  });
});
