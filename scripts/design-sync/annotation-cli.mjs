import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeScope } from "./annotation-scope.mjs";

export const repoRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
);
export const defaultBaselinePath = resolve(
  repoRoot,
  "scripts/design-sync/annotation-baseline.json",
);

export async function readJson(path, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    throw new Error(
      `${label}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function resolveRepoPath(path) {
  return resolve(repoRoot, path);
}

export function requiredScope(scope) {
  if (scope === undefined) throw new Error("--scope is required");
  return normalizeScope(scope);
}
