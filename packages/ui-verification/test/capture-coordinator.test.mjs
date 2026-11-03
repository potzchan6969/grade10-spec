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
  LAUNCH_BACKOFF_MS,
  SHOT_THROTTLE_MS,
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

async function setup(
  t,
  { cases = 2, failOn, commits, launchFails = 0, onShoot, onPublish } = {},
) {
  const root = await mkdtemp(join(tmpdir(), "ui-verification-coordinator-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const archive = createArchive(root);
  await publishRun(archive, "run-site", cases);
  const clock = { time: Date.parse("2026-10-29T10:00:00.000Z") };
  const alarms = [];
  const shots = [];
  let receipt = 0;
  let ids = 0;
  let launches = 0;
  const coordinator = createCaptureCoordinator({
    storage: memoryStorage(),
    // A publish waits on the archive, as R2 does: other events may run then.
    archive: {
      ...archive,
      async publish(...args) {
        await onPublish?.();
        return archive.publish(...args);
      },
    },
    now: () => clock.time,
    newId: () => {
      ids += 1;
      return `id-${ids}`;
    },
    setAlarm: (time) => alarms.push(time),
    openSession: async () => {
      launches += 1;
      if (launches <= launchFails) throw new Error("browser limit reached");
      return {
        browser: "chromium test",
        async provenance() {
          const list = commits ?? ["b".repeat(40)];
          const commit = list[Math.min(receipt, list.length - 1)];
          receipt += 1;
          return { commit, ref: "deploy", verified: true };
        },
        async shoot(shot) {
          shots.push(shot);
          await onShoot?.(shot);
          if (failOn?.(shot))
            throw new Error(`could not render ${shot.storyId}`);
          const size = PROFILES[shot.profileId];
          return {
            bytes: png(size.width, size.height, shots.length % 200),
            region: { x: 0, y: 0, width: 100, height: 50 },
          };
        },
        async close() {},
      };
    },
  });
  return { archive, coordinator, clock, alarms, shots };
}

// Wakes the coordinator at each alarm it set, in time order; with `until`,
// only those due by then, leaving later ones set.
async function runAlarms({ coordinator, alarms, clock }, { until } = {}) {
  for (;;) {
    alarms.sort((left, right) => left - right);
    if (alarms.length === 0 || (until !== undefined && alarms[0] > until))
      return;
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

test("a deploy's request while a run goes waits, keeping the newest, and starts when it ends", async (t) => {
  const env = await setup(t, { cases: 1 });
  await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "publisher" },
    baseURL: BASE_URL,
  });
  env.clock.time += 1;
  const first = await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "publisher" },
    baseURL: BASE_URL,
  });
  assert.deepEqual(first, { state: "waiting" });
  env.clock.time += 1;
  await env.coordinator.requestFull({
    trigger: "due",
    person: { subject: "throttle" },
    baseURL: BASE_URL,
  });
  assert.equal(
    (await env.coordinator.status()).schedule.pending.trigger,
    "due",
    "the newest waiting request replaces an older one",
  );
  await runAlarms(env);
  const runs = (await env.coordinator.status()).runs;
  assert.deepEqual(
    runs.map(({ trigger, state, total }) => [trigger, state, total]),
    [
      ["due", "succeeded", 0],
      ["deploy", "succeeded", 3],
    ],
    "the waiting run finds nothing left to capture",
  );
});

test("a redeploy ends the run as superseded, keeps its captures, and the next run takes the rest", async (t) => {
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
  assert.equal(run.state, "superseded");
  assert.match(run.message, /moved to d{40}.*3 shot\(s\) wait/);
  assert.equal(run.done, FULL_BATCH_SHOTS);
  assert.equal(
    (await env.archive.listReferences()).references.length,
    FULL_BATCH_SHOTS,
    "what the run captured stays",
  );
  const taken = env.shots.length;
  env.clock.time += 1;
  await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "publisher" },
    baseURL: BASE_URL,
  });
  await runAlarms(env);
  const [next] = (await env.coordinator.status()).runs;
  assert.equal(next.state, "succeeded");
  assert.equal(next.total, 3);
  assert.deepEqual(
    env.shots.slice(taken).map(({ caseId }) => caseId),
    ["case-3", "case-3", "case-3"],
  );
});

