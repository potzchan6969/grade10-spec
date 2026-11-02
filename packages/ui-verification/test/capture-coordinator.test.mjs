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
  FOCUSED_TARGET_LIMIT,
  FULL_BATCH_SHOTS,
  FULL_INTERVAL_MS,
} from "../src/capture-coordinator.mjs";
import { PROFILES } from "../src/model.mjs";

const HOUR = 60 * 60 * 1000;
const BASE_URL = "http://127.0.0.1:6006/";
const DESIGNER = { subject: "designer", email: "designer@example.com" };

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

function png(width, height, shade = 0) {
  const stride = width * 4 + 1;
  const data = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1)
    data.fill(
      Buffer.from([shade, shade, shade, 255]),
      y * stride + 1,
      (y + 1) * stride,
    );
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(data)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

// A site run that declares `count` cases, so the coordinator has cases to
// capture.
async function publishRun(archive, runId, count) {
  const catalogue = [];
  const captures = [];
  const objects = [];
  for (let index = 0; index < count; index += 1) {
    const identity = {
      caseId: `case-${index}`,
      targetId: "site",
      capturePointId: "default",
    };
    catalogue.push({
      schemaVersion: 1,
      ...identity,
      storyId: `story-${index}`,
      label: `Story ${index}`,
      scoreProfile: "desktop",
      recipe: { path: "/" },
      reference: { storyId: `story-${index}`, selector: "main" },
      status: "active",
    });
    for (const [profileId, size] of Object.entries(PROFILES)) {
      const bytes = png(size.width, size.height, index);
      const key = `ui-verification/${runId}/${index}/${profileId}-site.png`;
      const referenceBytes = png(size.width, size.height, index + 100);
      const referenceKey = `ui-verification/${runId}/${index}/${profileId}-reference.png`;
      objects.push(
        { key, bytes },
        { key: referenceKey, bytes: referenceBytes },
      );
      captures.push({
        ...identity,
        profileId,
        status: "captured",
        inputFingerprint: "c".repeat(64),
        provenance: {
          verified: true,
          appCommit: "a".repeat(40),
          referenceCommit: "b".repeat(40),
          capturedAt: "2026-10-29T09:00:00.000Z",
        },
        site: { key, sha256: sha256(bytes), ...size },
        reference: {
          key: referenceKey,
          sha256: sha256(referenceBytes),
          ...size,
        },
      });
    }
  }
  await archive.publish(
    {
      schemaVersion: 1,
      runId,
      createdAt: "2026-10-29T09:00:00.000Z",
      checkpoint: {
        app: { ref: "main", commit: "a".repeat(40) },
        reference: { ref: "main", commit: "b".repeat(40) },
      },
      catalogue,
      captures,
    },
    objects,
  );
}

