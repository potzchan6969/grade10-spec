import type { ManualIndex } from "../api/derive";
import {
  type BlockProblem,
  type Draft,
  type DraftBlock,
  type DraftLeaf,
  isContainer,
  type Problems,
} from "./draft";

/**
 * What the snapshot can prove about a save, checked before it leaves the
 * browser: every image names an asset that exists. Story ids are not here —
 * the browser cannot see the Storybook index, and does not pretend to; that
 * check stays build-side.
 */

export function checkReferences(index: ManualIndex, draft: Draft): Problems {
  const problems: Problems = new Map();
  const record = (id: string, found: BlockProblem[]) => {
    if (found.length === 0) return;
    const held = problems.get(id);
    if (held) held.push(...found);
    else problems.set(id, found);
  };

  for (const leaf of leaves(draft.blocks)) {
    record(leaf.id, blockProblems(index, leaf));
  }
  return problems;
}

function* leaves(blocks: DraftBlock[]): Generator<DraftLeaf> {
  for (const block of blocks) {
    if (block.type !== "prose") yield block as DraftLeaf;
    if (isContainer(block)) yield* leaves(block.body as DraftBlock[]);
  }
}

function blockProblems(index: ManualIndex, leaf: DraftLeaf): BlockProblem[] {
  const problems: BlockProblem[] = [];
  const said = (attr: string, message: string) =>
    problems.push({ attr, message });
  const value = (attr: string) => (leaf.attrs[attr] ?? "").trim();

  switch (leaf.type) {
    case "image": {
      // A snapshot built before assets were listed proves nothing about
      // them; an empty list is silence, not an empty directory.
      const assets = index.snapshot.assets ?? [];
      const src = value("src");
      if (assets.length > 0 && !assets.includes(src)) {
        said("src", `no file \`${src}\` under assets/`);
      }
      break;
    }
    default:
      break;
  }
  return problems;
}
