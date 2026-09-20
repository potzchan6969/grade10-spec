/**
 * One room: the Durable Object behind one Slack thread, and behind one change
 * as the address a landing wake is sent to.
 *
 * It holds no rules. Every decision is `room-state.ts`'s, and this class does
 * what the commands say: keep the state, set the one alarm, fire the Routine,
 * post through the bot token, check a landing and move `main`. The Slack bot
 * token, the Routine token and the code-host token are read here, from the
 * environment, and never travel in a payload.
 */
import type { Env } from "./env.ts";
import { advanceMain, compareFiles, readFileAt } from "./github.ts";
import { checkLanding, type LandKind } from "./land.ts";
import { payloadText } from "./payload.ts";
import {
  bind,
  done,
  type EnqueueInput,
  enqueue,
  fired,
  freshRoom,
  isRunningWake,
  onAlarm,
  posted,
  type RoomState,
  type Step,
  type Wake,
} from "./room-state.ts";
import { fireRoutine } from "./routine.ts";
import { postMessage } from "./slack.ts";
import { TEAM_PATH, TeamMap } from "./team.ts";
import { mintWakeToken } from "./token.ts";

/** The planning schema a landing's role is read from. */
const SCHEMA_PATH = "openspec/schemas/grade10-planning/schema.yaml";

/** How long a Slack `event_id` is remembered. Slack retries a delivery it did
 * not see acknowledged, and a retry must not wake the room twice. */
const DEDUPE_MS = 24 * 60 * 60 * 1000;

export type RoomOp =
  | ({ op: "enqueue"; eventId?: string; requireRoom?: boolean } & EnqueueInput)
  | { op: "point"; thread: { channel: string; ts: string } }
  | { op: "bind"; wake: number; change: string }
  | { op: "post"; wake: number; text: string }
  | {
      op: "land";
      wake: number;
      sha: string;
      kind: LandKind;
      artifact: string;
    }
  | { op: "done"; wake: number; summary?: string };

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export class Room {
  private readonly ctx: DurableObjectState;
  private readonly env: Env;
  /** One cache per live room, which is one cache per thread being answered. */
  private readonly team: TeamMap;

  constructor(ctx: DurableObjectState, env: Env) {
    this.ctx = ctx;
    this.env = env;
    this.team = new TeamMap(() => readFileAt(this.repo(), TEAM_PATH, "main"));
  }

  async fetch(request: Request): Promise<Response> {
    const op = (await request.json()) as RoomOp;
    switch (op.op) {
      case "enqueue":
        return this.onEnqueue(op);
      case "point":
        await this.ctx.storage.put(
          "forward",
          `${op.thread.channel}/${op.thread.ts}`,
        );
        return json(200, { pointed: true });
      case "bind":
        return this.onBind(op);
      case "post":
        return this.onPost(op);
      case "land":
        return this.onLand(op);
      case "done":
        return this.onDone(op);
      default:
        return json(400, { reason: "unknown-op" });
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

  /** The room a change-keyed wake is forwarded to, once a run has bound its
   * thread. Without one the change room answers for itself and its posts fall
   * back to the planning channel. */
  private async forward(op: RoomOp): Promise<Response | null> {
    const to = await this.ctx.storage.get<string>("forward");
    if (!to) return null;
    const id = this.env.ROOM.idFromName(to);
    if (id.toString() === this.ctx.id.toString()) return null;
    return this.env.ROOM.get(id).fetch(
      new Request("https://relay.invalid/room", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(op),
      }),
    );
  }

  private async onEnqueue(
    op: Extract<RoomOp, { op: "enqueue" }>,
  ): Promise<Response> {
    const forwarded = await this.forward(op);
    if (forwarded) return forwarded;
    if (op.eventId && (await this.seen(op.eventId)))
      return json(200, { queued: false, why: "duplicate" });
    const stored = await this.ctx.storage.get<RoomState>("state");
    // A thread reply that mentions nobody continues a room that exists and
    // opens none.
    if (!stored && op.requireRoom)
      return json(200, { queued: false, why: "no-room" });
    const state = stored ?? freshRoom();
    await this.apply(
      enqueue(
        state,
        {
          reason: op.reason,
          thread: op.thread,
          message: op.message,
          landing: op.landing,
        },
        Date.now(),
      ),
    );
    return json(200, { queued: true });
  }

  private async seen(eventId: string): Promise<boolean> {
    const key = `event:${eventId}`;
    if (await this.ctx.storage.get<number>(key)) return true;
    await this.ctx.storage.put(key, Date.now());
    await this.prune();
    return false;
  }

  private async prune(): Promise<void> {
    const entries = await this.ctx.storage.list<number>({ prefix: "event:" });
    const stale = [...entries]
      .filter(([, at]) => Date.now() - at > DEDUPE_MS)
      .map(([key]) => key);
    if (stale.length > 0) await this.ctx.storage.delete(stale);
  }

  private async onBind(op: Extract<RoomOp, { op: "bind" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    const bound = bind(state, op.change);
    await this.put(bound);
    // The change now has an address: a landing wake reaches the change room,
    // which forwards to this thread.
    const pointer = this.env.ROOM.idFromName(`change/${op.change}`);
    if (bound.thread && pointer.toString() !== this.ctx.id.toString())
      await this.env.ROOM.get(pointer).fetch(
        new Request("https://relay.invalid/room", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ op: "point", thread: bound.thread }),
        }),
      );
    return json(200, { bound: op.change });
  }

  private async onPost(op: Extract<RoomOp, { op: "post" }>): Promise<Response> {
    const state = await this.load();
    if (!isRunningWake(state, op.wake))
      return json(401, { reason: "stale-wake" });
    const ts = await this.post(state, op.text);
    await this.put(posted(state, ts));
    return json(200, { ts });
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
    const files = await compareFiles(repo, "main", op.sha);
    const word = op.kind === "word";
    const verdict = checkLanding({
      kind: op.kind,
      change,
      artifact: op.artifact,
      word: state.word,
      senderHandle:
        word && state.senderSlack
          ? await this.team.handleOf(state.senderSlack)
          : null,
      record: word
        ? await readFileAt(
            repo,
            `openspec/changes/${change}/.openspec.yaml`,
            op.sha,
          )
        : "",
      schema: word ? await readFileAt(repo, SCHEMA_PATH, op.sha) : "",
      files,
    });
    if (!verdict.ok) return json(403, { reason: verdict.check });
    const advance = await advanceMain(repo, op.sha);
    if ("reason" in advance) return json(409, { reason: advance.reason });
    return json(200, { landed: advance.landed });
  }

  /** A post goes to the thread, or to the planning channel when the room has
   * no thread. */
  private async post(state: RoomState, text: string): Promise<string> {
    return postMessage(
      this.env.SLACK_BOT_TOKEN,
      state.thread?.channel ?? this.env.PLANNING_CHANNEL,
      text,
      state.thread?.ts,
    );
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
        case "post": {
          const ts = await this.post(state, command.text);
          state = posted(state, ts);
          await this.put(state);
          break;
        }
        case "fire": {
          const run = await fireRoutine(
            { url: this.env.ROUTINE_FIRE_URL, token: this.env.ROUTINE_TOKEN },
            await this.payload(state, command.wake),
          );
          state = await this.apply(fired(state, run));
          break;
        }
      }
    }
    return state;
  }

  private async payload(state: RoomState, wake: Wake): Promise<string> {
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
      messages: wake.messages,
      landing: wake.landing,
      lastPostTs: state.lastPostTs,
      handleOf: (slack) => handles.get(slack) ?? null,
    });
  }
}
