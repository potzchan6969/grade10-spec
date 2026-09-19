import { existsSync } from "node:fs";
import { join, posix } from "node:path";
import YAML from "yaml";
import { handleOf, isHandle } from "../../../../scripts/openspec/lib/team.mjs";
import { askedIdsOf } from "../api/rounds.ts";
import { ASKED_OF, ladderOf } from "../api/stages.ts";
import type {
  ChangeEntry,
  ChangeStatus,
  ChangeSuite,
  Delta,
  DeltaKind,
  DeltaRequirement,
  IdleClaim,
  OpenQuestion,
  PageSectionRef,
  RoundRow,
  SchemaArtifact,
  TaskGroup,
  TaskLine,
} from "../api/types.ts";
import { type ChangeCapability, capabilitiesOf } from "./capabilities.mts";
import {
  featureSuitePath,
  readText,
  readTextIfExists,
  StoreFileError,
  storePath,
  subdirectories,
  toItemError,
} from "./disk.mts";
import { type GitIndex, mainStateOf, type StoreMain } from "./git.mts";
import { readIdleClaims } from "./idle.mts";
import { leadingTitle, outline, type Section, tableRows } from "./markdown.mts";
import { readLandings } from "./read-landings.mts";
import { readRounds, roundArtifactOf } from "./read-rounds.mts";
import { schemaArtifacts } from "./read-schema.mts";
import { readTestCases } from "./read-specs.mts";

// The owner tag as `docs/governance/task-ownership.md` defines it: the `@` is
// optional, a handle may hold `.`, and it matches case-insensitively.
// `(owner: unassigned)` and no tag are the same thing.
const OWNER = /\(owner:\s*@?([A-Za-z0-9][A-Za-z0-9._-]*)\)/gi;
const OWNER_TAG = new RegExp(OWNER.source, "i");
const UNASSIGNED = "unassigned";

/** The handle an owner tag names, lower-cased; nobody for `unassigned`. */
function taggedOwner(text: string): string | undefined {
  const handle = OWNER_TAG.exec(text)?.[1].toLowerCase();
  return handle && handle !== UNASSIGNED ? handle : undefined;
}
const GROUP_HEADING = /^(\d+)\.\s*(.+)$/;
const REPO_TAG = /\s*\(([^()@]+)\)\s*$/;
const CHECKBOX = /^\s*-\s*\[( |x|X)\]\s?(.*)$/;
const BULLET = /^\s*[-*]\s+(.+?)\s*$/;
const ISSUED_ID = /([a-z0-9][a-z0-9-]*)-(SC|US|TC)-(\d+)/g;
const DELTA_HEADING = /^(ADDED|MODIFIED|REMOVED|RENAMED)\s+Requirements$/;
const REQUIREMENT_HEADING = /^Requirement:\s*(.+?)\s*$/i;
const FROM_LINE = /^\s*-?\s*FROM:\s*`?###\s*Requirement:\s*(.+?)`?\s*$/;
const TO_LINE = /^\s*-?\s*TO:\s*`?###\s*Requirement:\s*(.+?)`?\s*$/;
const RENAMED_FROM = new RegExp(FROM_LINE.source, "gm");
const AUTHOR =
  /^\*\*Author:\*\*\s*@([A-Za-z0-9][A-Za-z0-9_-]*)(?:\s+-\s+(\d{4}-\d{2}-\d{2}))?\s*$/m;
const ARCHIVE_PREFIX = /^(\d{4}-\d{2}-\d{2})-(.+)$/;

/**
 * The changes in flight in this checkout. A change on `main` has its task
 * list read there, where every claim and checkmark is recorded, and carries
 * where it stands against main. `null` reads every task list from disk: the
 * checker, which judges the branch's own files, and a store with no git.
 */
export function readChanges(
  root: string,
  git: GitIndex,
  main: StoreMain | null,
): ChangeEntry[] {
  const dir = join(root, "openspec", "changes");
  const schemas: SchemaCache = new Map();
  // Two walks for the whole store rather than two per change, at the revision
  // the task lists themselves are read from. An archived change is finished
  // and is dated by nothing, so only these ask for a landing.
  const landed = readLandings(root, main?.commit ?? null);
  return subdirectories(dir)
    .filter((name) => name !== "archive")
    .map((name) =>
      readChange(
        root,
        join(dir, name),
        name,
        "in-flight",
        git,
        schemas,
        main,
        landed.get(name),
      ),
    );
}

/**
 * The archive, dated by its directory names.
 *
 * `openspec archive` writes the day it ran into the `YYYY-MM-DD-` prefix, and
 * that is the day the change shipped. The commits under the directory are not:
 * a rebase, a migration, or a bulk reformat rewrites every one of them, and a
 * timeline keyed to those reads years of shipped work as having landed this
 * morning. The prefix is what survives, so it is what the archive is dated by.
 */
