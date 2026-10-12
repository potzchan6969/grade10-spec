import { describe, expect, it } from "vitest";
import type {
  AuctionAddressFormCopy,
  AuctionAddressFormProps,
  AuctionAddressFormValues,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderProps,
  AuctionWinnerOrderStep,
} from "../../index";
import {
  AuctionAddressForm,
  AuctionWinnerOrder,
  auctionPhoneConfirmValue,
  auctionPhoneSoftReady,
} from "../../index";

type PublicAuctionOrderTypes = [
  AuctionWinnerOrderProps,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderStep,
  AuctionAddressFormProps,
  AuctionAddressFormCopy,
  AuctionAddressFormValues,
];

const publicAuctionOrderTypes: PublicAuctionOrderTypes | undefined = undefined;
void publicAuctionOrderTypes;

describe("auction-order public entry", () => {
  it("exports every named auction-order component", () => {
    expect([
      AuctionWinnerOrder,
      AuctionAddressForm,
      auctionPhoneSoftReady,
      auctionPhoneConfirmValue,
    ]).toEqual([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
