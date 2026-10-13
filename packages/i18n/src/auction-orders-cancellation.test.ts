import { describe, expect, it } from "vitest";
import { sharedCatalogs } from "./catalogs.ts";
import { getMessages, locales } from "./index.ts";

const EXPECTED_CANCELLED_ON = {
  en: "Cancelled on {date}",
  "zh-Hant": "已於 {date} 取消",
  "zh-Hans": "已于 {date} 取消",
  ko: "{date}에 취소됨",
} as const;

const EXPECTED_CANCELLED_SUBJECT = {
  en: "Auction lot {lotTitle}: order cancelled",
  "zh-Hant": "拍品 {lotTitle}：訂單已取消",
  "zh-Hans": "拍品 {lotTitle}：订单已取消",
  ko: "경매품 {lotTitle}: 주문 취소됨",
} as const;

describe("auction order cancellation copy", () => {
  it.each(locales)("answers cancelledOn for %s", (locale) => {
    const expected = EXPECTED_CANCELLED_ON[locale];
    expect(sharedCatalogs[locale].auctionOrders.cancelledOn).toBe(expected);
    const messages =
      locale === "ko"
        ? getMessages("zzz", locale)
        : getMessages("grade10", locale);
    expect(messages.auctionOrders.cancelledOn).toBe(expected);
    expect(expected).toContain("{date}");

    const expectedSubject = EXPECTED_CANCELLED_SUBJECT[locale];
    expect(
      sharedCatalogs[locale].auctionOrders.contactDialog.cancelledSubject,
    ).toBe(expectedSubject);
    expect(messages.auctionOrders.contactDialog.cancelledSubject).toBe(
      expectedSubject,
    );
    expect(expectedSubject).toContain("{lotTitle}");
  });
});
