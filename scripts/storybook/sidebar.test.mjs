import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, describe, it } from "node:test";
import { renderSidebar, sidebar, sortedPreview } from "./sidebar.mjs";

function repository(files) {
  const root = mkdtempSync(join(tmpdir(), "storybook-sidebar-"));
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}

const page = (title, order) =>
  `---\ntitle: ${title}\n${order === undefined ? "" : `order: ${order}\n`}---\n`;

describe("sidebar", () => {
  const root = repository({
    "docs/prds/manual.yaml": `groups:
  Grade10:
    - grade10-site/store
    - grade10-site/post-bidding
`,
    "docs/prds/products/grade10-site/store/index.md": page("Store"),
    "docs/prds/products/grade10-site/store/home.md": page("Home", 2),
    "docs/prds/products/grade10-site/store/cart.md": page("Cart", 1),
    "docs/prds/products/grade10-site/store/wishlist.md": page("Wishlist"),
    "docs/prds/products/grade10-site/store/cross-sell.md": page(
      "Cross-Sell",
      3,
    ),
    "docs/prds/products/grade10-site/store/store-locator.md": page(
      "Branches",
      3,
    ),
    "docs/prds/products/grade10-site/account/sign-in.md": page("Sign-In", 1),
  });
  after(() => rmSync(root, { recursive: true, force: true }));

  it("reads the manual's domains, each with its features by order: then page title, and leaves out a domain manual.yaml does not list", () => {
    assert.deepEqual(sidebar(root), {
      "Start Here": [],
      Store: ["Cart", "Home", "Store Locator", "Cross Sell", "Wishlist"],
      "Post Bidding": [],
      "Design System": [],
    });
  });

  it("rewrites only the generated statement, and again to the same text", () => {
    const preview = `const x = 1;\nstorySort: (a, b) => {\n${renderSidebar({ Old: ["Gone"] }, "    ")}\n    return 0;\n};\n`;
    const sorted = sortedPreview(preview, root);
    assert.equal(
      sorted,
      `const x = 1;\nstorySort: (a, b) => {\n${renderSidebar(sidebar(root), "    ")}\n    return 0;\n};\n`,
    );
    assert.equal(sortedPreview(sorted, root), sorted);
  });

  it("returns null for a preview with no generated statement", () => {
    assert.equal(sortedPreview("storySort: (a, b) => 0", root), null);
  });
});
