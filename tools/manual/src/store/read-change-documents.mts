import { readdirSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import type {
  ChangeArtifact,
  ChangeArtifactKind,
  ChangeDeltaDocument,
  ChangeDocument,
  DeltaSection,
} from "../api/types.ts";
import {
  readTextIfExists,
  storePath,
  subdirectories,
  toItemError,
} from "./disk.mts";
import type { GitIndex } from "./git.mts";
import { findSection, leadingTitle, outline } from "./markdown.mts";
import {
  deltaFiles,
  deltaKindOf,
  deltaRequirementSections,
  deltaSections,
  renamedPairs,
} from "./read-changes.mts";
import { readJourney, readRequirement, readTestCases } from "./read-specs.mts";

/**
 * A change, whole. The snapshot's entry is the board's row — lane facts,
 * counts, the requirement names a delta touches. This is the reading: every
 * artifact the change's schema asks for, present or still to write, the prose
 * ones as written, each delta parsed as the contract it proposes, and the
 * suite QA wrote beside it. Its own artifact per change, so the snapshot stays
 * the size of the board and a reader fetches only the change they open.
 */

/** The order artifacts land in when the schema cannot say — a change with no
 * manifest, or one on a schema this store does not define. It decides nothing
 * about which files exist, and a document built on it claims nothing is
 * missing. */
const FALLBACK: { id: string; generates: string }[] = [
  { id: "proposal", generates: "proposal.md" },
  { id: "specs", generates: "specs/**/*.md" },
  { id: "design", generates: "design.md" },
  { id: "ui", generates: "ui.md" },
  { id: "tasks", generates: "tasks.md" },
];

export function readChangeDocuments(
  root: string,
  git: GitIndex,
): ChangeDocument[] {
  const dir = join(root, "openspec", "changes");
  return subdirectories(dir)
    .filter((name) => name !== "archive")
    .map((name) => readChangeDocument(root, join(dir, name), name, git));
}

export function readChangeDocument(
  root: string,
  dir: string,
  id: string,
  git: GitIndex,
): ChangeDocument {
  const rel = storePath(root, dir);
  const schema = schemaOf(dir);
  const declared = schema === "" ? undefined : schemaArtifacts(root, schema);

  return {
    id,
    dir: rel,
    schema,
    schemaKnown: declared !== undefined,
    artifacts: readArtifacts(root, dir, rel, declared ?? FALLBACK, git),
    deltas: deltaFiles(root, dir).map(({ spec, file }) =>
      readDelta(root, spec, file, git),
    ),
  };
}

/** The schema a change was created under, from the manifest the CLI writes
 * beside its artifacts. Empty when there is none, or it names none. */
function schemaOf(dir: string): string {
  const manifest = readTextIfExists(join(dir, ".openspec.yaml"));
  if (manifest === undefined) return "";
  try {
    const parsed = YAML.parse(manifest);
    const schema = (parsed as { schema?: unknown } | null)?.schema;
    return typeof schema === "string" ? schema : "";
  } catch {
    // The entry already carries this manifest's error; the document has
    // nothing to add and reads the change as if it named no schema.
    return "";
  }
}

/** The artifacts a schema declares, in the order it declares them — the
 * order they are written in, each built on the one before. Undefined for a
 * schema this store does not define: the built-ins live inside the CLI, and
 * guessing their shape would let the strip claim a file is missing that the
 * schema never asked for. */
export function schemaArtifacts(
  root: string,
  schema: string,
): { id: string; generates: string }[] | undefined {
  const text = readTextIfExists(
    join(root, "openspec", "schemas", schema, "schema.yaml"),
  );
  if (text === undefined) return undefined;
  const parsed = YAML.parse(text) as { artifacts?: unknown } | null;
  const listed = Array.isArray(parsed?.artifacts) ? parsed.artifacts : [];
  const artifacts: { id: string; generates: string }[] = [];
  for (const entry of listed) {
    const fields = (entry ?? {}) as Record<string, unknown>;
    if (typeof fields.id !== "string" || typeof fields.generates !== "string")
      continue;
    artifacts.push({ id: fields.id, generates: fields.generates });
  }
  return artifacts;
}

/** How an artifact renders, from what the schema says it generates: a
 * directory of deltas and the checklist are read structurally, everything
 * else is prose whatever it is called. */
function kindOf(generates: string): ChangeArtifactKind {
  if (generates.startsWith("specs/")) return "specs";
  if (generates === "tasks.md") return "tasks";
  return "doc";
}

/**
 * Every artifact the change could have, in schema order, then the markdown
 * files the schema never named — a change carrying a README carries it for a
 * reason, and a document that lists only what it expected hides half the
 * change. Those come last, since nothing says where they belong.
 */
function readArtifacts(
  root: string,
  dir: string,
  rel: string,
  order: { id: string; generates: string }[],
  git: GitIndex,
): ChangeArtifact[] {
  const unclaimed = new Set(
    readdirSync(dir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.endsWith(".md") &&
          !entry.name.startsWith("."),
      )
      .map((entry) => entry.name),
  );
  const artifacts: ChangeArtifact[] = [];

  for (const { id, generates } of order) {
    const kind = kindOf(generates);
    if (kind === "specs") {
      artifacts.push({
        name: id,
        kind,
        present: deltaFiles(root, dir).length > 0,
      });
      continue;
    }
    const present = unclaimed.delete(generates);
    artifacts.push(
      fileArtifact(root, id, kind, `${rel}/${generates}`, present, git),
    );
  }

  for (const file of [...unclaimed].sort()) {
    artifacts.push(
      fileArtifact(root, file.slice(0, -3), "doc", `${rel}/${file}`, true, git),
    );
  }
  return artifacts;
}

function fileArtifact(
  root: string,
  name: string,
  kind: ChangeArtifactKind,
  path: string,
  present: boolean,
  git: GitIndex,
): ChangeArtifact {
  const artifact: ChangeArtifact = { name, kind, path, present };
  if (!present) return artifact;
  if (kind === "doc") artifact.text = readTextIfExists(join(root, path)) ?? "";
  const lastCommit = git.commitOf(path);
  if (lastCommit) artifact.lastCommit = lastCommit;
  return artifact;
}

/**
 * One delta file as the contract it proposes: purpose, feature set, the
 * journeys it issues, and each delta section's requirements with their
 * scenarios — what the durable spec will say once the change folds. The raw
 * text rides beside it for the reading that wants the file as written, and a
 * file the reader cannot parse keeps that text and says what broke.
 */
function readDelta(
  root: string,
  spec: string,
  file: string,
  git: GitIndex,
): ChangeDeltaDocument {
  const text = readTextIfExists(join(root, file)) ?? "";
  const document: ChangeDeltaDocument = {
    spec,
    path: file,
    text,
    sections: [],
  };
  const lastCommit = git.commitOf(file);
  if (lastCommit) document.lastCommit = lastCommit;

  try {
    const title = leadingTitle(outline(text));
    if (title) document.title = title;
    const sections = deltaSections(text);
    const purpose = findSection(sections, "Purpose");
    if (purpose) document.purpose = purpose.body;
    const featureSet = findSection(sections, "Feature set");
    if (featureSet) document.featureSet = featureSet.body;
    const journeys = findSection(sections, "User journeys");
    if (journeys) document.journeys = journeys.children.map(readJourney);

    for (const section of sections) {
      const kind = deltaKindOf(section.heading);
      if (kind === undefined) continue;
      const delta: DeltaSection =
        kind === "renamed"
          ? { kind, requirements: [], renames: renamedPairs(section.raw) }
          : {
              kind,
              requirements: deltaRequirementSections(section).map(({ block }) =>
                readRequirement(block),
              ),
            };
      document.sections.push(delta);
    }
  } catch (cause) {
    document.error = toItemError(file, cause);
  }

  const casesFile = file.replace(/spec\.md$/, "test-cases.md");
  const cases = readTextIfExists(join(root, casesFile));
  if (cases !== undefined) {
    try {
      const suite = readTestCases(cases);
      document.suite = {
        status: suite.status,
        cases: suite.cases,
        ...(suite.outOfSuite.length > 0
          ? { outOfSuite: suite.outOfSuite }
          : {}),
      };
    } catch (cause) {
      document.suiteError = toItemError(casesFile, cause);
    }
  }
  return document;
}
