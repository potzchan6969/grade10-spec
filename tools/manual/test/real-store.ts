import { existsSync, readFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";
import { inject } from "vitest";
import type { Store } from "../src/store/snapshot.mts";

export { storeRoot } from "./real-store-root";

declare module "vitest" {
  export interface ProvidedContext {
    realStorePath: string;
  }
}

/** Past this the read has hung rather than run long. */
const READ_DEADLINE_MS = 5 * 60_000;

/**
 * The store as it stands, read once per run by `real-store.setup.ts` and
 * shared by every suite that asserts against the files people actually write.
 * Read inside a case instead and the case is timed against a read that grows
 * with the store — which is a clock the store eventually outruns, on the
 * machine that happens to be busiest.
 */
async function readRealStore(): Promise<Store> {
  const path = inject("realStorePath");
  if (!path)
    throw new Error(
      "realStorePath was not provided: run this file in the `real-store` project, whose globalSetup reads the store",
    );
  const deadline = Date.now() + READ_DEADLINE_MS;
  while (!existsSync(path)) {
    if (existsSync(`${path}.failed`))
      throw new Error(
        `the store read failed:\n${readFileSync(`${path}.failed`, "utf8")}`,
      );
    if (Date.now() > deadline)
      throw new Error(`the store read wrote nothing in ${READ_DEADLINE_MS}ms`);
    await sleep(100);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

export const realStore = await readRealStore();
