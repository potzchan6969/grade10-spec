import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * A change the store still holds, with one of its numbered task groups.
 *
 * Read at run time rather than spelled into a fixture. `validateAssociation`
 * answers against the store on disk, so a test naming one change starts
 * failing the day that change is archived — which says nothing about the code
 * under test.
 */
export function liveAssociation(storeRoot) {
  const root = resolve(storeRoot, "openspec/changes");
  const changes = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== "archive")
    .map((entry) => entry.name)
    .sort();
  for (const change of changes) {
    const tasks = resolve(root, change, "tasks.md");
    if (!existsSync(tasks)) continue;
    const taskGroup = /^##\s+(\d+)\./m.exec(readFileSync(tasks, "utf8"))?.[1];
    if (taskGroup) return { change, taskGroup };
  }
  throw new Error("the store holds no change with a numbered task group");
}
