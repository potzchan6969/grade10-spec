/** A run read from the store's real cart suite, the way the run sheet
 * selects one, for the desk's tests. */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { RunSpec } from "../src/api/desk";
import type { SuiteEntry } from "../src/api/types";
import { runSpecFromSuites } from "../src/desk/suite-run";
import { storeRoot } from "./real-store-root";

export const CART_SUITE =
  "docs/prds/products/grade10-site/store/tests/cart-tcs.md";

export function cartSuite(): SuiteEntry {
  return {
    path: CART_SUITE,
    source: readFileSync(join(storeRoot, CART_SUITE), "utf8"),
  };
}

export function cartRun(name = "store-stage1 · cart"): RunSpec {
  return runSpecFromSuites([cartSuite()], {
    name,
    env: "staging-1",
    selection: "the store's cart suite",
    source: "0123456789abcdef0123456789abcdef01234567",
    phase: "store-launch-1",
  });
}

/** A key store the outbox writes to, in memory. */
export function memoryKeys() {
  const held = new Map<string, string>();
  return {
    held,
    get: (key: string) => held.get(key) ?? null,
    set: (key: string, value: string) => {
      held.set(key, value);
    },
    remove: (key: string) => {
      held.delete(key);
    },
  };
}
