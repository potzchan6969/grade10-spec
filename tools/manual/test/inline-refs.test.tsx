import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { SpecEntry } from "../src/api/types";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { MarkdownView } from "../src/blocks/markdown";
import { ProseBlockView } from "../src/blocks/prose-block";
import { pageEntry, snapshotOf } from "./manual-fixture";

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
      ],
    },
  ],
  journeys: [{ id: "alpha-US-01", title: "A shopper collects points", text: "" }],
};

const beta: SpecEntry = {
  id: "demo-product/beta",
  title: "beta Specification",
  purpose: "",
  requirements: [],
};

const ALPHA_PAGE = "docs/prds/products/demo-product/alpha.md";

const index = buildIndex(
  snapshotOf({
    specs: [alpha, beta],
    pages: [
      pageEntry(ALPHA_PAGE, { title: "Alpha", spec: alpha.id }),
      pageEntry("docs/prds/products/demo-product/beta.md", {
        title: "Beta",
        spec: beta.id,
      }),
    ],
  }),
);

function render(markdown: string): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <BlockScopeProvider value={{ index, pagePath: ALPHA_PAGE }}>
        <ProseBlockView block={{ type: "prose", markdown }} />
      </BlockScopeProvider>
    </MemoryRouter>,
  );
}

describe("a reference that resolves", () => {
  it("links a capability to its page under the name the app gives it", () => {
    const html = render("Start at [[demo-product/beta]].");

    expect(html).toContain('href="/p/demo-product/beta"');
    expect(html).toContain(">Beta<");
    expect(html).not.toContain("beta Specification");
    expect(html).toContain('class="decoration-dotted"');
  });
});

describe("a reference that does not resolve", () => {
  it("refuses an item id and names the capability to link instead", () => {
    const html = render("See [[alpha-SC-01]].");

    expect(html).toContain("line-through");
    expect(html).toContain("[[alpha-SC-01]]");
    expect(html).not.toContain("href=");
    expect(html).toContain(
      "is an item of `demo-product/alpha`; link its capability as `[[&lt;capability&gt;]]`",
    );
  });

  it("refuses a qualified item id, since a reference names a capability", () => {
    const html = render("[[demo-product/alpha#alpha-SC-01]]");

    expect(html).toContain("line-through");
    expect(html).not.toContain("href=");
    expect(html).toContain("a reference names a capability, not an item");
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