test("a failed shot is tried once more before the run ends", async (t) => {
  let misses = 1;
  const env = await setup(t, {
    cases: 2,
    failOn: (shot) =>
      shot.caseId === "case-1" && shot.profileId === "mobile" && misses-- > 0,
  });
  await env.coordinator.requestFull({
    trigger: "manual",
    person: DESIGNER,
    baseURL: BASE_URL,
  });
  await runAlarms(env);
  const [run] = (await env.coordinator.status()).runs;
  assert.equal(run.state, "succeeded");
  assert.equal(run.done, 6);
  assert.equal(run.failed, 0);
});

test("a shot that fails twice fails the run, and goes first in the next", async (t) => {
  const env = await setup(t, {
    cases: 2,
    failOn: (shot) => shot.caseId === "case-1" && shot.profileId === "mobile",
  });
  const person = { trigger: "manual", person: DESIGNER, baseURL: BASE_URL };
  await env.coordinator.requestFull(person);
  await runAlarms(env);
  const [run] = (await env.coordinator.status()).runs;
  assert.equal(run.state, "failed");
  assert.equal(run.done, 5);
  assert.match(run.message, /1 shot\(s\) failed twice/);
  assert.deepEqual(
    run.failures.map(({ caseId, profileId }) => [caseId, profileId]),
    [["case-1", "mobile"]],
  );
  const taken = env.shots.length;
  await env.coordinator.requestFull(person);
  await runAlarms(env);
  assert.deepEqual(
    env.shots
      .slice(taken, taken + 1)
      .map(({ caseId, profileId }) => [caseId, profileId]),
    [["case-1", "mobile"]],
  );
});

test("a browser that cannot start is tried again after each backoff", async (t) => {
  const env = await setup(t, { cases: 1, launchFails: 2 });
  await env.coordinator.requestFull({
    trigger: "manual",
    person: DESIGNER,
    baseURL: BASE_URL,
  });
  const started = env.clock.time;
  await env.coordinator.alarm();
  const waiting = (await env.coordinator.status()).runs[0];
  assert.equal(waiting.state, "queued");
  assert.match(waiting.message, /could not start; trying again/);
  assert.equal(env.alarms.at(-1), started + LAUNCH_BACKOFF_MS[0]);
  await env.coordinator.alarm();
  assert.equal(env.shots.length, 0, "an early wake waits for the backoff");
  await runAlarms(env);
  const [run] = (await env.coordinator.status()).runs;
  assert.equal(run.state, "succeeded");
  assert.equal(run.done, 3);
  assert.equal(run.message, undefined);
});

