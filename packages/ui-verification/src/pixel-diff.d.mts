export interface PixelRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PixelDiff {
  width: number;
  height: number;
  differing: number;
  ratio: number;
  regions: PixelRegion[];
  diff: Uint8ClampedArray;
}

export interface PixelDiffOptions {
  threshold?: number;
  cell?: number;
}

export function diffPixels(
  reference: Uint8ClampedArray,
  site: Uint8ClampedArray,
  width: number,
  height: number,
  options?: PixelDiffOptions,
): PixelDiff;

export interface PixelImage {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export function anchorOf(
  region: PixelRegion | undefined,
  image: { width: number; height: number },
): PixelRegion;

export function cropPixels(
  image: PixelImage,
  anchor: PixelRegion,
): Uint8ClampedArray;

export interface PairSideLike {
  artifact: { sha256: string; width: number; height: number };
  region?: PixelRegion;
}

export interface PairLike {
  /** A pair may carry its own key; the rules here do not read it. */
  key?: string;
  reference: PairSideLike;
  other: PairSideLike;
}

export type SettledPair =
  | { kind: "compared"; ratio: number }
  | { kind: "size-mismatch" };

export function pairKey(reference: PairSideLike, other: PairSideLike): string;

export function settledByHashes(pair: PairLike): SettledPair | null;

export function settledWithoutPixels(pair: PairLike): SettledPair | null;
