import { afterEach, describe, expect, it, vi } from "vitest";
import { Room } from "../src/room.ts";
import { freshRoom, type RoomState } from "../src/room-state.ts";
import type { RoomOp } from "../src/rpc.ts";
import { CHANNEL, stubNamespace, testEnv } from "./fixtures.ts";

/** The room, driven over a stub `DurableObjectState` — a storage map and one
 * alarm — with the code host, the runner and Slack all answered by an
 * injected `fetch`.
 *
 * The transitions themselves are read in `room-state.test.ts` and the checks
 * in `land.test.ts`; what is read here is the wiring: what the room forwards,
 * what it dedupes, what it reads at which sha, where it posts and what it
 * answers a session that lands. */

const CHANGE = "nav-cart-count-badge";
const SHA = "abc1230000000000000000000000000000000000";
const THREAD = { channel: CHANNEL, ts: "1700000000.000100" };
const THREAD_ROOM = `${CHANNEL}/1700000000.000100`;
const OTHER_THREAD = { channel: CHANNEL, ts: "1700000000.000700" };
const OTHER_THREAD_ROOM = `${CHANNEL}/1700000000.000700`;
const CHANGE_ROOM = `change/${CHANGE}`;
const RECORD_PATH = `openspec/changes/${CHANGE}/.openspec.yaml`;
const SCHEMA_PATH = "openspec/schemas/grade10-planning/schema.yaml";

const TEAM = `handles:
  ecchochan:
    email: ecchochan@gmail.com
    slack: U0PM
    roles: [pm, tech, dev]
  kinisworking:
    slack: U0DEV
    roles: [dev]
channels: {}
`;

const SCHEMA = `name: grade10-planning
artifacts:
  - id: proposal
    teammate: product-manager
    hand: pm
  - id: specs
    required: true
  - id: tasks
    teammate: engineer
    hand: dev
`;

const RECORD = `schema: grade10-planning
hands:
  pm: "@ecchochan"
  dev: "@kinisworking"
landed_by:
  proposal: "@ecchochan"
reviewed:
  ui-design: 1a2b3c4d
`;

/** The record on `main`, which names the thread the change posts to. */
const RECORD_AT_MAIN = `${RECORD}thread: C0RECORDED/1700000000.000900
`;

interface Call {
  url: string;
  init?: RequestInit;
}

interface Answers {
  /** `<path>@<ref>` against the file's text. */
  files: Record<string, string>;
  compare: { status?: number; body?: unknown };
  advance: { status?: number; body?: unknown };
  /** `throws` is the runner never answering at all. */
  fire: { status?: number; body?: unknown; throws?: string };
  /** What Slack answers a post with. */
  post: { ok?: boolean; error?: string };
  /** What happens while the compare is in flight, for a room that moves under
   * its own landing. */
  during?: () => Promise<void>;
}

/** What the store reads as, unless a test says otherwise. A test that names
 * `files` names them all, so it can leave one out. */
const FILES: Record<string, string> = {
  "docs/prds/team.yaml@main": TEAM,
  [`${SCHEMA_PATH}@${SHA}`]: SCHEMA,
  [`${RECORD_PATH}@${SHA}`]: RECORD,
  [`${RECORD_PATH}@main`]: RECORD_AT_MAIN,
};

function answers(over: Partial<Answers> = {}): Answers {
  return {
    during: over.during,
    files: over.files ?? FILES,
    compare: over.compare ?? {
      body: {
        files: [
          { filename: `openspec/changes/${CHANGE}/proposal.md` },
          { filename: `openspec/changes/${CHANGE}/.openspec.yaml` },
        ],
      },
    },
    advance: over.advance ?? { body: { object: { sha: SHA } } },
    post: over.post ?? { ok: true },
    fire: over.fire ?? {
      body: {
        claude_code_session_id: "s1",
        claude_code_session_url: "https://runs.example/s1",
      },
    },
  };
}

class Storage {
  readonly held = new Map<string, unknown>();
  alarm: number | null = null;

  async get<T>(key: string): Promise<T | undefined> {
    return this.held.get(key) as T | undefined;
  }

  async put(key: string, value: unknown): Promise<void> {
    // The runtime stores what it can serialize, so a state that stopped being
    // plain data would fail here rather than in production.
    this.held.set(key, JSON.parse(JSON.stringify(value)));
  }

  async delete(key: string): Promise<boolean> {
    return this.held.delete(key);
  }

  async setAlarm(at: number): Promise<void> {
    this.alarm = at;
  }

  async deleteAlarm(): Promise<void> {
    this.alarm = null;
  }
}

