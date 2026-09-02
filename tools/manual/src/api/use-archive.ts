import { useEffect, useState } from "react";
import { useArtifactReaders } from "./snapshot-provider";
import type { Archive } from "./types";

export type ArchiveState =
  | { status: "loading" }
  | { status: "ready"; archive: Archive }
  | { status: "unavailable"; reason: string };

/** Lazy: the fetch starts when a timeline first mounts, and is cached until
 * the store is read again. */
export function useArchive(enabled = true): ArchiveState {
  const [state, setState] = useState<ArchiveState>({ status: "loading" });
  const load = useArtifactReaders().archive;

  useEffect(() => {
    if (!enabled) return;
    let live = true;
    load()
      .then((archive) => {
        if (live) setState({ status: "ready", archive });
      })
      .catch((cause: unknown) => {
        if (!live) return;
        setState({
          status: "unavailable",
          reason: cause instanceof Error ? cause.message : String(cause),
        });
      });
    return () => {
      live = false;
    };
  }, [enabled, load]);

  return state;
}
