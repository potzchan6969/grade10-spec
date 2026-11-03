import { describe, expect, it } from "vitest";
import type { DeskVerdicts, Mark } from "../src/api/desk.ts";
import {
  nextPhase,
  outlineOf,
  phasesOf,
  readPhases,
  unplacedOf,
} from "../src/api/phases.ts";
import { atRisk, holdsRelease, readinessOf } from "../src/api/readiness.ts";
import { readRelease } from "../src/api/units.ts";
import { caseVerdict, rowVerdict } from "../src/api/verdicts.ts";
import { parsePage, serializePage } from "../src/content/grammar.ts";

const REGISTRY = `phases:
  - id: auction
    name: Auction
    env: staging-1
  - id: store-launch-1
    name: Store Launch 1
    env: staging-1
    target: 2026-12
  - id: store-launch-2
    name: Store Launch 2
    env: staging-2
`;
const phases = readPhases(REGISTRY);

const STORE = "docs/prds/products/site/store";
const CART = `---
title: Cart
---

Opening words.

::phase{id="store-launch-1" priority="P0"}

## Reviewing

- **Current Read** — the drawer waits for the shop
  - **Unresolved** — a line the shop cannot read stays
- 🚧 **Edits** — a quantity changes in place
- ❓ **Two Carts** — which cart wins. Product confirms

## Promo Code

::phase{id="store-launch-2" priority="P1" rules="held-codes"}

- **Typed** — a code takes its cut
- 🚧 **Held Codes** — a member's codes are listed
  - **Expired** — an expired code is greyed

### Points

::phase{id="store-launch-2" priority="P0"}

- 🚧 **Use Max** — the ceiling

:::detail{title="Product decisions" for="pm"}
- ❓ **Never counted** — a decision row
:::
`;

const SUITE = `---
title: Cart Test Cases
---

## cart#reviewing: Reviewing

<!-- trace:case id=g10.store-cart.TC-aaa rev=2 -->
### g10.store-cart.TC1: The drawer opens

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** actual
* **Trace:** cart#reviewing/current-read, cart#reviewing/unresolved

<!-- trace:case id=g10.store-cart.TC-bbb rev=1 -->
### g10.store-cart.TC2: Edits stay

**Classification:**

* **Status:** draft
* **Trace:** cart#reviewing/edits

### g10.store-cart.TC3: Held codes listed

**Classification:**

* **Status:** actual
* **Trace:** cart#promo-code/held-codes, cart#promo-code/typed
`;

describe("the registry", () => {
  it("reads phases in release order", () => {
    expect(phases.map((one) => [one.id, one.order])).toEqual([
      ["auction", 0],
      ["store-launch-1", 1],
      ["store-launch-2", 2],
    ]);
    expect(phases[1].target).toBe("2026-12");
    expect(nextPhase(phases, "store-launch-1")?.id).toBe("store-launch-2");
    expect(nextPhase(phases, "store-launch-2")).toBeUndefined();
  });

  it.each([
    ["phases: []", /non-empty/],
    ["phases:\n  - id: Auction\n    name: A\n    env: staging-1", /id/],
    [
      "phases:\n  - id: a\n    name: Phase One\n    env: staging-1",
      /word phase/,
    ],
    ["phases:\n  - id: a\n    name: A\n    env: moon", /env/],
    [
      "phases:\n  - id: a\n    name: A\n    env: staging-1\n  - id: a\n    name: B\n    env: uat",
      /twice/,
    ],
    [
      "phases:\n  - id: a\n    name: A\n    env: uat\n    target: soon",
      /target/,
    ],
    [
      "phases:\n  - id: a\n    name: A\n    env: uat\n    colour: red",
      /no field/,
    ],
  ])("refuses %s", (text, error) => {
    expect(() => readPhases(text)).toThrow(error);
  });
});

