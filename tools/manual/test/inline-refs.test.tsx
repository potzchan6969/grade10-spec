import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { SpecEntry } from "../src/api/types";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { MarkdownView } from "../src/blocks/markdown";
import { ProseBlockView } from "../src/blocks/prose-block";
import { pageEntry, snapshotOf } from "./manual-fixture";

/** Both specs issue `navigation-SC-01`, the collision the store already has:
 * a bare id is only unambiguous inside the page that owns it. */
const alpha: SpecEntry = {
  id: "demo-product/alpha",
  title: "alpha Specification",
  purpose: "",
  requirements: [
    {
      name: "Alpha does things",
      text: "",
      scenarios: [
        { id: "alpha-SC-01", name: "Points land on the card", text: "" },
        { id: "navigation-SC-01", name: "Alpha keeps its place", text: "" },
      ],
    },
  ],
  journeys: [
    {
      id: "alpha-US-01",
      title: "A shopper collects points",
      text: "",
      acceptedBy: ["alpha-SC-01"],
    },
  ],
  testCases: [
    {
      id: "alpha-TC-01",
      title: "Points land after checkout",
      traces: ["alpha-SC-01"],
      status: "actual",
    },
  ],
};

const beta: SpecEntry = {
  id: "demo-product/beta",
  title: "beta Specification",
  purpose: "",
  requirements: [
    {
      name: "Beta does things",
      text: "",
      scenarios: [
        { id: "navigation-SC-01", name: "Beta keeps its place", text: "" },
      ],
    },
  ],
};

const ALPHA_PAGE = "manual/products/demo-product/alpha.md";
const GUIDE_PAGE = "manual/guides/writing.md";

const index = buildIndex(
  snapshotOf({
    specs: [alpha, beta],
    pages: [
      pageEntry(ALPHA_PAGE, { title: "Alpha", spec: alpha.id }),
      pageEntry("manual/products/demo-product/beta.md", {
        title: "Beta",
        spec: beta.id,
      }),
      pageEntry(GUIDE_PAGE, { title: "Writing the manual" }),
    ],
  }),
);

function render(markdown: string, pagePath = ALPHA_PAGE): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <BlockScopeProvider value={{ index, pagePath }}>
        <ProseBlockView block={{ type: "prose", markdown }} />
      </BlockScopeProvider>
    </MemoryRouter>,
  );
}

describe("a reference that resolves", () => {
  it("links a spec to its capability page under the name the app gives it", () => {
    const html = render("Start at [[demo-product/beta]].");

    expect(html).toContain('href="/p/demo-product/beta"');
    expect(html).toContain(">Beta<");
    expect(html).not.toContain("beta Specification");
  });

  it("links an item to its anchor and wears the title it has today", () => {
    const html = render("See [[alpha-SC-01]].");

    expect(html).toContain('href="/p/demo-product/alpha#alpha-SC-01"');
    expect(html).toContain(">Points land on the card<");
    expect(html).not.toContain("[[alpha-SC-01]]");
  });

  it("reaches a story and a test case by the same id form", () => {
    expect(render("[[alpha-US-01]]")).toContain(
      'href="/p/demo-product/alpha#alpha-US-01"',
    );
    expect(render("[[alpha-TC-01]]")).toContain(">Points land after checkout<");
  });

  it("marks a live reference apart from a hand-written link", () => {
    expect(render("[[alpha-SC-01]]")).toContain('class="decoration-dotted"');
  });

  it("resolves a bare id inside the page's own spec, not the other one", () => {
    const html = render("[[navigation-SC-01]]");

    expect(html).toContain('href="/p/demo-product/alpha#navigation-SC-01"');
    expect(html).toContain(">Alpha keeps its place<");
  });

  it("takes a qualified id at its word", () => {
    const html = render("[[demo-product/beta#navigation-SC-01]]");

    expect(html).toContain('href="/p/demo-product/beta#navigation-SC-01"');
    expect(html).toContain(">Beta keeps its place<");
  });
});

describe("a reference that does not", () => {
  it("marks an ambiguous id dead and says how to qualify it", () => {
    const html = render("[[navigation-SC-01]]", GUIDE_PAGE);

    expect(html).toContain("line-through");
    expect(html).toContain("[[navigation-SC-01]]");
    expect(html).toContain("qualify it as `[[&lt;spec&gt;#navigation-SC-01]]`");
    expect(html).not.toContain("href=");
  });

  it("marks an id nothing answers to dead, with the resolver's reason", () => {
    const html = render("[[alpha-SC-99]]");

    expect(html).toContain("line-through");
    expect(html).toContain('title="nothing named `alpha-SC-99`"');
    expect(html).toContain("[[alpha-SC-99]]");
  });
});

describe("where a reference is only text", () => {
  it("leaves one inside an inline code span alone", () => {
    const html = render("Write `[[alpha-SC-01]]` to cite it.");

    expect(html).toContain("<code>[[alpha-SC-01]]</code>");
    expect(html).not.toContain("href=");
  });

  it("leaves one inside a fenced block alone", () => {
    const html = render("```\n[[alpha-SC-01]]\n```");

    expect(html).toContain("<pre>");
    expect(html).toContain("[[alpha-SC-01]]");
    expect(html).not.toContain("href=");
  });

  /** A token is whatever sits in one text node. Emphasis splits it into three,
   * so `[[a**b**]]` is prose about brackets — the syntax buys no escape hatch
   * and needs none. */
  it("does not stitch a token back together across emphasis", () => {
    const html = render("[[a**b**]]");

    expect(html).toContain("[[a");
    expect(html).toContain("<strong>b</strong>");
    expect(html).not.toContain("href=");
    expect(html).not.toContain("line-through");
  });

  it("leaves spec text mirrored from the store verbatim", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <MarkdownView
          baseDir="openspec/specs/demo-product/alpha"
          index={index}
          text="The spec says [[alpha-SC-01]] and means the brackets."
        />
      </MemoryRouter>,
    );

    expect(html).toContain("[[alpha-SC-01]]");
    expect(html).not.toContain("href=");
  });
});
