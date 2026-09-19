import { join } from "node:path";
import YAML from "yaml";
import { type Perspective, ROLES, type SchemaArtifact } from "../api/types.ts";
import { readTextIfExists, StoreFileError } from "./disk.mts";

/** The artifacts a schema declares, in the order it declares them — the
 * order they are written in, each built on the one before. Undefined for a
 * schema this store does not define: the built-ins live inside the CLI, and
 * guessing their shape would let a reader claim a file is missing that the
 * schema never asked for.
 *
 * `requires` is what makes an artifact owed and `upstream` is what its text is
 * drawn from. They are two lists because they answer two questions: the blind
 * suite is written without sight of the requirements it is reconciled against,
 * and the tech design is drawn beside the UI design rather than from it — so
 * an order alone would put every suite behind its own requirements. A key the
 * schema does not carry — `upstream`, or the readers a round classifies a diff
 * against — is read as absent rather than as a reason to drop the artifact.
 *
 * Both lists name artifacts of this same schema, so an id it issues nowhere is
 * refused rather than read as absent: the worklists would leave the artifact
 * owed by nobody and the freshness read would draw it from nothing, and each
 * of those is a silence where a typo was. */
export function schemaArtifacts(
  root: string,
  schema: string,
): SchemaArtifact[] | undefined {
  const parsed = schemaOf(root, schema);
  if (parsed === undefined) return undefined;
  const listed = Array.isArray(parsed.artifacts) ? parsed.artifacts : [];
  const artifacts: SchemaArtifact[] = [];
  for (const entry of listed) {
    const fields = (entry ?? {}) as Record<string, unknown>;
    if (typeof fields.id !== "string" || typeof fields.generates !== "string")
      continue;
    const teammate =
      typeof fields.teammate === "string" ? fields.teammate : undefined;
    const hand = handOf(fields.id, fields.hand);
    artifacts.push({
      id: fields.id,
      generates: fields.generates,
      ...(teammate ? { teammate } : {}),
      ...(hand ? { hand } : {}),
      requires: strings(fields.requires),
      upstream: strings(fields.upstream),
      perspectives: perspectives(fields.perspectives),
      required: fields.required !== false,
    });
  }
  const issued = new Set(artifacts.map((one) => one.id));
  for (const artifact of artifacts) {
    for (const key of ["requires", "upstream"] as const) {
      for (const id of artifact[key]) {
        if (issued.has(id)) continue;
        throw new StoreFileError(
          1,
          `\`${artifact.id}\` names \`${id}\` in \`${key}:\`, which this schema issues nowhere — name one of ${[...issued].map((one) => `\`${one}\``).join(", ")}`,
        );
      }
    }
  }
  return artifacts;
}

/** The role a schema names as an artifact's hand. A key it does not carry is
 * read as absent — the artifact is shown against no role — but a role outside
 * the six is refused: every surface that names a hand and every message that
 * addresses one reads this, and a role nothing can route to is a silence
 * where a typo was. */
function handOf(id: string, value: unknown): SchemaArtifact["hand"] {
  if (value === undefined || value === null) return undefined;
  const named = ROLES.find((role) => role === value);
  if (!named) {
    throw new StoreFileError(
      1,
      `\`${id}\` names \`${String(value)}\` in \`hand:\`, which is no role — name one of ${ROLES.map((role) => `\`${role}\``).join(", ")}`,
    );
  }
  return named;
}

/** The readers a round on a task group may dispatch. A task group is no
 * artifact of the schema — it is a section of one artifact's checklist — so
 * its perspectives sit on the schema's `apply:` block, read through this one
 * reader rather than a second copy of the table. Empty where the schema
 * records none. */
export function applyPerspectives(root: string, schema: string): Perspective[] {
  const parsed = schemaOf(root, schema);
  const apply = (parsed?.apply ?? {}) as Record<string, unknown>;
  return perspectives(apply.perspectives);
}

function schemaOf(
  root: string,
  schema: string,
): { artifacts?: unknown; apply?: unknown } | undefined {
  const text = readTextIfExists(
    join(root, "openspec", "schemas", schema, "schema.yaml"),
  );
  if (text === undefined) return undefined;
  return (YAML.parse(text) ?? {}) as { artifacts?: unknown; apply?: unknown };
}

/** One entry is three facts: the perspective's name, the triggers a draft can
 * summon it with, and the reader that argues it. An entry missing any of them
 * dispatches nothing, so it is dropped rather than carried as a reader
 * nothing can run. A `when` written as one word is that one trigger. */
const perspectives = (value: unknown): Perspective[] => {
  if (!Array.isArray(value)) return [];
  const read: Perspective[] = [];
  for (const entry of value) {
    const fields = (entry ?? {}) as Record<string, unknown>;
    const when =
      typeof fields.when === "string" ? [fields.when] : strings(fields.when);
    if (typeof fields.name !== "string" || typeof fields.agent !== "string")
      continue;
    if (when.length === 0) continue;
    read.push({ name: fields.name, when, agent: fields.agent });
  }
  return read;
};

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((one) => typeof one === "string") : [];
