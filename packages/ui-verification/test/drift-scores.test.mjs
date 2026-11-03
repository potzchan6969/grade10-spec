import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { deflateSync } from "node:zlib";
import { createArchive } from "../src/archive.mjs";
import {
  createCaptureCoordinator,
  SCORE_ATTEMPTS,
  SCORE_BATCH,
  SCORE_ERROR_RETRY_MS,
} from "../src/capture-coordinator.mjs";
import {
  pairKey,
  pairOf,
  scorePair,
  settledByHashes,
} from "../src/drift-scores.mjs";
import { anchorOf, cropPixels, diffPixels } from "../src/pixel-diff.mjs";
import { decodePng } from "../src/png.mjs";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1)
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}

function paeth(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const a = Math.abs(estimate - left);
  const b = Math.abs(estimate - up);
  const c = Math.abs(estimate - upLeft);
  if (a <= b && a <= c) return left;
  return b <= c ? up : upLeft;
}

/** Encodes raw samples, each row with the next of the five row filters. */
function encode(width, height, colorType, samples, extra = []) {
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  const stride = width * channels;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let row = 0; row < height; row += 1) {
    const filter = row % 5;
    raw[row * (stride + 1)] = filter;
    for (let index = 0; index < stride; index += 1) {
      const at = (column) => samples[row * stride + column];
      const left = index >= channels ? at(index - channels) : 0;
      const up = row > 0 ? samples[(row - 1) * stride + index] : 0;
      const upLeft =
        row > 0 && index >= channels
          ? samples[(row - 1) * stride + index - channels]
          : 0;
      const predicted = [
        0,
        left,
        up,
        (left + up) >> 1,
        paeth(left, up, upLeft),
      ][filter];
      raw[row * (stride + 1) + 1 + index] = (at(index) - predicted) & 0xff;
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = colorType;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    ...extra,
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** An RGBA image of a grey `shade`, with a `mark` square painted over it. */
function rgba(width, height, shade, mark) {
  const samples = new Uint8Array(width * height * 4);
  for (let pixel = 0; pixel < width * height; pixel += 1) {
    const x = pixel % width;
    const y = Math.floor(pixel / width);
    const marked =
      mark &&
      x >= mark.x &&
      x < mark.x + mark.size &&
      y >= mark.y &&
      y < mark.y + mark.size;
    samples.set(
      marked ? [220, 30, 30, 255] : [shade, shade, shade, 255],
      pixel * 4,
    );
  }
  return samples;
}

test("the decoder reads every row filter in RGBA, RGB, grey and palette images", () => {
  const width = 7;
  const height = 6;
  const pixels = rgba(width, height, 90, { x: 2, y: 1, size: 3 });
  assert.deepEqual(
    decodePng(encode(width, height, 6, pixels)).data,
    new Uint8ClampedArray(pixels),
  );

  const rgb = new Uint8Array(width * height * 3);
  for (let pixel = 0; pixel < width * height; pixel += 1)
    rgb.set(pixels.subarray(pixel * 4, pixel * 4 + 3), pixel * 3);
  assert.deepEqual(
    decodePng(encode(width, height, 2, rgb)).data,
    new Uint8ClampedArray(pixels),
  );

  const grey = Uint8Array.from({ length: width * height }, (_, i) => i * 5);
  const decodedGrey = decodePng(encode(width, height, 0, grey)).data;
  assert.deepEqual([...decodedGrey.subarray(4 * 9, 4 * 10)], [45, 45, 45, 255]);

  const palette = chunk("PLTE", Buffer.from([10, 20, 30, 200, 100, 0]));
  const transparency = chunk("tRNS", Buffer.from([255, 128]));
  const indexed = Uint8Array.from({ length: width * height }, (_, i) => i % 2);
  const decodedPalette = decodePng(
    encode(width, height, 3, indexed, [palette, transparency]),
  ).data;
  assert.deepEqual(
    [...decodedPalette.subarray(0, 8)],
    [10, 20, 30, 255, 200, 100, 0, 128],
  );
});

test("the decoder refuses what it cannot read exactly", () => {
  const sixteenBit = encode(2, 2, 6, new Uint8Array(16));
  sixteenBit[24] = 16;
  assert.throws(() => decodePng(sixteenBit), /8-bit/);
  assert.throws(() => decodePng(Buffer.from("not a png")), /not a PNG/);
  const pixels = new Uint8Array(2 * 2 * 3);
  const profiled = encode(2, 2, 2, pixels, [chunk("iCCP", Buffer.from("p"))]);
  assert.throws(() => decodePng(profiled), /colour profile/);
  const gamma = encode(2, 2, 2, pixels, [chunk("gAMA", Buffer.alloc(4))]);
  assert.throws(() => decodePng(gamma), /colour profile/);
  const srgb = encode(2, 2, 2, pixels, [
    chunk("sRGB", Buffer.from([0])),
    chunk("gAMA", Buffer.alloc(4)),
  ]);
  assert.equal(decodePng(srgb).width, 2, "sRGB is what the browser draws");
});

test("a colour key is transparent, as the browser reads it", () => {
  const rgb = Uint8Array.from([1, 2, 3, 9, 9, 9]);
  const key = chunk("tRNS", Buffer.from([0, 1, 0, 2, 0, 3]));
  assert.deepEqual(
    [...decodePng(encode(2, 1, 2, rgb, [key])).data],
    [1, 2, 3, 0, 9, 9, 9, 255],
  );
  const grey = Uint8Array.from([7, 8]);
  const greyKey = chunk("tRNS", Buffer.from([0, 8]));
  assert.deepEqual(
    [...decodePng(encode(2, 1, 0, grey, [greyKey])).data],
    [7, 7, 7, 255, 8, 8, 8, 0],
  );
});

async function archiveWith(t, images) {
  const root = await mkdtemp(join(tmpdir(), "ui-verification-scores-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const archive = createArchive(root);
  const objects = Object.entries(images).map(([name, bytes]) => ({
    key: `ui-verification/scores/${name}.png`,
    bytes,
  }));
  for (const object of objects)
    await archive.putObject(object.key, object.bytes);
  const side = (name, width, height, region) => ({
    artifact: {
      key: `ui-verification/scores/${name}.png`,
      sha256: sha256(images[name]),
      width,
      height,
    },
    ...(region ? { region } : {}),
  });
  return { archive, side };
}

test("a stored score is the ratio the browser's diff gives for the same boxes", async (t) => {
  const width = 40;
  const height = 30;
  const reference = rgba(width, height, 240);
  const site = rgba(width, height, 240, { x: 4, y: 6, size: 5 });
  const { archive, side } = await archiveWith(t, {
    reference: encode(width, height, 6, reference),
    site: encode(width, height, 6, site),
  });
  const region = { x: 2, y: 2, width: 20, height: 20 };
  const pair = pairOf({
    reference: side("reference", width, height, region),
    other: side("site", width, height, region),
  });

  const score = await scorePair(archive, pair);
  const anchor = anchorOf(region, { width, height });
  const expected = diffPixels(
    cropPixels(
      { width, height, data: new Uint8ClampedArray(reference) },
      anchor,
    ),
    cropPixels({ width, height, data: new Uint8ClampedArray(site) }, anchor),
    anchor.width,
    anchor.height,
  );
  assert.equal(score.kind, "compared");
  assert.equal(score.ratio, expected.ratio);
  assert.equal(score.ratio, 25 / 400);
});

test("only the hashes settle a pair; sizes come from the archived images", async (t) => {
  const small = encode(4, 4, 6, rgba(4, 4, 10));
  const other = encode(4, 4, 6, rgba(4, 4, 10, { x: 0, y: 0, size: 1 }));
  const { archive, side } = await archiveWith(t, { one: small, two: other });
  const same = pairOf({
    reference: side("one", 4, 4),
    other: side("one", 4, 4),
  });
  assert.deepEqual(settledByHashes(same), { kind: "compared", ratio: 0 });
  const resized = pairOf({
    reference: side("one", 4, 4, { x: 0, y: 0, width: 2, height: 2 }),
    other: side("one", 4, 4),
  });
  assert.equal(settledByHashes(resized), null, "other boxes need the images");
  assert.deepEqual(await scorePair(archive, resized), {
    kind: "size-mismatch",
  });

  // A client that sends a wrong size cannot make the pair look resized.
  const misreported = pairOf({
    reference: side("one", 4, 4),
    other: side("two", 2, 4),
  });
  assert.deepEqual(await scorePair(archive, misreported), {
    kind: "compared",
    ratio: 1 / 16,
  });

  const lying = pairOf({
    reference: side("one", 4, 4),
    other: {
      artifact: { ...side("one", 4, 4).artifact, sha256: "f".repeat(64) },
    },
  });
  await assert.rejects(scorePair(archive, lying), /does not match its SHA-256/);
  assert.throws(
    () => pairOf({ reference: side("one", 4, 4), other: { artifact: {} } }),
    TypeError,
  );
});

function memoryStorage() {
  const values = new Map();
  return {
    async get(key) {
      return values.get(key);
    },
    async put(key, value) {
      values.set(key, structuredClone(value));
    },
    async delete(key) {
      values.delete(key);
    },
    async list({ prefix = "", startAfter, limit } = {}) {
      return new Map(
        [...values]
          .filter(
            ([key]) =>
              key.startsWith(prefix) &&
              (startAfter === undefined || key > startAfter),
          )
          .sort(([left], [right]) => (left < right ? -1 : 1))
          .slice(0, limit ?? Number.POSITIVE_INFINITY),
      );
    },
  };
}

function coordinatorOver(archive) {
  const alarms = [];
  const clock = { time: Date.parse("2026-11-02T10:00:00.000Z") };
  const coordinator = createCaptureCoordinator({
    storage: memoryStorage(),
    archive,
    now: () => clock.time,
    setAlarm: (time) => alarms.push(time),
    openSession: async () => assert.fail("nothing is captured here"),
  });
  const runAlarms = async () => {
    while (alarms.length > 0) {
      alarms.shift();
      await coordinator.alarm();
    }
  };
  return { coordinator, alarms, runAlarms, clock };
}

test("the reference index fills from the archive, then pages by key, one case or all", async (t) => {
  const { archive } = await archiveWith(t, {});
  const listed = [];
  const references = Array.from({ length: 120 }, (_, index) => ({
    referenceId: `reference-${String(index).padStart(3, "0")}`,
    caseId: `case-${index % 3}`,
    capturedAt: new Date(Date.UTC(2026, 9, 1, 0, index)).toISOString(),
  }));
  const paged = {
    ...archive,
    async listReferences({ cursor, limit }) {
      listed.push(cursor ?? "start");
      const start = cursor ? Number(cursor) : 0;
      const end = start + limit;
      return {
        references: references.slice(start, end),
        ...(end < references.length ? { cursor: String(end) } : {}),
      };
    },
  };
  const { coordinator, alarms, runAlarms } = coordinatorOver(paged);

  assert.equal(await coordinator.listReferences({}), null, "not filled yet");
  assert.equal(alarms.length, 1, "the first read starts the fill");
  await runAlarms();
  assert.deepEqual(listed, ["start", "50", "100"]);

  const first = await coordinator.listReferences({ caseId: "case-1" });
  assert.equal(first.references.length, 40);
  assert.equal(first.cursor, undefined);
  assert.ok(
    first.references.every((item) => item.caseId === "case-1"),
    "one case only",
  );
  const all = await coordinator.listReferences({ limit: 100 });
  assert.equal(all.references.length, 100);
  const rest = await coordinator.listReferences({
    limit: 100,
    cursor: all.cursor,
  });
  assert.equal(rest.references.length, 20);
  assert.equal(rest.cursor, undefined);
  assert.equal(
    new Set(
      [...all.references, ...rest.references].map((item) => item.referenceId),
    ).size,
    120,
    "the pages cover every reference once",
  );
});

test("queued pairs are scored by the alarm a few at a time, and settled ones at once", async (t) => {
  const width = 12;
  const height = 10;
  const images = { base: encode(width, height, 6, rgba(width, height, 200)) };
  for (let index = 0; index < SCORE_BATCH + 2; index += 1)
    images[`moved-${index}`] = encode(
      width,
      height,
      6,
      rgba(width, height, 200, { x: index, y: 1, size: 2 }),
    );
  const { archive, side } = await archiveWith(t, images);
  const { coordinator, alarms, runAlarms } = coordinatorOver(archive);
  const index = await coordinator.listReferences({});
  assert.equal(index, null);
  await runAlarms();

  const moved = Object.keys(images)
    .filter((name) => name.startsWith("moved-"))
    .map((name) => ({
      reference: side("base", width, height),
      other: side(name, width, height),
    }));
  const same = {
    reference: side("base", width, height),
    other: side("base", width, height),
  };
  const result = await coordinator.queueScores({ pairs: [...moved, same] });
  assert.deepEqual(result, { queued: moved.length, settled: 1 });
  assert.equal(alarms.length, 1);

  alarms.length = 0;
  await coordinator.alarm();
  assert.equal(alarms.length, 1, "pairs remain, so it wakes again");
  assert.equal(
    (await coordinator.scoreCounts()).queued,
    moved.length - SCORE_BATCH,
  );
  await runAlarms();
  assert.deepEqual(await coordinator.scoreCounts(), {
    stored: moved.length + 1,
    queued: 0,
  });
  const key = pairKey(pairOf(moved[0]).reference, pairOf(moved[0]).other);
  const { scores } = await coordinator.readScores({ keys: [key, "absent"] });
  assert.deepEqual(Object.keys(scores), [key], "only what was asked for");
  assert.equal(scores[key].kind, "compared");
  assert.equal(scores[key].ratio, 4 / (width * height));

  assert.deepEqual(
    await coordinator.queueScores({ pairs: [moved[0], same] }),
    { queued: 0, settled: 0 },
    "a scored pair is never queued again",
  );
  await assert.rejects(coordinator.queueScores({ pairs: [] }), TypeError);
});

test("the API serves stored scores, queues pairs for a person, and lists references from the index", async (t) => {
  const { createArchiveHandler } = await import("../src/archive-api.mjs");
  const bytes = encode(4, 4, 6, rgba(4, 4, 10));
  const { archive, side } = await archiveWith(t, { one: bytes });
  const { coordinator, runAlarms } = coordinatorOver(archive);
  const person = { kind: "human", reviewer: { subject: "designer" } };
  const handlerAs = (identity) =>
    createArchiveHandler(archive, {
      coordinator,
      authorize: async () => identity,
    });
  const request = (path, init) =>
    new Request(`http://127.0.0.1:6006${path}`, init);
  const queue = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pairs: [{ reference: side("one", 4, 4), other: side("one", 4, 4) }],
    }),
  };

  const refused = await handlerAs({ kind: "publisher" })(
    request("/api/scores", queue),
  );
  assert.equal(refused.status, 401, "only a signed-in person queues scores");
  const queued = await handlerAs(person)(request("/api/scores", queue));
  assert.equal(queued.status, 202);
  assert.deepEqual(await queued.json(), { queued: 0, settled: 1 });
  const key = pairKey(side("one", 4, 4), side("one", 4, 4));
  const read = await handlerAs({ kind: "publisher" })(
    request("/api/scores/read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: [key] }),
    }),
  );
  assert.equal(read.status, 200, "reading scores is a read");
  assert.equal((await read.json()).scores[key].ratio, 0);

  const before = await handlerAs(person)(request("/api/references"));
  assert.deepEqual((await before.json()).references, [], "the archive answers");
  await runAlarms();
  await coordinator.queueScores({
    pairs: [{ reference: side("one", 4, 4), other: side("one", 4, 4) }],
  });
  const indexed = await coordinator.listReferences({});
  assert.deepEqual(indexed, { references: [] }, "the index is filled");
});

