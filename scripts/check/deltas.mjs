/*
 * RULES: what `openspec archive` will make of a delta, asked at PR time —
 * headings the fold cannot carry, sections it throws away, a durable
 * requirement it will not find, one requirement two changes both fold, an id
 * issued twice, and a page selector a fold is about to break.
 *
 * Every one of these fails at archive time today, with the change merged and
 * the author gone; the delta file is the last place they are still cheap.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { findRequirement } from "../../apps/manual/src/api/requirements.ts";
import {
  readText,
  readTextIfExists,
  walkFiles,
} from "../../apps/manual/src/store/disk.mts";
import { outline } from "../../apps/manual/src/store/markdown.mts";
import {
  deltaKindOf,
  deltaRequirementSections,
  deltaSections,
  renamedPairs,
} from "../../apps/manual/src/store/read-changes.mts";
import { requirementBlocks } from "../../apps/manual/src/store/read-specs.mts";
import { everyBlock } from "./context.mjs";

/** The only `## ` headings a delta may hold: the four the fold reads, plus
 * the three a spec's own head carries. */
const CARRIED = new Set(["Purpose", "User journeys", "Feature set"]);
/** Carried in the author's file and dropped by the fold, which rebuilds a
 * spec's head from Purpose alone. */
const DISCARDED = ["User journeys", "Feature set"];
const ISSUED_ID = /[a-z0-9][a-z0-9-]*-(?:SC|US|TC)-\d+/g;
const LEADING_ID = /^([a-z0-9][a-z0-9-]*-SC-\d+)\b/;
const SCENARIO_HEADING = /^Scenario:\s*/i;
const ARCHIVE_DATE = /^\d{4}-\d{2}-\d{2}-/;

export function checkDeltas(ctx, { changes, shape, pages }) {
  const files = readDeltaFiles(ctx.root, changes);
  if (files.length === 0) return;
  checkShape(files, ctx.add);
  checkDiscarded(files, ctx.add);
  checkFolded(ctx, files, shape);
  checkOverlap(files, ctx.add);
  checkIssued(ctx, files);
  checkFuse(ctx, files, pages);
}

/** Every in-flight delta file, read once and parsed by the store's own
 * reader: the sections the fold splits on, and the requirements under them. */
function readDeltaFiles(root, changes) {
  const files = [];
  for (const change of changes) {
    for (const delta of change.deltas) {
      const file = `openspec/changes/${change.id}/specs/${delta.spec}/spec.md`;
      const text = readTextIfExists(join(root, file));
      if (text === undefined) continue;
      const sections = deltaSections(text);
      files.push({
        change: change.id,
        spec: delta.spec,
        file,
        text,
        sections,
        requirements: deltaRequirements(sections),
      });
    }
  }
  return files;
}

function deltaRequirements(sections) {
  const found = [];
  for (const section of sections) {
    const kind = deltaKindOf(section.heading);
    if (kind === undefined) continue;
    if (kind === "renamed") {
      for (const pair of renamedPairs(section.raw)) {
        found.push({ kind, name: pair.from, to: pair.to });
      }
      continue;
    }
    for (const one of deltaRequirementSections(section)) {
      found.push({ kind, name: one.name, block: one.block });
    }
  }
  return found;
}

/** RULE `heading`: the fold reads a delta by its headings and nothing else. A
 * `### ` that names no requirement is copied into the durable spec verbatim
 * or aborts the archive outright; a `## ` the fold does not know ends the
 * section it interrupts, and every requirement under it is never folded. */
function checkShape(files, add) {
  for (const { file, sections } of files) {
    for (const section of sections) {
      const kind = deltaKindOf(section.heading);
      if (kind === undefined) {
        if (CARRIED.has(section.heading)) continue;
        add(
          "heading",
          file,
          `line ${section.line}: \`## ${section.heading}\` is no delta section, and every requirement under it falls outside the fold`,
        );
        continue;
      }
      const requirements = new Set(
        deltaRequirementSections(section).map((one) => one.block),
      );
      for (const child of section.children) {
        if (child.level !== 3 || requirements.has(child)) continue;
        add(
          "heading",
          file,
          `line ${child.line}: \`### ${child.heading}\` names no requirement; the fold copies it into the durable spec verbatim, or aborts on it`,
        );
      }
    }
  }
}

/** RULE `fold`: `buildSpecSkeleton` rebuilds a spec's head from Purpose
 * alone, for a spec it creates as much as one it updates, so journeys and the
 * feature set a delta writes never reach the durable spec — and the ids in
 * them are issued to nothing. A warning, because the archive workflow folds
 * these by hand. */
