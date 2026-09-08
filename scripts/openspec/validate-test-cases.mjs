#!/usr/bin/env node
/**
 * Validate every feature suite (`feature-tcs.md`, or `test-cases.md` where a
 * suite predates that name) and every domain `domain-tcs.md` against
 * `docs/governance/specs-to-test-cases.md`.
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

import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(dirname(fileURLToPath(import.meta.url))));
const GOVERNANCE = join(ROOT, "docs", "governance", "specs-to-test-cases.md");

const COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (COLOR ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = (s) => c("1", s);
const dim = (s) => c("2", s);
const red = (s) => c("31", s);
const green = (s) => c("32", s);
const yellow = (s) => c("33", s);
const cyan = (s) => c("36", s);

const FILE_STATUSES = ["pending-review", "in-review", "approved"];
const CASE_STATUSES = ["draft", "actual", "deprecated"];
/** Values that were `Type` before tcs-rules r2 and are `Suites` now. */
const LEGACY_TYPES = ["smoke", "regression"];
const PROPERTIES = [
  ["Severity", ["blocker", "critical", "major", "normal", "minor", "trivial"]],
  ["Priority", ["high", "medium", "low"]],
  ["Status", CASE_STATUSES],
  ["Behaviour", ["positive", "negative", "destructive"]],
  [
    "Type",
    [
      "functional",
      "acceptance",
      "usability",
      "security",
      "performance",
      "compatibility",
      "integration",
    ],
  ],
  // Added in tcs-rules r2. Missing on a suite written before it: a warning,
  // not an error, so the store migrates one reviewed suite at a time.
  [
    "Suites",
    ["smoke", "regression", "release", "exploratory", "none"],
    true,
    true,
  ],
  ["Layer", ["e2e", "api", "unit"]],
  ["Automation status", ["manual", "automated"]],
  [
    "Testability",
    ["automation", "manual", "automation, manual", "manual, automation"],
  ],
  ["Trace", null],
];

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

/** The rules revision the store is currently written against. */
function currentRulesRev() {
  if (!existsSync(GOVERNANCE)) return null;
  const m = readFileSync(GOVERNANCE, "utf8").match(
    /^tcs_rules_rev:\s*(\d+)(?:\.(\d+))?\s*$/m,
  );
  if (!m) return null;
  return { major: Number(m[1]), minor: m[2] === undefined ? 0 : Number(m[2]) };
}

/** A revision as it is written in a stamp: `r3.0`. */
const revText = (r) => (r == null ? "?" : `r${r.major}.${r.minor}`);
/** Negative when a is older than b, 0 when equal. */
const revCmp = (a, b) => a.major - b.major || a.minor - b.minor;

/** The roots a suite or a spec may live under: openspec/specs and each
 *  in-flight change's specs/ (archive is never a target). */
function searchRoots(root) {
  const roots = [join(root, "openspec", "specs")];
  const changes = join(root, "openspec", "changes");
  if (existsSync(changes)) {
    for (const e of readdirSync(changes, { withFileTypes: true })) {
      if (e.isDirectory() && e.name !== "archive")
        roots.push(join(changes, e.name, "specs"));
    }
  }
  return roots;
}

/** Every directory under those roots holding the named file. */
function dirsHolding(root, filename) {
  const found = [];
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    let hit = false;
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name === filename) hit = true;
    }
    if (hit) found.push(dir);
  };
  searchRoots(root).forEach(walk);
  return found;
}

/** Journey and scenario ids the capability issues, plus the journey titles.
 * The stories are their own file beside the spec, so both are read: the
 * scenarios come from `spec.md` and the journeys from `user-journeys.md`. */
