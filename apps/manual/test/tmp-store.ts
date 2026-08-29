import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/** A throwaway store on disk, for the edges the committed fixture cannot hold
 * without becoming a store nobody would write. Returns its root. */
export function writeStore(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "manual-store-"));
  for (const [path, content] of Object.entries(files)) {
    const file = join(root, path);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, content);
  }
  return root;
}
