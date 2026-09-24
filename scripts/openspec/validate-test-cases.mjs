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
 * here is a cross-check against the suite's source scope rather than a taste
 * judgement: a feature suite names journeys from one spec, a composed suite
 * reads journeys in the domains or products it crosses, and the file's own `**Status:**` is the value its case
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

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import {
  everySection,
  outline,
  sectionSpan,
} from "../../tools/manual/src/store/markdown.mts";
import { parseArgs } from "./lib/args.mjs";
import { citesId } from "./lib/cites.mjs";
import {
  activeChangeSpecRoots,
  CASE_STATUSES,
  caseIndex,
  changeOf,
  commaList,
  currentRulesRev,
  decisionsBeside,
  deriveStatus,
  dirsHolding,
  domainPrefix,
  FILE_STATUSES,
  findSuites,
  isAutomated,
  issuedPrefix,
  LEGACY_TYPES,
  levelOf,
  PROPERTIES,
  parseSuite,
  productPrefix,
  readDomainIds,
  readPlatformIds,
  readProductIds,
  readSpecIds,
  revCmp,
  revText,
  ROOT as STORE_ROOT,
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

const USAGE = `Usage: node scripts/openspec/validate-test-cases.mjs [<scope>] [flags]

  <scope>   Only check suites whose repo-relative path contains this string.

Flags:
  --strict          Treat warnings as errors (legacy-shape suites fail too)
  --stale-report    Skip validation; list suites whose drafts sit below the
                    current tcs-rules revision, each owed a regenerate
  --require-suites  Also report a capability that has journeys but no suite
                    beside it (warning)
  --capture-baseline <file>
                    Write every case id, its traces and its status to <file>,
                    before a sweep, and exit
  --swept <file>    Assert every case <file> recorded as reviewed (actual or
                    deprecated) is still there with the same traces and status.
                    A sweep regenerates drafts freely; it may never change what
                    a reviewed case claims
  --root <dir>      Read a store other than this one, which is how the tests
                    read a fixture
  --help            Print this help and exit
`;

const problems = [];
const record = (severity, file, line, message) =>
  problems.push({ severity, file, line, message });

/**
 * Where the Manual table sits. It belongs under `## Reconciliation`, where the
 * archive's strip reads it; a `### Manual` anywhere else is refused where it
 * is written (`shared-planning-agent-rounds-SC-103`). Returns the table's span
 * inside the reconciliation, or undefined where there is none.
 */
function checkManualPlacement(text, err) {
  const reconciliation = sectionSpan(text, "Reconciliation");
  if (!reconciliation) return undefined;
  const manual = sectionSpan(
    text,
    "Manual",
    reconciliation.section.children.filter((one) => one.level === 3),
  );
  for (const one of everySection(outline(text))) {
    if (one.level !== 3 || one.heading !== "Manual") continue;
    if (one.line === manual?.section.line) continue;
    err(
      one.line,
      "`### Manual` sits outside `## Reconciliation` — the table belongs under the reconciliation, where the fold reads it",
    );
  }
  return manual;
}

/**
 * The Manual table's rows, held to the tests they credit. A legend above the
 * table binds each name a row uses to a path — `- <name> - \`<path>\`, in
 * this store` — and a row's Why names the tests that prove part of its case
 * in the legend's words. A legend path this store holds is read for the row's
 * case id, and a row whose test cites no such id is refused naming the path
 * and the id (`shared-planning-agent-rounds-SC-106`); a legend line that says
 * `in this store` and names no file there is refused too, since a credit
 * nobody can check is no credit. A path in the application repository is
 * skipped: its ids are checked where that repository ticks the group.
 */
function checkManualRows(root, text, cases, err) {
  const lines = text.split("\n");
  const manual = checkManualPlacement(text, err);
  if (!manual) return;
  const legend = new Map();
  const ids = new Set(cases.map((tc) => tc.id));
  for (let i = manual.from; i < manual.until; i++) {
    const line = lines[i];
    const named = /^[-*]\s+(.+?)\s+-\s+`([^`]+)`,\s+in this store\b/.exec(line);
    if (named) {
      const full = resolve(root, named[2]);
      if (!existsSync(full) || !statSync(full).isFile()) {
        err(
          i + 1,
          `the Manual legend names \`${named[2]}\` in this store, and the store holds no file there — name the test's path, or say it is in the application repository`,
        );
        continue;
      }
      legend.set(named[1].trim(), {
        path: named[2],
        text: readFileSync(full, "utf8"),
        // The name as a whole word in a row's Why, so `the test` is not
        // found inside `the rule's test`.
        pattern: new RegExp(
          `(^|[^\\w'])${named[1].trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w'])`,
          "i",
        ),
      });
      continue;
    }
    const row = /^\|\s*`?([\w-]+-US\d+-TC\d+-\d+)`?\s*\|(.*)\|\s*$/.exec(line);
    if (!row || !ids.has(row[1])) continue;
    for (const [name, test] of legend) {
      if (!test.pattern.test(row[2])) continue;
      if (citesId(test.text, row[1])) continue;
      err(
        i + 1,
        `Manual row for \`${row[1]}\` credits ${name} (\`${test.path}\`), which cites no such case id — name the test that cites it, or say what a person walks instead`,
      );
    }
  }
}

