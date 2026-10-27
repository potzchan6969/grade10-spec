import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { BlockScopeProvider } from "../src/blocks/block-scope";
import { MarkdownView } from "../src/blocks/markdown";
import { ProseBlockView } from "../src/blocks/prose-block";
import { pageEntry, snapshotOf } from "./manual-fixture";

const ALPHA_PAGE = "docs/prds/products/demo-product/alpha.md";

const index = buildIndex(
  snapshotOf({
    pages: [
      pageEntry(ALPHA_PAGE, { title: "Alpha", spec: "demo-product/alpha" }),
      pageEntry("docs/prds/products/demo-product/beta.md", {
        title: "Beta",
        spec: "demo-product/beta",
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
  it("links a capability to the page that documents it, under its title", () => {
    const html = render("Start at [[demo-product/beta]].");

    expect(html).toContain('href="/p/demo-product/beta"');
    expect(html).toContain(">Beta<");
    expect(html).toContain('class="decoration-dotted"');
  });
});

describe("a reference that does not resolve", () => {
  it("refuses a qualified item id, since a reference names a capability", () => {
    const html = render("[[demo-product/alpha#alpha-SC-01]]");

    expect(html).toContain("line-through");
    expect(html).not.toContain("href=");
    expect(html).toContain("a reference names a capability, not an item");
  });

  it("marks an id no page documents dead, with the resolver's reason", () => {
    const html = render("[[alpha-SC-99]]");

    expect(html).toContain("line-through");
    expect(html).toContain('title="no page documents `alpha-SC-99`"');
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

  it("leaves a reference document's text verbatim", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <MarkdownView
          baseDir="docs/references"
          index={index}
          text="The draft says [[alpha-SC-01]] and means the brackets."
        />
      </MemoryRouter>,
    );

    expect(html).toContain("[[alpha-SC-01]]");
    expect(html).not.toContain("href=");
  });
});
