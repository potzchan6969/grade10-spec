import { DESK_BASE } from "../../manual/src/api/desk.ts";
import { DeskError, type DeskStore, type Live } from "./store.ts";

/**
 * The desk's HTTP answers over a store, in plain Fetch types, so the tests
 * drive the same routes the Durable Object serves. The live socket is the
 * Durable Object's own; everything else is here.
 */

export type Answer = { response: Response; live: Live[] };

const json = (status: number, body: unknown): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

/** The run a `/runs/:id/live` path names, or nothing. */
export function liveRun(path: string): string | undefined {
  const parts = partsOf(path);
  return parts?.length === 3 && parts[0] === "runs" && parts[2] === "live"
    ? parts[1]
    : undefined;
}

function partsOf(path: string): string[] | undefined {
  if (path !== DESK_BASE && !path.startsWith(`${DESK_BASE}/`)) return undefined;
  return path
    .slice(DESK_BASE.length)
    .split("/")
    .filter(Boolean)
    .map(decodeURIComponent);
}

/** The largest body the desk reads: a whole-suite run's spec runs to a few
 * megabytes; nothing a person sends comes near it. */
export const MAX_BODY = 16 * 1024 * 1024;

async function body(request: Request): Promise<unknown> {
  const type = request.headers.get("content-type") ?? "";
  if (!/^application\/json\b/i.test(type))
    throw new DeskError(415, "the desk reads JSON: send application/json");
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY)
    throw new DeskError(413, `the body is past the desk's ${MAX_BODY} bytes`);
  const text = await request.text();
  if (text.length > MAX_BODY)
    throw new DeskError(413, `the body is past the desk's ${MAX_BODY} bytes`);
  if (text.trim() === "") return undefined;
  try {
    return JSON.parse(text);
  } catch {
    throw new DeskError(400, "the body is not JSON");
  }
}

export async function handle(
  store: DeskStore,
  request: Request,
  email: string,
): Promise<Answer> {
  const url = new URL(request.url);
  try {
    return await route(store, request, url, email);
  } catch (error) {
    if (error instanceof DeskError)
      return {
        response: json(error.status, { error: error.message }),
        live: [],
      };
    console.error(`run desk: ${request.method} ${url.pathname} failed`, error);
    return {
      response: json(500, {
        error: error instanceof Error ? error.message : String(error),
      }),
      live: [],
    };
  }
}

async function route(
  store: DeskStore,
  request: Request,
  url: URL,
  email: string,
): Promise<Answer> {
  const method = request.method;
  const parts = partsOf(url.pathname);
  const done = (status: number, value: unknown, live: Live[] = []): Answer => ({
    response: json(status, value),
    live,
  });
  const only = (allowed: string) => {
    if (method !== allowed)
      throw new DeskError(
        405,
        `${url.pathname} answers ${allowed}, not ${method}`,
      );
  };
  if (!parts) throw new DeskError(404, `${url.pathname} is not on the desk`);
  const [head, id, leaf, row, rowLeaf] = parts;

  if (parts.length === 1 && head === "me") {
    only("GET");
    return done(200, { email });
  }
  if (parts.length === 1 && head === "verdicts") {
    only("GET");
    return done(200, store.verdicts());
  }
  if (parts.length === 1 && head === "runs") {
    if (method === "GET") return done(200, store.runs());
    only("POST");
    return done(201, store.open(await body(request), email));
  }
  if (head !== "runs" || id === undefined)
    throw new DeskError(404, `${url.pathname} is not on the desk`);
  if (parts.length === 2) {
    only("GET");
    return done(200, store.view(id));
  }
  if (parts.length === 3) {
    switch (leaf) {
      case "spec": {
        only("PUT");
        const { value, live } = store.replaceSpec(
          id,
          await body(request),
          email,
        );
        return done(200, value, live);
      }
      case "state": {
        only("POST");
        const { value, live } = store.setState(id, await body(request), email);
        return done(200, value, live);
      }
      case "marks": {
        only("POST");
        const { value, live } = store.mark(id, await body(request), email);
        return done(200, { marks: value }, live);
      }
      case "observations": {
        only("POST");
        const { value, live } = store.observe(id, await body(request), email);
        return done(200, { observations: value }, live);
      }
      case "rerun": {
        only("POST");
        return done(201, store.rerun(id, await body(request), email));
      }
      case "record": {
        only("GET");
        return done(200, store.record(id));
      }
      case "export.csv": {
        only("GET");
        const run = store.summary(id);
        return {
          response: new Response(store.csv(id), {
            headers: {
              "content-type": "text/csv; charset=utf-8",
              "content-disposition": `attachment; filename="${fileName(run.id, run.name)}"`,
            },
          }),
          live: [],
        };
      }
      case "live":
        throw new DeskError(426, "the live connection is a WebSocket");
    }
  }
  if (parts.length === 5 && leaf === "rows" && row && rowLeaf === "marks") {
    only("GET");
    return done(200, store.history(id, row));
  }
  if (parts.length === 5 && leaf === "rows" && row && rowLeaf === "objects") {
    only("PUT");
    const { value, live } = store.setObjects(
      id,
      row,
      await body(request),
      email,
    );
    return done(200, value, live);
  }
  throw new DeskError(404, `${url.pathname} is not on the desk`);
}

const fileName = (id: string, name: string) =>
  `run-${id}-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.csv`;
