import {
  BULK_MARKS,
  type DeskVerdicts,
  type LiveMessage,
  MARK_LABEL,
  MARKS,
  type Mark,
  type MarkInput,
  type MarkValue,
  type Observation,
  type ObservationInput,
  type RowHistory,
  type RowObjects,
  type RunCase,
  type RunRecord,
  type RunRow,
  type RunSpec,
  type RunState,
  type RunSummary,
  type RunView,
  SURFACES,
  type Surface,
  triagesFor,
} from "../../manual/src/api/desk.ts";
import { currentMarks, rowVerdict } from "../../manual/src/api/verdicts.ts";

/**
 * Every run the desk holds, over any SQLite that answers `exec`: the Durable
 * Object's own storage in the Worker, `node:sqlite` in the tests. Every write
 * is appended with who and when; what a run shows now is its newest entry.
 */

export type SqlValue = string | number | null;
export type SqlRow = Record<string, SqlValue>;
export interface Sql {
  exec(query: string, ...params: SqlValue[]): SqlRow[];
  transaction<T>(write: () => T): T;
}

export class DeskError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type Live = { run: string; message: LiveMessage };
export type Written<T> = { value: T; live: Live[] };

const SCHEMA = [
  "create table if not exists counters (name text primary key, value integer not null)",
  `create table if not exists runs (id text primary key, n integer not null unique,
    state text not null, opened_by text not null, opened_at text not null,
    finalized_at text, closed_at text)`,
  `create table if not exists specs (seq integer primary key, run text not null,
    by text not null, at text not null)`,
  `create table if not exists spec_parts (seq integer not null,
    part integer not null, text text not null, primary key (seq, part))`,
  `create table if not exists states (seq integer primary key, run text not null,
    state text not null, by text not null, at text not null)`,
  `create table if not exists marks (seq integer primary key, id text not null,
    run text not null, row text not null, surface text not null,
    value text not null, expectation integer, triage text, issue text,
    note text, by text not null, at text not null, walked text not null,
    unique (run, id))`,
  "create index if not exists marks_current on marks (run, row, surface, seq)",
  `create table if not exists observations (seq integer primary key,
    id text not null, run text not null, walk text not null,
    step integer not null, seen integer not null, note text,
    by text not null, at text not null, unique (run, id))`,
  `create table if not exists objects (seq integer primary key, run text not null,
    row text not null, key text not null, value text not null,
    by text not null, at text not null)`,
];

const NEXT: Record<RunState, RunState[]> = {
  open: ["finalized"],
  finalized: ["closed", "open"],
  closed: [],
};

type Held = { seq: number; spec: RunSpec; rows: RunRow[] };

/** A spec is written in parts: SQLite in a Durable Object holds no value past
 * 2 MB, and a part of this many UTF-16 units stays under it in UTF-8. */
export const SPEC_PART = 512 * 1024;
/** Runs whose parsed spec stays in memory, the newest read first. */
const HELD_RUNS = 8;

export class DeskStore {
  #sql: Sql;
  #now: () => string;
  #specs = new Map<string, Held>();

  constructor(sql: Sql, now: () => string = () => new Date().toISOString()) {
    this.#sql = sql;
    this.#now = now;
    for (const statement of SCHEMA) sql.exec(statement);
  }

  runs(): RunSummary[] {
    return this.#sql
      .exec("select id from runs order by n desc")
      .map((row) => this.summary(String(row.id)));
  }

  summary(id: string): RunSummary {
    const [run] = this.#sql.exec("select * from runs where id = ?", id);
    if (!run) throw new DeskError(404, `no run ${id} on the desk`);
    const { spec, rows } = this.#held(id);
    return {
      id,
      name: spec.name,
      env: spec.env,
      ...(spec.phase ? { phase: spec.phase } : {}),
      state: run.state as RunState,
      openedBy: String(run.opened_by),
      openedAt: String(run.opened_at),
      ...(run.finalized_at ? { finalizedAt: String(run.finalized_at) } : {}),
      ...(run.closed_at ? { closedAt: String(run.closed_at) } : {}),
      source: spec.source,
      fingerprint: spec.fingerprint,
      cases: spec.cases.length,
      rows: rows.length,
      ...(spec.rerunOf ? { rerunOf: spec.rerunOf } : {}),
    };
  }

