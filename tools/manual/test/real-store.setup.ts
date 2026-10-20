import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { TestProject } from "vitest/node";

/**
 * One read of the store for the whole run, in its own process so every file
 * that does not need it runs meanwhile. Workers are handed its path, not the
 * store: what is provided travels with every file a worker runs.
 */
export default function setup(project: TestProject) {
  const dir = mkdtempSync(join(tmpdir(), "manual-real-store-"));
  const path = join(dir, "store.json");
  const reader = spawn(
    process.execPath,
    [fileURLToPath(new URL("read-real-store.mts", import.meta.url)), path],
    { stdio: ["ignore", "inherit", "inherit"] },
  );
  project.provide("realStorePath", path);
  return () => {
    reader.kill();
    rmSync(dir, { recursive: true, force: true });
  };
}
