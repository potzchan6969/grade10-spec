import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { pageMarks } from "../src/api/page-phases";
import { casesOfPage } from "../src/api/suites";
import type { VerdictsState } from "../src/api/use-release";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { rulesOf, sectionRows } from "../src/blocks/side-blocks";
import { parsePage } from "../src/content/grammar";
import { PageReleaseProvider } from "../src/shell/section-readiness";
import { SectionCases } from "../src/shell/side-panel";
import { snapshotOf } from "./manual-fixture";
import {
  reading,
  SHOP,
  SHOP_SOURCE,
  suites,
  verdicts,
} from "./release-fixture";

const marks = pageMarks(reading, SHOP);
const cases = casesOfPage(suites, SHOP);
const rows = sectionRows(parsePage(SHOP_SOURCE).blocks);

function qaTab(section: string, state: VerdictsState): string {
  if (!marks) throw new Error("no shop page");
  const row = rows.find((one) => one.section === section);
  if (!row) throw new Error(`no section ${section}`);
  return renderToStaticMarkup(
    <MemoryRouter>
      <BlockScopeProvider
        value={{ index: buildIndex(snapshotOf()), pagePath: SHOP }}
      >
        <PageReleaseProvider
          value={{
            reading,
            marks,
            verdicts: state,
            team: [{ handle: "chloe9gag", roles: ["qa"] }],
          }}
        >
          <SectionCases
            section={section}
            shelf={{
              qa: cases.bySection.get(section) ?? [],
              rules: rulesOf(row.main),
            }}
          />
        </PageReleaseProvider>
      </BlockScopeProvider>
    </MemoryRouter>,
  );
}

const text = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

describe("readiness in the QA tab, before any result", () => {
  const none: VerdictsState = { status: "none", reason: "no desk" };

  it("heads the section's cases with its step, the steps passed and the one holding it", () => {
    const html = text(qaTab("browse", none));
    expect(html).toContain("Reviewed");
    expect(html).toContain("Prepared: 1 case covers it");
    expect(html).toContain("In QA: in no run yet");
    expect(html).toContain("Next: QA · @chloe9gag, run its cases");
    expect(html.indexOf("Reviewed")).toBeLessThan(
      html.indexOf("The grid sorts"),
    );
  });

  it("says quietly that there are no results, never an error", () => {
    expect(text(qaTab("browse", none))).toContain("No run results yet");
  });

  it("shows overlays beside the step, never as one", () => {
    const html = text(qaTab("browse", none));
    expect(html).toContain("❓ 1 question");
    expect(html).toContain("PM, answer 1 question");
  });

  it("shows both units where a section splits between two phases", () => {
    const html = qaTab("basket", none);
    expect(html).toContain('aria-label="Readiness in Store Launch 1"');
    expect(html).toContain('aria-label="Readiness in Store Launch 2"');
  });
});

describe("readiness in the QA tab, with the desk's verdicts", () => {
  const ready: VerdictsState = { status: "ready", verdicts };

  it("climbs to Passed and puts each case's latest verdict beside it", () => {
    const html = qaTab("browse", ready);
    expect(text(html)).toContain("Passed: every case passes");
    expect(html).toContain('href="/runs/r27"');
    expect(text(html)).toContain("Run 27");
    expect(text(html)).not.toContain("No run results yet");
    expect(html).toMatch(/>pass</);
  });

  it("names whose turn a failure is, and marks the failing case", () => {
    const html = qaTab("basket", ready);
    expect(text(html)).toContain("Failing");
    expect(text(html)).toContain("Passed: 1 fail");
    expect(text(html)).toContain("Assignee, 1 case bug");
    expect(html).toMatch(/>fail</);
  });
});
