import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { describe, it } from "node:test";
import { pathToFileURL } from "node:url";
import {
  importPath,
  parseStoryFile,
  rootDirectory,
  sanitize,
  storyIndex,
  storyNameFromExport,
  toId,
} from "./story-index.mjs";

const preview = join(rootDirectory, "apps/preview");
const csfEntry = (() => {
  try {
    return createRequire(join(preview, "package.json")).resolve(
      "storybook/internal/csf",
    );
  } catch {
    return null;
  }
})();

describe("story ids", () => {
  it("names a story from its export the way Storybook does", () => {
    assert.equal(
      storyNameFromExport("NoSlotsThisMonth"),
      "No Slots This Month",
    );
    assert.equal(storyNameFromExport("Step2Payment"), "Step 2 Payment");
    assert.equal(
      toId("Appointment/Booking/Book Visit", "No Slots This Month"),
      "appointment-booking-book-visit--no-slots-this-month",
    );
    assert.equal(
      sanitize("Auction & Store/Account menu"),
      "auction-store-account-menu",
    );
  });

  it("agrees with Storybook's own helpers", {
    skip: !csfEntry && "storybook is not installed",
  }, async () => {
    const csf = await import(pathToFileURL(csfEntry).href);
    for (const name of [
      "Default",
      "ClosedWon_PaymentDue",
      "Step2Payment",
      "XLarge",
    ]) {
      assert.equal(storyNameFromExport(name), csf.storyNameFromExport(name));
    }
    for (const title of [
      "Site/Page Shell/Blocks/SiteHeader/Auction & Store",
      "Design System/Forms/Button",
    ]) {
      assert.equal(toId(title, "Docs"), csf.toId(title, "Docs"));
    }
  });
});

describe("parseStoryFile", () => {
  const text = `import type { Meta, StoryObj } from "@storybook/react-vite";
const meta = {
  title: "Store/Cart/Blocks/CartItem",
  component: CartItem,
  tags: ["autodocs"],
} satisfies Meta<typeof CartItem>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const OnSale: Story = { name: "On sale" };
`;

  it("reads the title, its span, the component, the tags, the stories and their journeys", () => {
    const file = parseStoryFile("cart-item.stories.tsx", text);
    assert.equal(file.title, "Store/Cart/Blocks/CartItem");
    assert.equal(
      text.slice(file.titleSpan.start, file.titleSpan.end),
      '"Store/Cart/Blocks/CartItem"',
    );
    assert.equal(file.component, "CartItem");
    assert.deepEqual(file.tags, ["autodocs"]);
    assert.deepEqual(file.journeys, []);
    assert.deepEqual(file.stories, [
      { exportName: "Default", name: "Default", journeys: [] },
      { exportName: "OnSale", name: "On sale", journeys: [] },
    ]);
  });

  it("reads the journeys a flow names on its meta and its stories", () => {
    const file = parseStoryFile(
      "cart-flows.stories.tsx",
      `const meta = {
  title: "Store/Cart/Flows/Edit",
  parameters: { layout: "fullscreen", journeys: ["a-US-01"] },
} satisfies Meta;
export default meta;
export const Remove: Story = { parameters: { journeys: ["a-US-02"] } };
`,
    );
    assert.deepEqual(file.journeys, ["a-US-01"]);
    assert.deepEqual(file.stories[0].journeys, ["a-US-02"]);
  });

  it("reports a file the workbench serves at its index path", () => {
    assert.equal(
      importPath("apps/preview/src/pages/store/cart/cart.stories.tsx"),
      "./src/pages/store/cart/cart.stories.tsx",
    );
    assert.equal(
      importPath("packages/ui/src/blocks/store-cart/cart-item.stories.tsx"),
      "../../packages/ui/src/blocks/store-cart/cart-item.stories.tsx",
    );
  });
});

describe("storyIndex", () => {
  const built = join(preview, "storybook-static/index.json");

  it("holds the same entries as a built workbench index", {
    // A build left from an earlier checkout would be stale, so this runs
    // only when asked, right after `pnpm storybook:build:workbench`.
    skip:
      (!process.env.STORY_INDEX_PARITY && "set STORY_INDEX_PARITY=1") ||
      (!existsSync(built) && "no workbench build"),
  }, () => {
    const want = JSON.parse(readFileSync(built, "utf8")).entries;
    const { entries } = storyIndex();
    assert.deepEqual(Object.keys(entries).sort(), Object.keys(want).sort());
    for (const [id, entry] of Object.entries(want)) {
      assert.equal(entries[id].title, entry.title, id);
      assert.equal(entries[id].importPath, entry.importPath, id);
      assert.equal(entries[id].type, entry.type, id);
    }
  });
});
