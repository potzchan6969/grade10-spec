/**
 * One room: the Durable Object behind one change, and behind one Slack thread
 * for as long as the wake that thread started is running.
 *
 * The change is the room's identity, because a landing wake is addressed by
 * the change and a thread is not always known when it arrives. A run names the
 * change with `bind`: the change's room takes that thread as its alias, so
 * every later message in the thread queues there and the queue this room had
 * gathered is handed across — and the wake stays where it started, because the
 * token the session holds names this room.
 *
 * It holds no rules. Every decision is `room-state.ts`'s, and this class does
 * what the commands say: keep the state, set the one alarm, fire the Routine,
 * post through the bot token, check a landing and move `main`. The Slack bot
 * token, the Routine token and the code-host token are read here, from the
 * environment, and never travel in a payload.
 */
import type { Env } from "./env.ts";
import { advanceMain, compareFiles, HostError, readFileAt } from "./github.ts";
import {
  checkReviewed,
  checkWord,
  type LandCheck,
  type Verdict,
} from "./land.ts";
import { recordPath, SCHEMA_PATH } from "./paths.ts";
import { payloadText } from "./payload.ts";
import {
  bind,
  consumeWord,
  done,
  type EnqueueInput,
  enqueue,
  fired,
  fireFailed,
  freshRoom,
  isRunningWake,
  onAlarm,
  type RoomState,
  remember,
  type Step,
  seenBefore,
  type Thread,
  type Wake,
} from "./room-state.ts";
import { changeRoom } from "./rooms.ts";
import { type Fired, fireRoutine } from "./routine.ts";
import { callRoom, json, type RoomOp } from "./rpc.ts";
import { type Confirm, confirmBlocks, postMessage } from "./slack.ts";
import { TEAM_MAP, TeamCache } from "./team.ts";
import { mintWakeToken } from "./token.ts";

/** Where the change's room is kept, once a run has named the change this
 * thread is about. */
const CHANGE_ROOM = "change-room";

