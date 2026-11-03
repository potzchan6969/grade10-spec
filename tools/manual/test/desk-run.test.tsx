import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { buildIndex } from "../src/api/derive";
import { type Mark, type MarkInput, triagesFor } from "../src/api/desk";
import { MemoryDesk } from "../src/desk/memory-desk";
import {
  casePlaceholders,
  caseResult,
  expectationChoices,
  firstRow,
  keyCommand,
  markCommand,
  NOT_BULK,
  nextRow,
  offeredValues,
  pageGroups,
  placeholderAnswer,
  readRun,
  shownCases,
  stepCase,
  surfaceCounts,
} from "../src/desk/model";
import { CasePane, type CasePaneProps } from "../src/desk/ui/case-pane";
import { rateText, SurfaceSummary } from "../src/desk/ui/run-header";
import { cartRun } from "./desk-fixture";
import { snapshotOf } from "./manual-fixture";

/** The run desk as QA uses it all day, against the store's real cart suite:
 * the Summary's counts, marking from the list, a fail that names what
 * broke, test data offered and never assumed. */

const TC19 = "g10.store-cart.TC19";

async function cart() {
  const desk = new MemoryDesk("chloe@9gag.com");
  const run = await desk.openRun(cartRun());
  const read = async () => readRun(await desk.run(run.id));
  return { desk, run, read };
}

let ids = 0;
const makeId = () => {
  ids += 1;
  return `id-${ids}`;
};

describe("the run header", () => {
  it("counts each surface as the Summary tab does, n/a left out of the rate", async () => {
    const { desk, run, read } = await cart();
    const reading = await read();
    const rows = reading.view.rows.map((row) => row.key);
    await desk.mark(run.id, [
      { id: "a", row: rows[0], surface: "web", value: "pass" },
    ]);
    await desk.mark(run.id, [
      { id: "b", row: rows[1], surface: "web", value: "pass" },
    ]);
    await desk.mark(run.id, [
      { id: "c", row: rows[2], surface: "web", value: "fail" },
    ]);
    await desk.mark(
      run.id,
      [3, 4].map((at) => ({
        id: `na-${at}`,
        row: rows[at],
        surface: "web" as const,
        value: "na" as const,
      })),
    );
    const counts = surfaceCounts(await read(), "web");
    expect(counts).toMatchObject({
      pass: 2,
      fail: 1,
      na: 2,
      total: rows.length,
    });
    expect(counts.todo).toBe(rows.length - 5);
    expect(counts.rate).toBeCloseTo(2 / (rows.length - 2));

    const html = renderToStaticMarkup(
      <SurfaceSummary counts={counts} mine surface="web" />,
    );
    expect(html).toContain(rateText(counts.rate));
    expect(html).toContain("2 pass · 1 fail");
    expect(html).toContain("2 n/a");
  });

  it("reads a manual-only case as n/a on the automated columns, never as to do", async () => {
    const { read } = await cart();
    const reading = await read();
    const auto = surfaceCounts(reading, "autoWeb");
    const manual = reading.view.spec.cases.filter(
      (one) => !one.surfaces.includes("autoWeb"),
    );
    expect(manual.length).toBeGreaterThan(0);
    expect(auto.na).toBeGreaterThanOrEqual(manual.length);
    expect(auto.rate).toBe(auto.total === auto.na ? null : 0);
  });
});

