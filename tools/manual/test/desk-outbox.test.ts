import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Mark, MarkInput } from "../src/api/desk";
import { type DeskApi, DeskError } from "../src/desk/client";
import { keepSending, Outbox } from "../src/desk/outbox";
import { memoryKeys } from "./desk-fixture";

/** A mark made on the desk is lost only when the desk refuses the mark
 * itself; a desk that is away, busy or asking for a sign-in keeps it, and
 * every tab of one run shares one queue. */

const mark = (id: string): MarkInput => ({
  id,
  row: "g10.store-cart.TC19#1",
  surface: "web",
  value: "pass",
});

const taken = (input: MarkInput, seq = 1): Mark =>
  ({ ...input, by: "chloe@9gag.com", at: "2026-11-03T00:00:00Z", seq }) as Mark;

/** A desk whose marks call answers with whatever `answer` says. */
function scriptedDesk(answer: (marks: MarkInput[]) => Promise<Mark[]>) {
  const sent: string[] = [];
  const desk = {
    mark: async (_run: string, marks: MarkInput[]) => {
      sent.push(...marks.map((one) => one.id));
      return { marks: await answer(marks) };
    },
  } as unknown as DeskApi;
  return { desk, sent };
}

const failing = (error: unknown) =>
  scriptedDesk(async () => {
    throw error;
  });

const markIds = (outbox: Outbox) =>
  outbox
    .list()
    .flatMap((op) => (op.kind === "marks" ? op.marks : []))
    .map((one) => one.id);

describe("the outbox keeps a write the desk did not refuse", () => {
  it.each([
    [500, "unavailable"],
    [502, "unavailable"],
    [503, "unavailable"],
    [408, "unavailable"],
    [429, "unavailable"],
    [401, "signed-out"],
    [403, "signed-out"],
  ] as const)("keeps it on %i", async (status, reason) => {
    const outbox = new Outbox("5", memoryKeys());
    outbox.add({ kind: "marks", marks: [mark("a")] });
    const { desk } = failing(new DeskError("token has expired", status));
    const result = await outbox.flush(desk, () => {});
    expect(result.rejected).toEqual([]);
    expect(result.held).toEqual({ reason, message: "token has expired" });
    expect(markIds(outbox)).toEqual(["a"]);
  });

  it("keeps it when the desk cannot be reached", async () => {
    const outbox = new Outbox("5", memoryKeys());
    outbox.add({ kind: "marks", marks: [mark("a")] });
    const { desk } = failing(new DeskError("The desk cannot be reached"));
    const result = await outbox.flush(desk, () => {});
    expect(result.held?.reason).toBe("unreachable");
    expect(markIds(outbox)).toEqual(["a"]);
  });

  it.each([400, 404, 409, 413, 415, 422])(
    "drops it on %i and says the desk's reason",
    async (status) => {
      const outbox = new Outbox("5", memoryKeys());
      outbox.add({ kind: "marks", marks: [mark("a")] });
      outbox.add({ kind: "marks", marks: [mark("b")] });
      const { desk, sent } = failing(new DeskError("no such row", status));
      const result = await outbox.flush(desk, () => {});
      expect(result.held).toBeNull();
      expect(result.rejected.map((one) => one.message)).toEqual([
        "no such row",
        "no such row",
      ]);
      expect(sent).toEqual(["a", "b"]);
      expect(outbox.list()).toEqual([]);
    },
  );
});

