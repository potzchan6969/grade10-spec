import type { ImageRegion } from "@grade10/ui-verification/model";
import { diffPixels } from "@grade10/ui-verification/pixel-diff";

export interface PixelSize {
  width: number;
  height: number;
}

export type PixelComparison =
  | {
      kind: "compared";
      size: PixelSize;
      ratio: number;
      differing: number;
      regions: ImageRegion[];
      diffUrl: string;
    }
  | { kind: "size-mismatch"; reference: PixelSize; site: PixelSize }
  | { kind: "error"; message: string };

interface Cropped {
  data: Uint8ClampedArray;
  size: PixelSize;
}

// The anchor is the component box: the recorded region when there is one,
// otherwise the whole image. Both sides are cropped to their own anchor and
// aligned at its top-left corner, so unrelated page chrome cannot move the diff.
export function anchorOf(
  region: ImageRegion | undefined,
  image: PixelSize,
): ImageRegion {
  if (!region) return { x: 0, y: 0, width: image.width, height: image.height };
  const x = Math.max(0, Math.min(region.x, image.width - 1));
  const y = Math.max(0, Math.min(region.y, image.height - 1));
  return {
    x,
    y,
    width: Math.max(1, Math.min(region.width, image.width - x)),
    height: Math.max(1, Math.min(region.height, image.height - y)),
  };
}

export function describeAnchor(
  region: ImageRegion | undefined,
  image: PixelSize,
): string {
  const anchor = anchorOf(region, image);
  return `${anchor.x},${anchor.y} · ${anchor.width}×${anchor.height}`;
}

async function crop(
  url: string,
  region: ImageRegion | undefined,
): Promise<Cropped> {
  const response = await fetch(url);
  const bitmap = await createImageBitmap(await response.blob());
  try {
    const anchor = anchorOf(region, bitmap);
    const canvas = document.createElement("canvas");
    canvas.width = anchor.width;
    canvas.height = anchor.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("This browser cannot read image pixels.");
    context.drawImage(
      bitmap,
      anchor.x,
      anchor.y,
      anchor.width,
      anchor.height,
      0,
      0,
      anchor.width,
      anchor.height,
    );
    return {
      data: context.getImageData(0, 0, anchor.width, anchor.height).data,
      size: { width: anchor.width, height: anchor.height },
    };
  } finally {
    bitmap.close();
  }
}

export async function comparePixels(input: {
  referenceUrl: string;
  siteUrl: string;
  referenceRegion?: ImageRegion;
  siteRegion?: ImageRegion;
}): Promise<PixelComparison> {
  try {
    const [reference, site] = await Promise.all([
      crop(input.referenceUrl, input.referenceRegion),
      crop(input.siteUrl, input.siteRegion),
    ]);
    if (
      reference.size.width !== site.size.width ||
      reference.size.height !== site.size.height
    ) {
      return {
        kind: "size-mismatch",
        reference: reference.size,
        site: site.size,
      };
    }
    const { width, height } = reference.size;
    const result = diffPixels(reference.data, site.data, width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This browser cannot draw the diff image.");
    context.putImageData(
      new ImageData(new Uint8ClampedArray(result.diff), width, height),
      0,
      0,
    );
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (value) =>
          value ? resolve(value) : reject(new Error("The diff image failed.")),
        "image/png",
      ),
    );
    return {
      kind: "compared",
      size: { width, height },
      ratio: result.ratio,
      differing: result.differing,
      regions: result.regions,
      diffUrl: URL.createObjectURL(blob),
    };
  } catch (error) {
    return {
      kind: "error",
      message:
        error instanceof Error ? error.message : "The comparison failed.",
    };
  }
}
