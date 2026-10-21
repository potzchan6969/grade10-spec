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