  open(input: unknown, by: string): RunSummary {
    const spec = checkSpec(input);
    if (spec.rerunOf !== undefined) this.summary(spec.rerunOf);
    const id = this.#sql.transaction(() => {
      const n = this.#next("run");
      const id = String(n);
      const at = this.#now();
      this.#sql.exec(
        "insert into runs (id, n, state, opened_by, opened_at) values (?, ?, 'open', ?, ?)",
        id,
        n,
        by,
        at,
      );
      this.#writeSpec(id, spec, by, at);
      return id;
    });
    return this.summary(id);
  }

  view(id: string): RunView {
    const run = this.summary(id);
    const { spec, rows } = this.#held(id);
    const keys = new Set(rows.map((row) => row.key));
    const walks = new Set(spec.walks.map((walk) => walk.id));
    const objects: Record<string, RowObjects> = {};
    for (const row of rows) {
      const held = this.#objects(id, row.key);
      if (Object.keys(held).length > 0) objects[row.key] = held;
    }
    return {
      run,
      spec,
      rows,
      marks: this.#currentMarks(id).filter((mark) => keys.has(mark.row)),
      observations: this.#sql
        .exec(
          `select * from observations o where run = ? and seq = (select max(seq)
            from observations x where x.run = o.run and x.walk = o.walk and x.step = o.step)
            order by seq`,
          id,
        )
        .map(toObservation)
        .filter((one) => walks.has(one.walk)),
      objects,
      seq: this.#seq(),
    };
  }

  replaceSpec(id: string, input: unknown, by: string): Written<RunView> {
    const run = this.summary(id);
    if (run.state !== "open")
      throw new DeskError(
        409,
        `run ${id} is ${run.state}: its selection changes only while open`,
      );
    const spec = checkSpec(input);
    const seq = this.#sql.transaction(() =>
      this.#writeSpec(id, spec, by, this.#now()),
    );
    return {
      value: this.view(id),
      live: [{ run: id, message: { type: "spec", seq } }],
    };
  }

  setState(id: string, input: unknown, by: string): Written<RunSummary> {
    const run = this.summary(id);
    const to = (input as { state?: unknown } | null)?.state;
    if (to !== "open" && to !== "finalized" && to !== "closed")
      throw new DeskError(400, "state must be open, finalized or closed");
    if (to === run.state) return { value: run, live: [] };
    if (!NEXT[run.state].includes(to))
      throw new DeskError(
        409,
        `run ${id} is ${run.state}: it cannot become ${to}`,
      );
    this.#sql.transaction(() => {
      const at = this.#now();
      const column = {
        open: "finalized_at",
        finalized: "finalized_at",
        closed: "closed_at",
      }[to];
      this.#sql.exec(
        `update runs set state = ?, ${column} = ? where id = ?`,
        to,
        to === "open" ? null : at,
        id,
      );
      this.#sql.exec(
        "insert into states (seq, run, state, by, at) values (?, ?, ?, ?, ?)",
        this.#next("seq"),
        id,
        to,
        by,
        at,
      );
    });
    const value = this.summary(id);
    return { value, live: [{ run: id, message: { type: "run", run: value } }] };
  }

  mark(id: string, input: unknown, by: string): Written<Mark[]> {
    const run = this.#writable(id);
    const { spec, rows } = this.#held(id);
    const inputs = listOf(input, "marks");
    const checked = inputs.map((one) => checkMark(one, spec, rows, id));
    const touched = new Set(checked.map((one) => one.row));
    const single = checked.find((one) => !BULK_MARKS.includes(one.value));
    if (touched.size > 1 && single)
      throw new DeskError(
        400,
        `a ${single.value} is marked one row at a time; ${touched.size} rows were sent`,
      );
    const live: Live[] = [];
    const value = this.#sql.transaction(() => {
      const at = this.#now();
      return checked.map((one) => {
        const [held] = this.#sql.exec(
          "select * from marks where run = ? and id = ?",
          run.id,
          one.id,
        );
        if (held) return toMark(held);
        const mark: Mark = { ...one, by, at, seq: this.#next("seq") };
        this.#sql.exec(
          `insert into marks (seq, id, run, row, surface, value, expectation, triage, issue, note, by, at, walked)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          mark.seq,
          mark.id,
          run.id,
          mark.row,
          mark.surface,
          mark.value,
          mark.expectation ?? null,
          mark.triage ?? null,
          mark.issue ?? null,
          mark.note ?? null,
          by,
          at,
          walkedOf(spec, mark.row),
        );
        live.push({ run: run.id, message: { type: "mark", mark } });
        return mark;
      });
    });
    return { value, live };
  }

  observe(id: string, input: unknown, by: string): Written<Observation[]> {
    const run = this.#writable(id);
    const { spec } = this.#held(id);
    const checked = listOf(input, "observations").map((one) =>
      checkObservation(one, spec),
    );
    const live: Live[] = [];
    const value = this.#sql.transaction(() => {
      const at = this.#now();
      return checked.map((one) => {
        const [held] = this.#sql.exec(
          "select * from observations where run = ? and id = ?",
          run.id,
          one.id,
        );
        if (held) return toObservation(held);
        const observation: Observation = {
          ...one,
          by,
          at,
          seq: this.#next("seq"),
        };
        this.#sql.exec(
          `insert into observations (seq, id, run, walk, step, seen, note, by, at)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          observation.seq,
          observation.id,
          run.id,
          observation.walk,
          observation.step,
          observation.seen ? 1 : 0,
          observation.note ?? null,
          by,
          at,
        );
        live.push({
          run: run.id,
          message: { type: "observation", observation },
        });
        return observation;
      });
    });
    return { value, live };
  }

  setObjects(
    id: string,
    row: string,
    input: unknown,
    by: string,
  ): Written<{ objects: RowObjects; seq: number }> {
    this.#writable(id);
    if (!this.#held(id).rows.some((one) => one.key === row))
      throw new DeskError(400, `row ${row} is not in run ${id}`);
    if (
      !isRecord(input) ||
      Object.values(input).some((v) => typeof v !== "string")
    )
      throw new DeskError(400, "objects are placeholder to text");
    const held = this.#objects(id, row);
    const changed = Object.entries(input as RowObjects).filter(
      ([key, value]) => key !== "" && (held[key] ?? "") !== value,
    );
    if (changed.length === 0)
      return { value: { objects: held, seq: this.#seq() }, live: [] };
    this.#sql.transaction(() => {
      const at = this.#now();
      for (const [key, value] of changed)
        this.#sql.exec(
          "insert into objects (seq, run, row, key, value, by, at) values (?, ?, ?, ?, ?, ?, ?)",
          this.#next("seq"),
          id,
          row,
          key,
          value,
          by,
          at,
        );
    });
    const value = { objects: this.#objects(id, row), seq: this.#seq() };
    return {
      value,
      live: [{ run: id, message: { type: "objects", row, ...value } }],
    };
  }

  rerun(id: string, input: unknown, by: string): RunSummary {
    this.summary(id);
    const { spec, rows } = this.#held(id);
    const marks = this.#currentMarks(id);
    const again = new Map<string, number[]>();
    for (const row of rows) {
      const one = spec.cases.find((c) => c.id === row.case) as RunCase;
      const current = currentMarks(
        marks.filter((mark) => mark.row === row.key),
      );
      const { verdict } = rowVerdict(current, one.surfaces);
      if (verdict !== "fail" && verdict !== "blocked") continue;
      again.set(row.case, [...(again.get(row.case) ?? []), row.index]);
    }
    if (again.size === 0)
      throw new DeskError(409, `run ${id} has no failed or blocked rows`);
    const name = (input as { name?: unknown } | null)?.name;
    if (name !== undefined && (typeof name !== "string" || name.trim() === ""))
      throw new DeskError(400, "a re-run's name is text");
    const cases = spec.cases
      .filter((one) => again.has(one.id))
      .map((one) => (one.data ? { ...one, rows: again.get(one.id) } : one));
    const kept = new Set(cases.map((one) => one.id));
    const walks = spec.walks
      .map((walk) => ({
        ...walk,
        route: walk.route.map((step) => ({
          ...step,
          cases: step.cases.filter((c) => kept.has(c)),
        })),
      }))
      .filter((walk) => walk.route.some((step) => step.cases.length > 0));
    return this.open(
      {
        ...spec,
        name: name ?? `${spec.name} re-run`,
        selection: `the failed and blocked rows of run ${id}`,
        cases,
        walks,
        exclusions: [],
        rerunOf: id,
      } satisfies RunSpec,
      by,
    );
  }

  verdicts(): DeskVerdicts {
    const runs = this.runs();
    const marksOf = new Map<string, Mark[]>();
    for (const { run, ...mark } of this.#currentMarks()) {
      const key = `${run}\n${mark.row}`;
      marksOf.set(key, [...(marksOf.get(key) ?? []), mark]);
    }
    const walkedIn = (run: string, rows: RunRow[], id: string) =>
      rows.some(
        (row) =>
          row.case === id &&
          (marksOf.get(`${run}\n${row.key}`) ?? []).some(
            (mark) => mark.value !== "todo",
          ),
      );
    const cases: DeskVerdicts["cases"] = {};
    for (const walked of [true, false])
      for (const run of runs) {
        const { spec, rows } = this.#held(run.id);
        cases[run.env] ??= {};
        const byEnv = cases[run.env];
        for (const one of spec.cases) {
          if (byEnv[one.id]) continue;
          if (walked && !walkedIn(run.id, rows, one.id)) continue;
          byEnv[one.id] = {
            run: run.id,
            ...(one.marker ? { marker: one.marker } : {}),
            ...(one.rev !== undefined ? { rev: one.rev } : {}),
            rows: rows
              .filter((row) => row.case === one.id)
              .map((row) => ({
                key: row.key,
                inPlay: one.surfaces,
                marks: marksOf.get(`${run.id}\n${row.key}`) ?? [],
              })),
          };
        }
      }
    const excluded: DeskVerdicts["excluded"] = {};
    for (const run of [...runs].reverse()) {
      if (run.state === "open" || !run.phase) continue;
      const { spec } = this.#held(run.id);
      excluded[run.phase] ??= {};
      const phase = excluded[run.phase];
      for (const one of spec.exclusions) phase[one.id] = one.reason;
      for (const one of spec.cases) delete phase[one.id];
    }
    return { runs, cases, excluded };
  }

  csv(id: string): string {
    this.summary(id);
    const { spec, rows } = this.#held(id);
    const marks = this.#currentMarks(id);
    const lines: string[][] = [
      [
        "case",
        "title",
        "data row",
        "surface",
        "value",
        "triage",
        "issue",
        "expectation",
        "note",
        "objects",
        "by",
        "at",
      ],
    ];
    for (const row of rows) {
      const one = spec.cases.find((c) => c.id === row.case) as RunCase;
      const current = currentMarks(
        marks.filter((mark) => mark.row === row.key),
      );
      const objects = Object.entries(this.#objects(id, row.key))
        .map(([key, value]) => `${key}=${value}`)
        .join("; ");
      for (const surface of SURFACES) {
        const mark = current[surface];
        if (!mark && !one.surfaces.includes(surface)) continue;
        lines.push([
          one.id,
          one.title,
          row.index === 0 ? "" : String(row.index),
          surface,
          MARK_LABEL[mark?.value ?? "todo"],
          mark?.triage ?? "",
          mark?.issue ?? "",
          mark?.expectation !== undefined
            ? (one.expect[mark.expectation]?.text ?? "")
            : "",
          mark?.note ?? "",
          objects,
          mark?.by ?? "",
          mark?.at ?? "",
        ]);
      }
    }
    return lines.map((line) => `${line.map(cell).join(",")}\r\n`).join("");
  }

  /** A finalized run as its print commit records it: the run and the
   * selection it froze. */
  record(id: string): RunRecord {
    const run = this.summary(id);
    if (run.state === "open")
      throw new DeskError(
        409,
        `run ${id} is open: only a finalized run is recorded`,
      );
    return { run, spec: this.#held(id).spec };
  }

  #writable(id: string): RunSummary {
    const run = this.summary(id);
    if (run.state === "closed")
      throw new DeskError(409, `run ${id} is closed: marking has ended`);
    return run;
  }

  #held(id: string): Held {
    const [row] = this.#sql.exec(
      "select seq from specs where run = ? order by seq desc limit 1",
      id,
    );
    if (!row) throw new DeskError(404, `no run ${id} on the desk`);
    const cached = this.#specs.get(id);
    this.#specs.delete(id);
    if (cached?.seq === row.seq) {
      this.#specs.set(id, cached);
      return cached;
    }
    const text = this.#sql
      .exec("select text from spec_parts where seq = ? order by part", row.seq)
      .map((part) => String(part.text))
      .join("");
    const spec = JSON.parse(text) as RunSpec;
    const held = { seq: Number(row.seq), spec, rows: rowsOf(spec) };
    this.#specs.set(id, held);
    for (const stale of this.#specs.keys()) {
      if (this.#specs.size <= HELD_RUNS) break;
      this.#specs.delete(stale);
    }
    return held;
  }

  #writeSpec(id: string, spec: RunSpec, by: string, at: string): number {
    const seq = this.#next("seq");
    this.#sql.exec(
      "insert into specs (seq, run, by, at) values (?, ?, ?, ?)",
      seq,
      id,
      by,
      at,
    );
    const text = JSON.stringify(spec);
    for (let part = 0; part * SPEC_PART < text.length; part++)
      this.#sql.exec(
        "insert into spec_parts (seq, part, text) values (?, ?, ?)",
        seq,
        part,
        text.slice(part * SPEC_PART, (part + 1) * SPEC_PART),
      );
    return seq;
  }

  /** Every mark a row was given, oldest first: who changed it and when. */
  history(id: string, row: string): RowHistory {
    this.summary(id);
    if (!this.#held(id).rows.some((one) => one.key === row))
      throw new DeskError(404, `run ${id} has no row ${row}`);
    return {
      marks: this.#sql
        .exec(
          "select * from marks where run = ? and row = ? order by seq",
          id,
          row,
        )
        .map(toMark),
    };
  }

  /** The newest mark per row and surface among those made on the row as the
   * run's selection now reads it: a mark on an older revision of the case, or
   * on data the row no longer holds, no longer speaks for it. */
  #currentMarks(run?: string): (Mark & { run: string })[] {
    const walked = new Map<string, Map<string, string>>();
    const now = (id: string) => {
      let held = walked.get(id);
      if (!held) {
        const { spec, rows } = this.#held(id);
        held = new Map(rows.map((row) => [row.key, walkedOf(spec, row.key)]));
        walked.set(id, held);
      }
      return held;
    };
    const newest = new Map<string, Mark & { run: string }>();
    for (const row of this.#sql.exec(
      "select * from marks where (? is null or run = ?) order by seq",
      run ?? null,
      run ?? null,
    )) {
      const id = String(row.run);
      if (now(id).get(String(row.row)) !== row.walked) continue;
      newest.set(`${id}\n${row.row}\n${row.surface}`, {
        ...toMark(row),
        run: id,
      });
    }
    return [...newest.values()].sort((a, b) => a.seq - b.seq);
  }

  #objects(run: string, row: string): RowObjects {
    const objects: RowObjects = {};
    for (const one of this.#sql.exec(
      "select key, value from objects where run = ? and row = ? order by seq",
      run,
      row,
    )) {
      if (one.value === "") delete objects[String(one.key)];
      else objects[String(one.key)] = String(one.value);
    }
    return objects;
  }

  #next(counter: "seq" | "run"): number {
    const [row] = this.#sql.exec(
      `insert into counters (name, value) values (?, 1)
        on conflict (name) do update set value = value + 1 returning value`,
      counter,
    );
    return Number(row.value);
  }

  #seq(): number {
    const [row] = this.#sql.exec(
      "select value from counters where name = 'seq'",
    );
    return row ? Number(row.value) : 0;
  }
}

