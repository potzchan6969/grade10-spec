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
import { isLandingWord, wordOf } from "./slack.ts";

export type Reason = "plan" | "message" | "landing";

/** A message waits 60 s so a hand's three sentences are one wake; a plan and a
 * landing wake at once, because nothing more is coming. A message that says a
 * landing word waits for nothing either, which `debounceFor` reads off the
 * line itself rather than off the reason. */
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

/** How many lines a room holds for the next wake. Bounded for the same reason
 * `seen` is: a thread nobody wakes would otherwise grow a room's state without
 * end. What falls off the front is said in the thread, so a hand reads that
 * the wake did not carry everything. */
export const PENDING_MAX = 200;

/** How many words of the opening message name a room with no change. */
const SUBJECT_WORDS = 8;

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
  /** The wake counter. The running wake's token names this number, so a token
   * from the wake before is refused the moment the next one starts. */
  wake: number;
  /** The running wake's reason, or null when nothing is running: a room is
   * running exactly while it has a reason. */
  reason: Reason | null;
  /** The reason of the wake that waits — through the debounce, or through a
   * run. Null is the room having nothing behind it. */
  queued: Reason | null;
  pending: RoomMessage[];
  /** The lines the running wake carries. A wake the budget cuts answered none
   * of them, so they go back to the front of `pending` for the wake after it;
   * a run that says it is done has read them and they go. */
  carried: RoomMessage[];
  /** How many lines fell off the front of `pending`, until a wake says so. */
  dropped: number;
  thread: Thread | null;
  change: string | null;
  /** The first words said in this room, which name a room no change is bound
   * to. */
  opened: string | null;
  /** The latest landing word said in this room, and the member who said it,
   * kept until the run that may land on them says it is done: `land` then
   * `thanks!` lands, one word lands every artifact of the chain, and a chain
   * the budget cut is finished by the next wake on the same word. */
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
  /** The member whose word this wake may land, else the latest line. A
   * landing wake has none. */
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
  /** Lines another room dropped before it handed this one over, counted into
   * this room's own: a bind moves the queue, and what the queue never carried
   * moves with it. */
  dropped?: number;
}

