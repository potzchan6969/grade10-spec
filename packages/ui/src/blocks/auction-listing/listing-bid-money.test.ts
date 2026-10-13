import { describe, expect, it } from "vitest";
import {
  moneyDraftFromMinor,
  parseExactMoneyDraftToMinor,
  quickMaximumPresetAmount,
  resolveMaximumFloor,
  sanitizeCustomMaximumDraft,
  sanitizeMoneyDraft,
  validateCommittedMaximumMinor,
  wholeMajorDraftFromMinor,
} from "./listing-bid-money";

const FLOOR = 20_800_000; // HK$208,000

const USD_CEILING_MINOR = 1_000_000_000;
const USD_CEILING_MAJOR = "10000000";

describe("sanitizeMoneyDraft", () => {
  it("strips non-digits and discards any decimal fraction", () => {
    expect(sanitizeMoneyDraft("208,000.00001", "HKD")).toBe("208000");
    expect(sanitizeMoneyDraft("208000.999", "HKD")).toBe("208000");
    expect(sanitizeMoneyDraft("100.", "HKD")).toBe("100");
  });

  it("strips decimals for zero-exponent currencies", () => {
    expect(sanitizeMoneyDraft("1500.5", "JPY")).toBe("1500");
  });
});

describe("sanitizeCustomMaximumDraft", () => {
  it.each([
    ["USD", USD_CEILING_MINOR, USD_CEILING_MAJOR],
  ] as const)(
    "accepts the supplied %s ceiling after whole-major conversion (shared-ui-auction-listing-SC-38, shared-ui-auction-listing-SC-58)",
    (currency, ceilingMinor, ceilingMajor) => {
      expect(
        sanitizeCustomMaximumDraft(
          ceilingMajor,
          currency,
          "",
          ceilingMinor,
          "replacement",
        ),
      ).toBe(ceilingMajor);
    },
  );

  it("accepts a value below the supplied ceiling", () => {
    expect(
      sanitizeCustomMaximumDraft(
        "500",
        "USD",
        "",
        USD_CEILING_MINOR,
        "replacement",
      ),
    ).toBe("500");
  });

  it.each([
    ["USD", USD_CEILING_MINOR, USD_CEILING_MAJOR, "9000000"],
  ] as const)(
    "restores a previous valid draft for a genuine typed append above the supplied ceiling (shared-ui-auction-listing-SC-39, shared-ui-auction-listing-SC-43)",
    (currency, ceilingMinor, ceilingMajor, previousDraft) => {
      expect(
        sanitizeCustomMaximumDraft(
          `${previousDraft}1`,
          currency,
          previousDraft,
          ceilingMinor,
          "typed-append",
        ),
      ).toBe(previousDraft);
      expect(
        sanitizeCustomMaximumDraft(
          `${ceilingMajor}1`,
          currency,
          ceilingMajor,
          ceilingMinor,
          "typed-append",
        ),
      ).toBe(ceilingMajor);
    },
  );

  it.each([
    ["USD", USD_CEILING_MINOR, USD_CEILING_MAJOR],
  ] as const)(
    "clamps an oversized paste or replacement to the supplied ceiling, including an empty previous draft (shared-ui-auction-listing-SC-40, shared-ui-auction-listing-SC-41, shared-ui-auction-listing-SC-59)",
    (currency, ceilingMinor, ceilingMajor) => {
      for (const editOrigin of ["paste", "replacement"] as const) {
        expect(
          sanitizeCustomMaximumDraft(
            `${ceilingMajor}1`,
            currency,
            "",
            ceilingMinor,
            editOrigin,
          ),
        ).toBe(ceilingMajor);
        expect(
          sanitizeCustomMaximumDraft(
            `${ceilingMajor}1`,
            currency,
            "500",
            ceilingMinor,
            editOrigin,
          ),
        ).toBe(ceilingMajor);
      }
    },
  );

  it.each([
    ["USD", USD_CEILING_MINOR, USD_CEILING_MAJOR],
  ] as const)(
    "clamps an appended paste and a cleaned fractional overshoot (shared-ui-auction-listing-SC-42, shared-ui-auction-listing-SC-60)",
    (currency, ceilingMinor, ceilingMajor) => {
      expect(
        sanitizeCustomMaximumDraft(
          `500${ceilingMajor}1`,
          currency,
          "500",
          ceilingMinor,
          "paste",
        ),
      ).toBe(ceilingMajor);
      expect(
        sanitizeCustomMaximumDraft(
          `${ceilingMajor}1.99`,
          currency,
          "500",
          ceilingMinor,
          "paste",
        ),
      ).toBe(ceilingMajor);
    },
  );

  it.each([
    ["USD", USD_CEILING_MINOR, USD_CEILING_MAJOR],
  ] as const)(
    "uses exact string comparison for very large cleaned digits (shared-ui-auction-listing-SC-42)",
    (currency, ceilingMinor, ceilingMajor) => {
      expect(
        sanitizeCustomMaximumDraft(
          "999999999999999999999999999999.99",
          currency,
          "500",
          ceilingMinor,
          "paste",
        ),
      ).toBe(ceilingMajor);
    },
  );

  it("accepts a fractional paste when whole-major cleaning reaches the ceiling (shared-ui-auction-listing-SC-53)", () => {
    expect(
      sanitizeCustomMaximumDraft(
        "10000000.99",
        "USD",
        "500",
        USD_CEILING_MINOR,
        "paste",
      ),
    ).toBe(USD_CEILING_MAJOR);
  });

  it("still accepts clearing to empty", () => {
    expect(
      sanitizeCustomMaximumDraft(
        "",
        "USD",
        "500",
        USD_CEILING_MINOR,
        "paste",
      ),
    ).toBe("");
  });
});