describe("marking from the list", () => {
  it("moves with j and k, and marks the row in focus on the tester's surface", async () => {
    const { desk, run, read } = await cart();
    let reading = await read();
    const order = pageGroups(reading.view.spec, (path) => path).flatMap(
      (page) =>
        page.sections.flatMap((section) => section.cases.map((one) => one.id)),
    );
    let focus = { case: null as string | null, row: null as string | null };
    const press = async (key: string) => {
      const command = keyCommand({ key });
      if (!command) throw new Error(`no command for ${key}`);
      if (command.kind === "case") {
        const next = stepCase(order, focus.case, command.step);
        focus = { case: next, row: next ? firstRow(reading, next) : null };
      } else if (command.kind === "row") focus = nextRow(reading, order, focus);
      else if (command.kind === "mark") {
        const testCase = reading.caseById.get(focus.case ?? "");
        const result = markCommand({
          value: command.value,
          surface: "mobile",
          focus: focus.row,
          selected: [],
          hasExpectations: testCase
            ? expectationChoices(
                testCase,
                reading.rowByKey.get(focus.row ?? ""),
              ).length > 0
            : false,
          makeId,
        });
        if (result.kind === "send") await desk.mark(run.id, result.marks);
        reading = await read();
        return result;
      }
      return null;
    };

    await press("j");
    expect(focus.case).toBe(order[0]);
    await press("p");
    await press("Enter");
    expect(focus.row).toBe(reading.rowsByCase.get(order[0])?.[1].key);
    await press("b");
    await press("j");
    await press("k");
    expect(focus.case).toBe(order[0]);
    const rows = reading.rowsByCase.get(order[0]) ?? [];
    expect(
      rows.map((row) => reading.current.get(row.key)?.mobile?.value),
    ).toEqual(["pass", "blocked", ...rows.slice(2).map(() => undefined)]);
    expect(
      rows.every((row) => reading.current.get(row.key)?.web === undefined),
    ).toBe(true);
    // A fail first asks which expectation broke.
    expect(await press("f")).toEqual({
      kind: "ask-expectation",
      row: focus.row,
    });
  });

  it("keeps a key typed with a modifier for the browser", () => {
    expect(keyCommand({ key: "p", metaKey: true })).toBeNull();
    expect(keyCommand({ key: "f" })).toEqual({ kind: "mark", value: "fail" });
  });
});

describe("no bulk verdict", () => {
  const selected = [`${TC19}#1`, `${TC19}#2`];

  it.each(["pass", "fail"] as const)("refuses %s on many rows", (value) => {
    expect(
      markCommand({
        value,
        surface: "web",
        focus: null,
        selected,
        hasExpectations: true,
        makeId,
      }),
    ).toEqual({
      kind: "refused",
      reason: NOT_BULK,
    });
  });

  it.each(["blocked", "skipped", "na", "todo"] as const)(
    "marks %s on every selected row",
    (value) => {
      const command = markCommand({
        value,
        surface: "web",
        focus: null,
        selected,
        hasExpectations: true,
        makeId,
      });
      expect(command.kind).toBe("send");
      expect(
        command.kind === "send" &&
          command.marks.map((one) => [one.row, one.value]),
      ).toEqual(selected.map((row) => [row, value]));
    },
  );
});

describe("a fail", () => {
  it("offers the case's expectations and the row's own expected cells", async () => {
    const { read } = await cart();
    const reading = await read();
    const testCase = reading.caseById.get(TC19);
    if (!testCase) throw new Error("TC19 is in the cart suite");
    const choices = expectationChoices(
      testCase,
      reading.rowByKey.get(`${TC19}#2`),
    );
    expect(choices.map((one) => one.text)).toEqual([
      "The row's discount row and total.",
      "`Discount (<public code>)` −HKD20; total HKD1,280 = 1,300 − 20",
    ]);
    expect(choices[1].index).toBe(testCase.expect.length + 2);
  });

  it("offers only the triages its surface and mark may carry", () => {
    expect(triagesFor("web", "fail")).not.toContain("flaky");
    expect(triagesFor("autoWeb", "fail")).toContain("flaky");
    expect(triagesFor("web", "skipped")).toContain("deferred");
    expect(triagesFor("web", "pass")).toEqual([]);
  });

  it("shows the expectation that broke, its triage, and a bug with no issue yet", async () => {
    const { desk, run, read } = await cart();
    const failed: MarkInput = {
      id: "f1",
      row: `${TC19}#2`,
      surface: "web",
      value: "fail",
      expectation: 0,
      triage: "bug",
    };
    await desk.mark(run.id, [failed]);
    await desk.putObjects(run.id, `${TC19}#2`, { "<public code>": "SAVE20" });
    const reading = await read();
    const html = renderPane(reading, `${TC19}#2`, "web");
    expect(html).toContain("Broke");
    expect(html).toContain("The row&#x27;s discount row and total.");
    expect(html).toContain("bug · no issue yet");
    expect(html).toContain("File bug");
    expect(html).toContain("issues/new?template=bug_report.yml");
    for (const triage of triagesFor("web", "fail"))
      expect(html).toContain(`>${triage}</button>`);
    expect(html).not.toContain(">flaky</button>");
  });
});

