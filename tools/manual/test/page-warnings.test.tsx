import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import type { CheckWarning } from "../src/api/types";
import {
  PageWarnings,
  ruleTitle,
  warningsForPage,
} from "../src/pages/check-warnings";

/** The stale warning names which requirements moved — and it rendered only
 * inside a collapsed panel on another route. The person who can act on it is
 * the one reading the page it is about. */

const PAGE = "docs/prds/products/shared-ui/store-cart.md";

const stale: CheckWarning = {
  rule: "stale",
  message:
    "last committed 2026-08-30; `shared-ui/store-cart` has since added `Unavailable items are removed silently`, changed `The store cart drawer exports`",
  page: PAGE,
};

const elsewhere: CheckWarning = {
  rule: "skeleton",
  message: "missing its acceptance shelf",
  page: "docs/prds/products/demo-product/beta.md",
};

const storeFile: CheckWarning = {
  rule: "coverage",
  message: "openspec/specs/demo-product/alpha/test-cases.md: no case traces …",
};

const render = (warnings: CheckWarning[]) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <PageWarnings warnings={warnings} />
    </MemoryRouter>,
  );

describe("which warnings a page owns", () => {
  it("takes the ones about itself and nothing else", () => {
    expect(warningsForPage([stale, elsewhere, storeFile], PAGE)).toEqual([
      stale,
    ]);
  });

  it("leaves a store-file warning to the maintenance list", () => {
    expect(warningsForPage([storeFile], PAGE)).toEqual([]);
  });
});

describe("what the strip says", () => {
  it("names the rule in words and repeats what changed", () => {
    const html = render([stale]);

    expect(html).toContain("Pages older than the specs they embed");
    expect(html).toContain("The store cart drawer exports");
  });

  it("is not there at all on a page with nothing to answer for", () => {
    expect(render([])).toBe("");
  });
});

/** Warn rules could reach the snapshot with no words behind them, so the
 * panel grouped them under a bare key. */
describe("the rules the app can now name", () => {
  it("has words for every rule the check can warn about", () => {
    for (const rule of [
      "stale",
      "skeleton",
      "ref",
      "figma",
      "fold",
      "journeys",
      "suite",
      "coverage",
      "design",
    ]) {
      expect(ruleTitle(rule)).not.toBe(rule);
    }
  });

  it("shows a rule it has no words for as itself", () => {
    expect(ruleTitle("brand-new")).toBe("brand-new");
  });
});