test("a failing pair is tried again before its failure is stored, and again once it expires", async (t) => {
  const width = 6;
  const height = 6;
  const { archive, side } = await archiveWith(t, {
    base: encode(width, height, 6, rgba(width, height, 50)),
    moved: encode(
      width,
      height,
      6,
      rgba(width, height, 50, { x: 1, y: 1, size: 1 }),
    ),
  });
  let failures = SCORE_ATTEMPTS - 1;
  const flaky = {
    ...archive,
    async getObject(key) {
      if (failures > 0) {
        failures -= 1;
        throw new Error("R2 timed out");
      }
      return archive.getObject(key);
    },
  };
  const pair = {
    reference: side("base", width, height),
    other: side("moved", width, height),
  };
  const key = pairKey(pairOf(pair).reference, pairOf(pair).other);
  const passing = coordinatorOver(flaky);
  await passing.coordinator.listReferences({});
  await passing.runAlarms();
  await passing.coordinator.queueScores({ pairs: [pair] });
  await passing.runAlarms();
  const retried = await passing.coordinator.readScores({ keys: [key] });
  assert.equal(
    retried.scores[key].kind,
    "compared",
    "a passing hiccup is retried",
  );

  const broken = {
    ...archive,
    getObject: async () => {
      throw new Error("gone");
    },
  };
  const { coordinator, runAlarms, clock } = coordinatorOver(broken);
  await coordinator.listReferences({});
  await runAlarms();
  await coordinator.queueScores({ pairs: [pair] });
  await runAlarms();
  const { scores } = await coordinator.readScores({ keys: [key] });
  assert.equal(scores[key].kind, "error");
  assert.deepEqual(
    await coordinator.queueScores({ pairs: [pair] }),
    { queued: 0, settled: 0 },
    "a fresh failure waits",
  );
  clock.time += SCORE_ERROR_RETRY_MS;
  assert.deepEqual(
    await coordinator.queueScores({ pairs: [pair] }),
    { queued: 1, settled: 0 },
    "an expired failure is tried again",
  );
});