describe("the phase block", () => {
  it("is canonical in id, priority, rules order", () => {
    const page = parsePage(CART);
    expect(serializePage(page)).toBe(CART);
    const blocks = page.blocks.filter((block) => block.type === "phase");
    expect(blocks).toEqual([
      { type: "phase", id: "store-launch-1", priority: "P0" },
      {
        type: "phase",
        id: "store-launch-2",
        priority: "P1",
        rules: "held-codes",
      },
      { type: "phase", id: "store-launch-2", priority: "P0" },
    ]);
  });

  it.each([
    ['::phase{id="store-launch-1" priority="P3"}', /priority/],
    ['::phase{id="Store Launch" priority="P0"}', /phase id/],
    ['::phase{id="a" priority="P0" rules="a, b"}', /rules/],
    ['::phase{priority="P0"}', /needs `id`/],
  ])("refuses %s", (line, error) => {
    expect(() => parsePage(`---\ntitle: T\n---\n\n${line}\n`)).toThrow(error);
  });
});

describe("nearest block wins", () => {
  const outline = outlineOf(parsePage(CART));
  const placed = phasesOf(outline);
  const lineOf = (rule: string) =>
    outline.lines.find((line) => line.rule?.anchor === rule);
  const phaseOf = (rule: string) => {
    const line = lineOf(rule);
    return line ? placed.line(line) : undefined;
  };

  it("reads the page's block for a heading with none", () => {
    expect(placed.page).toEqual({ phase: "store-launch-1", priority: "P0" });
    expect(phaseOf("current-read")?.phase).toBe("store-launch-1");
    expect(phaseOf("typed")?.phase).toBe("store-launch-1");
  });

  it("gives a named rule and its children their own phase", () => {
    expect(phaseOf("held-codes")).toEqual({
      phase: "store-launch-2",
      priority: "P1",
    });
    expect(phaseOf("expired")?.priority).toBe("P1");
  });

  it("gives a sub-heading's block to its lines", () => {
    expect(phaseOf("use-max")).toEqual({
      phase: "store-launch-2",
      priority: "P0",
    });
  });

  it("never reads a detail's lines", () => {
    expect(lineOf("never-counted")).toBeUndefined();
  });

  it("reads a traced section and rule as a case names them", () => {
    expect(placed.traced("promo-code", "held-codes")?.phase).toBe(
      "store-launch-2",
    );
    expect(placed.traced("promo-code", "typed")?.phase).toBe("store-launch-1");
    expect(placed.traced("points")?.phase).toBe("store-launch-2");
  });

  it("leaves a page with no block unplaced", () => {
    const bare = outlineOf(
      parsePage("---\ntitle: T\n---\n\n## A\n\n- 🚧 **B** — c\n"),
    );
    const page = {
      path: "p.md",
      title: "T",
      outline: bare,
      phases: phasesOf(bare),
      traced: false,
    };
    expect(unplacedOf(page).map((line) => line.mark)).toEqual(["building"]);
  });
});

