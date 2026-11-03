import assert from "node:assert/strict";
import { test } from "node:test";
import type { MarkInput } from "../../manual/src/api/desk.ts";
import { caseVerdict } from "../../manual/src/api/verdicts.ts";
import { DeskError } from "../src/store.ts";
import { aCase, aSpec, deskInMemory, TESTER } from "./desk.ts";

const refused = (status: number, pattern?: RegExp) => (error: unknown) => {
  assert.ok(error instanceof DeskError, String(error));
  assert.equal(error.status, status, error.message);
  if (pattern) assert.match(error.message, pattern);
  return true;
};

const mark = (
  row: string,
  value: MarkInput["value"],
  extra: Partial<MarkInput> = {},
): MarkInput => ({
  id: `${row}/${extra.surface ?? "web"}/${value}/${Math.random()}`,
  row,
  surface: "web",
  value,
  ...extra,
});

test("a run's rows come from its spec: one per data row, else one per case", () => {
  const { store } = deskInMemory();
  const run = store.open(aSpec(), TESTER);
  assert.equal(run.id, "1");
  assert.equal(run.state, "open");
  assert.equal(run.openedBy, TESTER);
  assert.equal(run.cases, 3);
  assert.equal(run.rows, 5);
  assert.deepEqual(store.view(run.id).rows, [
    { key: "TC1#1", case: "TC1", index: 1 },
    { key: "TC1#2", case: "TC1", index: 2 },
    { key: "TC1#3", case: "TC1", index: 3 },
    { key: "TC2", case: "TC2", index: 0 },
    { key: "TC3", case: "TC3", index: 0 },
  ]);
  assert.equal(store.open(aSpec(), TESTER).id, "2");
  assert.deepEqual(
    store.runs().map((one) => one.id),
    ["2", "1"],
  );
});

test("a spec the desk cannot read is refused with the reason", () => {
  const { store } = deskInMemory();
  assert.throws(
    () => store.open({ ...aSpec(), cases: [] }, TESTER),
    refused(400, /at least one case/),
  );
  assert.throws(
    () => store.open({ ...aSpec(), cases: [aCase("A"), aCase("A")] }, TESTER),
    refused(400, /selected twice/),
  );
  assert.throws(
    () =>
      store.open(
        { ...aSpec(), cases: [aCase("A", { surfaces: ["tv" as never] })] },
        TESTER,
      ),
    refused(400, /surfaces/),
  );
  assert.throws(
    () => store.open({ ...aSpec(), rerunOf: "9" }, TESTER),
    refused(404),
  );
  assert.equal(store.runs().length, 0);
});

test("a mark sent twice is one mark", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  const one = mark("TC2", "pass");
  const first = store.mark(id, { marks: [one] }, TESTER);
  const again = store.mark(id, { marks: [one] }, "someone@else.com");
  assert.deepEqual(again.value, first.value);
  assert.equal(first.live.length, 1);
  assert.equal(again.live.length, 0);
  assert.equal(store.view(id).marks.length, 1);
  assert.equal(store.view(id).marks[0].by, TESTER);
});

test("the current mark is the newest per row and surface, and every mark is kept", () => {
  const { store, db } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  store.mark(
    id,
    { marks: [mark("TC2", "fail", { triage: "bug", expectation: 1 })] },
    TESTER,
  );
  store.mark(id, { marks: [mark("TC2", "pass")] }, "other@grade10.com");
  store.mark(
    id,
    { marks: [mark("TC2", "pass", { surface: "mobile" })] },
    TESTER,
  );
  const marks = store.view(id).marks;
  assert.deepEqual(
    marks.map((one) => [one.surface, one.value, one.by]),
    [
      ["web", "pass", "other@grade10.com"],
      ["mobile", "pass", TESTER],
    ],
  );
  assert.equal(
    (db.prepare("select count(*) n from marks").get() as { n: number }).n,
    3,
  );
});

