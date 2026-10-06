import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type {
  AuctionCardBadge,
  AuctionCardCopy,
  AuctionCardProps,
  AuctionCardWhen,
} from "../../index";
import { AuctionCard } from "../../index";

type PublicAuctionCardTypes = [
  AuctionCardProps,
  AuctionCardCopy,
  AuctionCardBadge,
  AuctionCardWhen,
];

const publicAuctionCardTypes: PublicAuctionCardTypes | undefined = undefined;
void publicAuctionCardTypes;

describe("auction card public entry", () => {
  it("exports AuctionCard from the package entry", () => {
    expect(AuctionCard).toEqual(expect.any(Function));
  });
});

const COPY: AuctionCardCopy = {
  live: "Live",
  endingSoon: "Ending soon",
  watch: {
    watch: "Watch",
    watching: "Watching",
    unwatch: "Unwatch",
    watchAriaLabel: "Watch this auction",
    unwatchAriaLabel: "Unwatch this auction",
  },
};

const CLOSE = Date.parse("2027-09-01T12:00:00Z");

function clockLine(props: {
  kind: AuctionCardWhen["kind"];
  timeZone: string;
  locale?: AuctionCardProps["locale"];
}): string {
  const markup = renderToStaticMarkup(
    createElement(AuctionCard, {
      copy: COPY,
      name: "1999 Base Set Charizard PSA 9",
      currentBidMinor: 12_800_000,
      currency: "HKD",
      priceLabel: "Current bid",
      when: { kind: props.kind, at: CLOSE },
      locale: props.locale ?? "en",
      timeZone: props.timeZone,
    }),
  );
  const line = markup.match(/>((?:Ends|Opens|Closed) [^<]*)</)?.[1];
  if (line === undefined) throw new Error("the tile drew no clock line");
  return line;
}

describe("a catalogue tile's clock line follows the viewer", () => {
  // shared-ui-auction-listing-SC-55, shared-dates-and-times-SC-14,
  // shared-dates-and-times-US1-TC11-1, shared-ui-auction-listing-US1-TC55-1
  it.each([
    ["Asia/Hong_Kong", "Closed 1 Sep 2027, 20:00 HKT"],
    ["America/New_York", "Closed 1 Sep 2027, 08:00 EDT"],
  ])("names the viewer's zone on a closed lot in %s", (timeZone, reads) => {
    expect(clockLine({ kind: "closed", timeZone })).toBe(reads);
  });

  it.each([
    ["ends", "Ends 1 Sep 2027, 20:00 HKT"],
    ["opens", "Opens 1 Sep 2027, 20:00 HKT"],
  ] as const)("names Hong Kong on an %s line", (kind, reads) => {
    expect(clockLine({ kind, timeZone: "Asia/Hong_Kong" })).toBe(reads);
  });

  // shared-ui-auction-listing-US1-TC57-1
  it.each([
    ["Asia/Tokyo", "21:00 GMT+9"],
    ["America/New_York", "08:00 EDT"],
  ])(
    "reads the clock of %s and names its zone in English under zh-Hant",
    (timeZone, tail) => {
      const line = clockLine({ kind: "ends", timeZone, locale: "zh-Hant" });
      expect(line.startsWith("Ends ")).toBe(true);
      expect(line.endsWith(`, ${tail}`)).toBe(true);
      expect(line).not.toContain("HKT");
    },
  );

  // shared-ui-auction-listing-SC-55: an omitted language fails to compile
  // instead of reading as English.
  it("requires a locale", () => {
    const withoutLocale = {
      copy: COPY,
      name: "Lot",
      currentBidMinor: 100,
      currency: "HKD",
      priceLabel: "Current bid",
      timeZone: "Asia/Hong_Kong",
    };
    // @ts-expect-error `locale` is required
    const props: AuctionCardProps = withoutLocale;
    expect(renderToStaticMarkup(createElement(AuctionCard, props))).toContain(
      "Lot",
    );
  });
});
