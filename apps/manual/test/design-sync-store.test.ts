import { describe, expect, it } from "vitest";
import type { DesignSyncReport } from "../src/api/types";
import { designWarnings, readDesignSync } from "../src/store/design-sync.mts";
import { writeStore } from "./tmp-store";

const REPORT = ".design-sync/report.json";
const FILE = "GW2WL6JcWok5ypUrUFi9bU";

const storeWith = (report: unknown, pages: Record<string, string> = {}) =>
  writeStore({ [REPORT]: JSON.stringify(report), ...pages });

const full = {
  generatedAt: "2026-08-30T01:00:00.000Z",
  file: FILE,
  sets: { "Cart Drawer": "warn", Nav: "ok" },
  nodes: { "4735-6493": "Cart Drawer" },
  messages: { "Cart Drawer": ["radius: code 16px, Figma 24px"] },
};

const page = (body: string) => `---\ntitle: Alpha\n---\n\n${body}\n`;

describe("reading the design-sync report", () => {
  it("carries the file, the node map and the messages", () => {
    expect(readDesignSync(storeWith(full))).toEqual(full);
  });

  /** A report written before the node map existed still reads — it just badges
   * fewer cards. */
  it("accepts a report holding nothing but sets", () => {
    const older = { generatedAt: full.generatedAt, sets: { Nav: "ok" } };

    expect(readDesignSync(storeWith(older))).toEqual(older);
  });

  it("answers nothing for a store that has never run the check", () => {
    expect(readDesignSync(writeStore({}))).toBeUndefined();
  });

  it.each([
    ["not JSON at all", "{"],
    ["a list", "[]"],
    ["no generatedAt", '{"sets":{}}'],
    ["no sets", '{"generatedAt":"2026-08-30T01:00:00.000Z"}'],
    [
      "a verdict the checker never emits",
      '{"generatedAt":"2026-08-30T01:00:00.000Z","sets":{"Nav":"drifty"}}',
    ],
    [
      "a nodes that is not a mapping",
      '{"generatedAt":"2026-08-30T01:00:00.000Z","sets":{},"nodes":[]}',
    ],
    [
      "a node answering with something that is not a name",
      '{"generatedAt":"2026-08-30T01:00:00.000Z","sets":{},"nodes":{"1-1":7}}',
    ],
    [
      "messages that are not lines",
      '{"generatedAt":"2026-08-30T01:00:00.000Z","sets":{},"messages":{"Nav":"nope"}}',
    ],
    [
      "a file key that is not a key",
      '{"generatedAt":"2026-08-30T01:00:00.000Z","sets":{},"file":7}',
    ],
  ])("refuses %s rather than passing as no drift", (_why, text) => {
    const root = writeStore({ [REPORT]: text });

    expect(() => readDesignSync(root)).toThrow(REPORT);
  });
});

describe("the report as maintenance rows", () => {
  const url = (node: string) =>
    `https://www.figma.com/design/${FILE}/Grade10-DS-2026?node-id=${node}`;

  const rowsFor = (report: unknown, pages: Record<string, string>, now: Date) =>
    designWarnings(
      storeWith(report, pages),
      readDesignSync(storeWith(report, pages)) as DesignSyncReport,
      now,
    ).map((one) => one.message);

  const FRESH = new Date("2026-08-31T01:00:00.000Z");

  it("says nothing at all when there is no report", () => {
    expect(designWarnings(writeStore({}), undefined)).toEqual([]);
  });

  it("names every drifting set, with what the run said", () => {
    const rows = rowsFor(
      full,
      {
        "manual/products/demo/alpha.md": page(
          `::figma{url="${url("4735-6493")}" title="Cart drawer"}`,
        ),
        "manual/products/demo/beta.md": page(
          '::story{id="components-nav--narrow"}',
        ),
      },
      FRESH,
    );

    expect(rows).toEqual([
      "`Cart Drawer` — warn: radius: code 16px, Figma 24px",
    ]);
  });

  /** Eight of twelve keys reached no card in the designer's simulation, and
   * every one of them was silent. */
  it("names a set nothing in the manual shows", () => {
    const rows = rowsFor(full, {}, FRESH);

    expect(rows).toContain(
      "`Nav` is checked every night and no card shows it — renamed in Figma, or never embedded",
    );
    expect(rows).toContain(
      "`Cart Drawer` is checked every night and no card shows it — renamed in Figma, or never embedded",
    );
  });

  it("carries a `design` rule so the panel groups it with the rest", () => {
    const root = storeWith(full);

    expect(
      designWarnings(root, readDesignSync(root), FRESH).every(
        (one) => one.rule === "design",
      ),
    ).toBe(true);
  });

  /** A nightly that has stopped reads as "no drift" on every card in the
   * manual, which is the worst thing this rail can do. */
  it("says so when the nightly has stopped running", () => {
    const rows = rowsFor(full, {}, new Date("2026-09-20T01:00:00.000Z"));

    expect(rows[0]).toContain("the nightly design-sync run has stopped");
  });

  it("stays quiet about a report from this week", () => {
    const rows = rowsFor(full, {}, FRESH);

    expect(rows.some((one) => one.includes("has stopped"))).toBe(false);
  });
});
