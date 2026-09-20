import { afterEach, describe, expect, it, vi } from "vitest";
import { Live } from "../src/live.ts";
import { type Head, headText } from "../src/live-state.ts";
import type { LiveOp } from "../src/rpc.ts";
import { HEAD, NEXT, storageMap } from "./fixtures.ts";

/** The live object, driven over a stub `DurableObjectState` — a storage map and
 * a list of sockets — with no runtime behind it.
 *
 * The move itself is read in `live-state.test.ts`; what is read here is the
 * wiring: what a socket is sent the moment it is accepted, who is told when
 * `main` moves, what is stored, and what happens to a socket whose page went
 * away. */

/** A page's socket: what it was sent, and whether its page is still there.
 * Sending on a socket that went away throws, as the runtime's does. */
class FakeSocket {
  readonly sent: string[] = [];
  closed: { code: number; reason: string } | null = null;
  gone = false;

  send(text: string): void {
    if (this.gone) throw new Error("WebSocket is not connected");
    this.sent.push(text);
  }

  close(code: number, reason: string): void {
    this.closed = { code, reason };
  }
}

/** The pair the runtime hands an upgrade: the page's end and the object's. */
class FakePair {
  readonly 0 = new FakeSocket();
  readonly 1 = new FakeSocket();
}

/**
 * Node's `Response` refuses a status under 200 and the runtime answers an
 * upgrade with 101, so every answer the object builds here is one of these: the
 * status, the body and the socket it was handed, held as they were given.
 */
class Answer {
  readonly status: number;
  readonly body: string | null;
  readonly socket: FakeSocket | null;

  constructor(
    body: string | null,
    init?: { status?: number; webSocket?: FakeSocket },
  ) {
    this.status = init?.status ?? 200;
    this.body = typeof body === "string" ? body : null;
    this.socket = init?.webSocket ?? null;
  }

  read(): unknown {
    return JSON.parse(this.body ?? "null");
  }
}

