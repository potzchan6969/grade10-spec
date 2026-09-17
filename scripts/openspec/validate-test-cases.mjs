#!/usr/bin/env node
/**
 * Validate every suite - `feature-tcs.md`, `domain-tcs.md`, `product-tcs.md`
 * and `platform-tcs.md` - against `docs/governance/specs-to-test-cases.md`.
 *
 *   pnpm run tcs:validate            # errors fail the run; warnings are printed
 *   pnpm run tcs:validate -- --strict   # warnings fail too
 *   pnpm run tcs:stale               # which suites' drafts are below the current rules rev
 *
 * A suite is a derived reading of the `spec.md` beside it, so almost everything
 * here is a cross-check against that file rather than a taste judgement:
 * a journey heading names a journey the spec defines, a case traces an id the
 * spec still issues, and the file's own `**Status:**` is the value its case
 * statuses imply — never an independent claim a reviewer typed.
 *
 * Two severities, deliberately:
 *
 *   error    the suite says something untrue (a status that contradicts its
 *            cases, a trace to an id the spec never issued, a duplicate id, a
 *            case with nothing to verify). CI fails on these.
 *   warning  the suite is honest but written in an older shape (a `**Covers:**`
 *            list, a `**Properties:**` block at the end of a case, a trace
 *            carrying a scenario id where the journey id belongs). These are
 *            printed, and `--strict` turns them into errors once the store has
 *            no legacy suites left.
 *
 * Zero dependencies: Node built-ins only, matching the other scripts here.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import {
  CASE_STATUSES,
  caseIndex,
  currentRulesRev,
  decisionsBeside,
  deriveStatus,
  dirsHolding,
  domainPrefix,
  FILE_STATUSES,
  findSuites,
  issuedPrefix,
  LEGACY_TYPES,
  levelOf,
  PROPERTIES,
  parseSuite,
  ROOT,
  readDomainIds,
  readSpecIds,
  revCmp,
  revText,
  statusCounts,
} from "./lib/suites.mjs";

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = (s) => c("1", s);
const dim = (s) => c("2", s);
const red = (s) => c("31", s);
const green = (s) => c("32", s);
const yellow = (s) => c("33", s);
const cyan = (s) => c("36", s);

function help() {
  console.log(`Usage: node scripts/openspec/validate-test-cases.mjs [<scope>] [flags]

  <scope>   Only check suites whose repo-relative path contains this string.

Flags:
  --strict          Treat warnings as errors (legacy-shape suites fail too)
  --stale-report    Skip validation; list suites whose drafts sit below the
                    current tcs-rules rev, for a per-capability update run
  --require-suites  Also report a capability that has journeys but no suite
                    beside it (warning)
  --capture-baseline=<file>
                    Write every case id and its traces to <file>, before a
                    sweep, and exit
  --swept=<file>    Assert the store still holds exactly the case ids and
                    traces <file> recorded. A sweep may re-word a draft; it
                    may never change what a case claims
  --help            Print this help and exit
`);
}

function parseArgs(argv) {
  const args = {
    strict: false,
    stale: false,
    requireSuites: false,
    scope: null,
    captureBaseline: null,
    swept: null,
  };
  const rest = [];
  for (const a of argv) {
    if (a === "--help" || a === "-h") {
      help();
      process.exit(0);
    } else if (a === "--strict") args.strict = true;
    else if (a === "--stale-report") args.stale = true;
    else if (a === "--require-suites") args.requireSuites = true;
    else if (a.startsWith("--capture-baseline="))
      args.captureBaseline = a.slice("--capture-baseline=".length);
    else if (a.startsWith("--swept=")) args.swept = a.slice("--swept=".length);
    else rest.push(a);
  }
  args.scope = rest[0] ?? null;
  return args;
}

const problems = [];
const record = (severity, file, line, message) =>
  problems.push({ severity, file, line, message });

function checkSuite(root, filePath, rulesRev) {
  const rel = relative(root, filePath);
  const text = readFileSync(filePath, "utf8");
  const dir = dirname(filePath);
  const suite = parseSuite(text);
  const domain = basename(filePath) === "domain-tcs.md";
  const spec = domain ? readDomainIds(dir) : readSpecIds(join(dir, "spec.md"));
  const capability = domain
    ? domainPrefix(root, dir)
    : (issuedPrefix(spec) ?? basename(dir));
  const err = (line, msg) => record("error", rel, line, msg);
  const warn = (line, msg) => record("warning", rel, line, msg);

  if (!spec)
    err(
      1,
      domain
        ? "no capability with a spec.md under this domain — a domain suite reads the journeys its capabilities issue"
        : "no spec.md beside this suite — a suite is a reading of a spec, not a standalone file",
    );

  const cases = [];
  for (const j of suite.journeys) for (const tc of j.cases) cases.push(tc);

  // --- file header -------------------------------------------------------
  if (!suite.status) err(1, "no `**Status:**` line");
  else if (!FILE_STATUSES.includes(suite.status))
    err(
      1,
      `file status \`${suite.status}\` is not one of ${FILE_STATUSES.join(", ")}`,
    );

  const counts = statusCounts(cases);
  const derived = deriveStatus(counts, cases.length);
  if (
    suite.status &&
    FILE_STATUSES.includes(suite.status) &&
    suite.status !== derived
  )
    err(
      1,
      `file status is \`${suite.status}\` but its cases imply \`${derived}\` ` +
        `(${counts.draft} draft, ${counts.actual} actual, ${counts.deprecated} deprecated) — ` +
        "the file status is derived, never chosen",
    );

  // --- the blind reading's own output ------------------------------------
  // A feature suite is an independent reading, and its raised questions are the
  // half a derived reading could not have produced. They no longer close the
  // file: they go to the change's `decisions.md`, under `## Raised`, where the
  // author is already reading and where every row owes a landing before the
  // change merges. `pnpm check:manual` reads that table; what is left here is
  // refusing the list in the wrong place.
  //
  // Gated on the change carrying a `decisions.md`. A suite written before that
  // artifact existed keeps its own section and its own signal — the empty-list
  // warning below — because there is nowhere else for its questions to go, and
  // a register of files that could not have complied is one people read past.
  if (!domain && suite.raised !== null) {
    if (decisionsBeside(filePath))
      err(
        1,
        "carries `## Raised` — the blind reading's questions go to the change's `decisions.md`, where every row owes a landing before the change merges",
      );
    else if (suite.raised === 0 && suite.reconciliation !== null)
      warn(
        1,
        "`## Raised` is empty — the Run line says what the reader saw, never how it read; several empty runs mean the second reading has stopped being a second reading",
      );
  }

  if (counts.draft > 0 && !suite.draftsStyled)
    err(
      1,
      "has draft cases but no `**Drafts styled:** <YYYY-MM-DD>, tcs-rules r<n>` line",
    );
  if (counts.draft === 0 && suite.draftsStyled)
    err(
      suite.draftsStyled.line,
      "carries a `**Drafts styled:**` line but holds no draft case — drop it",
    );
  if (
    suite.draftsStyled &&
    rulesRev !== null &&
    revCmp(suite.draftsStyled.rev, rulesRev) > 0
  )
    err(
      suite.draftsStyled.line,
      `claims tcs-rules ${revText(suite.draftsStyled.rev)}, but the store is at ${revText(rulesRev)}`,
    );
  if (derived === "approved" && !suite.reviewed)
    err(
      1,
      "is approved but carries no `**Reviewed:** <YYYY-MM-DD>, tcs-rules r<n>` line",
    );
  if (derived === "approved" && suite.reviewed && suite.reviewedRev === null)
    warn(
      suite.reviewedLine ?? 1,
      "was approved before the rules revision was recorded — its cases keep their wording, " +
        "and `/spec-to-tcs` does not learn from them until it is reviewed again",
    );
  if (
    suite.reviewedRev !== null &&
    suite.reviewedRev !== undefined &&
    rulesRev !== null &&
    revCmp(suite.reviewedRev, rulesRev) > 0
  )
    err(
      suite.reviewedLine ?? 1,
      `claims it was approved under tcs-rules ${revText(suite.reviewedRev)}, but the store is at ${revText(rulesRev)}`,
    );
  if (derived !== "approved" && suite.reviewed)
    err(1, "carries a `**Reviewed:**` line but is not approved");

  for (const shape of suite.legacy)
    err(1, `written in an older shape: ${shape}`);

  // --- journeys ----------------------------------------------------------
  const seenJourneys = new Set();
  for (const j of suite.journeys) {
    if (j.hyphenated)
      warn(
        j.line,
        `journey heading \`${j.raw}\` uses the spec's hyphenated id; suite headings are compact (e.g. \`${j.capability}-US${j.num}\`)`,
      );
    if (j.capability !== capability)
      err(
        j.line,
        `journey heading names capability \`${j.capability}\`, but this spec issues \`${capability}-\``,
      );
    const canonical = `${j.capability}-US-${String(j.num).padStart(2, "0")}`;
    const alternate = `${j.capability}-US-${j.num}`;
    if (seenJourneys.has(j.num))
      err(j.line, `journey ${j.num} appears more than once`);
    seenJourneys.add(j.num);
    if (
      !domain &&
      spec &&
      !spec.unwalked &&
      spec.journeys.size > 0 &&
      !spec.journeys.has(canonical) &&
      !spec.journeys.has(alternate)
    )
      err(
        j.line,
        `journey \`${canonical}\` is not defined in the spec beside it`,
      );
    // A capability nobody walks carries exactly one section. More than one
    // would have to be numbered by a feature set group's position, and an
    // issued case id is permanent.
    if (!domain && spec?.unwalked && j.num !== 1)
      err(
        j.line,
        `\`${capability}\` says nobody walks it, so its suite carries one section, \`${capability}-US1\` — the feature set groups go on the cases' \`**Trace:**\` lines`,
      );
    const story = new Set(j.story);
    if (
      !(story.has("as a") || story.has("as an")) ||
      !story.has("i want") ||
      !story.has("so that")
    )
      err(
        j.line,
        "journey is missing its three-line story (`**As a**` / `**I want**` / `**so that**`)",
      );
    if (j.cases.length === 0)
      warn(j.line, `journey ${j.raw} holds no test case`);

    const seenTc = new Set();
    for (const tc of j.cases) {
      const at = tc.line;
      if (tc.journeyScoped) {
        if (tc.hyphenated)
          warn(
            at,
            `case id \`${tc.id}\` uses the older hyphenated form; current is \`<capability>-US<n>-TC<m>-<v>\``,
          );
        if (tc.capability !== capability)
          err(at, `case id \`${tc.id}\` names capability \`${tc.capability}\``);
        if (tc.journeyNum !== j.num)
          err(
            at,
            `case \`${tc.id}\` sits under journey ${j.num} but its id says US${tc.journeyNum}`,
          );
        if (seenTc.has(tc.tcNum))
          err(at, `TC${tc.tcNum} appears more than once under ${j.raw}`);
        seenTc.add(tc.tcNum);
        if (tc.version === null)
          warn(at, `case \`${tc.id}\` carries no version suffix`);
        else if (tc.version < 1)
          err(at, `case \`${tc.id}\` has version ${tc.version}`);
      }

      for (const [name, vocab, multi, optional] of PROPERTIES) {
        const raw = tc.props.get(name);
        if (raw === undefined) {
          if (optional)
            warn(
              at,
              `case \`${tc.id}\` is missing its **${name}** property (added in tcs-rules r2)`,
            );
          else err(at, `case \`${tc.id}\` is missing its **${name}** property`);
          continue;
        }
        const value = raw.trim().toLowerCase();
        if (name === "Type" && LEGACY_TYPES.includes(value)) {
          err(
            at,
            `case \`${tc.id}\` has **Type:** \`${value}\` — that is a **Suites** value now; move it and give Type the kind of verification`,
          );
          continue;
        }
        if (!vocab) continue;
        if (multi) {
          const parts = value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean);
          if (parts.length === 0) {
            err(
              at,
              `case \`${tc.id}\` has an empty **${name}:** — write \`none\` when it belongs to no run`,
            );
            continue;
          }
          for (const part of parts)
            if (!vocab.includes(part))
              err(
                at,
                `case \`${tc.id}\` has **${name}:** \`${part}\` — expected one or more of ${vocab.join(", ")}`,
              );
          if (parts.includes("none") && parts.length > 1)
            err(at, `case \`${tc.id}\` lists \`none\` beside another suite`);
        } else if (!vocab.includes(value))
          err(
            at,
            `case \`${tc.id}\` has **${name}:** \`${raw}\` — expected one of ${vocab.join(", ")}`,
          );
      }
      const order = tc.propOrder.filter((n) =>
        PROPERTIES.some(([p]) => p === n),
      );
      const expectedOrder = PROPERTIES.map(([p]) => p).filter((p) =>
        order.includes(p),
      );
      if (order.join("|") !== expectedOrder.join("|"))
        warn(at, `case \`${tc.id}\` lists its properties out of order`);

      const trace = (tc.props.get("Trace") ?? "").trim();
      if (trace && spec) {
        // Commas first: an anchor can be a feature set group name, which has
        // spaces in it. A comma-free part that names no group is split on
        // whitespace, so the older space-separated composed trace still reads.
        const ids = trace
          .split(",")
          .map((one) => one.trim())
          .filter(Boolean)
          .flatMap((one) =>
            spec.groups?.has(one) || !/\s/.test(one) ? [one] : one.split(/\s+/),
          );
        for (const id of ids) {
          if (spec.journeys.has(id)) continue;
          if (spec.groups?.has(id)) continue;
          if (spec.scenarios.has(id)) {
            warn(
              at,
              `case \`${tc.id}\` traces scenario \`${id}\`; a trace carries the anchor the case walks — a journey id (\`${capability}-US-<n>\`), or a \`## Feature set\` root group where nobody walks the capability`,
            );
            continue;
          }
          err(
            at,
            `case \`${tc.id}\` traces \`${id}\`, which is neither a journey nor a feature set group of the spec beside it`,
          );
        }
        if (ids.length > 1 && !domain)
          warn(
            at,
            `case \`${tc.id}\` traces ${ids.length} ids — one journey per case`,
          );
        if (domain && ids.length === 1)
          warn(
            at,
            `case \`${tc.id}\` traces one journey — a domain case crosses capabilities, or it belongs in that capability's own suite`,
          );
      }

      if (!tc.preconditions)
        err(
          at,
          `case \`${tc.id}\` has no pre-conditions line (use \`None.\` when it needs nothing)`,
        );
      if (tc.steps === 0) err(at, `case \`${tc.id}\` has no numbered steps`);
      if (tc.expected === 0)
        err(
          at,
          `case \`${tc.id}\` has an empty Expected Results list — nothing to verify`,
        );
    }
  }

  if (spec && !domain) {
    for (const [id] of spec.journeys) {
      const num = Number(id.match(/-US-(\d+)$/)?.[1]);
      if (!seenJourneys.has(num))
        warn(1, `spec journey \`${id}\` has no section in this suite`);
    }
  }

  return { rel, suite, counts, derived, cases: cases.length };
}

// ---------------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));
const rulesRev = currentRulesRev();
const inScope = (d) =>
  args.scope ? relative(ROOT, d).includes(args.scope) : true;
/** Every `<product>` and `<product>/<domain>` the store actually has, so a
 *  trace id can be read back to the product and domain that issued it. Ids are
 *  `<product>-<domain>-<capability>-US-<n>` and every segment may itself hold a
 *  hyphen, so the only safe parse is the longest known prefix. */
