import { existsSync } from "node:fs";
import { join, posix } from "node:path";
import YAML from "yaml";
import type {
  ChangeEntry,
  ChangeStatus,
  ChangeSuite,
  Delta,
  DeltaKind,
  DeltaRequirement,
  IdleClaim,
  PageSectionRef,
  TaskGroup,
  TaskLine,
} from "../api/types.ts";
import {
  featureSuitePath,
  readText,
  readTextIfExists,
  StoreFileError,
  storePath,
  subdirectories,
  toItemError,
  walkFiles,
} from "./disk.mts";
import type { GitIndex } from "./git.mts";
import { readIdleClaims } from "./idle.mts";
import { leadingTitle, outline, type Section } from "./markdown.mts";
import { readTestCases } from "./read-specs.mts";

// The owner tag as `docs/governance/task-ownership.md` defines it: the `@` is
// optional, a handle may hold `.`, and it matches case-insensitively.
// `(owner: unassigned)` and no tag are the same thing.
const OWNER = /\(owner:\s*@?([A-Za-z0-9][A-Za-z0-9._-]*)\)/gi;
const OWNER_TAG = new RegExp(OWNER.source, "i");
const HANDLE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
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

export function readChanges(root: string, git: GitIndex): ChangeEntry[] {
  const dir = join(root, "openspec", "changes");
  return subdirectories(dir)
    .filter((name) => name !== "archive")
    .map((name) => readChange(root, join(dir, name), name, "in-flight", git));
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
  return subdirectories(dir).map((name) => {
    const dated = ARCHIVE_PREFIX.exec(name);
    const entry = readChange(
      root,
      join(dir, name),
      dated ? dated[2] : name,
      "archived",
      git,
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
): ChangeEntry {
  const rel = storePath(root, dir);
  const entry: ChangeEntry = {
    id,
    dir: rel,
    schema: "",
    status,
    owners: [],
    created: "",
    title: humanize(id),
    why: "",
    taskGroups: [],
    deltas: [],
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
      const skipped = skipSpecsOf(fields.skip_specs, fields.skip_specs_why);
      if (skipped !== undefined) entry.skipSpecs = skipped;
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
  const tasks = readTextIfExists(join(dir, "tasks.md"));
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
        detailed ? readIdleClaims(root, id) : new Map(),
      );
    } catch (cause) {
      fail(`${rel}/tasks.md`, cause);
    }
  }

  entry.deltas = readDeltas(root, dir, detailed, fail);
  if (detailed) {
    const suites = readSuites(root, dir);
    if (suites.length > 0) entry.suites = suites;
  }
  return entry;
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
        },
      });
    } catch (cause) {
      suites.push({
        spec,
        cases: { draft: 0, actual: 0, deprecated: 0, total: 0 },
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
  ["design_waived", "designWaived"],
  ["deployed_at", "deployedAt"],
  ["deployed_env", "deployedEnv"],
  ["deploy_waived", "deployWaived"],
  ["tasks_waived", "tasksWaived"],
] as const;

/** `skip_specs` turns the whole cross-check off, so it is read on its own. The
 * switch and its reason are two keys because the OpenSpec CLI owns
 * `skip_specs` and reads it as a boolean: a reason written there invalidates
 * the manifest and the marker stops being honoured at all. So `skip_specs:
 * true` is the switch and `skip_specs_why` is the line the author owes. A
 * switch with no reason reads as the empty string — declared, unexplained —
 * which is what rule `hatch` refuses. */
export function skipSpecsOf(value: unknown, why: unknown): string | undefined {
  if (value === undefined || value === null || value === false) return undefined;
  if (value !== true) {
    throw new StoreFileError(
      1,
      "`skip_specs` must be `true`; the reason goes on `skip_specs_why`",
    );
  }
  return line("skip_specs_why", why) ?? "";
}

/** A written line, or nothing where the key is absent or blank. Anything but
 * text is a malformed manifest: a record read as absent would waive the rule
 * the key answers to. */
function line(key: string, value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== "string") {
    throw new StoreFileError(1, `\`${key}\` must be a line of text`);
  }
  const written = value.trim();
  return written === "" ? undefined : written;
}

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
 * same people; anything that is not a handle is not one. */
function handles(values: unknown[]): string[] {
  const named = strings(values.flat())
    .map((one) => one.replace(/^@/, "").trim().toLowerCase())
    .filter((one) => HANDLE.test(one) && one !== UNASSIGNED);
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
 * spec id it is about. */
export function deltaFiles(
  root: string,
  dir: string,
): { spec: string; file: string }[] {
  const specsDir = join(dir, "specs");
  if (!existsSync(specsDir)) return [];
  const prefix = `${storePath(root, specsDir)}/`;
  return walkFiles(root, specsDir, "spec.md").map((file) => ({
    spec: file.slice(prefix.length, -"/spec.md".length),
    file,
  }));
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

function readDeltas(
  root: string,
  dir: string,
  detailed: boolean,
  fail: (file: string, cause: unknown) => void,
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
    if (kinds.length === 0) {
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