function harness() {
  const storage = storageMap();
  const accepted: FakeSocket[] = [];
  const ctx = {
    id: { toString: () => "main" },
    storage,
    acceptWebSocket: (socket: FakeSocket) => {
      accepted.push(socket);
    },
    getWebSockets: () => accepted,
  } as unknown as DurableObjectState;
  const live = new Live(ctx);

  vi.stubGlobal("Response", Answer);
  vi.stubGlobal("WebSocketPair", FakePair);

  return {
    /** The sockets the object holds, as a page's own end reads them. */
    accepted,
    live,
    async send(op: LiveOp): Promise<Answer> {
      return (await live.fetch(
        new Request("https://relay.invalid/live", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(op),
        }),
      )) as unknown as Answer;
    },
    /** A page opening its socket. */
    async upgrade(): Promise<Answer> {
      return (await live.fetch(
        new Request("https://relay.invalid/live", {
          headers: { upgrade: "websocket" },
        }),
      )) as unknown as Answer;
    },
    stored(): Head | undefined {
      return storage.held.get("head") as Head | undefined;
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("a page's socket", () => {
  it("is accepted and sent where `main` is", async () => {
    const relay = harness();
    await relay.send({ op: "moved", head: HEAD });
    const answer = await relay.upgrade();
    expect(answer.status).toBe(101);
    expect(answer.socket).not.toBeNull();
    expect(relay.accepted).toHaveLength(1);
    expect(relay.accepted[0].sent).toEqual([headText(HEAD)]);
  });

  it("is sent `main` as null while nothing has pushed", async () => {
    const relay = harness();
    await relay.upgrade();
    expect(relay.accepted[0].sent).toEqual(['{"main":null}']);
  });

  it("is answered with the head whatever it says", async () => {
    const relay = harness();
    await relay.send({ op: "moved", head: HEAD });
    await relay.upgrade();
    const socket = relay.accepted[0];
    socket.sent.length = 0;
    await relay.live.webSocketMessage(socket as unknown as WebSocket);
    expect(socket.sent).toEqual([headText(HEAD)]);
  });

  it("is closed at the object's end with the code the page sent", async () => {
    const relay = harness();
    await relay.upgrade();
    const socket = relay.accepted[0];
    const said = vi.spyOn(console, "log").mockImplementation(() => {});
    await relay.live.webSocketClose(
      socket as unknown as WebSocket,
      1001,
      "the page navigated away",
      true,
    );
    expect(socket.closed).toEqual({
      code: 1001,
      reason: "the page navigated away",
    });
    expect(String(said.mock.calls[0][0])).toContain("cleanly");

    // A close the page never asked for reads as one: a reader whose network
    // went says so in the log, where every close logged the same would not.
    await relay.live.webSocketClose(
      socket as unknown as WebSocket,
      1006,
      "",
      false,
    );
    expect(socket.closed).toEqual({ code: 1006, reason: "" });
    expect(String(said.mock.calls[1][0])).toContain("not cleanly");
    said.mockRestore();
  });

  it("is closed 1011 when the socket itself fails, with the failure logged", async () => {
    const relay = harness();
    await relay.upgrade();
    const socket = relay.accepted[0];
    const told = vi.spyOn(console, "error").mockImplementation(() => {});
    await relay.live.webSocketError(
      socket as unknown as WebSocket,
      new Error("the socket broke"),
    );
    expect(socket.closed).toEqual({ code: 1011, reason: "the socket failed" });
    expect(String(told.mock.calls[0][0])).toContain("the socket broke");
    told.mockRestore();
  });

  it("is answered nothing where its page went away mid-question", async () => {
    // Every send the object makes to a socket it holds goes through one guard:
    // a page gone between the question and the answer is logged, and the
    // object answers the next ask.
    const relay = harness();
    await relay.upgrade();
    const socket = relay.accepted[0];
    socket.sent.length = 0;
    socket.gone = true;
    const told = vi.spyOn(console, "error").mockImplementation(() => {});
    await relay.live.webSocketMessage(socket as unknown as WebSocket);
    expect(socket.sent).toEqual([]);
    expect(told).toHaveBeenCalledTimes(1);
    told.mockRestore();
  });
});

describe("a move", () => {
  it("shared-planning-change-stages-SC-72 - stores the head and tells every open socket", async () => {
    const relay = harness();
    await relay.upgrade();
    await relay.upgrade();
    for (const socket of relay.accepted) socket.sent.length = 0;

    const answer = await relay.send({ op: "moved", head: HEAD });
    expect(answer.status).toBe(200);
    expect(answer.read()).toEqual({ moved: true, told: 2 });
    expect(relay.stored()).toEqual(HEAD);
    for (const socket of relay.accepted)
      expect(socket.sent).toEqual([headText(HEAD)]);
  });

  it("tells the rest, and logs it, where one page went away", async () => {
    const relay = harness();
    await relay.upgrade();
    await relay.upgrade();
    const [gone, open] = relay.accepted;
    gone.gone = true;
    open.sent.length = 0;
    const told = vi.spyOn(console, "error").mockImplementation(() => {});

    const answer = await relay.send({ op: "moved", head: HEAD });
    expect(answer.read()).toEqual({ moved: true, told: 1 });
    expect(open.sent).toEqual([headText(HEAD)]);
    expect(relay.stored()).toEqual(HEAD);
    expect(told).toHaveBeenCalledTimes(1);
    expect(String(told.mock.calls[0][0])).toContain(
      "a socket did not take the head",
    );
    told.mockRestore();
  });

  it("says it moved the head where no page was open to be told", async () => {
    // A relay nobody has a page on still moved `main`: the delivery log reads
    // the move, where a count alone reads the same as a replay.
    const relay = harness();
    const answer = await relay.send({ op: "moved", head: HEAD });
    expect(answer.read()).toEqual({ moved: true, told: 0 });
    expect(relay.stored()).toEqual(HEAD);
  });

  it("tells nobody twice about one commit, and everybody about the next", async () => {
    const relay = harness();
    await relay.upgrade();
    const socket = relay.accepted[0];
    socket.sent.length = 0;

    await relay.send({ op: "moved", head: HEAD });
    const again = await relay.send({ op: "moved", head: HEAD });
    expect(again.read()).toEqual({ moved: false, told: 0 });
    expect(socket.sent).toEqual([headText(HEAD)]);

    await relay.send({ op: "moved", head: NEXT });
    expect(socket.sent).toEqual([headText(HEAD), headText(NEXT)]);
    expect(relay.stored()).toEqual(NEXT);
  });
});

describe("where `main` is", () => {
  it("answers `main` as null before any push", async () => {
    const relay = harness();
    const answer = await relay.send({ op: "head" });
    expect(answer.status).toBe(200);
    expect(answer.read()).toEqual({ main: null });
  });

  it("answers the head the last push stored", async () => {
    const relay = harness();
    await relay.send({ op: "moved", head: HEAD });
    expect((await relay.send({ op: "head" })).read()).toEqual(HEAD);
  });
});

describe("an op the object does not know", () => {
  it("is refused", async () => {
    const relay = harness();
    const answer = await relay.send({ op: "archive" } as unknown as LiveOp);
    expect(answer.status).toBe(400);
    expect(answer.read()).toEqual({ reason: "unknown-op" });
  });
});