export function readArchivedChanges(
  root: string,
  git: GitIndex,
): ChangeEntry[] {
  const dir = join(root, "openspec", "changes", "archive");
  const schemas: SchemaCache = new Map();
  return subdirectories(dir).map((name) => {
    const dated = ARCHIVE_PREFIX.exec(name);
    const entry = readChange(
      root,
      join(dir, name),
      dated ? dated[2] : name,
      "archived",
      git,
      schemas,
      null,
    );
    if (dated) entry.shippedOn = dated[1];
    if (entry.created === "" && dated) entry.created = dated[1];
    return entry;
  });
}

function readChange(
  root: string,
  dir: string,
  id: string,
  status: ChangeStatus,
  git: GitIndex,
  schemas: SchemaCache,
  main: StoreMain | null,
  landed?: string,
): ChangeEntry {
  const rel = storePath(root, dir);
  const entry: ChangeEntry = {
    id,
    dir: rel,
    schema: "",
    status,
    // The lowest rung, until the ladder is walked at the end of this read:
    // every reader above it writes what the walk reads, and a record nothing
    // could read stays here.
    stage: "proposed",
    owners: [],
    created: "",
    title: humanize(id),
    why: "",
    taskGroups: [],
    deltas: [],
    written: [],
  };

  // Any file of the change, not only tasks.md — a plan that writes specs and
  // no task list still moves.
  const lastMoved = git.newestUnder(rel)?.date;
  if (lastMoved) entry.lastMoved = lastMoved;

  const fail = (file: string, cause: unknown) => {
    if (!entry.error) entry.error = toItemError(file, cause);
  };

  let declared: string[] = [];
  const manifest = readTextIfExists(join(dir, ".openspec.yaml"));
  if (manifest !== undefined) {
    try {
      const parsed = YAML.parse(manifest) ?? {};
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new StoreFileError(1, "`.openspec.yaml` must be a mapping");
      }
      const fields = parsed as Record<string, unknown>;
      if (typeof fields.schema === "string") entry.schema = fields.schema;
      const promoted = handles([fields.promoted_by])[0];
      if (promoted) entry.promotedBy = promoted;
      const created = isoDate(fields.created);
      if (created) entry.created = created;
      const target = isoDate(fields.target);
      if (target) entry.target = target;
      declared = handles([fields.owner, fields.owners]);
      const dependsOn = strings(fields.depends_on);
      if (dependsOn.length > 0) entry.dependsOn = dependsOn;
      for (const [key, field] of RECORDED) {
        const written = line(key, fields[key]);
        if (written) entry[field] = written;
      }
      const hands = readIdMap("hands", fields.hands, handleOf);
      if (hands) entry.hands = hands;
      const landedBy = readIdMap("landed_by", fields.landed_by, handleOf);
      if (landedBy) entry.landedBy = landedBy;
      const reviewed = readIdMap("reviewed", fields.reviewed);
      if (reviewed) entry.reviewed = reviewed;
      const skipped = skipSpecsOf(fields.skip_specs, fields.skip_specs_why);
      if (skipped !== undefined) entry.skipSpecs = skipped;
      const awaiting = readAwaiting(fields.awaiting);
      if (awaiting.length > 0) entry.awaiting = awaiting;
    } catch (cause) {
      fail(`${rel}/.openspec.yaml`, cause);
    }
  }
  entry.owners = declared;

  const proposal = readTextIfExists(join(dir, "proposal.md"));
  if (proposal === undefined) {
    fail(`${rel}/proposal.md`, new StoreFileError(1, "change has no proposal"));
  } else {
    const sections = outline(proposal);
    const title = leadingTitle(sections);
    if (title) entry.title = title;
    const body = title ? sections[0].children : sections;
    const why = body.find((section) => /^Why\b/.test(section.heading));
    if (why) entry.why = why.body;
    else {
      fail(
        `${rel}/proposal.md`,
        new StoreFileError(1, "proposal has no `## Why`"),
      );
    }
    const author = AUTHOR.exec(proposal);
    if (author?.[1]) entry.author = author[1];
    if (entry.created === "") entry.created = author?.[2] ?? "";
    const cites = readCitations(body);
    if (cites.length > 0) entry.cites = cites;
    const linked = readSectionLinks(body, rel);
    if (linked.length > 0) entry.sections = linked;
    const followOns = readFollowOns(body);
    if (followOns.length > 0) entry.followOns = followOns;
  }

  const detailed = status === "in-flight";
  if (main) {
    const state = mainStateOf(main, id);
    if (state) entry.mainState = state;
  }
  const { text: tasks, commit } = planOf(dir, id, main);
  if (tasks !== undefined) {
    const tagged = matchAll(tasks, OWNER)
      .map((one) => one.toLowerCase())
      .filter((one) => one !== UNASSIGNED);
    entry.owners = [...new Set([...declared, ...tagged])];
    try {
      entry.taskGroups = readTaskGroups(
        tasks,
        detailed,
        // Only for work still in flight: an archived change is finished, and
        // its groups are the record of who did it rather than a claim anyone
        // could still be sitting on.
        detailed ? readIdleClaims(root, id, tasks, commit) : new Map(),
      );
    } catch (cause) {
      fail(`${rel}/tasks.md`, cause);
    }
  }

  entry.deltas = readDeltas(root, dir, detailed, fail, waitsOnSpecs(entry));
  if (detailed) {
    const suites = readSuites(root, dir);
    if (suites.length > 0) entry.suites = suites;
  }
  // A schema that names an artifact it does not issue is reported against the
  // change, the way a record nothing could read is: the ladder and the
  // worklists then read an empty set, which claims nothing about what is owed.
  let artifacts: SchemaArtifact[] = [];
  try {
    artifacts = artifactsOf(root, entry.schema, schemas);
  } catch (cause) {
    fail(`openspec/schemas/${entry.schema}/schema.yaml`, cause);
  }
  entry.written = writtenArtifacts(
    dir,
    entry,
    artifacts,
    tasks !== undefined,
    capabilitiesOf(root, dir),
  );

  // The round's record, written by the first landing and absent until then —
  // read ahead of the decisions so an open question can be marked against the
  // draft a round was actually reading rather than the file its row lives in.
  const rounds: RoundRow[] = [];
  if (detailed) {
    const roundsText = readTextIfExists(join(dir, "rounds.md"));
    if (roundsText !== undefined) {
      entry.rounds = readRounds(roundsText);
      rounds.push(...entry.rounds);
    }
  }

  // In flight only: an archived change's interview is over, and both readers
  // are pure over the text - a row nothing matches is a row nobody asked, so
  // there is nothing here to catch and nothing to report.
  const decisions = detailed
    ? readTextIfExists(join(dir, "decisions.md"))
    : undefined;
  if (decisions !== undefined) {
    const open = readQuestions(decisions, entry.hands, rounds);
    if (open.length > 0) entry.questions = open;
    const raised = openRaised(decisions);
    if (raised > 0) entry.raisedOpen = raised;
  }

  // Only the landings: the last commit touching the directory is not one —
  // a single repository-wide commit moves every change at once.
  if (landed !== undefined) entry.lastLanded = landed;
  // Last, and here rather than in the snapshot: the ladder reads what every
  // reader above it has just written, and this is where the schema is at hand.
  // Carried on the entry because six callers of `laneOf` would each otherwise
  // have to fetch the schema to ask.
  const ladder = ladderOf(entry, artifacts);
  entry.stage = ladder.stage;
  if (ladder.heldBy) entry.heldBy = ladder.heldBy;
  return entry;
}

