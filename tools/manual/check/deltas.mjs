/*
 * RULES: what `openspec archive` will make of a delta, asked at PR time —
 * headings the fold cannot carry, a durable requirement it will not find,
 * one requirement two changes both fold, an id issued twice, and a page
 * selector a fold is about to break.
 *
 * Every one of these fails at archive time today, with the change merged and
 * the author gone; the delta file is the last place they are still cheap.
 * What the fold discards — `## Feature set`, and the `user-journeys.md`
 * beside the delta — is not a rule here: every well-formed change carries
 * them by design, and `archive:preflight` refuses the archive until they
 * reach the durable capability.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { findRequirement } from "../src/api/requirements.ts";
import { readText, readTextIfExists, walkFiles } from "../src/store/disk.mts";
import { findSection, outline } from "../src/store/markdown.mts";
import {
  deltaKindOf,
  deltaRequirementSections,
  deltaSections,
  renamedPairs,
} from "../src/store/read-changes.mts";
import {
  featureGroups,
  readJourneys,
  readRequirement,
  requirementBlocks,
} from "../src/store/read-specs.mts";
import { everyBlock, plural } from "./context.mjs";

/** The only `## ` headings a delta may hold: the four the fold reads, plus
 * the two a spec's own head carries. `User journeys` is not among them — the
 * journeys are their own file beside the delta, and one written here is read
 * by nothing. */
const CARRIED = new Set(["Purpose", "Feature set"]);
const ISSUED_ID = /[a-z0-9][a-z0-9-]*-(?:SC|US|TC)-\d+/g;
const LEADING_ID = /^([a-z0-9][a-z0-9-]*-SC-\d+)\b/;
const SCENARIO_HEADING = /^Scenario:\s*/i;
const SCENARIO_ID = /[a-z0-9][a-z0-9-]*-SC-\d+/g;
const GWT = /^\s*(?:[-*]\s+)?\*\*(?:GIVEN|WHEN|THEN)\*\*/;
const ARCHIVE_DATE = /^\d{4}-\d{2}-\d{2}-/;

export function checkDeltas(ctx, { changes, shape, pages }) {
  const files = readDeltaFiles(ctx.roots.store, changes);
  if (files.length === 0) return;
  checkShape(files, ctx.add);
  checkFolded(ctx, files, shape);
  checkOverlap(files, ctx.add);
  checkIssued(ctx, files);
  checkFuse(ctx, files, pages);
  checkContext(ctx, files);
  checkAnchors(ctx, files);
  checkBlind(ctx, files, shape);
}

/** RULES `anchorless` and `serves`, asked of a delta rather than only of the
 * store it folds into.
 *
 * A scenario points up at an anchor and a case points up at one, and the join
 * between the spec and its suite runs through that anchor alone. Asked of the
 * durable store only, both rules first spoke a release after the change
 * merged — by which time the anchor the author meant is as gone as the author,
 * and the finding is a line somebody has to guess at. Five capabilities turned
 * out to hold behaviour their own feature set never named, and this is the
 * reading that found them.
 *
 * The anchors a delta may name are the capability's, not the delta's: a
 * scenario serves a journey the durable file already holds, or a group of a
 * feature set this change did not restate, as often as it serves one of its
 * own. A journey the change retires is not among them — serving it is the
 * error the tombstone cannot answer for. */
function checkAnchors(ctx, files) {
  for (const one of files) {
    const anchors = anchorsFor(ctx, one);
    const missing = [];
    for (const requirement of one.requirements) {
      // RENAMED carries no block, and a REMOVED block is the durable
      // requirement on its way out: what it copied is not this change's to
      // anchor.
      if (requirement.kind !== "added" && requirement.kind !== "modified")
        continue;
      if (!requirement.block) continue;
      let scenarios;
      try {
        scenarios = readRequirement(requirement.block).scenarios ?? [];
      } catch {
        // A block the reader refuses is the `store` rule's to name.
        continue;
      }
      for (const scenario of scenarios) {
        if (!scenario.id) continue;
        const serves = scenario.serves ?? [];
        if (serves.length === 0) {
          missing.push(scenario.id);
          continue;
        }
        for (const anchor of serves) {
          if (anchors.has(anchor)) continue;
          ctx.add(
            "serves",
            one.file,
            `${scenario.id} → \`${anchor}\`, which is neither a journey nor a feature set group of \`${one.spec}\``,
          );
        }
      }
    }
    if (missing.length > 0) {
      ctx.add(
        "anchorless",
        one.file,
        `${plural(missing.length, "scenario")} with no \`**Serves:**\` line (${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", …" : ""})`,
      );
    }
  }
}

/** Every anchor this delta's scenarios may name: the durable capability's
 * journeys and feature set groups, plus the ones the delta writes itself. */
