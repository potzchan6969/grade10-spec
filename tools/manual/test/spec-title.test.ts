import { describe, expect, it } from "vitest";
import { specTitle } from "../src/api/paths";

describe("the name a spec wears on screen", () => {
  it("drops the store's `<id> Specification` boilerplate", () => {
    expect(
      specTitle({ id: "money-amounts", title: "money-amounts Specification" }),
    ).toBe("Money Amounts");
    expect(
      specTitle({
        id: "grade10-site/navigation",
        title: "grade10-site/navigation Specification",
      }),
    ).toBe("Navigation");
  });

  it("drops a title that is only the id said again", () => {
    expect(
      specTitle({
        id: "grade10-store/loyalty",
        title: "grade10-store/loyalty",
      }),
    ).toBe("Loyalty");
    expect(
      specTitle({
        id: "grade10-store/loyalty",
        title: "grade10-store/loyalty rules",
      }),
    ).toBe("Loyalty");
  });

  it("keeps a title that says something of its own", () => {
    expect(specTitle({ id: "grade10-store/loyalty", title: "Loyalty" })).toBe(
      "Loyalty",
    );
    expect(
      specTitle({ id: "shared-auth/sign-in", title: "Signing in and out" }),
    ).toBe("Signing in and out");
  });

  it("falls back to the id when the title is empty", () => {
    expect(specTitle({ id: "shared-ui/store-cart", title: "" })).toBe(
      "Store Cart",
    );
  });
});
