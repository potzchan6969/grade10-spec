import {
  assertManualPath,
  type ContentStore,
  type Version,
  type WriteOutcome,
} from "./store";

export function savePage(
  store: ContentStore,
  manualDir: string,
  path: string,
  source: string,
  baseVersion: Version | null,
): Promise<WriteOutcome> {
  assertManualPath(manualDir, path);
  return store.write(path, source, baseVersion);
}