function harness(over: Partial<Answers> = {}) {
  const table = answers(over);
  const calls: Call[] = [];
  const rooms = new Map<string, { room: Room; storage: Storage }>();

  const env = testEnv({
    ROOM: stubNamespace(async (name, request) => of(name).room.fetch(request)),
  });

  function of(name: string) {
    let held = rooms.get(name);
    if (!held) {
      const storage = new Storage();
      const ctx = {
        id: { toString: () => name },
        storage,
      } as unknown as DurableObjectState;
      held = { room: new Room(ctx, env), storage };
      rooms.set(name, held);
    }
    return held;
  }

  function answer(status: number | undefined, body: unknown): Response {
    return new Response(
      typeof body === "string" ? body : JSON.stringify(body ?? {}),
      { status: status ?? 200 },
    );
  }

  // The code host's calls are built with `new URL`, so what the stub is given
  // is a URL and not always a string.
  vi.stubGlobal("fetch", async (given: string | URL, init?: RequestInit) => {
    const url = String(given);
    calls.push({ url, init });
    if (url.includes("/compare/")) {
      await table.during?.();
      return answer(table.compare.status, table.compare.body);
    }
    if (url.includes("/contents/")) {
      const [, rest] = url.split("/contents/");
      const [path, query] = rest.split("?ref=");
      const text = table.files[`${decodeURIComponent(path)}@${query}`];
      return text === undefined
        ? answer(404, { message: "Not Found" })
        : answer(200, { content: btoa(text), encoding: "base64" });
    }
    if (url.includes("/git/refs/heads/main"))
      return answer(table.advance.status, table.advance.body);
    if (url.includes("runner.example")) {
      if (table.fire.throws) throw new Error(table.fire.throws);
      return answer(table.fire.status, table.fire.body);
    }
    if (url.includes("chat.postMessage"))
      return answer(200, {
        ok: table.post.ok ?? true,
        error: table.post.error,
        ts: "1700000009.000100",
      });
    throw new Error(`no answer for ${url}`);
  });

  return {
    calls,
    async send(name: string, op: RoomOp): Promise<Response> {
      return of(name).room.fetch(
        new Request("https://relay.invalid/room", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(op),
        }),
      );
    },
    async alarm(name: string): Promise<void> {
      await of(name).room.alarm();
    },
    state(name: string): RoomState | undefined {
      return of(name).storage.held.get("state") as RoomState | undefined;
    },
    storage(name: string): Storage {
      return of(name).storage;
    },
    /** What the room asked the runner to fire, as the run reads it. */
    payload(): {
      change: string | null;
      reason: string;
      thread: { channel: string; ts: string } | null;
      sender: { slack: string; handle: string | null } | null;
      messages: { text: string; handle: string | null }[];
      relay: { url: string; token: string };
    } {
      const fired = calls.find((call) => call.url.includes("runner.example"));
      if (!fired) throw new Error("nothing was fired");
      const { text } = JSON.parse(String(fired.init?.body)) as {
        text: string;
      };
      return JSON.parse(text);
    },
    posts(): {
      channel: string;
      text: string;
      thread_ts?: string;
      blocks?: unknown[];
    }[] {
      return calls
        .filter((call) => call.url.includes("chat.postMessage"))
        .map(
          (call) =>
            JSON.parse(String(call.init?.body)) as {
              channel: string;
              text: string;
              thread_ts?: string;
              blocks?: unknown[];
            },
        );
    },
    /** The calls on the code host, from the call named on: a wake reads the
     * team map for its payload, so a landing's own reads start after it. */
    hostCalls(from = 0): Call[] {
      return calls
        .slice(from)
        .filter((call) => call.url.includes("api.github.com"));
    },
    /** How many calls have been made, so a test can read what one op did. */
    mark(): number {
      return calls.length;
    },
  };
}

/** One message said in the thread. */
function said(text: string, ts: string, slack = "U0PM"): RoomOp {
  return {
    op: "enqueue",
    reason: "message",
    thread: THREAD,
    dedupe: `slack:${CHANNEL}/${ts}`,
    message: { slack, text, ts },
  };
}

/** A thread room woken by a first sentence, fired, and bound to the change:
 * the shape every later call arrives in. */
async function bound(relay: ReturnType<typeof harness>): Promise<void> {
  await relay.send(THREAD_ROOM, {
    op: "enqueue",
    reason: "plan",
    thread: THREAD,
    message: { slack: "U0PM", text: "<@U0APP> plan the badge", ts: "1.1" },
  });
  await relay.alarm(THREAD_ROOM);
  await relay.send(THREAD_ROOM, { op: "bind", wake: 1, change: CHANGE });
}

/** A change room running a wake the word `land` started, said by the handle
 * given: what a landing call arrives at. */
