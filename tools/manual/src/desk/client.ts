import {
  DESK_BASE,
  type DeskMe,
  type DeskVerdicts,
  type LiveMessage,
  type Mark,
  type MarkInput,
  type Observation,
  type ObservationInput,
  type RowHistory,
  type RowObjects,
  type RunSpec,
  type RunState,
  type RunSummary,
  type RunView,
} from "../api/desk.ts";

/** An answer the desk refused, with its own words; `status` is absent when
 * the desk could not be reached at all, which is the one error worth a
 * retry. */
export class DeskError extends Error {
  readonly status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "DeskError";
    this.status = status;
  }
}

export const unreachable = (error: unknown): boolean =>
  error instanceof DeskError && error.status === undefined;

export type LiveStatus = "connecting" | "live" | "offline";

export type LiveHandlers = {
  message: (message: LiveMessage) => void;
  /** `live` again after a drop: the caller reads the run again, since
   * whatever happened while it was away never arrived. */
  status: (status: LiveStatus) => void;
};

export type DeskDownload = { name: string; blob: Blob };

/** Everything the run pages ask of the desk. The Worker answers it over
 * HTTP; the memory desk answers the same in the page, for tests and demos. */
export interface DeskApi {
  me(): Promise<DeskMe>;
  runs(): Promise<RunSummary[]>;
  openRun(spec: RunSpec): Promise<RunSummary>;
  run(id: string): Promise<RunView>;
  replaceSpec(id: string, spec: RunSpec): Promise<RunView>;
  setState(id: string, state: RunState): Promise<RunSummary>;
  mark(id: string, marks: MarkInput[]): Promise<{ marks: Mark[] }>;
  observe(
    id: string,
    observations: ObservationInput[],
  ): Promise<{ observations: Observation[] }>;
  putObjects(
    id: string,
    row: string,
    objects: RowObjects,
  ): Promise<{ objects: RowObjects; seq: number }>;
  rerun(id: string, name?: string): Promise<RunSummary>;
  history(id: string, row: string): Promise<RowHistory>;
  download(id: string, what: "csv" | "record"): Promise<DeskDownload>;
  verdicts(): Promise<DeskVerdicts>;
  /** Holds the run's live connection until the returned function is called. */
  live(id: string, handlers: LiveHandlers): () => void;
}

/** A fresh id for a mark or an observation, made here so a retry is the same
 * write. */
export function newId(): string {
  const crypto = globalThis.crypto;
  if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

/** The wait before the n-th reconnect, from one second to half a minute. */
export const backoff = (attempt: number): number =>
  Math.min(30_000, 1_000 * 2 ** Math.max(0, attempt));

type Fetch = typeof fetch;

/** The desk over HTTP, on the manual's own origin behind Access. */
export function httpDesk(
  base: string = DESK_BASE,
  fetcher: Fetch = (...args) => fetch(...args),
): DeskApi {
  const call = async (path: string, init?: RequestInit): Promise<Response> => {
    let response: Response;
    try {
      response = await fetcher(`${base}${path}`, {
        credentials: "same-origin",
        ...init,
        headers: {
          accept: "application/json",
          ...(init?.body ? { "content-type": "application/json" } : {}),
          ...init?.headers,
        },
      });
    } catch (cause) {
      throw new DeskError(
        `The desk cannot be reached: ${cause instanceof Error ? cause.message : String(cause)}`,
      );
    }
    if (response.ok) return response;
    const text = await response.text();
    let message = `${response.status} ${response.statusText}`.trim();
    try {
      const body = JSON.parse(text) as { error?: unknown };
      if (typeof body.error === "string") message = body.error;
    } catch {
      if (text.trim()) message = `${message}: ${text.trim().slice(0, 200)}`;
    }
    throw new DeskError(message, response.status);
  };
  const json = async <T>(path: string, init?: RequestInit): Promise<T> =>
    (await call(path, init)).json() as Promise<T>;
  const send = <T>(method: string, path: string, body: unknown) =>
    json<T>(path, { method, body: JSON.stringify(body) });
  const run = (id: string) => `/runs/${encodeURIComponent(id)}`;

  return {
    me: () => json("/me"),
    runs: () => json("/runs"),
    openRun: (spec) => send("POST", "/runs", spec),
    run: (id) => json(run(id)),
    replaceSpec: (id, spec) => send("PUT", `${run(id)}/spec`, spec),
    setState: (id, state) => send("POST", `${run(id)}/state`, { state }),
    mark: (id, marks) => send("POST", `${run(id)}/marks`, { marks }),
    observe: (id, observations) =>
      send("POST", `${run(id)}/observations`, { observations }),
    putObjects: (id, row, objects) =>
      send(
        "PUT",
        `${run(id)}/rows/${encodeURIComponent(row)}/objects`,
        objects,
      ),
    rerun: (id, name) => send("POST", `${run(id)}/rerun`, name ? { name } : {}),
    history: (id, row) =>
      json(`${run(id)}/rows/${encodeURIComponent(row)}/marks`),
    download: async (id, what) => {
      const response = await call(
        `${run(id)}/${what === "csv" ? "export.csv" : "record"}`,
        {
          headers: { accept: what === "csv" ? "text/csv" : "application/json" },
        },
      );
      const named = /filename="?([^";]+)"?/.exec(
        response.headers.get("content-disposition") ?? "",
      );
      return {
        name: named?.[1] ?? `run-${id}.${what === "csv" ? "csv" : "json"}`,
        blob: await response.blob(),
      };
    },
    verdicts: () => json("/verdicts"),
    live: (id, handlers) => liveSocket(liveUrl(base, id), handlers),
  };
}

function liveUrl(base: string, id: string): string {
  const { protocol, host } = window.location;
  const scheme = protocol === "https:" ? "wss:" : "ws:";
  return `${scheme}//${host}${base}/runs/${encodeURIComponent(id)}/live`;
}

/** One run's socket, opened again after every drop with a growing wait,
 * until the page lets it go. */
export function liveSocket(url: string, handlers: LiveHandlers): () => void {
  let socket: WebSocket | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let attempt = 0;
  let stopped = false;

  const connect = () => {
    if (stopped) return;
    handlers.status("connecting");
    const opened = new WebSocket(url);
    socket = opened;
    opened.onopen = () => {
      attempt = 0;
      handlers.status("live");
    };
    opened.onmessage = (event) => {
      let message: LiveMessage;
      try {
        message = JSON.parse(String(event.data)) as LiveMessage;
      } catch (cause) {
        console.error("desk sent a live message that is not JSON", cause);
        return;
      }
      handlers.message(message);
    };
    opened.onclose = () => {
      if (stopped || socket !== opened) return;
      handlers.status("offline");
      timer = setTimeout(connect, backoff(attempt));
      attempt += 1;
    };
  };

  const wake = () => {
    if (stopped || socket?.readyState === WebSocket.OPEN) return;
    if (timer) clearTimeout(timer);
    attempt = 0;
    connect();
  };
  window.addEventListener("online", wake);
  connect();

  return () => {
    stopped = true;
    window.removeEventListener("online", wake);
    if (timer) clearTimeout(timer);
    socket?.close();
  };
}
