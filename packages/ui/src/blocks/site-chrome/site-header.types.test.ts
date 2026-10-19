import type { NavProps } from "@grade10/design-system/components/layout/nav";
import { describe, expectTypeOf, it } from "vitest";
import type { SiteHeaderCopy, SiteHeaderProps } from "./site-header";

describe("SiteHeader's account menu", () => {
  it("takes no second orders item (shared-ui-site-chrome-SC-42)", () => {
    expectTypeOf<SiteHeaderProps>().not.toHaveProperty("onOrders");
    expectTypeOf<SiteHeaderCopy>().not.toHaveProperty("orders");
  });
});

describe("the cart count", () => {
  it("reaches the header, never Nav (shared-ui-site-chrome-SC-24)", () => {
    expectTypeOf<SiteHeaderProps>().toHaveProperty("cartItemCount");
    expectTypeOf<NavProps>().not.toHaveProperty("cartItemCount");
    const count: Pick<NavProps, "cartSlot"> = {
      // @ts-expect-error Nav takes no cart count
      cartItemCount: 3,
    };
    expectTypeOf(count).toEqualTypeOf<Pick<NavProps, "cartSlot">>();
  });

  it("requires the cart word (shared-ui-site-chrome-SC-03)", () => {
    expectTypeOf<SiteHeaderCopy["cart"]>().toEqualTypeOf<string>();
  });
});