describe("units and readiness", () => {
  const reading = readRelease({
    phases,
    pages: [
      { path: `${STORE}/cart.md`, ast: parsePage(CART) },
      {
        path: "docs/prds/products/site/loyalty/tiers.md",
        ast: parsePage(
          '---\ntitle: Tiers\nspec: site/loyalty/tiers\n---\n\n::phase{id="auction" priority="P1"}\n\n## Tiers\n\n- **Gold** — a tier\n',
        ),
      },
      {
        path: "docs/prds/products/site/loyalty/points.md",
        ast: parsePage(
          '---\ntitle: Points\nspec: site/loyalty/tiers\n---\n\n::phase{id="auction" priority="P0"}\n\n- ❓ **Expiry** — when. Product confirms\n',
        ),
      },
      {
        path: "docs/prds/products/site/misc.md",
        ast: parsePage(
          '---\ntitle: Misc\n---\n\n::phase{id="auction" priority="P2"}\n\n- **Thing** — x\n',
        ),
      },
    ],
    suites: [{ path: `${STORE}/tests/cart-tcs.md`, source: SUITE }],
    capabilityCases: {
      "site/loyalty/tiers": [
        { id: "a.US1-TC1", status: "actual", marker: "a.TC-x", rev: 1 },
        { id: "a.US1-TC2", status: "actual" },
      ],
    },
  });
  const unit = (key: string) => {
    const found = reading.units.find((one) => one.key.endsWith(key));
    if (!found) throw new Error(`no unit ${key}`);
    return found;
  };
  const phase = (id: string) => phases.find((one) => one.id === id);

  it("splits a store section by the phase of each rule", () => {
    expect(reading.units.map((one) => one.key)).toEqual([
      `${STORE}/cart.md#reviewing@store-launch-1`,
      `${STORE}/cart.md#promo-code@store-launch-1`,
      `${STORE}/cart.md#promo-code@store-launch-2`,
      "spec:site/loyalty/tiers@auction",
      "docs/prds/products/site/misc.md@auction",
    ]);
    expect(unit("promo-code@store-launch-2")).toMatchObject({
      priority: "P0",
      rules: ["held-codes", "expired", "use-max"],
      building: 2,
    });
    expect(unit("reviewing@store-launch-1")).toMatchObject({
      rules: ["current-read", "unresolved", "edits", "two-carts"],
      questions: 1,
      building: 1,
    });
  });

  it("joins a capability's pages into one unit at its highest priority", () => {
    expect(unit("tiers@auction")).toMatchObject({
      kind: "capability",
      priority: "P0",
      questions: 1,
      pages: [
        "docs/prds/products/site/loyalty/tiers.md",
        "docs/prds/products/site/loyalty/points.md",
      ],
    });
  });

  it("files a case under every unit a rule of it lands in", () => {
    expect(
      reading.casesOf(unit("promo-code@store-launch-2")).map((one) => one.id),
    ).toEqual(["g10.store-cart.TC3"]);
    expect(
      reading.casesOf(unit("promo-code@store-launch-1")).map((one) => one.id),
    ).toEqual(["g10.store-cart.TC3"]);
  });

  it("climbs the ladder from the pages and the suites", () => {
    const review = unit("reviewing@store-launch-1");
    const at = readinessOf(
      review,
      reading.casesOf(review),
      phase("store-launch-1"),
    );
    expect(at.step).toBe("planned");
    expect(at.uncovered).toEqual(["two-carts"]);
    expect(at.drafts).toBe(1);

    const misc = unit("misc.md@auction");
    expect(
      readinessOf(misc, reading.casesOf(misc), phase("auction")).step,
    ).toBe("no-suite");

    const tiers = unit("tiers@auction");
    const ready = readinessOf(tiers, reading.casesOf(tiers), phase("auction"));
    expect(ready.step).toBe("reviewed");
    expect(ready.waitingOn).toEqual([
      { role: "qa", why: "run its cases" },
      { role: "pm", why: "answer 1 question" },
    ]);
    expect(holdsRelease(tiers, ready)).toBe(true);
  });

  const mark = (
    row: string,
    surface: Mark["surface"],
    value: Mark["value"],
    seq: number,
    triage?: Mark["triage"],
  ): Mark => ({
    id: `${row}-${surface}-${seq}`,
    row,
    surface,
    value,
    by: "qa@example.com",
    at: "2026-11-03T00:00:00Z",
    seq,
    ...(triage ? { triage } : {}),
  });
  const desk = (
    rows: Record<string, { rev?: number; marks: Mark[] }>,
    excluded: DeskVerdicts["excluded"] = {},
  ): DeskVerdicts => ({
    runs: [],
    cases: {
      "staging-1": Object.fromEntries(
        Object.entries(rows).map(([id, { rev, marks }]) => [
          id,
          {
            run: "r1",
            ...(rev === undefined ? {} : { rev }),
            rows: [{ key: id, marks }],
          },
        ]),
      ),
    },
    excluded,
  });

  it("reads results from the desk at the case's own revision", () => {
    const tiers = unit("tiers@auction");
    const cases = reading.casesOf(tiers);
    const passed = readinessOf(
      tiers,
      cases,
      phase("auction"),
      desk({
        "a.US1-TC1": {
          rev: 1,
          marks: [mark("a", "web", "pass", 1), mark("a", "mobile", "pass", 2)],
        },
        "a.US1-TC2": {
          marks: [mark("b", "web", "pass", 3), mark("b", "mobile", "pass", 4)],
        },
      }),
    );
    expect(passed.step).toBe("passed");

    const stale = readinessOf(
      tiers,
      cases,
      phase("auction"),
      desk({
        "a.US1-TC1": {
          rev: 0,
          marks: [mark("a", "web", "pass", 1), mark("a", "mobile", "pass", 2)],
        },
        "a.US1-TC2": {
          marks: [
            mark("b", "web", "fail", 3, "bug"),
            mark("b", "mobile", "pass", 4),
          ],
        },
      }),
    );
    expect(stale.step).toBe("failing");
    expect(stale.stale).toBe(1);
    expect(stale.triages).toEqual({ bug: 1 });
    expect(stale.waitingOn[0]).toEqual({ role: "assignee", why: "1 case bug" });
  });

  it("leaves a case a finalized run of the phase excluded out of a capability", () => {
    const tiers = unit("tiers@auction");
    const out = readinessOf(
      tiers,
      reading.casesOf(tiers),
      phase("auction"),
      desk(
        {
          "a.US1-TC1": {
            rev: 1,
            marks: [mark("a", "web", "pass", 1), mark("a", "mobile", "na", 2)],
          },
        },
        { auction: { "a.US1-TC2": "Store Launch 2's tier" } },
      ),
    );
    expect(out.excluded).toEqual([
      { id: "a.US1-TC2", reason: "Store Launch 2's tier" },
    ]);
    expect(out.step).toBe("passed");
  });

  it("puts a P0 near its target at risk, on the board only", () => {
    const review = unit("reviewing@store-launch-1");
    const at = readinessOf(
      review,
      reading.casesOf(review),
      phase("store-launch-1"),
    );
    expect(
      atRisk(review, at, phase("store-launch-1"), new Date("2026-11-28")),
    ).toBe(true);
    expect(
      atRisk(review, at, phase("store-launch-1"), new Date("2026-11-01")),
    ).toBe(false);
  });
});

