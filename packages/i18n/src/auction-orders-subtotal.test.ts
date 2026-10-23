import { describe, expect, it } from "vitest";
import { sharedCatalogs } from "./catalogs.ts";
import { locales } from "./index.ts";

const EXPECTED_SUBTOTAL = {
  en: "Subtotal",
  "zh-Hans": "小计",
  "zh-Hant": "小計",
  ko: "소계",
} as const;

describe("winner order Subtotal label", () => {
  it.each(locales)(
    "winner-order-SC-290 - answers winner.subtotal for %s",
    (locale) => {
      expect(sharedCatalogs[locale].auctionOrders.winner.subtotal).toBe(
        EXPECTED_SUBTOTAL[locale],
      );
    },
  );
});
