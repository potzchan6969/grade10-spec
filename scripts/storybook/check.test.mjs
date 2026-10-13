import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, before, describe, it } from "node:test";
import {
  checkStories,
  citationScope,
  citedIds,
  pascalCase,
  placementErrors,
  rootOrder,
  sortRoots,
  titleCase,
} from "./check.mjs";

const story = (title, component = "") => `const meta = {
  title: "${title}",${component ? `\n  component: ${component},` : ""}
} satisfies Meta;
export default meta;
export const Default = {};
`;

function repository(files) {
  const root = mkdtempSync(join(tmpdir(), "storybook-check-"));
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["add", "."], { cwd: root });
  return root;
}

const MANUAL = {
  "docs/prds/manual.yaml": `groups:
  Grade10:
    - grade10-site/store
    - grade10-site/post-bidding
  Shared:
    - shared/auth
    - shared/ui
`,
  "docs/prds/products/grade10-site/store/cart.md": "# Cart\n",
  "docs/prds/products/shared/auth/sign-in.md": "# Sign-In\n",
};

describe("names", () => {
  it("turns slugs into the sidebar's words", () => {
    assert.equal(titleCase("post-bidding"), "Post Bidding");
    assert.equal(titleCase("kyc"), "KYC");
    assert.equal(
      pascalCase("cart-drawer.auto-discount"),
      "CartDrawerAutoDiscount",
    );
  });
});

