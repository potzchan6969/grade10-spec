const MAX_YIQ_DELTA = 35215;

/**
 * The box a capture is compared inside: its recorded region kept within the
 * image, or the whole image when none was recorded. Both sides of a diff
 * crop to their own box and align at its top-left corner.
 */
export function anchorOf(region, image) {
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

function boxOf(side) {
  return side.region
    ? `${side.region.x},${side.region.y},${side.region.width},${side.region.height}`
    : "whole";
}

/**
 * A pair's name: both hashes and both recorded boxes. The browser and the
 * coordinator key stored scores by it, so both lowercase the hashes.
 */
export function pairKey(reference, other) {
  return [
    reference.artifact.sha256.toLowerCase(),
    boxOf(reference),
    other.artifact.sha256.toLowerCase(),
    boxOf(other),
  ].join("|");
}

/**
 * What the hashes alone settle: the same bytes cropped to the same recorded
 * box differ nowhere. It trusts no recorded size, so the coordinator may
 * store it.
 */
export function settledByHashes(pair) {
  return pair.reference.artifact.sha256.toLowerCase() ===
    pair.other.artifact.sha256.toLowerCase() &&
    boxOf(pair.reference) === boxOf(pair.other)
    ? { kind: "compared", ratio: 0 }
    : null;
}

/**
 * What the archive's metadata settles for a viewer: the same bytes in boxes
 * of one size differ nowhere, and boxes of another size are never compared.
 * It trusts each artifact's recorded size, so only the reader uses it.
 */
export function settledWithoutPixels(pair) {
  const reference = anchorOf(pair.reference.region, pair.reference.artifact);
  const other = anchorOf(pair.other.region, pair.other.artifact);
  if (reference.width !== other.width || reference.height !== other.height)
    return { kind: "size-mismatch" };
  return pair.reference.artifact.sha256.toLowerCase() ===
    pair.other.artifact.sha256.toLowerCase()
    ? { kind: "compared", ratio: 0 }
    : null;
}

/** The RGBA pixels of `anchor` inside a decoded image. */
export function cropPixels(image, anchor) {
  const out = new Uint8ClampedArray(anchor.width * anchor.height * 4);
  for (let row = 0; row < anchor.height; row += 1) {
    const from = ((anchor.y + row) * image.width + anchor.x) * 4;
    out.set(
      image.data.subarray(from, from + anchor.width * 4),
      row * anchor.width * 4,
    );
  }
  return out;
}

function blend(channel, alpha) {
  return 255 + (channel - 255) * alpha;
}

function yiq(data, offset) {
  const alpha = data[offset + 3] / 255;
  const r = blend(data[offset], alpha);
  const g = blend(data[offset + 1], alpha);
  const b = blend(data[offset + 2], alpha);
  return [
    r * 0.29889531 + g * 0.58662247 + b * 0.11448223,
    r * 0.59597799 - g * 0.2741761 - b * 0.32180189,
    r * 0.21147017 - g * 0.52261711 + b * 0.31114694,
  ];
}

function colorDelta(left, right, offset) {
  const a = yiq(left, offset);
  const b = yiq(right, offset);
  const y = a[0] - b[0];
  const i = a[1] - b[1];
  const q = a[2] - b[2];
  return 0.5053 * y * y + 0.299 * i * i + 0.1957 * q * q;
}

function regionsOf(flagged, columns, rows, cell, width, height) {
  const seen = new Uint8Array(flagged.length);
  const regions = [];
  for (let start = 0; start < flagged.length; start += 1) {
    if (!flagged[start] || seen[start]) continue;
    const stack = [start];
    seen[start] = 1;
    let minColumn = columns;
    let minRow = rows;
    let maxColumn = 0;
    let maxRow = 0;
    while (stack.length > 0) {
      const index = stack.pop();
      const column = index % columns;
      const row = (index - column) / columns;
      minColumn = Math.min(minColumn, column);
      maxColumn = Math.max(maxColumn, column);
      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nextColumn = column + dx;
          const nextRow = row + dy;
          if (
            nextColumn < 0 ||
            nextRow < 0 ||
            nextColumn >= columns ||
            nextRow >= rows
          ) {
            continue;
          }
          const next = nextRow * columns + nextColumn;
          if (flagged[next] && !seen[next]) {
            seen[next] = 1;
            stack.push(next);
          }
        }
      }
    }
    const x = minColumn * cell;
    const y = minRow * cell;
    regions.push({
      x,
      y,
      width: Math.min(width, (maxColumn + 1) * cell) - x,
      height: Math.min(height, (maxRow + 1) * cell) - y,
    });
  }
  return regions;
}

/**
 * Compares two same-size RGBA buffers. Pixels differ when their YIQ colour
 * distance passes `threshold` (0 to 1). Differences are grouped into regions
 * on a coarse grid so a handful of boxes describes where the layouts diverge.
 */
export function diffPixels(
  reference,
  site,
  width,
  height,
  { threshold = 0.1, cell = 16 } = {},
) {
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new TypeError("width and height must be integers");
  }
  if (width <= 0 || height <= 0) {
    throw new RangeError("width and height must be positive");
  }
  const expected = width * height * 4;
  if (reference.length !== expected || site.length !== expected) {
    throw new RangeError("both buffers must hold width x height RGBA pixels");
  }
  const limit = MAX_YIQ_DELTA * threshold * threshold;
  const columns = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell);
  const flagged = new Uint8Array(columns * rows);
  const diff = new Uint8ClampedArray(expected);
  let differing = 0;
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const offset = pixel * 4;
    if (colorDelta(reference, site, offset) > limit) {
      differing += 1;
      const x = pixel % width;
      const y = (pixel - x) / width;
      flagged[Math.floor(y / cell) * columns + Math.floor(x / cell)] = 1;
      diff[offset] = 217;
      diff[offset + 1] = 45;
      diff[offset + 2] = 45;
      diff[offset + 3] = 255;
    } else {
      const gray = yiq(reference, offset)[0];
      const faded = Math.round(255 - (255 - gray) * 0.25);
      diff[offset] = faded;
      diff[offset + 1] = faded;
      diff[offset + 2] = faded;
      diff[offset + 3] = 255;
    }
  }
  return {
    width,
    height,
    differing,
    ratio: differing / (width * height),
    regions: regionsOf(flagged, columns, rows, cell, width, height),
    diff,
  };
}
