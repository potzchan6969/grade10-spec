import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { STORE_CHANGED } from "./live";
import {
  type ArtifactReaders,
  artifactReaders,
  type LoadedSnapshot,
  loadSnapshot,
} from "./snapshot";
import type { Snapshot } from "./types";

export type SnapshotState =
  | { status: "loading" }
  | ({ status: "ready" } & LoadedSnapshot)
  | { status: "error"; message: string };

const SnapshotContext = createContext<SnapshotState | null>(null);

/** Re-reads the artifacts. The editor calls it after a write, so the page it
 * just saved is the page the app shows. */
const ReloadContext = createContext<() => void>(() => {});

/** The lazy artifacts, as of the current reading. A re-read publishes a new
 * set, which is what makes a page already open ask again rather than keep
 * what it fetched before the edit. A surface with no provider around it — a
 * story, a test — reads from a set of its own. */
const ReadersContext = createContext<ArtifactReaders>(artifactReaders());

export function SnapshotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnapshotState>({ status: "loading" });
  const [readers, setReaders] = useState(artifactReaders);
  // Only the newest load may land, so a reload racing the first one cannot
  // put a stale snapshot on screen.
  const newest = useRef(0);

  const read = useCallback(() => {
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

  const reload = useCallback(() => {
    setReaders(artifactReaders());
    read();
  }, [read]);

  useEffect(() => {
    read();
    return () => {
      newest.current += 1;
    };
  }, [read]);

  // Dev only, and tree-shaken out of the build: the store's files are not
  // modules, so the plugin says on the HMR socket what Vite cannot work out.
  useEffect(() => {
    const hot = import.meta.hot;
    if (!hot) return;
    hot.on(STORE_CHANGED, reload);
    return () => hot.off(STORE_CHANGED, reload);
  }, [reload]);

  return (
    <ReloadContext value={reload}>
      <ReadersContext value={readers}>
        <SnapshotContext value={state}>{children}</SnapshotContext>
      </ReadersContext>
    </ReloadContext>
  );
}

export function useSnapshotReload(): () => void {
  return use(ReloadContext);
}

export function useArtifactReaders(): ArtifactReaders {
  return use(ReadersContext);
}

export function useSnapshot(): SnapshotState {
  const state = useSnapshotIfAny();
  if (!state) {
    throw new Error("useSnapshot must be used within a SnapshotProvider");
  }
  return state;
}

/** For a surface that may render with no provider around it at all — a
 * story, a test — and treats that the same as a snapshot not yet in hand. */
export function useSnapshotIfAny(): SnapshotState | null {
  return use(SnapshotContext);
}

/** For anything the shell renders only once the snapshot is in hand. */
export function useSnapshotData(): Snapshot {
  const state = useSnapshot();
  if (state.status !== "ready") {
    throw new Error(`snapshot is ${state.status}, not ready`);
  }
  return state.snapshot;
}
