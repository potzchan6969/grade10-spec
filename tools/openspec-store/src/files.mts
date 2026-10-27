import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { ItemError } from "./types.ts";

export function featureSuitePath(
  root: string,
  dir: string,
): string | undefined {
  const relative = `${dir}/feature-tcs.md`;
  return existsSync(join(root, relative)) ? relative : undefined;
}

export function subdirectories(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** A structural problem in someone else's file. Specs and changes contain it
 * as an `error` entry; manual pages let it out. */
export class StoreFileError extends Error {
  readonly line: number;
  constructor(line: number, message: string) {
    super(message);
    this.name = "StoreFileError";
    this.line = line;
  }
}

export function toItemError(file: string, cause: unknown): ItemError {
  if (cause instanceof StoreFileError) {
    return { file, line: cause.line, message: cause.message };
  }
  return {
    file,
    message: cause instanceof Error ? cause.message : String(cause),
  };
}
