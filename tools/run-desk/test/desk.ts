import { DatabaseSync, type SQLInputValue } from "node:sqlite";
import type { RunCase, RunSpec } from "../../manual/src/api/desk.ts";
import { DeskStore, type Sql, type SqlRow } from "../src/store.ts";

/** A desk over an in-memory `node:sqlite`, on a clock the test moves. */
export function sqlOf(db: DatabaseSync): Sql {
  return {
    exec: (query, ...params) =>
      db.prepare(query).all(...(params as SQLInputValue[])) as SqlRow[],
    transaction(write) {
      db.exec("begin");
      try {
        const value = write();
        db.exec("commit");
        return value;
      } catch (error) {
        db.exec("rollback");
        throw error;
      }
    },
  };
}

export function deskInMemory() {
  const db = new DatabaseSync(":memory:");
  const sql = sqlOf(db);
  let tick = 0;
  const now = () => new Date(Date.UTC(2026, 10, 3, 9, 0, tick++)).toISOString();
  return { store: new DeskStore(sql, now), db };
}

export function aCase(id: string, extra: Partial<RunCase> = {}): RunCase {
  return {
    id,
    title: `Case ${id}`,
    suite: "docs/prds/products/store/cart-tcs.md",
    traces: ["cart#promo-code"],
    given: ["a cart"],
    steps: ["open the cart", "apply the code"],
    expect: [
      { step: 1, text: "the cart opens" },
      { step: 2, text: "the total drops" },
    ],
    surfaces: ["web", "mobile"],
    ...extra,
  };
}

export function aSpec(extra: Partial<RunSpec> = {}): RunSpec {
  return {
    name: "store launch 1",
    env: "qa",
    phase: "store-launch-1",
    selection: "--phase store-launch-1",
    source: "b4aa3cf",
    fingerprint: "sha256:abc",
    cases: [
      aCase("TC1", {
        marker: "g10.store-cart.TC-q5a",
        rev: 2,
        data: {
          header: ["tier", "code"],
          rows: [
            ["Gold", "G10"],
            ["Silver", "S5"],
            ["Bronze", "B1"],
          ],
        },
      }),
      aCase("TC2", { marker: "g10.store-cart.TC-b7c", rev: 1 }),
      aCase("TC3", { surfaces: ["web"] }),
    ],
    walks: [
      {
        id: "cart-tcs.md#walk-1",
        title: "Checkout",
        suite: "docs/prds/products/store/cart-tcs.md",
        start: ["signed in"],
        route: [
          { step: "open the cart", expect: "it opens", cases: ["TC1", "TC2"] },
          { step: "pay", expect: "it pays", cases: ["TC3"] },
        ],
      },
    ],
    placeholders: { "{{code}}": "G10" },
    exclusions: [{ id: "TC9", reason: "launches with store-launch-2" }],
    ...extra,
  };
}

export const TESTER = "tester@grade10.com";