test("a browser that never starts gives the run up after every backoff", async (t) => {
  const env = await setup(t, {
    cases: 1,
    launchFails: LAUNCH_BACKOFF_MS.length + 1,
  });
  await env.coordinator.requestFull({
    trigger: "manual",
    person: DESIGNER,
    baseURL: BASE_URL,
  });
  await runAlarms(env);
  const [run] = (await env.coordinator.status()).runs;
  assert.equal(run.state, "failed");
  assert.match(run.message, /could not start after 4 tries: browser limit/);
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

const STORY_CASES = [
  { caseId: "case-0", storyId: "story-0", inputs: "in-0" },
  {
    caseId: "block-1",
    storyId: "store-cart-blocks-cartline--default",
    inputs: "in-1",
  },
  {
    caseId: "primitive-2",
    storyId: "design-system-forms-button--default",
    inputs: "in-2",
  },
];

test("a new deployed commit asks for one full capture, and the same commit asks for none", async (t) => {
  const env = await setup(t, { cases: 1 });
  const first = await env.coordinator.noticeDeploy({
    commit: "b".repeat(40),
    baseURL: BASE_URL,
    cases: STORY_CASES,
  });
  assert.equal(first.state, "started");
  assert.equal(first.run.trigger, "deploy");
  assert.deepEqual(
    await env.coordinator.noticeDeploy({
      commit: "b".repeat(40),
      baseURL: BASE_URL,
      cases: STORY_CASES,
    }),
    { state: "unchanged" },
  );
  await runAlarms(env);
  env.clock.time += HOUR;
  const second = await env.coordinator.noticeDeploy({
    commit: "e".repeat(40),
    baseURL: BASE_URL,
    cases: STORY_CASES,
  });
  assert.equal(second.state, "started", "each deploy starts its own run");
  assert.equal(
    (await env.coordinator.status()).schedule.deployedCommit,
    "e".repeat(40),
  );
  await assert.rejects(
    env.coordinator.noticeDeploy({ commit: "main", baseURL: BASE_URL }),
    /full lowercase commit/,
  );
  await assert.rejects(
    env.coordinator.noticeDeploy({
      commit: "d".repeat(40),
      baseURL: BASE_URL,
    }),
    /cases must be a non-empty array/,
  );
});

test("a deploy's story cases get references without a site, and a site case keeps its own", async (t) => {
  const env = await setup(t, { cases: 1 });
  await env.coordinator.noticeDeploy({
    commit: "b".repeat(40),
    baseURL: BASE_URL,
    cases: STORY_CASES,
  });
  await runAlarms(env);
  const shot = ({ caseId, targetId, storyId, selector }) =>
    `${caseId}:${targetId}:${storyId}:${selector}`;
  assert.deepEqual([...new Set(env.shots.map(shot))].sort(), [
    "block-1:storybook:store-cart-blocks-cartline--default:null",
    "case-0:site:story-0:main",
    "primitive-2:storybook:design-system-forms-button--default:null",
  ]);
  assert.equal(env.shots.length, 9, "three sizes for each of three cases");
  const { runs } = await env.archive.listRuns({ caseId: "block-1" });
  assert.equal(runs.length, 1);
  assert.ok(
    runs[0].captures.every((capture) => capture.status === "not-selected"),
    "a story case is never captured on a site",
  );
});

test("declaring the same stories twice is one run, and new stories are another", async (t) => {
  const env = await setup(t, { cases: 1 });
  const input = {
    cases: STORY_CASES,
    commit: "b".repeat(40),
    ref: "main",
  };
  const first = await env.coordinator.declareStories(input);
  assert.equal(first.state, "declared");
  env.clock.time += HOUR;
  assert.deepEqual(await env.coordinator.declareStories(input), {
    state: "unchanged",
    runIds: first.runIds,
    cases: 3,
  });
  const grown = await env.coordinator.declareStories({
    ...input,
    cases: [...STORY_CASES, { caseId: "block-3", storyId: "x--default" }],
  });
  assert.equal(grown.state, "declared");
  assert.notDeepEqual(grown.runIds, first.runIds);
});

test("only shots whose inputs moved are captured, and one captured inside six hours waits alone", async (t) => {
  const env = await setup(t, { cases: 1 });
  const declare = (cases) =>
    env.coordinator.declareStories({
      cases,
      commit: "b".repeat(40),
      ref: "main",
    });
  const capture = async () => {
    env.clock.time += 1;
    await env.coordinator.requestFull({
      trigger: "deploy",
      person: { subject: "deploy" },
      baseURL: BASE_URL,
    });
    await runAlarms(env, { until: env.clock.time });
    return (await env.coordinator.status()).runs[0];
  };
  await declare(STORY_CASES);
  assert.equal((await capture()).total, 9);

  env.clock.time += HOUR;
  assert.equal((await capture()).total, 0, "nothing moved, nothing is shot");

  env.clock.time += HOUR;
  await declare([
    STORY_CASES[0],
    { ...STORY_CASES[1], inputs: "in-1-changed" },
    STORY_CASES[2],
    { caseId: "block-3", storyId: "x--default", inputs: "in-3" },
  ]);
  const taken = env.shots.length;
  const held = await capture();
  assert.equal(held.total, 3, "the new case is shot at once");
  assert.deepEqual(
    [...new Set(env.shots.slice(taken).map(({ caseId }) => caseId))],
    ["block-3"],
  );
  const { schedule } = await env.coordinator.status();
  assert.equal(
    Date.parse(schedule.nextDueAt),
    Date.parse("2026-10-29T10:00:00.001Z") + SHOT_THROTTLE_MS,
    "the changed case waits for six hours after its last capture",
  );

  env.clock.time = Date.parse(schedule.nextDueAt);
  env.alarms.push(env.clock.time);
  await runAlarms(env);
  const [due] = (await env.coordinator.status()).runs;
  assert.equal(due.trigger, "due");
  assert.equal(due.total, 3);
  assert.deepEqual(
    [...new Set(env.shots.slice(taken + 3).map(({ caseId }) => caseId))],
    ["block-1"],
  );
});

test("a request by hand starts at once, replacing the run going, and keeps what it captured", async (t) => {
  const env = await setup(t, { cases: 4 });
  await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "deploy" },
    baseURL: BASE_URL,
  });
  await env.coordinator.alarm();
  env.clock.time += 1;
  const asked = await env.coordinator.requestFull({
    trigger: "manual",
    person: DESIGNER,
    baseURL: BASE_URL,
  });
  assert.equal(asked.state, "started");
  await runAlarms(env);
  const [manual, deploy] = (await env.coordinator.status()).runs;
  assert.equal(deploy.state, "superseded");
  assert.match(deploy.message, /requested by hand; 3 shot\(s\)/);
  assert.deepEqual(
    [manual.trigger, manual.state, manual.total],
    ["manual", "succeeded", 3],
    "the shots the replaced run took are not taken again",
  );
  assert.equal((await env.archive.listReferences()).references.length, 12);
});

