import { ArchiveError } from "./archive.mjs";
import { captureLocale, PROFILES } from "./model.mjs";

// One coordinator owns every reference capture and approval: a Durable
// Object hosts it on the deployed workbench, and the local workbench hosts it
// in-process. Its storage has the Durable Object storage shape (get, put,
// delete, list by prefix), and it asks its host to wake it with setAlarm.

/** At most one full capture starts in this window, deploy or manual. */
export const FULL_INTERVAL_MS = 6 * 60 * 60 * 1000;
/** A focused capture covers a few stories, so it runs at once. */
export const FOCUSED_TARGET_LIMIT = 5;
/** Shots a full run takes per alarm before it saves and wakes again. */
export const FULL_BATCH_SHOTS = 9;
/** Finished runs the coordinator keeps live; the archive keeps them all. */
const LIVE_RUN_LIMIT = 20;

const SCHEDULE_KEY = "schedule";
const RUN_PREFIX = "run:";
const TARGETS_PREFIX = "targets:";
const APPROVAL_PREFIX = "approval:";
const PROFILE_IDS = Object.keys(PROFILES);
const TRIGGERS = ["deploy", "manual"];

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
  const { targets: _targets, ...rest } = run;
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
        lastFullStartedAt: null,
        activeFullRunId: null,
        pending: null,
        deployedCommit: null,
      }
    );
  }

  function windowOpensAt(state) {
    return state.lastFullStartedAt === null
      ? now()
      : state.lastFullStartedAt + FULL_INTERVAL_MS;
  }

  async function saveRun(run) {
    await storage.put(`${RUN_PREFIX}${run.runId}`, {
      ...run,
      updatedAt: iso(),
    });
  }

  async function pruneRuns() {
    const runs = [...(await storage.list({ prefix: RUN_PREFIX })).values()]
      .filter((run) => run.state === "succeeded" || run.state === "failed")
      .sort((left, right) => right.requestedAt.localeCompare(left.requestedAt));
    for (const run of runs.slice(LIVE_RUN_LIMIT)) {
      await storage.delete(`${RUN_PREFIX}${run.runId}`);
      await storage.delete(`${TARGETS_PREFIX}${run.runId}`);
    }
  }

  async function finish(run, state, message) {
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

  // Every active case of every run, newest declaration first.
  async function fullTargets() {
    const targets = [];
    let cursor;
    do {
      const page = await archive.listRuns({ cursor, limit: 100 });
      const runs = [...page.runs].sort((left, right) =>
        right.createdAt.localeCompare(left.createdAt),
      );
      for (const run of runs) {
        for (const entry of run.catalogue) {
          if (
            entry.status === "active" &&
            !targets.some((target) => sameIdentity(target, entry))
          )
            targets.push(targetOf(entry, run));
        }
      }
      cursor = page.cursor;
    } while (cursor);
    return targets;
  }

  async function startFull(state, request) {
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
      ...state,
      lastFullStartedAt: now(),
      activeFullRunId: runId,
      pending: null,
    });
    await setAlarm(now());
    return run;
  }

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
    if (!state.activeFullRunId && now() >= windowOpensAt(state)) {
      const run = await startFull(state, request);
      return { state: "started", run: publicRun(run) };
    }
    // A request inside the window waits in the one pending slot; the newest
    // request replaces an older one, so the run captures the latest deploy.
    const opensAt = windowOpensAt(state);
    await storage.put(SCHEDULE_KEY, { ...state, pending: request });
    if (!state.activeFullRunId) await setAlarm(opensAt);
    return { state: "scheduled", startsAt: new Date(opensAt).toISOString() };
  }

  // The host's clock calls this with the commit its build receipt names; a
  // commit not seen before is a deploy, and asks for a full capture.
  async function noticeDeploy({ commit, baseURL }) {
    if (typeof commit !== "string" || !/^[0-9a-f]{40}$/.test(commit))
      throw new TypeError("commit must be a full lowercase commit");
    const state = await schedule();
    if (state.deployedCommit === commit) return { state: "unchanged" };
    await storage.put(SCHEDULE_KEY, { ...state, deployedCommit: commit });
    return requestFull({
      trigger: "deploy",
      person: { subject: "deploy" },
      baseURL,
    });
  }

  async function stepFull(run) {
    let current = run;
    let targets = await storage.get(`${TARGETS_PREFIX}${run.runId}`);
    const session = await openSession();
    try {
      const provenance = await session.provenance(current.baseURL);
      if (current.state === "queued") {
        targets = await fullTargets();
        await storage.put(`${TARGETS_PREFIX}${run.runId}`, targets);
        current = {
          ...current,
          state: "running",
          startedAt: iso(),
          commit: provenance.commit,
          ref: provenance.ref,
          verified: provenance.verified,
          browser: session.browser,
          total: shotCount(targets),
        };
      } else if (provenance.commit !== current.commit) {
        return finish(
          current,
          "failed",
          `Storybook moved to ${provenance.commit} during the run; the next run captures it`,
        );
      }
      const end = Math.min(
        current.done + current.failed + FULL_BATCH_SHOTS,
        current.total,
      );
      for (let index = current.done + current.failed; index < end; index += 1) {
        const shot = shotAt(targets, index);
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
          current = {
            ...current,
            done: current.done + 1,
            referenceIds: [...current.referenceIds, reference.referenceId],
          };
        } catch (error) {
          current = {
            ...current,
            failed: current.failed + 1,
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
    if (current.done + current.failed < current.total) {
      await saveRun(current);
      await setAlarm(now());
      return current;
    }
    return finish(
      current,
      current.failed === 0 ? "succeeded" : "failed",
      current.failed === 0 ? undefined : `${current.failed} shot(s) failed`,
    );
  }

  // The host wakes the coordinator here: a full run takes its next batch, and
  // a pending request starts once its window opens.
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
      if (result.state === "succeeded" || result.state === "failed") {
        const after = await schedule();
        await storage.put(SCHEDULE_KEY, { ...after, activeFullRunId: null });
        if (after.pending)
          await setAlarm(Math.max(now(), windowOpensAt(after)));
      }
      return;
    }
    if (state.pending) {
      if (now() >= windowOpensAt(state)) await startFull(state, state.pending);
      else await setAlarm(windowOpensAt(state));
    }
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
      references.push(
        await archive.createReference(
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
        ),
      );
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
        lastFullStartedAt:
          state.lastFullStartedAt === null
            ? null
            : new Date(state.lastFullStartedAt).toISOString(),
        nextFullAt: new Date(
          Math.max(now(), windowOpensAt(state)),
        ).toISOString(),
        activeFullRunId: state.activeFullRunId,
        pending: state.pending,
        deployedCommit: state.deployedCommit ?? null,
      },
      runs,
    };
  }

  return {
    requestFull,
    noticeDeploy,
    captureFocused,
    alarm,
    createApproval,
    listApprovals,
    status,
  };
}