/**
 * A change's task list and the commit its history is read back from. A change
 * on `main` is read there, where every claim and checkmark is recorded; one
 * only this checkout has, or any change when `main` is null, from disk and
 * HEAD.
 */
export function planOf(
  dir: string,
  id: string,
  main: StoreMain | null,
): { text: string | undefined; commit: string | null } {
  if (main?.changes.has(id)) {
    return { text: main.tasks.get(id), commit: main.commit };
  }
  return { text: readTextIfExists(join(dir, "tasks.md")), commit: null };
}

/** Nearly every change names the same schema, so one read parses it once
 * rather than once a change. The cache lives for that read alone: a schema
 * edited between two of them is read again. A schema this store does not
 * define declares no artifacts, and a change on one owes nothing here. */
type SchemaCache = Map<string, SchemaArtifact[]>;

function artifactsOf(
  root: string,
  schema: string,
  cache: SchemaCache,
): SchemaArtifact[] {
  const known = cache.get(schema);
  if (known) return known;
  const read =
    (schema === "" ? undefined : schemaArtifacts(root, schema)) ?? [];
  cache.set(schema, read);
  return read;
}

/**
 * The schema artifact ids this change has written, read against the schema's
 * own `generates` rather than a second list of ids here. An artifact that
 * generates a file inside a capability directory is written only when every
 * capability the change touches carries it — one capability's suite does not
 * answer for the others, which is how `blind` and `walked` already read them.
 */
