import { ArchiveError } from "./archive.mjs";
import {
  pairKey,
  pairOf,
  SCORE_QUEUE_LIMIT,
  scorePair,
  settledByHashes,
} from "./drift-scores.mjs";
import {
  captureLocale,
  currentRuns,
  PROFILES,
  storyCatalogueRuns,
} from "./model.mjs";

// One coordinator owns every reference capture and approval: a Durable
// Object hosts it on the deployed workbench, and the local workbench hosts it
// in-process. Its storage has the Durable Object storage shape (get, put,
// delete, list by prefix), and it asks its host to wake it with setAlarm.

/** A shot is captured again at most once in this window; others never wait. */
export const SHOT_THROTTLE_MS = 6 * 60 * 60 * 1000;
/** Waits before a wake whose browser could not start is tried again. */
export const LAUNCH_BACKOFF_MS = [60_000, 5 * 60_000, 15 * 60_000];
/** A focused capture covers a few stories, so it runs at once. */
export const FOCUSED_TARGET_LIMIT = 5;
/** Shots a full run takes per alarm before it saves and wakes again. */
export const FULL_BATCH_SHOTS = 9;
/** Finished runs the coordinator keeps live; the archive keeps them all. */
const LIVE_RUN_LIMIT = 20;

const SCHEDULE_KEY = "schedule";
const RUN_PREFIX = "run:";
const TARGETS_PREFIX = "targets:";
/** Shots a run's due list holds per stored page. */
const TARGETS_PAGE = 100;
// One record per shot - its case, size and locale: the inputs it was last
// captured from, when it last succeeded and when it was last tried. Due
// shots are ordered by that last try, so what a stopped run left goes first.
const LEDGER_PREFIX = "shot:";
// Each story case's render inputs, as the newest declared build names them.
const INPUTS_PREFIX = "inputs:";
// The catalogue runs of the newest story declaration: the only ones read.
const DECLARATION_KEY = "story-declaration";
const APPROVAL_PREFIX = "approval:";
// The coordinator indexes every reference by case, so a story's references
// are one storage list, not a scan of the whole archive. The index is filled
// from the archive once, then kept as each capture lands.
const REFERENCE_PREFIX = "reference:";
const INDEX_KEY = "reference-index";
const INDEX_PAGE = 50;
const REFERENCE_PAGE = 100;
// Each pair's drift score, by its key, and the pairs waiting to be scored.
const SCORE_PREFIX = "score:";
const QUEUE_PREFIX = "score-queue:";
/** Pairs scored per alarm, so a wake stays well inside its CPU limit. */
export const SCORE_BATCH = 4;
/** Tries per pair before its failure is stored. */
export const SCORE_ATTEMPTS = 3;
/** A stored failure is tried again when a client asks after this long. */
export const SCORE_ERROR_RETRY_MS = 6 * 60 * 60 * 1000;
const PROFILE_IDS = Object.keys(PROFILES);
const TRIGGERS = ["deploy", "manual", "due"];
const ENDED = ["succeeded", "failed", "superseded"];

function text(value, path, max = 512) {
  if (typeof value !== "string" || value.trim() === "" || value.length > max)
    throw new TypeError(
      `${path} must be non-empty text of at most ${max} characters`,
    );
  if ([...value].some((character) => character.codePointAt(0) < 32))
    throw new TypeError(`${path} must be one line`);
  return value;
}

function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}

function personOf(value) {
  if (!value || typeof value.subject !== "string")
    throw new TypeError("a capture or approval needs a signed-in person");
  return {
    subject: value.subject,
    ...(typeof value.email === "string" ? { email: value.email } : {}),
  };
}

function identityOf(value) {
  return {
    caseId: text(value?.caseId, "caseId", 128),
    targetId: text(value?.targetId, "targetId", 128),
    capturePointId: text(value?.capturePointId, "capturePointId", 128),
  };
}

function sameIdentity(left, right) {
  return (
    left.caseId === right.caseId &&
    left.targetId === right.targetId &&
    left.capturePointId === right.capturePointId
  );
}

// What a run shows: everything but its working lists.
function publicRun(run) {
  const {
    targets: _targets,
    failedAt: _failedAt,
    launchAttempts: _launchAttempts,
    retryAt: _retryAt,
    ...rest
  } = run;
  return rest;
}

