/**
 * The readers a diff summons.
 *
 * The readers are data in `openspec/schemas/grade10-planning/schema.yaml`,
 * beside each artifact, on the schema's `apply:` block for a task group and on
 * its `bug:` block for a bug fix's rounds. This module holds no copy of that
 * table: it reads it through the store's own reader, classifies the diff
 * against the `when` triggers, and answers with the readers the diff summoned
 * plus every `always`. `bug-readers.mjs` is its caller.
 */
import {
  bugPerspectives,
  schemaArtifacts,
} from "../../../tools/openspec-store/src/read-schema.mts";
import { TRIGGERS } from "../../../tools/openspec-store/src/types.ts";

export { TRIGGERS };

export const SCHEMA = "grade10-planning";

/** The schema as this module needs it: the readers of each bug round, off
 * its `bug:` block. Read through `tools/openspec-store/src/read-schema.mts` —
 * the store's one reader of the file — rather than a second parse of it here.
 *
 * A schema the store holds no file for is refused rather than answered with
 * no readers, which would say nothing about the file being missing. */
export function planningSchema(root, schema = SCHEMA) {
  const artifacts = schemaArtifacts(root, schema);
  if (artifacts === undefined)
    throw new Error(
      `no schema at openspec/schemas/${schema}/schema.yaml — a round reads its readers from there`,
    );
  return { bug: bugPerspectives(root, schema) };
}

/**
 * The triggers a diff raises. `diffText` is a unified diff — what `git diff`
 * prints — and `target` names the bug round it is read for, `bug:diagnosis`
 * or `bug:fix`.
 *
 * A trigger is raised by a changed line, by the file the line is in, or by the
 * section the hunk sits under. Context lines raise nothing: a round is sized
 * by what the draft changed. The file a line sits in usually comes from the
 * diff's own `diff --git` header; a diagnosis carrying no header is read as
 * `diagnosis.md`.
 */
export function classifyDiff(diffText, target = "") {
  const found = new Set();
  let file = initialFile(target);
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
 * The readers a round dispatches: every perspective of that bug round whose
 * `when` the diff's triggers intersect, plus every `always`. One reader per
 * perspective, keyed by its own `name`: several perspectives may share an
 * agent — `build.md`'s three readings on a fix — and each is still its own
 * dispatch, its `name` telling the shared agent which
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

/** The perspectives recorded for one bug round. */
export function perspectivesOf(schema, target) {
  const round = bugRound(target);
  if (!round) throw new Error(`${target} is not a bug round`);
  const readers = schema.bug?.[round] ?? [];
  if (readers.length === 0)
    throw new Error(
      `the schema's \`bug:\` block names no readers for ${round} - a bug round would dispatch nobody`,
    );
  return readers;
}

/** A bug's round is named `bug:diagnosis` or `bug:fix`; anything else is not
 * one. */
export const bugRound = (target) =>
  /^bug:(diagnosis|fix)$/.exec(String(target ?? "").trim())?.[1];

/** The file `classifyDiff` reads a header-less diff against: the diagnosis
 * round's draft is the diagnosis; a fix's diff carries its own headers. */
const initialFile = (target) =>
  bugRound(target) === "diagnosis" ? "diagnosis.md" : "";
