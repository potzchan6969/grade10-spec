import assert from "node:assert/strict";
import { test } from "node:test";
import type { RunSummary, RunView } from "../../manual/src/api/desk.ts";
import { handle, liveRun, MAX_BODY } from "../src/http.ts";
import { aSpec, deskInMemory, TESTER } from "./desk.ts";

const ORIGIN = "https://spec.grade10-stg.com";

function client() {
  const { store } = deskInMemory();
  return async (method: string, path: string, body?: unknown) => {
    const request = new Request(`${ORIGIN}/api/desk${path}`, {
      method,
      ...(body === undefined
        ? {}
        : {
            body: typeof body === "string" ? body : JSON.stringify(body),
            headers: { "content-type": "application/json" },
          }),
    });
    const { response, live } = await handle(store, request, TESTER);
    const text = await response.text();
    const type = response.headers.get("content-type") ?? "";
    return {
      status: response.status,
      headers: response.headers,
      body: type.startsWith("application/json") ? JSON.parse(text) : text,
      live,
    };
  };
}

test("the desk answers the routes the manual and the run sheet call", async () => {
  const call = client();
  assert.deepEqual((await call("GET", "/me")).body, { email: TESTER });
  const opened = await call("POST", "/runs", aSpec());
  assert.equal(opened.status, 201);
  const run = opened.body as RunSummary;
  assert.deepEqual(
    ((await call("GET", "/runs")).body as RunSummary[]).map((one) => one.id),
    [run.id],
  );

  const marked = await call("POST", `/runs/${run.id}/marks`, {
    marks: [
      { id: "m1", row: "TC1#2", surface: "web", value: "fail", triage: "bug" },
    ],
  });
  assert.equal(marked.status, 200);
  assert.equal(marked.body.marks[0].by, TESTER);
  assert.deepEqual(marked.live, [
    { run: run.id, message: { type: "mark", mark: marked.body.marks[0] } },
  ]);

  const objects = await call(
    "PUT",
    `/runs/${run.id}/rows/${encodeURIComponent("TC1#2")}/objects`,
    { "{{order}}": "A1" },
  );
  assert.deepEqual(objects.body.objects, { "{{order}}": "A1" });

  const observed = await call("POST", `/runs/${run.id}/observations`, {
    observations: [
      { id: "o1", walk: "cart-tcs.md#walk-1", step: 0, seen: true },
    ],
  });
  assert.equal(observed.body.observations.length, 1);

  const view = (await call("GET", `/runs/${run.id}`)).body as RunView;
  assert.equal(view.marks.length, 1);
  assert.deepEqual(view.objects, { "TC1#2": { "{{order}}": "A1" } });
  assert.equal(view.seq, objects.body.seq + 1);

  const replaced = await call(
    "PUT",
    `/runs/${run.id}/spec`,
    aSpec({ name: "renamed" }),
  );
  assert.equal((replaced.body as RunView).run.name, "renamed");

  const csv = await call("GET", `/runs/${run.id}/export.csv`);
  assert.equal(csv.headers.get("content-type"), "text/csv; charset=utf-8");
  assert.equal(
    csv.headers.get("content-disposition"),
    `attachment; filename="run-${run.id}-renamed.csv"`,
  );
  assert.match(csv.body, /^case,title,/);

  const rerun = await call("POST", `/runs/${run.id}/rerun`, {});
  assert.equal(rerun.status, 201);
  assert.equal(rerun.body.rerunOf, run.id);

  assert.equal((await call("GET", `/runs/${run.id}/record`)).status, 409);
  const finalized = await call("POST", `/runs/${run.id}/state`, {
    state: "finalized",
  });
  assert.equal(finalized.body.state, "finalized");
  assert.equal(
    (await call("GET", `/runs/${run.id}/record`)).body.spec.cases.length,
    3,
  );

  const verdicts = await call("GET", "/verdicts");
  assert.equal(
    verdicts.body.cases.qa.TC1.run,
    run.id,
    "the run that walked it",
  );
});

test("errors are JSON with a status and a reason", async () => {
  const call = client();
  assert.deepEqual(
    await call("GET", "/runs/9").then((r) => [r.status, r.body]),
    [404, { error: "no run 9 on the desk" }],
  );
  assert.equal((await call("POST", "/runs", "{not json")).status, 400);
  assert.equal((await call("POST", "/runs", { name: "x" })).status, 400);
  assert.equal((await call("DELETE", "/runs")).status, 405);
  assert.equal((await call("GET", "/nothing")).status, 404);
  assert.equal((await call("GET", "/runs/1/nothing")).status, 404);
  const { id } = (await call("POST", "/runs", aSpec())).body as RunSummary;
  assert.equal((await call("GET", `/runs/${id}/live`)).status, 426);
  const bulk = await call("POST", `/runs/${id}/marks`, {
    marks: [
      { id: "a", row: "TC2", surface: "web", value: "pass" },
      { id: "b", row: "TC3", surface: "web", value: "pass" },
    ],
  });
  assert.equal(bulk.status, 400);
  assert.match(bulk.body.error, /one row at a time/);
});

test("a write that is not JSON, or past the desk's size, is refused", async () => {
  const { store } = deskInMemory();
  const post = (headers: Record<string, string>) =>
    handle(
      store,
      new Request(`${ORIGIN}/api/desk/runs`, {
        method: "POST",
        body: JSON.stringify(aSpec()),
        headers,
      }),
      TESTER,
    ).then(({ response }) => response.status);
  assert.equal(await post({ "content-type": "text/plain" }), 415);
  assert.equal(await post({}), 415);
  assert.equal(
    await post({
      "content-type": "application/json",
      "content-length": String(MAX_BODY + 1),
    }),
    413,
  );
  assert.equal(await post({ "content-type": "application/json" }), 201);
});

test("the live path names its run", () => {
  assert.equal(liveRun("/api/desk/runs/12/live"), "12");
  assert.equal(liveRun("/api/desk/runs/12"), undefined);
  assert.equal(liveRun("/api/desks/runs/12/live"), undefined);
  assert.equal(liveRun("/runs/12/live"), undefined);
});
