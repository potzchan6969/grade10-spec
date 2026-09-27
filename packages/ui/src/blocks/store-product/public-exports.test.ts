import { describe, expect, it } from "vitest";
import type {
  StoreProductDescriptionCopy,
  StoreProductDescriptionProps,
  StoreProductGalleryProps,
  StoreProductHeaderCopy,
  StoreProductHeaderProps,
  StoreProductImage,
  StoreProductMetadataCopy,
  StoreProductMetadataProps,
  StoreProductPurchaseItem,
  StoreProductPurchasePanelCopy,
  StoreProductPurchasePanelProps,
  StoreProductRelatedRailCopy,
  StoreProductRelatedRailProps,
  StoreProductSaleItem,
} from "../../index";
import * as publicEntry from "../../index";
import {
  StoreProductDescription,
  StoreProductGallery,
  StoreProductHeader,
  StoreProductMetadata,
  StoreProductPurchasePanel,
  StoreProductRelatedRail,
} from "../../index";

type PublicStoreProductTypes = [
  StoreProductDescriptionCopy,
  StoreProductDescriptionProps,
  StoreProductGalleryProps,
  StoreProductHeaderCopy,
  StoreProductHeaderProps,
  StoreProductImage,
  StoreProductMetadataCopy,
  StoreProductMetadataProps,
  StoreProductPurchaseItem,
  StoreProductPurchasePanelCopy,
  StoreProductPurchasePanelProps,
  StoreProductRelatedRailCopy,
  StoreProductRelatedRailProps,
  StoreProductSaleItem,
];

const publicStoreProductTypes: PublicStoreProductTypes | undefined = undefined;
void publicStoreProductTypes;

describe("store-product public entry", () => {
  it("exports every named store-product component", () => {
    expect([
      StoreProductDescription,
      StoreProductGallery,
      StoreProductHeader,
      StoreProductMetadata,
      StoreProductPurchasePanel,
      StoreProductRelatedRail,
    ]).toEqual([
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
      expect.any(Function),
    ]);
  });

  // grade10-site-store-cross-sell-SC-25: the rail's exports resolve from the
  // package's public entry, and nothing else is exported for the surface; the
  // type half is the tuple above, which the compiler holds.
  it("exports no other component for the rail", () => {
    const railExports = Object.keys(publicEntry).filter((name) =>
      name.startsWith("StoreProductRelatedRail"),
    );
    expect(railExports).toEqual(["StoreProductRelatedRail"]);
  });
});
