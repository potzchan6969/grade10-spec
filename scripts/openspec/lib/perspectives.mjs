/**
 * A round's size is read from the draft.
 *
 * The readers a round may dispatch are data in
 * `openspec/schemas/grade10-planning/schema.yaml`, beside each artifact's
 * teammate and on the schema's `apply:` block for a task group. This module
 * holds no copy of that table: it reads it through the store's own reader,
 * classifies the draft's diff against the `when` triggers the requirement
 * tables, and answers with the readers the draft summoned plus every `always`.
 *
 * Nothing here reads the change's record. A round's size is computed on every
 * draft, so no key can shorten one, and a size somebody believes is wrong is a
 * question for the interview.
 *
 * `openspec/specs/shared/planning/agent-rounds/spec.md`: "A round's size is
 * read from the draft", "Each artifact's perspectives are data beside its
 * teammate", "A reader sees the draft and never another reader's output".
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { TRIGGERS } from "../../../tools/manual/src/api/types.ts";
import {
  applyPerspectives,
  schemaArtifacts,
} from "../../../tools/manual/src/store/read-schema.mts";

export { TRIGGERS };

export const SCHEMA = "grade10-planning";

/** The schema as this module needs it: the artifacts with their perspectives
 * and their upstream sets, and the readers of a task group off the `apply:`
 * block. Read through `tools/manual/src/store/read-schema.mts` — the store's
 * one reader of the file — rather than a second parse of it here.
 *
 * A schema the store holds no file for is refused rather than answered with
 * no artifacts and no readers: that answer is a round nobody reads and a
 * target that is "neither an artifact of the schema nor a task group",
 * neither of which says the file is missing. */
export function planningSchema(root, schema = SCHEMA) {
  const artifacts = schemaArtifacts(root, schema);
  if (artifacts === undefined)
    throw new Error(
      `no schema at openspec/schemas/${schema}/schema.yaml — a round reads its readers from there`,
    );
  return { artifacts, apply: applyPerspectives(root, schema) };
}

/**
 * The triggers a draft's own diff raises. `diffText` is a unified diff — what
 * `git diff` prints for the branch — and `target` names which draft it is of:
 * an artifact id, a `generates` file, or a task group, read against `schema`
 * (`planningSchema`'s shape) the way every other reader of it is. A task
 * group's diff is read with these same rules, dispatched against the
 * `apply:` block.
 *
 * A trigger is raised by a changed line, by the file the line is in, or by the
 * section the hunk sits under. Context lines raise nothing: a round is sized
 * by what the draft changed. The file a line sits in usually comes from the
 * diff's own `diff --git` header; `target`'s own file, resolved through
 * `artifactOf` and its `generates`, is what a diff carrying no header at all
 * is read against instead.
 */
export function classifyDiff(diffText, schema, target = "") {
  const found = new Set();
  let file = initialFile(schema, target);
  let section = "";
  if (file) ofFile(file, found);
  for (const line of String(diffText ?? "").split("\n")) {
    const git = /^diff --git a\/\S+ b\/(\S+)$/.exec(line);
    if (git) {
      file = git[1];
      section = "";
      ofFile(file, found);
      continue;
    }
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    const hunk = /^@@[^@]*@@\s*(.*)$/.exec(line);
    if (hunk) {
      // The hunk header's trailing text is git's own unchanged context — the
      // nearest heading before the hunk, never a line the draft touched — so
      // it sets `section` and raises nothing on its own.
      section = heading(hunk[1]) ? hunk[1].trim() : section;
      continue;
    }
    if (!line.startsWith("+") && !line.startsWith("-")) continue;
    const text = line.slice(1);
    if (heading(text)) section = text.trim();
    ofLine(text, found, file, section);
  }
  return found;
}

const heading = (text) => /^\s*#{1,6}\s+\S/.test(text);
const under = (section, name) =>
  new RegExp(`^\\s*#{1,6}\\s+${name}\\b`, "i").test(section);

/** What the file a line sits in says on its own: a page under `docs/prds/` is
 * words a reader sees, and a workflow is a deploy step. `ui-design.md` is not
 * here — its name would raise `surface` on every design round, an empty diff
 * included, and a screen, a state and a story each raise it from the line
 * itself. */
const ofFile = (file, found) => {
  if (file.startsWith("docs/prds/")) found.add("copy");
  if (/^\.github\/workflows\/.+\.ya?ml$/.test(file)) found.add("deploy");
};

