import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { affectedPageStories, slackPayload } from "./changed-page-links.mjs";

async function fixture(files) {
  const root = await mkdtemp(join(tmpdir(), "storybook-links-"));

  await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
      const file = join(root, path);
      await mkdir(join(file, ".."), { recursive: true });
      await writeFile(file, content);
    }),
  );
  return root;
}

const INDEX = {
  entries: {
    "pages-store--default": {
      id: "pages-store--default",
      importPath: "./src/pages/store.stories.tsx",
      name: "Default",
      title: "Pages/Store",
      type: "story",
    },
    "pages-store--empty": {
      id: "pages-store--empty",
      importPath: "./src/pages/store.stories.tsx",
      name: "Empty",
      title: "Pages/Store",
      type: "story",
    },
    "pages-profile--default": {
      id: "pages-profile--default",
      importPath: "./src/pages/profile.stories.tsx",
      name: "Default",
      title: "Pages/Profile",
      type: "story",
    },
  },
};

async function workspace() {
  return fixture({
    "apps/preview/src/pages/store.stories.tsx":
      'import { Store } from "@grade10/ui"; export const Default = {}; export const Empty = {};',
    "apps/preview/src/pages/profile.stories.tsx":
      'import { Profile } from "@grade10/ui"; export const Default = {};',
    "packages/ui/src/index.ts":
      'export { Store } from "./blocks/store"; export { Profile } from "./blocks/profile";',
    "packages/ui/src/blocks/store.tsx":
      'import { Card } from "@grade10/design-system/components/card"; new URL("./store.png", import.meta.url); export const Store = Card;',
    "packages/ui/src/blocks/profile.tsx": "export const Profile = {};",
    "packages/ui/src/blocks/store.png": "image",
    "packages/design-system/src/components/card.tsx": "export const Card = {};",
    "apps/preview/.storybook/preview.tsx": "export default {};",
  });
}

test("finds pages through selected workspace exports and their dependencies", async () => {
  const root = await workspace();

  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["packages/design-system/src/components/card.tsx"],
      root,
    }),
    ["apps/preview/src/pages/store.stories.tsx"],
  );
  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["packages/ui/src/blocks/store.png"],
      root,
    }),
    ["apps/preview/src/pages/store.stories.tsx"],
  );
  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["packages/ui/src/blocks/unused.tsx"],
      root,
    }),
    [],
  );
  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["packages/ui/src/blocks/profile.tsx"],
      root,
    }),
    ["apps/preview/src/pages/profile.stories.tsx"],
  );
  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["apps/preview/src/pages/store.stories.tsx"],
      root,
    }),
    ["apps/preview/src/pages/store.stories.tsx"],
  );
});

test("treats workbench configuration as affecting every page", async () => {
  const root = await workspace();

  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["apps/preview/.storybook/preview.tsx"],
      root,
    }),
    [
      "apps/preview/src/pages/profile.stories.tsx",
      "apps/preview/src/pages/store.stories.tsx",
    ],
  );
});

test("creates a compact payload containing current affected page states only", () => {
  const payload = slackPayload({
    affectedPages: ["apps/preview/src/pages/store.stories.tsx"],
    commitSha: "abc",
    commitUrl: "https://github.com/9gag/grade10-spec/commit/abc",
    index: INDEX,
    changedPaths: new Map([
      ["apps/preview/src/pages/store.stories.tsx", "M"],
      ["apps/preview/src/pages/profile.stories.tsx", "A"],
    ]),
    mergedBranchName: "feat/product-list",
    mergedBranchUrl:
      "https://github.com/9gag/grade10-spec/compare/main...feat/product-list",
    mergedPrTitle: "feat(store): add product list",
    mergedPrUrl: "https://github.com/9gag/grade10-spec/pull/123",
    removedStories: [
      {
        name: "Countdown",
        status: "❌",
        title: "Auction Listing/ListingBidPanel/Flows",
      },
    ],
    storybookUrl: "https://storybook.grade10-stg.com",
  });

  assert.deepEqual(payload, {
    blocks: [
      {
        text: {
          text: ":art: Storybook deployed · <https://github.com/9gag/grade10-spec/commit/abc|abc> · <https://github.com/9gag/grade10-spec/pull/123|feat(store): add product list>",
          type: "mrkdwn",
        },
        type: "section",
      },
      {
        text: {
          text: "• Auction Listing\n  • ❌ ListingBidPanel > Flows > Countdown\n• Pages\n  • 🟡 <https://storybook.grade10-stg.com/iframe.html?id=pages-store--default&viewMode=story|Store > Default>\n  • 🟡 <https://storybook.grade10-stg.com/iframe.html?id=pages-store--empty&viewMode=story|Store > Empty>",
          type: "mrkdwn",
        },
        type: "section",
      },
      {
        elements: [
          {
            text: "<https://github.com/9gag/grade10-spec/compare/main...feat/product-list|feat/product-list> → main",
            type: "mrkdwn",
          },
        ],
        type: "context",
      },
    ],
  });
});

test("omits merge metadata when it is unavailable", () => {
  const payload = slackPayload({
    affectedPages: ["apps/preview/src/pages/store.stories.tsx"],
    index: INDEX,
    storybookUrl: "https://storybook.grade10-stg.com",
  });

  assert.deepEqual(payload.blocks.at(-1), {
    text: {
      text: "• Pages\n  • 🟡 <https://storybook.grade10-stg.com/iframe.html?id=pages-store--default&viewMode=story|Store > Default>\n  • 🟡 <https://storybook.grade10-stg.com/iframe.html?id=pages-store--empty&viewMode=story|Store > Empty>",
      type: "mrkdwn",
    },
    type: "section",
  });
});
