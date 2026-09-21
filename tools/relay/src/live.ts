/**
 * The live line: one Durable Object for `main`, holding where `main` is and
 * every open page's socket.
 *
 * One object, named `main`, because `main` is one line: every page listens to
 * the same object, and a push is one broadcast however many pages are open. The
 * sockets are hibernatable, so an object with idle pages on it is evicted
 * between pushes and woken by what arrives.
 *
 * It holds no rules. `live-state.ts` decides what the next head is and who is
 * told, and this class does what the step says: store the head, send it to
 * every socket it holds, and send it to a socket the moment it is accepted.
 */
import {
  type Head,
  headBody,
  headText,
  isUpgrade,
  moved,
} from "./live-state.ts";
import { json, type LiveOp, reasonOf } from "./rpc.ts";

/** Where the head is kept. */
const HEAD = "head";

/** When a push arrived, by this object's own clock: the one clock a page and
 * the relay share. */
const arrivedNow = (): string => new Date().toISOString();

/** What a page sends to tell an open line from one the network has abandoned,
 * and what it is answered. The runtime answers it from the pair, so a page's
 * half-minute ping does not wake an object that is asleep. */
const PING = "ping";
const PONG = "pong";

export class Live {
  private readonly ctx: DurableObjectState;

  /** The deployment is not read here: the object holds one head and the sockets
   * listening to it, and neither is a secret or a variable. */
  constructor(ctx: DurableObjectState) {
    this.ctx = ctx;
  }

  async fetch(request: Request): Promise<Response> {
    if (isUpgrade(request)) return this.onUpgrade();
    const op = (await request.json()) as LiveOp;
    switch (op.op) {
      case "moved":
        return this.onMoved(op);
      case "head":
        return json(200, headBody(await this.stored()));
      default:
        return json(400, { reason: "unknown-op" });
    }
  }

  /** A page's socket, accepted and told where `main` is. The head goes out
   * first: a page that opened while the site it is served from was already
   * behind reads that from the socket alone. */
  private async onUpgrade(): Promise<Response> {
    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    this.ctx.acceptWebSocket(server);
    this.ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair(PING, PONG),
    );
    server.send(headText(await this.stored()));
    return new Response(null, { status: 101, webSocket: client });
  }

  /** The move stored, stamped with this object's own clock, and every open
   * socket told it. The answer names the move beside the count: a first push
   * with no page open moved `main` as much as one that reached ten, and a count
   * alone reads the same as a delivery the host sent twice. */
  private async onMoved(
    op: Extract<LiveOp, { op: "moved" }>,
  ): Promise<Response> {
    const step = moved(await this.stored(), op.push, arrivedNow);
    await this.ctx.storage.put(HEAD, step.head);
    const told = step.broadcast === null ? 0 : this.tell(step.broadcast);
    return json(200, { moved: step.broadcast !== null, told });
  }

  /** Whatever a page says, it is answered with the head: a page that woke from
   * sleep asks on the socket it has rather than opening a second one. */
  async webSocketMessage(socket: WebSocket): Promise<void> {
    this.send(socket, headText(await this.stored()));
  }

  /** The page went away. The object's end is closed with the code and the
   * reason the page sent, so the runtime stops handing that socket back and the
   * log reads how it went: a reader who navigated away and one whose network
   * dropped close the same socket for different reasons. */
  async webSocketClose(
    socket: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean,
  ): Promise<void> {
    console.log(
      `relay live: a socket closed ${wasClean ? "cleanly" : "not cleanly"}, ${code} ${reason}`,
    );
    socket.close(code, reason);
  }

  /** The socket itself failed. Nothing more is coming on it, so the object's
   * end is closed as an error and the runtime's own words are logged: a socket
   * torn down with nothing said is a page nobody knows stopped listening. */
  async webSocketError(socket: WebSocket, error: unknown): Promise<void> {
    console.error(`relay live: a socket failed: ${reasonOf(error)}`);
    socket.close(1011, "the socket failed");
  }

  private async stored(): Promise<Head | null> {
    return (await this.ctx.storage.get<Head>(HEAD)) ?? null;
  }

  /** The head to every socket the object holds, and how many took it. */
  private tell(text: string): number {
    let told = 0;
    for (const socket of this.ctx.getWebSockets()) {
      if (this.send(socket, text)) told += 1;
    }
    return told;
  }

  /** The head to one socket, and whether it took it. One guard for every send
   * the object makes to a socket it holds: a send that throws is a page that
   * went away between the push and this line, which is logged while the rest
   * are still told. The upgrade's own send is not one of these — a page whose
   * first send fails has no socket to keep. */
  private send(socket: WebSocket, text: string): boolean {
    try {
      socket.send(text);
      return true;
    } catch (error) {
      console.error(
        `relay live: a socket did not take the head: ${reasonOf(error)}`,
      );
      return false;
    }
  }
}