async function landing(
  relay: ReturnType<typeof harness>,
  word = "land",
  slack = "U0PM",
): Promise<void> {
  await relay.send(CHANGE_ROOM, {
    op: "enqueue",
    reason: "message",
    change: CHANGE,
    thread: THREAD,
    message: { slack, text: word, ts: "1.5" },
  });
  await relay.alarm(CHANGE_ROOM);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("what the room answers twice", () => {
  it("drops a delivery it has already answered", async () => {
    const relay = harness();
    const first = await relay.send(THREAD_ROOM, said("land", "1.1"));
    expect(await first.json()).toEqual({ queued: true });
    const again = await relay.send(THREAD_ROOM, said("land", "1.1"));
    expect(again.status).toBe(200);
    expect(await again.json()).toEqual({ queued: false, why: "duplicate" });
    expect(relay.state(THREAD_ROOM)?.pending).toHaveLength(1);
  });

  it("keeps the arrivals it remembers in its own state", async () => {
    const relay = harness();
    await relay.send(THREAD_ROOM, said("land", "1.1"));
    expect(relay.state(THREAD_ROOM)?.seen).toEqual([`slack:${CHANNEL}/1.1`]);
    expect([...relay.storage(THREAD_ROOM).held.keys()]).toEqual(["state"]);
  });

  it("answers a reply that mentions nobody where no room exists", async () => {
    const relay = harness();
    const response = await relay.send(THREAD_ROOM, {
      ...said("carry on", "1.2"),
      requireRoom: true,
    } as RoomOp);
    expect(await response.json()).toEqual({ queued: false, why: "no-room" });
    expect(relay.state(THREAD_ROOM)).toBe(undefined);
  });
});

describe("the fire", () => {
  it("fires once for a burst and carries both messages", async () => {
    const relay = harness();
    await relay.send(THREAD_ROOM, said("land", "1.1"));
    await relay.send(THREAD_ROOM, said("hold on", "1.2", "U0DEV"));
    await relay.alarm(THREAD_ROOM);

    expect(
      relay.calls.filter((call) => call.url.includes("runner.example")),
    ).toHaveLength(1);
    const payload = relay.payload();
    expect(payload.messages).toEqual([
      { handle: "ecchochan", slack: "U0PM", text: "land", ts: "1.1" },
      { handle: "kinisworking", slack: "U0DEV", text: "hold on", ts: "1.2" },
    ]);
    // The wake's sender is whose word it may land, not whoever spoke last.
    expect(payload.sender).toEqual({ slack: "U0PM", handle: "ecchochan" });
    expect(payload.reason).toBe("message");
    expect(payload.thread).toEqual(THREAD);
    expect(payload.relay.url).toBe("https://grade10-relay.workers.dev");
    expect(payload.relay.token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  });

  it("acks with the wake's subject, the run's link, and sets the budget", async () => {
    const relay = harness();
    await relay.send(THREAD_ROOM, said("land", "1.1"));
    await relay.alarm(THREAD_ROOM);
    expect(relay.posts()).toEqual([
      {
        channel: CHANNEL,
        // No change is bound, so the subject is the thread's first words.
        text: "Reading land… https://runs.example/s1",
        thread_ts: THREAD.ts,
      },
    ]);
    expect(relay.storage(THREAD_ROOM).alarm).toBe(
      relay.state(THREAD_ROOM)?.alarm?.at,
    );
    expect(relay.state(THREAD_ROOM)?.alarm?.kind).toBe("budget");
  });

  it("says in the thread the status the runner answered, and frees the room", async () => {
    const relay = harness({
      fire: { status: 404, body: "no such routine" },
    });
    await relay.send(THREAD_ROOM, said("land", "1.1"));
    await relay.alarm(THREAD_ROOM);
    expect(relay.posts()).toEqual([
      {
        channel: CHANNEL,
        text: "The reply of land did not start: the runner answered 404",
        thread_ts: THREAD.ts,
      },
    ]);
    expect(relay.state(THREAD_ROOM)).toMatchObject({
      reason: null,
      queued: null,
      alarm: null,
    });
    expect(relay.storage(THREAD_ROOM).alarm).toBe(null);
  });

  it("says the runner could not be reached when the fire throws", async () => {
    const relay = harness({ fire: { throws: "connection reset" } });
    await relay.send(THREAD_ROOM, said("land", "1.1"));
    await relay.alarm(THREAD_ROOM);
    expect(relay.posts()).toEqual([
      {
        channel: CHANNEL,
        text: "The reply of land did not start: the runner could not be reached: connection reset",
        thread_ts: THREAD.ts,
      },
    ]);
    expect(relay.state(THREAD_ROOM)).toMatchObject({
      reason: null,
      alarm: null,
    });
    expect(relay.storage(THREAD_ROOM).alarm).toBe(null);
  });

  it("acks a fire the runner named no session as a wake with no link", async () => {
    const relay = harness({ fire: { body: { claude_code_session_id: "s1" } } });
    await relay.send(THREAD_ROOM, said("land", "1.1"));
    await relay.alarm(THREAD_ROOM);
    expect(relay.posts()).toEqual([
      {
        channel: CHANNEL,
        text: "Reading land… (the runner named no session)",
        thread_ts: THREAD.ts,
      },
    ]);
    // The wake is the room's until its budget: the runner took the fire, and
    // what it never named is the link.
    expect(relay.state(THREAD_ROOM)).toMatchObject({
      reason: "message",
      run: null,
    });
  });

  it("keeps the budget it committed when its own ack does not post", async () => {
    const told = vi.spyOn(console, "error").mockImplementation(() => {});
    const relay = harness({ post: { ok: false, error: "channel_not_found" } });
    await relay.send(THREAD_ROOM, said("land", "1.1"));
    await relay.alarm(THREAD_ROOM);
    // The line is the room's own voice going missing, not a reason to leave a
    // running wake with no alarm to free it.
    expect(relay.state(THREAD_ROOM)).toMatchObject({
      reason: "message",
      run: { url: "https://runs.example/s1" },
    });
    expect(relay.storage(THREAD_ROOM).alarm).toBe(
      relay.state(THREAD_ROOM)?.alarm?.at,
    );
    expect(told).toHaveBeenCalledTimes(1);
    expect(String(told.mock.calls[0][0])).toContain("channel_not_found");
    told.mockRestore();
  });

  it("clears a stale alarm on a room running no wake, and says nothing", async () => {
    const relay = harness();
    // A room that already answered its wake, whose alarm the runtime rings
    // once more.
    relay.storage(CHANGE_ROOM).held.set("state", {
      ...freshRoom(),
      wake: 1,
      thread: THREAD,
      change: CHANGE,
      alarm: { kind: "budget", at: 1_700_000_000_000 },
    } satisfies RoomState);
    relay.storage(CHANGE_ROOM).alarm = 1_700_000_000_000;
    await relay.alarm(CHANGE_ROOM);
    expect(relay.posts()).toEqual([]);
    expect(relay.calls).toEqual([]);
    // The alarm goes with the wake it was set for: an alarm left armed on an
    // idle room rings again for nothing.
    expect(relay.state(CHANGE_ROOM)?.alarm).toBe(null);
    expect(relay.storage(CHANGE_ROOM).alarm).toBe(null);
  });

  it("posts the budget line with the run's link, frees the room and clears its alarm", async () => {
    const relay = harness();
    await landing(relay);
    const budget = relay.state(CHANGE_ROOM)?.alarm?.at ?? 0;
    vi.useFakeTimers();
    vi.setSystemTime(budget);
    await relay.alarm(CHANGE_ROOM);
    vi.useRealTimers();
    expect(relay.posts().at(-1)).toEqual({
      channel: CHANNEL,
      text: `The reply of ${CHANGE} did not finish: https://runs.example/s1`,
      thread_ts: THREAD.ts,
    });
    expect(relay.state(CHANGE_ROOM)).toMatchObject({
      reason: null,
      queued: null,
      run: null,
      alarm: null,
    });
    expect(relay.storage(CHANGE_ROOM).alarm).toBe(null);
  });

  it("queues one landing wake per head, and drops a second call at the same one", async () => {
    const relay = harness();
    const wake: RoomOp = {
      op: "enqueue",
      reason: "landing",
      change: CHANGE,
      dedupe: `wake:${CHANGE}/${SHA}`,
    };
    expect(await (await relay.send(CHANGE_ROOM, wake)).json()).toEqual({
      queued: true,
    });
    expect(await (await relay.send(CHANGE_ROOM, wake)).json()).toEqual({
      queued: false,
      why: "duplicate",
    });
    await relay.alarm(CHANGE_ROOM);
    expect(
      relay.calls.filter((call) => call.url.includes("runner.example")),
    ).toHaveLength(1);
  });
});

describe("the change's room", () => {
  it("takes the thread as its alias at bind, and the wake stays where it started", async () => {
    const relay = harness();
    await bound(relay);

    // The wake never migrates: the thread's room keeps running it, and the
    // change's room holds the thread it answers in.
    expect(relay.state(THREAD_ROOM)).toMatchObject({
      wake: 1,
      reason: "plan",
      change: CHANGE,
      thread: THREAD,
    });
    expect(relay.storage(THREAD_ROOM).alarm).toBe(
      relay.state(THREAD_ROOM)?.alarm?.at,
    );
    expect(relay.state(CHANGE_ROOM)).toMatchObject({
      reason: null,
      change: CHANGE,
      thread: THREAD,
    });
    expect(relay.storage(CHANGE_ROOM).alarm).toBe(null);

    // The token a session holds names the thread's room, so its own calls are
    // answered there.
    const posted = await relay.send(THREAD_ROOM, {
      op: "post",
      wake: 1,
      text: "drafted the proposal",
    });
    expect(posted.status).toBe(200);
    expect(relay.posts().at(-1)).toEqual({
      channel: CHANNEL,
      text: "drafted the proposal",
      thread_ts: THREAD.ts,
    });
  });

  it("hands the queue the thread gathered to the change at bind", async () => {
    const relay = harness();
    await relay.send(THREAD_ROOM, {
      op: "enqueue",
      reason: "plan",
      thread: THREAD,
      message: { slack: "U0PM", text: "<@U0APP> plan the badge", ts: "1.1" },
    });
    await relay.alarm(THREAD_ROOM);
    // The reply arrives after the wake started and before the run named the
    // change, so it is queued in a room nothing will wake again.
    await relay.send(THREAD_ROOM, said("one more thing", "1.9"));
    await relay.send(THREAD_ROOM, { op: "bind", wake: 1, change: CHANGE });

    expect(relay.state(THREAD_ROOM)).toMatchObject({
      queued: null,
      pending: [],
      dropped: 0,
    });
    expect(relay.state(CHANGE_ROOM)).toMatchObject({
      queued: "message",
      // The key travels with the line, so a Slack retry of it is a duplicate
      // in the room that now holds the thread.
      seen: [`slack:${CHANNEL}/1.9`],
    });
    expect(relay.state(CHANGE_ROOM)?.pending.map((one) => one.text)).toEqual([
      "one more thing",
    ]);

    const fires = () =>
      relay.calls.filter((call) => call.url.includes("runner.example")).length;
    const before = fires();
    await relay.alarm(CHANGE_ROOM);
    expect(fires()).toBe(before + 1);
    expect(relay.state(CHANGE_ROOM)).toMatchObject({
      reason: "message",
      change: CHANGE,
    });

    // The thread's own room has nothing behind it: the line fired once, in
    // the change's room.
    await relay.send(THREAD_ROOM, { op: "done", wake: 1 });
    expect(fires()).toBe(before + 1);
    expect(relay.state(THREAD_ROOM)).toMatchObject({
      reason: null,
      queued: null,
    });
  });

  it("queues a later message in the thread on the change's own room", async () => {
    const relay = harness();
    await bound(relay);
    const queued = await relay.send(THREAD_ROOM, said("one more thing", "1.9"));
    expect(await queued.json()).toEqual({ queued: true });
    expect(relay.state(CHANGE_ROOM)?.queued).toBe("message");
    expect(relay.state(CHANGE_ROOM)?.pending).toHaveLength(1);
    expect(relay.state(THREAD_ROOM)?.pending).toEqual([]);
  });

  it("keeps its own wake when a thread offers it an alias it cannot take", async () => {
    const relay = harness();
    await landing(relay);
    expect(relay.state(CHANGE_ROOM)?.reason).toBe("message");

    await relay.send(OTHER_THREAD_ROOM, {
      op: "enqueue",
      reason: "plan",
      thread: OTHER_THREAD,
      message: { slack: "U0PM", text: "<@U0APP> plan it", ts: "2.1" },
    });
    await relay.alarm(OTHER_THREAD_ROOM);
    const bind = await relay.send(OTHER_THREAD_ROOM, {
      op: "bind",
      wake: 1,
      change: CHANGE,
    });
    expect(bind.status).toBe(409);
    expect(await bind.json()).toEqual({ bound: false, reason: "room-busy" });
    expect(relay.state(CHANGE_ROOM)?.thread).toEqual(THREAD);
    expect(relay.state(CHANGE_ROOM)?.word).toBe("land");
    expect(await relay.storage(OTHER_THREAD_ROOM).get("change-room")).toBe(
      undefined,
    );
  });

  it("takes an alias while idle, whatever wake it ran before", async () => {
    const relay = harness();
    // A change room that ran a wake and finished it: idle with a history, and
    // a thread's bind is taken.
    await landing(relay);
    await relay.send(CHANGE_ROOM, { op: "done", wake: 1 });
    await relay.send(OTHER_THREAD_ROOM, {
      op: "enqueue",
      reason: "plan",
      thread: OTHER_THREAD,
      message: { slack: "U0PM", text: "<@U0APP> plan it again", ts: "2.1" },
    });
    await relay.alarm(OTHER_THREAD_ROOM);
    const bind = await relay.send(OTHER_THREAD_ROOM, {
      op: "bind",
      wake: 1,
      change: CHANGE,
    });
    expect(bind.status).toBe(200);
    expect(await bind.json()).toEqual({ bound: CHANGE });
    expect(relay.state(CHANGE_ROOM)?.thread).toEqual(OTHER_THREAD);
    expect(relay.state(CHANGE_ROOM)?.wake).toBe(1);
  });

  it("binds the change on its own room without an alias call", async () => {
    const relay = harness();
    await landing(relay);
    const bound = await relay.send(CHANGE_ROOM, {
      op: "bind",
      wake: 1,
      change: CHANGE,
    });
    expect(await bound.json()).toEqual({ bound: CHANGE });
    expect(await relay.storage(CHANGE_ROOM).get("change-room")).toBe(undefined);
  });

  it("posts a wake's line in its own thread and in no other room's", async () => {
    const relay = harness();
    await landing(relay);
    await relay.send(OTHER_THREAD_ROOM, {
      op: "enqueue",
      reason: "plan",
      thread: OTHER_THREAD,
      message: {
        slack: "U0PM",
        text: "<@U0APP> plan something else",
        ts: "3.1",
      },
    });
    await relay.alarm(OTHER_THREAD_ROOM);
    const before = relay.posts().length;
    await relay.send(CHANGE_ROOM, {
      op: "post",
      wake: 1,
      text: "for this change alone",
    });
    expect(relay.posts().slice(before)).toEqual([
      {
        channel: CHANNEL,
        text: "for this change alone",
        thread_ts: THREAD.ts,
      },
    ]);
  });

  it("refuses every call of a wake that is not the one running", async () => {
    const relay = harness();
    await landing(relay);
    for (const op of [
      { op: "post", wake: 2, text: "from the wake before" },
      { op: "bind", wake: 2, change: CHANGE },
      { op: "done", wake: 2 },
      { op: "land", wake: 2, sha: SHA, kind: "word", artifact: "proposal" },
      { op: "alive", wake: 2 },
    ] as RoomOp[]) {
      const response = await relay.send(CHANGE_ROOM, op);
      expect(response.status).toBe(401);
      expect(await response.json()).toEqual({ reason: "stale-wake" });
    }
  });

  it("says the running wake is alive, and an idle room says nothing is", async () => {
    const relay = harness();
    await landing(relay);
    const alive = await relay.send(CHANGE_ROOM, { op: "alive", wake: 1 });
    expect(alive.status).toBe(200);
    expect(await alive.json()).toEqual({ alive: true });
    await relay.send(CHANGE_ROOM, { op: "done", wake: 1 });
    const after = await relay.send(CHANGE_ROOM, { op: "alive", wake: 1 });
    expect(after.status).toBe(401);
    expect(await after.json()).toEqual({ reason: "stale-wake" });
  });

  it("frees the room on done, and fires again for what waited", async () => {
    const relay = harness();
    await landing(relay);
    await relay.send(CHANGE_ROOM, said("and one more", "1.7"));
    const done = await relay.send(CHANGE_ROOM, { op: "done", wake: 1 });
    expect(await done.json()).toEqual({ done: true });
    expect(relay.state(CHANGE_ROOM)).toMatchObject({
      reason: "message",
      wake: 2,
    });
    expect(
      relay.calls.filter((call) => call.url.includes("runner.example")),
    ).toHaveLength(2);
  });

  it("answers an op it does not know", async () => {
    const relay = harness();
    const response = await relay.send(CHANGE_ROOM, {
      op: "archive",
    } as unknown as RoomOp);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ reason: "unknown-op" });
  });
});

