import { describe, expectTypeOf, it } from "vitest";
import type { SiteHeaderCopy, SiteHeaderProps } from "./site-header";

describe("SiteHeader's account menu", () => {
  it("takes no second orders item (shared-ui-site-chrome-SC-42)", () => {
    expectTypeOf<SiteHeaderProps>().not.toHaveProperty("onOrders");
    expectTypeOf<SiteHeaderCopy>().not.toHaveProperty("orders");
  });
});
