import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { buildIndex } from "../src/api/derive";
import { classifyHref } from "../src/blocks/markdown";
import { pageEntry, snapshotOf } from "./manual-fixture";

/** A reference is read in the manual, where the pages that cite it are read:
 * the rail lists it, a citation lands on it, and the page shows it as
 * written. */

const held = vi.hoisted(() => ({
  index: undefined as unknown,
  reference: { status: "loading" } as unknown,
}));

vi.mock("../src/api/use-manual-index", () => ({
  useManualIndex: () => held.index,
}));
vi.mock("../src/api/use-reference", () => ({
  useReference: () => held.reference,
}));

const { ReferencePage, ReferencesPage } = await import(
  "../src/pages/references-page"
);

const snapshot = snapshotOf({
  pages: [
    pageEntry("docs/prds/index.md", { title: "Demo" }),
    pageEntry("docs/prds/products/demo/alpha.md", { title: "Alpha" }),
  ],
  references: [
    {
      slug: "owner-draft",
      path: "docs/references/owner-draft.md",
      title: "The owner's draft",
    },
  ],
  referencesReadme: "# References\n\nWhat a reference is.\n",
});
const index = buildIndex(snapshot);

function render(url: string, state: unknown): string {
  held.index = index;
  held.reference = state;
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route element={<ReferencesPage />} path="references" />
        <Route element={<ReferencePage />} path="references/:slug" />
      </Routes>
    </MemoryRouter>,
  );
}

describe("where a reference sits", () => {
  it("is a nav entry routed under /references", () => {
    expect(index.references).toEqual([
      {
        id: "owner-draft",
        title: "The owner's draft",
        to: "/references/owner-draft",
        order: 0,
      },
    ]);
    expect(index.referenceByRoute.has("/references/owner-draft")).toBe(true);
  });

  it("is where a page's citation lands, README and all", () => {
    const from = "docs/prds/products/demo";
    expect(
      classifyHref("../../../references/owner-draft.md", from, index),
    ).toEqual({ kind: "route", to: "/references/owner-draft" });
    expect(
      classifyHref("../../../references/owner-draft.md#tiers", from, index),
    ).toEqual({ kind: "route", to: "/references/owner-draft#tiers" });
    expect(classifyHref("../../../references/README.md", from, index)).toEqual({
      kind: "route",
      to: "/references",
    });
    expect(classifyHref("/references/owner-draft", from, index)).toEqual({
      kind: "route",
      to: "/references/owner-draft",
    });
    expect(classifyHref("/references", from, index)).toEqual({
      kind: "route",
      to: "/references",
    });
  });

  it("is read on GitHub when the store does not list it", () => {
    expect(
      classifyHref(
        "../../../references/lost.md",
        "docs/prds/products/demo",
        index,
      ),
    ).toMatchObject({ kind: "github" });
  });
});

describe("the landing", () => {
  it("says what a reference is and lists every one", () => {
    const html = render("/references", { status: "loading" });
    expect(html).toContain("What a reference is.");
    expect(html).not.toContain("<h1>References</h1><h1");
    expect(html).toContain("The owner&#x27;s draft");
    expect(html).toContain("docs/references/owner-draft.md");
  });
});

describe("one reference", () => {
  it("renders the document as written, under its own title once", () => {
    const html = render("/references/owner-draft", {
      status: "ready",
      document: {
        slug: "owner-draft",
        path: "docs/references/owner-draft.md",
        title: "The owner's draft",
        text: "# The owner's draft\n\n## Tiers\n\n| Tier | Rate |\n| --- | --- |\n| Base | 1× |\n",
        lastCommit: {
          sha: "abcdef1234567890",
          date: "2026-01-01T00:00:00Z",
          subject: "the draft",
        },
      },
    });
    expect(html).toContain('id="tiers"');
    expect(html).toContain("abcdef12");
    expect(html).toContain("docs/references/owner-draft.md");
    expect(html.match(/The owner&#x27;s draft/g)?.length).toBe(1);
  });

  it("says when it is still loading, or could not be read", () => {
    expect(render("/references/owner-draft", { status: "loading" })).toContain(
      'aria-busy="true"',
    );
    expect(
      render("/references/owner-draft", {
        status: "unavailable",
        reason: "/api/reference/owner-draft answered 404 Not Found",
      }),
    ).toContain("answered 404");
  });

  it("says so for a slug the store does not list", () => {
    const html = render("/references/never", { status: "loading" });
    expect(html).toContain("No such reference");
    expect(html).toContain("docs/references/never.md");
  });
});