function checkSuite(root, filePath, rulesRev) {
  const rel = relative(root, filePath);
  const text = readFileSync(filePath, "utf8");
  const dir = dirname(filePath);
  const suite = parseSuite(text);
  const level = levelOf(filePath);
  const domain = level === "domain";
  const composed = level !== "feature";
  const spec =
    level === "platform"
      ? readPlatformIds(dir, root)
      : level === "product"
        ? readProductIds(dir, root)
        : level === "domain"
          ? readDomainIds(dir, root)
          : readSpecIds(join(dir, "spec.md"));
  const capability =
    level === "platform"
      ? "platform-e2e"
      : level === "product"
        ? productPrefix(root, dir)
        : level === "domain"
          ? domainPrefix(root, dir)
          : (issuedPrefix(spec) ?? basename(dir));
  const err = (line, msg) => record("error", rel, line, msg);
  const warn = (line, msg) => record("warning", rel, line, msg);

  // Q49 and Q69 (`run-a-round-on-every-artifact`): every automated case of an
  // in-flight change names what decides it, whatever day the change opened.
  // A durable suite under `openspec/specs/` owes nothing yet - back-filling
  // those is a rules revision of its own (Q70) - and the archive is never
  // read here at all.
  const decidedByOwed = changeOf(root, filePath) !== null;

  if (!spec) {
    const missingScope = {
      feature:
        "no spec.md beside this suite — a feature suite reads one capability",
      domain:
        "no capability with a spec.md under this domain — a domain suite reads its capabilities",
      product:
        "no capability with a spec.md under this product — a product suite reads its domains",
      platform:
        "no capability with a spec.md under this platform — a platform suite reads its products",
    }[level];
    err(1, missingScope);
  }

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
  const derived = deriveStatus(
    counts,
    cases.length,
    Boolean(suite.reviewedLapsed),
  );
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
  if (derived === "approved" && suite.reviewedLapsed)
    err(
      suite.reviewedLine ?? 1,
      "is approved again but its `**Reviewed:**` line still reads lapsed — write it fresh: `**Reviewed:** <today>, tcs-rules r<n>`",
    );
  if (derived !== "approved" && suite.reviewed && !suite.reviewedLapsed)
    err(
      suite.reviewedLine ?? 1,
      "carries a `**Reviewed:**` line but is not approved — a file that falls out of `approved` keeps the line and adds `, lapsed <YYYY-MM-DD>`",
    );

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
      level === "feature" &&
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
    if (level === "feature" && spec?.unwalked && j.num !== 1)
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
          const { values: parts, empty } = commaList(value);
          if (parts.length === 0) {
            err(
              at,
              `case \`${tc.id}\` has an empty **${name}:** — write \`none\` when it belongs to no run`,
            );
            continue;
          }
          if (empty > 0)
            err(
              at,
              `case \`${tc.id}\` has an empty element in **${name}:** — a doubled or trailing comma`,
            );
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

      // --- Decided by ------------------------------------------------------
      // One rule, three verdicts: an automated case of an in-flight change
      // names what decides it, in its place, once. Nothing else may.
      const automated = isAutomated(tc);
      if (automated && tc.decidedBy.length === 0 && decidedByOwed)
        err(
          at,
          `case \`${tc.id}\` is \`**Automation status:** automated\` but carries no \`**Decided by:**\` line — name the test that decided it`,
        );
      for (const {
        line,
        bullet,
        misplaced,
        empty,
        repeated,
      } of tc.decidedByLines) {
        if (repeated)
          err(
            line,
            `case \`${tc.id}\` carries a second \`**Decided by:**\` line at line ${line} — one line, every path on it`,
          );
        else if (misplaced)
          err(
            line,
            `case \`${tc.id}\`'s \`**Decided by:**\` line sits at line ${line}, not directly after the classification block — a scanning reader does not look anywhere else`,
          );
        if (empty)
          err(
            line,
            `case \`${tc.id}\`'s \`**Decided by:**\` line at line ${line} has an empty path — a doubled or trailing comma`,
          );
        if (bullet)
          warn(
            line,
            `case \`${tc.id}\` writes \`**Decided by:**\` as a classification bullet at line ${line} — the block is the ten properties, and the line is its own, directly after it`,
          );
      }
      // Resolved against the store this run reads, so a fixture is checked
      // against itself. A path that climbs out of the store names a file no
      // clone of it has, and a directory decides nothing.
      for (const { path, line } of tc.decidedBy) {
        const full = resolve(root, path);
        if (full !== root && !full.startsWith(root + sep)) {
          err(
            line,
            `case \`${tc.id}\`'s \`**Decided by:**\` names \`${path}\`, which resolves outside the store — write it relative to the repository root`,
          );
          continue;
        }
        if (!existsSync(full)) {
          err(
            line,
            `case \`${tc.id}\`'s \`**Decided by:**\` names \`${path}\`, which does not exist in this checkout`,
          );
          continue;
        }
        if (!statSync(full).isFile())
          err(
            line,
            `case \`${tc.id}\`'s \`**Decided by:**\` names \`${path}\`, which is not a file — name the test, not the directory holding it`,
          );
      }
      if (tc.decidedBy.length > 0 && !automated)
        warn(
          at,
          `case \`${tc.id}\` carries \`**Decided by:**\` but its **Automation status** is not \`automated\` — the line only decides an automated case`,
        );

      const trace = (tc.props.get("Trace") ?? "").trim();
      if (trace && spec) {
        // Commas first: an anchor can be a feature set group name, which has
        // spaces in it. A comma-free part that names no group is split on
        // whitespace, so the older space-separated composed trace still reads.
        const { values, empty } = commaList(trace);
        if (empty > 0)
          err(
            at,
            `case \`${tc.id}\` has an empty element in **Trace:** — a doubled or trailing comma`,
          );
        const ids = values.flatMap((one) =>
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
        if (ids.length > 1 && !composed)
          warn(
            at,
            `case \`${tc.id}\` traces ${ids.length} ids — one journey per case`,
          );
        if (composed && ids.length === 1)
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
      // A state only a mock, a stub or a manipulated environment produces is
      // one a script sets up; a case that needs one and plans no automation
      // is raised, not refused (Step 3, Executable without asking).
      if (
        /\b(mock(?:ed|s)?|stub(?:bed|s)?|manipulated)\b/i.test(tc.preconditions) &&
        !/\bautomation\b/.test(tc.props.get("Testability") ?? "")
      )
        warn(
          at,
          `case \`${tc.id}\` needs a mocked or manipulated state but its **Testability** plans no \`automation\``,
        );
      if (tc.expected === 0)
        err(
          at,
          `case \`${tc.id}\` has an empty Expected Results list — nothing to verify`,
        );
    }
  }

  if (spec && level === "feature") {
    for (const [id] of spec.journeys) {
      const num = Number(id.match(/-US-(\d+)$/)?.[1]);
      if (!seenJourneys.has(num))
        warn(1, `spec journey \`${id}\` has no section in this suite`);
    }
  }

  checkManualRows(root, text, cases, err);

  return { rel, suite, counts, derived, cases: cases.length };
}

