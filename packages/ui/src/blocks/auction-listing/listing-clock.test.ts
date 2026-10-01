import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ClockProvider,
  type ClockStore,
  createFrameClockStore,
  type FrameClockOptions,
  remainingSeconds,
  useClockNow,
  useClockSelection,
  useClockStore,
  useRemainingSeconds,
} from "../../index";
import { holdSelection } from "./listing-clock";

const publicClockStore: ClockStore | undefined = undefined;
const publicFrameClockOptions: FrameClockOptions | undefined = undefined;
void publicClockStore;
void publicFrameClockOptions;

describe("remainingSeconds", () => {
  it.each([
    [1001, 2],
    [1000, 1],
    [200, 1],
    [1, 1],
    [0, 0],
    [-5000, 0],
  ])("reads %d ms before the deadline as %d", (leftMs, expected) => {
    expect(remainingSeconds(10_000 + leftMs, 10_000)).toBe(expected);
  });
});

describe("the frame clock", () => {
  it("imports and answers a server render without a window", () => {
    expect(typeof globalThis.window).toBe("undefined");
    const store = createFrameClockStore(() => 42_000);

    expect(store.getServerSnapshot()).toBe(42_000);
    expect(store.getSnapshot()).toBe(42_000);
  });

  it("answers a server render from its server snapshot", () => {
    const store = createFrameClockStore(() => 42_000, {
      serverSnapshot: () => 40_000,
    });

    expect(store.getServerSnapshot()).toBe(40_000);
    expect(store.getSnapshot()).toBe(42_000);
  });
});

describe("a held clock selection", () => {
  const sameSecond = (held: { second: number }, next: { second: number }) =>
    held.second === next.second;

  it("answers the held object while equal reads a fresh one the same", () => {
    const held = { current: null };
    const first = holdSelection(held, { second: 1 }, sameSecond);

    expect(holdSelection(held, { second: 1 }, sameSecond)).toBe(first);
    expect(holdSelection(held, { second: 2 }, sameSecond)).not.toBe(first);
  });

  it("answers each fresh object when equal is identity", () => {
    const held = { current: null };
    const first = holdSelection(held, { second: 1 }, Object.is);

    expect(holdSelection(held, { second: 1 }, Object.is)).not.toBe(first);
  });
});

describe("the frame loop", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  function stubVisibleDocument() {
    vi.useFakeTimers();
    vi.stubGlobal("requestAnimationFrame", (run: () => void) =>
      setTimeout(run, 16),
    );
    vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
    vi.stubGlobal("document", {
      visibilityState: "visible",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal("window", {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
  }

  it("reads the clock every frame while subscribed and stops after", () => {
    stubVisibleDocument();
    let nowMs = 1_000;
    const store = createFrameClockStore(() => nowMs);
    const onTick = vi.fn();

    const unsubscribe = store.subscribe(onTick);
    nowMs = 1_016;
    vi.advanceTimersByTime(16);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(store.getSnapshot()).toBe(1_016);

    unsubscribe();
    vi.advanceTimersByTime(160);
    expect(onTick).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("clock public entry", () => {
  it("exports the clock seam from the package entry", () => {
    for (const exported of [
      ClockProvider,
      createFrameClockStore,
      remainingSeconds,
      useClockNow,
      useClockSelection,
      useClockStore,
      useRemainingSeconds,
    ]) {
      expect(exported).toEqual(expect.any(Function));
    }
  });
});
