import type { HistoryRef } from "../api/types.ts";
import { DEFAULT_MANUAL_DIR } from "./roots.mts";

/** What a commit touched, read off its paths: the store's own layout is the
 * only thing that says whether a file is a page, a spec, or a change. */
export function refsOf(
  paths: string[],
  manual = DEFAULT_MANUAL_DIR,
): HistoryRef[] {
  const refs: HistoryRef[] = [];
  const seen = new Set<string>();
  for (const path of paths) {
    const ref = refOf(path, manual);
    const key =
      "id" in ref ? `${ref.kind}:${ref.id}` : `${ref.kind}:${ref.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    refs.push(ref);
  }
  return refs;
}

const ARCHIVE_STAMP = /^\d{4}-\d{2}-\d{2}-/;

function refOf(path: string, manual: string): HistoryRef {
  const parts = path.split("/");
  if (path.startsWith(`${manual}/`) && path.endsWith(".md")) {
    return { kind: "page", path };
  }
  if (parts[0] === "openspec" && parts[1] === "specs") {
    const rest = parts.slice(2);
    // A capability sits two levels down, a platform topic one — the same
    // shape rule the taxonomy reads off disk.
    if (rest.length > 2) return { kind: "spec", id: `${rest[0]}/${rest[1]}` };
    if (rest.length === 2) return { kind: "spec", id: rest[0] };
  }
  if (parts[0] === "openspec" && parts[1] === "changes") {
    const rest = parts.slice(2);
    if (rest[0] === "archive" && rest.length > 2) {
      return { kind: "archived", id: rest[1].replace(ARCHIVE_STAMP, "") };
    }
    if (rest.length > 1) return { kind: "change", id: rest[0] };
  }
  return { kind: "file", path };
}
