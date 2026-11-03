import { describe, expect, it } from "vitest";
import type { MarkInput } from "../src/api/desk";
import { DeskError, httpDesk } from "../src/desk/client";
import { MemoryDesk } from "../src/desk/memory-desk";
import { Outbox } from "../src/desk/outbox";
import { withPending } from "../src/desk/run-view";
import { cartRun, memoryKeys } from "./desk-fixture";

/** The desk's answers, as the memory desk gives them and the Worker must:
 * a retried mark is a no-op, many rows only as a bulk mark, nothing after
 * a run closes — and a mark made offline is sent once the desk is back. */

async function openCart() {
  const desk = new MemoryDesk("chloe@9gag.com");
  const run = await desk.openRun(cartRun());
  const view = await desk.run(run.id);
  return { desk, run, view };
}

const mark = (
  row: string,
  value: MarkInput["value"],
  id = `m-${row}-${value}`,
): MarkInput => ({
  id,
  row,
  surface: "web",
  value,
});

describe("the memory desk", () => {
  it("opens a run of the cart suite, one row per row of test data", async () => {
    const { run, view } = await openCart();
    expect(run.state).toBe("open");
    expect(
      view.rows
        .filter((row) => row.case === "g10.store-cart.TC19")
        .map((row) => row.key),
    ).toEqual(["g10.store-cart.TC19#1", "g10.store-cart.TC19#2"]);
    expect(run.rows).toBe(view.rows.length);
  });

  it("takes a retried mark once", async () => {
    const { desk, run } = await openCart();
    const once = await desk.mark(run.id, [
      mark("g10.store-cart.TC19#2", "pass", "same"),
    ]);
    const twice = await desk.mark(run.id, [
      mark("g10.store-cart.TC19#2", "pass", "same"),
    ]);
    expect(twice.marks[0]).toEqual(once.marks[0]);
    expect(await desk.history(run.id, "g10.store-cart.TC19#2")).toEqual({
      marks: once.marks,
    });
  });

  it("refuses a pass on many rows, and takes blocked on many", async () => {
    const { desk, run } = await openCart();
    const rows = ["g10.store-cart.TC19#1", "g10.store-cart.TC19#2"];
    await expect(
      desk.mark(
        run.id,
        rows.map((row) => mark(row, "pass")),
      ),
    ).rejects.toMatchObject({
      status: 400,
    });
    const taken = await desk.mark(
      run.id,
      rows.map((row) => mark(row, "blocked")),
    );
    expect(taken.marks.map((one) => one.value)).toEqual(["blocked", "blocked"]);
  });

  it("keeps every mark of a retested row, the newest current", async () => {
    const { desk, run } = await openCart();
    await desk.mark(run.id, [mark("g10.store-cart.TC19#2", "fail", "first")]);
    await desk.mark(run.id, [mark("g10.store-cart.TC19#2", "pass", "again")]);
    const view = await desk.run(run.id);
    expect(
      view.marks
        .filter((one) => one.row === "g10.store-cart.TC19#2")
        .map((one) => one.value),
    ).toEqual(["pass"]);
    expect(
      (await desk.history(run.id, "g10.store-cart.TC19#2")).marks.map(
        (one) => one.value,
      ),
    ).toEqual(["fail", "pass"]);
  });

  it("moves through its states in order and ends marking once closed", async () => {
    const { desk, run } = await openCart();
    await expect(desk.setState(run.id, "closed")).rejects.toMatchObject({
      status: 409,
    });
    await desk.setState(run.id, "finalized");
    await desk.mark(run.id, [mark("g10.store-cart.TC19#1", "pass")]);
    await desk.setState(run.id, "closed");
    await expect(
      desk.mark(run.id, [mark("g10.store-cart.TC19#2", "pass")]),
    ).rejects.toMatchObject({
      status: 409,
    });
  });

  it("re-runs only the failed and blocked rows", async () => {
    const { desk, run } = await openCart();
    await desk.mark(run.id, [mark("g10.store-cart.TC19#2", "fail")]);
    await desk.mark(run.id, [mark("g10.store-cart.TC1#3", "blocked")]);
    await desk.mark(run.id, [mark("g10.store-cart.TC1#1", "pass")]);
    const again = await desk.rerun(run.id);
    const view = await desk.run(again.id);
    expect(again.rerunOf).toBe(run.id);
    expect(view.spec.cases.map((one) => one.id)).toEqual([
      "g10.store-cart.TC1",
      "g10.store-cart.TC19",
    ]);
    expect(view.rows).toHaveLength(2);
  });

  it("refuses a triage the mark cannot carry", async () => {
    const { desk, run } = await openCart();
    await expect(
      desk.mark(run.id, [
        { ...mark("g10.store-cart.TC19#1", "fail"), triage: "flaky" },
      ]),
    ).rejects.toThrow(/cannot be triaged flaky/);
  });
});

