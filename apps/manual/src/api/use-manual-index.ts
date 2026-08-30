import { snapshotWithDrafts, useDrafts } from "../editor/drafts";
import { useEditorSession } from "../editor/session";
import { buildIndex, type ManualIndex } from "./derive";
import { useSnapshotData } from "./snapshot-provider";

/**
 * Derivations are a pure function of the snapshot, cached against it — and a
 * staged draft is part of that snapshot while it is staged. One overlay here
 * is why a page with a draft reads, searches, navigates and validates as its
 * draft everywhere, without a single page knowing drafts exist.
 *
 * Only a session that could push sees the overlay: without one there is no
 * draft marker and no pending bar, and a leftover draft must not wear the
 * committed page's face. The drafts stay held for the token's return.
 */
export function useManualIndex(): ManualIndex {
  const snapshot = useSnapshotData();
  const drafts = useDrafts();
  const { store } = useEditorSession();
  const overlaid = store?.push
    ? snapshotWithDrafts(snapshot, drafts)
    : snapshot;
  return buildIndex(overlaid);
}