function memoryStorage() {
  const values = new Map();
  return {
    values,
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

async function setup(t, { cases = 2, failOn, commits } = {}) {
  const root = await mkdtemp(join(tmpdir(), "ui-verification-coordinator-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const archive = createArchive(root);
  await publishRun(archive, "run-site", cases);
  const clock = { time: Date.parse("2026-10-29T10:00:00.000Z") };
  const alarms = [];
  const shots = [];
  let receipt = 0;
  let ids = 0;
  const coordinator = createCaptureCoordinator({
    storage: memoryStorage(),
    archive,
    now: () => clock.time,
    newId: () => {
      ids += 1;
      return `id-${ids}`;
    },
    setAlarm: (time) => alarms.push(time),
    openSession: async () => ({
      browser: "chromium test",
      async provenance() {
        const list = commits ?? ["b".repeat(40)];
        const commit = list[Math.min(receipt, list.length - 1)];
        receipt += 1;
        return { commit, ref: "deploy", verified: true };
      },
      async shoot(shot) {
        shots.push(shot);
        if (failOn?.(shot)) throw new Error(`could not render ${shot.storyId}`);
        const size = PROFILES[shot.profileId];
        return {
          bytes: png(size.width, size.height, shots.length % 200),
          region: { x: 0, y: 0, width: 100, height: 50 },
        };
      },
      async close() {},
    }),
  });
  return { archive, coordinator, clock, alarms, shots };
}

async function runAlarms({ coordinator, alarms, clock }) {
  while (alarms.length > 0) {
    const time = alarms.shift();
    clock.time = Math.max(clock.time, time);
    await coordinator.alarm();
  }
}

test("a full capture runs at once, in batches, and records every shot", async (t) => {
  const env = await setup(t, { cases: 4 });
  const started = await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "publisher" },
    baseURL: BASE_URL,
  });
  assert.equal(started.state, "started");
  await env.coordinator.alarm();
  const midway = (await env.coordinator.status()).runs[0];
  assert.equal(midway.state, "running");
  assert.equal(midway.total, 4 * 3);
  assert.equal(midway.done, FULL_BATCH_SHOTS, "one alarm takes one batch");
  await runAlarms(env);
  const [run] = (await env.coordinator.status()).runs;
  assert.equal(run.state, "succeeded");
  assert.equal(run.done, 12);
  assert.equal(run.commit, "b".repeat(40));
  assert.equal((await env.archive.listReferences()).references.length, 12);
  assert.equal(
    (await env.archive.listReferenceRuns()).runs[0].runId,
    run.runId,
    "the archive keeps the finished run",
  );
});

test("requests inside six hours wait in one pending slot, keeping the newest", async (t) => {
  const env = await setup(t, { cases: 1 });
  await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "publisher" },
    baseURL: BASE_URL,
  });
  await runAlarms(env);
  env.clock.time += HOUR;
  const first = await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "publisher" },
    baseURL: BASE_URL,
  });
  assert.equal(first.state, "scheduled");
  const second = await env.coordinator.requestFull({
    trigger: "manual",
    person: DESIGNER,
    baseURL: BASE_URL,
  });
  assert.equal(second.startsAt, first.startsAt, "the window does not move");
  const { schedule } = await env.coordinator.status();
  assert.equal(schedule.pending.trigger, "manual");
  assert.equal(
    Date.parse(schedule.nextFullAt) - Date.parse(schedule.lastFullStartedAt),
    FULL_INTERVAL_MS,
  );
  env.alarms.length = 0;
  env.clock.time = Date.parse(schedule.nextFullAt) - 1;
  await env.coordinator.alarm();
  assert.equal(
    (await env.coordinator.status()).runs.length,
    1,
    "nothing starts before the window opens",
  );
  env.clock.time += 1;
  await env.coordinator.alarm();
  await runAlarms(env);
  const runs = (await env.coordinator.status()).runs;
  assert.equal(runs.length, 2);
  assert.equal(runs[0].trigger, "manual");
  assert.equal(runs[0].state, "succeeded");
});

test("a redeploy during a full run fails it rather than mixing commits", async (t) => {
  const env = await setup(t, {
    cases: 4,
    commits: ["b".repeat(40), "d".repeat(40)],
  });
  await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "publisher" },
    baseURL: BASE_URL,
  });
  await runAlarms(env);
  const [run] = (await env.coordinator.status()).runs;
  assert.equal(run.state, "failed");
  assert.match(run.message, /moved to d{40}/);
  assert.equal(run.done, FULL_BATCH_SHOTS);
});

test("a full run keeps going past a failed shot and names it", async (t) => {
  const env = await setup(t, {
    cases: 2,
    failOn: (shot) => shot.storyId === "story-1" && shot.profileId === "mobile",
  });
  await env.coordinator.requestFull({
    trigger: "manual",
    person: DESIGNER,
    baseURL: BASE_URL,
  });
  await runAlarms(env);
  const [run] = (await env.coordinator.status()).runs;
  assert.equal(run.state, "failed");
  assert.equal(run.done, 5);
  assert.deepEqual(
    run.failures.map(({ caseId, profileId }) => [caseId, profileId]),
    [["case-1", "mobile"]],
  );
});

test("a focused capture runs at once, inside the throttle, and approves every size", async (t) => {
  const env = await setup(t, { cases: 2 });
  await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "publisher" },
    baseURL: BASE_URL,
  });
  const result = await env.coordinator.captureFocused({
    targets: [
      {
        sourceRunId: "run-site",
        caseId: "case-0",
        targetId: "site",
        capturePointId: "default",
      },
    ],
    locale: "zh-Hant",
    approve: true,
    person: DESIGNER,
    baseURL: BASE_URL,
  });
  assert.equal(result.run.lane, "focused");
  assert.equal(result.run.state, "succeeded");
  assert.deepEqual(
    result.references.map((item) => item.profileId),
    ["desktop", "tablet", "mobile"],
  );
  assert.equal(result.references[0].locale, "zh-Hant");
  assert.equal(result.approvals.length, 3);
  const { approvals } = await env.coordinator.listApprovals({
    caseId: "case-0",
  });
  assert.equal(approvals.length, 3);
  assert.equal(approvals[0].approver.email, "designer@example.com");
});

