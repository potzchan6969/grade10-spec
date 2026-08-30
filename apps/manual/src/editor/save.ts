import { stageDraft } from "./drafts";
import {
  assertManualPath,
  type ContentStore,
  type StoredFile,
  StoreError,
  type Version,
} from "./store";

/**
 * Where one save lands. The rhythm is the same either way — a save stages and
 * a person decides when the stage becomes a commit — but the stage itself is
 * the transport's: the dev server's working tree, or this browser.
 */

export type SaveOutcome =
  | { status: "staged" }
  | { status: "ok"; version: Version }
  | { status: "conflict"; current: StoredFile | null };

export async function savePage(
  store: ContentStore,
  path: string,
  source: string,
  baseVersion: Version | null,
): Promise<SaveOutcome> {
  assertManualPath(path);
  if (store.push) {
    stageDraft(path, source, baseVersion);
    return { status: "staged" };
  }
  if (!store.write) {
    throw new StoreError(500, `${store.label} cannot save a page`);
  }
  return store.write(path, source, baseVersion);
}
