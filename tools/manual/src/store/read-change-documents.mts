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
  featureSuitePath,
  readText,
  readTextIfExists,
  storePath,
  subdirectories,
  toItemError,
} from "./disk.mts";
import type { GitIndex, StoreMain } from "./git.mts";
import { findSection, leadingTitle, outline } from "./markdown.mts";
import {
  deltaFiles,
  deltaKindOf,
  deltaRequirementSections,
  deltaSections,
  planOf,
  renamedPairs,
} from "./read-changes.mts";
import { schemaArtifacts } from "./read-schema.mts";
import { readJourneys, readRequirement, readTestCases } from "./read-specs.mts";

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
  { id: "specs", generates: "specs/**/spec.md" },
  { id: "user-journeys", generates: "specs/**/user-journeys.md" },
  { id: "test-cases", generates: "specs/**/feature-tcs.md" },
  { id: "ui-design", generates: "ui-design.md" },
  { id: "tech-design", generates: "tech-design.md" },
  { id: "tasks", generates: "tasks.md" },
];

/** `main` is where a change on it has its task list read, as the board reads
 * it; `null` reads every change from disk. */
export function readChangeDocuments(
  root: string,
  git: GitIndex,
  main: StoreMain | null,
): ChangeDocument[] {
  const dir = join(root, "openspec", "changes");
  return subdirectories(dir)
    .filter((name) => name !== "archive")
    .map((name) => readChangeDocument(root, join(dir, name), name, git, main));
}

export function readChangeDocument(
  root: string,
  dir: string,
  id: string,
  git: GitIndex,
  main: StoreMain | null,
): ChangeDocument {
  const rel = storePath(root, dir);
  const schema = schemaOf(dir);
  const declared = schema === "" ? undefined : schemaArtifacts(root, schema);
  const deltas = deltaFiles(root, dir).map(({ spec, file }) =>
    readDelta(root, spec, file, git),
  );

  return {
    id,
    dir: rel,
    schema,
    schemaKnown: declared !== undefined,
    artifacts: readArtifacts(
      dir,
      rel,
      declared ?? FALLBACK,
      deltas,
      git,
      root,
      planOf(dir, id, main).text !== undefined,
    ),
    deltas,
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

/** How an artifact renders, from what the schema says it generates: the
 * three files a capability directory holds and the checklist are read
 * structurally, everything else is prose whatever it is called. */
function kindOf(generates: string): ChangeArtifactKind {
  if (generates.startsWith("specs/")) {
    if (generates.endsWith("/user-journeys.md")) return "journeys";
    // A suite's file name carries its level
    // (`docs/governance/specs-to-test-cases.md`, Levels), so every level's
    // suite is a change's cases artifact. `test-cases.md` is not a suite name.
    if (generates.endsWith("-tcs.md")) return "cases";
    return "specs";
  }
  if (generates === "tasks.md") return "tasks";
  return "doc";
}

/** Whether a per-capability artifact exists, read off the deltas that were
 * already parsed rather than the disk a second time. The deltas are the
 * capability directories, so an artifact is present when any of them
 * carries its file. */
function inDeltas(
  kind: ChangeArtifactKind,
  deltas: ChangeDeltaDocument[],
): boolean {
  if (kind === "journeys")
    return deltas.some(
      (delta) => (delta.journeys?.length ?? 0) > 0 || delta.journeysError,
    );
  if (kind === "cases")
    return deltas.some(
      (delta) => delta.suite !== undefined || delta.suiteError,
    );
  return deltas.length > 0;
}

/**
 * Every artifact the change could have, in schema order, then the markdown
 * files the schema never named — a change carrying a README carries it for a
 * reason, and a document that lists only what it expected hides half the
 * change. Those come last, since nothing says where they belong. `rounds.md`
 * is one of them: the round writes it and the schema issues no id for it, so
 * it reads as a `doc` named `rounds`, whose text is the record's table.
 */
function readArtifacts(
  dir: string,
  rel: string,
  order: { id: string; generates: string }[],
  deltas: ChangeDeltaDocument[],
  git: GitIndex,
  root: string,
  planned: boolean,
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
    if (kind === "specs" || kind === "journeys" || kind === "cases") {
      artifacts.push({ name: id, kind, present: inDeltas(kind, deltas) });
      continue;
    }
    const onDisk = unclaimed.delete(generates);
    const present = kind === "tasks" ? planned : onDisk;
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

  const journeysFile = file.replace(/spec\.md$/, "user-journeys.md");
  const journeys = readTextIfExists(join(root, journeysFile));
  if (journeys !== undefined) {
    try {
      document.journeys = readJourneys(journeys);
    } catch (cause) {
      document.journeysError = toItemError(journeysFile, cause);
    }
  }

  const capabilityDir = file.replace(/\/spec\.md$/, "");
  const casesFile = featureSuitePath(root, capabilityDir);
  if (casesFile !== undefined) {
    try {
      const suite = readTestCases(readText(join(root, casesFile)));
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
