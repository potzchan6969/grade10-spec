import { describe, expect, it } from "vitest";
import type {
  AuctionAddressFormCopy,
  AuctionAddressFormProps,
  AuctionAddressFormValues,
  AuctionOrderEmptyProps,
  AuctionOrderListProps,
  AuctionOrderRowCopy,
  AuctionOrderRowProps,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderProps,
  AuctionWinnerOrderStep,
} from "../../index";
import {
  AuctionAddressForm,
  AuctionOrderEmpty,
  AuctionOrderList,
  AuctionOrderRow,
  AuctionWinnerOrder,
  auctionPhoneConfirmValue,
  auctionPhoneSoftReady,
} from "../../index";

type PublicAuctionOrderTypes = [
  AuctionOrderListProps,
  AuctionOrderRowProps,
  AuctionOrderRowCopy,
  AuctionOrderEmptyProps,
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
      AuctionOrderList,
      AuctionOrderRow,
      AuctionOrderEmpty,
      AuctionWinnerOrder,
      AuctionAddressForm,
      auctionPhoneSoftReady,
      auctionPhoneConfirmValue,
    ]).toEqual([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
