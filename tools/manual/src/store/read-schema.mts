import { join } from "node:path";
import YAML from "yaml";
import type { SchemaArtifact } from "../api/types.ts";
import { readTextIfExists } from "./disk.mts";

/** The artifacts a schema declares, in the order it declares them — the
 * order they are written in, each built on the one before. Undefined for a
 * schema this store does not define: the built-ins live inside the CLI, and
 * guessing their shape would let a reader claim a file is missing that the
 * schema never asked for. */
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
      required: fields.required !== false,
    });
  }
  return artifacts;
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((one) => typeof one === "string") : [];