test("a focused capture stores nothing unless every size captured", async (t) => {
  const env = await setup(t, {
    cases: 1,
    failOn: (shot) => shot.profileId === "mobile",
  });
  await assert.rejects(
    env.coordinator.captureFocused({
      targets: [
        {
          sourceRunId: "run-site",
          caseId: "case-0",
          targetId: "site",
          capturePointId: "default",
        },
      ],
      locale: "en",
      approve: true,
      person: DESIGNER,
      baseURL: BASE_URL,
    }),
    (error) => error.code === "CAPTURE_FAILED",
  );
  assert.equal((await env.archive.listReferences()).references.length, 0);
  assert.equal(
    (await env.coordinator.listApprovals({ caseId: "case-0" })).approvals
      .length,
    0,
  );
  assert.equal((await env.coordinator.status()).runs[0].state, "failed");
});

test("a focused capture covers a few stories only", async (t) => {
  const env = await setup(t, { cases: 1 });
  const target = {
    sourceRunId: "run-site",
    caseId: "case-0",
    targetId: "site",
    capturePointId: "default",
  };
  await assert.rejects(
    env.coordinator.captureFocused({
      targets: Array.from({ length: FOCUSED_TARGET_LIMIT + 1 }, () => target),
      locale: "en",
      person: DESIGNER,
      baseURL: BASE_URL,
    }),
    /1 to 5 stories/,
  );
});

test("an approval needs a captured reference, and a change request a comment", async (t) => {
  const env = await setup(t, { cases: 1 });
  const { references } = await env.coordinator.captureFocused({
    targets: [
      {
        sourceRunId: "run-site",
        caseId: "case-0",
        targetId: "site",
        capturePointId: "default",
      },
    ],
    locale: "en",
    person: DESIGNER,
    baseURL: BASE_URL,
  });
  await assert.rejects(
    env.coordinator.createApproval(
      { referenceId: references[0].referenceId, decision: "changes-requested" },
      DESIGNER,
    ),
    /comment is required/,
  );
  await assert.rejects(
    env.coordinator.createApproval(
      { referenceId: "reference-missing", decision: "approved" },
      DESIGNER,
    ),
    /was not found/,
  );
  const approval = await env.coordinator.createApproval(
    {
      referenceId: references[0].referenceId,
      decision: "changes-requested",
      comment: "Heading moved",
    },
    DESIGNER,
  );
  assert.equal(approval.referenceHash, references[0].image.sha256);
  await assert.rejects(
    env.coordinator.createApproval(
      { referenceId: references[0].referenceId, decision: "approved" },
      undefined,
    ),
    /signed-in person/,
  );
});

test("a new deployed commit asks for one full capture, and the same commit asks for none", async (t) => {
  const env = await setup(t, { cases: 1 });
  const first = await env.coordinator.noticeDeploy({
    commit: "b".repeat(40),
    baseURL: BASE_URL,
  });
  assert.equal(first.state, "started");
  assert.equal(first.run.trigger, "deploy");
  assert.deepEqual(
    await env.coordinator.noticeDeploy({
      commit: "b".repeat(40),
      baseURL: BASE_URL,
    }),
    { state: "unchanged" },
  );
  await runAlarms(env);
  env.clock.time += HOUR;
  const second = await env.coordinator.noticeDeploy({
    commit: "e".repeat(40),
    baseURL: BASE_URL,
  });
  assert.equal(second.state, "scheduled", "a deploy inside six hours waits");
  assert.equal(
    (await env.coordinator.status()).schedule.deployedCommit,
    "e".repeat(40),
  );
  await assert.rejects(
    env.coordinator.noticeDeploy({ commit: "main", baseURL: BASE_URL }),
    /full lowercase commit/,
  );
});
