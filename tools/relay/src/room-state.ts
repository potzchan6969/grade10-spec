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

/** Which reason wins when two wakes wait for one room: a plan needs the long
 * budget and a landing needs no debounce, so the stronger reason carries both
 * of its numbers. */
const PRECEDENCE: Record<Reason, number> = { plan: 3, landing: 2, message: 1 };

export interface RoomMessage {
  slack: string;
  text: string;
  ts: string;
}

export interface Landing {
  base: string;
  head: string;
}

export interface Thread {
  channel: string;
  ts: string;
}

export interface RunHandle {
  id: string;
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
   * run. */
  queued: Reason | null;
  pending: RoomMessage[];
  dirty: boolean;
  thread: Thread | null;
  change: string | null;
  lastPostTs: string | null;
  landing: Landing | null;
  /** The last thing said before this wake started, and who said it: the word a
   * landing on a word is checked against. */
  word: string | null;
  senderSlack: string | null;
  run: RunHandle | null;
  alarm: { kind: "debounce" | "budget"; at: number } | null;
}

export interface Wake {
  wake: number;
  reason: Reason;
  change: string | null;
  thread: Thread | null;
  messages: RoomMessage[];
  landing: Landing | null;
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
  message?: RoomMessage;
  landing?: Landing;
}

export function freshRoom(): RoomState {
  return {
    status: "idle",
    wake: 0,
    reason: null,
    queued: null,
    pending: [],
    dirty: false,
    thread: null,
    change: null,
    lastPostTs: null,
    landing: null,
    word: null,
    senderSlack: null,
    run: null,
    alarm: null,
  };
}

function stronger(a: Reason | null, b: Reason): Reason {
  if (a === null) return b;
  return PRECEDENCE[a] >= PRECEDENCE[b] ? a : b;
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
    landing: input.landing ?? state.landing,
    pending: input.message ? [...state.pending, input.message] : state.pending,
    queued: stronger(state.queued, input.reason),
  };
  if (state.status === "running")
    return { state: { ...next, dirty: true }, commands: [] };
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
 * starts, with everything that waited. */
function startWake(state: RoomState, now: number): Step {
  const reason = state.queued ?? state.reason ?? "message";
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
      dirty: false,
      // The landing goes with the wake that carries it, so the wake after it
      // does not read a landing that is already answered.
      landing: null,
      run: null,
      alarm: { kind: "budget", at: expiresAt },
    },
    commands: [
      {
        kind: "fire",
        wake: {
          wake,
          reason,
          change: state.change,
          thread: state.thread,
          messages: state.pending,
          landing: state.landing,
          expiresAt,
        },
      },
      { kind: "setAlarm", at: expiresAt },
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

/** The run's last act. A room with messages behind it fires again — never
 * alongside the wake that just ended. */
export function done(state: RoomState, now: number): Step {
  if (state.dirty) {
    const step = startWake({ ...state, alarm: null }, now);
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
      dirty: false,
      run: null,
      alarm: null,
    },
    commands: [{ kind: "clearAlarm" }],
  };
}

/** The budget ran out with no `done`. The thread reads what happened and the
 * room is free again. */
export function onAlarm(state: RoomState, now: number): Step {
  if (state.alarm?.kind === "debounce")
    return startWake({ ...state, alarm: null }, now);
  const subject = state.change ?? "this thread";
  const text = state.run
    ? `The read again of ${subject} did not finish: ${state.run.url}`
    : `The read again of ${subject} did not start.`;
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

/** The mark for "messages since the run's last post". */
export function posted(state: RoomState, ts: string): RoomState {
  return { ...state, lastPostTs: ts };
}

/** A call from a session is the running wake's, or it is nobody's. */
export function isRunningWake(state: RoomState, wake: number): boolean {
  return state.status === "running" && state.wake === wake;
}