function anchorsFor(ctx, one) {
  const durable = ctx.specs.get(one.spec);
  const anchors = new Set([
    ...(durable?.journeys ?? []).map((journey) => journey.id),
    ...(durable?.featureGroups ?? []),
  ]);
  try {
    for (const journey of readJourneys(
      journeysBeside(ctx.roots.store, one.file),
    )) {
      anchors.add(journey.id);
    }
  } catch {
    // A journeys file the reader refuses is `walked`'s to name; the durable
    // anchors still stand.
  }
  const featureSet = findSection(one.sections, "Feature set");
  for (const group of featureGroups(featureSet?.body ?? "")) anchors.add(group);
  return anchors;
}

/** RULE `blind`: a delta that moves behaviour owes a second, independent
 * reading of the same anchors — the suite beside it, and the
 * `## Reconciliation` that says the two readings were brought together. A
 * suite derived from the scenarios can only find inconsistency inside them,
 * never the behaviour they left out, which is the one thing the pass exists
 * to find; so a change without one ships whatever its scenarios forgot, and
 * nothing anywhere says so.
 *
 * This is where `blind_pass_skipped` is granted, and granting it is this
 * rule staying quiet. The author cannot declare it: behaviour lives in the
 * `**GIVEN**` / `**WHEN**` / `**THEN**` lines and the scenario ids, so a
 * delta that adds no id and moves no such line — a requirement split for
 * readability, a rename, a typo in prose, a scenario moved under the
 * requirement it always belonged to — has nothing for a second reading to
 * read. Where this refuses and the author disagrees, that is a grilling
 * round, not a self-service waiver.
 *
 * A `warn` while the store is full of changes written before the blind pass
 * existed. It is the register of which ones they are, the way `derived` is
 * for capabilities; a fail today would be 50 red lines nobody can act on,
 * which is how a check teaches people to read past it. It goes to `fail` when
 * the register empties. */
