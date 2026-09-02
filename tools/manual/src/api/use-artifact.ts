import { useEffect, useState } from "react";

export type ArtifactState<T> =
  | { status: "loading" }
  | { status: "ready"; document: T }
  | { status: "unavailable"; reason: string };

/** Lazy, per id: the fetch starts when the page mounts, and the artifact is
 * kept after. A new id — or a new reading of the store — starts over rather
 * than showing what was fetched before under this title. */
export function useArtifact<T>(
  load: (id: string) => Promise<T>,
  id: string,
): ArtifactState<T> {
  const [state, setState] = useState<ArtifactState<T>>({ status: "loading" });

  useEffect(() => {
    let live = true;
    setState({ status: "loading" });
    load(id)
      .then((document) => {
        if (live) setState({ status: "ready", document });
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
  }, [load, id]);

  return state;
}
