/**
 * Releasing a phase, read through the manual's one reader: the units of a
 * phase and their readiness, the 🚧 marks a passed unit's lines lose, and the
 * `::phase` blocks a release removes or moves to the next phase -
 * docs/prds/products/shared/planning/release-phases.md#releasing-a-phase.
 *
 * Every edit is made to a page's source line by line, never by writing the
 * parse back, and is proven before anything is written: each edited page
 * parses to the canonical text the editor writes, and the pages read again
 * place every line where the plan says it lands — a launched line in no
 * phase, a moved line in the next, every other line where it was.
 */

import { createHash } from "node:crypto";
import { sectionSlug } from "../../../tools/manual/src/api/paths.ts";
import {
  outlineOf,
  phasesOf,
  unitsOf,
} from "../../../tools/manual/src/api/phases.ts";
import {
  readinessOf,
  STEP_LABEL,
} from "../../../tools/manual/src/api/readiness.ts";
import { readRelease } from "../../../tools/manual/src/api/units.ts";
import {
  parsePage,
  serializePage,
} from "../../../tools/manual/src/content/grammar.ts";
import { NO_GIT } from "../../../tools/manual/src/store/git.mts";
import {
  readManualPages,
  readManualSuites,
} from "../../../tools/manual/src/store/read-manual.mts";
import {
  readCapabilityCases,
  readPhaseRegistry,
} from "../../../tools/manual/src/store/read-release.mts";
import { rootsOf } from "../../../tools/manual/src/store/roots.mts";

/** A phase id no registry lists, so a probe's lines are told apart. */
const PROBE = "phase-release-probe";
const PRODUCTS = "docs/prds/products/";

/** The store at `root` as the release reads it: the pages' sources beside
 * the reading, so the edits start from the text on disk. */
export function readStore(root) {
  const roots = rootsOf(root);
  const phases = readPhaseRegistry(roots);
  if (!phases) throw new Error(`${roots.manual}/phases.yaml is missing`);
  const { pages, asts } = readManualPages(roots, NO_GIT);
  const suites = readManualSuites(roots);
  const capabilityCases = readCapabilityCases(roots);
  const sources = new Map(pages.map((page) => [page.path, page.source]));
  const read = (asts) =>
    readRelease({
      phases,
      pages: [...asts].map(([path, ast]) => ({ path, ast })),
      suites,
      capabilityCases,
    });
  return { roots, phases, sources, asts, reading: read(asts), read };
}

/** A unit as a person names it: `grade10-site/store/cart#promo-code`, a
 * capability's spec id, or a page. */
export function unitName(unit) {
  const page = (path) => path.replace(PRODUCTS, "").replace(/\.md$/, "");
  if (unit.kind === "capability") return unit.spec;
  if (unit.kind === "section")
    return `${page(unit.pages[0])}${unit.section.anchor ? `#${unit.section.anchor}` : ""}`;
  return page(unit.pages[0]);
}

/**
 * The phase's units, each with its readiness, and what a release of it
 * would do: what launches, what moves, the units passed, and every reason
 * sign-off refuses.
 */
export function planPhase(store, phaseId, verdicts) {
  const { phases, reading } = store;
  const phase = phases.find((one) => one.id === phaseId);
  if (!phase)
    throw new Error(
      `\`${phaseId}\` is not a phase — phases.yaml lists ${phases.map((one) => one.id).join(", ")}`,
    );
  const next = phases[phase.order + 1];
  const units = reading.units
    .filter((unit) => unit.phase === phase.id)
    .map((unit) => ({
      unit,
      name: unitName(unit),
      readiness: readinessOf(unit, reading.casesOf(unit), phase, verdicts),
    }))
    .sort(
      (a, b) =>
        a.unit.priority.localeCompare(b.unit.priority) ||
        a.name.localeCompare(b.name),
    );
  const passed = units.filter((one) => one.readiness.step === "passed");
  const launches = units.filter(
    (one) => one.unit.priority === "P0" || one.readiness.step === "passed",
  );
  const moves = units.filter((one) => !launches.includes(one));

  const refusals = [];
  if (units.length === 0) refusals.push(`no unit is placed in ${phase.name}`);
  if (phase.released)
    refusals.push(`${phase.name} was released ${phase.released}`);
  for (const one of units) {
    if (one.unit.priority === "P0" && one.readiness.step !== "passed")
      refusals.push(
        `P0 ${one.name} has not passed: ${STEP_LABEL[one.readiness.step]}`,
      );
  }
  for (const one of launches) {
    if (one.readiness.questions > 0)
      refusals.push(
        `${one.name} launches holding ${plural(one.readiness.questions, "question")}`,
      );
  }
  for (const one of units) {
    if (one.readiness.untriagedAutomatedFails > 0)
      refusals.push(
        `${one.name} has ${plural(one.readiness.untriagedAutomatedFails, "automated fail")} not triaged`,
      );
  }
  if (!next && moves.length > 0)
    refusals.push(
      `${phase.name} is the last phase, so nothing can move: ${moves.map((one) => one.name).join(", ")}`,
    );
  return { phase, next, units, passed, launches, moves, refusals };
}