// ---------------------------------------------------------------------------

const { positional, flags } = parseArgs(process.argv.slice(2), {
  keys: ["capture-baseline", "root", "swept"],
  booleans: ["require-suites", "stale-report", "strict"],
  usage: USAGE,
});
const args = {
  scope: positional[0] ?? null,
  strict: Boolean(flags.strict),
  stale: Boolean(flags["stale-report"]),
  requireSuites: Boolean(flags["require-suites"]),
  captureBaseline: flags["capture-baseline"] ?? null,
  swept: flags.swept ?? null,
};
// The store this run reads. `--root <dir>` names another one - a fixture a
// test writes - the way `archive-preflight.mjs` and `tcs-automated.mjs` take
// it, so a suite's checks are proved by this script rather than by a copy of
// it beside the test.
const ROOT = flags.root ? resolve(flags.root) : STORE_ROOT;
const rulesRev = currentRulesRev();
const inScope = (d) =>
  args.scope ? relative(ROOT, d).includes(args.scope) : true;
/** Every `<product>` and `<product>/<domain>` the store actually has, so a
 *  trace id can be read back to the product and domain that issued it. Ids are
 *  `<product>-<domain>-<capability>-US-<n>` and every segment may itself hold a
 *  hyphen, so the only safe parse is the longest known prefix. */