describe("where a room posts", () => {
  it("posts to the thread the record names when it has none of its own", async () => {
    const relay = harness();
    await relay.send(CHANGE_ROOM, {
      op: "enqueue",
      reason: "landing",
      change: CHANGE,
    });
    await relay.alarm(CHANGE_ROOM);
    expect(relay.posts()).toEqual([
      {
        channel: "C0RECORDED",
        text: `Reading ${CHANGE}… https://runs.example/s1`,
        thread_ts: "1700000000.000900",
      },
    ]);
    expect(relay.payload().thread).toBe(null);
  });

  it("falls back to the planning channel where the record names no thread", async () => {
    const relay = harness({
      files: { ...FILES, [`${RECORD_PATH}@main`]: RECORD },
    });
    await relay.send(CHANGE_ROOM, {
      op: "enqueue",
      reason: "landing",
      change: CHANGE,
    });
    await relay.alarm(CHANGE_ROOM);
    expect(relay.posts()).toEqual([
      { channel: CHANNEL, text: `Reading ${CHANGE}… https://runs.example/s1` },
    ]);
    // Nothing was named, so nothing is held: the `thread:` the round has
    // just written is read by the line after it.
    const before = relay.mark();
    await relay.send(CHANGE_ROOM, { op: "post", wake: 1, text: "read again" });
    expect(
      relay
        .hostCalls(before)
        .filter((call) => call.url.includes(".openspec.yaml")),
    ).toHaveLength(1);
  });

  it("falls back to the planning channel where it cannot read the record", async () => {
    const told = vi.spyOn(console, "error").mockImplementation(() => {});
    const relay = harness({ files: { "docs/prds/team.yaml@main": TEAM } });
    await relay.send(CHANGE_ROOM, {
      op: "enqueue",
      reason: "landing",
      change: CHANGE,
    });
    await relay.alarm(CHANGE_ROOM);
    expect(relay.posts()).toEqual([
      { channel: CHANNEL, text: `Reading ${CHANGE}… https://runs.example/s1` },
    ]);
    // The dropped read is reported once, and the post still went out.
    expect(told).toHaveBeenCalledTimes(1);
    expect(String(told.mock.calls[0][0])).toContain(CHANGE);
    told.mockRestore();
  });

  it("sends the run's button as blocks, with the line as its fallback", async () => {
    const relay = harness();
    await landing(relay);
    const line = "*What is next* \u2014 your word on the proposal";
    const posted = await relay.send(CHANGE_ROOM, {
      op: "post",
      wake: 1,
      text: line,
      confirm: { label: "Confirm proposal", word: "land" },
    });
    expect(posted.status).toBe(200);
    // The label and the word are the run's; the text stays the message's own,
    // which is what a notification and a client with no blocks read.
    expect(relay.posts().at(-1)).toEqual({
      channel: CHANNEL,
      text: line,
      thread_ts: THREAD.ts,
      blocks: [
        { type: "section", text: { type: "mrkdwn", text: line } },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "Confirm proposal" },
              action_id: "confirm",
              value: "land",
              style: "primary",
            },
          ],
        },
      ],
    });
  });

  it("sends no blocks for a line that asks for no button", async () => {
    const relay = harness();
    await landing(relay);
    await relay.send(CHANGE_ROOM, { op: "post", wake: 1, text: "drafted" });
    expect(relay.posts().at(-1)).toEqual({
      channel: CHANNEL,
      text: "drafted",
      thread_ts: THREAD.ts,
    });
  });

  it("reads the record once for the thread it named, and posts there again", async () => {
    const relay = harness();
    await relay.send(CHANGE_ROOM, {
      op: "enqueue",
      reason: "landing",
      change: CHANGE,
    });
    await relay.alarm(CHANGE_ROOM);
    const before = relay.mark();
    await relay.send(CHANGE_ROOM, { op: "post", wake: 1, text: "read again" });
    // A thread the record named moves nowhere, so the second line posts to
    // the one the first read.
    expect(
      relay
        .hostCalls(before)
        .filter((call) => call.url.includes(".openspec.yaml")),
    ).toEqual([]);
    expect(relay.posts().at(-1)).toEqual({
      channel: "C0RECORDED",
      text: "read again",
      thread_ts: "1700000000.000900",
    });
  });
});

