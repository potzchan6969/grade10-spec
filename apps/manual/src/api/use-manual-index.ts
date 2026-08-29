import { buildIndex, type ManualIndex } from "./derive";
import { useSnapshotData } from "./snapshot-provider";

/** Derivations are a pure function of the snapshot, cached against it. */
export function useManualIndex(): ManualIndex {
  return buildIndex(useSnapshotData());
}
