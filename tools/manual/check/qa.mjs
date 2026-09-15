/*
 * RULES: the anchors a spec claims — the story or feature-set group each
 * scenario serves, and the suite sitting beside it.
 *
 * Neither the spec nor the suite names the other. A scenario points up at an
 * anchor with `**Serves:**`, a case points up at one with `**Trace:**`, and the
 * join between them runs through the anchor. The old `**Accepted by:**` list
 * ran the link the other way as well, and a file written from the file it is
 * meant to check inherits its blind spots.
 *
 * Every one of these is asked of the spec directory, never of a page. A
 * suite's integrity used to be gated on some page having authored a
 * `::cases` block, which made a documentation choice decide whether QA's
 * work was checked at all; the page keeps only what is page-shaped, which is
 * the id it names.
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { plural, scenarioIds } from "./context.mjs";

export function checkAcceptance(ctx, shape) {
  for (const [id, dir] of shape.dirs) {
    const spec = ctx.specs.get(id);
    // A spec the readers refused issues nothing this can measure against,
    // and the store rule already names it.
    if (!spec || spec.error) continue;
    checkServes(ctx, spec, dir);
    checkSuite(ctx, spec, dir);
  }
}

/** Every anchor this capability offers: its stories, and the root groups of
 * its feature set. A capability nobody walks has only the second kind, which
 * is what `**Walked by:** nobody` routes it to. */
function anchorsOf(spec) {
  return new Set([
    ...(spec.journeys ?? []).map((one) => one.id),
    ...(spec.featureGroups ?? []),
  ]);
}

/** RULE `serves`: a scenario names the anchor it serves, and an anchor that
 * resolves to neither a story nor a feature set group is a scenario standing
 * under nothing. Reported once per capability: before the store is migrated
 * every scenario is missing the line, and one finding per scenario would bury
 * the capabilities that are actually wrong. */
function checkServes(ctx, spec, dir) {
  const anchors = anchorsOf(spec);
  const missing = [];
  const unresolved = [];
  for (const requirement of spec.requirements ?? []) {
    for (const scenario of requirement.scenarios ?? []) {
      if (!scenario.id) continue;
      const serves = scenario.serves ?? [];
      if (serves.length === 0) missing.push(scenario.id);
      for (const anchor of serves) {
        if (anchors.has(anchor)) continue;
        unresolved.push(`${scenario.id} → \`${anchor}\``);
      }
    }
  }
  if (missing.length > 0) {
    ctx.add(
      "anchorless",
      `${dir}/spec.md`,
      `${plural(missing.length, "scenario")} carry no \`**Serves:**\` line (${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", …" : ""})`,
    );
  }
  for (const one of unresolved) {
    ctx.add(
      "serves",
      `${dir}/spec.md`,
      `${one}, which is neither a story nor a feature set group of \`${spec.id}\``,
    );
  }
}

/** The suite as the reader already read it. Re-opening the file here would put
 * a second parse between the check and the app, and the entry carries every
 * field these rules ask of it. */
function suiteOf(spec) {
  return {
    status: spec.testCasesStatus,
    cases: spec.testCases ?? [],
    outOfSuite: spec.outOfSuite ?? [],
  };
}

/** RULE `derived`: a capability with anchors pairs them with a suite.
 * `**Walked by:** nobody` is no longer an exemption — it routes the anchors to
 * the feature set instead of the stories, and the capability still carries a
 * suite. Money amounts, dates and times and localization are where a boundary
 * or precision miss costs most, and they were exactly what the old exemption
 * excluded from test design. */
function checkDerived(ctx, spec, dir, present) {
  if (present || spec.journeysError) return;
  if (spec.journeys === undefined) return;
  const anchors = anchorsOf(spec);
  if (anchors.size === 0) return;
  const how = spec.unwalked
    ? "nobody walks it, so its anchors are its feature set groups"
    : "it holds stories";
  ctx.add(
    "derived",
    `${dir}/feature-tcs.md`,
    `missing: \`${spec.id}\` has anchors — ${how} — so write the suite with \`/spec-to-tcs feature ${spec.id}\``,
  );
}

/** RULE `outline`: `spec-outline` and `spec-behaviour` are two passes over one
 * `spec.md`, and `openspec status` cannot tell them apart — both glob the file,
 * so it calls the second done the moment the first writes anything. A suite
 * sitting beside a spec that carries no requirements is the state that gap
 * hides: the outline was written, the blind pass ran, and the scenarios never
 * came back. */
