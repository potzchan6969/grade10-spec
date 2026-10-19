import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { MarkdownView } from "../src/blocks/markdown";
import { snapshotOf } from "./manual-fixture";

const index = buildIndex(snapshotOf([], []));

function render(text: string, pips = false): string {
  return renderToStaticMarkup(
    <MemoryRouter>
      <MarkdownView
        baseDir="docs/prds/products/demo"
        index={index}
        pips={pips}
        text={text}
      />
    </MemoryRouter>,
  );
}

describe("rule ids", () => {
  it("hides the id of a bullet and anchors the item to it", () => {
    const html = render(
      "- **Earned once** - never twice {#earn-once}\n- **Other** - plain",
    );
    expect(html).toContain('<li id="earn-once">');
    expect(html).not.toContain("{#");
  });

  it("anchors a paragraph and a table row", () => {
    const html = render(
      "The rule holds. {#holds}\n\n| Rule | Value |\n| --- | --- |\n| Rate | **1×** {#rate} |",
    );
    expect(html).toContain('<p id="holds">');
    expect(html).toContain('<tr id="rate">');
    expect(html).not.toContain("{#");
  });

  it("anchors a nested bullet to its own id, not its parent", () => {
    const html = render("- **Outer** - text\n  - **Inner** - text {#inner}");
    expect(html).toContain('<li id="inner">');
    expect(html).not.toMatch(/<li id="inner">\s*<p>?<strong>Outer/);
  });

  it("leaves code alone", () => {
    expect(render("`{#not-an-id}`")).toContain("{#not-an-id}");
  });
});