test("a pass or a fail is one row at a time; the bulk marks go many at once", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  assert.throws(
    () =>
      store.mark(
        id,
        { marks: [mark("TC2", "pass"), mark("TC3", "pass")] },
        TESTER,
      ),
    refused(400, /one row at a time/),
  );
  assert.throws(
    () =>
      store.mark(
        id,
        { marks: [mark("TC2", "blocked"), mark("TC3", "fail")] },
        TESTER,
      ),
    refused(400, /one row at a time/),
  );
  assert.equal(
    store.view(id).marks.length,
    0,
    "a refused batch writes nothing",
  );
  const both = store.mark(
    id,
    {
      marks: [mark("TC2", "pass"), mark("TC2", "pass", { surface: "mobile" })],
    },
    TESTER,
  );
  assert.equal(both.value.length, 2);
  const bulk = store.mark(
    id,
    {
      marks: ["TC1#1", "TC1#2", "TC1#3"].map((row) =>
        mark(row, "blocked", { triage: "environment" }),
      ),
    },
    TESTER,
  );
  assert.equal(bulk.value.length, 3);
});

test("a mark names a row, a surface, a mark and a triage the run allows", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  assert.throws(
    () => store.mark(id, { marks: [mark("TC1", "pass")] }, TESTER),
    refused(400, /row TC1 is not in run 1/),
  );
  assert.throws(
    () =>
      store.mark(
        id,
        { marks: [mark("TC2", "pass", { surface: "tv" as never })] },
        TESTER,
      ),
    refused(400),
  );
  assert.throws(
    () => store.mark(id, { marks: [mark("TC2", "great" as never)] }, TESTER),
    refused(400),
  );
  assert.throws(
    () =>
      store.mark(
        id,
        { marks: [mark("TC2", "fail", { triage: "flaky" })] },
        TESTER,
      ),
    refused(400, /flaky/),
  );
  assert.throws(
    () =>
      store.mark(
        id,
        { marks: [mark("TC2", "pass", { triage: "bug" })] },
        TESTER,
      ),
    refused(400),
  );
  assert.throws(
    () =>
      store.mark(
        id,
        { marks: [mark("TC2", "fail", { expectation: 2 })] },
        TESTER,
      ),
    refused(400, /expectation/),
  );
  assert.throws(() => store.mark(id, { marks: [] }, TESTER), refused(400));
  const flaky = store.mark(
    id,
    { marks: [mark("TC2", "fail", { surface: "autoWeb", triage: "flaky" })] },
    TESTER,
  );
  assert.equal(flaky.value[0].triage, "flaky");
});

test("runs move open, finalized, closed; a finalized run reopens; a closed run is final", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  assert.throws(
    () => store.setState(id, { state: "closed" }, TESTER),
    refused(409),
  );
  const finalized = store.setState(id, { state: "finalized" }, TESTER);
  assert.equal(finalized.value.state, "finalized");
  assert.ok(finalized.value.finalizedAt);
  assert.deepEqual(finalized.live, [
    { run: id, message: { type: "run", run: finalized.value } },
  ]);
  const reopened = store.setState(id, { state: "open" }, TESTER).value;
  assert.equal(reopened.state, "open");
  assert.equal(reopened.finalizedAt, undefined);
  store.setState(id, { state: "finalized" }, TESTER);
  assert.equal(
    store.setState(id, { state: "finalized" }, TESTER).live.length,
    0,
    "the same state twice is a no-op",
  );
  store.mark(id, { marks: [mark("TC2", "pass")] }, TESTER);
  const closed = store.setState(id, { state: "closed" }, TESTER).value;
  assert.equal(closed.state, "closed");
  assert.ok(closed.closedAt);
  assert.throws(
    () => store.setState(id, { state: "open" }, TESTER),
    refused(409),
  );
  assert.throws(
    () => store.setState(id, { state: "finalized" }, TESTER),
    refused(409),
  );
  assert.throws(
    () => store.setState(id, { state: "done" }, TESTER),
    refused(400),
  );
});