describe("two tabs of one run", () => {
  it("keep each other's queued marks", () => {
    const keys = memoryKeys();
    const first = new Outbox("5", keys);
    const second = new Outbox("5", keys);
    first.add({ kind: "marks", marks: [mark("a")] });
    second.add({ kind: "marks", marks: [mark("b")] });
    expect(markIds(new Outbox("5", keys))).toEqual(["a", "b"]);
  });

  it("do not drop a mark the other tab queued while one sends", async () => {
    const keys = memoryKeys();
    const first = new Outbox("5", keys);
    const second = new Outbox("5", keys);
    first.add({ kind: "marks", marks: [mark("a")] });
    const releases: (() => void)[] = [];
    const { desk, sent } = scriptedDesk(
      (marks) =>
        new Promise((done) => {
          releases.push(() => done(marks.map((one) => taken(one))));
        }),
    );
    const flushing = first.flush(desk, () => {});
    await vi.waitFor(() => expect(releases).toHaveLength(1));
    second.add({ kind: "marks", marks: [mark("b")] });
    releases.shift()?.();
    await vi.waitFor(() => expect(releases).toHaveLength(1));
    releases.shift()?.();
    await flushing;
    expect(sent).toEqual(["a", "b"]);
    expect(new Outbox("5", keys).list()).toEqual([]);
  });

  it("hear the other tab's change", () => {
    const keys = memoryKeys();
    let changed = () => {};
    const first = new Outbox("5", keys, (refresh) => {
      changed = refresh;
      return () => {};
    });
    const heard = vi.fn();
    first.subscribe(heard);
    new Outbox("5", keys).add({ kind: "marks", marks: [mark("b")] });
    changed();
    expect(heard).toHaveBeenCalled();
    expect(markIds(first)).toEqual(["b"]);
  });

  it("still queue in this tab when the browser keeps nothing", () => {
    const outbox = new Outbox("5", {
      get: () => null,
      set: () => {},
      remove: () => {},
    });
    outbox.add({ kind: "marks", marks: [mark("a")] });
    expect(markIds(outbox)).toEqual(["a"]);
  });
});

describe("a flush", () => {
  it("sends a mark queued while it was in flight", async () => {
    const outbox = new Outbox("5", memoryKeys());
    const releases: (() => void)[] = [];
    const { desk, sent } = scriptedDesk(
      (marks) =>
        new Promise((done) => {
          releases.push(() => done(marks.map((one) => taken(one))));
        }),
    );
    outbox.add({ kind: "marks", marks: [mark("a")] });
    const first = outbox.flush(desk, () => {});
    await vi.waitFor(() => expect(releases).toHaveLength(1));
    outbox.add({ kind: "marks", marks: [mark("b")] });
    const second = outbox.flush(desk, () => {});
    releases.shift()?.();
    await vi.waitFor(() => expect(releases).toHaveLength(1));
    releases.shift()?.();
    await Promise.all([first, second]);
    expect(sent).toEqual(["a", "b"]);
    expect(outbox.list()).toEqual([]);
  });
});

describe("keeping on sending", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("tries again with a growing wait until the desk takes the write", async () => {
    const outbox = new Outbox("5", memoryKeys());
    outbox.add({ kind: "marks", marks: [mark("a")] });
    let refusals = 2;
    const { desk, sent } = scriptedDesk(async (marks) => {
      if (refusals-- > 0) throw new DeskError("deploying", 503);
      return marks.map((one) => taken(one));
    });
    const reasons: (string | null)[] = [];
    const sender = keepSending(outbox, desk, {
      ack: () => {},
      result: ({ held }) => reasons.push(held?.reason ?? null),
    });
    sender.wake();
    await vi.advanceTimersByTimeAsync(0);
    expect(sent).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1_000);
    expect(sent).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(1_999);
    expect(sent).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(sent).toHaveLength(3);
    expect(reasons).toEqual(["unavailable", "unavailable", null]);
    expect(outbox.list()).toEqual([]);
    sender.stop();
  });

  it("stops trying once let go", async () => {
    const outbox = new Outbox("5", memoryKeys());
    outbox.add({ kind: "marks", marks: [mark("a")] });
    const { desk, sent } = failing(new DeskError("expired", 403));
    const sender = keepSending(outbox, desk, {
      ack: () => {},
      result: () => {},
    });
    sender.wake();
    await vi.advanceTimersByTimeAsync(0);
    sender.stop();
    await vi.advanceTimersByTimeAsync(60_000);
    expect(sent).toHaveLength(1);
    expect(markIds(outbox)).toEqual(["a"]);
  });
});

describe("a mark's basis", () => {
  it("is the seq of the row's newest mark on its surface, 0 for none", async () => {
    const { basisOf } = await import("../src/desk/use-run.ts");
    const marks = [
      { row: "TC1", surface: "web", seq: 3 },
      { row: "TC1", surface: "web", seq: 9 },
      { row: "TC1", surface: "mobile", seq: 12 },
    ];
    const view = { marks } as unknown as Parameters<typeof basisOf>[0];
    expect(basisOf(view, { row: "TC1", surface: "web" })).toBe(9);
    expect(basisOf(view, { row: "TC2", surface: "web" })).toBe(0);
    expect(basisOf(null, { row: "TC1", surface: "web" })).toBe(0);
  });
});
