import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NO_GIT } from "../src/store/git.mts";
import {
  deriveTaxonomy,
  readManualConfig,
  readManualPages,
} from "../src/store/read-manual.mts";
import { rootsOf } from "../src/store/roots.mts";
import { writeStore as write } from "./tmp-store";

const FIXTURE = fileURLToPath(new URL("../demo-store", import.meta.url));
const BROKEN_PAGE = fileURLToPath(
  new URL("./fixtures/broken-page", import.meta.url),
);
const DUPLICATE = fileURLToPath(
  new URL("./fixtures/duplicate-product", import.meta.url),
);

describe("manual pages", () => {
  const { pages, asts } = readManualPages(rootsOf(FIXTURE), NO_GIT);

  it("walks docs/prds/**/*.md into store-relative entries", () => {
    expect(pages.map((page) => page.path)).toEqual([
      "docs/prds/guides/getting-started.md",
      "docs/prds/index.md",
      "docs/prds/platform/demo-topic.md",
      "docs/prds/products/demo-product/index.md",
      "docs/prds/products/demo-shared/index.md",
      "docs/prds/products/page-only/index.md",
    ]);
    expect(pages[1].source).toContain("title: Demo manual");
  });

  it("keeps the parse of every page it walked", () => {
    // The freshness read is handed these rather than parsing the sources a
    // second time.
    expect([...asts.keys()]).toEqual(pages.map((page) => page.path));
    expect(asts.get("docs/prds/index.md")?.frontmatter.title).toBe(
      "Demo manual",
    );
  });

  it("throws on a page the grammar refuses, naming file and line", () => {
    expect(() => readManualPages(rootsOf(BROKEN_PAGE), NO_GIT)).toThrow(
      /docs\/prds\/bad\.md:5: line 5: unknown directive `nope`/,
    );
  });
});

describe("manual.yaml", () => {
  const config = readManualConfig(rootsOf(FIXTURE));

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
      "docs/prds/manual.yaml":
        "storybookBase: https://s.example\nplatform: [money-amounts]\n",
    });
    expect(readManualConfig(rootsOf(root)).platform).toEqual([
      { title: "Cross-cutting", topics: ["money-amounts"] },
    ]);
  });

  it("throws when a topic is listed twice", () => {
    const root = write({
      "docs/prds/manual.yaml":
        "storybookBase: https://s.example\nplatform:\n  Conventions: [money]\n  Architecture: [money]\n",
    });
    expect(() => readManualConfig(rootsOf(root))).toThrow(
      /lists `money` twice/,
    );
  });

  it("reads the array form of groups too", () => {
    const root = write({
      "docs/prds/manual.yaml":
        "storybookBase: https://s.example\ngroups:\n  - title: Products\n    products: [a, b]\n",
    });
    expect(readManualConfig(rootsOf(root)).groups).toEqual([
      { title: "Products", products: ["a", "b"] },
    ]);
  });

  it("throws when a product is listed twice", () => {
    expect(() => readManualConfig(rootsOf(DUPLICATE))).toThrow(
      /lists `demo-product` twice/,
    );
  });

  it("throws on malformed yaml", () => {
    const root = write({ "docs/prds/manual.yaml": "groups: [unclosed\n" });
    expect(() => readManualConfig(rootsOf(root))).toThrow(/not valid YAML/);
  });

  it("throws when storybookBase is missing", () => {
    const root = write({ "docs/prds/manual.yaml": "groups: {}\n" });
    expect(() => readManualConfig(rootsOf(root))).toThrow(
      /needs `storybookBase`/,
    );
  });
});

describe("taxonomy", () => {
  const root = write({
    "docs/prds/products/demo-product/index.md": "---\ntitle: Demo\n---\n",
    "docs/prds/products/demo-product/alpha.md": "---\ntitle: Alpha\n---\n",
    "docs/prds/products/app/shop/index.md": "---\ntitle: Shop\n---\n",
    "docs/prds/platform/demo-topic.md": "---\ntitle: Topic\n---\n",
    "docs/prds/platform/shared/money.md": "---\ntitle: Money\n---\n",
  });
  const config = (products: string[]) => ({
    storybookBase: "https://s.example",
    groups: [{ title: "Mine", products }],
    platform: [],
    guides: [],
  });

  it("orders by manual.yaml, then the products the pages hold", () => {
    const taxonomy = deriveTaxonomy(rootsOf(root), config(["app/shop"]));
    expect(taxonomy.products).toEqual(["app/shop", "demo-product"]);
  });

  it("names a topic by its page's path under platform/", () => {
    const taxonomy = deriveTaxonomy(rootsOf(root), config([]));
    expect(taxonomy.topics).toEqual(["demo-topic", "shared/money"]);
  });
});
