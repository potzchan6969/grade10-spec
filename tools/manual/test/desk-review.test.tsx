import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { RunCase, RunSpec } from "../src/api/desk";
import { DeskError } from "../src/desk/client";
import { MemoryDesk } from "../src/desk/memory-desk";
import {
  canRerun,
  caseLabels,
  filterOptions,
  focusOf,
  markSaid,
  matchesQuery,
  plural,
  readRun,
  settledValue,
  shownCases,
  sortCases,
} from "../src/desk/model";
import { Pip } from "../src/desk/ui/marks";
import { RECORD_COMMAND, RunHeader, rateText } from "../src/desk/ui/run-header";
import { sectionProgress } from "../src/desk/ui/run-list";
import { WalkPane } from "../src/desk/ui/walk-pane";
import { refusalOf } from "../src/pages/runs-page";
import { cartRun } from "./desk-fixture";

/** What a QA lead found walking the run page, each held to its fix. */

const TC19 = "g10.store-cart.TC19";

async function cart(spec: RunSpec = cartRun()) {
  const desk = new MemoryDesk("chloe@9gag.com");
  const run = await desk.openRun(spec);
  const read = async () => readRun(await desk.run(run.id));
  return { desk, run, read };
}

describe("finding a case", () => {
  it("tells two short ids apart by as much of the full id as they differ in", () => {
    const labels = caseLabels([
      { id: "g10.store-dmn.TC5" },
      { id: "g10.store-home.TC5" },
      { id: "g10.store-home.TC6" },
    ]);
    expect(labels.get("g10.store-dmn.TC5")).toBe("store-dmn.TC5");
    expect(labels.get("g10.store-home.TC5")).toBe("store-home.TC5");
    expect(labels.get("g10.store-home.TC6")).toBe("TC6");
  });

  it("searches by id, marker and title, and the search only changes what shows", async () => {
    const { read } = await cart();
    const reading = await read();
    const tc19 = reading.caseById.get(TC19) as RunCase;
    expect(matchesQuery(tc19, "tc19")).toBe(true);
    expect(matchesQuery(tc19, tc19.marker ?? "TC19")).toBe(true);
    expect(matchesQuery(tc19, tc19.title.split(" ")[1])).toBe(true);
    expect(matchesQuery(tc19, "no such words")).toBe(false);
    const found = shownCases(reading, {}, "web", "TC19");
    expect(found.has(TC19)).toBe(true);
    expect(found.size).toBeLessThan(reading.view.spec.cases.length);
  });

  it("names a case the run does not hold and focuses nothing, so no key marks the first case", async () => {
    const { read } = await cart();
    const reading = await read();
    const order = reading.view.spec.cases.map((one) => one.id);
    expect(
      focusOf(reading, order, { case: "g10.nope.TC1", row: null, walk: false }),
    ).toEqual({ case: null, row: null, unknown: "g10.nope.TC1" });
    expect(
      focusOf(reading, order, { case: null, row: null, walk: false }).case,
    ).toBe(order[0]);
    expect(
      focusOf(reading, order, { case: TC19, row: `${TC19}#2`, walk: false }),
    ).toEqual({ case: TC19, row: `${TC19}#2` });
  });
});

describe("filters", () => {
  it("keep any of several results, and find a skipped row beside one still to do", async () => {
    const { desk, run, read } = await cart();
    const tc1 = "g10.store-cart.TC1";
    const tc1Row = (await read()).rowsByCase.get(tc1)?.[0]?.key ?? tc1;
    await desk.mark(run.id, [
      { id: "f", row: `${TC19}#1`, surface: "web", value: "fail" },
    ]);
    await desk.mark(run.id, [
      { id: "s", row: `${TC19}#2`, surface: "web", value: "skipped" },
    ]);
    await desk.mark(run.id, [
      { id: "b", row: tc1Row, surface: "web", value: "blocked" },
    ]);
    const reading = await read();
    expect(filterOptions(reading, "result")).toContain("skipped");
    expect([
      ...shownCases(reading, { result: ["fail", "blocked"] }, "web"),
    ]).toEqual(expect.arrayContaining([TC19, tc1]));
    expect(
      shownCases(reading, { result: ["fail", "blocked"] }, "web").size,
    ).toBe(2);
    expect([...shownCases(reading, { result: ["skipped"] }, "web")]).toEqual([
      TC19,
    ]);
  });

  it("orders severity blocker, critical, major, minor, and sorts a section's cases by it", async () => {
    const { read } = await cart();
    const reading = await read();
    const severities = filterOptions(reading, "severity");
    const order = ["blocker", "critical", "major", "minor"].filter((one) =>
      severities.includes(one),
    );
    expect(severities.slice(0, order.length)).toEqual(order);
    const sorted = sortCases(reading.view.spec.cases, "severity").map(
      (one) => one.severity,
    );
    const rank = (value?: string) =>
      ["blocker", "critical", "major", "minor"].indexOf(value ?? "");
    for (let at = 1; at < sorted.length; at += 1)
      if (rank(sorted[at]) >= 0 && rank(sorted[at - 1]) >= 0)
        expect(rank(sorted[at])).toBeGreaterThanOrEqual(rank(sorted[at - 1]));
  });
});