describe("a landing on a word", () => {
  it("shared-planning-agent-rounds-SC-73 - A run lands through the relay, which checks the word", async () => {
    const relay = harness();
    await landing(relay);
    const before = relay.mark();
    const response = await relay.send(CHANGE_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "word",
      artifact: "proposal",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ landed: SHA });

    const host = relay.hostCalls(before);
    const headers = {
      authorization: "Bearer the-code-host-token",
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "user-agent": "grade10-relay",
    };
    expect(host.map((call) => call.url)).toEqual([
      `https://api.github.com/repos/9gag/grade10-spec/compare/main...${SHA}`,
      `https://api.github.com/repos/9gag/grade10-spec/contents/${RECORD_PATH}?ref=${SHA}`,
      `https://api.github.com/repos/9gag/grade10-spec/contents/${SCHEMA_PATH}?ref=${SHA}`,
      "https://api.github.com/repos/9gag/grade10-spec/git/refs/heads/main",
    ]);
    for (const call of host.slice(0, 3)) {
      expect(call.init?.method).toBe(undefined);
      expect(call.init?.headers).toEqual(headers);
    }
    const move = host.at(-1);
    expect(move?.init?.method).toBe("PATCH");
    expect(move?.init?.headers).toEqual({
      ...headers,
      "content-type": "application/json",
    });
    expect(JSON.parse(String(move?.init?.body))).toEqual({
      sha: SHA,
      force: false,
    });
  });

  it("keeps the word through a landing and spends it when the run is done", async () => {
    const relay = harness();
    await landing(relay);
    expect(relay.state(CHANGE_ROOM)?.word).toBe("land");
    await relay.send(CHANGE_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "word",
      artifact: "proposal",
    });
    // One word lands a chain, and the run lands one artifact per call: the
    // word is still the room's for the artifact after this one.
    expect(relay.state(CHANGE_ROOM)?.word).toBe("land");
    expect(relay.state(CHANGE_ROOM)?.senderSlack).toBe("U0PM");

    await relay.send(CHANGE_ROOM, { op: "done", wake: 1 });
    // The run's last act spends it: the next wake starts with no word.
    expect(relay.state(CHANGE_ROOM)?.word).toBe(null);
    expect(relay.state(CHANGE_ROOM)?.senderSlack).toBe(null);
  });

  it("lands two artifacts of the chain on the one word", async () => {
    const relay = harness();
    await landing(relay);
    const land: RoomOp = {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "word",
      artifact: "proposal",
    };
    expect(await (await relay.send(CHANGE_ROOM, land)).json()).toEqual({
      landed: SHA,
    });
    expect(await (await relay.send(CHANGE_ROOM, land)).json()).toEqual({
      landed: SHA,
    });
  });

  it("moves nothing where the wake ended while the checks ran", async () => {
    let free: (() => Promise<void>) | null = null;
    const relay = harness({
      during: async () => {
        await free?.();
      },
    });
    free = async () => {
      await relay.send(CHANGE_ROOM, { op: "done", wake: 1 });
    };
    await landing(relay);
    const before = relay.mark();
    const response = await relay.send(CHANGE_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "word",
      artifact: "proposal",
    });
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({ reason: "stale-wake" });
    expect(
      relay
        .hostCalls(before)
        .filter((call) => call.url.includes("/git/refs/heads/main")),
    ).toEqual([]);
  });

  it("moves nothing where it cannot read the team map", async () => {
    // The map the wake's payload read named nobody, so the landing reads it
    // again — and by then the file is a map the store's parser refuses.
    const files = { ...FILES, "docs/prds/team.yaml@main": "handles: {}\n" };
    const relay = harness({
      files,
      during: async () => {
        files["docs/prds/team.yaml@main"] = "handles:\n  dana: [\n";
      },
    });
    await landing(relay);
    const response = await relay.send(CHANGE_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "word",
      artifact: "proposal",
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ reason: "map-unreadable" });
  });

  it("moves nothing on a word nobody said, or a hand who did not say it", async () => {
    const relay = harness();
    await landing(relay, "hold on");
    const refused = await relay.send(CHANGE_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "word",
      artifact: "proposal",
    });
    expect(refused.status).toBe(403);
    expect(await refused.json()).toEqual({ reason: "word-not-said" });

    const other = harness();
    await landing(other, "land", "U0DEV");
    expect(
      await (
        await other.send(CHANGE_ROOM, {
          op: "land",
          wake: 1,
          sha: SHA,
          kind: "word",
          artifact: "proposal",
        })
      ).json(),
    ).toEqual({ reason: "not-the-hand" });
  });

  it("reads the team map again before it says it knows nobody", async () => {
    const relay = harness({
      files: { ...FILES, "docs/prds/team.yaml@main": "handles: {}\n" },
    });
    await landing(relay);
    const response = await relay.send(CHANGE_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "word",
      artifact: "proposal",
    });
    expect(await response.json()).toEqual({ reason: "sender-unknown" });
    expect(
      relay.hostCalls().filter((call) => call.url.includes("team.yaml")),
    ).toHaveLength(2);
  });

  it("moves nothing where the commit's landed_by is somebody else", async () => {
    const relay = harness({
      files: {
        ...FILES,
        [`${RECORD_PATH}@${SHA}`]: `hands:\n  pm: "@ecchochan"\nlanded_by:\n  proposal: "@dee"\n`,
      },
    });
    await landing(relay);
    expect(
      await (
        await relay.send(CHANGE_ROOM, {
          op: "land",
          wake: 1,
          sha: SHA,
          kind: "word",
          artifact: "proposal",
        })
      ).json(),
    ).toEqual({ reason: "landed-by-mismatch" });
  });

  it("moves nothing for a file outside the change's writable set", async () => {
    const relay = harness({
      compare: {
        body: {
          files: [{ filename: "packages/ui/src/blocks/cart/badge.tsx" }],
        },
      },
    });
    await landing(relay);
    expect(
      await (
        await relay.send(CHANGE_ROOM, {
          op: "land",
          wake: 1,
          sha: SHA,
          kind: "word",
          artifact: "proposal",
        })
      ).json(),
    ).toEqual({ reason: "file-outside-change" });
  });

  it("takes a task group's code, whose paths the run's own guard holds", async () => {
    const relay = harness({
      compare: {
        body: {
          files: [{ filename: "packages/ui/src/blocks/cart/badge.tsx" }],
        },
      },
      files: {
        ...FILES,
        [`${RECORD_PATH}@${SHA}`]: `hands:\n  dev: "@kinisworking"\nlanded_by:\n  "2": "@kinisworking"\n`,
      },
    });
    await landing(relay, "land", "U0DEV");
    expect(
      await (
        await relay.send(CHANGE_ROOM, {
          op: "land",
          wake: 1,
          sha: SHA,
          kind: "word",
          artifact: "2",
        })
      ).json(),
    ).toEqual({ landed: SHA });
  });

  it("moves nothing for an artifact the schema does not name", async () => {
    const relay = harness();
    await landing(relay);
    expect(
      await (
        await relay.send(CHANGE_ROOM, {
          op: "land",
          wake: 1,
          sha: SHA,
          kind: "word",
          artifact: "rounds",
        })
      ).json(),
    ).toEqual({ reason: "unknown-artifact" });
  });

  it("refuses a landing on a room with no change bound", async () => {
    const relay = harness();
    await relay.send(THREAD_ROOM, said("land", "1.1"));
    await relay.alarm(THREAD_ROOM);
    const response = await relay.send(THREAD_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "word",
      artifact: "proposal",
    });
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ reason: "no-change-bound" });
  });
});

