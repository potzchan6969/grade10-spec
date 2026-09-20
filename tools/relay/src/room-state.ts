/**
 * One room's state machine, pure. Every transition takes the state, what
 * arrived and the clock, and answers with the next state and the commands the
 * Durable Object carries out — so the whole of "one running wake per room" is
 * read in a test with no runtime, no storage and no network.
 *
 * The room has one alarm, and it wears two hats: the debounce that gathers a
 * burst of messages into one wake, then the budget that frees a room whose run
 * never said it was done. `alarm.kind` says which is set.
 */

export type Reason = "plan" | "message" | "landing";

/** A message waits 60 s so a hand's three sentences are one wake; a plan and a
 * landing wake at once, because nothing more is coming. */
export const DEBOUNCE_MS: Record<Reason, number> = {
  message: 60_000,
  plan: 0,
  landing: 0,
};

/** What a wake is allowed to take. A run pushes after every artifact, so a
 * wake that dies loses one artifact, not the plan. */
export const BUDGET_MS: Record<Reason, number> = {
  message: 30 * 60_000,
  landing: 30 * 60_000,
  plan: 120 * 60_000,
};

/** How a line in the thread names the wake it is about. */
export const WAKE_NAME: Record<Reason, string> = {
  plan: "The plan",
  message: "The reply",
  landing: "The read again",
};

/** Which reason wins when two wakes wait for one room: a plan needs the long
 * budget and a landing needs no debounce, so the stronger reason carries both
 * of its numbers. */
const PRECEDENCE: Record<Reason, number> = { plan: 3, landing: 2, message: 1 };

/** How many arrivals a room remembers it has already answered. A burst of
 * Slack retries is a handful; 200 is a day of a busy thread and a bounded
 * state, which a list in storage was not. */
export const SEEN_MAX = 200;

export interface RoomMessage {
  slack: string;
  text: string;
  ts: string;
}

export interface Thread {
  channel: string;
  ts: string;
}

export interface RunHandle {
  url: string;
}

export interface RoomState {
  status: "idle" | "running";
  /** The wake counter. The running wake's token names this number, so a token
   * from the wake before is refused the moment the next one starts. */
  wake: number;
  /** The running wake's reason, or null when idle. */
  reason: Reason | null;
  /** The reason of the wake that waits — through the debounce, or through a
   * run. Null is the room having nothing behind it. */
  queued: Reason | null;
  pending: RoomMessage[];
  thread: Thread | null;
  change: string | null;
  /** The last thing said before this wake started, and who said it: the word a
   * landing on a word is checked against. */
  word: string | null;
  senderSlack: string | null;
  run: RunHandle | null;
  /** What this room has already answered — a Slack message by its channel and
   * `ts`, a landing wake by its change and head — newest last. */
  seen: string[];
  alarm: { kind: "debounce" | "budget"; at: number } | null;
}

export interface Wake {
  wake: number;
  reason: Reason;
  change: string | null;
  thread: Thread | null;
  messages: RoomMessage[];
  /** The last thing said before the wake started, and the member who said
   * it: the wake carries its own sender rather than the payload picking one
   * out of the messages. */
  word: string | null;
  sender: string | null;
  /** The token's `exp`: this wake's start plus its budget. */
  expiresAt: number;
}

export type Command =
  | { kind: "fire"; wake: Wake }
  | { kind: "post"; text: string }
  | { kind: "setAlarm"; at: number }
  | { kind: "clearAlarm" };

export interface Step {
  state: RoomState;
  commands: Command[];
}

export interface EnqueueInput {
  reason: Reason;
  thread?: Thread;
  /** The change this wake is about, where the caller knows it: a landing wake
   * is addressed by the change, and a first sentence is not. */
  change?: string;
  message?: RoomMessage;
}

export function freshRoom(): RoomState {
  return {
    status: "idle",
    wake: 0,
    reason: null,
    queued: null,
    pending: [],
    thread: null,
    change: null,
    word: null,
    senderSlack: null,
    run: null,
    seen: [],
    alarm: null,
  };
}

function stronger(a: Reason | null, b: Reason): Reason {
  if (a === null) return b;
  return PRECEDENCE[a] >= PRECEDENCE[b] ? a : b;
}

/** Whether this room has already answered an arrival. */
export function seenBefore(state: RoomState, key: string): boolean {
  return state.seen.includes(key);
}

/** The arrival remembered, the oldest dropped once the list is full. */
export function remember(state: RoomState, key: string): RoomState {
  return { ...state, seen: [...state.seen, key].slice(-SEEN_MAX) };
}

/**
 * A message, a first sentence or a landing arrives. An idle room starts its
 * debounce; a running room only remembers that something came in, because a
 * room runs one wake at a time and the run reads the branch and the thread
 * again when it fires.
 */