function checkDiscarded(files, add) {
  for (const { file, sections } of files) {
    for (const heading of DISCARDED) {
      const section = sections.find((one) => one.heading === heading);
      if (!section) continue;
      // The ids the section issues are the ones it heads a block with; the
      // rest are `**Accepted by:**` citations of scenarios that do survive.
      const ids = [
        ...new Set(section.children.flatMap((one) => idsIn(one.heading))),
      ];
      const holds = ids.length > 0 ? ` holding ${ids.join(", ")}` : "";
      add(
        "fold",
        file,
        `\`## ${heading}\`${holds} — the fold carries Purpose and Requirements only, so archiving drops it`,
      );
    }
  }
}

/** RULE `delta`: what the fold will go looking for. `openspec archive`
 * matches a delta heading against the durable heading exactly, refuses to add
 * a name that already exists, and refuses a MODIFIED block that drops a
 * scenario the durable one holds. The same three lookups, run at PR time. */
function checkFolded(ctx, files, shape) {
  const blocks = durableBlocks(ctx.root, shape);
  for (const one of files) {
    const spec = ctx.specs.get(one.spec);
    // A spec the readers refused has no requirements to match against, and
    // the store rule already names it.
    if (spec?.error) continue;
    const durable = new Set((spec?.requirements ?? []).map((it) => it.name));

    for (const requirement of one.requirements) {
      const what = label(requirement);
      if (requirement.kind === "added") {
        if (!durable.has(requirement.name)) continue;
        ctx.add(
          "delta",
          one.file,
          `${what} is already a requirement of \`${one.spec}\`, and the fold refuses to add a name that exists`,
        );
        continue;
      }
      if (!durable.has(requirement.name)) {
        if (!spec) {
          ctx.add(
            "delta",
            one.file,
            `${what}, but \`${one.spec}\` has no durable spec yet — a new spec can only ADD`,
          );
          continue;
        }
        const near = findRequirement(spec.requirements, requirement.name);
        ctx.add(
          "delta",
          one.file,
          near
            ? `${what} spells \`${near.name}\` differently, and the fold matches the heading exactly`
            : `${what} names no requirement of \`${one.spec}\``,
        );
        continue;
      }
      if (requirement.kind !== "modified") continue;
      const dropped = droppedScenarios(
        scenarios(outline(blocks(one.spec).get(requirement.name) ?? "")),
        scenarios(requirement.block.children),
      );
      if (dropped.length === 0) continue;
      ctx.add(
        "delta",
        one.file,
        `${what} drops ${dropped.map(scenarioLabel).join(", ")} — a MODIFIED block replaces the whole requirement, so it has to restate every scenario`,
      );
    }
  }
}

/** RULE `overlap`: two changes folding one requirement is a silent revert —
 * both archive cleanly, and the second writes the first's text away. */
function checkOverlap(files, add) {
  const claims = new Map();
  for (const one of files) {
    for (const requirement of one.requirements) {
      if (requirement.kind === "added") continue;
      const key = `${one.spec}\n${requirement.name}`;
      const held = claims.get(key) ?? [];
      held.push({ ...requirement, change: one.change, file: one.file });
      claims.set(key, held);
    }
  }

  for (const held of claims.values()) {
    if (new Set(held.map((one) => one.change)).size < 2) continue;
    for (const claim of held) {
      const others = held
        .filter((one) => one.change !== claim.change)
        .map((one) => `\`${one.change}\` (${one.kind.toUpperCase()})`);
      add(
        "overlap",
        claim.file,
        `${label(claim)} is also folded by ${others.join(", ")} — whichever archives second reverts the first`,
      );
    }
  }
}

/** RULE `issued`: `<capability>-SC/US/TC-<n>` is issued once, ever. The
 * issued universe is the durable specs plus every delta in the store,
 * archived ones included — the fold destroys a delta's journeys, so an id an
 * archived change issued lives nowhere else, and reusing it rewrites history
 * silently. */
