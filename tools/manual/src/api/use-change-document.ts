import { loadChangeDocument } from "./snapshot";
import type { ChangeDocument } from "./types";
import { type ArtifactState, useArtifact } from "./use-artifact";

export type ChangeDocumentState = ArtifactState<ChangeDocument>;

/** One change's files, fetched when its page opens. */
export function useChangeDocument(id: string): ChangeDocumentState {
  return useArtifact(loadChangeDocument, id);
}
