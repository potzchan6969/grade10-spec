/**
 * One reader for every suite - `feature-tcs.md`, `domain-tcs.md`,
 * `product-tcs.md` and `platform-tcs.md`.
 *
 * Two callers read suites for different reasons, and both need the same
 * reading: `validate-test-cases.mjs` checks a suite against
 * `docs/governance/specs-to-test-cases.md`, and `run-sheet.mjs` copies a
 * selection of cases into a Google Sheet for a manual run. A second parser
 * would drift from the first, and the second reader's drift would be silent -
 * a case whose steps it misread still writes a plausible-looking row.
 *
 * So the parse lives here and says everything either caller needs: the counts
 * the validator judges, and the text the sheet carries.
 *
 * Zero dependencies: Node built-ins only, matching the other scripts here.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = dirname(
  dirname(dirname(dirname(fileURLToPath(import.meta.url)))),
);
export const GOVERNANCE = join(
  ROOT,
  "docs",
  "governance",
  "specs-to-test-cases.md",
);

export const FILE_STATUSES = ["pending-review", "in-review", "approved"];
export const CASE_STATUSES = ["draft", "actual", "deprecated"];
/** Values that were `Type` before tcs-rules r2 and are `Suites` now. */
export const LEGACY_TYPES = ["smoke", "regression"];
export const PROPERTIES = [
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

/** The file name carries the level (tcs-rules r3.0). `test-cases.md` is not a
 * suite name: the suites that carried it were renamed when r3.0 landed. */
export const SUITE_NAMES = [
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
export const levelOf = (p) => LEVEL_BY_NAME[basename(p)] ?? "feature";

// --- the rules revision ----------------------------------------------------

/** The rules revision the store is currently written against. */
export function currentRulesRev() {
  if (!existsSync(GOVERNANCE)) return null;
  const m = readFileSync(GOVERNANCE, "utf8").match(
    /^tcs_rules_rev:\s*(\d+)(?:\.(\d+))?\s*$/m,
  );
  if (!m) return null;
  return { major: Number(m[1]), minor: m[2] === undefined ? 0 : Number(m[2]) };
}

/** A revision as it is written in a stamp: `r3.0`. */
export const revText = (r) => (r == null ? "?" : `r${r.major}.${r.minor}`);
/** Negative when a is older than b, 0 when equal. */
export const revCmp = (a, b) => a.major - b.major || a.minor - b.minor;

// --- where suites and specs live -------------------------------------------

/** The roots a suite or a spec may live under: openspec/specs and each
 *  in-flight change's specs/ (archive is never a target). */
export function searchRoots(root) {
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
export function dirsHolding(root, filename) {
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

/** Every suite file in the store, optionally narrowed to paths holding
 *  `scope`. Scope matches the suite's own path, not its directory:
 *  `platform-tcs.md` sits directly in `openspec/specs`. */
export function findSuites(root, scope = null) {
  return SUITE_NAMES.flatMap((name) =>
    dirsHolding(root, name)
      .map((d) => join(d, name))
      .filter((p) => (scope ? relative(root, p).includes(scope) : true)),
  ).sort();
}

/** The change a path sits in, or `null` for a durable suite. */
export function changeOf(root, filePath) {
  const m = relative(root, filePath).match(/^openspec\/changes\/([^/]+)\//);
  return m && m[1] !== "archive" ? m[1] : null;
}

/** `openspec/specs/grade10-site/store/home/feature-tcs.md` reads
 *  `grade10-site/store/home`, whichever root it sits under. */
export function capabilityId(root, filePath) {
  return relative(root, dirname(filePath))
    .replace(/^openspec\/specs\//, "")
    .replace(/^openspec\/changes\/[^/]+\/specs\//, "");
}

/** `openspec/specs/grade10-site/auction/` issues `grade10-site-auction-e2e-*`. */
export function domainPrefix(root, dir) {
  const rel = relative(root, dir)
    .replace(/^openspec\/specs\//, "")
    .replace(/^openspec\/changes\/[^/]+\/specs\//, "");
  return `${rel.split("/").join("-")}-e2e`;
}

/** The `decisions.md` of the change this suite sits in, if it sits in one at
 * all. Walks up to the directory holding `.openspec.yaml` — a durable suite
 * finds none, and so does a change written before the artifact existed. */
export function decisionsBeside(filePath) {
  let dir = dirname(filePath);
  for (let up = 0; up < 8; up += 1) {
    if (existsSync(join(dir, ".openspec.yaml")))
      return existsSync(join(dir, "decisions.md"));
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return false;
}

// --- the spec beside a suite -----------------------------------------------

/** Journey and scenario ids the capability issues, plus the journey titles.
 * The journeys are their own file beside the spec, so both are read: the
 * scenarios come from `spec.md` and the journeys from `user-journeys.md`. */
export function readSpecIds(specPath) {
  if (!existsSync(specPath)) return null;
  const text = readFileSync(specPath, "utf8");
  const journeysPath = specPath.replace(/spec\.md$/, "user-journeys.md");
  const stories = existsSync(journeysPath)
    ? readFileSync(journeysPath, "utf8")
    : "";
  const journeys = new Map();
  const scenarios = new Set();
  // A `## Feature set` root group is an anchor too, and the only kind a
  // capability nobody walks has. Column-0 bullets only: an indented bullet is
  // a leaf, and a leaf carries no id and anchors nothing.
  const groups = new Set();
  let inFeatureSet = false;
  for (const line of text.split("\n")) {
    if (/^##\s/.test(line)) inFeatureSet = /^##\s+Feature set\s*$/.test(line);
    else if (inFeatureSet) {
      const g = line.match(/^[-*]\s+(?:\*\*)?(.+?)(?:\*\*)?\s*$/);
      if (g) groups.add(g[1].replace(/:.*$/, "").trim());
    }
  }
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
    groups,
    // A capability nobody walks routes its anchors to the feature set. It is
    // not exempt from a suite: it carries one section, and its cases trace
    // groups rather than journeys.
    unwalked: /^\*\*Walked by:\*\*\s+nobody\b/m.test(stories),
    // A durable file writes `## User journeys` and a change's file writes the
    // delta sections; `journey-vocabulary.test.mjs` pins the set. Matching only
    // the durable heading read every change's journeys as no journeys at all.
    hasJourneySection:
      /^##\s+(?:User journeys|Context user journeys|(?:ADDED|MODIFIED) User journeys)\s*$/m.test(
        stories,
      ),
  };
}

/** A domain suite (`domain-tcs.md`) has no `spec.md` beside it: it reads the journeys
 * every capability in that domain issues. Collect them from each capability one
 * level down, so a domain case can trace the journeys it crosses. */
export function readDomainIds(dir) {
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

/** The prefix a capability issues, read off its spec rather than off its
 * directory. A new capability takes its path form -
 * `grade10-site/loyalty/programme` issues `grade10-site-loyalty-programme-*` -
 * but the prefix is still read from the ids themselves, because an issued id
 * is permanent: a capability that later moves goes on issuing what it always
 * issued rather than invalidating every task, review and case that names one.
 * Only a spec that issues no id at all falls back to the directory name. */
export function issuedPrefix(spec) {
  if (!spec) return null;
  const [id] = [...spec.journeys.keys(), ...spec.scenarios];
  return id ? id.replace(/-(?:US|SC)-\d+$/, "") : null;
}

// --- the suite itself ------------------------------------------------------

/** Collect the lines of a block that runs from `**Label:**` to the next bold
 *  line, heading or rule. Used by every block a case carries. */
function blockAfter(lines, from) {
  const body = [];
  for (let j = from; j < lines.length; j++) {
    if (/^(\*\*|#{2,3}\s|---)/.test(lines[j])) break;
    body.push(lines[j]);
  }
  return body;
}

/** Split a suite into its header, journey sections and cases. Current format only;
 *  older shapes are detected and reported rather than parsed into silence.
 *
 *  A case carries both a count and the text of its steps and expected results:
 *  the validator judges that there is something to verify, and the run sheet
 *  carries what a tester reads. */
export function parseSuite(text) {
  const lines = text.split("\n");
  const suite = {
    title: null,
    status: null,
    draftsStyled: null,
    reviewed: null,
    journeys: [],
    legacy: new Set(),
    // The blind reading's own output: what the isolated input did not settle.
    // Tracked as present-or-absent and as empty-or-not, because an absent
    // section and an empty one say different things — one is a suite that
    // skipped the step, the other a claim that nothing was left open.
    raised: null,
    settled: null,
    reconciliation: null,
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

    const meta = line.match(/^##\s+(Raised|Settled|Reconciliation)\s*$/);
    if (meta) {
      pushJourney();
      const key = meta[1].toLowerCase();
      const body = [];
      for (let j = i + 1; j < lines.length && !/^##\s/.test(lines[j]); j++) {
        body.push(lines[j]);
      }
      suite[key] = body.filter(
        (one) => one.trim() && !one.trim().startsWith("<!--"),
      ).length;
      continue;
    }

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
        testData: [],
        stepTexts: [],
        expectedTexts: [],
        steps: 0,
        expected: 0,
        perRow: false,
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
      // A data-driven case runs once per row rather than once. The tester needs
      // to know that before they start, so it travels with the case.
      if (/^Runs once per row of \*\*Test data\*\*\.?\s*$/.test(line)) {
        tc.perRow = true;
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
      // `| Field | Value |`, the placeholders the steps below then name.
      if (/^\*\*Test data:\*\*/.test(line)) {
        for (const t of blockAfter(lines, i + 1)) {
          const row = t.trim();
          if (!row.startsWith("|")) continue;
          const cells = row
            .split("|")
            .slice(1, -1)
            .map((one) => one.trim());
          if (cells.length < 2) continue;
          if (/^-+$/.test(cells[0].replace(/:/g, ""))) continue;
          if (cells[0].toLowerCase() === "field") continue;
          tc.testData.push({
            field: cells[0],
            value: cells.slice(1).join(" | "),
          });
        }
        continue;
      }
      if (/^\*\*Steps:\*\*/.test(line)) {
        for (let j = i + 1; j < lines.length; j++) {
          const t = lines[j];
          if (/^(\*\*|#{2,3}\s|---)/.test(t)) break;
          if (/^\s*\d+\.\s+\S/.test(t)) {
            tc.steps++;
            tc.stepTexts.push(t.trim().replace(/^\d+\.\s+/, ""));
          } else if (/^\|\s*\d+\s*\|/.test(t.trim())) {
            tc.steps++;
            const cells = t
              .trim()
              .split("|")
              .slice(1, -1)
              .map((one) => one.trim());
            tc.stepTexts.push(cells[1] ?? "");
            // a legacy step table carries its own expected result per row
            if (cells.filter(Boolean).length >= 3) {
              tc.expected++;
              if (cells[2]) tc.expectedTexts.push(cells[2]);
            }
            tc.stepTable = true;
          }
        }
        continue;
      }
      if (
        /^[-*]?\s*\*\*Expected results?:\*\*/i.test(line.trim()) &&
        !/^\*\*Expected Results:\*\*/.test(line)
      ) {
        const inline = line
          .replace(/^[-*]?\s*\*\*Expected results?:\*\*/i, "")
          .trim();
        if (inline) {
          tc.expected++;
          tc.expectedTexts.push(inline);
        }
        for (const t of blockAfter(lines, i + 1)) {
          if (!/^[-*+]\s+\S/.test(t)) continue;
          tc.expected++;
          tc.expectedTexts.push(t.replace(/^[-*+]\s+/, "").trim());
        }
        continue;
      }
      if (/^\*\*Expected Results?:\*\*/.test(line)) {
        for (const t of blockAfter(lines, i + 1)) {
          if (!/^[-*+]\s+\S/.test(t)) continue;
          tc.expected++;
          tc.expectedTexts.push(t.replace(/^[-*+]\s+/, "").trim());
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

/** How many cases sit at each status. */
export function statusCounts(cases) {
  const counts = { draft: 0, actual: 0, deprecated: 0, unknown: 0 };
  for (const tc of cases) {
    const s = (tc.props.get("Status") ?? "").toLowerCase();
    if (CASE_STATUSES.includes(s)) counts[s]++;
    else counts.unknown++;
  }
  return counts;
}

/** The file status its cases imply. Derived, never chosen: a reviewer approves
 *  cases one at a time and the file follows. */
export function deriveStatus(counts, caseCount) {
  if (caseCount === 0) return "pending-review";
  if (counts.draft === 0) return "approved";
  return counts.actual + counts.deprecated === 0
    ? "pending-review"
    : "in-review";
}

/** A case's property, trimmed, or the empty string. */
export const prop = (tc, name) => (tc.props.get(name) ?? "").trim();

/** One suite read whole: its parse, the spec it reads, and every case flattened
 *  with the journey it sits under. */
export function readSuite(root, filePath) {
  const text = readFileSync(filePath, "utf8");
  const dir = dirname(filePath);
  const level = levelOf(filePath);
  const suite = parseSuite(text);
  const composed = level !== "feature";
  const spec = composed
    ? readDomainIds(dir)
    : readSpecIds(join(dir, "spec.md"));
  const capability = composed
    ? domainPrefix(root, dir)
    : (issuedPrefix(spec) ?? basename(dir));
  const cases = [];
  for (const j of suite.journeys)
    for (const tc of j.cases) cases.push({ ...tc, journey: j });
  const counts = statusCounts(cases);
  return {
    path: filePath,
    rel: relative(root, filePath),
    level,
    capability,
    capabilityId: capabilityId(root, filePath),
    change: changeOf(root, filePath),
    spec,
    suite,
    cases,
    counts,
    derived: deriveStatus(counts, cases.length),
  };
}

/** Every suite in the store, read whole. */
export function readAllSuites(root, scope = null) {
  return findSuites(root, scope).map((p) => readSuite(root, p));
}

/** Every case in the store as `id -> { level, traces }`, read straight from the
 *  text so a sweep is checked against what the files say rather than against a
 *  parse that a sweep might itself have changed. Case ids are permanent and
 *  unique store-wide, so this survives a file being renamed or a case moving
 *  between levels. */
export function caseIndex(root, paths) {
  const index = new Map();
  for (const p of paths) {
    const level = levelOf(p);
    const rel = relative(root, p);
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