function readSpecIds(specPath) {
  if (!existsSync(specPath)) return null;
  const text = readFileSync(specPath, "utf8");
  const journeysPath = specPath.replace(/spec\.md$/, "user-journeys.md");
  const stories = existsSync(journeysPath)
    ? readFileSync(journeysPath, "utf8")
    : "";
  const journeys = new Map();
  const scenarios = new Set();
  for (const line of `${text}\n${stories}`.split("\n")) {
    const j = line.match(/^###\s+([\w-]+-US-\d+):\s*(.+?)\s*$/);
    if (j) journeys.set(j[1], j[2]);
    const s = line.match(/^####\s+Scenario:\s*([\w-]+-SC-\d+)\b/);
    if (s) scenarios.add(s[1]);
    const inline = line.match(/^\s*[-*]\s+`([\w-]+-SC-\d+)`/);
    if (inline) scenarios.add(inline[1]);
  }
  return {
    journeys,
    scenarios,
    hasJourneySection: /^##\s+User journeys\s*$/m.test(stories),
  };
}

/** Split a suite into its header, journey sections and cases. Current format only;
 *  older shapes are detected and reported rather than parsed into silence. */
function parseSuite(text) {
  const lines = text.split("\n");
  const suite = {
    title: null,
    status: null,
    draftsStyled: null,
    reviewed: null,
    journeys: [],
    legacy: new Set(),
  };
  let journey = null;
  let tc = null;

  const pushCase = () => {
    if (tc && journey) journey.cases.push(tc);
    tc = null;
  };
  const pushJourney = () => {
    pushCase();
    if (journey) suite.journeys.push(journey);
    journey = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const h1 = line.match(/^#\s+(.+?)\s*$/);
    if (h1 && suite.title === null) {
      suite.title = h1[1];
      continue;
    }

    if (tc === null && journey === null) {
      const st = line.match(/^\*\*Status:\*\*\s*(\S+)\s*$/);
      if (st) {
        suite.status = st[1].toLowerCase();
        continue;
      }
      const ds = line.match(
        /^\*\*Drafts styled:\*\*\s*(\d{4}-\d{2}-\d{2}),\s*tcs-rules r(\d+)(?:\.(\d+))?\s*$/,
      );
      if (ds) {
        suite.draftsStyled = {
          date: ds[1],
          rev: {
            major: Number(ds[2]),
            minor: ds[3] === undefined ? 0 : Number(ds[3]),
          },
          line: i + 1,
        };
        continue;
      }
      const rv = line.match(
        /^\*\*Reviewed:\*\*\s*(\d{4}-\d{2}-\d{2})(?:,\s*tcs-rules r(\d+)(?:\.(\d+))?)?\s*$/,
      );
      if (rv) {
        suite.reviewed = rv[1];
        suite.reviewedRev =
          rv[2] === undefined
            ? null
            : {
                major: Number(rv[2]),
                minor: rv[3] === undefined ? 0 : Number(rv[3]),
              };
        suite.reviewedLine = i + 1;
        continue;
      }
    }

    const jh = line.match(/^##\s+(([\w-]+)-US-?(\d+)):\s*(.+?)\s*$/);
    if (jh) {
      pushJourney();
      journey = {
        capability: jh[2],
        num: Number(jh[3]),
        raw: jh[1],
        hyphenated: /-US-\d+$/.test(jh[1]),
        title: jh[4],
        line: i + 1,
        story: [],
        cases: [],
      };
      continue;
    }
    if (/^##\s+(Journey|Flow|Requirement)\b/.test(line)) {
      suite.legacy.add(
        "pre-journey-id headings (`## Journey:` / `## Flow` / `## Requirement:`)",
      );
      pushJourney();
      continue;
    }

    const ch = line.match(/^###\s+(\S+):\s*(.+?)\s*$/);
    if (ch) {
      pushCase();
      const id = ch[1];
      const journeyScoped = id.match(
        /^([\w-]+)-US-?(\d+)-TC-?(\d+)(?:-(\d+))?$/,
      );
      if (!journeyScoped)
        suite.legacy.add(
          "case ids that are not `<capability>-US<n>-TC<m>-<v>`",
        );
      tc = {
        id,
        capability: journeyScoped?.[1] ?? null,
        journeyNum: journeyScoped ? Number(journeyScoped[2]) : null,
        tcNum: journeyScoped ? Number(journeyScoped[3]) : null,
        version: journeyScoped?.[4] ? Number(journeyScoped[4]) : null,
        journeyScoped: Boolean(journeyScoped),
        hyphenated: /-US-\d+-TC-\d+/.test(id),
        title: ch[2],
        line: i + 1,
        props: new Map(),
        propOrder: [],
        preconditions: "",
        steps: 0,
        expected: 0,
      };
      continue;
    }

    if (journey && !tc) {
      const story = line.match(/^\*\*(As an?|I want|so that)\*\*/i);
      if (story) journey.story.push(story[1].toLowerCase());
      if (/^\*\*Covers:\*\*/.test(line))
        suite.legacy.add("`**Covers:**` scenario lists");
    }

    if (tc) {
      const prop = line.match(/^[-*]\s+\*\*([\w ]+?):\*\*\s*(.*?)\s*$/);
      if (prop) {
        const name = prop[1] === "Behavior" ? "Behaviour" : prop[1];
        if (PROPERTIES.some(([p]) => p === name)) {
          tc.props.set(name, prop[2]);
          tc.propOrder.push(name);
          if (line.startsWith("-"))
            suite.legacy.add("`-` property bullets (current format uses `*`)");
        }
        continue;
      }
      if (/^\*\*Description:\*\*/.test(line)) {
        suite.legacy.add("`**Description:**` paragraphs");
        continue;
      }
      if (/^\*\*Properties:\*\*/.test(line)) {
        suite.legacy.add("`**Properties:**` blocks at the end of a case");
        continue;
      }
      if (/^\*\*Pre-?conditions:\*\*/.test(line)) {
        if (/^\*\*Preconditions:\*\*/.test(line))
          suite.legacy.add("`**Preconditions:**` (no hyphen)");
        const parts = [line.replace(/^\*\*Pre-?conditions:\*\*/, "").trim()];
        let seenBlank = false;
        for (let j = i + 1; j < lines.length; j++) {
          const t = lines[j];
          if (/^(\*\*|#{2,3}\s|---)/.test(t)) break;
          if (t.trim() === "") {
            if (parts.join("").trim() !== "") break;
            if (seenBlank) break;
            seenBlank = true;
            continue;
          }
          parts.push(t.replace(/^[-*+]\s+/, "").trim());
        }
        tc.preconditions = parts.join(" ").trim();
        continue;
      }
      if (/^\*\*Steps:\*\*/.test(line)) {
        for (let j = i + 1; j < lines.length; j++) {
          const t = lines[j];
          if (/^(\*\*|#{2,3}\s|---)/.test(t)) break;
          if (/^\s*\d+\.\s+\S/.test(t)) tc.steps++;
          else if (/^\|\s*\d+\s*\|/.test(t.trim())) {
            tc.steps++;
            // a legacy step table carries its own expected result per row
            if (t.trim().split("|").filter(Boolean).length >= 3) tc.expected++;
            tc.stepTable = true;
          }
        }
        continue;
      }
      if (
        /^[-*]?\s*\*\*Expected results?:\*\*/i.test(line.trim()) &&
        !/^\*\*Expected Results:\*\*/.test(line)
      ) {
        if (line.replace(/^[-*]?\s*\*\*Expected results?:\*\*/i, "").trim())
          tc.expected++;
        for (let j = i + 1; j < lines.length; j++) {
          if (/^(\*\*|#{2,3}\s|---)/.test(lines[j])) break;
          if (/^[-*+]\s+\S/.test(lines[j])) tc.expected++;
        }
        continue;
      }
      if (/^\*\*Expected Results?:\*\*/.test(line)) {
        for (let j = i + 1; j < lines.length; j++) {
          if (/^(\*\*|#{2,3}\s|---)/.test(lines[j])) break;
          if (/^[-*+]\s+\S/.test(lines[j])) tc.expected++;
        }
        continue;
      }
      if (/^\|\s*#\s*\|\s*Action/i.test(line)) {
        suite.legacy.add("`| # | Action | Expected result |` step tables");
      }
    }
  }
  pushJourney();
  return suite;
}

const problems = [];
const record = (severity, file, line, message) =>
  problems.push({ severity, file, line, message });

/** The prefix a capability issues, read off its spec rather than off its
 * directory. A new capability takes its path form -
 * `grade10-site/loyalty/programme` issues `grade10-site-loyalty-programme-*` -
 * but the prefix is still read from the ids themselves, because an issued id
 * is permanent: a capability that later moves goes on issuing what it always
 * issued rather than invalidating every task, review and case that names one.
 * Only a spec that issues no id at all falls back to the directory name. */
function issuedPrefix(spec) {
  if (!spec) return null;
  const [id] = [...spec.journeys.keys(), ...spec.scenarios];
  return id ? id.replace(/-(?:US|SC)-\d+$/, "") : null;
}

/** A domain suite (`domain-tcs.md`) has no `spec.md` beside it: it reads the journeys
 * every capability in that domain issues. Collect them from each capability one
 * level down, so a domain case can trace the journeys it crosses. */
function readDomainIds(dir) {
  const journeys = new Map();
  const scenarios = new Set();
  let found = false;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const ids = readSpecIds(join(dir, e.name, "spec.md"));
    if (!ids) continue;
    found = true;
    for (const [id, title] of ids.journeys) journeys.set(id, title);
    for (const id of ids.scenarios) scenarios.add(id);
  }
  return found ? { journeys, scenarios, hasJourneySection: true } : null;
}

/** `openspec/specs/grade10-site/auction/` issues `grade10-site-auction-e2e-*`. */
function domainPrefix(root, dir) {
  const rel = relative(root, dir)
    .replace(/^openspec\/specs\//, "")
    .replace(/^openspec\/changes\/[^/]+\/specs\//, "");
  return `${rel.split("/").join("-")}-e2e`;
}

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

  const counts = { draft: 0, actual: 0, deprecated: 0, unknown: 0 };
  for (const tc of cases) {
    const s = (tc.props.get("Status") ?? "").toLowerCase();
    if (CASE_STATUSES.includes(s)) counts[s]++;
    else counts.unknown++;
  }
  const derived =
    cases.length === 0
      ? "pending-review"
      : counts.draft === 0
        ? "approved"
        : counts.actual + counts.deprecated === 0
          ? "pending-review"
          : "in-review";
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
      spec.journeys.size > 0 &&
      !spec.journeys.has(canonical) &&
      !spec.journeys.has(alternate)
    )
      err(
        j.line,
        `journey \`${canonical}\` is not defined in the spec beside it`,
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
        const ids = trace.split(/[,\s]+/).filter(Boolean);
        for (const id of ids) {
          if (spec.journeys.has(id)) continue;
          if (spec.scenarios.has(id)) {
            warn(
              at,
              `case \`${tc.id}\` traces scenario \`${id}\`; a trace carries the journey id (\`${capability}-US-<n>\`)`,
            );
            continue;
          }
          err(
            at,
            `case \`${tc.id}\` traces \`${id}\`, which the spec beside it does not define`,
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
/** The file name carries the level (tcs-rules r3.0). `test-cases.md` is not a
 * suite name: the suites that carried it were renamed when r3.0 landed. */
const SUITE_NAMES = [
  "feature-tcs.md",
  "domain-tcs.md",
  "product-tcs.md",
  "platform-tcs.md",
];
const LEVEL_BY_NAME = {
  "platform-tcs.md": "platform",
  "product-tcs.md": "product",
  "domain-tcs.md": "domain",
  "feature-tcs.md": "feature",
};
const levelOf = (p) => LEVEL_BY_NAME[basename(p)] ?? "feature";

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
const suites = SUITE_NAMES.flatMap((name) =>
  dirsHolding(ROOT, name)
    .filter(inScope)
    .map((d) => join(d, name)),
).sort();
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

/** Every case in the store as `id -> { level, traces }`, read straight from the
 *  text so a sweep is checked against what the files say rather than against a
 *  parse that a sweep might itself have changed. Case ids are permanent and
 *  unique store-wide, so this survives a file being renamed or a case moving
 *  between levels. */
function caseIndex(paths) {
  const index = new Map();
  for (const p of paths) {
    const level = levelOf(p);
    const rel = relative(ROOT, p);
    let id = null;
    let lineNo = 0;
    for (const line of readFileSync(p, "utf8").split("\n")) {
      lineNo += 1;
      const h = line.match(/^###\s+(\S+?):/);
      if (h) {
        id = h[1];
        if (!index.has(id))
          index.set(id, { level, rel, line: lineNo, traces: [] });
        continue;
      }
      const t = line.match(/^\*\s+\*\*Trace:\*\*\s*(.+?)\s*$/);
      if (t && id && index.has(id))
        index.get(id).traces = t[1]
          .split(",")
          .map((v) => v.trim().replace(/^`|`$/g, ""))
          .filter(Boolean)
          .sort();
    }
  }
  return index;
}

const index = caseIndex(suites);

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
  console.log(red(`${drift.length} change${drift.length === 1 ? "" : "s"} a sweep may not make`));
  for (const d of drift.slice(0, 40)) console.log(`  ${d}`);
  if (drift.length > 40) console.log(dim(`  … and ${drift.length - 40} more`));
  process.exit(1);
}

const summaries = suites.map((p) => checkSuite(ROOT, p, rulesRev));

// --- every journey is walked by a customer or an admin -----------------
// The classes are the store's two end users. Every other role a spec names is
// one of them holding a state or a grant, and that belongs in a case's
// pre-conditions. A capability no end user reaches writes `**Walked by:**
// nobody on their own` instead of inventing one.
{
  /** Checked first: a role that names one of these is not an end user at all,
   *  however many end-user words sit beside it ("QA reviewer planning a pass
   *  for one operator role"). */
  const NOT_AN_END_USER =
    /\b(engineer|developer|qa|reviewer|application|crawler|fetcher|bot|script|scraper|service|system|tester|integrator|consumer)\b/;
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
      else if (!ADMIN.test(role) && !CUSTOMER.test(role))
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