describe("a landing on a read again", () => {
  it("shared-planning-agent-rounds-SC-77 - A reviewed-only landing needs no word", async () => {
    const relay = harness({
      compare: { body: { files: [{ filename: RECORD_PATH }] } },
      files: {
        ...FILES,
        [`${RECORD_PATH}@${SHA}`]: `${RECORD}  tech-design: 5e6f7a8b\n`,
        [`${RECORD_PATH}@main`]: RECORD,
      },
    });
    await landing(relay, "hold on");
    const before = relay.mark();
    const response = await relay.send(CHANGE_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "reviewed",
      artifact: "ui-design",
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ landed: SHA });
    // No word, so no team map and no schema: the record at both ends is all
    // this landing reads.
    expect(relay.hostCalls(before).map((call) => call.url)).toEqual([
      `https://api.github.com/repos/9gag/grade10-spec/compare/main...${SHA}`,
      `https://api.github.com/repos/9gag/grade10-spec/contents/${RECORD_PATH}?ref=main`,
      `https://api.github.com/repos/9gag/grade10-spec/contents/${RECORD_PATH}?ref=${SHA}`,
      "https://api.github.com/repos/9gag/grade10-spec/git/refs/heads/main",
    ]);
  });

  it("moves nothing where the record says more than reviewed", async () => {
    const relay = harness({
      compare: { body: { files: [{ filename: RECORD_PATH }] } },
      files: {
        ...FILES,
        [`${RECORD_PATH}@${SHA}`]: `${RECORD.replace("@ecchochan", "@dee")}  tech-design: 5e6f7a8b\n`,
        [`${RECORD_PATH}@main`]: RECORD,
      },
    });
    await landing(relay, "hold on");
    const response = await relay.send(CHANGE_ROOM, {
      op: "land",
      wake: 1,
      sha: SHA,
      kind: "reviewed",
      artifact: "ui-design",
    });
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ reason: "not-only-reviewed" });
  });

  it("moves nothing where another artifact's line was dropped", async () => {
    const relay = harness({
      compare: { body: { files: [{ filename: RECORD_PATH }] } },
      files: {
        ...FILES,
        [`${RECORD_PATH}@${SHA}`]: RECORD.replace(
          "reviewed:\n  ui-design: 1a2b3c4d\n",
          "reviewed:\n  tech-design: 5e6f7a8b\n",
        ),
        [`${RECORD_PATH}@main`]: RECORD,
      },
    });
    await landing(relay, "hold on");
    expect(
      await (
        await relay.send(CHANGE_ROOM, {
          op: "land",
          wake: 1,
          sha: SHA,
          kind: "reviewed",
          artifact: "tech-design",
        })
      ).json(),
    ).toEqual({ reason: "reviewed-line-removed" });
  });
});

