import { renameSync, writeFileSync } from "node:fs";
import { rootsOf } from "../src/store/roots.mts";
import { readStore } from "../src/store/snapshot.mts";
import { storeRoot } from "./real-store-root.ts";

/** `real-store.setup.ts` runs this beside the tests: the store as JSON at
 * `argv[2]`, written whole or not at all, or why not at `<path>.failed`. */
const path = process.argv[2];
try {
  const store = await readStore(rootsOf(storeRoot));
  writeFileSync(`${path}.part`, JSON.stringify(store));
  renameSync(`${path}.part`, path);
} catch (cause) {
  writeFileSync(`${path}.failed`, String((cause as Error)?.stack ?? cause));
  process.exitCode = 1;
}
