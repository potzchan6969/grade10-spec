import { useArtifactReaders } from "./snapshot-provider";
import type { ReferenceDocument } from "./types";
import { type ArtifactState, useArtifact } from "./use-artifact";

export type ReferenceState = ArtifactState<ReferenceDocument>;

/** One reference document, fetched when its page opens. */
export function useReference(slug: string): ReferenceState {
  return useArtifact(useArtifactReaders().reference, slug);
}