describe("what the code host answers", () => {
  const land: RoomOp = {
    op: "land",
    wake: 1,
    sha: SHA,
    kind: "word",
    artifact: "proposal",
  };

  it("refuses a compare the host listed only some of", async () => {
    const files = Array.from({ length: 300 }, (_one, index) => ({
      filename: `docs/prds/page-${index}.md`,
    }));
    const relay = harness({ compare: { body: { files } } });
    await landing(relay);
    const response = await relay.send(CHANGE_ROOM, land);
    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({ reason: "compare-truncated" });
  });

  it("answers a host that refused the read as the host being unavailable", async () => {
    const relay = harness({
      compare: { status: 502, body: { message: "Bad gateway" } },
    });
    await landing(relay);
    const response = await relay.send(CHANGE_ROOM, land);
    expect(response.status).toBe(503);
    // What the host said travels into the answer: a run that only reads
    // "unavailable" has nothing to put in the thread.
    expect(await response.json()).toEqual({
      reason: "host-unavailable",
      status: 502,
      message: "Bad gateway",
    });
  });

  it("answers a move that is no longer a fast-forward with 409", async () => {
    const relay = harness({
      advance: {
        status: 422,
        body: { message: "Update is not a fast forward" },
      },
    });
    await landing(relay);
    const response = await relay.send(CHANGE_ROOM, land);
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ reason: "not-fast-forward" });
  });

  it("answers any other refusal of the move with what the host said", async () => {
    const relay = harness({
      advance: {
        status: 422,
        body: { message: "Required status check is expected" },
      },
    });
    await landing(relay);
    const response = await relay.send(CHANGE_ROOM, land);
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      reason: "host-refused",
      message: "Required status check is expected",
    });
  });
});