function targetOf(entry, run) {
  return {
    ...identityOf(entry),
    storyId: entry.reference.storyId,
    selector: entry.reference.selector ?? null,
    wholeViewport: entry.region === "viewport",
    scoreProfile: entry.scoreProfile,
    locales: run.locales ?? ["en"],
  };
}

function shotAt(targets, index) {
  let remaining = index;
  for (const target of targets) {
    const count = target.locales.length * PROFILE_IDS.length;
    if (remaining < count) {
      const locale = target.locales[Math.floor(remaining / PROFILE_IDS.length)];
      return {
        ...target,
        locale,
        profileId: PROFILE_IDS[remaining % PROFILE_IDS.length],
      };
    }
    remaining -= count;
  }
  return null;
}

function ledgerKey(shot) {
  return `${LEDGER_PREFIX}${shot.caseId}:${shot.targetId}:${shot.capturePointId}:${shot.profileId}:${shot.locale.toLowerCase()}`;
}

function shotCount(targets) {
  return targets.reduce(
    (sum, target) => sum + target.locales.length * PROFILE_IDS.length,
    0,
  );
}

export function createCaptureCoordinator({
  storage,
  archive,
  openSession,
  setAlarm,
  now = () => Date.now(),
  newId = () => globalThis.crypto.randomUUID(),
}) {
  const iso = () => new Date(now()).toISOString();

  async function schedule() {
    return (
      (await storage.get(SCHEDULE_KEY)) ?? {
        activeFullRunId: null,
        pending: null,
        deployedCommit: null,
        nextDueAt: null,
      }
    );
  }

  async function saveRun(run) {
    await storage.put(`${RUN_PREFIX}${run.runId}`, {
      ...run,
      updatedAt: iso(),
    });
  }

  // A full run's progress, unless a person's request ended it meanwhile: a
  // batch in flight then keeps its shots but leaves the run as it was ended.
  async function saveProgress(run) {
    const stored = await storage.get(`${RUN_PREFIX}${run.runId}`);
    if (stored && ENDED.includes(stored.state)) return stored;
    await saveRun(run);
    return run;
  }

  async function pruneRuns() {
    const runs = [...(await storage.list({ prefix: RUN_PREFIX })).values()]
      .filter((run) => ENDED.includes(run.state))
      .sort((left, right) => right.requestedAt.localeCompare(left.requestedAt));
    for (const run of runs.slice(LIVE_RUN_LIMIT)) {
      await storage.delete(`${RUN_PREFIX}${run.runId}`);
      await storage.delete(`${TARGETS_PREFIX}${run.runId}`);
    }
  }

  async function indexReference(reference) {
    await storage.put(
      `${REFERENCE_PREFIX}${reference.caseId}:${reference.referenceId}`,
      reference,
    );
  }

  // A page of the index in key order, one storage list per page; null until
  // the index is filled, so the caller reads the archive instead. Readers
  // order references themselves, as they did the archive's pages.
  async function listReferences({
    caseId,
    cursor,
    limit = REFERENCE_PAGE,
  } = {}) {
    const index = await storage.get(INDEX_KEY);
    if (index?.state !== "ready") {
      // The first read after a deploy starts the fill.
      if (!(await schedule()).activeFullRunId) await setAlarm(now());
      return null;
    }
    const prefix = caseId
      ? `${REFERENCE_PREFIX}${text(caseId, "caseId", 128)}:`
      : REFERENCE_PREFIX;
    if (cursor !== undefined) text(cursor, "cursor", 512);
    const entries = [
      ...(await storage.list({
        prefix,
        limit: limit + 1,
        ...(cursor ? { startAfter: `${prefix}${cursor}` } : {}),
      })),
    ];
    const page = entries.slice(0, limit);
    return {
      references: page.map(([, reference]) => reference),
      ...(entries.length > limit
        ? { cursor: page[page.length - 1][0].slice(prefix.length) }
        : {}),
    };
  }

  // One page of the archive into the index; true while pages remain.
  async function stepIndex() {
    const index = (await storage.get(INDEX_KEY)) ?? { state: "filling" };
    if (index.state === "ready") return false;
    const page = await archive.listReferences({
      ...(index.cursor ? { cursor: index.cursor } : {}),
      limit: INDEX_PAGE,
    });
    for (const reference of page.references) await indexReference(reference);
    await storage.put(
      INDEX_KEY,
      page.cursor
        ? { state: "filling", cursor: page.cursor }
        : { state: "ready", readyAt: iso() },
    );
    return Boolean(page.cursor);
  }

  // A client names the pairs it shows. Only the hashes settle a pair at once;
  // every other pair waits for the alarm, which reads the archived bytes, so a
  // size a client sent never becomes a stored score.
  async function queueScores({ pairs } = {}) {
    if (
      !Array.isArray(pairs) ||
      pairs.length === 0 ||
      pairs.length > SCORE_QUEUE_LIMIT
    )
      throw new TypeError(`pairs must hold 1 to ${SCORE_QUEUE_LIMIT} pairs`);
    let queued = 0;
    let settled = 0;
    for (const [position, value] of pairs.entries()) {
      const pair = pairOf(value, `pairs[${position}]`);
      const key = pairKey(pair.reference, pair.other);
      const stored = await storage.get(`${SCORE_PREFIX}${key}`);
      if (
        stored &&
        !(
          stored.kind === "error" &&
          now() - Date.parse(stored.scoredAt) >= SCORE_ERROR_RETRY_MS
        )
      )
        continue;
      const known = settledByHashes(pair);
      if (known) {
        await storage.put(`${SCORE_PREFIX}${key}`, {
          ...known,
          scoredAt: iso(),
        });
        settled += 1;
      } else if (!(await storage.get(`${QUEUE_PREFIX}${key}`))) {
        await storage.put(`${QUEUE_PREFIX}${key}`, { pair, attempts: 0 });
        queued += 1;
      }
    }
    if (queued > 0 && !(await schedule()).activeFullRunId)
      await setAlarm(now());
    return { queued, settled };
  }

  // The stored scores of the pairs a client names, and nothing else, so a
  // read stays the size of what it shows however many scores accumulate.
  async function readScores({ keys } = {}) {
    if (
      !Array.isArray(keys) ||
      keys.length === 0 ||
      keys.length > SCORE_QUEUE_LIMIT
    )
      throw new TypeError(`keys must hold 1 to ${SCORE_QUEUE_LIMIT} pair keys`);
    const scores = {};
    const values = await Promise.all(
      keys.map((key) => storage.get(`${SCORE_PREFIX}${text(key, "key", 512)}`)),
    );
    for (const [position, value] of values.entries())
      if (value) scores[keys[position]] = value;
    return { scores };
  }

  /** How many scores are stored and queued; a scan, for tests and operators. */
  async function scoreCounts() {
    return {
      stored: (await storage.list({ prefix: SCORE_PREFIX })).size,
      queued: (await storage.list({ prefix: QUEUE_PREFIX })).size,
    };
  }

  // A few queued pairs per wake. A failure is tried again on later wakes, then
  // stored, so one bad pair cannot hold the queue; the browser compares it,
  // and a client asking after SCORE_ERROR_RETRY_MS queues it again.
  async function stepScores() {
    const queue = [
      ...(await storage.list({
        prefix: QUEUE_PREFIX,
        limit: SCORE_BATCH + 1,
      })),
    ];
    for (const [key, entry] of queue.slice(0, SCORE_BATCH)) {
      let score;
      try {
        score = await scorePair(archive, entry.pair);
      } catch (error) {
        if (entry.attempts + 1 < SCORE_ATTEMPTS) {
          await storage.put(key, { ...entry, attempts: entry.attempts + 1 });
          continue;
        }
        score = { kind: "error", message: messageOf(error) };
      }
      await storage.put(`${SCORE_PREFIX}${key.slice(QUEUE_PREFIX.length)}`, {
        ...score,
        scoredAt: iso(),
      });
      await storage.delete(key);
    }
    return queue.length > 0;
  }

  async function finish(run, state, message) {
    // A run a person's request already replaced keeps that ending.
    const stored = await storage.get(`${RUN_PREFIX}${run.runId}`);
    if (stored && ENDED.includes(stored.state)) return stored;
    const finished = {
      ...run,
      state,
      finishedAt: iso(),
      ...(message ? { message } : {}),
    };
    await saveRun(finished);
    await archive.createReferenceRun(publicRun(finished));
    await pruneRuns();
    return finished;
  }

  // Every active case of the current runs, newest declaration first: the
  // site runs' cases, then the story cases no site run declares.
  async function fullTargets() {
    const runs = [];
    let cursor;
    do {
      const page = await archive.listRuns({
        cursor,
        limit: 100,
        storyRuns: (await currentDeclaration())?.runIds ?? [],
      });
      runs.push(...page.runs);
      cursor = page.cursor;
    } while (cursor);
    const targets = [];
    const newestFirst = currentRuns(runs).sort((left, right) =>
      right.createdAt.localeCompare(left.createdAt),
    );
    for (const run of newestFirst) {
      for (const entry of run.catalogue) {
        if (
          entry.status === "active" &&
          !targets.some((target) => sameIdentity(target, entry))
        )
          targets.push(targetOf(entry, run));
      }
    }
    return targets;
  }

  async function prefixed(prefix) {
    return new Map(
      [...(await storage.list({ prefix }))].map(([key, value]) => [
        key.slice(prefix.length),
        value,
      ]),
    );
  }

  // The shots whose inputs moved since they were last captured, never tried
  // first, then the longest untried. A shot captured inside the throttle waits
  // for it, and the earliest such wait is when the next due run starts.
  async function dueShots({ hold = true } = {}) {
    const inputs = await prefixed(INPUTS_PREFIX);
    const ledger = await prefixed(LEDGER_PREFIX);
    const due = [];
    let nextDueAt = null;
    for (const target of await fullTargets()) {
      for (let index = 0; index < shotCount([target]); index += 1) {
        const shot = shotAt([target], index);
        const entry = ledger.get(ledgerKey(shot).slice(LEDGER_PREFIX.length));
        const wanted = inputs.get(shot.caseId) ?? null;
        if (entry?.capturedAt && (wanted === null || entry.inputs === wanted))
          continue;
        if (
          hold &&
          entry?.capturedAt &&
          now() - entry.capturedAt < SHOT_THROTTLE_MS
        ) {
          const at = entry.capturedAt + SHOT_THROTTLE_MS;
          nextDueAt = nextDueAt === null ? at : Math.min(nextDueAt, at);
          continue;
        }
        due.push({ ...shot, inputs: wanted, triedAt: entry?.attemptedAt ?? 0 });
      }
    }
    due.sort((left, right) => left.triedAt - right.triedAt);
    return { due, nextDueAt };
  }

  async function recordShot(shot, captured) {
    const key = ledgerKey(shot);
    const entry = (await storage.get(key)) ?? {};
    await storage.put(
      key,
      captured
        ? { inputs: shot.inputs ?? null, capturedAt: now(), attemptedAt: now() }
        : { ...entry, attemptedAt: now() },
    );
  }

  async function saveTargets(runId, shots) {
    for (let page = 0; page * TARGETS_PAGE < shots.length; page += 1)
      await storage.put(
        `${TARGETS_PREFIX}${runId}:${page}`,
        shots.slice(page * TARGETS_PAGE, (page + 1) * TARGETS_PAGE),
      );
  }

  async function targetAt(runId, index) {
    const page = await storage.get(
      `${TARGETS_PREFIX}${runId}:${Math.floor(index / TARGETS_PAGE)}`,
    );
    return page?.[index % TARGETS_PAGE] ?? null;
  }

  async function dropTargets(runId) {
    for (const key of (
      await storage.list({ prefix: `${TARGETS_PREFIX}${runId}:` })
    ).keys())
      await storage.delete(key);
  }

  // The story cases a Storybook build declares, as reference-only runs.
  // The same cases at the same commit are the same runs, so declaring twice
  // is a no-op.
  async function declareStories({ cases, commit, ref }) {
    const parts = await storyCatalogueRuns({
      cases,
      commit,
      ref,
      createdAt: iso(),
    });
    const stored = await prefixed(INPUTS_PREFIX);
    const declared = new Map(
      cases.map(({ caseId, inputs }) => [caseId, inputs ?? null]),
    );
    for (const [caseId, inputs] of declared)
      if (stored.get(caseId) !== inputs)
        await storage.put(`${INPUTS_PREFIX}${caseId}`, inputs);
    for (const caseId of stored.keys())
      if (!declared.has(caseId))
        await storage.delete(`${INPUTS_PREFIX}${caseId}`);
    // A part already published is the same declaration: an earlier attempt
    // that stopped part-way is finished, and a repeat changes nothing.
    let published = 0;
    for (const part of parts) {
      if (await archive.getRun(part.runId)) continue;
      await archive.publish(part, []);
      published += 1;
    }
    // The newest declaration is the one declared last, even when its runs
    // were published before: a redeploy of an older commit names its own.
    await storage.put(DECLARATION_KEY, {
      runIds: parts.map((part) => part.runId),
      commit,
      declaredAt: iso(),
    });
    return {
      state: published === 0 ? "unchanged" : "declared",
      runIds: parts.map((part) => part.runId),
      cases: cases.length,
    };
  }

  async function currentDeclaration() {
    return (await storage.get(DECLARATION_KEY)) ?? null;
  }

  // The schedule is read again here, after the caller's awaits: another
  // request or the alarm may have changed it while those waited.
  async function startFull(request, overrides = {}) {
    const runId = `capture-${newId()}`;
    const run = {
      schemaVersion: 1,
      runId,
      lane: "full",
      trigger: request.trigger,
      requestedBy: request.requestedBy,
      requestedAt: request.requestedAt,
      baseURL: request.baseURL,
      state: "queued",
      total: 0,
      done: 0,
      failed: 0,
      failures: [],
      referenceIds: [],
    };
    await saveRun(run);
    await storage.put(SCHEDULE_KEY, {
      ...(await schedule()),
      ...overrides,
      activeFullRunId: runId,
      pending: null,
      baseURL: request.baseURL,
    });
    await setAlarm(now());
    return run;
  }

  // One full run at a time. A person's request starts now, replacing the run
  // going; a deploy's request while one runs waits in the one pending slot,
  // the newest replacing an older one, and starts when that run ends.
  async function requestFull({ trigger, person, baseURL }) {
    if (!TRIGGERS.includes(trigger))
      throw new TypeError(`trigger must be one of ${TRIGGERS.join(", ")}`);
    const request = {
      trigger,
      requestedBy: personOf(person),
      requestedAt: iso(),
      baseURL: text(baseURL, "baseURL", 2048),
    };
    const state = await schedule();
    if (state.activeFullRunId && trigger === "manual") {
      // A person's request replaces the run going: what it captured stays,
      // and what it had left is due in the run that starts now.
      const active = await storage.get(`${RUN_PREFIX}${state.activeFullRunId}`);
      if (active)
        await finish(
          active,
          "superseded",
          `replaced by a full capture requested by hand; ${Math.max(0, (active.passTotal ?? 0) - (active.pass ?? 0))} shot(s) it had left go to that run`,
        );
      const run = await startFull(request);
      return { state: "started", run: publicRun(run) };
    }
    if (!state.activeFullRunId) {
      const run = await startFull(request);
      return { state: "started", run: publicRun(run) };
    }
    await storage.put(SCHEDULE_KEY, {
      ...(await schedule()),
      pending: request,
    });
    return { state: "waiting" };
  }

  // The host's clock calls this with the commit its build receipt names; a
  // commit not seen before is a deploy, and asks for a full capture.
  // The deploy's story cases are declared first, so its full capture takes
  // them in.
  async function noticeDeploy({ commit, baseURL, cases }) {
    if (typeof commit !== "string" || !/^[0-9a-f]{40}$/.test(commit))
      throw new TypeError("commit must be a full lowercase commit");
    const state = await schedule();
    if (state.deployedCommit === commit) return { state: "unchanged" };
    await declareStories({ cases, commit, ref: "deploy" });
    // Declaring waits on the archive; the schedule may have moved meanwhile,
    // and another notice may have taken this commit.
    const after = await schedule();
    if (after.deployedCommit === commit) return { state: "unchanged" };
    await storage.put(SCHEDULE_KEY, { ...after, deployedCommit: commit });
    return requestFull({
      trigger: "deploy",
      person: { subject: "deploy" },
      baseURL,
    });
  }

  // The end of a pass: the shots that failed are tried once more, then the
  // run ends, failed when any shot failed twice.
  async function endPass(current) {
    const stored = await storage.get(`${RUN_PREFIX}${current.runId}`);
    if (stored && ENDED.includes(stored.state)) return stored;
    if (!current.retried && current.failedAt.length > 0) {
      const retry = [];
      for (const index of current.failedAt)
        retry.push(await targetAt(current.runId, index));
      await dropTargets(current.runId);
      await saveTargets(current.runId, retry);
      const next = {
        ...current,
        retried: true,
        pass: 0,
        passTotal: retry.length,
        failed: current.failed - retry.length,
        failures: [],
        failedAt: [],
      };
      await saveRun(next);
      await setAlarm(now());
      return next;
    }
    return finish(
      current,
      current.failed === 0 ? "succeeded" : "failed",
      current.failed === 0
        ? undefined
        : `${current.failed} shot(s) failed twice; they go first next run`,
    );
  }

  // A wake opens a browser and reads the receipt; when either fails it waits
  // and tries again, and gives the run up only after every backoff.
  async function stepFull(run) {
    let current = run;
    if (current.retryAt && now() < current.retryAt) {
      await setAlarm(current.retryAt);
      return current;
    }
    let session;
    let provenance;
    try {
      session = await openSession();
      provenance = await session.provenance(current.baseURL);
    } catch (error) {
      await session?.close();
      const attempts = (current.launchAttempts ?? 0) + 1;
      if (attempts > LAUNCH_BACKOFF_MS.length)
        return finish(
          current,
          "failed",
          `the browser could not start after ${attempts} tries: ${messageOf(error)}`,
        );
      current = {
        ...current,
        launchAttempts: attempts,
        retryAt: now() + LAUNCH_BACKOFF_MS[attempts - 1],
        message: `the browser could not start; trying again: ${messageOf(error)}`,
      };
      const saved = await saveProgress(current);
      if (saved === current) await setAlarm(current.retryAt);
      return saved;
    }
    try {
      current = { ...current, launchAttempts: 0, retryAt: null };
      delete current.message;
      if (current.state === "queued") {
        // A person asking skips the six-hour hold; an unchanged shot is
        // still never taken.
        const { due, nextDueAt } = await dueShots({
          hold: current.trigger !== "manual",
        });
        await saveTargets(current.runId, due);
        await storage.put(SCHEDULE_KEY, { ...(await schedule()), nextDueAt });
        current = {
          ...current,
          state: "running",
          startedAt: iso(),
          commit: provenance.commit,
          ref: provenance.ref,
          verified: provenance.verified,
          browser: session.browser,
          total: due.length,
          pass: 0,
          passTotal: due.length,
          failedAt: [],
        };
      } else if (provenance.commit !== current.commit) {
        // What this run captured stays; what it did not is still due, and
        // goes first in the run that captures the new commit.
        return finish(
          current,
          "superseded",
          `Storybook moved to ${provenance.commit} during the run; ${current.passTotal - current.pass} shot(s) wait for the next run`,
        );
      }
      for (
        let step = 0;
        step < FULL_BATCH_SHOTS && current.pass < current.passTotal;
        step += 1
      ) {
        // A run a person's request replaced stops at its next shot.
        const stored = await storage.get(`${RUN_PREFIX}${current.runId}`);
        if (ENDED.includes(stored?.state)) break;
        const index = current.pass;
        const shot = await targetAt(current.runId, index);
        current = { ...current, pass: index + 1 };
        try {
          const { bytes, region } = await session.shoot(shot, current.baseURL);
          const reference = await archive.createReference(
            {
              caseId: shot.caseId,
              targetId: shot.targetId,
              capturePointId: shot.capturePointId,
              profileId: shot.profileId,
              locale: shot.locale,
              storyId: shot.storyId,
              selector: shot.selector,
              region,
              commit: current.commit,
              ref: current.ref,
              verified: current.verified,
              browser: current.browser,
            },
            bytes,
            current.requestedBy,
          );
          await indexReference(reference);
          await recordShot(shot, true);
          current = {
            ...current,
            done: current.done + 1,
            referenceIds: [...current.referenceIds, reference.referenceId],
          };
        } catch (error) {
          await recordShot(shot, false);
          current = {
            ...current,
            failed: current.failed + 1,
            failedAt: [...current.failedAt, index],
            failures: [
              ...current.failures,
              {
                caseId: shot.caseId,
                targetId: shot.targetId,
                capturePointId: shot.capturePointId,
                profileId: shot.profileId,
                locale: shot.locale,
                message: messageOf(error),
              },
            ],
          };
        }
      }
    } finally {
      await session.close();
    }
    if (current.pass < current.passTotal) {
      const saved = await saveProgress(current);
      if (saved === current) await setAlarm(now());
      return saved;
    }
    return endPass(current);
  }

  // The host wakes the coordinator here: a full run takes its next batch;
  // when it ends, a waiting request starts, and shots held by the throttle
  // start their own run once it lifts.
  async function alarm() {
    const state = await schedule();
    if (state.activeFullRunId) {
      const run = await storage.get(`${RUN_PREFIX}${state.activeFullRunId}`);
      let result;
      try {
        result = await stepFull(run);
      } catch (error) {
        console.error("[ui-verification-captures] full run failed", error);
        result = await finish(run, "failed", messageOf(error));
      }
      if (ENDED.includes(result.state)) {
        await dropTargets(result.runId);
        const after = await schedule();
        // A person's request already replaced this run with its own.
        if (after.activeFullRunId !== result.runId) {
          await setAlarm(now());
          return;
        }
        await storage.put(SCHEDULE_KEY, { ...after, activeFullRunId: null });
        if (after.pending) await startFull(after.pending);
        // Wake again at once: the index and the scores wait for a full run.
        else await setAlarm(now());
      }
      return;
    }
    if (state.nextDueAt !== null && state.nextDueAt !== undefined) {
      if (now() >= state.nextDueAt) {
        await startFull(
          {
            trigger: "due",
            requestedBy: { subject: "throttle" },
            requestedAt: iso(),
            baseURL: state.baseURL,
          },
          { nextDueAt: null },
        );
        return;
      }
      await setAlarm(state.nextDueAt);
    }
    // Between full runs the alarm fills the index, then scores queued pairs.
    if ((await stepIndex()) || (await stepScores())) await setAlarm(now());
  }

  // A focused capture renders a few stories at every size in one locale and
  // stores nothing unless every shot succeeded.
  async function captureFocused({
    targets,
    locale,
    approve = false,
    comment,
    person,
    baseURL,
  }) {
    if (
      !Array.isArray(targets) ||
      targets.length === 0 ||
      targets.length > FOCUSED_TARGET_LIMIT
    )
      throw new TypeError(
        `a focused capture takes 1 to ${FOCUSED_TARGET_LIMIT} stories`,
      );
    if (typeof approve !== "boolean")
      throw new TypeError("approve must be a boolean");
    const requestedBy = personOf(person);
    const requestedLocale = captureLocale({
      locale: text(locale, "locale", 35),
    });
    const resolved = [];
    for (const target of targets) {
      const identity = identityOf(target);
      const source = await archive.getRun(
        text(target.sourceRunId, "sourceRunId", 128),
      );
      if (!source)
        throw new ArchiveError(
          404,
          "RUN_NOT_FOUND",
          `run ${target.sourceRunId} was not found`,
        );
      const entry = source.catalogue.find((candidate) =>
        sameIdentity(candidate, identity),
      );
      if (!entry)
        throw new ArchiveError(
          404,
          "CASE_NOT_FOUND",
          "the run does not declare this case",
        );
      resolved.push({ ...targetOf(entry, source), locales: [requestedLocale] });
    }
    let run = {
      schemaVersion: 1,
      runId: `capture-${newId()}`,
      lane: "focused",
      trigger: approve ? "approve" : "capture",
      requestedBy,
      requestedAt: iso(),
      baseURL: text(baseURL, "baseURL", 2048),
      state: "running",
      startedAt: iso(),
      total: shotCount(resolved),
      done: 0,
      failed: 0,
      failures: [],
      referenceIds: [],
    };
    await saveRun(run);
    const shots = [];
    const session = await openSession();
    try {
      const provenance = await session.provenance(run.baseURL);
      run = {
        ...run,
        commit: provenance.commit,
        ref: provenance.ref,
        verified: provenance.verified,
        browser: session.browser,
      };
      for (let index = 0; index < run.total; index += 1) {
        const shot = shotAt(resolved, index);
        shots.push({ shot, ...(await session.shoot(shot, run.baseURL)) });
        run = { ...run, done: run.done + 1 };
        await saveRun(run);
      }
    } catch (error) {
      await finish({ ...run, failed: 1 }, "failed", messageOf(error));
      throw new ArchiveError(
        502,
        "CAPTURE_FAILED",
        `the reference could not be captured: ${messageOf(error)}`,
      );
    } finally {
      await session.close();
    }
    const references = [];
    for (const { shot, bytes, region } of shots) {
      const reference = await archive.createReference(
        {
          caseId: shot.caseId,
          targetId: shot.targetId,
          capturePointId: shot.capturePointId,
          profileId: shot.profileId,
          locale: shot.locale,
          storyId: shot.storyId,
          selector: shot.selector,
          region,
          commit: run.commit,
          ref: run.ref,
          verified: run.verified,
          browser: run.browser,
        },
        bytes,
        requestedBy,
      );
      await indexReference(reference);
      await recordShot(
        {
          ...shot,
          inputs: (await storage.get(`${INPUTS_PREFIX}${shot.caseId}`)) ?? null,
        },
        true,
      );
      references.push(reference);
    }
    const approvals = [];
    if (approve) {
      for (const reference of references) {
        approvals.push(
          await createApproval(
            {
              referenceId: reference.referenceId,
              decision: "approved",
              ...(comment ? { comment } : {}),
            },
            requestedBy,
          ),
        );
      }
    }
    const finished = await finish(
      { ...run, referenceIds: references.map((item) => item.referenceId) },
      "succeeded",
    );
    return { run: publicRun(finished), references, approvals };
  }

  // An approval judges one captured reference image; it is never edited, and
  // the newest approval on the same bytes is the one that stands.
  async function createApproval(input, person) {
    const keys = Object.keys(input ?? {});
    const extra = keys.find(
      (key) => !["referenceId", "decision", "comment"].includes(key),
    );
    if (extra) throw new TypeError(`approval has unknown field ${extra}`);
    const reference = await archive.getReference(
      text(input.referenceId, "approval.referenceId", 128),
    );
    if (!reference)
      throw new ArchiveError(
        404,
        "REFERENCE_NOT_FOUND",
        `reference ${input.referenceId} was not found`,
      );
    if (!["approved", "changes-requested"].includes(input.decision))
      throw new TypeError(
        "approval.decision must be approved or changes-requested",
      );
    const comment =
      input.comment === undefined
        ? ""
        : text(input.comment, "approval.comment", 10000);
    if (input.decision === "changes-requested" && comment === "")
      throw new TypeError("approval.comment is required to request changes");
    const approval = {
      schemaVersion: 1,
      approvalId: newId(),
      referenceId: reference.referenceId,
      caseId: reference.caseId,
      targetId: reference.targetId,
      capturePointId: reference.capturePointId,
      profileId: reference.profileId,
      locale: reference.locale,
      referenceHash: reference.image.sha256,
      decision: input.decision,
      comment,
      approver: personOf(person),
      createdAt: iso(),
    };
    await storage.put(
      `${APPROVAL_PREFIX}${approval.caseId}:${approval.approvalId}`,
      approval,
    );
    return approval;
  }

  async function listApprovals({ caseId } = {}) {
    const prefix = caseId
      ? `${APPROVAL_PREFIX}${text(caseId, "caseId", 128)}:`
      : APPROVAL_PREFIX;
    const approvals = [...(await storage.list({ prefix })).values()].sort(
      (left, right) => right.createdAt.localeCompare(left.createdAt),
    );
    return { approvals };
  }

  async function status() {
    const state = await schedule();
    const runs = [...(await storage.list({ prefix: RUN_PREFIX })).values()]
      .sort((left, right) => right.requestedAt.localeCompare(left.requestedAt))
      .map(publicRun);
    return {
      schedule: {
        activeFullRunId: state.activeFullRunId,
        pending: state.pending,
        deployedCommit: state.deployedCommit ?? null,
        nextDueAt:
          typeof state.nextDueAt === "number"
            ? new Date(state.nextDueAt).toISOString()
            : null,
      },
      runs,
    };
  }

  return {
    requestFull,
    noticeDeploy,
    declareStories,
    currentDeclaration,
    captureFocused,
    alarm,
    createApproval,
    listApprovals,
    listReferences,
    queueScores,
    readScores,
    scoreCounts,
    status,
  };
}
