import type {
  Mark,
  MarkInput,
  Observation,
  ObservationInput,
  RowObjects,
} from "../api/desk.ts";
import { browserKeyStore, type KeyStore } from "../editor/config.ts";
import { backoff, type DeskApi, DeskError, newId } from "./client.ts";

/** A write the page made and the desk has not yet acknowledged. */
export type OutboxOp =
  | { kind: "marks"; id: string; at: string; marks: MarkInput[] }
  | {
      kind: "observations";
      id: string;
      at: string;
      observations: ObservationInput[];
    }
  | {
      kind: "objects";
      id: string;
      at: string;
      row: string;
      objects: RowObjects;
    };

export type OutboxDraft = OutboxOp extends infer O
  ? O extends OutboxOp
    ? Omit<O, "id" | "at">
    : never
  : never;

export type Acknowledged =
  | { kind: "marks"; op: OutboxOp; marks: Mark[] }
  | { kind: "observations"; op: OutboxOp; observations: Observation[] }
  | {
      kind: "objects";
      op: OutboxOp;
      row: string;
      objects: RowObjects;
      seq: number;
    };

/** Why writes still wait: the desk is out of reach, busy or failing, or it
 * no longer knows who is marking until they sign in again. */
export type Held = {
  reason: "unreachable" | "unavailable" | "signed-out";
  message: string;
};

export type FlushResult = {
  /** Writes the desk refused: dropped, since sending them again is refused
   * again, and said out loud. */
  rejected: { op: OutboxOp; message: string }[];
  /** Set when writes still wait to be sent again. */
  held: Held | null;
};

/** The answers that refuse the write itself; anything else may pass on a
 * later try, so the write waits for it. */
const REFUSED = new Set([400, 404, 409, 413, 415, 422]);

/** What a failed send means for the write: `null` when the desk refused it
 * for good. */
export function heldBy(error: unknown): Held | null {
  const message = error instanceof Error ? error.message : String(error);
  if (!(error instanceof DeskError)) return { reason: "unavailable", message };
  if (error.status === undefined) return { reason: "unreachable", message };
  if (error.status === 401 || error.status === 403)
    return { reason: "signed-out", message };
  if (REFUSED.has(error.status)) return null;
  return { reason: "unavailable", message };
}

const KEY = (run: string) => `manual.desk.outbox.${run}`;

const isOp = (value: unknown): value is OutboxOp =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as OutboxOp).id === "string" &&
  ["marks", "observations", "objects"].includes((value as OutboxOp).kind);

const parse = (raw: string | null): OutboxOp[] => {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isOp) : [];
  } catch (cause) {
    console.error("the desk outbox in this browser is unreadable", cause);
    return [];
  }
};

/** Calls `refresh` whenever another tab changes `key`. */
export type StorageWatch = (refresh: () => void) => () => void;

const storageEvents =
  (key: string): StorageWatch =>
  (refresh) => {
    if (typeof window === "undefined") return () => {};
    const heard = (event: StorageEvent) => {
      if (event.key === key || event.key === null) refresh();
    };
    window.addEventListener("storage", heard);
    return () => window.removeEventListener("storage", heard);
  };

/**
 * One run's unsent writes, in the order they were made, kept in the browser
 * so a mark made offline survives a reload and sends on reconnect. Storage
 * is the queue: every tab of the run reads it before each change, so two
 * tabs add to one list. A mark carries the id the page gave it, so one sent
 * twice — by two tabs, or after a lost answer — is taken once.
 */
export class Outbox {
  private raw: string | null = null;
  private ops: OutboxOp[] = [];
  /** The queue while this browser keeps nothing, so this tab still sends. */
  private local: OutboxOp[] | null = null;
  private flushing: Promise<FlushResult> | null = null;
  private readonly listeners = new Set<() => void>();
  private unwatch: (() => void) | null = null;
  readonly run: string;
  private readonly store: KeyStore;
  private readonly watch: StorageWatch;

  constructor(
    run: string,
    store: KeyStore = browserKeyStore,
    watch: StorageWatch = storageEvents(KEY(run)),
  ) {
    this.run = run;
    this.store = store;
    this.watch = watch;
    this.read();
  }

  private read(): OutboxOp[] {
    if (this.local) return this.local;
    const raw = this.store.get(KEY(this.run));
    if (raw !== this.raw) {
      this.raw = raw;
      this.ops = parse(raw);
    }
    return this.ops;
  }

