import { sha256 } from "./archive.mjs";
import {
  anchorOf,
  cropPixels,
  diffPixels,
  pairKey,
  settledByHashes,
} from "./pixel-diff.mjs";
import { decodePng } from "./png.mjs";

export { pairKey, settledByHashes };

// A drift score is how much of one box differs between two archived images.
// Both images are named by their SHA-256, so a score never goes stale: the
// coordinator stores it once by the pair's key, and the dashboard ranks by
// it without downloading either image. Diff images are never stored.

const HASH = /^[a-f0-9]{64}$/i;
/** Pairs one request may queue; a dashboard asks for its visible rows. */
export const SCORE_QUEUE_LIMIT = 500;

function count(value, path, minimum) {
  if (!Number.isInteger(value) || value < minimum)
    throw new TypeError(`${path} must be an integer of at least ${minimum}`);
  return value;
}

function sideOf(value, path) {
  const artifact = value?.artifact;
  if (
    typeof artifact?.key !== "string" ||
    artifact.key.length === 0 ||
    artifact.key.length > 512
  )
    throw new TypeError(`${path}.artifact.key must be an archive key`);
  if (typeof artifact.sha256 !== "string" || !HASH.test(artifact.sha256))
    throw new TypeError(`${path}.artifact.sha256 must be a SHA-256 digest`);
  const side = {
    artifact: {
      key: artifact.key,
      sha256: artifact.sha256.toLowerCase(),
      width: count(artifact.width, `${path}.artifact.width`, 1),
      height: count(artifact.height, `${path}.artifact.height`, 1),
    },
  };
  if (value.region !== undefined && value.region !== null) {
    side.region = {
      x: count(value.region.x, `${path}.region.x`, 0),
      y: count(value.region.y, `${path}.region.y`, 0),
      width: count(value.region.width, `${path}.region.width`, 1),
      height: count(value.region.height, `${path}.region.height`, 1),
    };
  }
  return side;
}

/** A pair a client asks to score, checked field by field. */
export function pairOf(value, path = "pair") {
  return {
    reference: sideOf(value?.reference, `${path}.reference`),
    other: sideOf(value?.other, `${path}.other`),
  };
}

async function pixelsOf(archive, side) {
  const bytes = await archive.getObject(side.artifact.key);
  if (!bytes) throw new Error(`image ${side.artifact.key} was not found`);
  if ((await sha256(bytes)) !== side.artifact.sha256)
    throw new Error(`image ${side.artifact.key} does not match its SHA-256`);
  const image = decodePng(bytes);
  return { image, anchor: anchorOf(side.region, image) };
}

/**
 * The pair's score, as the browser would work it out. Box sizes come from the
 * decoded images, never from the sizes a client sent, so a stored score is
 * only ever what the archived bytes say.
 */
export async function scorePair(archive, pair) {
  const settled = settledByHashes(pair);
  if (settled) return settled;
  const [reference, other] = await Promise.all([
    pixelsOf(archive, pair.reference),
    pixelsOf(archive, pair.other),
  ]);
  if (
    reference.anchor.width !== other.anchor.width ||
    reference.anchor.height !== other.anchor.height
  )
    return { kind: "size-mismatch" };
  const { ratio } = diffPixels(
    cropPixels(reference.image, reference.anchor),
    cropPixels(other.image, other.anchor),
    reference.anchor.width,
    reference.anchor.height,
  );
  return { kind: "compared", ratio };
}