function writtenArtifacts(
  dir: string,
  entry: ChangeEntry,
  artifacts: SchemaArtifact[],
  planned: boolean,
  capabilities: ChangeCapability[],
): string[] {
  const present = ({ generates }: SchemaArtifact) => {
    if (generates === "tasks.md") return planned;
    if (!generates.startsWith("specs/"))
      return existsSync(join(dir, generates));
    const name = generates.slice(generates.lastIndexOf("/") + 1);
    // `spec.md` is two passes over one file — the outline, then the
    // requirements — and the file is there from the first. Read by presence,
    // the second pass looked done the moment the first wrote anything, which
    // told an author their declared wait was over while the requirements were
    // still unwritten, and offered an engineer a delivery plan to write
    // against an outline. The delta headings are what say the second landed.
    if (name === "spec.md")
      return (
        entry.deltas.length > 0 &&
        entry.deltas.every((one) => one.kinds.length > 0)
      );
    return (
      capabilities.length > 0 &&
      capabilities.every((one) => one.files.has(name))
    );
  };
  return artifacts.filter(present).map(({ id }) => id);
}

/**
 * `awaiting:` as a mapping of artifact id to the line its author wrote. A
 * wait with nothing written against it is refused: a key read as absent
 * would waive the artifact it names without saying why.
 */
function readAwaiting(value: unknown): { artifact: string; why: string }[] {
  if (value === undefined || value === null) return [];
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new StoreFileError(1, "`awaiting` must be a mapping");
  }
  const waits: { artifact: string; why: string }[] = [];
  for (const [artifact, why] of Object.entries(value)) {
    const key = `awaiting.${artifact}`;
    const written = line(key, why);
    if (written === undefined) {
      throw new StoreFileError(1, `\`${key}\` must say what is missing`);
    }
    waits.push({ artifact, why: written });
  }
  return waits;
}

/** The feature suite beside each delta — the suite QA reviews while the
 * change is in flight, invisible on every durable surface until archive day.
 * A malformed one is its own channel, the same as a durable suite's. */
function readSuites(root: string, dir: string): ChangeSuite[] {
  const suites: ChangeSuite[] = [];
  for (const { spec, file } of deltaFiles(root, dir)) {
    const capabilityDir = file.replace(/\/spec\.md$/, "");
    const casesFile = featureSuitePath(root, capabilityDir);
    if (casesFile === undefined) continue;
    const text = readText(join(root, casesFile));
    try {
      const suite = readTestCases(text);
      suites.push({
        spec,
        status: suite.status,
        cases: {
          draft: suite.cases.filter((one) => one.status === "draft").length,
          actual: suite.cases.filter((one) => one.status === "actual").length,
          deprecated: suite.cases.filter((one) => one.status === "deprecated")
            .length,
          total: suite.cases.length,
          automated: suite.cases.filter(
            (one) => one.automationStatus === "automated",
          ).length,
        },
      });
    } catch (cause) {
      suites.push({
        spec,
        cases: { draft: 0, actual: 0, deprecated: 0, total: 0, automated: 0 },
        error: toItemError(casesFile, cause),
      });
    }
  }
  return suites;
}

/** The manifest keys that stand for a deploy or for the thing a rule asks
 * for, against the field each lands on. Every one is a line an author or
 * `pnpm plan shipped` wrote, read back verbatim. */
const RECORDED = [
  ["page_waived", "pageWaived"],
  ["decisions_waived", "decisionsWaived"],
  ["design_waived", "designWaived"],
  ["ui_waived", "uiWaived"],
  ["deployed_at", "deployedAt"],
  ["deployed_env", "deployedEnv"],
  ["deploy_waived", "deployWaived"],
  ["tasks_waived", "tasksWaived"],
  ["thread", "thread"],
  ["released_in", "releasedIn"],
] as const;

/** `skip_specs` turns the whole cross-check off, so it is read on its own. The
 * switch and its reason are two keys because the OpenSpec CLI owns
 * `skip_specs` and reads it as a boolean: a reason written there invalidates
 * the manifest and the marker stops being honoured at all. So `skip_specs:
 * true` is the switch and `skip_specs_why` is the line the author owes. A
 * switch with no reason reads as the empty string — declared, unexplained —
 * which is what rule `hatch` refuses. */
export function skipSpecsOf(value: unknown, why: unknown): string | undefined {
  if (value === undefined || value === null || value === false)
    return undefined;
  if (value !== true) {
    throw new StoreFileError(
      1,
      "`skip_specs` must be `true`; the reason goes on `skip_specs_why`",
    );
  }
  return line("skip_specs_why", why) ?? "";
}

/**
 * A record key that maps an id to one line — `hands:` against a role,
 * `landed_by:` and `reviewed:` against a schema artifact id.
 *
 * The line is read as written, normalized only by `normalize`, and an entry
 * with no line is refused by `line` itself rather than read as absent: a blank
 * entry claims the id is answered and answers it with nobody, which is the one
 * reading no rule downstream could tell from a typo. What the line says is not
 * judged here — an unknown role, an artifact id the schema does not issue and a
 * value that is not one handle all survive the read, because the rules in
 * `check/record.mjs` are what name them, and a reader that dropped them would
 * leave those rules nothing to refuse.
 */