export function enqueue(
  state: RoomState,
  input: EnqueueInput,
  now: number,
): Step {
  const next: RoomState = {
    ...state,
    thread: input.thread ?? state.thread,
    change: input.change ?? state.change,
    pending: input.message ? [...state.pending, input.message] : state.pending,
    queued: stronger(state.queued, input.reason),
  };
  if (state.status === "running") return { state: next, commands: [] };
  const at = now + DEBOUNCE_MS[input.reason];
  // A second message inside the debounce does not push the wake further out —
  // otherwise a thread that keeps talking never wakes at all. A reason that
  // needs no debounce pulls the alarm in.
  if (state.alarm && state.alarm.at <= at) return { state: next, commands: [] };
  return {
    state: { ...next, alarm: { kind: "debounce", at } },
    commands: [{ kind: "setAlarm", at }],
  };
}

/** The debounce elapsed, or a run finished with something behind it: the wake
 * starts, with everything that waited. The reason is the one that waited —
 * nothing falls back to a reason nobody asked for. */
function startWake(state: RoomState, reason: Reason, now: number): Step {
  const wake = state.wake + 1;
  const expiresAt = now + BUDGET_MS[reason];
  const last = state.pending.at(-1) ?? null;
  return {
    state: {
      ...state,
      status: "running",
      wake,
      reason,
      word: last?.text ?? null,
      senderSlack: last?.slack ?? null,
      queued: null,
      pending: [],
      run: null,
      alarm: { kind: "budget", at: expiresAt },
    },
    // The budget is set before the fire, so a fire that never answers still
    // leaves the room with an alarm that frees it.
    commands: [
      { kind: "setAlarm", at: expiresAt },
      {
        kind: "fire",
        wake: {
          wake,
          reason,
          change: state.change,
          thread: state.thread,
          messages: state.pending,
          word: last?.text ?? null,
          sender: last?.slack ?? null,
          expiresAt,
        },
      },
    ],
  };
}

/** The run started and named itself: the ack carries the link, so a wake that
 * dies later still has one. */
export function fired(state: RoomState, run: RunHandle): Step {
  return {
    state: { ...state, run },
    commands: [{ kind: "post", text: `Reading… ${run.url}` }],
  };
}

/** The fire itself failed. The thread reads what the runner said and the room
 * is free: nothing waits, because nothing is going to start on its own. */
export function fireFailed(state: RoomState, why: string): Step {
  return {
    state: {
      ...state,
      status: "idle",
      reason: null,
      queued: null,
      run: null,
      alarm: null,
    },
    commands: [
      {
        kind: "post",
        text: `${nameOf(state.reason)} of ${subjectOf(state)} did not start: ${why}`,
      },
      { kind: "clearAlarm" },
    ],
  };
}

/** The run's last act. A room with something behind it fires again — never
 * alongside the wake that just ended. */
export function done(state: RoomState, now: number): Step {
  const queued = state.queued;
  if (queued) {
    const step = startWake({ ...state, alarm: null }, queued, now);
    return {
      state: step.state,
      commands: [{ kind: "clearAlarm" }, ...step.commands],
    };
  }
  return {
    state: {
      ...state,
      status: "idle",
      reason: null,
      queued: null,
      run: null,
      alarm: null,
    },
    commands: [{ kind: "clearAlarm" }],
  };
}

/** The alarm went off: the debounce elapsed, or the budget ran out with no
 * `done`. A budget alarm on a room that is not running answers nothing —
 * there is no wake to say anything about. */
export function onAlarm(state: RoomState, now: number): Step {
  if (state.alarm?.kind === "debounce") {
    const queued = state.queued;
    if (!queued)
      return {
        state: { ...state, alarm: null },
        commands: [{ kind: "clearAlarm" }],
      };
    return startWake({ ...state, alarm: null }, queued, now);
  }
  if (state.status !== "running") return { state, commands: [] };
  const name = nameOf(state.reason);
  const text = state.run
    ? `${name} of ${subjectOf(state)} did not finish: ${state.run.url}`
    : `${name} of ${subjectOf(state)} did not start.`;
  const step = done(state, now);
  return {
    state: step.state,
    commands: [{ kind: "post", text }, ...step.commands],
  };
}

/** The run names the change it opened or picked up. */
export function bind(state: RoomState, change: string): RoomState {
  return { ...state, change };
}

/** A call from a session is the running wake's, or it is nobody's. */
export function isRunningWake(state: RoomState, wake: number): boolean {
  return state.status === "running" && state.wake === wake;
}

/** What a line in the thread calls the room it is about. */
function subjectOf(state: RoomState): string {
  return state.change ?? "this thread";
}

/** How a line names the wake it is about. A room with no reason is a room
 * nothing is running in, which the line says rather than naming a reason
 * nobody asked for. */
function nameOf(reason: Reason | null): string {
  return reason === null ? "The wake" : WAKE_NAME[reason];
}
