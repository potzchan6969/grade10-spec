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
