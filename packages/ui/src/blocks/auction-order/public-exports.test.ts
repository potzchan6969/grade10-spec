import { describe, expect, it } from "vitest";
import type {
  AuctionAddressFormCopy,
  AuctionAddressFormProps,
  AuctionAddressFormValues,
  AuctionOrderDetailCopy,
  AuctionOrderDetailProps,
  AuctionOrderEmptyProps,
  AuctionOrderListProps,
  AuctionOrderRowCopy,
  AuctionOrderRowProps,
} from "../../index";
import {
  AuctionAddressForm,
  AuctionOrderDetail,
  AuctionOrderEmpty,
  AuctionOrderList,
  AuctionOrderRow,
} from "../../index";

type PublicAuctionOrderTypes = [
  AuctionOrderListProps,
  AuctionOrderRowProps,
  AuctionOrderRowCopy,
  AuctionOrderEmptyProps,
  AuctionOrderDetailProps,
  AuctionOrderDetailCopy,
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
      AuctionOrderDetail,
      AuctionAddressForm,
    ]).toEqual([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });
});