const ofLine = (text, found, file, section) => {
  const line = text.trim();
  if (!line) return;
  const place = `${section}\n${line}`;

  // surface — a screen, a state, or a story
  if (/::(story|figma)/.test(line)) found.add("surface");
  if (under(section, "Screens") || under(section, "States"))
    found.add("surface");
  if (heading(line) && (under(line, "Screens") || under(line, "States")))
    found.add("surface");

  // schema — a data model
  if (/#{1,6}\s+(Data model|Database Schema)\b/i.test(place))
    found.add("schema");

  // export — a public export or an interface
  if (/\bexports?\b/i.test(line)) found.add("export");
  if (/#{1,6}\s+(Service Interfaces|API Contracts)\b/i.test(place))
    found.add("export");
  if (line.startsWith("|") && under(section, "Components") && exported(line))
    found.add("export");

  // system — another system reached
  if (/\b(slack|github|figma)\b/i.test(line) || /https?:\/\//.test(line))
    found.add("system");

  // migration — a migration task group, or the plan for one
  if (/^#{1,6}\s+\d+\.\s.*migrat/i.test(line)) found.add("migration");
  if (/#{1,6}\s+Migration Plan\b/i.test(place)) found.add("migration");

  // flag — a flag on a task group
  if (/\bflags?\b/i.test(line)) found.add("flag");

  // money — an amount in minor units
  if (/\bminor units\b|\bISO 4217\b|\bmoney\b/i.test(line)) found.add("money");

  // deploy — a deploy step
  if (
    /#{1,6}\s+Deploy\b/i.test(place) ||
    /\bdeploy(s|ed|ing|ment)?\b/i.test(line)
  )
    found.add("deploy");

  // copy — a page's words, or words a reader sees
  if (/#{1,6}\s+Copy\b/i.test(place)) found.add("copy");
  if (prose(line, file)) found.add("copy");
};

/** A backticked `PascalCase` name: what a `## Components` table calls an
 * export. */
const exported = (line) => /`[A-Z][A-Za-z0-9]*[a-z][A-Za-z0-9]*`/.test(line);

/** Plain prose: words a reader would read as a sentence. A heading, a table
 * row, a fence and a task line are all structure, and a line of two or three
 * words is a label. Prose lives in markdown, so a code file's comment is not
 * a page's words. */
const prose = (line, file) => {
  if (file && !file.endsWith(".md")) return false;
  if (heading(line) || line.startsWith("|") || line.startsWith("```"))
    return false;
  if (/^[-*+]\s*\[[ xX]\]/.test(line)) return false;
  const words = line
    .replace(/`[^`]*`/g, " ")
    .replace(/\*\*[^*]*\*\*/g, " ")
    .split(/\s+/)
    .filter((word) => /^[A-Za-z][A-Za-z'’]*[,.;:)]?$/.test(word));
  return words.length >= 4;
};

/**
 * The readers a round dispatches: every perspective of that artifact — or of
 * the `apply:` block, for a task group — whose `when` the draft's triggers
 * intersect, plus every `always`. One reader per perspective, keyed by its
 * own `name`: several perspectives may share an agent — `tech.md`'s four
 * readings on `tech-design.md`, `build.md`'s four on a task group — and each
 * is still its own dispatch, its `name` telling the shared agent which
 * reading is theirs. Two entries are never merged into one on the strength
 * of a shared agent.
 *
 * `summonedBy` is what the draft raised for that reader, empty for one that
 * runs because it always does.
 */
export function readersFor(schema, target, triggers) {
  const raised = new Set(triggers ?? []);
  const readers = new Map();
  for (const { name, when, agent } of perspectivesOf(schema, target)) {
    const summonedBy = when.filter(
      (one) => one !== "always" && raised.has(one),
    );
    if (summonedBy.length === 0 && !when.includes("always")) continue;
    readers.set(name, { name, when: [...when], agent, summonedBy });
  }
  return [...readers.values()];
}

/**
 * Whether a verifier reads this round's findings.
 *
 * Every dispatched reader counts, the `always` floor included: a verifier
 * exists to reconcile two readings of one draft, and two readings are two
 * readings however each was summoned. A round that dispatched one reader in
 * all dispatches none — that reader argues its own findings, and there is
 * nothing to reconcile it against.
 */
export function verifierNeeded(readers) {
  return readers.length > 1;
}

/** The perspectives recorded for one artifact, or for a task group. */
export function perspectivesOf(schema, target) {
  const artifact = artifactOf(schema, target);
  if (artifact) return artifact.perspectives;
  if (isGroup(target)) return schema.apply;
  throw new Error(
    `${target} is neither an artifact of the schema nor a task group`,
  );
}

/** A task group is named by its number - `3`, `3.`, `group 3` - or by the
 * block its readers sit on. */
export const isGroup = (target) =>
  /^(?:apply|group)$/i.test(String(target ?? "").trim()) ||
  /^(?:group\s*)?\d+(?:\.\d+)*\.?$/.test(String(target ?? "").trim());

const artifactOf = (schema, target) => {
  const named = String(target ?? "").trim();
  if (!named) return undefined;
  return (
    schema.artifacts.find(({ id }) => id === named) ??
    schema.artifacts.find(
      ({ generates }) => generates === named || generates.endsWith(`/${named}`),
    )
  );
};

/** The file `classifyDiff` reads a header-less diff against: `target`'s own
 * artifact, resolved through `artifactOf`, or the plan's `tasks.md` for a
 * task group — no artifact of its own. A globbed `generates` names one file
 * per capability rather than one file, so it raises nothing on its own; the
 * diff's own `diff --git` headers do that instead. */
const initialFile = (schema, target) => {
  const artifact = artifactOf(schema, target) ?? taskArtifact(schema, target);
  if (!artifact || artifact.generates.includes("*")) return "";
  return artifact.generates;
};

const taskArtifact = (schema, target) =>
  isGroup(target)
    ? schema.artifacts.find(({ id }) => id === "tasks")
    : undefined;

/**
 * What one reader is given: the draft, and what is before it. Nothing else —
 * no other reader's findings, and no verifier's verdict, which is why the
 * bundle carries two keys and not three.
 *
 * `upstream` is the schema's own set for that artifact, in the order it
 * records it, resolved to the files the change carries, followed by the page
 * sections the change's proposal marks. The pages come last because they are
 * the store's, not the change's: they are what the change is measured
 * against.
 */
export function bundleFor(root, change, target, schema = planningSchema(root)) {
  const dir = posix(join("openspec", "changes", change));
  const pages = pageSections(root, dir);
  const artifact = artifactOf(schema, target);
  if (!artifact) {
    if (!isGroup(target))
      throw new Error(
        `${target} is neither an artifact of the schema nor a task group`,
      );
    // A task group's draft is the plan it implements; everything the plan was
    // drawn from is before it.
    const tasks = schema.artifacts.find(({ id }) => id === "tasks");
    return {
      draft: `${dir}/${tasks?.generates ?? "tasks.md"}`,
      upstream: [
        ...upstreamOf(root, dir, schema, tasks?.upstream ?? []),
        ...pages,
      ],
    };
  }
  return {
    draft: draftOf(root, dir, artifact.generates),
    upstream: [...upstreamOf(root, dir, schema, artifact.upstream), ...pages],
  };
}

/** The draft the round is writing: one path where the artifact is one file,
 * the paths it has where it is one per capability, and the pattern itself
 * where the round has yet to write any of them. */
const draftOf = (root, dir, generates) => {
  const written = filesOf(root, dir, generates);
  if (written.length === 1) return written[0];
  if (written.length === 0) return `${dir}/${generates}`;
  return written;
};

const upstreamOf = (root, dir, schema, ids) => {
  const files = [];
  for (const id of ids) {
    const artifact = schema.artifacts.find((one) => one.id === id);
    if (!artifact) continue;
    for (const file of filesOf(root, dir, artifact.generates))
      if (!files.includes(file)) files.push(file);
  }
  return files;
};

/** The files one artifact has in this change. A `generates` with no glob is
 * one path; `specs/**` is one file per capability directory the change
 * carries. Only what exists: a reader is given what is written, and the round
 * asks for a draft that is not. */
const filesOf = (root, dir, generates) => {
  if (!generates.includes("*")) {
    const path = `${dir}/${generates}`;
    return existsSync(join(root, path)) ? [path] : [];
  }
  const name = generates.slice(generates.lastIndexOf("/") + 1);
  const top = `${dir}/${generates.slice(0, generates.indexOf("/**"))}`;
  return walk(root, top)
    .filter((path) => path.endsWith(`/${name}`))
    .sort();
};

const walk = (root, dir) => {
  const absolute = join(root, dir);
  if (!existsSync(absolute)) return [];
  const found = [];
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) found.push(...walk(root, path));
    else found.push(path);
  }
  return found;
};

/** The page sections the change's proposal marks: every `docs/prds/` link it
 * carries, with its anchor. The proposal is where a change names the pages it
 * moves, so this is the store's own reading of "what is before it" — and,
 * through `lib/writable.mjs`, of what a re-read of that change may write. */
export const pageSections = (root, dir) => {
  const proposal = join(root, dir, "proposal.md");
  if (!existsSync(proposal)) return [];
  /** page → the sections it was linked by, empty where the whole page was. */
  const marked = new Map();
  for (const link of readFileSync(proposal, "utf8").matchAll(
    /\]\(([^)\s]+)\)/g,
  )) {
    const [target, anchor] = link[1].split("#");
    if (!target.endsWith(".md")) continue;
    const page = pageOf(root, dir, target);
    if (page === undefined) continue;
    const sections = marked.get(page) ?? [];
    if (anchor && sections !== null) sections.push(`${page}#${anchor}`);
    marked.set(page, anchor ? sections : null);
  }
  const found = [];
  // A page linked whole is the page; a page linked by its sections is those
  // sections, without the page again above them.
  for (const [page, sections] of marked)
    for (const one of sections === null ? [page] : [...new Set(sections)])
      found.push(one);
  return found;
};

const pageOf = (root, dir, target) => {
  const candidates = [posix(relative(root, resolve(join(root, dir), target)))];
  if (target.startsWith("docs/")) candidates.push(target);
  for (const path of candidates)
    if (path.startsWith("docs/prds/") && existsSync(join(root, path)))
      return path;
  return undefined;
};

const posix = (path) => path.split(sep).join("/");
