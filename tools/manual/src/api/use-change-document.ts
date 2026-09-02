import { useEffect, useState } from "react";
import { loadChangeDocument } from "./snapshot";
import type { ChangeDocument } from "./types";

export type ChangeDocumentState =
  | { status: "loading" }
  | { status: "ready"; document: ChangeDocument }
  | { status: "unavailable"; reason: string };

/** Lazy, per change: the fetch starts when its page mounts, and the document
 * is kept after. A new id starts over rather than showing the last change's
 * files under this one's title. */
export function useChangeDocument(id: string): ChangeDocumentState {
  const [state, setState] = useState<ChangeDocumentState>({
    status: "loading",
  });

  useEffect(() => {
    let live = true;
    setState({ status: "loading" });
    loadChangeDocument(id)
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
  }, [id]);

  return state;
}
