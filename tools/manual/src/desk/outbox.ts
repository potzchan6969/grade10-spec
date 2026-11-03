import type {
  Mark,
  MarkInput,
  Observation,
  ObservationInput,
  RowObjects,
} from "../api/desk.ts";
import { browserKeyStore, type KeyStore } from "../editor/config.ts";
import { type DeskApi, newId, unreachable } from "./client.ts";

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

export type FlushResult = {
  /** Writes the desk refused: dropped, since sending them again is refused
   * again, and said out loud. */
  rejected: { op: OutboxOp; message: string }[];
  /** True when the desk could not be reached and writes still wait. */
  waiting: boolean;
};

const KEY = (run: string) => `manual.desk.outbox.${run}`;

const isOp = (value: unknown): value is OutboxOp =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as OutboxOp).id === "string" &&
  ["marks", "observations", "objects"].includes((value as OutboxOp).kind);

/**
 * One run's unsent writes, in the order they were made, kept in the browser
 * so a mark made offline survives a reload and sends on reconnect. A mark
 * carries the id the page gave it, so one sent twice is taken once.
 */
export class Outbox {
  private ops: OutboxOp[];
  private flushing: Promise<FlushResult> | null = null;
  private readonly listeners = new Set<() => void>();
  readonly run: string;
  private readonly store: KeyStore;

  constructor(run: string, store: KeyStore = browserKeyStore) {
    this.run = run;
    this.store = store;
    this.ops = this.read();
  }

  private read(): OutboxOp[] {
    try {
      const parsed: unknown = JSON.parse(this.store.get(KEY(this.run)) ?? "[]");
      return Array.isArray(parsed) ? parsed.filter(isOp) : [];
    } catch {
      return [];
    }
  }

  private write() {
    if (this.ops.length === 0) this.store.remove(KEY(this.run));
    else this.store.set(KEY(this.run), JSON.stringify(this.ops));
    for (const listener of this.listeners) listener();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  list(): OutboxOp[] {
    return this.ops;
  }

  add(op: OutboxDraft): OutboxOp {
    const queued = {
      ...op,
      id: newId(),
      at: new Date().toISOString(),
    } as OutboxOp;
    this.ops = [...this.ops, queued];
    this.write();
    return queued;
  }

  private drop(id: string) {
    this.ops = this.ops.filter((op) => op.id !== id);
    this.write();
  }

  /** Sends every waiting write in order, stopping at the first the desk
   * cannot be reached for. One flush at a time; a second call joins it. */
  flush(
    desk: DeskApi,
    onAck: (ack: Acknowledged) => void,
  ): Promise<FlushResult> {
    if (this.flushing) return this.flushing;
    this.flushing = this.send(desk, onAck).finally(() => {
      this.flushing = null;
    });
    return this.flushing;
  }

  private async send(
    desk: DeskApi,
    onAck: (ack: Acknowledged) => void,
  ): Promise<FlushResult> {
    const rejected: FlushResult["rejected"] = [];
    for (const op of [...this.ops]) {
      try {
        if (op.kind === "marks") {
          const { marks } = await desk.mark(this.run, op.marks);
          this.drop(op.id);
          onAck({ kind: "marks", op, marks });
        } else if (op.kind === "observations") {
          const { observations } = await desk.observe(
            this.run,
            op.observations,
          );
          this.drop(op.id);
          onAck({ kind: "observations", op, observations });
        } else {
          const answer = await desk.putObjects(this.run, op.row, op.objects);
          this.drop(op.id);
          onAck({ kind: "objects", op, row: op.row, ...answer });
        }
      } catch (error) {
        if (unreachable(error)) return { rejected, waiting: true };
        const message = error instanceof Error ? error.message : String(error);
        console.error("the desk refused a write", op, error);
        this.drop(op.id);
        rejected.push({ op, message });
      }
    }
    return { rejected, waiting: false };
  }
}
