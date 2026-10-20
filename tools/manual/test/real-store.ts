import { readFileSync } from "node:fs";
import { inject } from "vitest";
import type { Store } from "../src/store/snapshot.mts";
import "./real-store.setup";

export { storeRoot } from "./real-store-root";

/**
 * The store as it stands, read once per run by `real-store.setup.ts` and
 * shared by every suite that asserts against the files people actually write.
 * Read inside a case instead and the case is timed against a read that grows
 * with the store — which is a clock the store eventually outruns, on the
 * machine that happens to be busiest.
 */
const path = inject("realStorePath");
if (!path)
  throw new Error(
    "realStorePath was not provided: run this file in the `shared` project, whose globalSetup reads the store",
  );
export const realStore: Store = JSON.parse(readFileSync(path, "utf8"));