function checkBlind(ctx, files, shape) {
  const durable = durableBlocks(ctx.roots.store, shape);
  for (const one of files) {
    if (!movesBehaviour(one, durable)) continue;
    const at = one.file.replace(/spec\.md$/, "feature-tcs.md");
    const suite = readTextIfExists(join(ctx.roots.store, at));
    if (suite === undefined) {
      ctx.add(
        "blind",
        at,
        `\`${one.change}\` moves behaviour in \`${one.spec}\` and no suite reads it independently — run the feature pass, or say which line of behaviour moved if you think none did`,
      );
      continue;
    }
    if (/^##\s+Reconciliation\s*$/m.test(suite)) continue;
    ctx.add(
      "blind",
      at,
      `carries no \`## Reconciliation\` — a suite without one is a reading nobody brought back to the scenarios, and what the two disagreed about is the finding`,
    );
  }
}

/** Whether a delta moves behaviour, judged the way the hatch is written: a
 * scenario id the durable spec does not hold, or a GIVEN/WHEN/THEN line that
 * is not the durable one. A REMOVED requirement moves behaviour when the
 * requirement it removes had any. */
function movesBehaviour(one, durable) {
  const blocks = durable(one.spec);
  for (const requirement of one.requirements) {
    if (requirement.kind === "renamed") continue;
    if (requirement.kind === "removed") {
      if (behaviourOf(blocks.get(requirement.name)).lines.length > 0) {
        return true;
      }
      continue;
    }
    const written = behaviourOf(requirement.block?.raw);
    if (requirement.kind === "added") {
      if (written.lines.length > 0) return true;
      continue;
    }
    const held = blocks.get(requirement.name);
    // MODIFIED against a requirement the durable spec does not hold. The
    // fold refuses it and `delta` already says so; nothing here can compare.
    if (held === undefined) return true;
    if (!sameBehaviour(written, behaviourOf(held))) return true;
  }
  return false;
}

/** What a requirement block states as behaviour: the scenario ids it issues
 * and its GIVEN/WHEN/THEN lines, whitespace collapsed. Everything else — the
 * heading prose, a table, the `**Serves:**` anchor above the lines — is how
 * the behaviour is explained rather than what it is, which is why the anchor
 * sits where it does. */
function behaviourOf(raw) {
  const text = raw ?? "";
  return {
    ids: new Set(text.match(SCENARIO_ID) ?? []),
    lines: text
      .split("\n")
      .filter((line) => GWT.test(line))
      // The bullet marker is not behaviour: a list rewritten as plain lines
      // moves none, and the hatch is about what the lines say.
      .map((line) =>
        line
          .replace(/^\s*(?:[-*]\s+)?/, "")
          .replace(/\s+/g, " ")
          .trim(),
      ),
  };
}

const sameBehaviour = (written, held) =>
  written.lines.length === held.lines.length &&
  written.lines.every((line, at) => line === held.lines[at]) &&
  [...written.ids].every((id) => held.ids.has(id));

/** RULE `context`: a change restates the journeys it anchors on under
 * `## Context user journeys`, and the copy is the durable text or it is a lie.
 *
 * The section exists so the blind suite pass can read the journeys without being
 * handed the durable capability — reading `openspec/specs/` is how it would see
 * the scenarios it must not see. That makes the copy load-bearing rather than a
 * convenience, and a copy nobody checks drifts: the change is then written
 * against a journey the store no longer holds, and archive quietly reverts
 * whatever landed in between.
 *
 * Only the restated block is compared. A journey the change also modifies belongs
 * under `## MODIFIED User journeys`, where it is meant to differ. */
function checkContext(ctx, files) {
  for (const file of files) {
    const text = journeysBeside(ctx.roots.store, file.file);
    const restated = journeysUnder(text, "Context user journeys");
    if (restated.size === 0) continue;
    const durablePath = `openspec/specs/${file.spec}/user-journeys.md`;
    const durable = journeysUnder(
      readTextIfExists(join(ctx.roots.store, durablePath)) ?? "",
      "User journeys",
    );
    const at = file.file.replace(/spec\.md$/, "user-journeys.md");
    for (const [id, copied] of restated) {
      const original = durable.get(id);
      if (original === undefined) {
        ctx.add(
          "context",
          at,
          `restates \`${id}\`, which \`${file.spec}\` does not hold — a context journey is a copy of a durable one, not a new journey filed under the wrong heading`,
        );
      } else if (original !== copied) {
        ctx.add(
          "context",
          at,
          `the restated \`${id}\` is not what \`${file.spec}\` holds — bring the copy back to the durable text, or move the journey under \`## MODIFIED User journeys\` where it is meant to differ`,
        );
      }
    }
  }
}

/** Journey id → its block, normalised only for trailing whitespace. Everything
 * else is compared as written: the point is to catch an edit, and an edit that
 * looks like formatting is still an edit. */
function journeysUnder(text, heading) {
  const out = new Map();
  const lines = text.split("\n");
  let inside = false;
  let id = null;
  let body = [];
  const flush = () => {
    if (id) out.set(id, body.join("\n").trimEnd());
    id = null;
    body = [];
  };
  for (const line of lines) {
    const head = /^##\s+(.+?)\s*$/.exec(line);
    if (head) {
      flush();
      inside = head[1].trim() === heading;
      continue;
    }
    if (!inside) continue;
    const story = /^###\s+([a-z0-9][a-z0-9-]*-US-\d+):/.exec(line);
    if (story) {
      flush();
      id = story[1];
      body = [line.trimEnd()];
      continue;
    }
    if (id) body.push(line.trimEnd());
  }
  flush();
  return out;
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
        // The journeys live beside the delta now, so the ids a change issues
        // are the two files' together — scanning spec.md alone would let a
        // `-US-` number be handed out twice.
        ids: [...idsIn(text), ...idsIn(journeysBeside(root, file))],
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

/** RULE `delta`: what the fold will go looking for. `openspec archive`
 * matches a delta heading against the durable heading exactly, refuses to add
 * a name that already exists, and refuses a MODIFIED block that drops a
 * scenario the durable one holds. The same three lookups, run at PR time. */
function checkFolded(ctx, files, shape) {
  const blocks = durableBlocks(ctx.roots.store, shape);
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

  const archived = archivedIds(ctx.roots.store);
  const issuers = new Map();
  const claim = (id, change) => {
    if (durable.has(id)) return;
    const held = issuers.get(id) ?? new Set();
    held.add(change);
    issuers.set(id, held);
  };
  for (const one of files) {
    for (const id of new Set(one.ids)) claim(id, one.change);
  }
  for (const [change, ids] of archived) {
    for (const id of ids) claim(id, change);
  }

  for (const one of files) {
    for (const id of new Set(one.ids)) {
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

/** Ids every archived change issues, by change id — its deltas and the
 * journeys beside them. The fold leaves no durable trace of a delta's
 * journeys, so this is the only record they exist. */
function archivedIds(root) {
  const dir = join(root, "openspec", "changes", "archive");
  const byChange = new Map();
  if (!existsSync(dir)) return byChange;
  for (const file of walkFiles(root, dir, "spec.md")) {
    const name = file.split("/")[3].replace(ARCHIVE_DATE, "");
    const held = byChange.get(name) ?? new Set();
    for (const id of idsIn(readText(join(root, file)))) held.add(id);
    for (const id of idsIn(journeysBeside(root, file))) held.add(id);
    byChange.set(name, held);
  }
  return byChange;
}

const idsIn = (text) => text.match(ISSUED_ID) ?? [];

/** The `user-journeys.md` beside a delta, as written — empty when the
 * change leans on the durable journeys, and holding `**Walked by:** nobody`
 * for a capability no end user reaches (rule `walked` asks which). */
const journeysBeside = (root, file) =>
  readTextIfExists(join(root, file.replace(/spec\.md$/, "user-journeys.md"))) ??
  "";

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