function readIdMap(
  key: string,
  value: unknown,
  normalize: (one: string) => string = (one) => one,
): Record<string, string> | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "object" || Array.isArray(value)) {
    throw new StoreFileError(1, `\`${key}\` must be a mapping`);
  }
  const read: Record<string, string> = {};
  for (const [id, written] of Object.entries(value)) {
    const only = line(`${key}.${id}`, written);
    if (only === undefined)
      throw new StoreFileError(1, mustBeLine(`${key}.${id}`));
    read[id] = normalize(only);
  }
  return Object.keys(read).length > 0 ? read : undefined;
}

/** The `Q` column of a `## Decisions` row: the number the round gave the
 * question. */
const DECISION_ROW = /^Q\d+$/;

/**
 * Which artifact or task group each open `Q<n>` was raised against, from
 * every round's own Asked column — never `decisions.md`'s own row, which
 * always names the file it lives in rather than the draft under challenge.
 * A later round's line wins where an id somehow appears more than once,
 * since it is the more recent reading; a round whose own Artifact cell names
 * nothing (a malformed row `pnpm check:manual`'s `round` rule already
 * refuses) raises against nobody rather than against an empty string.
 */
function artifactRaisedAgainst(rounds: RoundRow[]): Map<string, string> {
  const found = new Map<string, string>();
  for (const round of rounds) {
    const resolved = roundArtifactOf(round.artifact);
    if (resolved === null) continue;
    for (const id of askedIdsOf(round.asked)) found.set(id, resolved);
  }
  return found;
}

/**
 * The decisions rows nobody has settled, addressed to the hand each names.
 *
 * A row is open when its `Decided` cell is written `❓ <role> - <what is
 * recommended>`, which is how the interview records what it could not close.
 * The separator is the grammar: without it the cell is a sentence, and reading
 * its first word as a role addresses the question to whatever the author began
 * with. A cell that opens ❓ and names nobody by that grammar is left to its
 * author rather than routed at a guess.
 *
 * Any role is read, the six or not: a question naming one outside them is
 * listed under that role and routed to its channel, the way an unnamed hand
 * is, and narrowing the set here would drop the question instead.
 */
function readQuestions(
  text: string,
  hands: Record<string, string> | undefined,
  rounds: RoundRow[],
): OpenQuestion[] {
  const open: OpenQuestion[] = [];
  const raisedAgainst = artifactRaisedAgainst(rounds);
  const decisions = outline(text)
    .flatMap((one) => (one.level === 1 ? one.children : [one]))
    .find((one) => /^Decisions\b/.test(one.heading));
  if (!decisions) return open;
  for (const cells of tableRows(decisions.raw) ?? []) {
    if (!DECISION_ROW.test(cells[0])) continue;
    const asked = ASKED_OF.exec(cells[2] ?? "");
    if (!asked) continue;
    const [, role, recommended] = asked;
    open.push({
      id: cells[0],
      artifact: raisedAgainst.get(cells[0]) ?? "decisions",
      role,
      hand: hands?.[role] ?? role,
      text: cells[1] ?? "",
      recommended,
    });
  }
  return open;
}

/**
 * The `Q<n>` ids one change's `## Decisions` table issues — answered, open or
 * withdrawn alike. What the `cited` rule's `Q<n>` citation resolves against,
 * read through the same table reader as `readQuestions` rather than a second
 * regex over the file: two readers of one table drift the day a column moves.
 */
export function questionIdsOf(text: string): Set<string> {
  const decisions = outline(text)
    .flatMap((one) => (one.level === 1 ? one.children : [one]))
    .find((one) => /^Decisions\b/.test(one.heading));
  if (!decisions) return new Set();
  return new Set(
    (tableRows(decisions.raw) ?? [])
      .map((cells) => cells[0])
      .filter((cell) => DECISION_ROW.test(cell ?? "")),
  );
}

/**
 * How many rows of `decisions.md`'s `## Raised` table have landed nowhere.
 *
 * The blind reading's questions live there — `Capability | Raised | Landed` —
 * and the requirements are not settled while one of them is unanswered, which
 * is why the ladder reads the count and not only the two files. A row's
 * `Landed` cell is a `Q<n>` of this file or a ❓ on a page; what it says is the
 * `raised` rule's to judge, and an empty cell is what is read here. A file
 * with no table has nothing open, which is the same answer as a table whose
 * every row landed.
 */
