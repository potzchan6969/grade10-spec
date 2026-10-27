import { describe, expect, it } from "vitest";
import { realStore } from "./real-store";

/** The readers have to survive the files people actually write, not only the
 * fixture. */
const { snapshot } = realStore;

describe("the real store", () => {
  it("names the commit it was read at", () => {
    expect(snapshot.storeHead).toMatch(/^[0-9a-f]{40}$/);
  });

  it("reads products and topics from where their pages sit", () => {
    expect(snapshot.taxonomy.products).toContain("grade10-site/store");
    expect(snapshot.taxonomy.topics).toContain("shared/money-amounts");
    expect(snapshot.taxonomy.products).not.toContain("shared/money-amounts");
    expect(snapshot.taxonomy.topics).not.toContain("grade10-site/store");
  });

  /** Both fields are required on the artifact, so an omission would ship a
   * snapshot the client's own types say cannot exist. */
  it("always carries an assets list and the build's own warnings", () => {
    expect(Array.isArray(snapshot.assets)).toBe(true);
    expect(snapshot.assets.every((one) => one.startsWith("assets/"))).toBe(
      true,
    );
    expect(Array.isArray(snapshot.warnings)).toBe(true);
    expect(
      snapshot.warnings.every((one) => one.rule !== "" && one.message !== ""),
    ).toBe(true);
  });

  it("reads every page", () => {
    expect(snapshot.pages.length).toBeGreaterThanOrEqual(50);
  });
});