describe("the outbox", () => {
  it("keeps a mark made offline and sends it once the desk is back", async () => {
    const { desk, run, view } = await openCart();
    const keys = memoryKeys();
    const outbox = new Outbox(run.id, keys);
    desk.setOnline(false);
    outbox.add({
      kind: "marks",
      marks: [mark("g10.store-cart.TC19#1", "pass", "offline-1")],
    });
    const shown = withPending(view, outbox.list(), "chloe@9gag.com");
    expect(shown.view.marks.find((one) => one.id === "offline-1")?.value).toBe(
      "pass",
    );
    expect(shown.pendingMarks.has("offline-1")).toBe(true);

    expect(await outbox.flush(desk, () => {})).toEqual({
      rejected: [],
      held: {
        reason: "unreachable",
        message: "The desk cannot be reached: offline",
      },
    });
    // A reload of the page reads the same waiting writes back.
    const reopened = new Outbox(run.id, keys);
    expect(reopened.list()).toHaveLength(1);

    desk.setOnline(true);
    const acked: string[] = [];
    expect(
      await reopened.flush(
        desk,
        (ack) =>
          ack.kind === "marks" && acked.push(...ack.marks.map((one) => one.id)),
      ),
    ).toEqual({
      rejected: [],
      held: null,
    });
    expect(acked).toEqual(["offline-1"]);
    expect(reopened.list()).toEqual([]);
    expect(keys.held.size).toBe(0);
    expect((await desk.run(run.id)).marks.map((one) => one.id)).toEqual([
      "offline-1",
    ]);
  });

  it("sends a mark twice without doubling it", async () => {
    const { desk, run } = await openCart();
    const keys = memoryKeys();
    const sent = mark("g10.store-cart.TC19#1", "pass", "twice");
    await desk.mark(run.id, [sent]);
    // The answer was lost: the page still holds the write and sends it again.
    const outbox = new Outbox(run.id, keys);
    outbox.add({ kind: "marks", marks: [sent] });
    await outbox.flush(desk, () => {});
    expect(
      (await desk.history(run.id, "g10.store-cart.TC19#1")).marks,
    ).toHaveLength(1);
  });

  it("drops a write the desk refuses and says why", async () => {
    const { desk, run } = await openCart();
    await desk.setState(run.id, "finalized");
    await desk.setState(run.id, "closed");
    const outbox = new Outbox(run.id, memoryKeys());
    outbox.add({
      kind: "marks",
      marks: [mark("g10.store-cart.TC19#1", "pass")],
    });
    const result = await outbox.flush(desk, () => {});
    expect(result.held).toBeNull();
    expect(result.rejected[0]?.message).toMatch(/closed/);
    expect(outbox.list()).toEqual([]);
  });

  it("sends observations and objects in the order they were made", async () => {
    const { desk, run, view } = await openCart();
    const outbox = new Outbox(run.id, memoryKeys());
    const walk = view.spec.walks[0].id;
    outbox.add({
      kind: "observations",
      observations: [{ id: "o1", walk, step: 0, seen: true }],
    });
    outbox.add({
      kind: "objects",
      row: "g10.store-cart.TC19#2",
      objects: { "<public code>": "SAVE20" },
    });
    await outbox.flush(desk, () => {});
    const after = await desk.run(run.id);
    expect(after.observations.map((one) => one.id)).toEqual(["o1"]);
    expect(after.objects["g10.store-cart.TC19#2"]).toEqual({
      "<public code>": "SAVE20",
    });
  });
});

describe("the desk over HTTP", () => {
  it("says the desk's own words when it refuses", async () => {
    const desk = httpDesk(
      "/api/desk",
      async () =>
        new Response(
          JSON.stringify({ error: "Run 9 is closed; marking has ended" }),
          { status: 409 },
        ),
    );
    const refused = desk.mark("9", [mark("x", "pass")]);
    await expect(refused).rejects.toBeInstanceOf(DeskError);
    await expect(refused).rejects.toMatchObject({
      status: 409,
      message: "Run 9 is closed; marking has ended",
    });
  });

  it("tells an unreachable desk from a refusal", async () => {
    const desk = httpDesk("/api/desk", async () => {
      throw new TypeError("Failed to fetch");
    });
    await expect(desk.runs()).rejects.toMatchObject({ status: undefined });
  });

  it("sends marks where the contract says", async () => {
    const calls: { url: string; method?: string; body?: string }[] = [];
    const desk = httpDesk("/api/desk", async (url, init) => {
      calls.push({
        url: String(url),
        method: init?.method,
        body: String(init?.body),
      });
      return new Response(JSON.stringify({ marks: [] }));
    });
    await desk.mark("5", [mark("g10.store-cart.TC19#2", "pass", "a")]);
    expect(calls[0].url).toBe("/api/desk/runs/5/marks");
    expect(calls[0].method).toBe("POST");
    expect(JSON.parse(calls[0].body ?? "")).toEqual({
      marks: [mark("g10.store-cart.TC19#2", "pass", "a")],
    });
  });
});
