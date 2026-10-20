import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TestProject } from "vitest/node";
import { rootsOf } from "../src/store/roots.mts";
import { readStore } from "../src/store/snapshot.mts";
import { storeRoot } from "./real-store-root";

declare module "vitest" {
  export interface ProvidedContext {
    realStorePath: string;
  }
}

/** One read of the store for the whole run. Workers are handed its path, not
 * the store: what is provided travels with every file a worker runs. */
export default async function setup(project: TestProject) {
  const dir = mkdtempSync(join(tmpdir(), "manual-real-store-"));
  const path = join(dir, "store.json");
  writeFileSync(path, JSON.stringify(await readStore(rootsOf(storeRoot))));
  project.provide("realStorePath", path);
  return () => rmSync(dir, { recursive: true, force: true });
}