export function freshRoom(): RoomState {
  return {
    wake: 0,
    reason: null,
    queued: null,
    pending: [],
    carried: [],
    dropped: 0,
    thread: null,
    change: null,
    opened: null,
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
 * debounce, and a landing word starts none — it wakes the run at once; a
 * running room only remembers that something came in, because a room runs one
 * wake at a time and the run reads the branch and the thread again when it
 * fires.
 */
export function enqueue(
  state: RoomState,
  input: EnqueueInput,
  now: number,
): Step {
  const said = input.message
    ? [...state.pending, input.message]
    : state.pending;
  const pending = said.slice(-PENDING_MAX);
  const next: RoomState = {
    ...state,
    thread: input.thread ?? state.thread,
    change: input.change ?? state.change,
    opened:
      state.opened ??
      (input.message ? firstWords(input.message.text) : state.opened),
    pending,
    dropped:
      state.dropped + (said.length - pending.length) + (input.dropped ?? 0),
    queued: stronger(state.queued, input.reason),
  };
  if (state.reason !== null) return { state: next, commands: [] };
  const at = now + debounceFor(input);
  // A second message inside the debounce does not push the wake further out —
  // otherwise a thread that keeps talking never wakes at all. A reason that
  // needs no debounce, and a landing word that closes the burst, pull the
  // alarm in.
  if (state.alarm && state.alarm.at <= at) return { state: next, commands: [] };
  return {
    state: { ...next, alarm: { kind: "debounce", at } },
    commands: [{ kind: "setAlarm", at }],
  };
}

/** How long this arrival waits. A landing word waits for nothing — nothing
 * more is coming after `land` — and its reason stays `message`, so the wake
 * it starts keeps the reply's own budget. */
function debounceFor(input: EnqueueInput): number {
  if (isLandingWord(input.message?.text ?? null)) return 0;
  return DEBOUNCE_MS[input.reason];
}

/** The debounce elapsed, or a run finished with something behind it: the wake
 * starts, with everything that waited. The reason is the one that waited —
 * nothing falls back to a reason nobody asked for. */
function startWake(state: RoomState, reason: Reason, now: number): Step {
  const wake = state.wake + 1;
  const expiresAt = now + BUDGET_MS[reason];
  // The word is the latest landing word of the burst, and a burst that says
  // none leaves the one the room already held: the run's `done` is what
  // spends it.
  const said = [...state.pending]
    .reverse()
    .find((message) => isLandingWord(message.text));
  const commands: Command[] = [{ kind: "setAlarm", at: expiresAt }];
  if (state.dropped > 0)
    commands.push({ kind: "post", text: droppedLine(state.dropped) });
  commands.push({
    kind: "fire",
    wake: {
      wake,
      reason,
      change: state.change,
      thread: state.thread,
      messages: state.pending,
      // Whose word this wake may land: the member who said it, whoever spoke
      // after. A burst that said none leaves the word the room already held,
      // so its sayer is the sender of that wake too, and a wake with no word
      // at either end is the latest line's.
      sender:
        said?.slack ?? state.senderSlack ?? state.pending.at(-1)?.slack ?? null,
      expiresAt,
    },
  });
  return {
    state: {
      ...state,
      wake,
      reason,
      word: said ? wordOf(said.text) : state.word,
      senderSlack: said ? said.slack : state.senderSlack,
      queued: null,
      pending: [],
      carried: state.pending,
      dropped: 0,
      run: null,
      alarm: { kind: "budget", at: expiresAt },
    },
    // The budget is set before the fire, so a fire that never answers still
    // leaves the room with an alarm that frees it.
    commands,
  };
}

/** The run started: the ack carries the wake's subject and, where the runner
 * named a session, its link — so a wake that dies later still has one. A
 * runner that named none took the fire all the same, so the ack says the wake
 * started and the link is missing; a wake that did not start is the budget's
 * line and `fireFailed`'s. */
export function fired(state: RoomState, run: RunHandle | null): Step {
  return {
    state: { ...state, run },
    commands: [
      {
        kind: "post",
        text: `Reading ${subjectOf(state)}… ${run ? run.url : "(the runner named no session)"}`,
      },
    ],
  };
}

/** The fire itself failed. The thread reads what the runner said and the room
 * is free: nothing waits, because nothing is going to start on its own. */
export function fireFailed(state: RoomState, why: string): Step {
  return {
    state: {
      ...state,
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
 * alongside the wake that just ended. The lines the wake carried go: the run
 * read them and answered in the thread. */
export function done(state: RoomState, now: number): Step {
  const read: RoomState = { ...state, carried: [] };
  const queued = read.queued;
  if (queued) {
    const step = startWake({ ...read, alarm: null }, queued, now);
    return {
      state: step.state,
      commands: [{ kind: "clearAlarm" }, ...step.commands],
    };
  }
  return {
    state: {
      ...read,
      reason: null,
      queued: null,
      run: null,
      alarm: null,
    },
    commands: [{ kind: "clearAlarm" }],
  };
}

/**
 * The alarm went off: the debounce elapsed, or the budget ran out with no
 * `done`.
 *
 * Three rings say nothing about a wake, and each leaves the room differently.
 * An alarm no timer of this room's set answers nothing at all. A budget alarm
 * before its time is armed again, because the runtime holds one alarm per
 * room and a ring the room ignored would otherwise leave a running wake with
 * nothing to free it. A budget alarm on a room that is running nothing is
 * cleared, because it outlived the wake it was set for.
 */
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
  if (state.alarm?.kind !== "budget") return { state, commands: [] };
  if (now < state.alarm.at)
    return { state, commands: [{ kind: "setAlarm", at: state.alarm.at }] };
  if (state.reason === null)
    return {
      state: { ...state, alarm: null },
      commands: [{ kind: "clearAlarm" }],
    };
  const text = state.run
    ? `${nameOf(state.reason)} of ${subjectOf(state)} did not finish: ${state.run.url}`
    : didNotStart(state);
  const step = done(carriedBack(state), now);
  return {
    state: step.state,
    commands: [{ kind: "post", text }, ...step.commands],
  };
}

/** The run names the change it opened or picked up. */
export function bind(state: RoomState, change: string): RoomState {
  return { ...state, change };
}

/** The lines a cut wake carried, back at the front of the queue: the wake
 * answered none of them, so the wake after it reads them again, ahead of
 * whatever arrived since and bounded the way `pending` is. */
function carriedBack(state: RoomState): RoomState {
  const all = [...state.carried, ...state.pending];
  const pending = all.slice(-PENDING_MAX);
  return {
    ...state,
    pending,
    carried: [],
    dropped: state.dropped + (all.length - pending.length),
  };
}

/** The run that the word woke is done with it: the next wake starts without
 * it, so one word lands one chain and no more. A landing does not spend it —
 * a chain is one word and one landing call per artifact. */
export function consumeWord(state: RoomState): RoomState {
  return { ...state, word: null, senderSlack: null };
}

/** A call from a session is the running wake's, or it is nobody's. */
export function isRunningWake(state: RoomState, wake: number): boolean {
  return state.reason !== null && state.wake === wake;
}

/** What a line in the thread calls the room it is about: the change, or the
 * words the thread opened with until a run names one. */
function subjectOf(state: RoomState): string {
  return state.change ?? state.opened ?? "this thread";
}

/** How a line names the wake it is about. A room with no reason is a room
 * nothing is running in, which the line says rather than naming a reason
 * nobody asked for. */
function nameOf(reason: Reason | null): string {
  return reason === null ? "The wake" : WAKE_NAME[reason];
}

/** The one sentence for a wake nothing is running behind: said by the budget
 * that found no link, and by the fire the runner refused. */
function didNotStart(state: RoomState): string {
  return `${nameOf(state.reason)} of ${subjectOf(state)} did not start.`;
}

/** What the wake says about the lines it is not carrying. */
function droppedLine(dropped: number): string {
  const lines = dropped === 1 ? "line is" : "lines are";
  return `${dropped} earlier ${lines} not in this wake: the room keeps the latest ${PENDING_MAX}.`;
}

/** The opening message, short enough to name a room in one line: the app's
 * mention off the front, the whitespace collapsed. */
function firstWords(text: string): string | null {
  const words = text
    .replace(/^\s*<@[^>]+>/, "")
    .trim()
    .split(/\s+/)
    .filter((word) => word !== "");
  if (words.length === 0) return null;
  const first = words.slice(0, SUBJECT_WORDS).join(" ");
  return words.length > SUBJECT_WORDS ? `${first}…` : first;
}