function checkIssued(ctx, files) {
  const durable = new Map();
  for (const spec of ctx.specs.values()) {
    for (const requirement of spec.requirements) {
      for (const scenario of requirement.scenarios) {
        if (scenario.id) durable.set(scenario.id, spec.id);
      }
    }
    for (const journey of spec.journeys ?? []) durable.set(journey.id, spec.id);
    for (const test of spec.testCases ?? []) durable.set(test.id, spec.id);
  }

  const archived = archivedIds(ctx.root);
  const issuers = new Map();
  const claim = (id, change) => {
    if (durable.has(id)) return;
    const held = issuers.get(id) ?? new Set();
    held.add(change);
    issuers.set(id, held);
  };
  for (const one of files) {
    for (const id of new Set(idsIn(one.text))) claim(id, one.change);
  }
  for (const [change, ids] of archived) {
    for (const id of ids) claim(id, change);
  }

  for (const one of files) {
    for (const id of new Set(idsIn(one.text))) {
      const others = [...(issuers.get(id) ?? [])].filter(
        (change) => change !== one.change,
      );
      if (others.length === 0) continue;
      const named = others
        .map((change) =>
          archived.has(change) ? `the archived \`${change}\`` : `\`${change}\``,
        )
        .join(", ");
      ctx.add(
        "issued",
        one.file,
        `reuses \`${id}\`, which ${named} also issues — an id is issued once and never freed`,
      );
    }
    for (const requirement of one.requirements) {
      if (requirement.kind !== "added") continue;
      for (const scenario of scenarios(requirement.block.children)) {
        const id = LEADING_ID.exec(scenario)?.[1];
        if (id === undefined || !durable.has(id)) continue;
        ctx.add(
          "issued",
          one.file,
          `${label(requirement)} issues \`${id}\`, which \`${durable.get(id)}\` already issues — an id is issued once and never freed`,
        );
      }
    }
  }
}

/** RULE `fuse`: a page selects a requirement by name, and a REMOVED or
 * RENAMED delta is about to move it. Archiving that change leaves the archive
 * green, `main` red and the deployed manual frozen — so it fails here, where
 * the page and the delta are still one commit apart. */
function checkFuse(ctx, files, pages) {
  const moving = new Map();
  for (const one of files) {
    for (const requirement of one.requirements) {
      if (requirement.kind === "added" || requirement.kind === "modified") {
        continue;
      }
      const held = moving.get(one.spec) ?? [];
      held.push({ ...requirement, change: one.change });
      moving.set(one.spec, held);
    }
  }
  if (moving.size === 0) return;

  for (const page of pages) {
    for (const block of everyBlock(page.ast.blocks)) {
      if (block.type !== "spec" || block.requirement === undefined) continue;
      const hit = findRequirement(
        moving.get(block.id) ?? [],
        block.requirement,
      );
      if (!hit) continue;
      const selects = `::spec{id="${block.id}"} selects \`${block.requirement}\`, which \`${hit.change}\``;
      ctx.add(
        "fuse",
        page.path,
        hit.kind === "renamed"
          ? `${selects} renames to \`${hit.to}\` — point the selector at the new name`
          : `${selects} removes — the archive would leave this page naming nothing`,
      );
    }
  }
}

/** Requirement blocks of a durable spec, as written, read once per spec. The
 * fold compares whole `#### Scenario:` headings, so both sides of the
 * comparison come from the same text the fold reads. */
function durableBlocks(root, shape) {
  const cache = new Map();
  return (id) => {
    const held = cache.get(id);
    if (held) return held;
    const dir = shape.dirs.get(id);
    const blocks = dir
      ? requirementBlocks(readText(join(root, dir, "spec.md")))
      : new Map();
    cache.set(id, blocks);
    return blocks;
  };
}

/** Ids every archived change issues, by change id. The fold leaves no durable
 * trace of a delta's journeys, so this is the only record they exist. */
function archivedIds(root) {
  const dir = join(root, "openspec", "changes", "archive");
  const byChange = new Map();
  if (!existsSync(dir)) return byChange;
  for (const file of walkFiles(root, dir, "spec.md")) {
    const name = file.split("/")[3].replace(ARCHIVE_DATE, "");
    const held = byChange.get(name) ?? new Set();
    for (const id of idsIn(readText(join(root, file)))) held.add(id);
    byChange.set(name, held);
  }
  return byChange;
}

const idsIn = (text) => text.match(ISSUED_ID) ?? [];

/** `#### Scenario:` headings of one requirement block, whole — a MODIFIED
 * block that renames a scenario drops it exactly as one that deletes it. */
function scenarios(sections) {
  return sections
    .filter((one) => one.level === 4 && SCENARIO_HEADING.test(one.heading))
    .map((one) => one.heading.replace(SCENARIO_HEADING, "").trim());
}

/** openspec's own comparison, multiplicity-aware: a name the durable block
 * holds twice and the incoming block holds once is dropped once. */
function droppedScenarios(current, incoming) {
  const left = new Map();
  for (const name of incoming) left.set(name, (left.get(name) ?? 0) + 1);
  const dropped = [];
  for (const name of current) {
    const remaining = left.get(name) ?? 0;
    if (remaining > 0) left.set(name, remaining - 1);
    else dropped.push(name);
  }
  return dropped;
}

const scenarioLabel = (scenario) =>
  LEADING_ID.exec(scenario)?.[1] ?? `\`${scenario}\``;

const label = ({ kind, name }) =>
  kind === "renamed"
    ? `RENAMED FROM \`${name}\``
    : `${kind.toUpperCase()} \`${name}\``;