export const plural = (count, word) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

/** Where the top-level `::phase` lines and the headings sit in a page's
 * source, outside fences and containers — the lines the parse reads as
 * placed blocks, as sections and as the headings under them. */
function sourceMap(lines) {
  const blocks = [];
  const sections = new Map();
  const headings = new Map();
  let fence = null;
  let depth = 0;
  lines.forEach((line, at) => {
    if (fence !== null) {
      if (line.startsWith(fence)) fence = null;
      return;
    }
    const opened = /^(`{3,}|~{3,})/.exec(line);
    if (opened) {
      fence = opened[1];
      return;
    }
    if (/^:::\s*$/.test(line)) depth = 0;
    else if (/^:::[a-z]/.test(line)) depth = 1;
    else if (depth === 0 && /^::phase(\{.*\})?\s*$/.test(line)) blocks.push(at);
    else if (depth === 0) {
      const heading = /^(#{2,4})\s+(.+?)\s*#*\s*$/.exec(line);
      if (heading) {
        const anchor = sectionSlug(heading[2]);
        if (!headings.has(anchor)) headings.set(anchor, at);
        if (heading[1] === "##" && !sections.has(anchor))
          sections.set(anchor, at);
      }
    }
  });
  return { blocks, sections, headings };
}

export const blockLine = (block) =>
  `::phase{id="${block.id}" priority="${block.priority}"${block.rules ? ` rules="${block.rules}"` : ""}}`;

/** The units each of a page's outline lines belongs to, by the one reader. */
function lineUnits(page) {
  return page.outline.lines.map(
    (line) =>
      unitsOf([
        { ...page, outline: { ...page.outline, lines: [line], phases: [] } },
      ])[0]?.key,
  );
}

const outlineAt = (text) => {
  const outline = outlineOf(parsePage(text));
  return { outline, phases: phasesOf(outline) };
};

const removeMark = (line) =>
  line.replace(/\s*🚧\s*$/u, "").replace(/🚧\s*/gu, "");

/**
 * The source lines carrying 🚧 that belong to one of `keys`' units: each
 * candidate line is read again without its mark, and the outline line whose
 * words change is the one it writes.
 */
function markEdits(path, source, page, units, keys) {
  if (!units.some((key) => keys.has(key))) return [];
  const lines = source.split("\n");
  const before = page.outline.lines;
  const edits = [];
  lines.forEach((line, at) => {
    if (!line.includes("🚧") || /^#{1,6}\s/.test(line)) return;
    const probe = [...lines];
    probe[at] = removeMark(line);
    let after;
    try {
      after = outlineAt(probe.join("\n")).outline.lines;
    } catch (cause) {
      throw new Error(
        `${path}:${at + 1}: the line does not parse without its 🚧 — ${cause.message}`,
      );
    }
    if (after.length !== before.length)
      throw new Error(
        `${path}:${at + 1}: taking the 🚧 off changes the page's lines — edit it by hand`,
      );
    const changed = before.flatMap((one, index) =>
      one.text === after[index].text ? [] : [index],
    );
    if (changed.length === 0) return;
    if (changed.length > 1)
      throw new Error(`${path}:${at + 1}: the 🚧 reads as more than one line`);
    if (!keys.has(units[changed[0]])) return;
    edits.push({ at, before: line, after: probe[at] });
  });
  return edits;
}

/** The marks the passed units' lines lose, page by page. */
export function checkedEdits(store, keys) {
  const byPage = new Map();
  for (const [path, page] of store.reading.pages) {
    const edits = markEdits(
      path,
      store.sources.get(path),
      page,
      lineUnits(page),
      keys,
    );
    if (edits.length > 0) byPage.set(path, edits);
  }
  return byPage;
}

