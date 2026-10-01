import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

/** A clock in epoch milliseconds. The app supplies server time; stories a fake. */
type ClockStore = {
  subscribe(onTick: () => void): () => void;
  getSnapshot(): number;
  getServerSnapshot(): number;
};

/** Whole seconds left, rounded up: a countdown reads 0 only once the deadline has passed. */
function remainingSeconds(deadlineMs: number, nowMs: number): number {
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000));
}

type FrameClockOptions = {
  /** What a server render and hydration read; defaults to `readNow`. */
  serverSnapshot?: () => number;
};

/**
 * One `requestAnimationFrame` loop on `readNow`, running only while something
 * subscribes and the document is visible. It touches no browser global until
 * the first subscribe, so a server render can import and read it.
 */
function createFrameClockStore(
  readNow: () => number = () => Date.now(),
  { serverSnapshot = readNow }: FrameClockOptions = {},
): ClockStore {
  const listeners = new Set<() => void>();
  let now = readNow();
  let frame = 0;

  const emit = () => {
    now = readNow();
    for (const listener of [...listeners]) listener();
  };

  const stop = () => {
    if (frame !== 0) cancelAnimationFrame(frame);
    frame = 0;
  };

  const run = () => {
    if (frame !== 0 || listeners.size === 0) return;
    if (document.visibilityState !== "visible") return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      emit();
      run();
    });
  };

  const onVisibility = () => {
    if (document.visibilityState !== "visible") {
      stop();
      return;
    }
    emit();
    run();
  };

  const onPageShow = () => {
    emit();
    run();
  };

  return {
    subscribe(onTick) {
      listeners.add(onTick);
      if (listeners.size === 1) {
        now = readNow();
        document.addEventListener("visibilitychange", onVisibility);
        window.addEventListener("pageshow", onPageShow);
        run();
      }
      return () => {
        listeners.delete(onTick);
        if (listeners.size > 0) return;
        stop();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pageshow", onPageShow);
      };
    },
    getSnapshot() {
      if (listeners.size === 0) now = readNow();
      return now;
    },
    getServerSnapshot: serverSnapshot,
  };
}

const ClockContext = createContext<ClockStore | null>(null);

let deviceClock: ClockStore | null = null;

function ClockProvider({
  store,
  children,
}: {
  store: ClockStore;
  children: ReactNode;
}) {
  return <ClockContext value={store}>{children}</ClockContext>;
}

/** The provided clock, or a frame loop on `Date.now()` where none is provided. */
function useClockStore(): ClockStore {
  const provided = useContext(ClockContext);
  if (provided != null) return provided;
  deviceClock ??= createFrameClockStore();
  return deviceClock;
}

const idle = () => () => undefined;

/** Re-renders only when `select` answers a different value. */
function useClockSelection<T>(
  select: (nowMs: number) => T,
  active: boolean,
): T {
  const store = useClockStore();
  const subscribe = useCallback(
    (onTick: () => void) => store.subscribe(onTick),
    [store],
  );
  return useSyncExternalStore(
    active ? subscribe : idle,
    () => select(store.getSnapshot()),
    () => select(store.getServerSnapshot()),
  );
}

/** Seconds left to `deadlineMs`, rounded up; null with no deadline, which subscribes to nothing. */
function useRemainingSeconds(deadlineMs: number | null): number | null {
  return useClockSelection(
    (nowMs) =>
      deadlineMs == null ? null : remainingSeconds(deadlineMs, nowMs),
    deadlineMs != null,
  );
}

/** The clock floored to `unitMs`, for displays that change by the minute or the quarter. */
function useClockNow(unitMs: number): number {
  return useClockSelection(
    (nowMs) => Math.floor(nowMs / unitMs) * unitMs,
    true,
  );
}

export type { ClockStore, FrameClockOptions };
export {
  ClockProvider,
  createFrameClockStore,
  remainingSeconds,
  useClockNow,
  useClockStore,
  useRemainingSeconds,
};