function checkOutlineOnly(ctx, spec, dir, present) {
  if (!present) return;
  if ((spec.requirements ?? []).length > 0) return;
  ctx.add(
    "outline",
    `${dir}/spec.md`,
    `carries no requirements, and a suite sits beside it — the outline pass landed and the scenarios did not`,
  );
}

function checkSuite(ctx, spec, dir) {
  const file = `${dir}/feature-tcs.md`;
  const present = existsSync(join(ctx.roots.store, file));
  checkDerived(ctx, spec, dir, present);
  checkOutlineOnly(ctx, spec, dir, present);
  if (!present || spec.testCasesError) return;
  const suite = suiteOf(spec);
  const issued = scenarioIds(spec);
  // A case walks an anchor and reaches every scenario that serves the same
  // one; an older case names a scenario outright. The join runs through the
  // anchor, never through a link the two files keep on each other.
  const accepted = new Map();
  for (const requirement of spec.requirements ?? []) {
    for (const scenario of requirement.scenarios ?? []) {
      if (!scenario.id) continue;
      for (const anchor of scenario.serves ?? []) {
        const at = accepted.get(anchor);
        if (at) at.push(scenario.id);
        else accepted.set(anchor, [scenario.id]);
      }
    }
  }
  for (const anchor of anchorsOf(spec)) {
    if (!accepted.has(anchor)) accepted.set(anchor, []);
  }
  // Living cases only: a deprecated case is history, and counting its traces
  // is how a scenario read as covered after it lost its last case.
  const traced = new Map();
  for (const test of suite.cases) {
    if (test.status === "deprecated") continue;
    for (const trace of test.traces) {
      for (const id of accepted.get(trace) ?? [trace]) traced.set(id, test.id);
    }
  }

  checkTraces(ctx, file, spec, suite, issued, accepted);
  checkAuthority(ctx, file, suite);
  checkCoverage(ctx, file, spec, suite, issued, traced);

  if (!ctx.cased.has(spec.id)) {
    ctx.add(
      "suite",
      file,
      `holds ${plural(suite.cases.length, "test case")} and no page shows them`,
    );
  }
}

/** RULE `trace`: the anchor is the only thread between a case and the
 * behaviour it proves. One that names no story, feature set group or scenario
 * of the spec's own is a case standing behind nothing. */
function checkTraces(ctx, file, spec, suite, issued, accepted) {
  for (const test of suite.cases) {
    for (const trace of test.traces) {
      if (issued.has(trace) || accepted.has(trace)) continue;
      ctx.add(
        "trace",
        file,
        `${test.id} traces \`${trace}\`, which \`${spec.id}\` issues nowhere — retrace it or retire the case`,
      );
    }
  }
}

/** RULE `authority`: the file status summarises its cases, so `approved`
 * over a draft is the file claiming a review that never happened. */
function checkAuthority(ctx, file, suite) {
  if (suite.status !== "approved") return;
  const drafts = suite.cases.filter((one) => one.status === "draft");
  if (drafts.length === 0) return;
  ctx.add(
    "authority",
    file,
    `\`**Status:** approved\` over ${draftList(drafts)} — a draft must never wear an approved suite's authority`,
  );
}

/** RULE `coverage`: an untraced scenario is a hole in the suite, and a
 * number with no names is not a task. `**Out of suite:**` is how a hole is
 * closed deliberately, so what this reports is always work. */
function checkCoverage(ctx, file, spec, suite, issued, traced) {
  for (const id of suite.outOfSuite) {
    const test = traced.get(id);
    if (test) {
      ctx.add(
        "coverage",
        file,
        `\`${id}\` is listed out of suite and ${test} traces it — drop it from the list or retire the case`,
      );
    } else if (!issued.has(id)) {
      ctx.add(
        "coverage",
        file,
        `\`${id}\` is listed out of suite, and \`${spec.id}\` issues no such scenario`,
      );
    }
  }

  const exempt = new Set(suite.outOfSuite);
  const untraced = [...issued].filter(
    (id) => !traced.has(id) && !exempt.has(id),
  );
  if (untraced.length === 0) return;
  ctx.add(
    "coverage",
    file,
    `no case traces ${untraced.join(", ")} — cover them, or list them under \`**Out of suite:**\``,
  );
}

const draftList = (drafts) =>
  `${plural(drafts.length, "draft case")} (${drafts.map((one) => one.id).join(", ")})`;
