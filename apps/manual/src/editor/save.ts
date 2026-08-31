import {
  assertManualPath,
  type ContentStore,
  type Version,
  type WriteOutcome,
} from "./store";

export function savePage(
  store: ContentStore,
  path: string,
  source: string,
  baseVersion: Version | null,
): Promise<WriteOutcome> {
  assertManualPath(path);
  return store.write(path, source, baseVersion);
}