describe("test data in use", () => {
  it("asks what a row used, offers other rows' values, and never prefills one", async () => {
    const { desk, run, read } = await cart();
    await desk.putObjects(run.id, `${TC19}#1`, {
      "<product A>": "SV Booster Box",
    });
    const reading = await read();
    expect(
      offeredValues(reading.view.objects, "<product A>", `${TC19}#2`),
    ).toEqual(["SV Booster Box"]);
    expect(
      offeredValues(reading.view.objects, "<product A>", `${TC19}#1`),
    ).toEqual([]);

    const html = renderPane(reading, `${TC19}#2`, "web");
    const input =
      /<input[^>]*aria-label="The value &lt;product A&gt; stood for on this row"[^>]*>/.exec(
        html,
      )?.[0];
    expect(input).toContain('value=""');
    expect(input).toContain("used before: SV Booster Box");
    expect(html).toContain('<option value="SV Booster Box">');
  });

  it("never asks the environment's address or a value that follows from another", async () => {
    const { read } = await cart();
    const reading = await read();
    const spec = reading.view.spec;
    expect(placeholderAnswer("<g10url>", undefined, spec.env)).toEqual({
      kind: "environment",
      value: "staging-1",
    });
    expect(
      placeholderAnswer(
        "<listing url>",
        spec.placeholders["<listing url>"],
        spec.env,
      ),
    ).toEqual({
      kind: "follows",
      from: "<g10url>",
      value: "staging-1/store/collections",
    });
    expect(placeholderAnswer("<order id>", "<order>'s id", spec.env)).toEqual({
      kind: "follows",
      from: "<order>",
    });
    expect(
      placeholderAnswer(
        "<product A>",
        spec.placeholders["<product A>"],
        spec.env,
      ),
    ).toEqual({ kind: "asked" });
    const tc1 = reading.caseById.get("g10.store-cart.TC1");
    expect(tc1 && casePlaceholders(tc1)).toEqual([
      "<listing url>",
      "<product A>",
    ]);
  });
});

describe("filters", () => {
  it("change what shows, never what is in the run", async () => {
    const { desk, run, read } = await cart();
    await desk.mark(run.id, [
      { id: "x", row: `${TC19}#2`, surface: "web", value: "fail" },
    ]);
    const reading = await read();
    const before = JSON.stringify(reading.view);
    const failing = shownCases(reading, { result: "fail" }, "web");
    expect([...failing]).toEqual([TC19]);
    const critical = shownCases(reading, { severity: "critical" }, "web");
    expect(critical.size).toBeGreaterThan(0);
    expect(critical.size).toBeLessThan(reading.view.spec.cases.length);
    expect(caseResult(reading, TC19, "web")).toBe("fail");
    expect(JSON.stringify(reading.view)).toBe(before);
    expect(surfaceCounts(reading, "web").total).toBe(reading.view.rows.length);
    expect((await desk.run(run.id)).rows).toHaveLength(
      reading.view.rows.length,
    );
  });
});

function renderPane(
  reading: ReturnType<typeof readRun>,
  row: string,
  surface: CasePaneProps["surface"],
) {
  const testCase = reading.caseById.get(reading.rowByKey.get(row)?.case ?? "");
  if (!testCase) throw new Error(`no case for ${row}`);
  const index = buildIndex(snapshotOf());
  const props: CasePaneProps = {
    testCase,
    reading,
    index,
    surface,
    focusRow: row,
    pendingMarks: new Set(),
    closed: false,
    ask: null,
    choices: expectationChoices(testCase, reading.rowByKey.get(row)),
    history: null,
    handleOf: (email) => email,
    bugUrl: (_, mark: Mark) =>
      `https://github.com/9gag/grade10/issues/new?template=bug_report.yml&title=${mark.row}`,
    onRow: () => {},
    onMark: () => {},
    onExpectation: () => {},
    onCancelAsk: () => {},
    onAmend: () => {},
    onObjects: () => {},
    onHistory: () => {},
  };
  return renderToStaticMarkup(
    <MemoryRouter>
      <CasePane {...props} />
    </MemoryRouter>,
  );
}