const specsRoot = join(ROOT, "openspec", "specs");
const specScopes = [specsRoot, ...activeChangeSpecRoots(ROOT)].filter(
  existsSync,
);
const directories = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).filter((entry) =>
        entry.isDirectory(),
      )
    : [];
const PRODUCTS = [
  ...new Set(
    specScopes.flatMap((scope) =>
      directories(scope).map((entry) => entry.name),
    ),
  ),
];
const DOMAINS = [
  ...new Set(
    specScopes.flatMap((scope) =>
      directories(scope).flatMap((product) =>
        directories(join(scope, product.name)).map(
          (domain) => `${product.name}-${domain.name}`,
        ),
      ),
    ),
  ),
];
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
    `\n${dim("Each is owed a regenerate, top down, after one yes:")} /spec-to-tcs <capability-or-change>  ${dim("— or /tcs-review, which regenerates on opening it")}`,
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
  for (const [id, v] of index) out[id] = { traces: v.traces, status: v.status };
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
  // A baseline written before statuses were recorded holds bare trace lists;
  // every case in it is held as reviewed, the safe reading.
  for (const [id, was] of Object.entries(before)) {
    const traces = Array.isArray(was) ? was : was.traces;
    const status = Array.isArray(was) ? null : was.status;
    if (status === "draft") continue;
    if (!index.has(id)) {
      drift.push(`case \`${id}\` disappeared`);
      continue;
    }
    const now = index.get(id);
    const a = traces.join(", ");
    const b = now.traces.join(", ");
    if (a !== b) drift.push(`case \`${id}\` traced "${a}", now traces "${b}"`);
    if (status !== null && now.status !== status)
      drift.push(`case \`${id}\` was ${status}, now ${now.status}`);
  }
  console.log(
    `${bold("Sweep check")}  ${dim(`${index.size} cases against ${args.swept}`)}\n`,
  );
  if (drift.length === 0) {
    console.log(
      `${green("✓")} every reviewed case keeps its id, trace and status — the sweep changed no reviewed claim.`,
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

  /** A capability under `shared/planning/` is the delivery line itself: the
   *  team that runs the store is who walks it, so a hand of a change is an
   *  `admin` there and nowhere else. */
  const PLANNING = /(^|\/)shared\/planning\//;
  const TEAM =
    /\b(teammate|hand|product manager|designer|tech pic|qa|engineer|release hand|reader)\b/;

  for (const dir of dirsHolding(ROOT, "user-journeys.md").filter(inScope)) {
    const file = join(dir, "user-journeys.md");
    const rel = relative(ROOT, file);
    const planning = PLANNING.test(rel);
    const lines = readFileSync(file, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(/^\*\*As an?\*\*\s+(.+?),?\s*$/);
      if (!m) continue;
      const role = m[1].toLowerCase();
      if (planning && TEAM.test(role)) continue;
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