describe("parseExactMoneyDraftToMinor", () => {
  it("parses exact minor amounts", () => {
    expect(parseExactMoneyDraftToMinor("208000", "HKD")).toBe(FLOOR);
    expect(parseExactMoneyDraftToMinor("208000.50", "HKD")).toBe(20_800_050);
  });

  it("returns null for empty or incomplete drafts", () => {
    expect(parseExactMoneyDraftToMinor("", "HKD")).toBeNull();
    expect(parseExactMoneyDraftToMinor(".", "HKD")).toBeNull();
  });
});

describe("validateCommittedMaximumMinor", () => {
  it("accepts any exact minor amount at or above the floor", () => {
    expect(
      validateCommittedMaximumMinor({
        amountMinor: FLOOR + 1,
        floorMinor: FLOOR,
      }),
    ).toEqual({ ok: true, amountMinor: FLOOR + 1 });
  });

  it("rejects invalid and below-floor amounts", () => {
    expect(
      validateCommittedMaximumMinor({
        amountMinor: FLOOR - 1,
        floorMinor: FLOOR,
      }),
    ).toEqual({ ok: false, reason: "below-floor" });
    expect(
      validateCommittedMaximumMinor({
        amountMinor: 1.5,
        floorMinor: FLOOR,
      }),
    ).toEqual({ ok: false, reason: "invalid" });
  });
});

describe("moneyDraftFromMinor", () => {
  it("formats an editable draft without grouping", () => {
    expect(moneyDraftFromMinor(FLOOR, "HKD")).toBe("208000");
    expect(moneyDraftFromMinor(20_800_050, "HKD")).toBe("208000.5");
  });
});

describe("wholeMajorDraftFromMinor", () => {
  it("returns whole major units when already on a boundary", () => {
    expect(wholeMajorDraftFromMinor(FLOOR, "HKD")).toBe("208000");
  });

  it("ceils a fractional floor to the next whole major unit", () => {
    expect(wholeMajorDraftFromMinor(20_800_050, "HKD")).toBe("208001");
  });

  it("passes through zero-exponent amounts unchanged", () => {
    expect(wholeMajorDraftFromMinor(1500, "JPY")).toBe("1500");
  });
});

describe("resolveMaximumFloor", () => {
  it("keeps a leader's minimum at max plus $1 while they are below cap", () => {
    expect(
      resolveMaximumFloor({
        minBidMinor: 124_000,
        incrementMinor: 4_000,
        viewerMaximumMinor: 200_000,
        standing: "leading-max",
        currentBidMinor: 120_000,
        ceilingMinor: USD_CEILING_MINOR,
      }),
    ).toEqual({ floorMinor: 200_100, reason: "leading-nudge" });
  });

  it("returns null when a maximum at the ceiling leaves no legal raise (shared-ui-auction-listing-SC-64)", () => {
    expect(
      resolveMaximumFloor({
        minBidMinor: 1_300,
        incrementMinor: 10_000,
        viewerMaximumMinor: USD_CEILING_MINOR,
        standing: "leading-max",
        currentBidMinor: 120_000,
        ceilingMinor: USD_CEILING_MINOR,
      }),
    ).toBeNull();
  });

  it("returns null when the minimum next bid already passes the ceiling (shared-ui-auction-listing-SC-63, shared-ui-auction-listing-SC-65)", () => {
    expect(
      resolveMaximumFloor({
        minBidMinor: 1_000_005_000,
        incrementMinor: 10_000,
        viewerMaximumMinor: 999_995_000,
        standing: "leading-max",
        currentBidMinor: 999_995_000,
        ceilingMinor: USD_CEILING_MINOR,
      }),
    ).toBeNull();
    expect(
      resolveMaximumFloor({
        minBidMinor: 1_000_005_000,
        incrementMinor: 10_000,
        standing: "none",
        currentBidMinor: 999_995_000,
        ceilingMinor: USD_CEILING_MINOR,
      }),
    ).toBeNull();
  });

  it("keeps a floor exactly at the ceiling", () => {
    expect(
      resolveMaximumFloor({
        minBidMinor: USD_CEILING_MINOR,
        incrementMinor: 10_000,
        standing: "none",
        currentBidMinor: 999_999_000,
        ceilingMinor: USD_CEILING_MINOR,
      }),
    ).toEqual({ floorMinor: USD_CEILING_MINOR, reason: "floor-bid" });
  });
});