describe("one verdict per row", () => {
  const m = (value: Mark["value"], triage?: Mark["triage"]) => ({
    value,
    ...(triage ? { triage } : {}),
  });

  it("lets a person's marks decide where web or mobile is in play", () => {
    expect(
      rowVerdict({ web: m("pass"), mobile: m("pass"), autoWeb: m("fail") }),
    ).toEqual({
      verdict: "pass",
      untriagedAutomatedFail: true,
    });
    expect(
      rowVerdict({
        web: m("pass"),
        mobile: m("pass"),
        autoWeb: m("fail", "flaky"),
      }).untriagedAutomatedFail,
    ).toBe(false);
    expect(rowVerdict({ web: m("pass") }).verdict).toBe("notrun");
    expect(rowVerdict({ web: m("pass"), mobile: m("blocked") }).verdict).toBe(
      "blocked",
    );
  });

  it("lets automation decide alone only where nobody can walk", () => {
    expect(
      rowVerdict({ autoWeb: m("fail") }, ["autoWeb", "autoMobile"]).verdict,
    ).toBe("fail");
    expect(
      rowVerdict({ autoWeb: m("pass"), autoMobile: m("pass") }, [
        "autoWeb",
        "autoMobile",
      ]).verdict,
    ).toBe("pass");
  });

  it("takes a case's worst row and the newest mark on a surface", () => {
    const at = (
      row: string,
      surface: Mark["surface"],
      value: Mark["value"],
      seq: number,
    ): Mark => ({
      id: `${row}${seq}`,
      row,
      surface,
      value,
      by: "x",
      at: "",
      seq,
    });
    expect(
      caseVerdict([
        {
          marks: [
            at("1", "web", "fail", 1),
            at("1", "web", "pass", 5),
            at("1", "mobile", "pass", 2),
          ],
        },
        { marks: [at("2", "web", "skipped", 3), at("2", "mobile", "pass", 4)] },
      ]).verdict,
    ).toBe("skipped");
    expect(
      caseVerdict([
        { marks: [at("1", "web", "na", 1), at("1", "mobile", "na", 2)] },
      ]).verdict,
    ).toBe("skipped");
  });
});
