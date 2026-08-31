import { buildIndex, type ManualIndex } from "./derive";
import { useSnapshotData } from "./snapshot-provider";

export function useManualIndex(): ManualIndex {
  return buildIndex(useSnapshotData());
}
