/** Every in-flight delta file as `scripts/openspec/lib/clusters.mjs` groups
 * them: the requirements each folds and the ids each issues. */
import { join } from "node:path";
import { readTextIfExists } from "../../manual/src/store/disk.mts";
import {
  deltaKindOf,
  deltaRequirementSections,
  renamedPairs,
} from "./read-changes.mts";
import { deltaSections, JOURNEY_ID, SCENARIO_ID } from "./spec-text.mts";

const ISSUED_ID = new RegExp(
  `${SCENARIO_ID.source}|${JOURNEY_ID.source}|[a-z0-9][a-z0-9-]*-TC-\\d+`,
  "g",
);

/** Every in-flight delta file, read once and parsed by the store's own
 * reader: the sections the fold splits on, and the requirements under them. */
export function readDeltaFiles(root, changes) {
  const files = [];
  for (const change of changes) {
    for (const delta of change.deltas) {
      const file = `openspec/changes/${change.id}/specs/${delta.spec}/spec.md`;
      const text = readTextIfExists(join(root, file));
      if (text === undefined) continue;
      const sections = deltaSections(text);
      files.push({
        change: change.id,
        dependsOn: change.dependsOn ?? [],
        accepted: change.accepted === true,
        spec: delta.spec,
        file,
        text,
        sections,
        // The journeys live beside the delta now, so the ids a change issues
        // are the two files' together — scanning spec.md alone would let a
        // `-US-` number be handed out twice.
        ids: [
          ...idsIn(withoutRemoved(text)),
          ...idsIn(withoutRemoved(journeysBeside(root, file))),
        ],
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

/** Every requirement a delta folds, keyed by capability and name, with the
 * claims held on it; two changes in one list is an overlap. */
export function overlapClaims(files) {
  const claims = new Map();
  for (const one of files) {
    for (const requirement of one.requirements) {
      const key = `${one.spec}\n${requirement.name}`;
      const held = claims.get(key) ?? [];
      held.push({ ...requirement, change: one.change, file: one.file });
      claims.set(key, held);
    }
  }
  return claims;
}

const idsIn = (text) => text.match(ISSUED_ID) ?? [];

/** A REMOVED section names the ids it retires; retiring an id is not issuing
 * it, and once the fold drops it from the durable files the mention would
 * read as the id handed out a second time. */
const withoutRemoved = (text) =>
  text.replace(/^## REMOVED [^\n]*\n[\s\S]*?(?=^## |(?![\s\S]))/gm, "");

/** The `user-journeys.md` beside a delta, as written — empty when the
 * change leans on the durable journeys, and holding `**Walked by:** nobody`
 * for a capability no end user reaches (rule `walked` asks which). */
const journeysBeside = (root, file) =>
  readTextIfExists(join(root, file.replace(/spec\.md$/, "user-journeys.md"))) ??
  "";