/**
 * The edits releasing `plan.phase` makes: the passed units' marks come off,
 * its blocks go, and each moving unit's lines land in the next phase at the
 * priority their block gave them. Where a removed block leaves launched
 * lines under another phase's block above them, that block is pushed down
 * onto what it still covers, so the launched lines read in no phase.
 */
export function releaseEdits(store, plan) {
  const moving = new Set(plan.moves.map((one) => one.unit.key));
  const launching = new Set(plan.launches.map((one) => one.unit.key));
  const passed = new Set(plan.passed.map((one) => one.unit.key));
  const { phase, next } = plan;
  const pages = new Map();
  for (const [path, page] of store.reading.pages) {
    const source = store.sources.get(path);
    const units = lineUnits(page);
    const marks = markEdits(path, source, page, units, passed);
    const blocks = blockEdits(path, source, page, units, phase, next, moving);
    if (marks.length === 0 && blocks.ops.length === 0) continue;
    const wants = units.map((key) => wantOf(key, launching));
    const settled = settleEdits(applyEdits(source, { ops: blocks.ops }), wants);
    pages.set(path, {
      marks,
      ops: blocks.ops,
      settle: settled.ops,
      notes: [...blocks.notes, ...settled.notes],
    });
  }
  return pages;
}

/** What a release asks of a line: to launch, reading in no phase; to keep
 * the phase it lands in; or nothing, for a line in no unit. */
const wantOf = (key, launching) =>
  key === undefined ? "free" : launching.has(key) ? "launch" : "keep";

/** Whether a line sits under a heading, at any depth. */
function under(outline, line, anchor) {
  for (let at = line.heading; at !== null; ) {
    if (at === anchor) return true;
    at = outline.headings.find((one) => one.anchor === at)?.parent ?? null;
  }
  return anchor === null;
}

/**
 * A whole block that covers launched lines, pushed down onto what else it
 * covers: the same block on each heading below whose lines all stay, and a
 * block naming the rules of the lines that stay directly under a heading
 * that also holds launched ones. Null where a line that stays names no
 * rule, so no block can cover it alone.
 */
function pushDown(outline, phases, block, wants) {
  const covered = outline.lines.flatMap((line, index) =>
    phases.blockOf(line) === block ? [index] : [],
  );
  const lines = (anchor) =>
    covered.filter((index) => under(outline, outline.lines[index], anchor));
  const whole = [];
  const named = new Map();
  const into = (anchor) => {
    for (const child of outline.headings) {
      if (child.parent !== anchor) continue;
      const below = lines(child.anchor);
      if (below.length === 0) continue;
      if (below.some((index) => wants[index] === "launch")) {
        if (!into(child.anchor)) return false;
      } else whole.push(child.anchor);
    }
    for (const index of covered) {
      const line = outline.lines[index];
      if (line.heading !== anchor || wants[index] !== "keep") continue;
      const rule = line.rule?.anchor ?? line.within[0];
      if (!rule) return false;
      const rules = named.get(anchor) ?? [];
      if (!rules.includes(rule)) rules.push(rule);
      named.set(anchor, rules);
    }
    return true;
  };
  return into(block.heading) ? { whole, named } : null;
}

/** The edits, made after the release's own, that push down each whole block
 * a launched line still reads under. A push-down is kept only where every
 * line that stays keeps its phase and the block's launched lines read in
 * none; otherwise the block is left whole, for the proof to name its lines. */
