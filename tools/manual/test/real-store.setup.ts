import { type ChildProcess, spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { TestProject } from "vitest/node";

const READER = fileURLToPath(new URL("read-real-store.mts", import.meta.url));

/**
 * One read of the store per run, in its own process so every file that does
 * not need it runs meanwhile. Workers are handed its path, not the store: what
 * is provided travels with every file a worker runs. A reader that dies
 * without a store says so at `<path>.failed`, so no suite waits out the
 * deadline; a watch rerun reads the store again.
 */
export default function setup(project: TestProject) {
  const dir = mkdtempSync(join(tmpdir(), "manual-real-store-"));
  const path = join(dir, "store.json");
  let reader: ChildProcess | undefined;
  const read = () => {
    reader?.kill();
    for (const stale of [path, `${path}.failed`])
      rmSync(stale, { force: true });
    const failed = (why: string) => {
      if (!existsSync(path) && !existsSync(`${path}.failed`))
        writeFileSync(`${path}.failed`, why);
    };
    const current = spawn(process.execPath, [READER, path], {
      stdio: ["ignore", "inherit", "inherit"],
    });
    current.on("error", (cause) => failed(String(cause)));
    current.on("exit", (code, signal) => {
      if (current === reader && code !== 0)
        failed(`the reader exited ${code ?? signal}; its stderr is above`);
    });
    reader = current;
  };
  read();
  project.provide("realStorePath", path);
  project.onTestsRerun(read);
  return () => {
    reader?.kill();
    rmSync(dir, { recursive: true, force: true });
  };
}
