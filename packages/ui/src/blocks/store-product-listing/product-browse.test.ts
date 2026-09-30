import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductBrowse } from "./product-browse";
import { productBrowseArgs } from "./product-browse.story-shared";

afterEach(() => vi.unstubAllGlobals());

const serve = () =>
  renderToString(createElement(ProductBrowse, productBrowseArgs));

/* A served listing is written with no viewport to measure, and the render
 * that hydrates it has to draw the same markup, so the served answer is the
 * same wherever it is rendered: the sidebar, whose copy the served document
 * is held to. A narrow browser swaps in the narrow chrome on the next render. */
describe("ProductBrowse", () => {
  it("serves the sidebar where there is no viewport", () => {
    const served = serve();

    expect(served).toContain('data-slot="filter-panel"');
    expect(served).not.toContain('data-slot="listing-narrow-chrome"');
  });

  it("serves the sidebar whatever a narrow viewport answers", () => {
    vi.stubGlobal("window", {
      matchMedia: () => ({
        matches: false,
        addEventListener: () => {},
        removeEventListener: () => {},
      }),
    });

    expect(serve()).toContain('data-slot="filter-panel"');
  });
});