function openRaised(text: string): number {
  const raised = outline(text)
    .flatMap((one) => (one.level === 1 ? one.children : [one]))
    .find((one) => /^Raised\b/.test(one.heading));
  if (!raised) return 0;
  // A row whose `Landed` cell is empty, which is the same judgement the
  // `raised` rule makes of the same cell, over the same rows.
  return (tableRows(raised.raw) ?? []).filter(
    (cells) => (cells[2] ?? "") === "",
  ).length;
}

/** A written line, or nothing where the key is absent or blank. Anything but
 * text is a malformed manifest: a record read as absent would waive the rule
 * the key answers to. */
function line(key: string, value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") throw new StoreFileError(1, mustBeLine(key));
  const written = value.trim();
  return written === "" ? undefined : written;
}

/** One sentence for every key that owes a line, whether what was written is
 * not text or is nothing at all. */
const mustBeLine = (key: string) => `\`${key}\` must be a line of text`;

/** `YYYY-MM-DD`, however the yaml spelled it — a bare date is a `Date` by the
 * time the parser is done with it. */
function isoDate(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return undefined;
}

function strings(value: unknown): string[] {
  const listed = Array.isArray(value) ? value : [value];
  return [
    ...new Set(
      listed.filter(
        (one): one is string => typeof one === "string" && one !== "",
      ),
    ),
  ];
}

/** `owner: echo`, `owner: "@echo"` and `owners: [echo, other]` all name the
 * same people; anything that is not a handle is not one. A key that maps an id
 * to a handle keeps what was written where it is not one, for the rule that
 * refuses it to name it. */
function handles(values: unknown[]): string[] {
  const named = strings(values.flat())
    .map(handleOf)
    .filter((one) => isHandle(one) && one !== UNASSIGNED);
  return [...new Set(named)];
}

const MARKDOWN_LINK = /^\[[^\]]*\]\(([^)\s]+)\)$/;
const PAGE_SECTION = /^(docs\/prds\/.+\.md)#([^#]+)$/;

function referenceBullets(sections: Section[]): string[] {
  const references = sections.find((one) => /^References\b/.test(one.heading));
  if (!references) return [];
  const found: string[] = [];
  for (const line of references.raw.split("\n")) {
    const bullet = BULLET.exec(line)?.[1];
    if (bullet !== undefined) found.push(bullet);
  }
  return found;
}

/** The ids a proposal's `## References` bullets name — spec ids, requirement
 * headings, and the permanent ids a row already knew. A bullet that is a link
 * is a page section, read by `readSectionLinks`. */
