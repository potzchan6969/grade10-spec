import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { pageMarks } from "../src/api/page-phases";
import { MarkdownView } from "../src/blocks/markdown";
import { snapshotOf } from "./manual-fixture";
import {
  BARE,
  LATER,
  MISC,
  phases,
  reading,
  SHOP,
  SHOP_SOURCE,
  TIERS,
} from "./release-fixture";

const marksOf = (path: string) => {
  const marks = pageMarks(reading, path);
  if (!marks) throw new Error(`no page ${path}`);
  return marks;
};

describe("a page's chip", () => {
  it("names the page's own phase and release priority", () => {
    expect(marksOf(SHOP).page).toEqual({
      phase: "store-launch-1",
      priority: "P0",
    });
  });

  it("carries readiness only where the unit is the capability or the page", () => {
    expect(marksOf(SHOP).pageUnit).toBeUndefined();
    expect(marksOf(TIERS).pageUnit?.key).toBe(
      "spec:site/loyalty/tiers@store-launch-1",
    );
    expect(marksOf(MISC).pageUnit?.key).toBe(`${MISC}@store-launch-1`);
  });

  it("shows nothing on a page in no phase", () => {
    const bare = marksOf(BARE);
    expect(bare.page).toBeUndefined();
    expect(bare.unplanned).toBe(0);
  });
});

describe("only where it differs", () => {
  const shop = marksOf(SHOP);

  it("leaves a heading in the page's phase quiet, even with a block of its own", () => {
    expect(shop.heading("browse")).toBeUndefined();
    expect(shop.heading("same")).toBeUndefined();
    expect(shop.heading("basket")).toBeUndefined();
  });

  it("chips a heading whose block differs from the one above it", () => {
    expect(shop.heading("points")).toEqual({
      phase: "store-launch-2",
      priority: "P0",
    });
  });

  it("chips a rule named apart, and not the rules it holds", () => {
    expect(shop.rule("basket", "gift")).toEqual({
      phase: "store-launch-2",
      priority: "P1",
    });
    expect(shop.rule("basket", "wrapped")).toBeUndefined();
    expect(shop.rule("basket", "add")).toBeUndefined();
    expect(shop.rule("points", "spend")).toBeUndefined();
  });

  it("answers by the rule alone where its heading is not known", () => {
    expect(shop.rule(null, "gift")?.phase).toBe("store-launch-2");
    expect(shop.rule(null, "add")).toBeUndefined();
  });

  it("splits a section into a unit per phase", () => {
    expect(shop.sectionUnits("basket").map((unit) => unit.phase)).toEqual([
      "store-launch-1",
      "store-launch-2",
    ]);
    expect(marksOf(TIERS).sectionUnits("tiers")).toEqual([]);
  });
});

describe("the Unplanned chip", () => {
  it("counts lines being built in no phase on a page that names one", () => {
    expect(marksOf(LATER).unplanned).toBe(2);
    expect(marksOf(LATER).page).toBeUndefined();
  });

  it("is not adopted on a page that names no phase", () => {
    expect(marksOf(BARE).unplanned).toBe(0);
  });
});

describe("the chips in the reading", () => {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <MarkdownView
        anchors
        baseDir={STORE_DIR}
        index={buildIndex(snapshotOf())}
        phases={{ marks: marksOf(SHOP), phases }}
        text={SHOP_SOURCE.split("---\n")
          .slice(2)
          .join("---\n")
          .replace(/^::phase.*$/gm, "")}
      />
    </MemoryRouter>,
  );

  it("puts one chip on the differing heading and one on the rule named apart", () => {
    expect(html.match(/href="\/phases\/[^"]*"/g)).toEqual([
      'href="/phases/store-launch-2"',
      'href="/phases/store-launch-2"',
    ]);
    expect(html).not.toContain("Store Launch 1");
    expect(html).toContain('href="/phases/store-launch-2"');
  });

  it("puts the rule's chip right after its bold name", () => {
    expect(html).toMatch(
      /<strong>Gift<\/strong> <a[^>]*\/phases\/store-launch-2/,
    );
  });
});

const STORE_DIR = "docs/prds/products/site/store";