  private write(ops: OutboxOp[]) {
    const key = KEY(this.run);
    const raw = ops.length === 0 ? null : JSON.stringify(ops);
    if (raw === null) this.store.remove(key);
    else this.store.set(key, raw);
    const kept = this.store.get(key) === raw;
    if (!kept)
      console.error("this browser did not keep the desk outbox", this.run);
    this.local = kept ? null : ops;
    this.raw = kept ? raw : this.raw;
    this.ops = ops;
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) listener();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    this.unwatch ??= this.watch(() => {
      const before = this.ops;
      if (this.read() !== before) this.notify();
    });
    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size > 0) return;
      this.unwatch?.();
      this.unwatch = null;
    };
  }

  list(): OutboxOp[] {
    return this.read();
  }

  add(op: OutboxDraft): OutboxOp {
    const queued = {
      ...op,
      id: newId(),
      at: new Date().toISOString(),
    } as OutboxOp;
    this.write([...this.read(), queued]);
    return queued;
  }

  private drop(id: string) {
    this.write(this.read().filter((op) => op.id !== id));
  }

  /** Sends every waiting write in order, from whichever tab made it,
   * stopping at the first the desk cannot take yet. One flush at a time; a
   * second call joins it, and a write queued meanwhile is sent before it
   * ends. */
  flush(
    desk: DeskApi,
    onAck: (ack: Acknowledged) => void,
  ): Promise<FlushResult> {
    if (this.flushing) return this.flushing;
    const handled = new Set<string>();
    const done = () => {
      this.flushing = null;
    };
    const sending = this.send(desk, onAck, handled).then(
      async (result) => {
        done();
        const more = this.read().some((op) => !handled.has(op.id));
        if (result.held || !more) return result;
        const next = await this.flush(desk, onAck);
        return {
          rejected: [...result.rejected, ...next.rejected],
          held: next.held,
        };
      },
      (error: unknown) => {
        done();
        throw error;
      },
    );
    this.flushing = sending;
    return sending;
  }

  private async send(
    desk: DeskApi,
    onAck: (ack: Acknowledged) => void,
    handled: Set<string>,
  ): Promise<FlushResult> {
    const rejected: FlushResult["rejected"] = [];
    for (;;) {
      const op = this.read().find((one) => !handled.has(one.id));
      if (!op) return { rejected, held: null };
      handled.add(op.id);
      let ack: Acknowledged;
      try {
        ack = await this.deliver(desk, op);
      } catch (error) {
        const held = heldBy(error);
        if (held) {
          console.error(`a desk write waits (${held.reason})`, op, error);
          return { rejected, held };
        }
        console.error("the desk refused a write", op, error);
        this.drop(op.id);
        rejected.push({ op, message: (error as Error).message });
        continue;
      }
      this.drop(op.id);
      onAck(ack);
    }
  }

  private async deliver(desk: DeskApi, op: OutboxOp): Promise<Acknowledged> {
    if (op.kind === "marks") {
      const { marks } = await desk.mark(this.run, op.marks);
      return { kind: "marks", op, marks };
    }
    if (op.kind === "observations") {
      const { observations } = await desk.observe(this.run, op.observations);
      return { kind: "observations", op, observations };
    }
    const answer = await desk.putObjects(this.run, op.row, op.objects);
    return { kind: "objects", op, row: op.row, ...answer };
  }
}

export type Sender = {
  /** Sends now, without waiting out a pending retry. */
  wake(): void;
  stop(): void;
};

/** Keeps `outbox` sending to `desk`: every write waits only as long as the
 * desk cannot take it, tried again after a growing wait. Each flush's
 * outcome is reported once. */
export function keepSending(
  outbox: Outbox,
  desk: DeskApi,
  handlers: {
    ack: (ack: Acknowledged) => void;
    result: (result: FlushResult) => void;
  },
): Sender {
  let attempt = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let current: Promise<FlushResult> | null = null;
  let stopped = false;

  const wake = () => {
    if (stopped) return;
    if (timer) clearTimeout(timer);
    timer = null;
    const flushing = outbox.flush(desk, handlers.ack);
    if (flushing === current) return;
    current = flushing;
    flushing.then(
      (result) => {
        if (stopped) return;
        handlers.result(result);
        if (!result.held) {
          attempt = 0;
          return;
        }
        if (timer) return;
        timer = setTimeout(wake, backoff(attempt));
        attempt += 1;
      },
      (error: unknown) => console.error("the desk outbox failed", error),
    );
  };

  return {
    wake,
    stop: () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      timer = null;
    },
  };
}
