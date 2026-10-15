import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { after, describe, it } from "node:test";
import { coverageErrors, journeyErrors } from "./check.mjs";
import {
  featureCoverage,
  journeyCoverage,
  manualFeatures,
  scenarioSettings,
} from "./coverage.mjs";
import { readJourneys } from "./journeys.mjs";
import { storyIndex } from "./story-index.mjs";

function repository(files) {
  const root = mkdtempSync(join(tmpdir(), "storybook-coverage-"));
  for (const [path, text] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  }
  return root;
}

const journey = (id, role, title = "Does a thing") =>
  `### ${id}: ${title}\n\n**As a** ${role},\n**I want** it,\n**so that** done.\n\n`;

const flow = (title, journeys) => `const meta = {
  title: "${title}",
  parameters: { layout: "fullscreen"${journeys ? `, journeys: ${JSON.stringify(journeys)}` : ""} },
} satisfies Meta;
export default meta;
export const Default = {};
`;

const STORE = {
  "docs/prds/products/grade10-site/store/index.md": "# Store\n",
  "docs/prds/products/grade10-site/store/cart.md": "# Cart\n",
  "docs/prds/products/grade10-site/store/shipping.md": "# Shipping\n",
  "docs/prds/products/grade10-site/store/home.md": "# Home\n",
  "docs/prds/products/shared/auth/sign-in.md": "# Sign-In\n",
  "openspec/specs/grade10-site/store/cart-drawer/user-journeys.md": `## User journeys\n\n${journey("grade10-site-store-cart-drawer-US-01", "collector")}${journey("grade10-site-store-cart-drawer-US-02", "member of shop staff")}${journey("grade10-site-store-cart-drawer-US-03", "winner or operator")}`,
  "openspec/specs/grade10-site/store/policy/user-journeys.md":
    "## User journeys\n\n**Walked by:** nobody on their own - a policy.\n",
  "openspec/changes/add-thing/specs/grade10-site/store/cart-drawer/user-journeys.md": `## User journeys\n\n${journey("grade10-site-store-cart-drawer-US-09", "collector")}`,
  "apps/preview/coverage.yaml": "no-screen:\n  store/shipping: Shopify's\n",
  "apps/preview/src/pages/store/cart/cart-flows.stories.tsx": flow(
    "Store/Cart/Flows/Edit",
    ["grade10-site-store-cart-drawer-US-01"],
  ),
  "apps/preview/src/pages/store/cart/cart.stories.tsx": flow(
    "Store/Cart/Screens/Cart Drawer",
  ),
};

describe("readJourneys", () => {
  const root = repository(STORE);
  after(() => rmSync(root, { recursive: true, force: true }));

  it("reads ids, roles and where each lives", () => {
    const { journeys, capabilities } = readJourneys(root);
    assert.equal(
      journeys.get("grade10-site-store-cart-drawer-US-01").collector,
      true,
    );
    assert.equal(
      journeys.get("grade10-site-store-cart-drawer-US-02").collector,
      false,
    );
    assert.equal(
      journeys.get("grade10-site-store-cart-drawer-US-03").collector,
      true,
    );
    assert.equal(
      journeys.get("grade10-site-store-cart-drawer-US-09").durable,
      false,
    );
    assert.equal(capabilities.get("grade10-site/store/policy").nobody, true);
  });
});

describe("coverage", () => {
  const root = repository(STORE);
  after(() => rmSync(root, { recursive: true, force: true }));

  it("lists every feature page, not the domain's index", () => {
    assert.deepEqual(
      manualFeatures(root).map((feature) => feature.key),
      ["store/cart", "store/home", "store/shipping", "auth/sign-in"],
    );
  });

  it("counts kinds and says what a feature owes", () => {
    const rows = Object.fromEntries(
      featureCoverage(root).map((row) => [row.key, row]),
    );
    assert.equal(rows["store/cart"].counts.Screens, 1);
    assert.equal(rows["store/cart"].counts.Flows, 1);
    assert.equal(rows["store/cart"].status, "");
    assert.equal(rows["store/shipping"].status, "no screen - Shopify's");
    assert.match(rows["store/home"].status, /^missing/);
  });

  it("counts collector journeys walked, leaving out staff and nobody", () => {
    assert.deepEqual(journeyCoverage(root), [
      {
        capability: "grade10-site/store/cart-drawer",
        held: 2,
        walked: ["grade10-site-store-cart-drawer-US-01"],
        open: ["grade10-site-store-cart-drawer-US-03"],
      },
    ]);
  });
});

describe("journeyErrors", () => {
  it("refuses a flow with no journeys and an id nobody wrote; warns on a change's", () => {
    const root = repository({
      ...STORE,
      "apps/preview/src/pages/store/cart/cart-flows.stories.tsx": flow(
        "Store/Cart/Flows/Edit",
        [
          "grade10-site-store-cart-drawer-US-99",
          "grade10-site-store-cart-drawer-US-09",
        ],
      ),
      "apps/preview/src/pages/store/cart/bare-flows.stories.tsx": flow(
        "Store/Cart/Flows/Bare",
      ),
    });
    after(() => rmSync(root, { recursive: true, force: true }));
    const { errors, warnings } = journeyErrors(
      root,
      storyIndex({ root }).files,
    );
    assert.equal(errors.length, 2);
    assert.match(errors.join("\n"), /Flows\/Bare" - a flow names the journeys/);
    assert.match(
      errors.join("\n"),
      /no journey "grade10-site-store-cart-drawer-US-99"/,
    );
    assert.match(
      warnings.join("\n"),
      /US-09" is only in openspec\/changes\/add-thing/,
    );
  });
});

describe("coverageErrors", () => {
  it("refuses a declared key that is no feature and warns on a feature with nothing to look at", () => {
    const root = repository({
      ...STORE,
      "apps/preview/coverage.yaml":
        "no-screen:\n  store/shipping: Shopify's\noperator:\n  store/console: gone\n",
    });
    after(() => rmSync(root, { recursive: true, force: true }));
    const { errors, warnings } = coverageErrors(root, storyIndex({ root }));
    assert.deepEqual(errors, [
      'apps/preview/coverage.yaml - operator "store/console" is no feature; use <domain>/<page> under docs/prds/products/grade10-site/ or shared/auth/',
    ]);
    assert.match(warnings.join("\n"), /Store\/Home - no Screens or Prototypes/);
    assert.match(
      warnings.join("\n"),
      /Auth\/Sign In - no Screens or Prototypes/,
    );
  });
});

describe("scenarioSettings", () => {
  it("lists each Scenario's settings and its presets", () => {
    const index = {
      files: {
        a: {
          title: "Store/Cart/Screens/Cart Drawer/Scenario",
          tags: ["scenario"],
          settings: ["code", "points"],
          stories: [{}, {}],
        },
        b: { title: "Store/Cart/Screens/Cart", settings: [], stories: [{}] },
      },
    };
    assert.deepEqual(scenarioSettings(index), [
      {
        title: "Store/Cart/Screens/Cart Drawer/Scenario",
        settings: ["code", "points"],
        presets: 2,
      },
    ]);
  });
});