function settleEdits(text, wants) {
  const lines = text.split("\n");
  const { outline, phases } = outlineAt(text);
  const map = sourceMap(lines);
  const sourceOf = (placed) => map.blocks[outline.phases.indexOf(placed)];
  const before = outline.lines.map((line) => phases.line(line));
  const offending = new Set();
  outline.lines.forEach((line, index) => {
    const block = phases.blockOf(line);
    if (wants[index] === "launch" && block && block.rules.length === 0)
      offending.add(block);
  });

  const rulesBlock = (block, heading, rules) => {
    const held = outline.phases.find(
      (one) =>
        one.heading === heading &&
        one.rules.length > 0 &&
        one.block.id === block.block.id &&
        one.block.priority === block.block.priority,
    );
    const all = [...new Set([...(held?.rules ?? []), ...rules])];
    return {
      held: held && sourceOf(held),
      text: blockLine({ ...block.block, rules: all.join(",") }),
    };
  };

  const pushedOps = (block, pushed) => {
    const at = sourceOf(block);
    const ops = [];
    const own = pushed.named.get(block.heading);
    if (!own) ops.push({ kind: "remove", at });
    else {
      const { held, text } = rulesBlock(block, block.heading, own);
      if (held === undefined) ops.push({ kind: "replace", at, text });
      else
        ops.push({ kind: "replace", at: held, text }, { kind: "remove", at });
    }
    for (const heading of pushed.whole)
      ops.push({
        kind: "insert",
        at: map.headings.get(heading),
        text: blockLine(block.block),
      });
    for (const [heading, rules] of pushed.named) {
      if (heading === block.heading) continue;
      const { held, text } = rulesBlock(block, heading, rules);
      ops.push(
        held === undefined
          ? { kind: "insert", at: map.headings.get(heading), text }
          : { kind: "replace", at: held, text },
      );
    }
    const where = [
      ...pushed.whole.map((heading) => `placed it under \`${heading}\``),
      ...[...pushed.named].map(
        ([heading, rules]) =>
          `named ${rules.join(", ")} under ${heading === null ? "the page" : `\`${heading}\``}`,
      ),
    ];
    const note = `kept launched lines out of \`${lines[at]}\`${where.length > 0 ? `: ${where.join("; ")}` : ""}`;
    return { ops, note };
  };

  const holds = (ops, block) => {
    const read = outlineAt(applyOps(text, [], ops));
    if (read.outline.lines.length !== outline.lines.length) return false;
    return read.outline.lines.every((line, index) => {
      const now = read.phases.line(line);
      if (wants[index] === "keep")
        return (
          now?.phase === before[index]?.phase &&
          now?.priority === before[index]?.priority
        );
      if (wants[index] === "launch")
        return (
          phases.blockOf(outline.lines[index]) !== block || now === undefined
        );
      return true;
    });
  };

  const ops = [];
  const notes = [];
  for (const block of offending) {
    const pushed = pushDown(outline, phases, block, wants);
    if (!pushed) continue;
    const made = pushedOps(block, pushed);
    if (!holds([...ops, ...made.ops], block)) continue;
    ops.push(...made.ops);
    notes.push(made.note);
  }
  return { ops, notes };
}

function blockEdits(path, source, page, units, phase, next, moving) {
  const lines = source.split("\n");
  const map = sourceMap(lines);
  const placed = page.outline.phases;
  if (map.blocks.length !== placed.length)
    throw new Error(
      `${path}: found ${map.blocks.length} phase lines but the page places ${placed.length} blocks`,
    );
  const ops = [];
  const notes = [];
  /** A next-phase rules block under a heading, to extend: line → rules. */
  const extended = new Map();
  const nextRulesBlock = (heading, priority) =>
    placed.findIndex(
      (one) =>
        one.heading === heading &&
        one.block.id === next?.id &&
        one.block.priority === priority &&
        one.rules.length > 0,
    );
  const extend = (index, rules) => {
    const at = map.blocks[index];
    const held = extended.get(at) ?? {
      block: placed[index].block,
      rules: [...placed[index].rules],
    };
    for (const rule of rules)
      if (!held.rules.includes(rule)) held.rules.push(rule);
    extended.set(at, held);
  };

  placed.forEach((one, index) => {
    if (one.block.id !== phase.id) return;
    const at = map.blocks[index];
    const covered = coveredBy(lines, at, one.block, page.outline.lines.length);
    const keys =
      covered.length > 0
        ? [...new Set(covered.map((line) => units[line]).filter(Boolean))]
        : [
            unitsOf([
              {
                ...page,
                outline: { ...page.outline, lines: [], phases: [one] },
              },
            ])[0]?.key,
          ].filter(Boolean);
    const movers = keys.filter((key) => moving.has(key));
    if (movers.length === 0) {
      ops.push({ kind: "remove", at });
      notes.push(`removed \`${lines[at]}\``);
      return;
    }
    const moved = { ...one.block, id: next.id };
    if (one.rules.length === 0) {
      if (movers.length === keys.length) {
        ops.push({ kind: "replace", at, text: blockLine(moved) });
        notes.push(`moved \`${lines[at]}\` to ${next.name}`);
        return;
      }
      if (one.heading !== null)
        throw new Error(
          `${path}: \`${lines[at]}\` covers units that launch and units that move — split it by hand`,
        );
      const opening = [];
      for (const key of movers) {
        const sectionLines = covered.filter((line) => units[line] === key);
        const section = page.outline.lines[sectionLines[0]]?.section ?? "";
        if (section === "") {
          for (const line of sectionLines) {
            const { rule, within } = page.outline.lines[line];
            if (rule && within.length === 0) opening.push(rule.anchor);
          }
          continue;
        }
        const heading = map.sections.get(section);
        if (heading === undefined)
          throw new Error(
            `${path}: no \`## \` heading reads as \`${section}\``,
          );
        const block = {
          type: "phase",
          id: next.id,
          priority: one.block.priority,
        };
        ops.push({ kind: "insert", at: heading, text: blockLine(block) });
        notes.push(`placed \`${blockLine(block)}\` under \`${section}\``);
      }
      if (opening.length === 0) {
        ops.push({ kind: "remove", at });
        notes.push(`removed \`${lines[at]}\``);
      } else {
        const block = { ...moved, rules: opening.join(",") };
        ops.push({ kind: "replace", at, text: blockLine(block) });
        notes.push(`narrowed \`${lines[at]}\` to \`${blockLine(block)}\``);
      }
      return;
    }
    const ruleUnit = (rule) => {
      const line = covered.find(
        (index) => page.outline.lines[index].rule?.anchor === rule,
      );
      return line === undefined ? undefined : units[line];
    };
    const rules = one.rules.filter((rule) => moving.has(ruleUnit(rule)));
    const existing = nextRulesBlock(one.heading, one.block.priority);
    if (existing !== -1) {
      extend(existing, rules);
      ops.push({ kind: "remove", at });
      notes.push(
        `moved ${rules.map((rule) => `\`${rule}\``).join(", ")} into \`${lines[map.blocks[existing]]}\``,
      );
      return;
    }
    const block = { ...moved, rules: rules.join(",") };
    ops.push({ kind: "replace", at, text: blockLine(block) });
    notes.push(
      `${rules.length === one.rules.length ? "moved" : "narrowed"} \`${lines[at]}\` to \`${blockLine(block)}\``,
    );
  });
  for (const [at, held] of extended)
    ops.push({
      kind: "replace",
      at,
      text: blockLine({ ...held.block, rules: held.rules.join(",") }),
    });
  return { ops, notes };
}

