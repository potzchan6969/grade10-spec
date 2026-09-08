import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import type { PageSection } from "../src/shell/page-sections";
import { PageSectionsContext } from "../src/shell/page-sections";
import { pageEntry, snapshotOf } from "./manual-fixture";

/** The nav's third level: the page you are reading opens to its own sections,
 * and no other row does. */

const held = vi.hoisted(() => ({ snapshot: undefined as unknown }));

vi.mock("../src/api/snapshot-provider", () => ({
  useSnapshot: () => ({
    status: "ready",
    snapshot: held.snapshot,
    source: "store",
  }),
}));

// The rail carries a New page control; the editor is not what is under test.
vi.mock("../src/editor/session", () => ({
  useEditorSession: () => ({ store: null }),
}));

const { Sidebar } = await import("../src/shell/sidebar");

held.snapshot = snapshotOf({
  config: {
    storybookBase: "",
    groups: [],
    platform: [],
    guides: ["start-here", "how-we-plan"],
  },
  pages: [
    pageEntry("docs/prds/guides/start-here.md", { title: "Start here" }),
    pageEntry("docs/prds/guides/how-we-plan.md", { title: "How we plan" }),
  ],
});

const h2 = (id: string): PageSection => ({ id, title: `The ${id}`, level: 2 });

const SECTIONS = [h2("shape"), h2("decisions"), h2("history")];

function render(at: string, sections: PageSection[], active?: string): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[at]}>
      <PageSectionsContext value={{ sections, active }}>
        <Sidebar onNavigate={() => {}} open />
      </PageSectionsContext>
    </MemoryRouter>,
  );
}

describe("the row of the page being read", () => {
  const html = render("/guides/start-here", SECTIONS, "decisions");

  it("lists the page's sections, one of them marked", () => {
    expect(html).toContain('href="#shape"');
    expect(html).toContain('href="#decisions"');
    expect(html).toContain('href="#history"');
    expect(html.match(/aria-current="location"/g)).toHaveLength(1);
    expect(html.indexOf('aria-current="location"')).toBeGreaterThan(
      html.indexOf('href="#shape"'),
    );
  });

  it("lists them under its own row and nobody else's", () => {
    const row = html.indexOf("Start here");
    const next = html.indexOf("How we plan");
    expect(row).toBeLessThan(html.indexOf('href="#shape"'));
    expect(html.indexOf('href="#history"')).toBeLessThan(next);
  });

  it("lists the H2s alone", () => {
    const withDeeper = render(
      "/guides/start-here",
      [...SECTIONS, { id: "edge", title: "An edge", level: 3 }],
      "shape",
    );
    expect(withDeeper).not.toContain('href="#edge"');
  });

  it("lists nothing where the page has too few sections", () => {
    expect(render("/guides/start-here", SECTIONS.slice(0, 2))).not.toContain(
      'href="#',
    );
  });

  it("moves to whichever row the reader is on", () => {
    const elsewhere = render("/guides/how-we-plan", SECTIONS, "shape");
    expect(elsewhere.indexOf("How we plan")).toBeLessThan(
      elsewhere.indexOf('href="#shape"'),
    );
    expect(elsewhere.indexOf("Start here")).toBeLessThan(
      elsewhere.indexOf("How we plan"),
    );
  });
});