test("a batch in flight when a request replaces its run leaves the run as it was ended", async (t) => {
  let asked = false;
  const env = await setup(t, {
    cases: 2,
    onShoot: async () => {
      if (asked) return;
      asked = true;
      env.clock.time += 1;
      await env.coordinator.requestFull({
        trigger: "manual",
        person: DESIGNER,
        baseURL: BASE_URL,
      });
    },
  });
  await env.coordinator.requestFull({
    trigger: "deploy",
    person: { subject: "deploy" },
    baseURL: BASE_URL,
  });
  await runAlarms(env);
  const [manual, deploy] = (await env.coordinator.status()).runs;
  assert.equal(deploy.state, "superseded");
  assert.equal(manual.state, "succeeded");
  assert.equal(
    (await env.archive.listReferences()).references.length,
    6,
    "every shot is taken once, by one run or the other",
  );
  assert.equal((await env.coordinator.status()).schedule.activeFullRunId, null);
});

test("a request by hand skips the six-hour hold, but never shoots an unchanged story", async (t) => {
  const env = await setup(t, { cases: 1 });
  const declare = (cases) =>
    env.coordinator.declareStories({
      cases,
      commit: "b".repeat(40),
      ref: "main",
    });
  const request = async (trigger) => {
    env.clock.time += 1;
    await env.coordinator.requestFull({
      trigger,
      person: trigger === "manual" ? DESIGNER : { subject: "deploy" },
      baseURL: BASE_URL,
    });
    await runAlarms(env, { until: env.clock.time });
    return (await env.coordinator.status()).runs[0];
  };
  await declare(STORY_CASES);
  await request("deploy");
  env.clock.time += HOUR;
  await declare([
    STORY_CASES[0],
    { ...STORY_CASES[1], inputs: "in-1-changed" },
    STORY_CASES[2],
  ]);
  assert.equal((await request("deploy")).total, 0, "a deploy holds it");
  const taken = env.shots.length;
  assert.equal((await request("manual")).total, 3, "a person does not wait");
  assert.deepEqual(
    [...new Set(env.shots.slice(taken).map(({ caseId }) => caseId))],
    ["block-1"],
  );
});