test("a closed run takes no mark, observation or object", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  store.setState(id, { state: "finalized" }, TESTER);
  store.setState(id, { state: "closed" }, TESTER);
  assert.throws(
    () => store.mark(id, { marks: [mark("TC2", "pass")] }, TESTER),
    refused(409, /closed/),
  );
  assert.throws(
    () =>
      store.observe(
        id,
        {
          observations: [
            { id: "o", walk: "cart-tcs.md#walk-1", step: 0, seen: true },
          ],
        },
        TESTER,
      ),
    refused(409),
  );
  assert.throws(
    () => store.setObjects(id, "TC2", { "{{order}}": "A1" }, TESTER),
    refused(409),
  );
});

test("the selection changes only while open, and marks on rows that stay are kept", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  store.mark(id, { marks: [mark("TC2", "pass")] }, TESTER);
  store.mark(id, { marks: [mark("TC3", "fail")] }, TESTER);
  const spec = aSpec();
  const replaced = store.replaceSpec(
    id,
    { ...spec, cases: [spec.cases[1], aCase("TC4")] },
    TESTER,
  );
  assert.deepEqual(
    replaced.value.rows.map((row) => row.key),
    ["TC2", "TC4"],
  );
  assert.deepEqual(
    replaced.value.marks.map((one) => [one.row, one.value]),
    [["TC2", "pass"]],
  );
  assert.deepEqual(replaced.live, [
    {
      run: id,
      message: {
        type: "spec",
        seq:
          replaced.live[0].message.type === "spec"
            ? replaced.live[0].message.seq
            : -1,
      },
    },
  ]);
  assert.equal(replaced.value.run.cases, 2);
  store.setState(id, { state: "finalized" }, TESTER);
  assert.throws(
    () => store.replaceSpec(id, spec, TESTER),
    refused(409, /only while open/),
  );
});

test("objects merge per row, an empty value removes one, and each change is kept", () => {
  const { store, db } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  const first = store.setObjects(
    id,
    "TC1#2",
    { "{{order}}": "A100", "{{user}}": "qa1" },
    TESTER,
  );
  assert.deepEqual(first.value.objects, {
    "{{order}}": "A100",
    "{{user}}": "qa1",
  });
  assert.equal(first.live[0].message.type, "objects");
  const second = store.setObjects(
    id,
    "TC1#2",
    { "{{order}}": "A101", "{{user}}": "" },
    "other@grade10.com",
  );
  assert.deepEqual(second.value.objects, { "{{order}}": "A101" });
  assert.ok(second.value.seq > first.value.seq);
  const same = store.setObjects(id, "TC1#2", { "{{order}}": "A101" }, TESTER);
  assert.equal(same.live.length, 0);
  assert.deepEqual(store.view(id).objects, {
    "TC1#2": { "{{order}}": "A101" },
  });
  assert.equal(
    (db.prepare("select count(*) n from objects").get() as { n: number }).n,
    4,
  );
  assert.throws(
    () => store.setObjects(id, "TC9", { a: "b" }, TESTER),
    refused(400),
  );
  assert.throws(
    () => store.setObjects(id, "TC2", { a: 1 }, TESTER),
    refused(400),
  );
});

test("observations tick a walk's route steps, idempotent by id", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  const seen = {
    id: "o1",
    walk: "cart-tcs.md#walk-1",
    step: 1,
    seen: true,
    note: "paid",
  };
  store.observe(id, { observations: [seen] }, TESTER);
  store.observe(id, { observations: [seen] }, TESTER);
  store.observe(
    id,
    { observations: [{ ...seen, id: "o2", seen: false, note: undefined }] },
    TESTER,
  );
  const held = store.view(id).observations;
  assert.equal(held.length, 1);
  assert.equal(held[0].id, "o2");
  assert.equal(held[0].seen, false);
  assert.throws(
    () =>
      store.observe(
        id,
        { observations: [{ ...seen, id: "o3", step: 2 }] },
        TESTER,
      ),
    refused(400),
  );
  assert.throws(
    () =>
      store.observe(
        id,
        { observations: [{ ...seen, id: "o3", walk: "nope" }] },
        TESTER,
      ),
    refused(400),
  );
});