function readCitations(sections: Section[]): string[] {
  const found: string[] = [];
  for (const bullet of referenceBullets(sections)) {
    if (MARKDOWN_LINK.test(bullet)) continue;
    const id = bullet.replace(/`/g, "").trim();
    if (id !== "") found.push(id);
  }
  return [...new Set(found)];
}

/**
 * The manual sections a proposal's `## References` link —
 * `[Points · Rules](../../../docs/prds/products/.../points.md#rules)`,
 * resolved from the change's own directory to a store path and the heading's
 * slug. That is where the change lands on the page; a link with no fragment
 * names the page whole and attaches to nothing here.
 */
function readSectionLinks(sections: Section[], rel: string): PageSectionRef[] {
  const found: PageSectionRef[] = [];
  const seen = new Set<string>();
  for (const bullet of referenceBullets(sections)) {
    const href = MARKDOWN_LINK.exec(bullet)?.[1];
    if (href === undefined) continue;
    const resolved = posix.normalize(posix.join(rel, href));
    const target = PAGE_SECTION.exec(resolved);
    if (!target) continue;
    const key = `${target[1]}#${target[2]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    found.push({ page: target[1], slug: target[2] });
  }
  return found;
}

/**
 * The bullets under a proposal's `## Follow-on changes`, verbatim and in
 * order — what this change was said to make possible next.
 *
 * Optional, and read rather than required: a proposal that names no follow-on
 * has decided nothing, and a heading nobody wrote is not a hole. A wrapped
 * bullet folds back into one item, because the line break is the author's
 * margin and not a second thought.
 */
function readFollowOns(sections: Section[]): string[] {
  const section = sections.find((one) =>
    /^Follow-on changes\b/i.test(one.heading),
  );
  if (!section) return [];
  const items: string[] = [];
  for (const line of section.raw.split("\n")) {
    const bullet = BULLET.exec(line)?.[1];
    if (bullet !== undefined) {
      items.push(bullet);
      continue;
    }
    // Only an indented line continues the bullet above it; prose sitting at
    // column 0 after the list is prose, and swallowing it would invent a
    // follow-on nobody wrote.
    if (items.length > 0 && /^\s+\S/.test(line)) {
      items[items.length - 1] += ` ${line.trim()}`;
    }
  }
  return items;
}

/** `detailed` carries the checkbox lines themselves, so "5 of 6" can say which
 * one is open. In-flight only: the archive shares this type and its board
 * payload has no reader for the lines. */
function readTaskGroups(
  text: string,
  detailed: boolean,
  idle: Map<string, IdleClaim>,
): TaskGroup[] {
  const groups: TaskGroup[] = [];
  const visit = (sections: Section[]): void => {
    for (const section of sections) {
      const match = GROUP_HEADING.exec(section.heading);
      if (!match) {
        visit(section.children);
        continue;
      }
      const num = match[1];
      const owner = taggedOwner(match[2]);
      const title = match[2].replace(OWNER, "").trimEnd();
      const repo = REPO_TAG.exec(title);
      const tasks = readTaskLines(section.raw);
      const claim = idle.get(num);
      groups.push({
        num,
        title: repo ? title.slice(0, repo.index).trimEnd() : title,
        repo: repo ? repo[1].trim() : "",
        ...(owner ? { owner } : {}),
        done: tasks.filter((task) => task.done).length,
        total: tasks.length,
        ...(detailed ? { tasks } : {}),
        ...(claim ? { idle: claim } : {}),
      });
    }
  };
  visit(outline(text));
  return groups;
}

/** Every checkbox line of a group, nested ones included, in file order — the
 * numbering an author writes (`2.4 …`) is the line's own text, so it stays. */
function readTaskLines(text: string): TaskLine[] {
  const lines: TaskLine[] = [];
  for (const line of text.split("\n")) {
    const box = CHECKBOX.exec(line);
    if (!box) continue;
    const owner = taggedOwner(box[2]);
    const task: TaskLine = {
      text: box[2].replace(OWNER, "").trim(),
      done: box[1] !== " ",
    };
    if (owner) task.owner = owner;
    lines.push(task);
  }
  return lines;
}

/** The `specs/**\/spec.md` files one change directory holds, each against the
 * spec id it is about — the capabilities of that directory that have reached
 * their outline. */
export function deltaFiles(
  root: string,
  dir: string,
): { spec: string; file: string }[] {
  return capabilitiesOf(root, dir)
    .filter((one) => one.files.has("spec.md"))
    .map((one) => ({ spec: one.spec, file: `${one.dir}/spec.md` }));
}

/** Every delta file the archive holds, by the change id it belongs to.
 * `readArchivedChanges` drops the date a folder name carries, so no entry id
 * can rebuild its own path — this walk is the way back to the files. */
export function archivedDeltaFiles(
  root: string,
): { change: string; spec: string; file: string }[] {
  const archive = join(root, "openspec", "changes", "archive");
  return subdirectories(archive).flatMap((name) => {
    const dated = ARCHIVE_PREFIX.exec(name);
    const change = dated ? dated[2] : name;
    return deltaFiles(root, join(archive, name)).map((one) => ({
      change,
      ...one,
    }));
  });
}

/** Whether the change has said, in `awaiting:`, that it cannot write a
 * requirement yet. The outline is written first and the requirements come back
 * in a second pass, so between the two there is a delta file that names no
 * requirement on purpose; the wait is the line that says which it is. */
const waitsOnSpecs = (entry: ChangeEntry) =>
  (entry.awaiting ?? []).some((one) => one.artifact === "specs");

function readDeltas(
  root: string,
  dir: string,
  detailed: boolean,
  fail: (file: string, cause: unknown) => void,
  awaitingSpecs: boolean,
): Delta[] {
  const deltas: Delta[] = [];
  for (const { spec, file } of deltaFiles(root, dir)) {
    const text = readTextIfExists(join(root, file));
    if (text === undefined) continue;
    const kinds: string[] = [];
    const requirements: DeltaRequirement[] = [];
    for (const section of deltaSections(text)) {
      const kind = deltaKindOf(section.heading);
      if (kind === undefined) continue;
      kinds.push(kind.toUpperCase());
      requirements.push(...deltaRequirements(section, kind, detailed));
    }
    // A delta that will never name a requirement is broken. One that has not
    // named one yet is the outline, and the change says so in `awaiting:` —
    // where the `awaiting` rule keeps reading it until the requirements land.
    if (kinds.length === 0 && !awaitingSpecs) {
      fail(
        file,
        new StoreFileError(
          1,
          "delta names no ADDED/MODIFIED/REMOVED/RENAMED requirements",
        ),
      );
    }
    deltas.push({ spec, kinds: [...new Set(kinds)], requirements });
  }
  return deltas;
}

/** The requirements one delta section names. RENAMED carries FROM:/TO:
 * bullets instead of headings, and the FROM name is the row that exists until
 * the change archives — the TO name rides along so the board can say where it
 * lands. `detailed` carries the block itself, in-flight only. */
function deltaRequirements(
  section: Section,
  kind: DeltaKind,
  detailed: boolean,
): DeltaRequirement[] {
  if (kind === "renamed") {
    const named = new Map(
      renamedPairs(section.raw).map((pair) => [pair.from, pair.to]),
    );
    return matchAll(section.raw, RENAMED_FROM).map((name) => {
      const to = named.get(name);
      return to === undefined ? { name, kind } : { name, kind, to };
    });
  }
  return deltaRequirementSections(section).map(({ name, block }) =>
    detailed ? { name, kind, text: blockText(block) } : { name, kind },
  );
}

/** A requirement's delta block as written — its own heading, then the prose
 * and scenarios under it — so the app can render what the change will say. */
function blockText(block: Section): string {
  const heading = `${"#".repeat(block.level)} ${block.heading}`;
  return block.raw === "" ? heading : `${heading}\n\n${block.raw}`;
}

/** Highest permanent id issued, per capability token. */
export type IssuedMarks = { sc?: number; us?: number; tc?: number };

/**
 * The ceiling a new id has to clear, keyed by the token an id spells itself
 * with (`loyalty` in `grade10-site-loyalty-programme-SC-89`) rather than by spec — two capabilities
 * sharing a token share the ceiling, which is the only answer that keeps them
 * from colliding.
 *
 * The universe is every delta in the store, archived ones included, plus the
 * durable ids handed in: the fold rebuilds a spec from Purpose and
 * Requirements alone, so the journeys an archived change issued live nowhere
 * but its own files, and a durable spec's own ceiling understates them.
 */
export function readIssuedIds(
  root: string,
  durable: Iterable<string> = [],
): Map<string, IssuedMarks> {
  const marks = new Map<string, IssuedMarks>();
  const changes = join(root, "openspec", "changes");
  const files = [
    ...subdirectories(changes)
      .filter((name) => name !== "archive")
      .flatMap((name) => deltaFiles(root, join(changes, name))),
    ...archivedDeltaFiles(root),
  ];

  for (const id of durable) claim(marks, id);
  for (const { file } of files) {
    claim(marks, readTextIfExists(join(root, file)) ?? "");
  }
  return marks;
}

function claim(marks: Map<string, IssuedMarks>, text: string): void {
  for (const [, token, kind, digits] of text.matchAll(ISSUED_ID)) {
    const held = marks.get(token) ?? {};
    const key = kind.toLowerCase() as keyof IssuedMarks;
    const issued = Number(digits);
    if ((held[key] ?? 0) < issued) held[key] = issued;
    marks.set(token, held);
  }
}

/** The `## ` sections of a delta file, with a `# ` title unwrapped — what
 * `openspec archive` splits the file into. */
export function deltaSections(text: string): Section[] {
  return outline(text).flatMap((one) =>
    one.level === 1 ? one.children : [one],
  );
}

/** The delta kind a `## ` heading names, when it names one. */
export function deltaKindOf(heading: string): DeltaKind | undefined {
  const kind = DELTA_HEADING.exec(heading)?.[1];
  return kind === undefined ? undefined : (kind.toLowerCase() as DeltaKind);
}

/** The `### Requirement:` sections under one delta section, each with the
 * block it holds. A delta groups its requirements under plain `### <group>`
 * headings — openspec ignores those, and so does this, or every group name
 * would become a requirement nobody wrote. */
export function deltaRequirementSections(
  section: Section,
): { name: string; block: Section }[] {
  const found: { name: string; block: Section }[] = [];
  const visit = (sections: Section[]): void => {
    for (const one of sections) {
      const name = REQUIREMENT_HEADING.exec(one.heading)?.[1];
      if (name !== undefined) found.push({ name, block: one });
      else visit(one.children);
    }
  };
  visit(section.children);
  return found;
}

/** FROM/TO pairs of a RENAMED section, paired the way the fold pairs them.
 * The reader carries only FROM — the row that exists until the change
 * archives — so the name a rename lands on comes from here. */
export function renamedPairs(text: string): { from: string; to: string }[] {
  const pairs: { from: string; to: string }[] = [];
  let from: string | undefined;
  for (const line of text.split("\n")) {
    const start = FROM_LINE.exec(line);
    if (start) {
      from = start[1];
      continue;
    }
    const end = TO_LINE.exec(line);
    if (end && from !== undefined) {
      pairs.push({ from, to: end[1] });
      from = undefined;
    }
  }
  return pairs;
}

function matchAll(text: string, pattern: RegExp): string[] {
  return [...text.matchAll(pattern)].map((match) => match[1]);
}

function humanize(id: string): string {
  const words = id.replace(/-/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}