test("only the newest declaration is read, and an older commit deployed again is newest", async (t) => {
  const env = await setup(t, { cases: 1 });
  const declare = async (commit, cases) => {
    env.clock.time += HOUR;
    return env.coordinator.declareStories({ cases, commit, ref: "main" });
  };
  const capturedCases = async () => {
    const taken = env.shots.length;
    env.clock.time += 1;
    await env.coordinator.requestFull({
      trigger: "manual",
      person: DESIGNER,
      baseURL: BASE_URL,
    });
    await runAlarms(env, { until: env.clock.time });
    return [...new Set(env.shots.slice(taken).map(({ caseId }) => caseId))]
      .filter((caseId) => caseId !== "case-0")
      .sort();
  };
  const x = await declare("a".repeat(40), [
    { caseId: "only-x", storyId: "x--default", inputs: "x" },
  ]);
  await declare("b".repeat(40), [
    { caseId: "only-y", storyId: "y--default", inputs: "y" },
  ]);
  assert.deepEqual(await capturedCases(), ["only-y"]);

  const again = await declare("a".repeat(40), [
    { caseId: "only-x", storyId: "x--default", inputs: "x" },
  ]);
  assert.equal(again.state, "unchanged", "its runs were published before");
  assert.deepEqual(again.runIds, x.runIds);
  assert.deepEqual(
    (await env.coordinator.currentDeclaration()).runIds,
    x.runIds,
  );
  assert.deepEqual(await capturedCases(), ["only-x"]);
});

test("a story run outside the newest declaration is never read", async (t) => {
  const env = await setup(t, { cases: 1 });
  const first = await env.coordinator.declareStories({
    cases: [{ caseId: "old", storyId: "old--default", inputs: "o" }],
    commit: "a".repeat(40),
    ref: "main",
  });
  const second = await env.coordinator.declareStories({
    cases: [{ caseId: "new", storyId: "new--default", inputs: "n" }],
    commit: "b".repeat(40),
    ref: "main",
  });
  const listed = await env.archive.listRuns({ storyRuns: second.runIds });
  assert.deepEqual(listed.runs.map(({ runId }) => runId).sort(), [
    "run-site",
    ...second.runIds,
  ]);
  assert.ok(!listed.runs.some(({ runId }) => first.runIds.includes(runId)));
  assert.equal(
    (await env.archive.listRuns()).runs.length,
    3,
    "without storyRuns every run is listed",
  );
});

test("a deploy noticed while a run ends and the next starts leaves no run stranded", async (t) => {
  let during;
  const env = await setup(t, {
    cases: 1,
    onPublish: async () => {
      const hook = during;
      during = undefined;
      await hook?.();
    },
  });
  const deploy = {
    trigger: "deploy",
    person: { subject: "deploy" },
    baseURL: BASE_URL,
  };
  await env.coordinator.requestFull(deploy);
  env.clock.time += 1;
  assert.equal((await env.coordinator.requestFull(deploy)).state, "waiting");
  const first = (await env.coordinator.status()).schedule.activeFullRunId;
  during = async () => {
    while ((await env.coordinator.status()).schedule.activeFullRunId === first)
      await env.coordinator.alarm();
  };
  await env.coordinator.noticeDeploy({
    commit: "c".repeat(40),
    baseURL: BASE_URL,
    cases: STORY_CASES,
  });
  await runAlarms(env);
  const { schedule, runs } = await env.coordinator.status();
  assert.equal(schedule.activeFullRunId, null);
  assert.equal(schedule.deployedCommit, "c".repeat(40));
  assert.deepEqual(
    runs.filter(({ state }) => state === "queued" || state === "running"),
    [],
    "every run ends",
  );
});
