import { describe, expect, it } from "vitest";
import type {
  AuctionAddressFormCopy,
  AuctionAddressFormProps,
  AuctionAddressFormValues,
  AuctionPaymentRail,
  AuctionPhoneFieldProps,
  AuctionWinnerOrderBankDetails,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderProps,
  AuctionWinnerOrderStep,
} from "../../index";
import * as publicEntry from "../../index";
import {
  AuctionAddressForm,
  AuctionPhoneField,
  AuctionWinnerOrder,
  auctionPhoneConfirmValue,
  auctionPhoneSoftReady,
} from "../../index";

type PublicAuctionOrderTypes = [
  AuctionWinnerOrderProps,
  AuctionWinnerOrderCopy,
  AuctionWinnerOrderStep,
  AuctionPaymentRail,
  AuctionWinnerOrderBankDetails,
  AuctionAddressFormProps,
  AuctionAddressFormCopy,
  AuctionAddressFormValues,
  AuctionPhoneFieldProps,
  // @ts-expect-error Retired list props must stay absent from the public entry.
  import("../../index").AuctionOrderListProps,
  // @ts-expect-error Retired row props must stay absent from the public entry.
  import("../../index").AuctionOrderRowProps,
  // @ts-expect-error Retired row copy must stay absent from the public entry.
  import("../../index").AuctionOrderRowCopy,
  // @ts-expect-error Retired empty props must stay absent from the public entry.
  import("../../index").AuctionOrderEmptyProps,
];

const publicAuctionOrderTypes: PublicAuctionOrderTypes | undefined = undefined;
void publicAuctionOrderTypes;

describe("auction-order public entry", () => {
  it("shared-ui-auction-order-SC-15 - exports the retained auction-order surface", () => {
    expect([
      AuctionWinnerOrder,
      AuctionAddressForm,
      AuctionPhoneField,
      auctionPhoneSoftReady,
      auctionPhoneConfirmValue,
    ]).toEqual([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });

  it("shared-ui-auction-order-SC-16 - omits retired auction-order list exports", () => {
    expect(
      ["AuctionOrderList", "AuctionOrderRow", "AuctionOrderEmpty"].filter(
        (name) => name in publicEntry,
      ),
    ).toEqual([]);
  });
});
