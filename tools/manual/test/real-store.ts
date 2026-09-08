import { fileURLToPath } from "node:url";
import { findStoreRoot } from "../src/store/disk.mts";
import { rootsOf } from "../src/store/roots.mts";
import { readStore } from "../src/store/snapshot.mts";

export const storeRoot = findStoreRoot(
  fileURLToPath(new URL(".", import.meta.url)),
);

/**
 * The store as it stands, read once at import and shared by every suite that
 * asserts against the files people actually write. Read inside a case instead
 * and the case is timed against a read that grows with the store — which is a
 * clock the store eventually outruns, on the machine that happens to be
 * busiest.
 */
export const realStore = await readStore(rootsOf(storeRoot));