test("a re-run walks the failed and blocked rows again, keeping their row numbers", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  store.mark(
    id,
    {
      marks: [
        mark("TC1#1", "pass"),
        mark("TC1#1", "pass", { surface: "mobile" }),
      ],
    },
    TESTER,
  );
  store.mark(id, { marks: [mark("TC1#2", "fail", { triage: "bug" })] }, TESTER);
  store.mark(
    id,
    { marks: [mark("TC1#3", "blocked", { surface: "mobile" })] },
    TESTER,
  );
  store.mark(
    id,
    {
      marks: [mark("TC2", "pass"), mark("TC2", "pass", { surface: "mobile" })],
    },
    TESTER,
  );
  store.mark(id, { marks: [mark("TC3", "pass")] }, TESTER);
  const rerun = store.rerun(id, {}, TESTER);
  assert.equal(rerun.rerunOf, id);
  assert.equal(rerun.state, "open");
  assert.equal(rerun.name, "store launch 1 re-run");
  const view = store.view(rerun.id);
  assert.deepEqual(
    view.rows.map((row) => row.key),
    ["TC1#2", "TC1#3"],
  );
  assert.deepEqual(view.spec.exclusions, []);
  assert.deepEqual(
    view.spec.walks[0].route.map((step) => step.cases),
    [["TC1"], []],
  );
  assert.equal(store.rerun(id, { name: "again" }, TESTER).name, "again");
  const clean = store.open(
    aSpec({ cases: [aCase("TC3", { surfaces: ["web"] })] }),
    TESTER,
  );
  store.mark(clean.id, { marks: [mark("TC3", "pass")] }, TESTER);
  assert.throws(
    () => store.rerun(clean.id, {}, TESTER),
    refused(409, /no failed or blocked/),
  );
});

test("verdicts take each case from the newest run on its environment that holds it", () => {
  const { store } = deskInMemory();
  const older = store.open(aSpec(), TESTER);
  store.mark(older.id, { marks: [mark("TC2", "fail")] }, TESTER);
  store.mark(older.id, { marks: [mark("TC3", "pass")] }, TESTER);
  const newer = store.open(
    aSpec({
      cases: [aCase("TC2", { marker: "g10.store-cart.TC-b7c", rev: 1 })],
    }),
    TESTER,
  );
  store.mark(
    newer.id,
    {
      marks: [mark("TC2", "pass"), mark("TC2", "pass", { surface: "mobile" })],
    },
    TESTER,
  );
  const elsewhere = store.open(
    aSpec({ env: "staging", phase: undefined }),
    TESTER,
  );
  store.mark(elsewhere.id, { marks: [mark("TC3", "fail")] }, TESTER);

  const verdicts = store.verdicts();
  assert.deepEqual(
    verdicts.runs.map((run) => run.id),
    ["3", "2", "1"],
  );
  const qa = verdicts.cases.qa;
  assert.equal(qa.TC2.run, newer.id);
  assert.equal(qa.TC2.marker, "g10.store-cart.TC-b7c");
  assert.equal(qa.TC2.rev, 1);
  assert.equal(caseVerdict(qa.TC2.rows).verdict, "pass");
  assert.equal(qa.TC3.run, older.id);
  assert.equal(
    caseVerdict(qa.TC3.rows).verdict,
    "pass",
    "a surface not in play is n/a, not to do",
  );
  assert.deepEqual(
    qa.TC1.rows.map((row) => row.key),
    ["TC1#1", "TC1#2", "TC1#3"],
  );
  assert.equal(caseVerdict(qa.TC1.rows).verdict, "notrun");
  assert.equal(verdicts.cases.staging.TC3.run, elsewhere.id);
  assert.equal(caseVerdict(verdicts.cases.staging.TC3.rows).verdict, "fail");
  assert.deepEqual(Object.keys(qa.TC2.rows[0].marks[0]).sort(), [
    "at",
    "by",
    "id",
    "row",
    "seq",
    "surface",
    "value",
  ]);
});

