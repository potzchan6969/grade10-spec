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
import { type Head, headBody, headText, moved } from "./live-state.ts";
import { json, type LiveOp } from "./rpc.ts";

/** Where the head is kept. */
const HEAD = "head";

/** What went wrong, in the words a log can read. */
const reasonOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

/** A read of `/live` is a page opening a socket. The header is the whole of the
 * ask, and a read without it is a browser that cannot. */
export const isUpgrade = (request: Request): boolean =>
  (request.headers.get("upgrade") ?? "").toLowerCase() === "websocket";

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
    server.send(headText(await this.stored()));
    return new Response(null, { status: 101, webSocket: client });
  }

  private async onMoved(
    op: Extract<LiveOp, { op: "moved" }>,
  ): Promise<Response> {
    const step = moved(await this.stored(), op);
    await this.ctx.storage.put(HEAD, step.head);
    let told = 0;
    for (const command of step.commands) told = this.tell(command.text);
    return json(200, { told });
  }

  /** Whatever a page says, it is answered with the head: a page that woke from
   * sleep asks on the socket it has rather than opening a second one. */
  async webSocketMessage(socket: WebSocket): Promise<void> {
    socket.send(headText(await this.stored()));
  }

  /** The page went away. The object's end is closed with it, so the runtime
   * stops handing that socket back. */
  async webSocketClose(socket: WebSocket): Promise<void> {
    socket.close(1000, "the page closed the socket");
  }

  private async stored(): Promise<Head | null> {
    return (await this.ctx.storage.get<Head>(HEAD)) ?? null;
  }

  /** The head to every socket the object holds, and how many took it. A send
   * that throws is a page that went away between the push and this line: it is
   * dropped, and the rest are still told. */
  private tell(text: string): number {
    let told = 0;
    for (const socket of this.ctx.getWebSockets()) {
      try {
        socket.send(text);
        told += 1;
      } catch (error) {
        console.error(
          `relay live: a socket did not take the head: ${reasonOf(error)}`,
        );
      }
    }
    return told;
  }
}
