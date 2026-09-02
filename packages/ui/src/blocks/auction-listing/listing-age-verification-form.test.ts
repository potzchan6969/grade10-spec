import { describe, expect, it } from "vitest";
import {
  isListingAgeVerificationAdult,
  isListingAgeVerificationComplete,
  listingAgeVerificationBirthDate,
} from "./listing-age-verification-form";

const NOW = new Date(2026, 8, 2, 12, 0);

describe("isListingAgeVerificationComplete", () => {
  it("is false until month, day, and year are set", () => {
    expect(isListingAgeVerificationComplete({})).toBe(false);
    expect(
      isListingAgeVerificationComplete({ month: "January", day: "1" }),
    ).toBe(false);
    expect(
      isListingAgeVerificationComplete({
        month: "January",
        day: "1",
        year: "2000",
      }),
    ).toBe(true);
  });
});

describe("isListingAgeVerificationAdult", () => {
  it("accepts a birth date exactly 18 years ago", () => {
    expect(
      isListingAgeVerificationAdult(
        { month: "September", day: "2", year: "2008" },
        NOW,
      ),
    ).toBe(true);
  });

  it("rejects a birth date one day short of 18", () => {
    expect(
      isListingAgeVerificationAdult(
        { month: "September", day: "3", year: "2008" },
        NOW,
      ),
    ).toBe(false);
  });

  it("rejects invalid calendar dates", () => {
    expect(
      isListingAgeVerificationAdult(
        { month: "February", day: "31", year: "2000" },
        NOW,
      ),
    ).toBe(false);
    expect(
      listingAgeVerificationBirthDate({
        month: "February",
        day: "31",
        year: "2000",
      }),
    ).toBeNull();
  });
});
