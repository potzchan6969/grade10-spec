import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { CheckWarning } from "../src/api/types";
import { snapshotOf } from "./manual-fixture";

/** The panel reads the snapshot through the provider the app mounts; the test
 * hands it an index directly, so nothing here goes near a fetch. */
const held = vi.hoisted(() => ({ index: undefined as unknown }));
vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));

const { MaintenancePanel } = await import("../src/pages/maintenance-panel");

function render(warnings: CheckWarning[]): string {
  held.index = buildIndex(snapshotOf({ warnings }));
  return renderToStaticMarkup(
    <MemoryRouter>
      <MaintenancePanel />
    </MemoryRouter>,
  );
}

const STALE: CheckWarning = {
  rule: "stale",
  message:
    "last committed 2026-01-01; `demo-product/alpha` has since changed `Alpha does things`",
  page: "docs/prds/products/demo-product/alpha.md",
};

const SHELF: CheckWarning = {
  rule: "skeleton",
  message: "has a `spec` and no `::cases` block — missing its acceptance shelf",
  page: "docs/prds/products/demo-product/beta.md",
};

const UNSHOWN: CheckWarning = {
  rule: "suite",
  message:
    "openspec/specs/demo-product/alpha/feature-tcs.md: holds 2 test cases and no page shows them",
};

describe("the maintenance panel", () => {
  it("does not render at all when the build had nothing to say", () => {
    expect(render([])).toBe("");
  });

  it("opens collapsed, with the count in the header", () => {
    const html = render([STALE, SHELF, UNSHOWN]);

    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain("Maintenance");
    expect(html).toContain(">3</span>");
  });

  it("groups by rule and names each rule in words", () => {
    const html = render([STALE, SHELF, UNSHOWN]);

    expect(html).toContain("Pages older than the specs they embed");
    expect(html).toContain("Capability pages missing their acceptance shelf");
    expect(html).toContain("Specs whose test cases no page shows");
  });

  it("links a page warning to the page's own route", () => {
    const html = render([STALE]);

    expect(html).toContain('href="/p/demo-product/alpha"');
    expect(html).toContain("docs/prds/products/demo-product/alpha.md");
    expect(html).toContain("has since changed");
  });

  it("names a store file that has no page to link to, and links nothing", () => {
    const html = render([UNSHOWN]);

    expect(html).toContain("openspec/specs/demo-product/alpha/feature-tcs.md");
    expect(html).not.toContain("<a ");
  });

  it("gives a rule it has no words for its own group under its key", () => {
    const html = render([{ rule: "brand-new", message: "something moved" }]);

    expect(html).toContain("brand-new");
    expect(html).toContain("something moved");
  });
});
