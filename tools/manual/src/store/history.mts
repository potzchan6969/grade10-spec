import type { HistoryRef } from "../api/types.ts";
import { DEFAULT_MANUAL_DIR } from "./roots.mts";

/** What a commit touched, read off its paths: the store's own layout is the
 * only thing that says whether a file is a page. */
export function refsOf(
  paths: string[],
  manual = DEFAULT_MANUAL_DIR,
): HistoryRef[] {
  const refs: HistoryRef[] = [];
  const seen = new Set<string>();
  for (const path of paths) {
    const ref = refOf(path, manual);
    const key = `${ref.kind}:${ref.path}`;
    if (seen.has(key)) continue;
    seen.add(key);
    refs.push(ref);
  }
  return refs;
}

function refOf(path: string, manual: string): HistoryRef {
  if (path.startsWith(`${manual}/`) && path.endsWith(".md")) {
    return { kind: "page", path };
  }
  return { kind: "file", path };
}