describe("placementErrors", () => {
  const root = repository(MANUAL);
  after(() => rmSync(root, { recursive: true, force: true }));
  const place = (path, title, component) =>
    placementErrors(root, path, { title, component });

  it("accepts a screen, a flow, a part, a block and a primitive in their folders", () => {
    assert.deepEqual(
      place(
        "apps/preview/src/pages/store/cart/cart-page.stories.tsx",
        "Store/Cart/Cart/Empty",
      ),
      [],
    );
    assert.deepEqual(
      place(
        "apps/preview/src/pages/store/cart/checkout.stories.tsx",
        "Store/Cart/Flows/Checkout",
      ),
      [],
    );
    assert.deepEqual(
      place(
        "apps/preview/src/pages/store/cart/line.stories.tsx",
        "Store/Cart/Parts/CartLine",
        "CartLine",
      ),
      [],
    );
    assert.deepEqual(
      place(
        "packages/ui/src/blocks/store-cart/cart-item.stories.tsx",
        "Store/Cart/Blocks/CartItem/On Sale",
        "CartItem",
      ),
      [],
    );
    assert.deepEqual(
      place(
        "packages/ui/src/blocks/auth-sign-in/sign-in-card.stories.tsx",
        "Auth/Sign In/Blocks/SignInCard",
        "SignInCard",
      ),
      [],
    );
    assert.deepEqual(
      place(
        "packages/design-system/src/components/forms/button.stories.tsx",
        "Design System/Forms/Button",
        "Button",
      ),
      [],
    );
    assert.deepEqual(
      place(
        "apps/preview/src/prototypes/store/cart/empty.stories.tsx",
        "Store/Cart/Prototypes/Empty State",
      ),
      [],
    );
  });

  it("refuses a feature the manual has no page for", () => {
    const [error] = place(
      "apps/preview/src/pages/store/wishlist/w.stories.tsx",
      "Store/Wishlist/Wishlist",
    );
    assert.match(error, /has no manual page/);
  });

  it("refuses a story in the wrong folder for its kind", () => {
    const [error] = place(
      "apps/preview/src/pages/store/home/cart.stories.tsx",
      "Store/Cart/Cart",
    );
    assert.match(error, /lives in apps\/preview\/src\/pages\/store\/cart\//);
    const [block] = place(
      "apps/preview/src/pages/store/cart/item.stories.tsx",
      "Store/Cart/Blocks/CartItem",
      "CartItem",
    );
    assert.match(block, /lives in packages\/ui\/src\/blocks\//);
  });

  it("refuses a leaf that is not the component's name", () => {
    const [error] = place(
      "packages/ui/src/blocks/store-cart/cart-item.stories.tsx",
      "Store/Cart/Blocks/Cart Item",
      "CartItem",
    );
    assert.match(error, /name the component "CartItem" or "CartItem"/);
  });

  it("refuses a primitive outside its group, and a story outside the four roots", () => {
    const [error] = place(
      "packages/design-system/src/components/forms/button.stories.tsx",
      "Components/Button",
      "Button",
    );
    assert.match(error, /"Design System\/Forms\/<Component>"/);
    const [outside] = place(
      "apps/preview/src/store-product/detail.stories.tsx",
      "Store/Cart/Cart",
    );
    assert.match(outside, /a story lives under/);
  });
});

describe("the workbench order", () => {
  it("reads the manual's domains in its order", async () => {
    const root = repository(MANUAL);
    assert.deepEqual(await rootOrder(root), [
      "Start Here",
      "Store",
      "Post Bidding",
      "Auth",
      "Design System",
    ]);
    rmSync(root, { recursive: true, force: true });
  });

  it("finds the roots inside a storySort comparator", () => {
    assert.deepEqual(
      sortRoots(
        `storySort: (a, b) => {\n  const roots = ["Start Here", "Store"];\n  return 0;\n}`,
      ),
      ["Start Here", "Store"],
    );
  });
});

describe("cited ids", () => {
  it("finds the ways a story is cited", () => {
    const text = [
      '::story{id="store-cart-blocks-cartitem--default" title="x"}',
      "[open](https://storybook.grade10-stg.com/?path=/story/store-cart-cart--empty)",
      "`store-cart-cart--*` and `not an id` and `--flag`",
    ].join("\n");
    assert.deepEqual(
      citedIds("docs/a.md", text).map(({ id, line }) => `${line}:${id}`),
      [
        "1:store-cart-blocks-cartitem--default",
        "2:store-cart-cart--empty",
        "3:store-cart-cart--*",
      ],
    );
    const code =
      'const CART_STORY_ID =\n  "store-cart-cart--empty";\nstoryHref("store-cart-cart--filled");\nclassName="bid--fade"';
    assert.deepEqual(
      citedIds("apps/preview/src/pages/nav.ts", code).map(({ id }) => id),
      ["store-cart-cart--empty", "store-cart-cart--filled"],
    );
  });

  it("refuses in docs, specs and code, warns in active changes, reads no archive or test", () => {
    assert.equal(
      citationScope("docs/prds/products/grade10-site/store/cart.md"),
      "error",
    );
    assert.equal(
      citationScope("openspec/specs/shared/ui/store-cart/feature-tcs.md"),
      "error",
    );
    assert.equal(
      citationScope("apps/preview/src/pages/workbench-story-nav.ts"),
      "error",
    );
    assert.equal(citationScope("openspec/changes/add-x/ui-design.md"), "warn");
    assert.equal(
      citationScope("openspec/changes/archive/2026-01-01-x/ui-design.md"),
      null,
    );
    assert.equal(citationScope("scripts/storybook/check.test.mjs"), null);
    assert.equal(citationScope("tools/manual/test/fixtures/a.md"), null);
  });
});

describe("checkStories", () => {
  let root;
  before(() => {
    root = repository({
      ...MANUAL,
      "apps/preview/src/pages/store/cart/cart-page.stories.tsx":
        story("Store/Cart/Cart"),
      "apps/preview/src/pages/store/cart/cart-content.ts":
        'import { x } from "../home/home-content";\n',
      "packages/ui/src/blocks/store-cart/cart-item.stories.tsx": story(
        "Store Cart/CartItem",
        "CartItem",
      ),
      "docs/prds/products/grade10-site/store/cart.md":
        '::story{id="store-cart-cart--default"}\n::story{id="store-cart-cart--gone"}\n',
      "openspec/changes/add-x/ui-design.md": "`store-cart-cart--later`\n",
      "apps/preview/.storybook-workbench/preview.tsx":
        'storySort: (a, b) => {\n  const roots = ["Start Here", "Store", "Post Bidding", "Auth", "Design System"];\n}',
    });
  });
  after(() => rmSync(root, { recursive: true, force: true }));

  it("refuses a misplaced story, a sibling import and a missing id; warns on a change", async () => {
    const { errors, warnings } = await checkStories({ root });
    assert.deepEqual(errors, [
      '"Store Cart/CartItem" - a title reads "<Domain>/<Feature>/<Screen>"',
      "apps/preview/src/pages/store/cart/cart-content.ts - imports ../home/home-content from another feature; move what both use to the nearest folder above them",
      'docs/prds/products/grade10-site/store/cart.md:2 - no story "store-cart-cart--gone"',
    ]);
    assert.deepEqual(warnings, [
      'openspec/changes/add-x/ui-design.md:1 - no story "store-cart-cart--later"',
    ]);
  });
});