describe("the list", () => {
  it("says what is left on the other surface a person walks where it differs", async () => {
    const { desk, run, read } = await cart();
    const reading = await read();
    const ids = ["g10.store-cart.TC1", "g10.store-cart.TC2"].filter((id) =>
      reading.caseById.get(id)?.surfaces.includes("mobile"),
    );
    for (const id of ids)
      for (const row of reading.rowsByCase.get(id) ?? [])
        await desk.mark(run.id, [
          { id: `w-${row.key}`, row: row.key, surface: "web", value: "pass" },
        ]);
    const after = await read();
    expect(sectionProgress(after, ids, "web")).toBe(
      `${plural(ids.length, "case")} · ${ids.length} done · Mobile: ${ids.length} to do`,
    );
    expect(sectionProgress(after, ids, "mobile")).toBe(
      `${plural(ids.length, "case")} · 0 done`,
    );
  });

  it("gives every pip a letter besides its colour, to do an empty box", () => {
    const letters = (["pass", "fail", "blocked", "skipped", "na"] as const).map(
      (value) => renderToStaticMarkup(<Pip value={value} />),
    );
    expect(letters.map((html) => />([^<]*)<\/i>/.exec(html)?.[1])).toEqual([
      "P",
      "F",
      "B",
      "S",
      "–",
    ]);
    expect(renderToStaticMarkup(<Pip value="todo" />)).toMatch(/><\/i>$/);
  });

  it("says each mark aloud", () => {
    expect(
      markSaid(
        [{ row: `${TC19}#2`, value: "fail", surface: "web" }],
        () => "TC19 row 2",
      ),
    ).toBe("TC19 row 2 marked fail on Web");
    expect(
      markSaid(
        [
          { row: "a", value: "blocked", surface: "mobile" },
          { row: "b", value: "blocked", surface: "mobile" },
        ],
        () => "",
      ),
    ).toBe("2 rows marked blocked on Mobile");
  });
});

describe("the header", () => {
  it("shows one decimal under ten percent", () => {
    expect(rateText(2 / 295)).toBe("0.7%");
    expect(rateText(0)).toBe("0%");
    expect(rateText(0.5)).toBe("50%");
    expect(rateText(null)).toBe("—");
  });

  it("says finalized and how the record is written, never that it is in git", async () => {
    const { desk, run, read } = await cart();
    await desk.setState(run.id, "finalized");
    const reading = await read();
    const html = renderToStaticMarkup(
      <RunHeader
        canRerun={false}
        counts={
          Object.fromEntries(
            (["web", "mobile", "autoWeb", "autoMobile"] as const).map((one) => [
              one,
              {
                todo: 1,
                pass: 0,
                fail: 0,
                blocked: 0,
                skipped: 0,
                na: 0,
                total: 1,
                rate: 0,
              },
            ]),
          ) as never
        }
        onDownload={() => {}}
        onRerun={() => {}}
        onState={() => {}}
        run={{ ...reading.view.run, cases: 1, rows: 1 }}
        sections={1}
        status="live"
        surface="web"
        waiting={0}
      />,
    );
    expect(html).not.toContain("recorded in git");
    expect(html).toContain("finalized");
    expect(html).toContain(
      RECORD_COMMAND.replace("<", "&lt;").replace(">", "&gt;"),
    );
    expect(html).toContain("1 case, 1 row under 1 section");
    expect(RECORD_COMMAND).toContain("pnpm tcs:run-record");
  });

  it("offers a re-run of failed and blocked rows only once the run is closed", async () => {
    const { desk, run, read } = await cart();
    await desk.mark(run.id, [
      { id: "f", row: `${TC19}#1`, surface: "web", value: "fail" },
    ]);
    expect(canRerun(await read())).toBe(false);
    await desk.setState(run.id, "finalized");
    expect(canRerun(await read())).toBe(false);
    await desk.setState(run.id, "closed");
    expect(canRerun(await read())).toBe(true);
  });
});

describe("the environment's site", () => {
  it("fills <g10url> in a walk's starting state with the site, and names an unknown environment as one", async () => {
    const spec = cartRun();
    const walked: RunSpec = {
      ...spec,
      walks: [
        {
          id: "cart-tcs.md#walk-9",
          title: "Read the cart",
          suite: spec.cases[0].suite,
          start: ["Open `<g10url>/store`."],
          route: [{ step: "Open the cart", expect: "", cases: [TC19] }],
        },
      ],
    };
    expect(settledValue(walked, "<g10url>")).toBe("https://grade10-stg.com");
    expect(settledValue({ ...walked, env: "uat" }, "<g10url>")).toBe("uat");
    const { read } = await cart(walked);
    const reading = await read();
    const html = renderToStaticMarkup(
      <WalkPane
        closed={false}
        onCase={() => {}}
        onLeave={() => {}}
        onObserve={() => {}}
        reading={reading}
        surface="web"
        walk={walked.walks[0]}
      />,
    );
    expect(html).toContain("https://grade10-stg.com");
    expect(html).not.toContain("cart-tcs.md#walk-9");
    expect(html).toContain("Read the cart");
  });
});

describe("opening a selection already open", () => {
  it("is refused with the run that holds it, linked from /runs", async () => {
    const desk = new MemoryDesk("chloe@9gag.com");
    const spec = cartRun();
    const first = await desk.openRun(spec);
    const refused = await desk.openRun(spec).catch((cause: unknown) => cause);
    expect(refused).toBeInstanceOf(DeskError);
    expect((refused as DeskError).status).toBe(409);
    expect(refusalOf(refused, spec.fingerprint, await desk.runs())).toEqual({
      text: (refused as DeskError).message,
      run: first.id,
    });
    // A desk that does not name the run still links the one it matches.
    expect(
      refusalOf(
        new DeskError("this selection is open", 409),
        spec.fingerprint,
        await desk.runs(),
      ).run,
    ).toBe(first.id);
    expect(refusalOf(new Error("offline"), spec.fingerprint, null)).toEqual({
      text: "offline",
    });
    await desk.setState(first.id, "finalized");
    await desk.setState(first.id, "closed");
    await expect(desk.openRun(spec)).resolves.toMatchObject({ state: "open" });
  });
});
