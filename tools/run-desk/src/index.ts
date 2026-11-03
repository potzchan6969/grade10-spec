import { DurableObject } from "cloudflare:workers";
import { DESK_EMAIL_HEADER } from "../../manual/src/api/desk.ts";
import { handle, liveRun } from "./http.ts";
import { DeskError, DeskStore, type Sql, type SqlValue } from "./store.ts";

/**
 * The run desk: one Durable Object, `desk`, holds every run in its SQLite
 * storage. The Worker has no address of its own; the manual's Worker reaches
 * it through a service binding and names the Access identity in a header.
 */

export type Env = {
  RUN_DESK: DurableObjectNamespace<RunDesk>;
  /** `pnpm desk:dev` only: the identity when nothing in front names one. */
  DESK_DEV_EMAIL?: string;
};

const refuse = (status: number, error: string) =>
  Response.json({ error }, { status });

function storageSql(storage: DurableObjectStorage): Sql {
  return {
    exec: (query: string, ...params: SqlValue[]) =>
      storage.sql.exec<Record<string, SqlValue>>(query, ...params).toArray(),
    transaction: (write) => storage.transactionSync(write),
  };
}

export class RunDesk extends DurableObject<Env> {
  #store: DeskStore;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.#store = new DeskStore(storageSql(ctx.storage));
    ctx.setWebSocketAutoResponse(
      new WebSocketRequestResponsePair("ping", "pong"),
    );
  }

  async fetch(request: Request): Promise<Response> {
    const email =
      request.headers.get(DESK_EMAIL_HEADER) ?? this.env.DESK_DEV_EMAIL;
    if (!email)
      return refuse(403, "the desk is reached through the manual, signed in");
    const run = liveRun(new URL(request.url).pathname);
    if (run !== undefined) return this.#connect(request, run);
    const answer = await handle(this.#store, request, email);
    for (const { run, message } of answer.live) {
      const text = JSON.stringify(message);
      for (const socket of this.ctx.getWebSockets(run)) {
        try {
          socket.send(text);
        } catch (error) {
          console.error(`run desk: a live socket on run ${run} refused`, error);
        }
      }
    }
    return answer.response;
  }

  #connect(request: Request, run: string): Response {
    if (request.headers.get("upgrade")?.toLowerCase() !== "websocket")
      return refuse(426, "the live connection is a WebSocket");
    try {
      this.#store.summary(run);
    } catch (error) {
      if (error instanceof DeskError)
        return refuse(error.status, error.message);
      throw error;
    }
    const [client, server] = Object.values(new WebSocketPair());
    this.ctx.acceptWebSocket(server, [run]);
    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(): Promise<void> {}

  async webSocketClose(
    socket: WebSocket,
    code: number,
    reason: string,
  ): Promise<void> {
    try {
      socket.close(code, reason);
    } catch {
      // Already closed by the runtime's own reply.
    }
  }
}

export default {
  fetch(request, env) {
    return env.RUN_DESK.get(env.RUN_DESK.idFromName("desk")).fetch(request);
  },
} satisfies ExportedHandler<Env>;
