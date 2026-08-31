import { useEffect, useSyncExternalStore } from "react";
import type { Snapshot } from "../api/types";
import { REPO } from "../editor/config";
import {
  type Answer,
  githubCall,
  refPath,
  repoPath,
} from "../editor/github-api";

/**
 * Whether the site you are reading is the store as it stands. Editing writes
 * a branch a workflow deploys, so three facts decide it: how
 * old the deployed snapshot is, whether the branch has moved past it, and how
 * the last deploy of it ended. The first is always known; the other two need
 * a token, and each degrades on its own — a token without `actions:read`
 * still answers the second.
 *
 * The question is asked again while the tab is being looked at, so somebody
 * else's push reaches you rather than only your own push failing. Nothing is
 * asked of a tab nobody is looking at.
 */

/** The deploy workflow this app is published by. */
export const WORKFLOW = "manual.yml";

/** Long enough that a session costs a handful of requests an hour, short
 * enough that a push somebody else made is news while it still is. */
export const POLL_MS = 90_000;

const FAILED = new Set([
  "failure",
  "timed_out",
  "cancelled",
  "startup_failure",
  "action_required",
]);

export type DeployRun = {
  /** Null while the run is still going. */
  conclusion: string | null;
  status: string;
  url: string;
  at: string;
};

/** `unknown` is the un-probed state — no token, so nobody looked. It must
 * never wear the all-clear: a frozen site behind a red deploy looks exactly
 * like this to a tokenless reader. */
export type HealthLevel = "unknown" | "quiet" | "warn" | "bad";

export type Health = {
  key: string;
  generatedAt: string;
  storeHead: string;
  /** Live head of the base branch, and how far past the snapshot it is —
   * `ahead` is null when the compare could not say. */
  live: { head: string; ahead: number | null } | null;
  deploy: DeployRun | null;
  level: HealthLevel;
};

/** A red deploy hides the whole store, so it outranks a branch that moved. */
export function healthLevel(
  storeHead: string,
  live: Health["live"],
  deploy: DeployRun | null,
): HealthLevel {
  if (deploy?.conclusion && FAILED.has(deploy.conclusion)) return "bad";
  if (live && live.head !== storeHead) return "warn";
  return "quiet";
}

let state: Health | null = null;
let probing: string | null = null;
let asking: { key: string; run: Promise<void> } | null = null;
let lastHead: string | null = null;
const listeners = new Set<() => void>();
const headListeners = new Set<(head: string) => void>();

