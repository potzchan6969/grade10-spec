import {
  BULK_MARKS,
  type DeskVerdicts,
  type LiveMessage,
  MARKS,
  type Mark,
  type MarkInput,
  type Observation,
  type RowHistory,
  type RowObjects,
  type RunRow,
  type RunSpec,
  type RunState,
  type RunSummary,
  type RunView,
  SURFACES,
  triagesFor,
} from "../api/desk.ts";
import { rowVerdict } from "../api/verdicts.ts";
import { type DeskApi, DeskError, type LiveHandlers } from "./client.ts";

type Held = {
  run: RunSummary;
  spec: RunSpec;
  rows: RunRow[];
  marks: Mark[];
  observations: Observation[];
  objects: Record<string, RowObjects>;
  seq: number;
};

/** The rows a run's selection makes: a case, or one row per data row. */
export function rowsOf(spec: RunSpec): RunRow[] {
  return spec.cases.flatMap((one) =>
    one.data && one.data.rows.length > 0
      ? one.data.rows.map((_, at) => ({
          key: `${one.id}#${at + 1}`,
          case: one.id,
          index: at + 1,
        }))
      : [{ key: one.id, case: one.id, index: 0 }],
  );
}

const clone = <T>(value: T): T => structuredClone(value);

/**
 * The desk, held in the page: the same answers and refusals as the Worker,
 * for tests and for `?desk=memory` demos. Never on the production path.
 */
export class MemoryDesk implements DeskApi {
  private readonly runsById = new Map<string, Held>();
  private readonly listeners = new Map<string, Set<LiveHandlers>>();
  private nextRun = 1;
  private online = true;

  private readonly email: string;
  private readonly now: () => string;

  constructor(
    email = "qa@grade10.test",
    now: () => string = () => new Date().toISOString(),
  ) {
    this.email = email;
    this.now = now;
  }

  /** Cuts the desk off, as a dropped network would, or brings it back. */
  setOnline(online: boolean) {
    this.online = online;
    for (const set of this.listeners.values())
      for (const handlers of set) handlers.status(online ? "live" : "offline");
  }

  private reach() {
    if (!this.online)
      throw new DeskError("The desk cannot be reached: offline");
  }

  private held(id: string): Held {
    this.reach();
    const held = this.runsById.get(id);
    if (!held) throw new DeskError(`No run ${id}`, 404);
    return held;
  }

  private emit(id: string, message: LiveMessage) {
    for (const handlers of this.listeners.get(id) ?? [])
      handlers.message(clone(message));
  }

  async me() {
    this.reach();
    return { email: this.email };
  }

  async runs() {
    this.reach();
    return [...this.runsById.values()]
      .map((held) => clone(held.run))
      .sort(
        (a, b) =>
          b.openedAt.localeCompare(a.openedAt) || Number(b.id) - Number(a.id),
      );
  }

  async openRun(spec: RunSpec, id?: string): Promise<RunSummary> {
    this.reach();
    const open = [...this.runsById.values()].find(
      (held) =>
        held.run.state !== "closed" &&
        held.run.fingerprint === spec.fingerprint &&
        !spec.rerunOf,
    );
    if (open)
      throw new DeskError(
        `run ${open.run.id} (${open.run.name}) already holds this selection: mark it there, or close it before opening it again`,
        409,
      );
    const runId = id ?? String(this.nextRun);
    this.nextRun = Math.max(
      this.nextRun,
      Number(runId) + 1 || this.nextRun + 1,
    );
    const rows = rowsOf(spec);
    const run: RunSummary = {
      id: runId,
      name: spec.name,
      env: spec.env,
      ...(spec.phase ? { phase: spec.phase } : {}),
      state: "open",
      openedBy: this.email,
      openedAt: this.now(),
      source: spec.source,
      fingerprint: spec.fingerprint,
      cases: spec.cases.length,
      rows: rows.length,
      ...(spec.rerunOf ? { rerunOf: spec.rerunOf } : {}),
    };
    this.runsById.set(runId, {
      run,
      spec: clone(spec),
      rows,
      marks: [],
      observations: [],
      objects: {},
      seq: 0,
    });
    return clone(run);
  }

