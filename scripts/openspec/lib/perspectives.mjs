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
import { TRIGGERS, WHOLE_CHANGE } from "../../../tools/manual/src/api/types.ts";
import { sectionLinesOf } from "../../../tools/manual/src/content/sections.ts";
import { outline } from "../../../tools/manual/src/store/markdown.mts";
import {
  applyPerspectives,
  bugPerspectives,
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
  return {
    artifacts,
    apply: applyPerspectives(root, schema),
    bug: bugPerspectives(root, schema),
  };
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

/** What the file a line sits in says on its own: a page under `docs/prds/` and
 * a message catalog are words a reader sees, and a workflow is a deploy step.
 * `code` is not here — it is a changed line, so a rename, a mode change or a
 * binary diff raises nothing (`ofLine`). `ui-design.md` is not here either —
 * its name would raise `surface` on every design round, an empty diff
 * included, and a screen, a state and a story each raise it from the line
 * itself. */
const ofFile = (file, found) => {
  if (file.startsWith("docs/prds/") || isCatalog(file)) found.add("copy");
  if (/^\.github\/workflows\/.+\.ya?ml$/.test(file)) found.add("deploy");
};

/** The one boundary between words and code: a markdown file or a message
 * catalog holds what a reader reads, and any other file is code. */
const isWords = (file) => isMarkdown(file) || isCatalog(file);

/** A markdown file: where `prose` looks for a sentence. */
const isMarkdown = (file) => file.endsWith(".md");

/** A message catalog: the words a surface shows, one layer and language each. */
const isCatalog = (file) => file.startsWith("packages/i18n/messages/");

const ofLine = (text, found, file, section) => {
  // code — a changed line in any file that is neither markdown nor a catalog:
  // a task group that lands code is read by the build's three readings, and
  // one that lands words alone is not
  if (file && !isWords(file)) found.add("code");
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

  // export — a public export or an interface: the line's own key term, the
  // heading the interfaces sit under, or a `## Components` table's export
  if (bold(line, "export") || column(line, "export") || keyed(line, "export"))
    found.add("export");
  if (/#{1,6}\s+(Service Interfaces|API Contracts)\b/i.test(place))
    found.add("export");
  if (line.startsWith("|") && under(section, "Components") && exported(line))
    found.add("export");

  // system — another system reached: a URL, or an integration table's row
  if (/https?:\/\//.test(line)) found.add("system");
  if (
    line.startsWith("|") &&
    (/\b(slack|github|figma)\b/i.test(line) || under(section, "Integrations"))
  )
    found.add("system");

  // migration — a migration task group, or the plan for one
  if (/^#{1,6}\s+\d+\.\s.*migrat/i.test(line)) found.add("migration");
  if (/#{1,6}\s+Migration Plan\b/i.test(place)) found.add("migration");

  // flag — a flag on a task group: a `flag:` key, a flag column, a section
  if (keyed(line, "flag") || column(line, "flag")) found.add("flag");
  if (/#{1,6}\s+Flags?\b/i.test(place)) found.add("flag");

  // money — an amount in minor units, or a currency by its standard
  if (/\bminor units\b|\bISO[\s-]?4217\b/i.test(line)) found.add("money");

  // deploy — a deploy step: a Deploy heading, or the workflow file `ofFile`
  // reads
  if (/#{1,6}\s+Deploy\b/i.test(place)) found.add("deploy");

  // copy — a page's words, or words a reader sees
  if (/#{1,6}\s+Copy\b/i.test(place)) found.add("copy");
  if (prose(line, file)) found.add("copy");
};

/** A backticked `PascalCase` name: what a `## Components` table calls an
 * export. */
const exported = (line) => /`[A-Z][A-Za-z0-9]*[a-z][A-Za-z0-9]*`/.test(line);

/**
 * A line whose key term is `name`, read off the three structures the store
 * writes one in: the bold lead an item leads with (`- **Export** `roundRow``),
 * a table's own column (`| Flag | Off in |`), and a key (`flag: round-record`).
 *
 * Every trigger fetches a reader, so a trigger raised off a bare word in a
 * sentence summoned operations to read a change that deploys nothing and
 * backend to read one that exports nothing. Prose about the product carries
 * none of the three.
 */
const bold = (line, name) =>
  new RegExp(`^[-*+]?\\s*\\*\\*${name}s?\\*\\*`, "i").test(line);
const column = (line, name) =>
  new RegExp(`^\\|(?:[^|]*\\|)*\\s*${name}s?\\s*\\|`, "i").test(line);
const keyed = (line, name) =>
  new RegExp(`(?:^|[\\s\`|(])${name}s?\\s*:`, "i").test(line);

/** Plain prose: words a reader would read as a sentence. A heading, a table
 * row, a fence and a task line are all structure, and a line of two or three
 * words is a label. Prose lives in markdown, so a code file's comment is not
 * a page's words. */
const prose = (line, file) => {
  if (file && !isMarkdown(file)) return false;
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

/**
 * The floor `plan:land --fix-pass` drops a row to: the `always` readers every
 * perspectives list of the schema shares — each artifact that carries one,
 * and the `apply:` block. Computed from the schema rather than declared in
 * the landing, so the day a second reader joins every list the fix pass owes
 * it too, and no constant has to be kept in step. A schema whose lists share
 * no such reader has no floor a fix pass could stand on, and is refused rather
 * than dropped to nothing.
 */
export function fixPassFloor(schema) {
  const names = [
    ...schema.artifacts.map((one) => one.perspectives),
    schema.apply,
  ]
    .filter((list) => Array.isArray(list) && list.length > 0)
    .map((list) =>
      list
        .filter(({ when }) => when.includes("always"))
        .map(({ name }) => name),
    );
  const shared = (names[0] ?? []).filter((name) =>
    names.every((list) => list.includes(name)),
  );
  if (shared.length === 0) {
    throw new Error(
      "the schema's perspectives share no `always` reader — a fix pass has no floor to drop to",
    );
  }
  return shared;
}

/** The perspectives recorded for one artifact, or for a task group. */
export function perspectivesOf(schema, target) {
  const artifact = artifactOf(schema, target);
  if (artifact) return artifact.perspectives;
  if (isGroup(target)) return schema.apply;
  const round = bugRound(target);
  if (round) {
    const readers = schema.bug?.[round] ?? [];
    if (readers.length === 0)
      throw new Error(
        `the schema's \`bug:\` block names no readers for ${round} - a bug round would dispatch nobody`,
      );
    return readers;
  }
  throw new Error(
    `${target} is neither an artifact of the schema, a task group, nor a bug round`,
  );
}

/** A bug's round is named `bug:diagnosis` or `bug:fix`; anything else is not
 * one. */
export const bugRound = (target) =>
  /^bug:(diagnosis|fix)$/.exec(String(target ?? "").trim())?.[1];

/** A task group is named by its number - `3`, `3.`, `group 3` - or by the
 * block its readers sit on; the reading of the whole change, which lands as a
 * group does, is read as one too. */
export const isGroup = (target) =>
  /^(?:apply|group)$/i.test(String(target ?? "").trim()) ||
  /^(?:group\s*)?\d+(?:\.\d+)*\.?$/.test(String(target ?? "").trim()) ||
  String(target ?? "").trim() === WHOLE_CHANGE;

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
  if (bugRound(target) === "diagnosis") return "diagnosis.md";
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
 * against. A task group reads by citation, as `groupReading` says.
 *
 * Each entry is a path, given whole, or `path#La-Lb`, those lines: one read
 * apiece, since none is larger than `MOST`. `warn` hears what a reading left
 * out that its author may not mean to: a cited id the change does not issue,
 * and a link to a section its page does not carry.
 */
export function bundleFor(
  root,
  change,
  target,
  schema = planningSchema(root),
  warn = (line) => console.error(line),
) {
  const dir = posix(join("openspec", "changes", change));
  const pages = pageExcerpts(root, dir, warn);
  const artifact = artifactOf(schema, target);
  if (!artifact) {
    if (!isGroup(target))
      throw new Error(
        `${target} is neither an artifact of the schema nor a task group`,
      );
    // A task group's draft is the plan it implements; everything the plan was
    // drawn from is before it.
    const tasks = schema.artifacts.find(({ id }) => id === "tasks");
    const plan = `${dir}/${tasks?.generates ?? "tasks.md"}`;
    const reading = groupReading(root, dir, plan, target, warn);
    return given(root, {
      draft: reading ? [{ file: plan, ranges: reading.plan }] : [whole(plan)],
      upstream: [
        ...upstreamOf(root, dir, schema, tasks?.upstream ?? [], reading),
        ...pages,
      ],
    });
  }
  const draft = draftOf(root, dir, artifact.generates);
  return given(root, {
    draft: (Array.isArray(draft) ? draft : [draft]).map(whole),
    upstream: [...upstreamOf(root, dir, schema, artifact.upstream), ...pages],
  });
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

/** A Read takes at most 25,000 tokens, and this store's densest prose runs
 * about 2 bytes a token: no entry is larger than this many bytes. */
const MOST = 45_000;
/** Two excerpts of one file this many lines apart or fewer are given as one:
 * one read fewer, and the lines between are the excerpts' own context. */
const NEAR = 30;

const whole = (file) => ({ file, ranges: null });

/** The draft as one entry or several, as `draftOf` returns it, and every
 * piece cut to entries a read takes whole. */
const given = (root, { draft, upstream }) => {
  const entries = (pieces) => pieces.flatMap((piece) => entriesOf(root, piece));
  const drafts = entries(draft);
  return {
    draft: drafts.length === 1 ? drafts[0] : drafts,
    upstream: entries(upstream),
  };
};

/** One file's piece as entries: the path where the piece is the whole file
 * and fits one read, `path#La-Lb` otherwise, each at most `MOST` bytes. A
 * draft the round has yet to write is its path, unread. */
const entriesOf = (root, { file, ranges }) => {
  if (!existsSync(join(root, file))) return [file];
  const lines = readFileSync(join(root, file), "utf8").split("\n");
  const last = filledTo(lines, 1, lines.length);
  const spans = merged(ranges ?? [{ start: 1, end: last }]);
  if (spans.length === 1 && spans[0].start === 1 && spans[0].end >= last) {
    const bytes = Buffer.byteLength(lines.slice(0, last).join("\n"));
    if (bytes <= MOST) return [file];
  }
  return spans.flatMap((span) =>
    cut(lines, span).map(({ start, end }) => `${file}#L${start}-L${end}`),
  );
};

/** Ranges in line order, those `NEAR` or fewer lines apart joined. */
const merged = (ranges) => {
  const out = [];
  for (const range of [...ranges].sort((a, b) => a.start - b.start)) {
    const previous = out.at(-1);
    if (previous && range.start <= previous.end + 1 + NEAR)
      previous.end = Math.max(previous.end, range.end);
    else out.push({ ...range });
  }
  return out;
};

/** A range cut at line ends into parts of at most `MOST` bytes each. */
const cut = (lines, { start, end }) => {
  const parts = [];
  let from = start;
  let bytes = 0;
  for (let line = start; line <= end; line += 1) {
    const size = Buffer.byteLength(lines[line - 1]) + 1;
    if (line > from && bytes + size > MOST) {
      parts.push({ start: from, end: line - 1 });
      from = line;
      bytes = 0;
    }
    bytes += size;
  }
  parts.push({ start: from, end });
  return parts;
};

/** The last line from `start` to `end`, 1-based, that holds anything. */
const filledTo = (lines, start, end) => {
  let last = end;
  while (last > start && lines[last - 1].trim() === "") last -= 1;
  return last;
};

/** Every heading of a file, fence-aware, in the order the file has them. */
const headingsOf = (text) => {
  const flat = [];
  const visit = (sections) => {
    for (const section of sections) {
      flat.push(section);
      visit(section.children);
    }
  };
  visit(outline(text));
  return flat;
};

/** The lines a heading's section spans: to the next heading at its level or
 * above, without the blank lines before it. */
const spanOf = (lines, heads, index) => {
  const head = heads[index];
  const next = heads.slice(index + 1).find((one) => one.level <= head.level);
  return {
    start: head.line,
    end: filledTo(lines, head.line, next ? next.line - 1 : lines.length),
  };
};

/** The ids a section can cite, in the store's grammar: a case
 * (`…-US1-TC2-1`), a scenario (`…-SC-12`) or a journey (`…-US-03`). */
const ID =
  /[a-z0-9][a-z0-9-]*?-(?:US-?\d+[a-z]?-TC\d+-\d+|SC-\d+[a-z]?|US-\d+[a-z]?)(?![\w-])/g;
const isId = (text) => {
  ID.lastIndex = 0;
  const match = ID.exec(text);
  return match !== null && match.index === 0 && match[0] === text;
};

/** A section's ids: those a code span holds whole, which the round and
 * `plan:land`'s `CITED` read, and those written outside any code span, which
 * neither can. */
const idsIn = (text) => {
  const cited = new Set();
  const bare = new Set();
  for (const line of text.split("\n"))
    line.split("`").forEach((piece, index) => {
      if (index % 2 === 1) {
        if (isId(piece)) cited.add(piece);
      } else for (const [id] of piece.matchAll(ID)) bare.add(id);
    });
  return { cited, bare };
};

/**
 * Where the change issues each id, and the lines a reader citing it is given:
 * a scenario's `#### Scenario:` heading gives the requirement it sits in and
 * the delta heading above that; a journey's heading in `user-journeys.md`
 * gives the journey, and its section of `feature-tcs.md` its cases; a case's
 * heading gives the case. Each file's `opening` is everything above its first
 * such block, and a requirements file's `kept` its removed and renamed
 * requirements, given wherever the file is.
 */
const issuedBy = (root, dir) => {
  const issued = new Map();
  const files = new Map();
  const casesOf = new Map();
  const specs = walk(root, `${dir}/specs`)
    .filter((path) => path.endsWith(".md"))
    .sort();
  for (const file of specs) {
    const lines = readFileSync(join(root, file), "utf8").split("\n");
    const heads = headingsOf(lines.join("\n"));
    const own = { opening: null, kept: [] };
    let first = null;
    const opens = (index) => {
      first ??= heads[index].line;
    };
    heads.forEach((head, index) => {
      const delta = /^(ADDED|MODIFIED|REMOVED|RENAMED) Requirements$/.exec(
        head.heading,
      );
      if (head.level === 2 && delta) {
        opens(index);
        if (delta[1] === "REMOVED" || delta[1] === "RENAMED")
          own.kept.push(spanOf(lines, heads, index));
        return;
      }
      const id =
        /^(?:Scenario:\s+)?([a-z0-9][a-z0-9-]*?-(?:US-?\d+[a-z]?(?:-TC\d+-\d+)?|SC-\d+[a-z]?))\b/.exec(
          head.heading,
        )?.[1];
      if (!id) return;
      opens(index);
      if (/-SC-/.test(id)) {
        const at = (level) =>
          heads.findLastIndex((one, j) => j < index && one.level === level);
        const requirement = at(3);
        const kind = at(2);
        issued.set(id, {
          file,
          ranges: [
            ...(kind === -1
              ? []
              : [{ start: heads[kind].line, end: heads[kind].line }]),
            spanOf(lines, heads, requirement === -1 ? index : requirement),
          ],
        });
      } else if (/-TC\d+-\d+$/.test(id))
        issued.set(id, { file, ranges: [spanOf(lines, heads, index)] });
      else if (file.endsWith("/feature-tcs.md"))
        casesOf.set(journeyKey(file, id), {
          file,
          ranges: [spanOf(lines, heads, index)],
        });
      else
        issued.set(id, {
          file,
          ranges: [spanOf(lines, heads, index)],
          journey: journeyKey(file, id),
        });
    });
    if (first !== null && first > 1)
      own.opening = { start: 1, end: filledTo(lines, 1, first - 1) };
    files.set(file, own);
  }
  return { issued, files, casesOf };
};

/** A journey by its capability's directory and its number, which
 * `user-journeys.md` writes `US-03` and `feature-tcs.md` writes `US3`. */
const journeyKey = (file, id) =>
  `${file.slice(0, file.lastIndexOf("/"))}#${Number(/US-?(\d+)/.exec(id)[1])}`;

/**
 * What one task group reads of the change, by what its own section cites in
 * backticks (Q117): the plan's opening and the group's section, and of the
 * journeys, requirements and cases only the blocks those ids are issued by,
 * with each such file's opening and a requirements file's removed and renamed
 * requirements. A group citing none of the change's ids reads none of them;
 * the rest of the change stays open on demand.
 *
 * Null - every capability, and the whole plan - for the reading of the whole
 * change. Refused where the plan carries no such group, and where the group
 * names one of the change's ids outside backticks: neither the round nor
 * `plan:land --tests` can read that citation, so it is fixed before a round
 * leans on it.
 */
const groupReading = (root, dir, plan, target, warn) => {
  const number = /^(?:group\s*)?(\d+)/i.exec(String(target).trim())?.[1];
  if (!number) return null;
  const text = existsSync(join(root, plan))
    ? readFileSync(join(root, plan), "utf8")
    : "";
  const lines = text.split("\n");
  const heads = headingsOf(text).filter((one) => one.level <= 2);
  const index = heads.findIndex(
    (one) => one.level === 2 && one.heading.startsWith(`${number}. `),
  );
  if (index === -1) throw new Error(`${plan} has no group ${number}`);
  const section = spanOf(lines, heads, index);
  const firstGroup = heads.find((one) => one.level === 2);
  const opening =
    firstGroup.line > 1
      ? [{ start: 1, end: filledTo(lines, 1, firstGroup.line - 1) }]
      : [];

  const { issued, files, casesOf } = issuedBy(root, dir);
  const { cited, bare } = idsIn(
    lines.slice(section.start - 1, section.end).join("\n"),
  );
  const uncited = [...bare].filter((id) => issued.has(id));
  if (uncited.length > 0)
    throw new Error(
      `group ${number} of ${plan} names ${uncited.join(", ")} without backticks: backtick each, so the round and \`plan:land --tests\` can read it`,
    );

  const blocks = new Map();
  const give = ({ file, ranges }) => {
    blocks.set(file, [...(blocks.get(file) ?? []), ...ranges]);
  };
  for (const id of cited) {
    const block = issued.get(id);
    if (!block) {
      warn(
        `group ${number} cites ${id}, which ${dir} does not issue: it brings nothing into the bundle`,
      );
      continue;
    }
    give(block);
    if (block.journey && casesOf.has(block.journey))
      give(casesOf.get(block.journey));
  }
  for (const [file, ranges] of blocks) {
    const own = files.get(file);
    blocks.set(file, [
      ...(own?.opening ? [own.opening] : []),
      ...ranges,
      ...(file.endsWith("/spec.md") ? (own?.kept ?? []) : []),
    ]);
  }
  return { plan: [...opening, section], blocks };
};

/** The change's own files before an artifact, in the schema's order, each
 * whole - or, on a group's reading, the per-capability files reduced to the
 * blocks the group cites, and those it cites nothing of left out. */
const upstreamOf = (root, dir, schema, ids, reading = null) => {
  const pieces = [];
  const seen = new Set();
  for (const id of ids) {
    const artifact = schema.artifacts.find((one) => one.id === id);
    if (!artifact) continue;
    for (const file of filesOf(root, dir, artifact.generates)) {
      if (seen.has(file)) continue;
      seen.add(file);
      if (!reading || !artifact.generates.startsWith("specs/**"))
        pieces.push(whole(file));
      else if (reading.blocks.has(file))
        pieces.push({ file, ranges: reading.blocks.get(file) });
    }
  }
  return pieces;
};

/** The page sections the proposal marks, as the lines each spans: a page
 * linked whole is the page, and a link to a section the page does not carry
 * gives the page whole - said through `warn`, since the reader of the link
 * meant something on that page. */
const pageExcerpts = (root, dir, warn) => {
  const byPage = new Map();
  for (const one of pageSections(root, dir)) {
    const [page, slug] = one.split("#");
    const piece = byPage.get(page) ?? { file: page, ranges: [] };
    byPage.set(page, piece);
    if (piece.ranges === null) continue;
    if (!slug) {
      piece.ranges = null;
      continue;
    }
    const lines = sectionLinesOf(readFileSync(join(root, page), "utf8"), slug);
    if (lines) piece.ranges.push(lines);
    else {
      warn(
        `${dir}/proposal.md links ${page}#${slug}, a section the page does not carry: the page is given whole`,
      );
      piece.ranges = null;
    }
  }
  return [...byPage.values()];
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

/** The two trees a proposal's link can reach: the pages it marks, and the
 * evidence it cites. A reference is explanatory rather than authoritative,
 * and it is a round's to correct the same way a page is — the relay's own
 * coarser set has held both since Q55. */
const LINKED = ["docs/prds/", "docs/references/"];

/** The page sections the change's proposal marks: every `docs/prds/` and
 * `docs/references/` link it carries, with its anchor. The proposal is where
 * a change names the pages it moves, so this is the store's own reading of
 * "what is before it" — and, through `lib/writable.mjs`, of what a re-read of
 * that change may write. */
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
    if (
      LINKED.some((one) => path.startsWith(one)) &&
      existsSync(join(root, path))
    )
      return path;
  return undefined;
};

const posix = (path) => path.split(sep).join("/");
