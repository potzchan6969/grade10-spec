import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type LoadedSnapshot, loadSnapshot } from "./snapshot";
import type { Snapshot } from "./types";

export type SnapshotState =
  | { status: "loading" }
  | ({ status: "ready" } & LoadedSnapshot)
  | { status: "error"; message: string };

const SnapshotContext = createContext<SnapshotState | null>(null);

/** Re-reads the artifacts. The editor calls it after a write, so the page it
 * just saved is the page the app shows. */
const ReloadContext = createContext<() => void>(() => {});

export function SnapshotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnapshotState>({ status: "loading" });
  // Only the newest load may land, so a reload racing the first one cannot
  // put a stale snapshot on screen.
  const newest = useRef(0);

  const reload = useCallback(() => {
    newest.current += 1;
    const mine = newest.current;
    loadSnapshot()
      .then((loaded) => {
        if (newest.current === mine) setState({ status: "ready", ...loaded });
      })
      .catch((cause: unknown) => {
        const message = cause instanceof Error ? cause.message : String(cause);
        console.error("snapshot unavailable", cause);
        if (newest.current === mine) setState({ status: "error", message });
      });
  }, []);

  useEffect(() => {
    reload();
    return () => {
      newest.current += 1;
    };
  }, [reload]);

  return (
    <ReloadContext value={reload}>
      <SnapshotContext value={state}>{children}</SnapshotContext>
    </ReloadContext>
  );
}

export function useSnapshotReload(): () => void {
  return use(ReloadContext);
}

export function useSnapshot(): SnapshotState {
  const state = use(SnapshotContext);
  if (!state) {
    throw new Error("useSnapshot must be used within a SnapshotProvider");
  }
  return state;
}

/** For anything the shell renders only once the snapshot is in hand. */
export function useSnapshotData(): Snapshot {
  const state = useSnapshot();
  if (state.status !== "ready") {
    throw new Error(`snapshot is ${state.status}, not ready`);
  }
  return state.snapshot;
}
