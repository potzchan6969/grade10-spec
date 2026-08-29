import { describe, expect, it } from "vitest";
import { seek } from "../src/blocks/seek";

/** A schedule and a clock the test drives by hand — no real timing involved. */
function driver(perTurn = 16) {
  const queue: (() => void)[] = [];
  const cancelled: number[] = [];
  let next = 1;
  let clock = 0;
  return {
    cancelled,
    now: () => clock,
    schedule: (tick: () => void) => {
      queue.push(tick);
      return next++;
    },
    cancel: (handle: number) => cancelled.push(handle),
    /** One frame: the clock moves, then what was queued runs. */
    turn: () => {
      clock += perTurn;
      const due = queue.splice(0, queue.length);
      for (const tick of due) tick();
      return due.length;
    },
    pending: () => queue.length,
  };
}

describe("seek", () => {
  it("lands the first time the target exists", () => {
    const drive = driver();
    const landed: string[] = [];
    let appears = 3;

    seek({
      find: () => (appears-- > 0 ? null : "row"),
      land: (found) => landed.push(found),
      schedule: drive.schedule,
      cancel: drive.cancel,
      now: drive.now,
    });

    for (let turn = 0; turn < 3; turn += 1) {
      expect(landed).toEqual([]);
      drive.turn();
    }
    drive.turn();
    expect(landed).toEqual(["row"]);
  });

  it("stops looking once it has landed", () => {
    const drive = driver();
    let looks = 0;

    seek({
      find: () => {
        looks += 1;
        return "row";
      },
      land: () => {},
      schedule: drive.schedule,
      cancel: drive.cancel,
      now: drive.now,
    });

    drive.turn();
    expect(looks).toBe(1);
    expect(drive.pending()).toBe(0);
  });

  it("spends its budget in time, not in frames", () => {
    // The same 100ms budget, on a display that paints twice as often: the same
    // stretch of time, twice the looks. A frame count would have meant half the
    // wait on the faster machine.
    const slow = driver(20);
    const fast = driver(10);
    const looks = { slow: 0, fast: 0 };

    for (const [name, drive] of [
      ["slow", slow],
      ["fast", fast],
    ] as const) {
      seek({
        find: () => {
          looks[name] += 1;
          return null;
        },
        land: () => {},
        schedule: drive.schedule,
        cancel: drive.cancel,
        now: drive.now,
        budget: 100,
      });
      for (let turn = 0; turn < 40; turn += 1) drive.turn();
    }

    expect(looks.slow).toBe(5);
    expect(looks.fast).toBe(10);
    expect(slow.pending()).toBe(0);
    expect(fast.pending()).toBe(0);
  });

  it("gives up when the budget is spent rather than looking forever", () => {
    const drive = driver(16);
    let looks = 0;

    seek({
      find: () => {
        looks += 1;
        return null;
      },
      land: () => {},
      schedule: drive.schedule,
      cancel: drive.cancel,
      now: drive.now,
      budget: 64,
    });

    for (let turn = 0; turn < 20; turn += 1) drive.turn();
    expect(looks).toBe(4);
    expect(drive.pending()).toBe(0);
  });

  it("stops when the caller stops it, and cancels what it queued", () => {
    const drive = driver();
    const landed: string[] = [];

    const stop = seek({
      find: () => "row",
      land: (found) => landed.push(found),
      schedule: drive.schedule,
      cancel: drive.cancel,
      now: drive.now,
    });

    stop();
    stop();
    drive.turn();
    expect(landed).toEqual([]);
    expect(drive.cancelled).toEqual([1]);
  });

  it("a stop after landing cancels nothing — the seek is already over", () => {
    const drive = driver();
    const stop = seek({
      find: () => "row",
      land: () => {},
      schedule: drive.schedule,
      cancel: drive.cancel,
      now: drive.now,
    });

    drive.turn();
    stop();
    expect(drive.cancelled).toEqual([]);
  });
});
