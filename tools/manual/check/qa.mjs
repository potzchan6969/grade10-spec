/*
 * RULES: the acceptance a spec claims — the journeys it says accept it, and
 * the suite sitting beside it.
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
    checkAcceptedBy(ctx, spec, dir);
    checkSuite(ctx, spec, dir);
  }
}

/** RULE `accepted`: a journey is accepted by scenarios, and an id that
 * resolves to none of the spec's own is a story nothing proves. */
function checkAcceptedBy(ctx, spec, dir) {
  const issued = scenarioIds(spec);
  for (const journey of spec.journeys ?? []) {
    for (const id of journey.acceptedBy) {
      if (issued.has(id)) continue;
      ctx.add(
        "accepted",
        `${dir}/user-journeys.md`,
        `${journey.id} is accepted by \`${id}\`, which this spec issues nowhere`,
      );
    }
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

function checkSuite(ctx, spec, dir) {
  const file = `${dir}/feature-tcs.md`;
  if (!existsSync(join(ctx.roots.store, file)) || spec.testCasesError) return;
  const suite = suiteOf(spec);
  const issued = scenarioIds(spec);
  // A case traces the journey it walks, and reaches the scenarios that
  // journey is accepted by; an older case names a scenario outright.
  const accepted = new Map(
    (spec.journeys ?? []).map((one) => [one.id, one.acceptedBy]),
  );
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

/** RULE `trace`: the id is the only thread between a case and the behaviour
 * it proves. One that names no journey or scenario of the spec's own is a
 * case standing behind nothing. */
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
