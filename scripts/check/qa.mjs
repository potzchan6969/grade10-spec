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
        `${dir}/spec.md`,
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
    citations: spec.testCaseCitations ?? [],
    outOfSuite: spec.outOfSuite ?? [],
  };
}

function checkSuite(ctx, spec, dir) {
  const file = `${dir}/test-cases.md`;
  if (spec.testCasesError || !existsSync(join(ctx.root, file))) return;
  const suite = suiteOf(spec);
  const issued = scenarioIds(spec);
  // Living cases only: a deprecated case is history, and counting its traces
  // is how a scenario read as covered after it lost its last case.
  const traced = new Map();
  for (const test of suite.cases) {
    if (test.status === "deprecated") continue;
    for (const trace of test.traces) traced.set(trace, test.id);
  }

  checkTraces(ctx, file, spec, suite, issued);
  checkAuthority(ctx, file, suite);
  checkCoverage(ctx, file, spec, suite, issued, traced);
  checkCovers(ctx, file, spec, suite);
  checkSigned(ctx, file, suite);

  if (!ctx.cased.has(spec.id)) {
    ctx.add(
      "suite",
      file,
      `holds ${plural(suite.cases.length, "test case")} and no page shows them`,
    );
  }
}

/** RULE `trace`: the id is the only thread between a case and the behaviour
 * it proves. One that names no scenario is a case standing behind nothing. */
function checkTraces(ctx, file, spec, suite, issued) {
  for (const test of suite.cases) {
    for (const trace of test.traces) {
      if (issued.has(trace)) continue;
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

/** RULE `covers`: the quoted title is what the reviewer read. An id survives
 * a rename by design, so the quote is the only thing that can say the words
 * behind a signed-off case moved. */
function checkCovers(ctx, file, spec, suite) {
  const names = new Map();
  for (const requirement of spec.requirements) {
    for (const scenario of requirement.scenarios) {
      if (scenario.id) names.set(scenario.id, scenario.name);
    }
  }

  for (const cite of suite.citations) {
    const name = names.get(cite.id);
    if (name === undefined) {
      ctx.add(
        "covers",
        file,
        `\`**Covers:**\` names \`${cite.id}\`, which \`${spec.id}\` issues nowhere`,
      );
      continue;
    }
    if (name.trim() === cite.title.trim()) continue;
    ctx.add(
      "covers",
      file,
      `\`**Covers:**\` quotes \`${cite.id}\` as “${cite.title}” and the spec now reads “${name}” — re-review the cases under it, or update the quote`,
    );
  }
}

/** RULE `signed`: a verdict is a person standing behind a case, so `actual`
 * and `deprecated` carry who and when — `**Reviewed by:** @handle - date`.
 * Without it, "who approved this" is unanswerable, which is the one question
 * an audit of a sign-off consists of. */
function checkSigned(ctx, file, suite) {
  for (const test of suite.cases) {
    if (test.status === "draft") continue;
    if (test.reviewedBy && test.reviewedOn) continue;
    ctx.add(
      "signed",
      file,
      `${test.id} is \`${test.status}\` with no \`**Reviewed by:** @handle - YYYY-MM-DD\` — a verdict carries its reviewer`,
    );
  }
}

const draftList = (drafts) =>
  `${plural(drafts.length, "draft case")} (${drafts.map((one) => one.id).join(", ")})`;
