/**
 * One room: the Durable Object behind one change, and behind one Slack thread
 * until a run names the change that thread is about.
 *
 * The change is the room's identity, because a landing wake is addressed by
 * the change and a thread is not always known when it arrives. A thread room
 * exists only until its run calls `bind`: from then on it forwards every op to
 * the change's room, which has taken the running wake over.
 *
 * It holds no rules. Every decision is `room-state.ts`'s, and this class does
 * what the commands say: keep the state, set the one alarm, fire the Routine,
 * post through the bot token, check a landing and move `main`. The Slack bot
 * token, the Routine token and the code-host token are read here, from the
 * environment, and never travel in a payload.
 */
import type { Env } from "./env.ts";
import { advanceMain, compareFiles, HostError, readFileAt } from "./github.ts";
import { checkReviewed, checkWord } from "./land.ts";
import { payloadText } from "./payload.ts";
import {
  bind,
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
import { type Fired, fireRoutine } from "./routine.ts";
import { callRoom, json, type RoomOp } from "./rpc.ts";
import { postMessage } from "./slack.ts";
import { TEAM_MAP, TeamMap } from "./team.ts";
import { mintWakeToken } from "./token.ts";

/** The planning schema a landing's role is read from. */
const SCHEMA_PATH = "openspec/schemas/grade10-planning/schema.yaml";

/** The record's `thread:` line, as the round writes it. */
const THREAD_LINE = /^\s*thread:\s*"?([^\s"/]+)\/([^\s"]+)"?\s*$/m;

/** What went wrong, in the words the thread can read. */
const reasonOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

export class Room {
  private readonly ctx: DurableObjectState;
  private readonly env: Env;
  /** One cache per live room, which is one cache per change being answered. */
  private readonly team: TeamMap;
  /** The thread the record names, read once per instance: a room addressed by
   * the change alone has no thread of its own until a run binds one. */
  private recorded: Thread | null = null;

  constructor(ctx: DurableObjectState, env: Env) {
    this.ctx = ctx;
    this.env = env;
    this.team = new TeamMap(() => readFileAt(this.repo(), TEAM_MAP, "main"));
  }

  async fetch(request: Request): Promise<Response> {
    const op = (await request.json()) as RoomOp;
    const forwarded = await this.forward(op);
    if (forwarded) return forwarded;
    try {
      switch (op.op) {
        case "enqueue":
          return await this.onEnqueue(op);
        case "takeover":
          return await this.onTakeover(op);
        case "bind":
          return await this.onBind(op);
        case "post":
          return await this.onPost(op);
        case "land":
          return await this.onLand(op);
        case "done":
          return await this.onDone(op);
        default:
          return json(400, { reason: "unknown-op" });
      }
    } catch (error) {
      if (error instanceof HostError)
        return json(503, {
          reason: "host-unavailable",
          status: error.status,
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

  /** The change's room, once a run has bound one. A thread room forwards
   * everything there: the wake it started is being run by that room, and the
   * token the session holds still names this one. */
  private async forward(op: RoomOp): Promise<Response | null> {
    const to = await this.ctx.storage.get<string>("forward");
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
   * The thread room's running wake, handed over at `bind`. An idle change
   * room adopts it whole — the wake number included, because the session's
   * token names that number.
   *
   * A change room already running a wake of its own keeps it: a room runs one
   * wake at a time, and the wake that could not be taken over is stale from
   * the moment its next call is refused.
   */
  private async onTakeover(
    op: Extract<RoomOp, { op: "takeover" }>,
  ): Promise<Response> {
    const state = await this.load();
    if (state.status === "running" || op.state.wake <= state.wake)
      return json(409, { taken: false, reason: "room-busy" });
    const taken: RoomState = { ...op.state, change: op.change };
    await this.put(taken);
    if (taken.alarm) await this.ctx.storage.setAlarm(taken.alarm.at);
    return json(200, { taken: true });
  }

  private async onBind(op: Extract<RoomOp, { op: "bind" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    const id = this.env.ROOM.idFromName(`change/${op.change}`);
    if (id.toString() === this.ctx.id.toString()) {
      await this.put(bind(state, op.change));
      return json(200, { bound: op.change });
    }
    // The change now has the room: this one hands the running wake over and
    // becomes the address the session's token still names.
    const answer = await callRoom(this.env.ROOM.get(id), {
      op: "takeover",
      change: op.change,
      state: bind(state, op.change),
    });
    if (!answer.ok) return answer;
    await this.ctx.storage.put("forward", `change/${op.change}`);
    await this.ctx.storage.delete("state");
    await this.ctx.storage.deleteAlarm();
    return json(200, { bound: op.change });
  }

  private async onPost(op: Extract<RoomOp, { op: "post" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    return json(200, { ts: await this.post(state, op.text) });
  }

  private async onDone(op: Extract<RoomOp, { op: "done" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    await this.apply(done(state, Date.now()));
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
    if ("truncated" in compare)
      return json(403, { reason: "compare-truncated" });
    const record = `openspec/changes/${change}/.openspec.yaml`;
    const verdict =
      op.kind === "reviewed"
        ? checkReviewed({
            change,
            paths: compare.paths,
            atMain: await readFileAt(repo, record, "main"),
            atSha: await readFileAt(repo, record, op.sha),
          })
        : checkWord({
            change,
            artifact: op.artifact,
            word: state.word,
            senderHandle: state.senderSlack
              ? await this.team.handleOf(state.senderSlack)
              : null,
            record: await readFileAt(repo, record, op.sha),
            schema: await readFileAt(repo, SCHEMA_PATH, op.sha),
            paths: compare.paths,
          });
    if (!verdict.ok) return json(403, { reason: verdict.check });
    const advance = await advanceMain(repo, op.sha);
    if ("landed" in advance) return json(200, { landed: advance.landed });
    return advance.refused === "not-fast-forward"
      ? json(409, { reason: "not-fast-forward" })
      : json(502, { reason: "host-refused", message: advance.message });
  }

  /** A post goes to the thread the room holds, then to the thread the record
   * names, then to the planning channel. A room addressed by a landing wake
   * has no thread of its own until a run binds one. */
  private async post(state: RoomState, text: string): Promise<string> {
    const thread = state.thread ?? (await this.threadOf(state));
    return postMessage(
      this.env.SLACK_BOT_TOKEN,
      thread?.channel ?? this.env.PLANNING_CHANNEL,
      text,
      thread?.ts,
    );
  }

  /** The thread the change's record names on `main`, read once per instance.
   * A record that names none, and a change the relay cannot read, both answer
   * nothing — the post falls back to the planning channel. */
  private async threadOf(state: RoomState): Promise<Thread | null> {
    if (this.recorded) return this.recorded;
    if (!state.change) return null;
    let text: string;
    try {
      text = await readFileAt(
        this.repo(),
        `openspec/changes/${state.change}/.openspec.yaml`,
        "main",
      );
    } catch {
      return null;
    }
    const line = THREAD_LINE.exec(text);
    if (!line) return null;
    this.recorded = { channel: line[1], ts: line[2] };
    return this.recorded;
  }

  /** Carry out one step: the state first, then its commands in order. A fire
   * answers with the run's link, which is the ack, so the step it returns is
   * carried out the same way. */
  private async apply(step: Step): Promise<RoomState> {
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
          await this.post(state, command.text);
          break;
        case "fire": {
          // A fire that fails — refused by the runner, or never answered at
          // all — is the wake not starting, so the thread is told and the
          // room freed rather than left holding a run that does not exist.
          let run: Fired;
          try {
            run = await fireRoutine(
              { url: this.env.ROUTINE_FIRE_URL, token: this.env.ROUTINE_TOKEN },
              await this.payload(command.wake),
            );
          } catch (error) {
            run = {
              ok: false,
              why: `the runner could not be reached: ${reasonOf(error)}`,
            };
          }
          state = await this.apply(
            run.ok ? fired(state, run.run) : fireFailed(state, run.why),
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