const specsRoot = join(ROOT, "openspec", "specs");
const PRODUCTS = existsSync(specsRoot)
  ? readdirSync(specsRoot, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
  : [];
const DOMAINS = PRODUCTS.flatMap((prod) =>
  readdirSync(join(specsRoot, prod), { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => `${prod}-${e.name}`),
);
const longestPrefix = (id, list) =>
  list
    .filter((v) => id === v || id.startsWith(`${v}-`))
    .sort((a, b) => b.length - a.length)[0] ?? null;
const productOf = (traceId) => longestPrefix(traceId, PRODUCTS);
const domainOf = (traceId) => longestPrefix(traceId, DOMAINS);
const suites = findSuites(ROOT, args.scope);
const specs = dirsHolding(ROOT, "spec.md").filter(inScope);

if (args.stale) {
  if (rulesRev === null) {
    console.log(
      yellow(
        "No `tcs_rules_rev` in docs/governance/specs-to-test-cases.md — nothing to compare against.",
      ),
    );
    process.exit(0);
  }
  console.log(
    `${bold("tcs-rules")} ${revText(rulesRev)}  ${dim("(docs/governance/specs-to-test-cases.md)")}\n`,
  );
  const rows = [];
  for (const p of suites) {
    const text = readFileSync(p, "utf8");
    const suite = parseSuite(text);
    const drafts = (text.match(/^\*\s+\*\*Status:\*\*\s*draft\s*$/gm) ?? [])
      .length;
    if (drafts === 0) continue;
    const rev = suite.draftsStyled?.rev ?? null;
    if (rev !== null && revCmp(rev, rulesRev) === 0) continue;
    rows.push({ rel: relative(ROOT, p), drafts, rev });
  }
  if (rows.length === 0) {
    console.log(`${green("✓")} every suite's drafts are at the current rev.`);
    process.exit(0);
  }
  const w = Math.max(...rows.map((r) => r.rel.length));
  for (const r of rows) {
    const at = r.rev === null ? "unstamped" : revText(r.rev);
    console.log(
      `  ${r.rel.padEnd(w + 2)}${yellow(at.padEnd(11))}${dim(`${r.drafts} draft${r.drafts === 1 ? "" : "s"}`)}`,
    );
  }
  console.log(
    `\n${dim("Update one at a time:")} /spec-to-tcs <capability-or-change>  ${dim("— never in one sweep")}`,
  );
  process.exit(0);
}

if (suites.length === 0) {
  console.log(
    dim(`No suite found${args.scope ? ` for scope "${args.scope}"` : ""}.`),
  );
  process.exit(0);
}

const index = caseIndex(ROOT, suites);

if (args.captureBaseline) {
  const out = {};
  for (const [id, v] of index) out[id] = v.traces;
  writeFileSync(args.captureBaseline, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `${green("✓")} baseline captured: ${index.size} cases across ${suites.length} suites ` +
      `${dim(`→ ${args.captureBaseline}`)}`,
  );
  process.exit(0);
}

if (args.swept) {
  const before = JSON.parse(readFileSync(args.swept, "utf8"));
  const drift = [];
  for (const id of Object.keys(before))
    if (!index.has(id)) drift.push(`case \`${id}\` disappeared`);
  for (const [id, v] of index) {
    if (!(id in before)) {
      drift.push(`case \`${id}\` is new`);
      continue;
    }
    const a = before[id].join(", ");
    const b = v.traces.join(", ");
    if (a !== b) drift.push(`case \`${id}\` traced "${a}", now traces "${b}"`);
  }
  console.log(
    `${bold("Sweep check")}  ${dim(`${index.size} cases against ${args.swept}`)}\n`,
  );
  if (drift.length === 0) {
    console.log(
      `${green("✓")} every case id and trace is unchanged — the sweep changed no claim.`,
    );
    process.exit(0);
  }
  console.log(
    red(
      `${drift.length} change${drift.length === 1 ? "" : "s"} a sweep may not make`,
    ),
  );
  for (const d of drift.slice(0, 40)) console.log(`  ${d}`);
  if (drift.length > 40) console.log(dim(`  … and ${drift.length - 40} more`));
  process.exit(1);
}

const summaries = suites.map((p) => checkSuite(ROOT, p, rulesRev));

// --- every journey is walked by a product user or outside agent ---------
// The classes are the store's two product users. An outside agent such as a
// crawler, preview fetcher, or provider callback may also walk a journey; a
// capability no user or outside agent reaches writes `**Walked by:** nobody
// on their own` instead of inventing one.
{
  /** Checked first: a role that names one of these is not an end user at all,
   *  however many end-user words sit beside it ("QA reviewer planning a pass
   *  for one operator role"). */
  const NOT_AN_END_USER =
    /\b(engineer|developer|qa|reviewer|application|bot|script|scraper|service|system|tester|integrator|consumer)\b/;
  const OUTSIDE_AGENT = /\b(crawler|fetcher|provider)\b/;
  const ADMIN =
    /\b(admin|administrator|operator|staff|treasurer|controller|auditor|manager|moderator|clerk|shopkeeper)\b/;
  const CUSTOMER =
    /\b(customer|collector|member|shopper|buyer|bidder|borrower|guest|person|visitor|user|winner|bidder|watcher)\b/;

  for (const dir of dirsHolding(ROOT, "user-journeys.md").filter(inScope)) {
    const file = join(dir, "user-journeys.md");
    const rel = relative(ROOT, file);
    const lines = readFileSync(file, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^\*\*As an?\*\*\s+(.+?),?\s*$/);
      if (!m) continue;
      const role = m[1].toLowerCase();
      if (NOT_AN_END_USER.test(role))
        record(
          "error",
          rel,
          i + 1,
          `journey is walked by "${m[1]}", which is not an end user — a journey is walked by a customer or an admin, ` +
            "and a capability no end user reaches writes `**Walked by:** nobody on their own` instead",
        );
      else if (
        !ADMIN.test(role) &&
        !CUSTOMER.test(role) &&
        !OUTSIDE_AGENT.test(role)
      )
        record(
          "error",
          rel,
          i + 1,
          `journey is walked by "${m[1]}", which resolves to neither \`customer\` nor \`admin\` — ` +
            "name the class the role belongs to, and put its state or grant in the case's pre-conditions",
        );
    }
  }
}

// --- composed levels trace what they compose ---------------------------
// A case above `feature` exists because no single spec states its path end to
// end. One trace means it is a feature case written at the wrong level.
{
  const need = {
    domain: ["capabilities of that domain", (t) => t],
    product: ["domains of that product", domainOf],
    platform: ["products", productOf],
  };
  for (const [id, v] of index) {
    const rule = need[v.level];
    if (!rule) continue;
    const [what, key] = rule;
    if (v.traces.length < 2) {
      record(
        "error",
        v.rel,
        v.line,
        `case \`${id}\` is a ${v.level} case tracing ${v.traces.length === 1 ? "one journey" : "no journey"} — ` +
          `a ${v.level} case composes two or more, from two or more ${what}`,
      );
      continue;
    }
    const distinct = new Set(v.traces.map((t) => key(t) ?? t));
    if (distinct.size < 2)
      record(
        "error",
        v.rel,
        v.line,
        `case \`${id}\` traces ${v.traces.length} journeys but only one of the ${what} — ` +
          `a ${v.level} case crosses two or more`,
      );
  }
}

// --- one purpose, one case ---------------------------------------------
// Reported, never enforced: a shared trace is evidence of duplication, not
// proof of it. Two cases may cross one journey to verify different things.
{
  const byTraceSet = new Map();
  for (const [id, v] of index) {
    if (v.level === "feature" || v.traces.length === 0) continue;
    const key = `${v.level}::${v.traces.join(", ")}`;
    if (!byTraceSet.has(key)) byTraceSet.set(key, []);
    byTraceSet.get(key).push({ id, rel: v.rel });
  }
  for (const [key, group] of byTraceSet) {
    if (group.length < 2) continue;
    record(
      "warning",
      group[0].rel,
      1,
      `${group.length} cases walk the identical path (${key.split("::")[1]}): ` +
        `${group.map((g) => `\`${g.id}\``).join(", ")} — one purpose, one case`,
    );
  }

  const levelsByJourney = new Map();
  for (const [id, v] of index)
    for (const t of v.traces) {
      if (!levelsByJourney.has(t)) levelsByJourney.set(t, new Map());
      const m = levelsByJourney.get(t);
      m.set(v.level, (m.get(v.level) ?? 0) + 1);
    }
  const crossed = [...levelsByJourney].filter(([, m]) => m.size > 1);
  if (crossed.length > 0) {
    console.log(
      `${bold("Traced at more than one level")}  ${dim("— check the lower cases do not re-test the path the higher one owns")}\n`,
    );
    for (const [journey, m] of crossed.sort())
      console.log(
        `  ${journey.padEnd(52)}${dim([...m].map(([lvl, n]) => `${n} ${lvl}`).join(", "))}`,
      );
    console.log("");
  }
}

if (args.requireSuites) {
  for (const d of specs) {
    if (existsSync(join(d, "feature-tcs.md"))) continue;
    const spec = readSpecIds(join(d, "spec.md"));
    if (spec?.hasJourneySection && spec.journeys.size > 0)
      record(
        "warning",
        relative(ROOT, join(d, "user-journeys.md")),
        1,
        "has user journeys but no feature suite beside it",
      );
  }
}

console.log(
  `${bold("Test-case suites")}  ${dim(`${suites.length} file${suites.length === 1 ? "" : "s"}, tcs-rules ${rulesRev === null ? "unversioned" : revText(rulesRev)}`)}\n`,
);
const w = Math.max(...summaries.map((s) => s.rel.length));
for (const s of summaries) {
  const tally = `${s.counts.draft} draft, ${s.counts.actual} actual, ${s.counts.deprecated} deprecated`;
  console.log(
    `  ${s.rel.padEnd(w + 2)}${cyan(s.derived.padEnd(15))}${dim(tally)}`,
  );
}

const errors = problems.filter((p) => p.severity === "error");
const warnings = problems.filter((p) => p.severity === "warning");

/** Collapse a run of the same complaint so one legacy suite cannot bury the rest. */
const shape = (message) =>
  message.replace(/`[^`]*`/g, "`…`").replace(/\b\d+\b/g, "#");

const print = (list, label, paint) => {
  if (list.length === 0) return;
  console.log(`\n${paint(label)}`);
  let file = null;
  let seen = new Map();
  for (const p of list) {
    if (p.file !== file) {
      file = p.file;
      seen = new Map();
      console.log(`\n  ${bold(file)}`);
    }
    const key = shape(p.message);
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    if (n <= 3) console.log(`    ${dim(`:${p.line}`)}  ${p.message}`);
    else if (n === 4)
      console.log(
        `    ${dim("      … and more of the same; run with --scope to see them all")}`,
      );
  }
};

print(errors, `${errors.length} error${errors.length === 1 ? "" : "s"}`, red);
print(
  warnings,
  `${warnings.length} warning${warnings.length === 1 ? "" : "s"}`,
  yellow,
);

console.log("");
if (errors.length > 0 || (args.strict && warnings.length > 0)) {
  console.log(
    `${red("✗")} suites do not match docs/governance/specs-to-test-cases.md`,
  );
  process.exit(1);
}
if (warnings.length > 0) {
  console.log(
    `${green("✓")} no errors  ${dim(`— ${warnings.length} warning${warnings.length === 1 ? "" : "s"}, not blocking (\`--strict\` fails on these)`)}`,
  );
} else {
  console.log(`${green("✓")} every suite matches the governance format.`);
}
