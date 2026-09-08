import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

export const TYPES = [
  "architecture",
  "workflow",
  "sequence",
  "dataflow",
  "lifecycle",
];

const BIN = join(
  dirname(createRequire(import.meta.url).resolve("archify/package.json")),
  "bin/archify.mjs",
);

function reason(run) {
  try {
    const answer = JSON.parse(run.stdout);
    const notes = (answer.diagnostics ?? []).map((one) => `- ${one.message}`);
    return [answer.error ?? run.stdout, ...notes].join("\n");
  } catch {
    return `${run.stdout}${run.stderr}`.trim();
  }
}

/** Archify's `deliver`, answered as the HTML it wrote. A refused source
 * surfaces archify's own diagnostics. */
export function deliver(type, source) {
  const dir = mkdtempSync(join(tmpdir(), "archify-"));
  const output = join(dir, "diagram.html");
  try {
    const run = spawnSync(
      process.execPath,
      [BIN, "deliver", type, source, output, "--json"],
      {
        encoding: "utf8",
        env: { ...process.env, ARCHIFY_UPDATE_CHECK_DISABLED: "1" },
      },
    );
    if (run.status !== 0) {
      throw new Error(`archify refused ${source}\n${reason(run)}`);
    }
    return readFileSync(output, "utf8");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
