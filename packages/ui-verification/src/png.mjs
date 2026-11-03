import { inflateSync } from "node:zlib";

// Screenshots are 8-bit, non-interlaced PNGs, so this decodes exactly those
// to RGBA for a stored drift score, as the browser reads them: colour keys
// become transparent. A PNG whose colours the browser would convert (an ICC
// profile, or gamma or chromaticity without sRGB) is refused, as is anything
// else; the browser still compares such a pair itself.

const SIGNATURE = [137, 80, 78, 71, 13, 10, 26, 10];
const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

function uint32(bytes, offset) {
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  );
}

function paeth(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const toLeft = Math.abs(estimate - left);
  const toUp = Math.abs(estimate - up);
  const toUpLeft = Math.abs(estimate - upLeft);
  if (toLeft <= toUp && toLeft <= toUpLeft) return left;
  return toUp <= toUpLeft ? up : upLeft;
}

function unfilter(raw, width, height, channels) {
  const stride = width * channels;
  const pixels = new Uint8Array(stride * height);
  if (raw.length !== (stride + 1) * height)
    throw new Error("PNG image data has the wrong length");
  for (let row = 0; row < height; row += 1) {
    const filter = raw[row * (stride + 1)];
    const source = row * (stride + 1) + 1;
    const target = row * stride;
    const above = target - stride;
    for (let index = 0; index < stride; index += 1) {
      const value = raw[source + index];
      const left = index >= channels ? pixels[target + index - channels] : 0;
      const up = row > 0 ? pixels[above + index] : 0;
      const upLeft =
        row > 0 && index >= channels ? pixels[above + index - channels] : 0;
      let predicted;
      if (filter === 0) predicted = 0;
      else if (filter === 1) predicted = left;
      else if (filter === 2) predicted = up;
      else if (filter === 3) predicted = (left + up) >> 1;
      else if (filter === 4) predicted = paeth(left, up, upLeft);
      else throw new Error(`PNG row filter ${filter} is not valid`);
      pixels[target + index] = (value + predicted) & 0xff;
    }
  }
  return pixels;
}

/** RGBA pixels of an 8-bit, non-interlaced PNG. */
export function decodePng(value) {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  if (SIGNATURE.some((byte, index) => bytes[index] !== byte))
    throw new Error("not a PNG image");
  let offset = SIGNATURE.length;
  let header = null;
  let palette = null;
  let transparency = null;
  const colourChunks = new Set();
  const data = [];
  while (offset + 8 <= bytes.length) {
    const length = uint32(bytes, offset);
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    const body = bytes.subarray(offset + 8, offset + 8 + length);
    if (type === "IHDR") {
      header = {
        width: uint32(body, 0),
        height: uint32(body, 4),
        depth: body[8],
        colorType: body[9],
        interlace: body[12],
      };
    } else if (type === "PLTE") palette = body;
    else if (type === "tRNS") transparency = body;
    else if (["iCCP", "gAMA", "cHRM", "sRGB"].includes(type))
      colourChunks.add(type);
    else if (type === "IDAT") data.push(body);
    else if (type === "IEND") break;
    offset += 12 + length;
  }
  if (!header) throw new Error("PNG has no header");
  const { width, height, depth, colorType, interlace } = header;
  const channels = CHANNELS[colorType];
  if (depth !== 8 || interlace !== 0 || !channels)
    throw new Error(
      `PNG must be 8-bit and non-interlaced, not depth ${depth}, colour type ${colorType}, interlace ${interlace}`,
    );
  if (colorType === 3 && !palette) throw new Error("PNG palette is missing");
  if (
    colourChunks.has("iCCP") ||
    (!colourChunks.has("sRGB") &&
      (colourChunks.has("gAMA") || colourChunks.has("cHRM")))
  )
    throw new Error("PNG carries a colour profile the browser would apply");
  // A grey or RGB colour key names one sample value that is transparent.
  const key =
    transparency && (colorType === 0 || colorType === 2)
      ? colorType === 0
        ? [transparency[1]]
        : [transparency[1], transparency[3], transparency[5]]
      : null;
  const pixels = unfilter(
    inflateSync(Buffer.concat(data.map((chunk) => Buffer.from(chunk)))),
    width,
    height,
    channels,
  );
  const rgba = new Uint8ClampedArray(width * height * 4);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const from = pixel * channels;
    const to = pixel * 4;
    if (colorType === 6) {
      rgba.set(pixels.subarray(from, from + 4), to);
    } else if (colorType === 2) {
      rgba[to] = pixels[from];
      rgba[to + 1] = pixels[from + 1];
      rgba[to + 2] = pixels[from + 2];
      rgba[to + 3] =
        key &&
        pixels[from] === key[0] &&
        pixels[from + 1] === key[1] &&
        pixels[from + 2] === key[2]
          ? 0
          : 255;
    } else if (colorType === 3) {
      const entry = pixels[from];
      rgba[to] = palette[entry * 3];
      rgba[to + 1] = palette[entry * 3 + 1];
      rgba[to + 2] = palette[entry * 3 + 2];
      rgba[to + 3] = transparency?.[entry] ?? 255;
    } else {
      const gray = pixels[from];
      rgba[to] = gray;
      rgba[to + 1] = gray;
      rgba[to + 2] = gray;
      rgba[to + 3] =
        colorType === 4 ? pixels[from + 1] : key && gray === key[0] ? 0 : 255;
    }
  }
  return { width, height, data: rgba };
}
