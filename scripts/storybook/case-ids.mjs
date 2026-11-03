/**
 * `pnpm storybook:case-ids` - holds every story bar a prototype to a
 * permanent `parameters.verification.caseId`, and with `--write` gives the
 * ones without one a fresh id. The panel finds a story's archived runs by
 * that id, so it is minted once, never changes, and names one story.
 */
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { STORY_CASES_FILE } from "../../packages/ui-verification/src/model.mjs";
import { storyFingerprints } from "./story-graph.mjs";
import { rootDirectory, storyIndex } from "./story-index.mjs";

/** Drafts outside the agreed look; their references are never approved. */
const EXEMPT_KIND = "Prototypes";

export const CASE_ID =
  /^vc_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export const newCaseId = () => `vc_${randomUUID()}`;

/** Every story bar a prototype: screens, flows, blocks and primitives alike. */
export const needsCaseId = (title) => !title.split("/").includes(EXEMPT_KIND);

/** What is wrong with the case ids of the parsed story files; empty when nothing is. */
export function caseIdErrors(parsed) {
  const errors = [];
  const seen = new Map();
  const note = (path, label, caseId) => {
    if (!CASE_ID.test(caseId)) {
      errors.push(
        `${path} - ${label} caseId "${caseId}" is not vc_<uuid>; run pnpm storybook:case-ids --write for a new one`,
      );
      return;
    }
    const prior = seen.get(caseId);
    if (prior)
      errors.push(
        `${path} - ${label} repeats the caseId of ${prior}; a case names one story`,
      );
    else seen.set(caseId, `${path} ${label}`);
  };

  for (const [path, file] of Object.entries(parsed)) {
    if (!file.title) continue;
    if (file.caseId) note(path, "the meta", file.caseId);
    for (const story of file.stories) {
      if (story.caseId) note(path, `"${story.exportName}"`, story.caseId);
    }
  }
  for (const [path, file] of Object.entries(parsed)) {
    if (!file.title || !needsCaseId(file.title)) continue;
    const shared = file.stories.length === 1 ? file.caseId : null;
    for (const story of file.stories) {
      if (story.caseId || shared) continue;
      errors.push(
        `${path} - "${story.exportName}" has no verification caseId; run pnpm storybook:case-ids --write`,
      );
    }
  }
  return errors;
}

/** Stories that lack a case id and have a literal to take one. */
export function missingCaseIds(parsed) {
  const missing = [];
  const unplaceable = [];
  for (const [path, file] of Object.entries(parsed)) {
    if (!file.title || !needsCaseId(file.title)) continue;
    const shared = file.stories.length === 1 ? file.caseId : null;
    for (const story of file.stories) {
      if (story.caseId || shared) continue;
      if (story.edit) missing.push({ path, story });
      else unplaceable.push(`${path} - "${story.exportName}"`);
    }
  }
  return { missing, unplaceable };
}

const insertion = (edit, caseId, original) => {
  if (edit.kind === "wrap")
    return `{ ...${original}, verification: { caseId: "${caseId}" } }`;
  if (edit.kind === "assign")
    return `\n${edit.name}.parameters = { ...${edit.name}.parameters, verification: { caseId: "${caseId}" } };`;
  return edit.kind === "parameters"
    ? ` verification: { caseId: "${caseId}" },`
    : ` parameters: { verification: { caseId: "${caseId}" } },`;
};

/** Adds a case id to each story without one. Returns the ids it minted by file. */
export async function assignCaseIds({
  root = rootDirectory,
  write = false,
} = {}) {
  const { files } = storyIndex({ root });
  const { missing, unplaceable } = missingCaseIds(files);
  const byFile = new Map();
  for (const entry of missing) {
    if (!byFile.has(entry.path)) byFile.set(entry.path, []);
    byFile.get(entry.path).push(entry.story);
  }

  const added = [];
  for (const [path, stories] of byFile) {
    let text = await readFile(join(root, path), "utf8");
    // Later offsets first, so an insertion never moves one still to come.
    for (const story of [...stories].sort(
      (a, b) => b.edit.offset - a.edit.offset,
    )) {
      const caseId = newCaseId();
      const end = story.edit.end ?? story.edit.offset;
      text = `${text.slice(0, story.edit.offset)}${insertion(story.edit, caseId, text.slice(story.edit.offset, end))}${text.slice(end)}`;
      added.push({ path, exportName: story.exportName, caseId });
    }
    if (write) await writeFile(join(root, path), text);
  }
  return { added, unplaceable, files: [...byFile.keys()] };
}

/** `[caseId, storyId, file]` for each story that carries one, to build a capture selection. */
export function listCaseIds({ root = rootDirectory, domain } = {}) {
  const { entries, files } = storyIndex({ root });
  const byPath = new Map();
  for (const entry of Object.values(entries))
    if (entry.type === "story")
      byPath.set(`${entry.path} ${entry.exportName}`, entry.id);
  const rows = [];
  for (const [path, file] of Object.entries(files)) {
    if (!file.title || (domain && file.title.split("/")[0] !== domain))
      continue;
    for (const story of file.stories) {
      const caseId =
        story.caseId ?? (file.stories.length === 1 ? file.caseId : null);
      if (caseId)
        rows.push([caseId, byPath.get(`${path} ${story.exportName}`), path]);
    }
  }
  return rows;
}

/** Every story case, with its story file's render fingerprint. */
export async function storyCases({ root = rootDirectory } = {}) {
  const fingerprints = await storyFingerprints({ root });
  return listCaseIds({ root }).map(([caseId, storyId, path]) => {
    const inputs = fingerprints.get(path);
    if (!storyId) throw new Error(`case ${caseId} names no built story`);
    if (!inputs) throw new Error(`${path} has no render fingerprint`);
    return { caseId, storyId, inputs };
  });
}

/** Writes every story case into a built Storybook, for its Worker to declare. */
export async function writeStoryCases(
  directory,
  { root = rootDirectory } = {},
) {
  const cases = await storyCases({ root });
  await writeFile(
    join(directory, STORY_CASES_FILE),
    `${JSON.stringify({ schemaVersion: 1, cases }, null, 2)}\n`,
  );
  return cases;
}

async function main() {
  const catalogue = process.argv.indexOf("--catalogue");
  if (catalogue !== -1) {
    const directory = process.argv[catalogue + 1];
    if (!directory)
      throw new Error("usage: case-ids.mjs --catalogue <storybook-static>");
    const cases = await writeStoryCases(resolve(directory));
    console.log(`Wrote ${cases.length} story cases to ${STORY_CASES_FILE}.`);
    return;
  }
  const list = process.argv.indexOf("--list");
  if (list !== -1) {
    const domain = process.argv[list + 1];
    for (const [caseId, id] of listCaseIds({ domain }))
      console.log(`${caseId}\t${id}`);
    return;
  }
  const write = process.argv.includes("--write");
  const { added, unplaceable, files } = await assignCaseIds({ write });
  for (const line of unplaceable)
    console.error(
      `error ${line} - no object literal to hold a caseId; add one by hand`,
    );
  console.log(
    write
      ? `Added ${added.length} caseIds in ${files.length} files. Run pnpm exec biome check --write on them.`
      : `${added.length} stories in ${files.length} files lack a caseId. Run with --write to add them.`,
  );
  if (unplaceable.length) process.exitCode = 1;
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