/** The outline lines a block covers: those that land in a probe phase once
 * the block names it. */
function coveredBy(lines, at, block, count) {
  const probe = [...lines];
  probe[at] = blockLine({ ...block, id: PROBE });
  const { outline, phases } = outlineAt(probe.join("\n"));
  if (outline.lines.length !== count)
    throw new Error("a probe changed the page's lines");
  return outline.lines.flatMap((line, index) =>
    phases.line(line)?.phase === PROBE ? [index] : [],
  );
}

/**
 * A page's source with its edits made line by line: a mark taken off, a
 * block line replaced, removed with the blank line after it, or a block
 * placed after a heading with blank lines around it.
 */
export function applyEdits(source, { marks = [], ops = [], settle = [] }) {
  const first = applyOps(source, marks, ops);
  return settle.length > 0 ? applyOps(first, [], settle) : first;
}

function applyOps(source, marks, ops) {
  const lines = source.split("\n");
  const replaced = new Map(marks.map((edit) => [edit.at, edit.after]));
  const removed = new Set();
  const inserts = new Map();
  for (const op of ops) {
    if (op.kind === "replace") replaced.set(op.at, op.text);
    else if (op.kind === "remove") removed.add(op.at);
    else inserts.set(op.at, [...(inserts.get(op.at) ?? []), op.text]);
  }
  const out = [];
  let skipBlank = false;
  lines.forEach((line, at) => {
    if (removed.has(at) && !replaced.has(at)) {
      if (lines[at + 1] === "") skipBlank = true;
      else if (out.at(-1) === "") out.pop();
      return;
    }
    if (skipBlank && line === "") {
      skipBlank = false;
      return;
    }
    skipBlank = false;
    out.push(replaced.get(at) ?? line);
    const added = inserts.get(at);
    if (!added) return;
    for (const text of added) out.push("", text);
    if (lines[at + 1] !== "") out.push("");
  });
  return out.join("\n");
}