/** What a mark on a row was made against: the case's marker and revision,
 * and the data the row held. */
function walkedOf(spec: RunSpec, key: string): string {
  const [id, index] = key.split("#");
  const one = spec.cases.find((c) => c.id === id);
  const data = index ? one?.data?.rows[Number(index) - 1] : undefined;
  return JSON.stringify([one?.marker ?? id, one?.rev ?? null, data ?? null]);
}

export function rowsOf(spec: RunSpec): RunRow[] {
  return spec.cases.flatMap((one) =>
    one.data && one.data.rows.length > 0
      ? (one.rows ?? one.data.rows.map((_, at) => at + 1)).map((index) => ({
          key: `${one.id}#${index}`,
          case: one.id,
          index,
        }))
      : [{ key: one.id, case: one.id, index: 0 }],
  );
}

/** A spreadsheet reads a cell opening with = + - @ as a formula; a quote in
 * front keeps typed text text. */
function cell(value: string): string {
  const text = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function toMark(row: SqlRow): Mark {
  return {
    id: String(row.id),
    row: String(row.row),
    surface: row.surface as Surface,
    value: row.value as MarkValue,
    ...(row.expectation !== null
      ? { expectation: Number(row.expectation) }
      : {}),
    ...(row.triage !== null ? { triage: row.triage as Mark["triage"] } : {}),
    ...(row.issue !== null ? { issue: String(row.issue) } : {}),
    ...(row.note !== null ? { note: String(row.note) } : {}),
    by: String(row.by),
    at: String(row.at),
    seq: Number(row.seq),
  };
}

function toObservation(row: SqlRow): Observation {
  return {
    id: String(row.id),
    walk: String(row.walk),
    step: Number(row.step),
    seen: row.seen === 1,
    ...(row.note !== null ? { note: String(row.note) } : {}),
    by: String(row.by),
    at: String(row.at),
    seq: Number(row.seq),
  };
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const optionalText = (value: unknown) =>
  value === undefined || typeof value === "string";

const texts = (value: unknown) =>
  Array.isArray(value) && value.every((one) => typeof one === "string");

function listOf(input: unknown, key: string): unknown[] {
  const list = isRecord(input) ? input[key] : undefined;
  if (!Array.isArray(list) || list.length === 0)
    throw new DeskError(400, `send {${key}: [...]} with at least one`);
  return list;
}

function checkMark(
  input: unknown,
  spec: RunSpec,
  rows: RunRow[],
  run: string,
): MarkInput {
  if (!isRecord(input)) throw new DeskError(400, "a mark is an object");
  const { id, row, surface, value, expectation, triage, issue, note } = input;
  if (!isText(id))
    throw new DeskError(400, "a mark carries the id its client made");
  const held = rows.find((one) => one.key === row);
  if (!held)
    throw new DeskError(400, `row ${String(row)} is not in run ${run}`);
  if (!SURFACES.includes(surface as Surface))
    throw new DeskError(
      400,
      `surface ${String(surface)} is not one of ${SURFACES.join(", ")}`,
    );
  if (!MARKS.includes(value as MarkValue))
    throw new DeskError(
      400,
      `mark ${String(value)} is not one of ${MARKS.join(", ")}`,
    );
  const allowed = triagesFor(surface as Surface, value as MarkValue);
  if (triage !== undefined && !allowed.includes(triage as never))
    throw new DeskError(
      400,
      `a ${String(value)} on ${String(surface)} takes no ${String(triage)} triage`,
    );
  if (expectation !== undefined) {
    const one = spec.cases.find((c) => c.id === held.case) as RunCase;
    if (
      value !== "fail" ||
      !Number.isInteger(expectation) ||
      (expectation as number) < 0 ||
      (expectation as number) >= one.expect.length
    )
      throw new DeskError(
        400,
        `expectation names one of the ${one.expect.length} lines of a failed case, from 0`,
      );
  }
  if (!optionalText(issue) || !optionalText(note))
    throw new DeskError(400, "a mark's issue and note are text");
  if (typeof issue === "string" && issue !== "" && !/^https?:\/\//i.test(issue))
    throw new DeskError(400, "a mark's issue is a link, http or https");
  return {
    id,
    row: held.key,
    surface: surface as Surface,
    value: value as MarkValue,
    ...(expectation !== undefined
      ? { expectation: expectation as number }
      : {}),
    ...(triage !== undefined ? { triage: triage as Mark["triage"] } : {}),
    ...(issue ? { issue: issue as string } : {}),
    ...(note ? { note: note as string } : {}),
  };
}

function checkObservation(input: unknown, spec: RunSpec): ObservationInput {
  if (!isRecord(input)) throw new DeskError(400, "an observation is an object");
  const { id, walk, step, seen, note } = input;
  if (!isText(id))
    throw new DeskError(400, "an observation carries the id its client made");
  const held = spec.walks.find((one) => one.id === walk);
  if (!held)
    throw new DeskError(400, `walk ${String(walk)} is not in this run`);
  if (
    !Number.isInteger(step) ||
    (step as number) < 0 ||
    (step as number) >= held.route.length
  )
    throw new DeskError(
      400,
      `step names one of walk ${held.id}'s ${held.route.length} steps, from 0`,
    );
  if (typeof seen !== "boolean")
    throw new DeskError(400, "seen is true or false");
  if (!optionalText(note)) throw new DeskError(400, "a note is text");
  return {
    id,
    walk: held.id,
    step: step as number,
    seen,
    ...(note ? { note: note as string } : {}),
  };
}

/** What the desk itself relies on in a spec; the rest is carried as sent. */
export function checkSpec(input: unknown): RunSpec {
  const refuse = (why: string): never => {
    throw new DeskError(400, `run spec: ${why}`);
  };
  if (!isRecord(input)) return refuse("send a RunSpec object");
  for (const key of ["name", "env", "source", "fingerprint"])
    if (!isText(input[key])) refuse(`${key} is required text`);
  if (typeof input.selection !== "string") refuse("selection is text");
  if (!optionalText(input.phase) || !optionalText(input.rerunOf))
    refuse("phase and rerunOf are text");
  const { cases, walks, placeholders, exclusions } = input;
  if (!Array.isArray(cases) || cases.length === 0)
    refuse("cases names at least one case");
  const ids = new Set<string>();
  for (const one of cases as unknown[]) {
    if (!isRecord(one) || !isText(one.id))
      return refuse("every case has an id");
    const id = one.id;
    if (ids.has(id)) refuse(`case ${id} is selected twice`);
    ids.add(id);
    if (typeof one.title !== "string" || typeof one.suite !== "string")
      refuse(`case ${id} needs its title and suite`);
    if (!texts(one.given) || !texts(one.steps) || !texts(one.traces))
      refuse(`case ${id}: given, steps and traces are lists of text`);
    if (
      !Array.isArray(one.expect) ||
      !one.expect.every(
        (line) => isRecord(line) && typeof line.text === "string",
      )
    )
      refuse(`case ${id}: expect is a list of {text}`);
    if (
      !Array.isArray(one.surfaces) ||
      !one.surfaces.every((s) => SURFACES.includes(s))
    )
      refuse(`case ${id}: surfaces are among ${SURFACES.join(", ")}`);
    const data = one.data;
    if (data !== undefined) {
      if (
        !isRecord(data) ||
        !texts(data.header) ||
        !Array.isArray(data.rows) ||
        !data.rows.every(texts)
      )
        refuse(`case ${id}: data is {header, rows} of text`);
    }
    if (one.rows !== undefined) {
      const count =
        isRecord(data) && Array.isArray(data.rows) ? data.rows.length : 0;
      const rows = one.rows;
      if (
        !Array.isArray(rows) ||
        rows.length === 0 ||
        new Set(rows).size !== rows.length ||
        !rows.every((n) => Number.isInteger(n) && n >= 1 && n <= count)
      )
        refuse(
          `case ${id}: rows name its data rows from 1 to ${count}, once each`,
        );
    }
  }
  if (!Array.isArray(walks)) return refuse("walks is a list");
  const walkIds = new Set<string>();
  for (const walk of walks as unknown[]) {
    if (!isRecord(walk) || !isText(walk.id))
      return refuse("every walk has an id");
    if (walkIds.has(walk.id)) refuse(`walk ${walk.id} is listed twice`);
    walkIds.add(walk.id);
    if (
      !texts(walk.start) ||
      !Array.isArray(walk.route) ||
      !walk.route.every(
        (step) =>
          isRecord(step) &&
          typeof step.step === "string" &&
          typeof step.expect === "string" &&
          texts(step.cases),
      )
    )
      refuse(
        `walk ${walk.id}: start is text and route is a list of {step, expect, cases}`,
      );
  }
  if (
    !isRecord(placeholders) ||
    !Object.values(placeholders).every((v) => typeof v === "string")
  )
    refuse("placeholders map a placeholder to text");
  if (
    !Array.isArray(exclusions) ||
    !exclusions.every(
      (one) => isRecord(one) && isText(one.id) && isText(one.reason),
    )
  )
    refuse("exclusions are a list of {id, reason}");
  return input as RunSpec;
}
