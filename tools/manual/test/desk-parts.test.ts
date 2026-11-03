import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import type { Mark, RunView } from "../src/api/desk";
import { bugReportUrl } from "../src/desk/bug-report";
import { checksOf, handleOf, ruleWords } from "../src/desk/checks";
import { rowsOf } from "../src/desk/memory-desk";
import { readRunSpec } from "../src/desk/run-spec-file";
import { applyLive, withPending } from "../src/desk/run-view";
import { cartRun } from "./desk-fixture";
import { snapshotOf } from "./manual-fixture";
import { storeRoot } from "./real-store-root";

const CART_PAGE = "docs/prds/products/grade10-site/store/cart.md";
const spec = cartRun();
const tc19 = spec.cases.find((one) => one.id === "g10.store-cart.TC19");
if (!tc19) throw new Error("TC19 is in the cart suite");

describe("what a case checks", () => {
  const index = buildIndex(
    snapshotOf({
      pages: [
        {
          path: CART_PAGE,
          source: readFileSync(join(storeRoot, CART_PAGE), "utf8"),
        },
      ],
    }),
  );

  it("quotes the rule from its page, linked to the section", () => {
    const [typed, ...others] = checksOf(tc19, index);
    expect(typed).toMatchObject({
      kind: "rule",
      name: "Typed",
      pageTitle: "Cart Drawer",
      sectionTitle: "Promo Code",
      to: "/p/grade10-site/store/cart#promo-code",
    });
    expect(typed.kind === "rule" && ruleWords(typed.text, typed.name)).toMatch(
      /^a code the store knows takes its cut off the total at once/,
    );
    // The discounts page is not in this snapshot: its traces stay as written.
    expect(others.map((one) => one.kind)).toEqual(["unresolved", "unresolved"]);
  });
});

describe("filing a bug", () => {
  it("fills the app's bug form from the case, the row, what broke and what it used", () => {
    const row = rowsOf(spec).find((one) => one.key === "g10.store-cart.TC19#2");
    const url = new URL(
      bugReportUrl({
        testCase: tc19,
        row,
        run: {
          id: "5",
          name: "store-stage1",
          env: "staging-1",
          state: "finalized",
          openedBy: "chloe@9gag.com",
          openedAt: "2026-11-03T00:00:00Z",
          source: spec.source,
          fingerprint: spec.fingerprint,
          cases: 1,
          rows: 2,
        },
        surface: "web",
        expectation: "The row's discount row and total.",
        objects: { "<public code>": "SAVE20" },
        note: "Refused as unknown",
        back: "https://spec.grade10-stg.com/runs/5?case=g10.store-cart.TC19&row=g10.store-cart.TC19%232",
      }),
    );
    expect(url.origin + url.pathname).toBe(
      "https://github.com/9gag/grade10/issues/new",
    );
    expect(url.searchParams.get("template")).toBe("bug_report.yml");
    expect(url.searchParams.get("title")).toContain("g10.store-cart.TC19");
    const happened = url.searchParams.get("what-happened") ?? "";
    expect(happened).toContain("row 2 failed on Web");
    expect(happened).toContain("Expected: The row's discount row and total.");
    expect(happened).toContain("Customer: signed out");
    expect(happened).toContain("<public code>: SAVE20");
    expect(happened).toContain("Seen: Refused as unknown");
    expect(happened).toContain("runs/5?case=g10.store-cart.TC19");
    expect(url.searchParams.get("where")).toBe(
      "staging-1 · run store-stage1 (5)",
    );
    expect(url.searchParams.get("steps")).toContain("1. Open Cart");
  });
});

describe("opening a run from its file", () => {
  it("takes the run sheet's RunSpec", () => {
    expect(readRunSpec(JSON.stringify(spec))).toEqual({ ok: true, spec });
  });

  it("names every way a file falls short", () => {
    const broken = {
      ...spec,
      env: "",
      cases: [
        { ...tc19, surfaces: ["tablet"] },
        { ...tc19, surfaces: ["web"] },
      ],
    };
    const reading = readRunSpec(JSON.stringify(broken));
    expect(reading.ok).toBe(false);
    expect(!reading.ok && reading.problems).toEqual([
      "`env` must be a non-empty string",
      "case 1 (g10.store-cart.TC19): `surfaces` must name web, mobile, autoWeb, autoMobile",
      "case 2 (g10.store-cart.TC19) is listed twice",
    ]);
    expect(readRunSpec("{").ok).toBe(false);
  });
});

describe("the view on screen", () => {
  const view: RunView = {
    run: {
      id: "5",
      name: "store-stage1",
      env: "staging-1",
      state: "open",
      openedBy: "chloe@9gag.com",
      openedAt: "2026-11-03T00:00:00Z",
      source: spec.source,
      fingerprint: spec.fingerprint,
      cases: spec.cases.length,
      rows: rowsOf(spec).length,
    },
    spec,
    rows: rowsOf(spec),
    marks: [],
    observations: [],
    objects: {},
    seq: 3,
  };
  const mark = (id: string, value: Mark["value"], seq: number): Mark => ({
    id,
    row: "g10.store-cart.TC19#1",
    surface: "web",
    value,
    by: "kin@9gag.com",
    at: "2026-11-03T00:00:00Z",
    seq,
  });

  it("shows the tester's own mark at once and lets the desk's answer settle it", () => {
    const pending = withPending(
      view,
      [
        {
          kind: "marks",
          id: "op",
          at: "2026-11-03T00:00:01Z",
          marks: [
            {
              id: "mine",
              row: "g10.store-cart.TC19#1",
              surface: "web",
              value: "pass",
            },
          ],
        },
      ],
      "chloe@9gag.com",
    );
    expect(pending.view.marks.map((one) => [one.id, one.by])).toEqual([
      ["mine", "chloe@9gag.com"],
    ]);
    expect(pending.view.seq).toBe(3);
    const settled = applyLive(view, {
      type: "mark",
      mark: { ...mark("mine", "pass", 4), by: "chloe@9gag.com" },
    });
    expect(withPending(settled, [], "chloe@9gag.com").pendingMarks.size).toBe(
      0,
    );
    expect(settled.seq).toBe(4);
  });

  it("takes a mark from another copy of the run, newest winning", () => {
    let next = applyLive(view, { type: "mark", mark: mark("a", "fail", 5) });
    next = applyLive(next, { type: "mark", mark: mark("old", "pass", 4) });
    next = applyLive(next, { type: "mark", mark: mark("a", "fail", 5) });
    expect(next.marks.map((one) => one.id)).toEqual(["a"]);
    next = applyLive(next, { type: "mark", mark: mark("b", "pass", 6) });
    expect(next.marks.map((one) => [one.id, one.value])).toEqual([
      ["b", "pass"],
    ]);
  });
});

describe("who marked", () => {
  it("names a tester by the team map's handle, and keeps an e-mail it cannot", () => {
    const team = [
      { handle: "chloe9gag", email: "chloe@9gag.com", roles: ["qa"] },
    ];
    expect(handleOf("Chloe@9gag.com", team)).toBe("chloe9gag");
    expect(handleOf("visitor@example.com", team)).toBe("visitor@example.com");
  });
});