test("exclusions count from finalized runs selected by phase", () => {
  const { store } = deskInMemory();
  const run = store.open(aSpec(), TESTER);
  store.open(
    aSpec({
      phase: undefined,
      exclusions: [{ id: "TC8", reason: "not a phase run" }],
    }),
    TESTER,
  );
  assert.deepEqual(
    store.verdicts().excluded,
    {},
    "an open run excludes nothing yet",
  );
  store.setState(run.id, { state: "finalized" }, TESTER);
  assert.deepEqual(store.verdicts().excluded, {
    "store-launch-1": { TC9: "launches with store-launch-2" },
  });
  const later = store.open(
    aSpec({ cases: [aCase("TC9")], exclusions: [] }),
    TESTER,
  );
  store.setState(later.id, { state: "finalized" }, TESTER);
  store.setState(later.id, { state: "closed" }, TESTER);
  assert.deepEqual(
    store.verdicts().excluded,
    { "store-launch-1": {} },
    "a later run that selects it brings it back",
  );
});

test("the CSV export is one line per row and surface, quoted as RFC 4180", () => {
  const { store } = deskInMemory();
  const { id } = store.open(
    aSpec({
      cases: [
        aCase("TC1", {
          title: 'Apply "G10", then pay',
          data: { header: ["tier"], rows: [["Gold"], ["Silver"]] },
        }),
        aCase("TC3", { surfaces: ["web"] }),
      ],
    }),
    TESTER,
  );
  store.mark(
    id,
    {
      marks: [
        mark("TC1#2", "fail", {
          triage: "bug",
          expectation: 1,
          issue: "https://github.com/9gag/grade10/issues/1",
          note: "line one\nline two",
        }),
      ],
    },
    TESTER,
  );
  store.mark(
    id,
    { marks: [mark("TC3", "fail", { surface: "autoWeb", triage: "flaky" })] },
    TESTER,
  );
  store.setObjects(
    id,
    "TC1#2",
    { "{{order}}": "A1", "{{user}}": "qa,1" },
    TESTER,
  );
  const lines = store.csv(id).split("\r\n");
  assert.equal(lines.at(-1), "", "every line ends in CRLF");
  assert.equal(
    lines[0],
    "case,title,data row,surface,value,triage,issue,expectation,note,objects,by,at",
  );
  assert.equal(
    lines.length - 2,
    2 + 2 + 2,
    "two rows on web and mobile, and TC3 on web and the auto web it was marked on",
  );
  assert.equal(lines[1], 'TC1,"Apply ""G10"", then pay",1,web,to do,,,,,,,');
  const failed = store
    .csv(id)
    .split("\r\n")
    .find((line) => line.startsWith('TC1,"Apply ""G10"", then pay",2,web'));
  assert.equal(
    failed,
    `TC1,"Apply ""G10"", then pay",2,web,fail,bug,https://github.com/9gag/grade10/issues/1,the total drops,"line one\nline two","{{order}}=A1; {{user}}=qa,1",${TESTER},2026-11-03T09:00:01.000Z`,
  );
  assert.ok(
    lines.includes(
      `TC3,Case TC3,,autoWeb,fail,flaky,,,,,${TESTER},2026-11-03T09:00:02.000Z`,
    ),
  );
  assert.ok(lines.includes("TC3,Case TC3,,web,to do,,,,,,,"));
});

test("a finalized run's print record names its cases in run order", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  assert.throws(() => store.record(id), refused(409, /open/));
  store.setState(id, { state: "finalized" }, TESTER);
  const record = store.record(id);
  assert.equal(record.run.state, "finalized");
  assert.equal(record.run.id, id);
  assert.deepEqual(record.spec, aSpec());
  assert.throws(() => store.record("7"), refused(404));
});

test("a row's history keeps every mark with who and when, oldest first", () => {
  const { store } = deskInMemory();
  const { id } = store.open(aSpec(), TESTER);
  const row = store.view(id).rows[0].key;
  store.mark(
    id,
    { marks: [{ id: "m1", row, surface: "web", value: "fail" }] },
    TESTER,
  );
  store.mark(
    id,
    { marks: [{ id: "m2", row, surface: "web", value: "pass" }] },
    TESTER,
  );
  assert.deepEqual(
    store.history(id, row).marks.map((one) => [one.id, one.value, one.by]),
    [
      ["m1", "fail", TESTER],
      ["m2", "pass", TESTER],
    ],
  );
  assert.throws(() => store.history(id, "nope"), refused(404));
});