  async run(id: string): Promise<RunView> {
    const held = this.held(id);
    return clone({
      run: held.run,
      spec: held.spec,
      rows: held.rows,
      marks: this.currentMarks(held),
      observations: held.observations,
      objects: held.objects,
      seq: held.seq,
    });
  }

  /** The newest mark per row and surface, as the view carries them. */
  private currentMarks(held: Held): Mark[] {
    const newest = new Map<string, Mark>();
    for (const mark of held.marks)
      newest.set(`${mark.row}|${mark.surface}`, mark);
    return [...newest.values()];
  }

  /** Every mark a row was given, oldest first: the desk keeps them all. */
  async history(id: string, row: string): Promise<RowHistory> {
    const held = this.held(id);
    if (!held.rows.some((one) => one.key === row))
      throw new DeskError(`No row ${row} in run ${id}`, 404);
    return { marks: clone(held.marks.filter((mark) => mark.row === row)) };
  }

  async replaceSpec(id: string, spec: RunSpec): Promise<RunView> {
    const held = this.held(id);
    if (held.run.state !== "open")
      throw new DeskError(
        `Run ${id} is ${held.run.state}; its selection is frozen`,
        409,
      );
    held.spec = clone(spec);
    held.rows = rowsOf(spec);
    const keep = new Set(held.rows.map((row) => row.key));
    held.marks = held.marks.filter((mark) => keep.has(mark.row));
    held.run = {
      ...held.run,
      name: spec.name,
      cases: spec.cases.length,
      rows: held.rows.length,
      fingerprint: spec.fingerprint,
      source: spec.source,
    };
    held.seq += 1;
    this.emit(id, { type: "spec", seq: held.seq });
    return this.run(id);
  }

  async setState(id: string, state: RunState): Promise<RunSummary> {
    const held = this.held(id);
    const from = held.run.state;
    const allowed =
      (from === "open" && state === "finalized") ||
      (from === "finalized" && (state === "closed" || state === "open"));
    if (!allowed)
      throw new DeskError(`A ${from} run cannot become ${state}`, 409);
    held.run = {
      ...held.run,
      state,
      ...(state === "finalized" ? { finalizedAt: this.now() } : {}),
      ...(state === "closed" ? { closedAt: this.now() } : {}),
    };
    this.emit(id, { type: "run", run: held.run });
    return clone(held.run);
  }

  async mark(id: string, inputs: MarkInput[]): Promise<{ marks: Mark[] }> {
    const held = this.held(id);
    if (held.run.state === "closed")
      throw new DeskError(`Run ${id} is closed; marking has ended`, 409);
    const rows = new Set(inputs.map((input) => input.row));
    if (
      rows.size > 1 &&
      inputs.some((input) => !BULK_MARKS.includes(input.value))
    )
      throw new DeskError(
        "Many rows at once only as blocked, skipped, n/a or to do",
        400,
      );
    const known = new Set(held.rows.map((row) => row.key));
    for (const input of inputs) {
      if (!known.has(input.row))
        throw new DeskError(`No row ${input.row} in run ${id}`, 400);
      if (!SURFACES.includes(input.surface))
        throw new DeskError(`No surface ${input.surface}`, 400);
      if (!MARKS.includes(input.value))
        throw new DeskError(`No mark ${input.value}`, 400);
      if (
        input.triage &&
        !triagesFor(input.surface, input.value).includes(input.triage)
      )
        throw new DeskError(
          `A ${input.value} on ${input.surface} cannot be triaged ${input.triage}`,
          400,
        );
    }
    const answered: Mark[] = [];
    for (const input of inputs) {
      const already = held.marks.find((mark) => mark.id === input.id);
      if (already) {
        answered.push(clone(already));
        continue;
      }
      held.seq += 1;
      const mark: Mark = {
        ...input,
        by: this.email,
        at: this.now(),
        seq: held.seq,
      };
      held.marks.push(mark);
      answered.push(clone(mark));
      this.emit(id, { type: "mark", mark });
    }
    return { marks: answered };
  }

