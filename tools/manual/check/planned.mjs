/*
 * RULES: what the two readings of a change leave behind for its author.
 *
 * `raised` and `asking` are about the blind suite pass's own output. It used
 * to close the suite, at the bottom of a file nobody opened until QA reviewed
 * it — which can be after the change has shipped. The questions now go to the
 * change's `decisions.md`, where the author is already reading, and every row
 * owes a landing: a `Decisions` row in that same file, or a ❓ on the
 * capability's PRD. That is the deadline the list never had.
 *
 * `dressed` is about the other half of the same problem. Both readings see
 * `ui-design.md`, so the loading, empty, error and edge states the designer
 * drew always reached the blind suite; what they did not reach was the
 * requirements, and they arrived at the reconciliation as findings against
 * scenarios nobody had asked about them. The second requirements pass now
 * walks the list and closes every bullet — the scenario it became, or an
 * `**Out of suite:**` naming where the state is stated instead.
 *
 * All three are gated on the change carrying a `decisions.md`, the marker
 * `decided` already uses: a change planned before that artifact existed was
 * planned before these rules did too, and a register of changes that could
 * not have complied is a check people learn to read past.
 *
 * All three are gated again on the requirements having landed. Before that
 * the change is mid-run: the outline is written, the blind pass may not have
 * gone out, and nothing here is owed yet.
 */
import { join } from "node:path";
import { readTextIfExists } from "../src/store/disk.mts";
import { findSection, outline, tableRows } from "../src/store/markdown.mts";

/** A `Q<n>` the change's `## Decisions` table issues, cited from a landing. */
const DECISION = /^Q\d+$/;
/** The mark a deferral wears, on the PRD and in a landing that names one. */
const DEFERRED = "❓";
/** A scenario id, which is what closes a design state that became one. */
const SCENARIO = /`[a-z0-9][a-z0-9-]*-SC-\d+`/;
const OUT_OF_SUITE = "**Out of suite:**";

export function checkPlanned(ctx, changes) {
  for (const change of changes) {
    if (change.status !== "in-flight") continue;
    const decisions = readTextIfExists(
      join(ctx.roots.store, change.dir, "decisions.md"),
    );
    if (decisions === undefined) continue;
    if (!change.deltas.some((one) => one.requirements.length > 0)) continue;
    checkRaised(ctx, change, decisions);
    checkDressed(ctx, change);
  }
}

/** RULES `raised` and `asking`: the blind pass's questions, and what came of
 * them. An empty table is a claim on the record that the input settled
 * everything — worth being able to make, and worth being read as a claim, so
 * it is named rather than passed. A row with nowhere to land is the finding
 * the whole cross-check exists to produce, about to be lost. */
function checkRaised(ctx, change, text) {
  const file = `${change.dir}/decisions.md`;
  const sections = sectionsOf(text);
  const raised = tableRows(findSection(sections, "Raised")?.body);
  if (raised === undefined) {
    ctx.add(
      "raised",
      file,
      "carries no `## Raised` table, and the requirements have landed — say what the blind pass could not settle, or that it settled everything",
    );
    return;
  }
  if (raised.length === 0) {
    ctx.add(
      "asking",
      file,
      "`## Raised` is empty — a second reading that asks nothing has either stopped being blind or stopped being a different reading",
    );
    return;
  }
  const decided = new Set(
    tableRows(findSection(sections, "Decisions")?.body)?.map((row) => row[0]) ??
      [],
  );
  for (const row of raised) {
    const [capability, question, landed = ""] = row;
    const named = question || capability || "a raised question";
    if (!landed) {
      ctx.add(
        "raised",
        file,
        `\`${named}\` landed nowhere — close it as a \`Decisions\` row here, or as a ${DEFERRED} on the capability's PRD`,
      );
      continue;
    }
    if (landed.includes(DEFERRED)) continue;
    if (!DECISION.test(landed)) {
      ctx.add(
        "raised",
        file,
        `\`${named}\` landed on \`${landed}\`, which is neither a \`Q<n>\` of this file nor a ${DEFERRED} on a page`,
      );
      continue;
    }
    if (!decided.has(landed)) {
      ctx.add(
        "raised",
        file,
        `\`${named}\` landed on \`${landed}\`, which the \`## Decisions\` table issues nowhere`,
      );
    }
  }
}

/** RULE `dressed`: every state the designer drew is answered by the
 * requirements — as a scenario, or as an exemption naming where the state is
 * stated instead. One bullet per state is what makes the list countable: a
 * bullet holding three states can be closed by one scenario and look
 * complete. */
function checkDressed(ctx, change) {
  const file = `${change.dir}/ui-design.md`;
  const text = readTextIfExists(join(ctx.roots.store, file));
  if (text === undefined) return;
  const states = findSection(sectionsOf(text), "States");
  if (!states) return;
  // `raw`, not `body`: the states are usually written under a `###` per
  // screen, and `body` stops at the first of them.
  for (const state of bulletsOf(states.raw)) {
    if (SCENARIO.test(state)) continue;
    if (state.includes(OUT_OF_SUITE)) continue;
    ctx.add(
      "dressed",
      file,
      `\`${first(state)}\` names no scenario and no \`${OUT_OF_SUITE}\` — the requirements pass closes every state bullet`,
    );
  }
}

/** Every `##` section of a file, wherever it sits in the outline. `outline`
 * returns roots and nests by level, so a file opening on a `# Title` — which
 * `ui-design.md` usually does and `decisions.md` usually does not — hangs all
 * of its `##` sections under that one. Filtering the roots for level 2 found
 * nothing there and said nothing about it, which is the shape of a check that
 * passes because it never looked. */
function sectionsOf(text) {
  const found = [];
  const visit = (sections) => {
    for (const one of sections) {
      if (one.level === 2) found.push(one);
      else visit(one.children);
    }
  };
  visit(outline(text));
  return found;
}

/** Top-level bullets of a section, each joined with the lines that continue
 * it, so a state written across two lines is one state. A heading ends the
 * bullet above it, and an indented bullet continues one rather than starting
 * another: a state and the note under it are one state. */
function bulletsOf(raw) {
  const bullets = [];
  let open = false;
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("<!--") || trimmed.startsWith("#")) {
      open = false;
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      bullets.push(line.replace(/^[-*]\s+/, ""));
      open = true;
      continue;
    }
    if (open) bullets[bullets.length - 1] += ` ${trimmed}`;
  }
  return bullets;
}

/** Enough of a bullet to find it again, without the whole state in the
 * report's message column. */
const first = (text) =>
  text.length > 60 ? `${text.slice(0, 57).trimEnd()}…` : text;