function set(next: Health): void {
  state = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function keyOf(storeHead: string, token: string | null): string {
  return `${storeHead}|${token ? "token" : "none"}`;
}

/** The ref moved past the head this session last saw. Whoever holds staged
 * drafts listens: a page that changed underneath is worth saying before a
 * push turns it into a conflict. */
export function onLiveHead(listener: (head: string) => void): () => void {
  headListeners.add(listener);
  return () => headListeners.delete(listener);
}

/** A push this tab made moves the ref as surely as anybody else's, and the
 * strip must not wait out the interval to say so. */
export function noteLiveHead(head: string): void {
  if (head === lastHead) return;
  if (state) {
    // Nobody counted how far ahead it is; saying it moved is the fact.
    const live = { head, ahead: null };
    set({
      ...state,
      live,
      level: healthLevel(state.storeHead, live, state.deploy),
    });
  }
  announceHead(head);
}

function announceHead(head: string): void {
  if (head === lastHead) return;
  lastHead = head;
  for (const listener of headListeners) listener(head);
}

/** The banner and the header pip ask the same question; one probe answers
 * both, and it is asked again while the tab is visible. */
export function useManualHealth(
  snapshot: Snapshot | null,
  token: string | null,
  http: typeof fetch = fetch,
): Health | null {
  const health = useSyncExternalStore(
    subscribe,
    () => state,
    () => state,
  );
  useEffect(() => {
    if (!snapshot) return;
    return start(snapshot, token, http);
  }, [snapshot, token, http]);
  return health;
}

function start(
  snapshot: Snapshot,
  token: string | null,
  http: typeof fetch,
): () => void {
  const key = keyOf(snapshot.storeHead, token);
  if (probing !== key) {
    probing = key;
    // The deployed head is the last head this session knows of, so the first
    // answer that differs is already news.
    lastHead = snapshot.storeHead;
    set({
      key,
      generatedAt: snapshot.generatedAt,
      storeHead: snapshot.storeHead,
      live: null,
      deploy: null,
      level: "unknown",
    });
    if (token) void ask(snapshot, token, http, key);
  }

  return watchHead({
    ask: () => ask(snapshot, token, http, key),
    visible: browserVisible,
    wake: browserWake,
    // A token buys 5000 requests an hour; anonymous readers get 60, so they
    // ask when they come back and never on a timer.
    polls: token !== null,
  });
}

/** One probe at a time, however many wake-ups arrive at once. */
function ask(
  snapshot: Snapshot,
  token: string | null,
  http: typeof fetch,
  key: string,
): Promise<void> {
  if (asking?.key === key) return asking.run;
  const run = look(snapshot, token, http, key)
    .catch((cause: unknown) => {
      console.warn("manual: the health probe failed", cause);
    })
    .finally(() => {
      if (asking?.run === run) asking = null;
    });
  asking = { key, run };
  return run;
}

async function look(
  snapshot: Snapshot,
  token: string | null,
  http: typeof fetch,
  key: string,
): Promise<void> {
  const asked = await probeHealth(http, token, snapshot.storeHead);
  // A newer snapshot or a new token started its own probe; this answer is
  // about a question nobody is asking any more.
  if (probing !== key || !state) return;
  // The probe counted how far ahead the ref is; announcing must not throw
  // that away, so the state it just wrote stands and only the news goes out.
  set({ ...state, ...asked });
  if (asked.live) announceHead(asked.live.head);
}

export type HeadWatch = {
  /** Re-asks the live head. Deduped by whoever supplies it. */
  ask: () => Promise<void>;
  /** Is anybody looking at this tab? */
  visible: () => boolean;
  /** Focus and visibility, as one "somebody is back" signal. */
  wake: (heard: () => void) => () => void;
  /** Whether this session can afford the interval as well as the wake-ups. */
  polls: boolean;
  every?: number;
};

/**
 * Ask again, while the tab is visible. Hidden is a full stop — no interval
 * runs and nothing is asked — and the return of focus both asks once and
 * starts the interval again, so a tab left open overnight costs nothing.
 */
export function watchHead(watch: HeadWatch): () => void {
  let timer: ReturnType<typeof setInterval> | null = null;

  const stopTimer = () => {
    if (timer !== null) clearInterval(timer);
    timer = null;
  };
  const startTimer = () => {
    if (timer !== null || !watch.polls || !watch.visible()) return;
    timer = setInterval(() => {
      void watch.ask();
    }, watch.every ?? POLL_MS);
  };

  const woke = () => {
    if (!watch.visible()) {
      stopTimer();
      return;
    }
    void watch.ask();
    startTimer();
  };

  const unwake = watch.wake(woke);
  startTimer();
  return () => {
    unwake();
    stopTimer();
  };
}

function browserVisible(): boolean {
  return (
    typeof document === "undefined" || document.visibilityState === "visible"
  );
}

function browserWake(heard: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("focus", heard);
  document.addEventListener("visibilitychange", heard);
  return () => {
    window.removeEventListener("focus", heard);
    document.removeEventListener("visibilitychange", heard);
  };
}

/** The three questions, asked of GitHub, each degrading on its own: a token
 * without `actions:read` still says whether the branch has moved. */
export async function probeHealth(
  http: typeof fetch,
  token: string | null,
  storeHead: string,
): Promise<Pick<Health, "live" | "deploy" | "level">> {
  const head = await liveHead(http, token);
  const ahead =
    head && head !== storeHead
      ? await commitsAhead(http, token, storeHead, head)
      : null;
  const deploy = await lastDeploy(http, token);
  const live = head ? { head, ahead } : null;
  return { live, deploy, level: healthLevel(storeHead, live, deploy) };
}

async function liveHead(
  http: typeof fetch,
  token: string | null,
): Promise<string | null> {
  const answer = await githubCall(http, token, refPath(REPO.defaultBranch));
  const object = (answer.body as Record<string, unknown>).object as
    | Record<string, unknown>
    | undefined;
  if (answer.status === 200 && typeof object?.sha === "string") {
    return object.sha;
  }
  console.warn(`manual: cannot read ${REPO.defaultBranch}`, answer);
  return null;
}

/** How far the branch has run past the snapshot. A count is nicer than "it
 * moved", and "it moved" is still true when the compare refuses. */
async function commitsAhead(
  http: typeof fetch,
  token: string | null,
  base: string,
  head: string,
): Promise<number | null> {
  const answer = await githubCall(
    http,
    token,
    repoPath(`compare/${base}...${head}`),
  );
  const ahead = (answer.body as Record<string, unknown>).ahead_by;
  if (answer.status === 200 && typeof ahead === "number") return ahead;
  console.warn(
    "manual: cannot compare the snapshot against the branch",
    answer,
  );
  return null;
}

/** The last run of the deploy workflow on the base branch. A token without
 * `actions:read` simply cannot see it — that piece drops off the banner
 * rather than the banner dropping. */
async function lastDeploy(
  http: typeof fetch,
  token: string | null,
): Promise<DeployRun | null> {
  const answer = await githubCall(
    http,
    token,
    repoPath(
      `actions/workflows/${WORKFLOW}/runs?branch=${REPO.defaultBranch}&per_page=1`,
    ),
  );
  const run = runOf(answer);
  if (answer.status !== 200) {
    // 403/404 is the expected answer for a contents-only token — the scope
    // note in settings says how to see deploys; anything else is a surprise.
    if (answer.status === 403 || answer.status === 404) {
      console.debug(`manual: no actions:read — ${WORKFLOW} runs stay unseen`);
    } else {
      console.warn(`manual: cannot read ${WORKFLOW} runs`, answer);
    }
    return null;
  }
  return run;
}

function runOf(answer: Answer): DeployRun | null {
  const runs = (answer.body as Record<string, unknown>).workflow_runs;
  const first = Array.isArray(runs) ? runs[0] : undefined;
  if (!first || typeof first !== "object") return null;

  const run = first as Record<string, unknown>;
  const url = run.html_url;
  const status = run.status;
  if (typeof url !== "string" || typeof status !== "string") return null;
  return {
    conclusion: typeof run.conclusion === "string" ? run.conclusion : null,
    status,
    url,
    at: typeof run.updated_at === "string" ? run.updated_at : "",
  };
}
