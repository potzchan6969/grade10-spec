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
  settingsErrors,
  titleCase,
} from "./check.mjs";
import { renderSidebar } from "./sidebar.mjs";

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
  "docs/prds/products/grade10-site/account/sign-in.md": "# Sign-In\n",
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

  it("accepts a screen, a part, a block and a primitive in their folders", () => {
    assert.deepEqual(
      place(
        "apps/preview/src/pages/store/cart/cart-page.stories.tsx",
        "Store/Cart/Screens/Cart/Empty",
      ),
      [],
    );
    assert.match(
      place(
        "apps/preview/src/pages/store/cart/checkout.stories.tsx",
        "Store/Cart/Flows/Checkout",
      )[0],
      /sits under Screens/,
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
        "Account/Sign In/Blocks/SignInCard",
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

  it("places a domain's flows in one file under its domain", () => {
    assert.deepEqual(
      place(
        "apps/preview/src/pages/store/flows/store-flows.stories.tsx",
        "Store/Flows",
      ),
      [],
    );
    assert.deepEqual(
      place(
        "apps/preview/src/pages/store/cart/checkout.stories.tsx",
        "Store/Flows",
      ),
      [
        '"Store/Flows" - a flow lives in apps/preview/src/pages/store/flows/, not apps/preview/src/pages/store/cart/checkout.stories.tsx',
      ],
    );
    assert.deepEqual(
      place(
        "apps/preview/src/pages/garden/flows/x.stories.tsx",
        "Garden/Flows",
      ),
      [
        `"Garden/Flows" - "Garden" is no manual domain; a domain's flows are titled "<Domain>/Flows"`,
      ],
    );
    assert.deepEqual(
      place(
        "apps/preview/src/pages/store/flows/x.stories.tsx",
        "Store/Flows/Guest",
      ),
      [
        `"Store/Flows/Guest" - a domain's flows are one file titled "Store/Flows", one story per flow`,
      ],
    );
  });

  it("refuses a screen outside Screens", () => {
    assert.deepEqual(
      place(
        "apps/preview/src/pages/store/cart/cart-page.stories.tsx",
        "Store/Cart/Cart/Empty",
      ),
      [
        '"Store/Cart/Cart/Empty" - a screen sits under Screens: "Store/Cart/Screens/Cart/Empty"',
      ],
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
      "Store/Cart/Screens/Cart",
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
      'const CART_STORY_ID =\n  "store-cart-screens-cart--empty";\nstoryHref("store-cart-screens-cart--filled");\nflowStep("Pay", "pay",\n  "store-cart-screens-cart--paying");\nclassName="bid--fade"';
    assert.deepEqual(
      citedIds("apps/preview/src/pages/nav.ts", code).map(({ id }) => id),
      [
        "store-cart-screens-cart--empty",
        "store-cart-screens-cart--filled",
        "store-cart-screens-cart--paying",
      ],
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
      "apps/preview/src/pages/store/cart/cart-page.stories.tsx": story(
        "Store/Cart/Screens/Cart",
      ),
      "apps/preview/src/pages/store/cart/cart-content.ts":
        'import { x } from "../home/home-content";\n',
      "packages/ui/src/blocks/store-cart/cart-item.stories.tsx": story(
        "Store Cart/CartItem",
        "CartItem",
      ),
      "docs/prds/products/grade10-site/store/cart.md":
        '::story{id="store-cart-screens-cart--default"}\n::story{id="store-cart-screens-cart--gone"}\n',
      "openspec/changes/add-x/ui-design.md": "`store-cart-cart--later`\n",
      "apps/preview/.storybook-workbench/preview.tsx": `storySort: (a, b) => {\n${renderSidebar(
        {
          "Start Here": [],
          Store: ["Cart"],
          "Post Bidding": [],
          "Design System": [],
        },
        "  ",
      )}\n}`,
    });
  });
  after(() => rmSync(root, { recursive: true, force: true }));

  it("refuses a misplaced story, a sibling import and a missing id; warns on a change", async () => {
    const { errors, warnings } = await checkStories({ root });
    assert.deepEqual(errors, [
      '"Store Cart/CartItem" - a title reads "<Domain>/<Feature>/Screens/<Screen>"',
      "apps/preview/src/pages/store/cart/cart-content.ts - imports ../home/home-content from another feature; move what both use to the nearest folder above them",
      'docs/prds/products/grade10-site/store/cart.md:2 - no story "store-cart-screens-cart--gone"',
    ]);
    assert.deepEqual(warnings, [
      "Account/Sign In - no Screens or Prototypes; draw them, or say why in apps/preview/coverage.yaml",
      'openspec/changes/add-x/ui-design.md:1 - no story "store-cart-cart--later"',
    ]);
  });

  it("refuses a sidebar that is not the manual's", async () => {
    const stale = repository({
      ...MANUAL,
      "apps/preview/.storybook-workbench/preview.tsx": `storySort: (a, b) => {\n${renderSidebar({ "Start Here": [], Store: ["Cart"] }, "  ")}\n}`,
    });
    const { errors } = await checkStories({ root: stale });
    assert.deepEqual(errors, [
      "apps/preview/.storybook-workbench/preview.tsx - storySort's sidebar is not the manual's; run pnpm storybook:sort",
    ]);
    rmSync(stale, { recursive: true, force: true });
  });
});

describe("flows in checkStories", () => {
  it("refuses a flow that names no journey or walks another domain's screens", async () => {
    const root = repository({
      ...MANUAL,
      "apps/preview/src/pages/store/flows/store-flows.stories.tsx": `import { Cart } from "../cart/cart-page.stories";
import { Lot } from "../../auction/display/lot.stories";
${story("Store/Flows")}`,
      "apps/preview/src/pages/store/cart/cart-page.stories.tsx": story(
        "Store/Cart/Screens/Cart",
      ),
      "apps/preview/.storybook-workbench/preview.tsx": `storySort: (a, b) => {\n${renderSidebar(
        {
          "Start Here": [],
          Store: ["Cart"],
          "Post Bidding": [],
          "Design System": [],
        },
        "  ",
      )}\n}`,
    });
    const { errors } = await checkStories({ root });
    rmSync(root, { recursive: true, force: true });
    assert.ok(
      errors.includes(
        "apps/preview/src/pages/store/flows/store-flows.stories.tsx - a flow walks its own domain's screens, not ../../auction/display/lot.stories",
      ),
      errors.join("\n"),
    );
    assert.ok(
      errors.some((error) =>
        error.startsWith('"Store/Flows" - a flow names the journeys it walks'),
      ),
      errors.join("\n"),
    );
    assert.ok(
      !errors.some((error) => error.includes("../cart/cart-page.stories")),
      errors.join("\n"),
    );
    assert.ok(
      errors.includes(
        'apps/preview/src/pages/store/flows/store-flows.stories.tsx - "Default" has no verification caseId; run pnpm storybook:case-ids --write',
      ),
      errors.join("\n"),
    );
  });
});

describe("settingsErrors", () => {
  const root = repository({
    "openspec/specs/grade10-site/store/discounts/spec.md":
      "### Requirement: A draft order carries at most one discount code\n",
  });
  after(() => rmSync(root, { recursive: true, force: true }));
  const scenario = (file) => ({
    "cart.scenario.stories.tsx": {
      title: "Store/Cart/Screens/Cart Drawer/Scenario",
      tags: ["scenario"],
      settings: [],
      rules: {},
      stories: [],
      ...file,
    },
  });

  it("refuses a Scenario with no settings, and reads no other story", () => {
    assert.match(
      settingsErrors(root, scenario({})).errors[0],
      /holds settings/,
    );
    assert.deepEqual(settingsErrors(root, scenario({ tags: [] })), {
      errors: [],
      warnings: [],
    });
  });

  it("holds each rule to a setting and a requirement that exists", () => {
    const rule =
      "grade10-site/store/discounts: A draft order carries at most one discount code";
    assert.deepEqual(
      settingsErrors(
        root,
        scenario({ settings: ["code"], rules: { code: rule } }),
      ),
      { errors: [], warnings: [] },
    );
    const { errors } = settingsErrors(
      root,
      scenario({
        settings: ["code"],
        rules: { points: rule },
        stories: [
          {
            exportName: "Scenario",
            rules: { code: "grade10-site/store/discounts: Not a requirement" },
          },
          { exportName: "Scenario", rules: { code: "no colon" } },
        ],
      }),
    );
    assert.equal(errors.length, 3);
    assert.match(errors[0], /"points", which is no setting/);
    assert.match(errors[1], /no requirement "Not a requirement"/);
    assert.match(errors[2], /reads "<capability>: <requirement title>"/);
  });

  it("refuses a story beside Scenario; its settings reach every case", () => {
    const { errors } = settingsErrors(
      root,
      scenario({
        settings: ["code"],
        stories: [
          { exportName: "Scenario", name: "Scenario" },
          { exportName: "CodeRefused", name: "Code refused" },
        ],
      }),
    );
    assert.deepEqual(errors, [
      "cart.scenario.stories.tsx - a Scenario holds one story, Scenario; its settings reach every case, not Code refused",
    ]);
  });
});