/** The record's `thread:` line, as the round writes it. */
const THREAD_LINE = /^\s*thread:\s*"?([^\s"/]+)\/([^\s"]+)"?\s*$/m;

/** What went wrong, in the words the thread can read. */
const reasonOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/** A landing refused, naming the check that refused it: one answer for every
 * check, so a run reads the same shape whether the check was one of
 * `land.ts`'s readings or one the relay found while it fetched. */
const refused = (check: LandCheck): Response => json(403, { reason: check });

export class Room {
  private readonly ctx: DurableObjectState;
  private readonly env: Env;
  /** One cache per live room, which is one cache per change being answered. */
  private readonly team: TeamCache;
  /** The thread the change's record named, once one was read: a thread moves
   * nowhere, so it is read once per live room. */
  private recorded: Thread | null = null;
  /** Whether this instance has already said it could not read the record. */
  private toldOfRecord = false;

  constructor(ctx: DurableObjectState, env: Env) {
    this.ctx = ctx;
    this.env = env;
    this.team = new TeamCache(() => readFileAt(this.repo(), TEAM_MAP, "main"));
  }

  async fetch(request: Request): Promise<Response> {
    const op = (await request.json()) as RoomOp;
    const forwarded = await this.forward(op);
    if (forwarded) return forwarded;
    try {
      switch (op.op) {
        case "enqueue":
          return await this.onEnqueue(op);
        case "alias":
          return await this.onAlias(op);
        case "bind":
          return await this.onBind(op);
        case "post":
          return await this.onPost(op);
        case "land":
          return await this.onLand(op);
        case "done":
          return await this.onDone(op);
        case "alive":
          return await this.onAlive(op);
        default:
          return json(400, { reason: "unknown-op" });
      }
    } catch (error) {
      if (error instanceof HostError)
        return json(503, {
          reason: "host-unavailable",
          status: error.status,
          message: error.detail,
        });
      throw error;
    }
  }

  async alarm(): Promise<void> {
    const state = await this.load();
    await this.apply(onAlarm(state, Date.now()));
  }

  private repo() {
    return { repo: this.env.REPO, token: this.env.GITHUB_TOKEN };
  }

  private async load(): Promise<RoomState> {
    return (await this.ctx.storage.get<RoomState>("state")) ?? freshRoom();
  }

  private async put(state: RoomState): Promise<void> {
    await this.ctx.storage.put("state", state);
  }

  /** A message that arrives in a thread whose change a run has named belongs
   * to the change's room, which holds the queue for every edge the change is
   * reached on. Nothing else is forwarded: the wake's own calls are answered
   * here, because the wake never migrates. */
  private async forward(op: RoomOp): Promise<Response | null> {
    if (op.op !== "enqueue") return null;
    const to = await this.ctx.storage.get<string>(CHANGE_ROOM);
    if (!to) return null;
    const id = this.env.ROOM.idFromName(to);
    if (id.toString() === this.ctx.id.toString()) return null;
    return callRoom(this.env.ROOM.get(id), op);
  }

  private async onEnqueue(
    op: Extract<RoomOp, { op: "enqueue" }>,
  ): Promise<Response> {
    const stored = await this.ctx.storage.get<RoomState>("state");
    // A thread reply that mentions nobody continues a room that exists and
    // opens none.
    if (!stored && op.requireRoom)
      return json(200, { queued: false, why: "no-room" });
    const state = stored ?? freshRoom();
    if (op.dedupe && seenBefore(state, op.dedupe))
      return json(200, { queued: false, why: "duplicate" });
    const input: EnqueueInput = {
      reason: op.reason,
      thread: op.thread,
      change: op.change,
      message: op.message,
      dropped: op.dropped,
    };
    await this.apply(
      enqueue(
        op.dedupe ? remember(state, op.dedupe) : state,
        input,
        Date.now(),
      ),
    );
    return json(200, { queued: true });
  }

  /**
   * A thread's room says this change is what that thread is about. The change
   * takes it as the thread it answers in, and a message that arrives in it
   * from now on queues here.
   *
   * A room already running a wake of its own keeps its thread: a wake that
   * answered in a thread it never read is worse than a bind refused, and the
   * run is told to ask again.
   */
  private async onAlias(
    op: Extract<RoomOp, { op: "alias" }>,
  ): Promise<Response> {
    const state = await this.load();
    if (state.reason !== null)
      return json(409, { bound: false, reason: "room-busy" });
    await this.put({ ...state, change: op.change, thread: op.thread });
    return json(200, { aliased: op.change });
  }

  private async onBind(op: Extract<RoomOp, { op: "bind" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    const bound = bind(state, op.change);
    const id = this.env.ROOM.idFromName(changeRoom(op.change));
    if (id.toString() === this.ctx.id.toString()) {
      await this.put(bound);
      return json(200, { bound: op.change });
    }
    if (!state.thread) return json(400, { reason: "no-thread" });
    // The change's room takes this thread as its alias. The pointer runs the
    // other way from here: this room keeps the wake it is running, and the
    // change's room holds the thread and the queue.
    const answer = await callRoom(this.env.ROOM.get(id), {
      op: "alias",
      change: op.change,
      thread: state.thread,
    });
    if (!answer.ok) return answer;
    // The pointer sends what arrives from now on, so what already arrived is
    // handed across with it: a reply that queued between this wake's start
    // and the bind would otherwise wait in a room nothing wakes again.
    await this.put({ ...bound, queued: null, pending: [], dropped: 0 });
    await this.ctx.storage.put(CHANGE_ROOM, changeRoom(op.change));
    await this.hand(this.env.ROOM.get(id), op.change, state.thread, bound);
    return json(200, { bound: op.change });
  }

  /** The queue this room gathered, enqueued on the change's room: one call
   * per line, keyed the way the router keys it so a Slack retry of that line
   * is a duplicate there, and one message-less call for a reason that waited
   * with no line behind it. What this room dropped is counted into the first
   * line handed over, which is the wake there that says so. */
  private async hand(
    to: DurableObjectStub,
    change: string,
    thread: Thread,
    state: RoomState,
  ): Promise<void> {
    const reason = state.queued;
    if (!reason) return;
    let dropped = state.dropped;
    for (const message of state.pending) {
      await callRoom(to, {
        op: "enqueue",
        reason,
        dedupe: `slack:${thread.channel}/${message.ts}`,
        thread,
        change,
        message,
        dropped,
      });
      dropped = 0;
    }
    if (state.pending.length === 0)
      await callRoom(to, { op: "enqueue", reason, thread, change });
  }

  private async onPost(op: Extract<RoomOp, { op: "post" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    return json(200, { ts: await this.post(state, op.text, op.confirm) });
  }

  /** Whether the token's wake is still the one this room is running: the
   * guard asks before every push, so a run the room gave up on stops pushing
   * instead of landing on a thread that has moved on. */
  private async onAlive(
    op: Extract<RoomOp, { op: "alive" }>,
  ): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    return json(200, { alive: true });
  }

  /** The run's last act, and where the word is spent: one word lands every
   * artifact of the chain (`Q60`) and the run lands them one call at a time,
   * so the word is the wake's until the wake ends. A wake the budget cut
   * keeps it, which is how the next wake finishes the chain. */
  private async onDone(op: Extract<RoomOp, { op: "done" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    await this.apply(done(consumeWord(state), Date.now()));
    return json(200, { done: true });
  }

  private async onLand(op: Extract<RoomOp, { op: "land" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    const change = state.change;
    if (!change) return json(400, { reason: "no-change-bound" });
    const repo = this.repo();
    const compare = await compareFiles(repo, "main", op.sha);
    if ("truncated" in compare) return refused("compare-truncated");
    const record = recordPath(change);
    let verdict: Verdict;
    if (op.kind === "reviewed") {
      verdict = checkReviewed({
        change,
        paths: compare.paths,
        atMain: await readFileAt(repo, record, "main"),
        atSha: await readFileAt(repo, record, op.sha),
      });
    } else {
      let senderHandle: string | null = null;
      if (state.senderSlack) {
        try {
          senderHandle = await this.team.handleOf(state.senderSlack);
        } catch (error) {
          if (error instanceof HostError) throw error;
          // A map the relay cannot parse fails closed, and names itself: it
          // is a check like every other, not the relay being broken.
          return refused("map-unreadable");
        }
      }
      verdict = checkWord({
        change,
        artifact: op.artifact,
        word: state.word,
        senderHandle,
        record: await readFileAt(repo, record, op.sha),
        schema: await readFileAt(repo, SCHEMA_PATH, op.sha),
        paths: compare.paths,
      });
    }
    if (!verdict.ok) return refused(verdict.check);
    // The wake is asked for again here, against the state as it now reads:
    // the checks took several calls on the host, and a room its budget freed
    // in the meantime must not move `main` for a session it stopped waiting
    // for.
    const now = await this.load();
    if (!isRunningWake(now, op.wake))
      return json(401, { reason: "stale-wake" });
    const advance = await advanceMain(repo, op.sha);
    // The word is not spent here: the chain is one word and one call per
    // artifact, and `done` is what ends it.
    if ("landed" in advance) return json(200, { landed: advance.landed });
    return advance.refused === "not-fast-forward"
      ? json(409, { reason: "not-fast-forward" })
      : json(502, { reason: "host-refused", message: advance.message });
  }

  /** A post goes to the thread the room holds, then to the thread the record
   * names, then to the planning channel. A room addressed by a landing wake
   * has no thread of its own until a run binds one. A line the run asked a
   * button for is drawn as blocks, with its own text as the fallback. */
  private async post(
    state: RoomState,
    text: string,
    confirm?: Confirm,
  ): Promise<string> {
    const thread = state.thread ?? (await this.threadOf(state));
    return postMessage(
      this.env.SLACK_BOT_TOKEN,
      thread?.channel ?? this.env.PLANNING_CHANNEL,
      text,
      thread?.ts,
      confirm ? confirmBlocks(text, confirm) : undefined,
    );
  }

  /** A line the room says itself, best-effort: a post that does not land is
   * this room's own voice going missing, and never the reason a state already
   * committed is left with no alarm. */
  private async said(state: RoomState, text: string): Promise<void> {
    try {
      await this.post(state, text);
    } catch (error) {
      console.error(
        `relay room ${this.ctx.id.toString()}: "${text}" did not post: ${reasonOf(error)}`,
      );
    }
  }

  /** The thread the change's record names on `main`. A record that named one
   * is held: a thread moves nowhere, and reading it again on every line is a
   * call on the host per post. A record that names none, and a change the
   * relay cannot read, are read again for the next line — the `thread:` the
   * round has just written is read by the line after it — and meanwhile the
   * post falls back to the planning channel, with the dropped read reported
   * once rather than on every line. */
  private async threadOf(state: RoomState): Promise<Thread | null> {
    if (this.recorded) return this.recorded;
    if (!state.change) return null;
    let text: string;
    try {
      text = await readFileAt(this.repo(), recordPath(state.change), "main");
    } catch (error) {
      if (!this.toldOfRecord) {
        this.toldOfRecord = true;
        console.error(
          `relay room ${this.ctx.id.toString()}: the record of ${state.change} could not be read: ${reasonOf(error)}`,
        );
      }
      return null;
    }
    const line = THREAD_LINE.exec(text);
    if (!line) return null;
    this.recorded = { channel: line[1], ts: line[2] };
    return this.recorded;
  }

  /** Carry out one step: the state, then its alarm and its fire, and the
   * lines it says last — so a post that fails cannot leave a committed state
   * without the alarm that frees it. */
  private async apply(step: Step): Promise<RoomState> {
    const lines: string[] = [];
    const state = await this.carry(step, lines);
    for (const line of lines) await this.said(state, line);
    return state;
  }

  /** The state and the commands that change it, with what the step says
   * collected for the caller to post. */
  private async carry(step: Step, lines: string[]): Promise<RoomState> {
    let state = step.state;
    await this.put(state);
    for (const command of step.commands) {
      switch (command.kind) {
        case "setAlarm":
          await this.ctx.storage.setAlarm(command.at);
          break;
        case "clearAlarm":
          await this.ctx.storage.deleteAlarm();
          break;
        case "post":
          lines.push(command.text);
          break;
        case "fire": {
          // The payload is built before the try: a payload the relay cannot
          // build is not the runner refusing the fire, and saying it was
          // would free a room for the wrong reason.
          const text = await this.payload(command.wake);
          // A fire that fails — refused by the runner, or never answered at
          // all — is the wake not starting, so the thread is told and the
          // room freed rather than left holding a run that does not exist.
          let run: Fired;
          try {
            run = await fireRoutine(
              { url: this.env.ROUTINE_FIRE_URL, token: this.env.ROUTINE_TOKEN },
              text,
            );
          } catch (error) {
            run = {
              ok: false,
              why: `the runner could not be reached: ${reasonOf(error)}`,
            };
          }
          state = await this.carry(
            run.ok ? fired(state, run.run) : fireFailed(state, run.why),
            lines,
          );
          break;
        }
      }
    }
    return state;
  }

  private async payload(wake: Wake): Promise<string> {
    const token = await mintWakeToken(this.env.TOKEN_SECRET, {
      room: this.ctx.id.toString(),
      wake: wake.wake,
      exp: wake.expiresAt,
    });
    const handles = await this.team.handles();
    return payloadText({
      relayUrl: this.env.RELAY_URL,
      token,
      change: wake.change,
      reason: wake.reason,
      thread: wake.thread,
      sender: wake.sender,
      messages: wake.messages,
      handleOf: (slack) => handles.get(slack) ?? null,
    });
  }
}
