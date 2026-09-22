import { describe, expect, it } from "vitest";
import {
  auctionPhoneConfirmValue,
  auctionPhoneSoftReady,
} from "./auction-phone-field";

describe("auctionPhoneSoftReady", () => {
  it("refuses when country is missing (SC-07)", () => {
    expect(auctionPhoneSoftReady("+85261234567", undefined)).toBe(false);
    expect(auctionPhoneSoftReady("61234567", undefined)).toBe(false);
  });

  it("refuses when digits are missing (SC-07)", () => {
    expect(auctionPhoneSoftReady("", "HK")).toBe(false);
    expect(auctionPhoneSoftReady("   ", "HK")).toBe(false);
    expect(auctionPhoneSoftReady("+", "HK")).toBe(false);
  });

  it("accepts unusual digit strings once country and digits are present (SC-08)", () => {
    expect(auctionPhoneSoftReady("612345678901234", "HK")).toBe(true);
    expect(auctionPhoneSoftReady("not-a-real-number-99", "US")).toBe(true);
  });

  it("accepts parseable national and E.164 values (SC-08)", () => {
    expect(auctionPhoneSoftReady("4155550100", "US")).toBe(true);
    expect(auctionPhoneSoftReady("+14155550100", "US")).toBe(true);
  });
});

describe("auctionPhoneConfirmValue", () => {
  it("reports E.164 when the value is parseable (SC-08)", () => {
    expect(auctionPhoneConfirmValue("4155550100", "US")).toBe("+14155550100");
    expect(auctionPhoneConfirmValue("+14155550100", "US")).toBe("+14155550100");
  });

  it("keeps the entered value when it is not validly parseable to E.164 (SC-08)", () => {
    expect(auctionPhoneConfirmValue("612345678901234", "HK")).toBe(
      "612345678901234",
    );
  });
});
