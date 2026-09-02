import type { ManualIndex } from "../api/derive";
import { findRequirement } from "../api/requirements";
import type { PageAst } from "../content/grammar";
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
 * browser: every spec, journey, case and change id resolves, every image
 * names an asset that exists, and no save drops the last page a durable spec
 * is shown on. Story ids are not here — the browser cannot see the Storybook
 * index, and does not pretend to; that check stays build-side.
 */

/** Page-level problems live under this key, beside the block ids. */
export const REFERENCE_ID = "references";

export function checkReferences(
  index: ManualIndex,
  path: string,
  draft: Draft,
): Problems {
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
  record(REFERENCE_ID, orphanedSpecs(index, path, draft));
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
    case "spec": {
      const spec = index.specById.get(value("id"));
      if (!spec) {
        said("id", `no spec \`${value("id")}\` in the store`);
        break;
      }
      const requirement = value("requirement");
      if (requirement && !findRequirement(spec.requirements, requirement)) {
        said("requirement", `${spec.id} has no requirement \`${requirement}\``);
      }
      const scenario = value("scenario");
      if (scenario && !scenarioIds(spec).has(scenario)) {
        said("scenario", `${spec.id} issues no scenario \`${scenario}\``);
      }
      const story = value("story");
      if (story && !journeyIds(spec).has(story)) {
        said("story", `${spec.id} issues no story \`${story}\``);
      }
      break;
    }
    case "journeys":
    case "cases": {
      if (!index.specById.has(value("id"))) {
        said("id", `no spec \`${value("id")}\` in the store`);
      }
      break;
    }
    case "changes": {
      // A ribbon may point at a capability an in-flight change is still
      // introducing, so a delta resolves it as well as a durable spec.
      const spec = value("spec");
      if (!index.specById.has(spec) && !index.changesBySpec.has(spec)) {
        said("spec", `no spec \`${spec}\` and no in-flight change touching it`);
      }
      break;
    }
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

/** Every durable spec is shown by at least one page, and this save must not
 * be what ends that. Only specs this page carries today are asked about — one
 * already unreferenced is someone else's finding, not this save's. */
function orphanedSpecs(
  index: ManualIndex,
  path: string,
  draft: Draft,
): BlockProblem[] {
  const held = referencesOf(index.pageByPath.get(path)?.ast ?? null);
  if (held.size === 0) return [];

  const mine = draftReferences(draft);
  const elsewhere = new Set<string>();
  for (const page of index.pages) {
    if (page.path === path) continue;
    for (const id of referencesOf(page.ast)) elsewhere.add(id);
  }

  const problems: BlockProblem[] = [];
  for (const id of held) {
    if (mine.has(id) || elsewhere.has(id) || !index.specById.has(id)) continue;
    problems.push({
      message: `this page is the only one that names \`${id}\`; dropping it leaves a durable spec no page shows`,
    });
  }
  return problems;
}

/** What counts as showing a spec — the same two places `check:manual` counts:
 * the page's own frontmatter, and its `::spec` blocks. */
function referencesOf(ast: PageAst | null): Set<string> {
  const found = new Set<string>();
  if (!ast) return found;
  if (ast.frontmatter.spec) found.add(ast.frontmatter.spec);
  for (const block of ast.blocks) {
    if (block.type === "spec") found.add(block.id);
  }
  return found;
}

function draftReferences(draft: Draft): Set<string> {
  const found = new Set<string>();
  const spec = draft.frontmatter.spec.trim();
  if (spec !== "") found.add(spec);
  for (const leaf of leaves(draft.blocks)) {
    if (leaf.type !== "spec") continue;
    const id = (leaf.attrs.id ?? "").trim();
    if (id !== "") found.add(id);
  }
  return found;
}

function scenarioIds(spec: {
  requirements: { scenarios: { id?: string }[] }[];
}) {
  const ids = new Set<string>();
  for (const requirement of spec.requirements) {
    for (const scenario of requirement.scenarios) {
      if (scenario.id) ids.add(scenario.id);
    }
  }
  return ids;
}

function journeyIds(spec: { journeys?: { id: string }[] }) {
  return new Set((spec.journeys ?? []).map((journey) => journey.id));
}
