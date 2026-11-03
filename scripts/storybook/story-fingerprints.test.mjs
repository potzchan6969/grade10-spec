import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { test } from "node:test";

import { storyFingerprints } from "./story-graph.mjs";

const BLOCK_STORY = "packages/ui/src/blocks/card/card.stories.tsx";
const PAGE_STORY = "apps/preview/src/pages/store/cart/cart.stories.tsx";

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "story-fingerprints-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const write = async (path, text) => {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), text);
  };
  await write(
    "packages/i18n/package.json",
    JSON.stringify({
      exports: { ".": "./src/index.ts", "./messages/*": "./messages/*" },
    }),
  );
  await write(
    "packages/i18n/src/index.ts",
    'import cart from "../messages/en/cart.json";\nexport const messages = { cart };\n',
  );
  await write("packages/i18n/messages/en/cart.json", '{"title":"Cart"}');
  await write(
    "packages/ui/package.json",
    JSON.stringify({ exports: { "./blocks/*": "./src/blocks/*.tsx" } }),
  );
  await write(
    "packages/ui/src/blocks/card/card.tsx",
    "export const Card = () => null;\n",
  );
  await write(
    BLOCK_STORY,
    'import { Card } from "@grade10/ui/blocks/card/card";\nexport default { component: Card };\nexport const Default = {};\n',
  );
  await write(
    PAGE_STORY,
    "export default { title: 'Store/Cart/Screens/Cart' };\nexport const Default = {};\n",
  );
  await write(
    "apps/preview/.storybook/preview.tsx",
    'import { messages } from "@grade10/i18n";\nexport default { parameters: { messages } };\n',
  );
  return { root, write };
}

test("a copy change moves every story's fingerprint, through the preview", async (t) => {
  const { root, write } = await fixture(t);
  const before = await storyFingerprints({ root });
  await write("packages/i18n/messages/en/cart.json", '{"title":"Basket"}');
  const after = await storyFingerprints({ root });
  assert.notEqual(after.get(BLOCK_STORY), before.get(BLOCK_STORY));
  assert.notEqual(after.get(PAGE_STORY), before.get(PAGE_STORY));
});

test("a block change moves only the stories that import it, through the package's exports", async (t) => {
  const { root, write } = await fixture(t);
  const before = await storyFingerprints({ root });
  await write(
    "packages/ui/src/blocks/card/card.tsx",
    "export const Card = () => 'card';\n",
  );
  const after = await storyFingerprints({ root });
  assert.notEqual(after.get(BLOCK_STORY), before.get(BLOCK_STORY));
  assert.equal(after.get(PAGE_STORY), before.get(PAGE_STORY));
});

test("the same source always makes the same fingerprint", async (t) => {
  const { root } = await fixture(t);
  assert.deepEqual(
    await storyFingerprints({ root }),
    await storyFingerprints({ root }),
  );
});
