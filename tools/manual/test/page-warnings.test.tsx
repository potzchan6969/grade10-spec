import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { RULES } from "../check/context.mjs";
import type { CheckWarning } from "../src/api/types";
import {
  PageWarnings,
  ruleTitle,
  warningsForPage,
} from "../src/pages/check-warnings";

/** The person who can act on a warning is the one reading the page it is
 * about, so the page carries its own. */

const PAGE = "docs/prds/products/shared-ui/store-cart.md";

const dense: CheckWarning = {
  rule: "dense",
  message: "`Site Sale and Promo Codes` opens on 14 sentences before its items",
  page: PAGE,
};

const elsewhere: CheckWarning = {
  rule: "icon",
  message: "no `icon` — the domain's rail row has no glyph",
  page: "docs/prds/products/demo-product/index.md",
};

const storeFile: CheckWarning = {
  rule: "design",
  message: ".design-sync/report.json: the report is 9 days old",
};

const render = (warnings: CheckWarning[]) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <PageWarnings warnings={warnings} />
    </MemoryRouter>,
  );

describe("which warnings a page owns", () => {
  it("takes the ones about itself and nothing else", () => {
    expect(warningsForPage([dense, elsewhere, storeFile], PAGE)).toEqual([
      dense,
    ]);
  });
});

describe("what the strip says", () => {
  it("names the rule in words and repeats what the check said", () => {
    const html = render([dense]);

    expect(html).toContain("Denser than the style allows");
    expect(html).toContain("Site Sale and Promo Codes");
  });

  it("is not there at all on a page with nothing to answer for", () => {
    expect(render([])).toBe("");
  });
});

describe("the rules the app can name", () => {
  it("has words for every rule the check can warn about", () => {
    const warned = RULES.filter((rule) => rule.level === "warn").map(
      (rule) => rule.key,
    );
    for (const rule of [...warned, "design"]) {
      expect(ruleTitle(rule), rule).not.toBe(rule);
    }
  });

  it("shows a rule it has no words for as itself", () => {
    expect(ruleTitle("brand-new")).toBe("brand-new");
  });
});
