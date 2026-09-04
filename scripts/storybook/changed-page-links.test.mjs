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
    "auction-listing-bid-panel--default": {
      id: "auction-listing-bid-panel--default",
      importPath: "./src/auction-listing/bid-panel.stories.tsx",
      name: "Default",
      title: "Auction Listing/Bid Panel",
      type: "story",
    },
    "blocks-auction-listing-card--default": {
      id: "blocks-auction-listing-card--default",
      importPath: "../packages/ui/src/blocks/auction-listing/card.stories.tsx",
      name: "Default",
      title: "Auction Listing/Bid Card",
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

async function starBarrelWorkspace() {
  return fixture({
    "apps/preview/src/pages/button.stories.tsx":
      'import { Button } from "@grade10/design-system"; export const Default = {};',
    "apps/preview/src/pages/card.stories.tsx":
      'import { Card } from "@grade10/design-system"; export const Default = {};',
    "packages/design-system/src/index.ts":
      'export * from "./components/button"; export * from "./components/card";',
    "packages/design-system/src/components/button.tsx":
      "export const Button = {};",
    "packages/design-system/src/components/card.tsx": "export const Card = {};",
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

test("does not treat a workspace barrel rewrite as affecting every page", async () => {
  const root = await workspace();

  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["packages/ui/src/index.ts"],
      root,
    }),
    [],
  );
  assert.deepEqual(
    await affectedPageStories({
      changedFiles: [
        "packages/ui/src/index.ts",
        "packages/ui/src/blocks/store.tsx",
      ],
      root,
    }),
    ["apps/preview/src/pages/store.stories.tsx"],
  );
});

test("follows only the requested export through a star barrel", async () => {
  const root = await starBarrelWorkspace();

  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["packages/design-system/src/components/button.tsx"],
      root,
    }),
    ["apps/preview/src/pages/button.stories.tsx"],
  );
  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["packages/design-system/src/components/card.tsx"],
      root,
    }),
    ["apps/preview/src/pages/card.stories.tsx"],
  );
});

test("does not treat package or vite config as affecting every page", async () => {
  const root = await workspace();

  assert.deepEqual(
    await affectedPageStories({
      changedFiles: [
        "package.json",
        "apps/preview/package.json",
        "apps/preview/vite.config.ts",
      ],
      root,
    }),
    [],
  );
});

test("includes workbench stories outside Pages/", async () => {
  const root = await workspace();
  const bidPanel = join(
    root,
    "apps/preview/src/auction-listing/bid-panel.stories.tsx",
  );
  const card = join(
    root,
    "packages/ui/src/blocks/auction-listing/card.stories.tsx",
  );
  await mkdir(join(bidPanel, ".."), { recursive: true });
  await mkdir(join(card, ".."), { recursive: true });
  await writeFile(
    bidPanel,
    'import { Profile } from "@grade10/ui"; export const Default = {};',
  );
  await writeFile(card, "export const Default = {};");

  assert.deepEqual(
    await affectedPageStories({
      changedFiles: ["packages/ui/src/blocks/profile.tsx"],
      root,
    }),
    [
      "apps/preview/src/auction-listing/bid-panel.stories.tsx",
      "apps/preview/src/pages/profile.stories.tsx",
    ],
  );
  assert.deepEqual(
    await affectedPageStories({
      changedFiles: [
        "apps/preview/src/auction-listing/bid-panel.stories.tsx",
        "packages/ui/src/blocks/auction-listing/card.stories.tsx",
      ],
      root,
    }),
    [
      "apps/preview/src/auction-listing/bid-panel.stories.tsx",
      "packages/ui/src/blocks/auction-listing/card.stories.tsx",
    ],
  );
});

test("groups current affected page states by story file", () => {
  const payload = slackPayload({
    affectedPages: ["apps/preview/src/pages/store.stories.tsx"],
    commitSha: "abc",
    commitUrl: "https://github.com/9gag/grade10-spec/commit/abc",
    index: INDEX,
    changedPaths: new Map([
      ["apps/preview/src/pages/store.stories.tsx", "M"],
      ["apps/preview/src/pages/profile.stories.tsx", "A"],
    ]),
    mergedPrTitle: "feat(store): add product list",
    mergedPrUrl: "https://github.com/9gag/grade10-spec/pull/123",
    removedStories: [
      {
        name: "Countdown",
        status: "❌",
        title: "Auction Listing/Bid Panel/Flows",
      },
    ],
    storybookUrl: "https://storybook.grade10-stg.com",
  });

  assert.deepEqual(payload, {
    blocks: [
      {
        text: {
          text: ":art: Storybook deployed",
          type: "mrkdwn",
        },
        type: "section",
      },
      {
        text: {
          text: `- Auction Listing\n${"\u00a0".repeat(4)}- Bid Panel > Flows — 1 story ❌\n- Pages\n${"\u00a0".repeat(4)}- <https://storybook.grade10-stg.com/?path=/story/pages-store--default|Store> — 2 stories`,
          type: "mrkdwn",
        },
        type: "section",
      },
      {
        elements: [
          {
            text: "PR merged → <https://github.com/9gag/grade10-spec/pull/123|feat(store): add product list> (<https://github.com/9gag/grade10-spec/commit/abc|abc>)",
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
      text: `- Pages\n${"\u00a0".repeat(4)}- <https://storybook.grade10-stg.com/?path=/story/pages-store--default|Store> — 2 stories`,
      type: "mrkdwn",
    },
    type: "section",
  });
});

test("links added workbench stories outside Pages/", () => {
  const payload = slackPayload({
    affectedPages: [
      "apps/preview/src/auction-listing/bid-panel.stories.tsx",
      "packages/ui/src/blocks/auction-listing/card.stories.tsx",
    ],
    changedPaths: new Map([
      ["apps/preview/src/auction-listing/bid-panel.stories.tsx", "A"],
      ["packages/ui/src/blocks/auction-listing/card.stories.tsx", "A"],
    ]),
    index: INDEX,
    storybookUrl: "https://storybook.grade10-stg.com",
  });

  assert.deepEqual(payload.blocks.at(-1), {
    text: {
      text: `- Auction Listing\n${"\u00a0".repeat(4)}- <https://storybook.grade10-stg.com/?path=/story/blocks-auction-listing-card--default|Bid Card> — 1 story 🆕\n${"\u00a0".repeat(4)}- <https://storybook.grade10-stg.com/?path=/story/auction-listing-bid-panel--default|Bid Panel> — 1 story 🆕`,
      type: "mrkdwn",
    },
    type: "section",
  });
});