/** Edits applied and proven canonical; throws naming the page that is not. */
export function editedPages(store, edits) {
  const texts = new Map();
  for (const [path, edit] of edits) {
    const text = applyEdits(store.sources.get(path), edit);
    let canonical;
    try {
      canonical = serializePage(parsePage(text));
    } catch (cause) {
      throw new Error(
        `${path}: the edited page does not parse — ${cause.message}`,
      );
    }
    if (canonical !== text)
      throw new Error(
        `${path}: the edited page is not the canonical text the editor writes`,
      );
    texts.set(path, text);
  }
  return texts;
}

/** The store read again with edited pages, for a plan to prove itself. */
export function readEdited(store, texts) {
  const asts = new Map(store.asts);
  for (const [path, text] of texts) asts.set(path, parsePage(text));
  return store.read(asts);
}

/**
 * Proves a release's edits: no line is left in the phase, a moving unit's
 * lines all land in the next phase, every line outside the phase stays
 * where it was, and a launching unit's lines read in no phase — those that
 * still read in one are returned, and the release cannot be written.
 */
export function proveRelease(store, plan, after) {
  const moving = new Set(plan.moves.map((one) => one.unit.key));
  const launching = new Set(plan.launches.map((one) => one.unit.key));
  const stillPlaced = [];
  for (const [path, page] of store.reading.pages) {
    const edited = after.pages.get(path);
    const lines = edited.outline.lines;
    if (lines.length !== page.outline.lines.length)
      throw new Error(`${path}: the release changed the page's lines`);
    const units = lineUnits(page);
    page.outline.lines.forEach((line, index) => {
      const now = edited.phases.line(lines[index]);
      const was = page.phases.line(line);
      if (now?.phase === plan.phase.id)
        throw new Error(
          `${path}: \`${line.text}\` is still in ${plan.phase.name}`,
        );
      const key = units[index];
      if (moving.has(key)) {
        if (now?.phase !== plan.next.id || now.priority !== was.priority)
          throw new Error(
            `${path}: \`${line.text}\` did not move to ${plan.next.name} at ${was.priority}`,
          );
      } else if (launching.has(key)) {
        if (now) stillPlaced.push({ path, text: line.text, phase: now.phase });
      } else if (
        was?.phase !== plan.phase.id &&
        key !== undefined &&
        (now?.phase !== was?.phase || now?.priority !== was?.priority)
      )
        throw new Error(
          `${path}: the release moved \`${line.text}\` from ${was?.phase ?? "no phase"} to ${now?.phase ?? "no phase"}`,
        );
    });
  }
  if (after.units.some((unit) => unit.phase === plan.phase.id))
    throw new Error(`a unit is still in ${plan.phase.name}`);
  return stillPlaced;
}

/**
 * The fingerprint of a release as its dry run shows it: the phase and day,
 * what launches and moves, and every page and line it writes. A written
 * release must name the fingerprint a person confirmed.
 */
export function releaseFingerprint(plan, date, texts) {
  const named = (list) => list.map((one) => `${one.unit.priority} ${one.name}`);
  return createHash("sha256")
    .update(
      JSON.stringify({
        phase: plan.phase.id,
        date,
        launches: named(plan.launches),
        moves: named(plan.moves),
        pages: [...texts].sort(([a], [b]) => a.localeCompare(b)),
      }),
    )
    .digest("hex");
}

/** `phases.yaml` with `released: <date>` written on one phase, its comments
 * and every other line kept. */
export function writeReleased(text, phaseId, date) {
  const lines = text.split("\n");
  const start = lines.findIndex((line) =>
    new RegExp(`^\\s*-\\s+id:\\s*${phaseId}\\s*$`).test(line),
  );
  if (start === -1)
    throw new Error(`phases.yaml lists no \`- id: ${phaseId}\``);
  let end = start + 1;
  while (end < lines.length && /^\s+[A-Za-z_]+:/.test(lines[end])) end += 1;
  const indent = /^(\s*)/.exec(lines[start + 1] ?? "")[1] || "    ";
  const existing = lines
    .slice(start, end)
    .findIndex((line) => /^\s*released:/.test(line));
  if (existing !== -1) lines[start + existing] = `${indent}released: ${date}`;
  else lines.splice(end, 0, `${indent}released: ${date}`);
  return lines.join("\n");
}

/** The commit scope: the one directory every page sits in, else `planning`. */
export function domainOf(paths) {
  const dirs = new Set(paths.map((path) => path.split("/").at(-2)));
  return dirs.size === 1 ? [...dirs][0] : "planning";
}
