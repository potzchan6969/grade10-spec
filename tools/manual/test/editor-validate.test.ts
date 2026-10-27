import { describe, expect, it } from "vitest";
import { buildIndex, type ManualIndex } from "../src/api/derive";
import type { PageEntry, Snapshot } from "../src/api/types";
import { draftFromSource } from "../src/editor/draft";
import { checkReferences } from "../src/editor/validate";
import { snapshotOf } from "./manual-fixture";

/** What the browser refuses before a save leaves it. Everything here is
 * proven by the snapshot alone — which is why `::story` ids are absent: the
 * browser cannot see the Storybook index. */

const PAGE = "docs/prds/products/demo/alpha.md";

function page(path: string, body: string): PageEntry {
  return { path, source: `---\ntitle: Page\n---\n\n${body}\n` };
}

function indexOf(parts: Partial<Snapshot> = {}): ManualIndex {
  return buildIndex(snapshotOf(parts));
}

function problemsFor(index: ManualIndex, body: string) {
  return checkReferences(
    index,
    draftFromSource(`---\ntitle: Page\n---\n\n${body}\n`),
  );
}

/** Every message, whatever card it landed on. */
function said(problems: Map<string, { message: string }[]>): string[] {
  return [...problems.values()].flatMap((list) =>
    list.map((problem) => problem.message),
  );
}

describe("save-time references", () => {
  it("resolves an image against the snapshot's assets", () => {
    const index = indexOf({
      pages: [page(PAGE, "Prose.")],
      assets: ["assets/shot.png"],
    });

    expect(
      said(problemsFor(index, '::image{src="assets/gone.png" alt="x"}')),
    ).toEqual(["no file `assets/gone.png` under assets/"]);
  });

  it("says nothing about images when the snapshot lists no assets", () => {
    const index = indexOf({ pages: [page(PAGE, "Prose.")], assets: [] });

    expect(
      said(problemsFor(index, '::image{src="assets/shot.png" alt="x"}')),
    ).toEqual([]);
  });
});