  async observe(id: string, inputs: Omit<Observation, "by" | "at" | "seq">[]) {
    const held = this.held(id);
    if (held.run.state === "closed")
      throw new DeskError(`Run ${id} is closed; marking has ended`, 409);
    const answered: Observation[] = [];
    for (const input of inputs) {
      const walk = held.spec.walks.find((one) => one.id === input.walk);
      if (!walk || input.step < 0 || input.step >= walk.route.length)
        throw new DeskError(`No step ${input.step} on walk ${input.walk}`, 400);
      const already = held.observations.find((one) => one.id === input.id);
      if (already) {
        answered.push(clone(already));
        continue;
      }
      held.seq += 1;
      const observation: Observation = {
        ...input,
        by: this.email,
        at: this.now(),
        seq: held.seq,
      };
      held.observations.push(observation);
      answered.push(clone(observation));
      this.emit(id, { type: "observation", observation });
    }
    return { observations: answered };
  }

  async putObjects(id: string, row: string, objects: RowObjects) {
    const held = this.held(id);
    if (held.run.state === "closed")
      throw new DeskError(`Run ${id} is closed; marking has ended`, 409);
    if (!held.rows.some((one) => one.key === row))
      throw new DeskError(`No row ${row} in run ${id}`, 400);
    const merged = { ...held.objects[row] };
    for (const [key, value] of Object.entries(objects)) {
      if (value === "") delete merged[key];
      else merged[key] = value;
    }
    held.objects[row] = merged;
    held.seq += 1;
    this.emit(id, { type: "objects", row, objects: merged, seq: held.seq });
    return { objects: clone(merged), seq: held.seq };
  }

  async rerun(id: string, name?: string): Promise<RunSummary> {
    const held = this.held(id);
    const current = this.currentMarks(held);
    const failing = held.rows.filter((row) => {
      const marks = Object.fromEntries(
        current
          .filter((mark) => mark.row === row.key)
          .map((mark) => [mark.surface, mark]),
      );
      const inPlay = held.spec.cases.find(
        (one) => one.id === row.case,
      )?.surfaces;
      const { verdict } = rowVerdict(marks, inPlay);
      return verdict === "fail" || verdict === "blocked";
    });
    if (failing.length === 0)
      throw new DeskError(`Run ${id} has no failed or blocked row`, 409);
    const keep = new Map<string, Set<number>>();
    for (const row of failing)
      keep.set(row.case, (keep.get(row.case) ?? new Set()).add(row.index));
    const cases = held.spec.cases
      .filter((one) => keep.has(one.id))
      .map((one) =>
        one.data
          ? {
              ...one,
              data: {
                header: one.data.header,
                rows: one.data.rows.filter((_, at) =>
                  keep.get(one.id)?.has(at + 1),
                ),
              },
            }
          : one,
      );
    return this.openRun({
      ...held.spec,
      name: name ?? `${held.spec.name} · re-run`,
      cases,
      walks: [],
      rerunOf: id,
    });
  }

  async download(id: string, what: "csv" | "record") {
    const held = this.held(id);
    if (what === "record") {
      if (held.run.state === "open")
        throw new DeskError(`Run ${id} is not finalized`, 409);
      return {
        name: `run-${id}.json`,
        blob: new Blob([JSON.stringify(await this.run(id), null, 2)], {
          type: "application/json",
        }),
      };
    }
    const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const lines = [
      [
        "row",
        "case",
        "surface",
        "value",
        "triage",
        "issue",
        "note",
        "by",
        "at",
      ].join(","),
    ];
    for (const mark of this.currentMarks(held)) {
      const row = held.rows.find((one) => one.key === mark.row);
      lines.push(
        [
          mark.row,
          row?.case ?? "",
          mark.surface,
          mark.value,
          mark.triage ?? "",
          mark.issue ?? "",
          mark.note ?? "",
          mark.by,
          mark.at,
        ]
          .map(quote)
          .join(","),
      );
    }
    return {
      name: `run-${id}.csv`,
      blob: new Blob([`${lines.join("\n")}\n`], { type: "text/csv" }),
    };
  }

  async verdicts(): Promise<DeskVerdicts> {
    this.reach();
    return { runs: await this.runs(), cases: {}, excluded: {} };
  }

  live(id: string, handlers: LiveHandlers): () => void {
    const set = this.listeners.get(id) ?? new Set();
    set.add(handlers);
    this.listeners.set(id, set);
    queueMicrotask(() => handlers.status(this.online ? "live" : "offline"));
    return () => set.delete(handlers);
  }
}
