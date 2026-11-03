/*
 * RULES: a `::phase` block names a phase `phases.yaml` lists, sits under a
 * heading of the page rather than inside another block, names rules its
 * heading holds and names each once; a heading carries one whole block.
 * WARN: a line still being built in no phase on a page that names one, and a
 * block naming a phase already released.
 *
 * Reads nothing live: whether a unit has passed is the board's to say.
 */
import { outlineOf, phasesOf } from "../src/api/phases.ts";
import { readPhaseRegistry } from "../src/store/read-release.mts";
import { message } from "./context.mjs";

export function checkPhases(ctx, pages) {
  let registry;
  try {
    registry = readPhaseRegistry(ctx.roots);
  } catch (cause) {
    ctx.add("phase", `${ctx.roots.manual}/phases.yaml`, message(cause));
    return;
  }
  const known = new Map((registry ?? []).map((phase) => [phase.id, phase]));
  for (const page of pages) {
    if (!page.ast) continue;
    const outline = outlineOf(page.ast);
    if (outline.phases.length === 0 && outline.misplaced.length === 0) continue;
    checkPage(ctx, page.path, outline, known, registry !== undefined);
  }
}

function checkPage(ctx, path, outline, known, hasRegistry) {
  const add = (reason) => ctx.add("phase", path, reason);
  const where = (heading) => (heading === null ? "the page" : `\`${heading}\``);

  for (const block of outline.misplaced) {
    add(
      `\`::phase{id="${block.id}"}\` sits inside a block — put it under the heading whose lines it covers`,
    );
  }
  const wholes = new Set();
  const named = new Map();
  for (const placed of outline.phases) {
    const { block, heading, rules } = placed;
    const phase = known.get(block.id);
    if (!hasRegistry) {
      add(
        `\`${block.id}\` is named, but ${ctx.roots.manual}/phases.yaml is missing`,
      );
    } else if (!phase) {
      add(
        `\`${block.id}\` under ${where(heading)} is not a phase — phases.yaml lists ${[...known.keys()].join(", ")}`,
      );
    } else if (phase.released) {
      ctx.add(
        "phase-warn",
        path,
        `${where(heading)} names ${phase.name}, released ${phase.released} — its lines read as launched once the block is gone`,
      );
    }
    if (rules.length === 0) {
      if (wholes.has(heading)) {
        add(
          `${where(heading)} carries two whole blocks — one heading, one phase; name the rest with \`rules\``,
        );
      }
      wholes.add(heading);
      continue;
    }
    const held = new Set(
      outline.lines
        .filter((line) => line.rule && within(outline, line.heading, heading))
        .map((line) => line.rule.anchor),
    );
    for (const rule of rules) {
      if (!held.has(rule)) {
        add(
          `\`rules\` under ${where(heading)} names \`${rule}\`, a rule ${where(heading)} does not hold`,
        );
      }
      const key = `${heading ?? ""}#${rule}`;
      if (named.has(key)) {
        add(`\`${rule}\` is named by two blocks under ${where(heading)}`);
      }
      named.set(key, heading);
    }
  }

  const phases = phasesOf(outline);
  for (const line of outline.lines) {
    if (line.mark !== "building" || phases.line(line)) continue;
    const name = line.rule
      ? `**${line.rule.name}**`
      : `\`${line.text.slice(0, 48)}\``;
    ctx.add(
      "phase-warn",
      path,
      `${name} is being built in no phase on a page that names one — Unplanned until a block covers it`,
    );
  }
}

/** Whether a line's heading sits at or under the block's heading. */
function within(outline, lineHeading, blockHeading) {
  if (blockHeading === null) return true;
  let at = lineHeading;
  while (at !== null) {
    if (at === blockHeading) return true;
    at = outline.headings.find((one) => one.anchor === at)?.parent ?? null;
  }
  return false;
}
