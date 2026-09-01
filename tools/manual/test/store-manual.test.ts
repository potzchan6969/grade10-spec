import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import {
  deriveTaxonomy,
  readManualConfig,
  readManualPages,
} from "../src/store/read-manual.mts";
import { discoverSpecs } from "../src/store/read-specs.mts";
import { writeStore as write } from "./tmp-store";

const FIXTURE = fileURLToPath(new URL("./fixtures/store", import.meta.url));
const BROKEN_PAGE = fileURLToPath(
  new URL("./fixtures/broken-page", import.meta.url),
);
const DUPLICATE = fileURLToPath(
  new URL("./fixtures/duplicate-product", import.meta.url),
);

describe("manual pages", () => {
  const pages = readManualPages(FIXTURE, NO_GIT);

  it("walks manual/**/*.md into store-relative entries", () => {
    expect(pages.map((page) => page.path)).toEqual([
      "manual/index.md",
      "manual/products/demo-product/index.md",
    ]);
    expect(pages[0].source).toContain("title: Demo manual");
  });

  it("throws on a page the grammar refuses, naming file and line", () => {
    expect(() => readManualPages(BROKEN_PAGE, NO_GIT)).toThrow(
      /manual\/bad\.md:5: line 5: unknown directive `nope`/,
    );
  });
});

describe("manual.yaml", () => {
  const config = readManualConfig(FIXTURE);

  it("reads the mapping form of groups in order", () => {
    expect(config.groups).toEqual([
      { title: "Products", products: ["demo-product", "page-only"] },
      { title: "Platform", products: ["demo-shared"] },
    ]);
    expect(config.storybookBase).toBe("https://storybook.example");
    expect(config.platform).toEqual([
      { title: "Conventions", topics: ["demo-topic"] },
    ]);
    expect(config.guides).toEqual(["getting-started"]);
  });

  /** Older stores wrote a bare list of topic ids; it stays readable, under a
   * name, because a nav section with no heading is worse than a plain one. */
  it("reads a flat platform list as one named group", () => {
    const root = write({
      "manual/manual.yaml":
        "storybookBase: https://s.example\nplatform: [money-amounts]\n",
    });
    expect(readManualConfig(root).platform).toEqual([
      { title: "Cross-cutting", topics: ["money-amounts"] },
    ]);
  });

  it("throws when a topic is listed twice", () => {
    const root = write({
      "manual/manual.yaml":
        "storybookBase: https://s.example\nplatform:\n  Conventions: [money]\n  Architecture: [money]\n",
    });
    expect(() => readManualConfig(root)).toThrow(/lists `money` twice/);
  });

  it("reads the array form of groups too", () => {
    const root = write({
      "manual/manual.yaml":
        "storybookBase: https://s.example\ngroups:\n  - title: Products\n    products: [a, b]\n",
    });
    expect(readManualConfig(root).groups).toEqual([
      { title: "Products", products: ["a", "b"] },
    ]);
  });

  it("throws when a product is listed twice", () => {
    expect(() => readManualConfig(DUPLICATE)).toThrow(
      /lists `demo-product` twice/,
    );
  });

  it("throws on malformed yaml", () => {
    const root = write({ "manual/manual.yaml": "groups: [unclosed\n" });
    expect(() => readManualConfig(root)).toThrow(/not valid YAML/);
  });

  it("throws when storybookBase is missing", () => {
    const root = write({ "manual/manual.yaml": "groups: {}\n" });
    expect(() => readManualConfig(root)).toThrow(/needs `storybookBase`/);
  });
});

describe("taxonomy", () => {
  it("orders by manual.yaml and keeps page-only products", () => {
    const taxonomy = deriveTaxonomy(
      discoverSpecs(FIXTURE),
      readManualConfig(FIXTURE),
    );
    expect(taxonomy.products).toEqual([
      "demo-product",
      "page-only",
      "demo-shared",
    ]);
    expect(taxonomy.topics).toEqual(["demo-topic"]);
  });

  it("keeps a disk product manual.yaml has not listed yet", () => {
    const taxonomy = deriveTaxonomy(discoverSpecs(FIXTURE), {
      storybookBase: "https://s.example",
      groups: [],
      platform: [],
      guides: [],
    });
    expect(taxonomy.products).toEqual(["demo-product"]);
    expect(taxonomy.topics).toEqual(["demo-topic"]);
  });

  /** A manual mounted in another repository shows what it lists — discovery
   * would pull the whole store into a rail that documents none of it. */
  it("adds nothing from disk when the manual is not the store's own", () => {
    const taxonomy = deriveTaxonomy(
      discoverSpecs(FIXTURE),
      {
        storybookBase: "https://s.example",
        groups: [{ title: "Mine", products: ["page-only"] }],
        platform: [],
        guides: [],
      },
      false,
    );
    expect(taxonomy.products).toEqual(["page-only"]);
    expect(taxonomy.topics).toEqual([]);
  });
});
