import { describe, expect, it } from "vitest";
import { buildIndex, type ManualIndex } from "../src/api/derive";
import type {
  ChangeEntry,
  PageEntry,
  Snapshot,
  SpecEntry,
} from "../src/api/types";
import { draftFromSource } from "../src/editor/draft";
import { checkReferences } from "../src/editor/validate";
import { snapshotOf } from "./manual-fixture";

/** What the browser refuses before a save leaves it. Everything here is
 * proven by the snapshot alone — which is why `::story` ids are absent: the
 * browser cannot see the Storybook index. */

const PAGE = "docs/prds/products/demo/alpha.md";
const _OTHER = "docs/prds/products/demo/beta.md";

const ALPHA: SpecEntry = {
  id: "demo/alpha",
  title: "Alpha",
  purpose: "",
  requirements: [
    {
      name: "Points are earned",
      text: "",
      scenarios: [{ id: "alpha-SC-01", name: "earning", text: "" }],
    },
  ],
  journeys: [{ id: "alpha-US-01", title: "Earn points", text: "" }],
};

const CHANGING: ChangeEntry = {
  id: "add-gamma",
  schema: "grade10-planning",
  status: "in-flight",
  owners: [],
  created: "2026-01-01",
  title: "Add gamma",
  why: "",
  taskGroups: [],
  deltas: [{ spec: "demo/gamma", kinds: ["ADDED"], requirements: [] }],
};

function page(path: string, body: string, spec?: string): PageEntry {
  const head = spec ? `title: Page\nspec: ${spec}\n` : "title: Page\n";
  return { path, source: `---\n${head}---\n\n${body}\n` };
}

function indexOf(parts: Partial<Snapshot> = {}): ManualIndex {
  return buildIndex(
    snapshotOf({ specs: [ALPHA], changes: [CHANGING], ...parts }),
  );
}

function problemsFor(
  index: ManualIndex,
  body: string,
  spec?: string,
  path = PAGE,
) {
  const head = spec ? `title: Page\nspec: ${spec}\n` : "title: Page\n";
  return checkReferences(
    index,
    path,
    draftFromSource(`---\n${head}---\n\n${body}\n`),
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
