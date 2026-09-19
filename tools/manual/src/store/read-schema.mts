import { join } from "node:path";
import YAML from "yaml";
import type { SchemaArtifact } from "../api/types.ts";
import { readTextIfExists } from "./disk.mts";

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
 * against — is read as absent rather than as a reason to drop the artifact. */
export function schemaArtifacts(
  root: string,
  schema: string,
): SchemaArtifact[] | undefined {
  const text = readTextIfExists(
    join(root, "openspec", "schemas", schema, "schema.yaml"),
  );
  if (text === undefined) return undefined;
  const parsed = YAML.parse(text) as { artifacts?: unknown } | null;
  const listed = Array.isArray(parsed?.artifacts) ? parsed.artifacts : [];
  const artifacts: SchemaArtifact[] = [];
  for (const entry of listed) {
    const fields = (entry ?? {}) as Record<string, unknown>;
    if (typeof fields.id !== "string" || typeof fields.generates !== "string")
      continue;
    const teammate =
      typeof fields.teammate === "string" ? fields.teammate : undefined;
    artifacts.push({
      id: fields.id,
      generates: fields.generates,
      ...(teammate ? { teammate } : {}),
      requires: strings(fields.requires),
      upstream: strings(fields.upstream),
      required: fields.required !== false,
    });
  }
  return artifacts;
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((one) => typeof one === "string") : [];
