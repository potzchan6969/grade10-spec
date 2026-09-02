import { useArtifactReaders } from "./snapshot-provider";
import type { ChangeDocument } from "./types";
import { type ArtifactState, useArtifact } from "./use-artifact";

export type ChangeDocumentState = ArtifactState<ChangeDocument>;

/** One change's files, fetched when its page opens. */
export function useChangeDocument(id: string): ChangeDocumentState {
  return useArtifact(useArtifactReaders().change, id);
}