describe("quickMaximumPresetAmount", () => {
  it("adds 1× / 2× / 4× increment on the committed max when leading", () => {
    const leading = {
      isLeadingWithMaximum: true,
      hasBids: true,
      floorMaximumMinor: 200_100,
      incrementMinor: 4_000,
      currentBidMinor: 120_000,
      viewerMaximumMinor: 200_000,
      ceilingMinor: USD_CEILING_MINOR,
    } as const;
    expect(quickMaximumPresetAmount({ ...leading, multiples: 1 })).toEqual({
      amountMinor: 204_000,
      clamped: false,
    });
    expect(quickMaximumPresetAmount({ ...leading, multiples: 2 })).toEqual({
      amountMinor: 208_000,
      clamped: false,
    });
    expect(quickMaximumPresetAmount({ ...leading, multiples: 4 })).toEqual({
      amountMinor: 216_000,
      clamped: false,
    });
  });

  it("adds 1× / 2× / 4× increment on the current bid when not leading", () => {
    const challenger = {
      isLeadingWithMaximum: false,
      hasBids: true,
      floorMaximumMinor: 124_000,
      incrementMinor: 4_000,
      currentBidMinor: 120_000,
      viewerMaximumMinor: 116_000,
      ceilingMinor: USD_CEILING_MINOR,
    } as const;
    expect(quickMaximumPresetAmount({ ...challenger, multiples: 1 })).toEqual({
      amountMinor: 124_000,
      clamped: false,
    });
    expect(quickMaximumPresetAmount({ ...challenger, multiples: 2 })).toEqual({
      amountMinor: 128_000,
      clamped: false,
    });
    expect(quickMaximumPresetAmount({ ...challenger, multiples: 4 })).toEqual({
      amountMinor: 136_000,
      clamped: false,
    });
  });

  it.each([
    {
      openingMinor: 48_000,
      incrementMinor: 2_000,
      chips: [48_000, 52_000, 56_000],
    },
    { openingMinor: 1_000, incrementMinor: 100, chips: [1_000, 1_200, 1_400] },
  ])(
    "reads 1× as the opening price $openingMinor before any bid",
    ({ openingMinor, incrementMinor, chips }) => {
      const noBids = {
        isLeadingWithMaximum: false,
        hasBids: false,
        floorMaximumMinor: openingMinor,
        incrementMinor,
        currentBidMinor: openingMinor,
        ceilingMinor: USD_CEILING_MINOR,
      } as const;
      expect(
        [1, 2, 4].map(
          (multiples) =>
            quickMaximumPresetAmount({ ...noBids, multiples })?.amountMinor,
        ),
      ).toEqual(chips);
    },
  );

  it("clamps a stepped amount above the ceiling to the ceiling (shared-ui-auction-listing-SC-61, shared-ui-auction-listing-SC-62)", () => {
    const nearCeiling = {
      isLeadingWithMaximum: true,
      hasBids: true,
      floorMaximumMinor: 999_980_000,
      incrementMinor: 10_000,
      currentBidMinor: 120_000,
      viewerMaximumMinor: 999_970_000,
      ceilingMinor: USD_CEILING_MINOR,
    } as const;
    expect(quickMaximumPresetAmount({ ...nearCeiling, multiples: 1 })).toEqual({
      amountMinor: 999_980_000,
      clamped: false,
    });
    expect(quickMaximumPresetAmount({ ...nearCeiling, multiples: 2 })).toEqual({
      amountMinor: 999_990_000,
      clamped: false,
    });
    expect(quickMaximumPresetAmount({ ...nearCeiling, multiples: 4 })).toEqual({
      amountMinor: USD_CEILING_MINOR,
      clamped: true,
    });
  });
});
