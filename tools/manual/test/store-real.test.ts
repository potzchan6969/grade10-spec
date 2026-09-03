import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { findStoreRoot } from "../src/store/disk.mts";
import { rootsOf } from "../src/store/roots.mts";
import { readStore } from "../src/store/snapshot.mts";

/** The one test that reads the real store: the readers have to survive the
 * files people actually write, not only the fixture. */
const root = findStoreRoot(fileURLToPath(new URL(".", import.meta.url)));
const { snapshot, archive } = await readStore(rootsOf(root));

describe("the real store", () => {
  it("names the commit it was read at", () => {
    expect(snapshot.storeHead).toMatch(/^[0-9a-f]{40}$/);
    expect(archive.storeHead).toBe(snapshot.storeHead);
  });

  it("reads every durable spec", () => {
    expect(snapshot.specs.length).toBeGreaterThanOrEqual(10);
    expect(snapshot.specs.every((spec) => spec.requirements.length > 0)).toBe(
      true,
    );
  });

  it("reads in-flight and archived changes apart", () => {
    expect(snapshot.changes.length).toBeGreaterThanOrEqual(5);
    expect(archive.changes.length).toBeGreaterThanOrEqual(10);
    expect(snapshot.changes.every((one) => one.status === "in-flight")).toBe(
      true,
    );
    expect(archive.changes.every((one) => one.status === "archived")).toBe(
      true,
    );
  });

  it("names somebody on every in-flight change", () => {
    const nameless = snapshot.changes
      .filter((one) => one.owners.length === 0 && !one.author)
      .map((one) => one.id);
    expect(nameless).toEqual([]);
  });

  it("classifies taxonomy by disk shape", () => {
    // A product is the application-and-domain a capability directory sits in;
    // a topic is a platform-wide format `shared` carries bare.
    expect(snapshot.taxonomy.products).toContain("grade10-site/store");
    expect(snapshot.taxonomy.topics).toContain("shared/money-amounts");
    expect(snapshot.taxonomy.products).not.toContain("shared/money-amounts");
    expect(snapshot.taxonomy.topics).not.toContain("grade10-site/store");
    // The layer above a product names no capability of its own.
    expect(snapshot.taxonomy.products).not.toContain("grade10-site");
  });

  /** An id's prefix is the capability's path with slashes as hyphens, so two
   * capabilities of the same name — `grade10-site/site/navigation` and
   * `zzz-site/site/navigation` — cannot both issue `navigation-SC-01`. */
  it("carries permanent ids where the store has issued them", () => {
    const loyalty = snapshot.specs.find(
      (spec) => spec.id === "grade10-site/loyalty/programme",
    );
    const prefix = "grade10-site-loyalty-programme";
    const scenarios =
      loyalty?.requirements.flatMap((one) => one.scenarios) ?? [];
    expect(scenarios.some((one) => one.id?.startsWith(`${prefix}-SC-`))).toBe(
      true,
    );
    expect(
      loyalty?.journeys?.some((one) => one.id.startsWith(`${prefix}-US-`)),
    ).toBe(true);
  });

  it("keeps the two navigation capabilities' ids apart", () => {
    const idsOf = (id: string) =>
      snapshot.specs
        .find((spec) => spec.id === id)
        ?.requirements.flatMap((one) => one.scenarios)
        .flatMap((one) => (one.id ? [one.id] : [])) ?? [];
    const site = idsOf("grade10-site/site/navigation");
    const zzz = idsOf("zzz-site/site/navigation");
    expect(site.length).toBeGreaterThan(0);
    expect(zzz.length).toBeGreaterThan(0);
    expect(
      site.every((one) => one.startsWith("grade10-site-site-navigation-")),
    ).toBe(true);
    expect(
      zzz.every((one) => one.startsWith("zzz-site-site-navigation-")),
    ).toBe(true);
    expect(site.filter((one) => zzz.includes(one))).toEqual([]);
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

  it("has no malformed store file", () => {
    const broken = [...snapshot.specs, ...snapshot.changes, ...archive.changes]
      .filter((entry) => entry.error)
      .map(
        (entry) =>
          `${entry.id}: ${entry.error?.file} — ${entry.error?.message}`,
      );
    expect(broken).toEqual([]);
  });
});
