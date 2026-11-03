/**
 * What the run desk holds and answers, shared by the desk's own Worker, the
 * run sheet that opens a run on it, and the manual's pages that read it.
 * Types only, so every side imports it without bringing anything along.
 */

/** The four columns a row is marked in. A person marks web and mobile; the
 * automated two are entered by hand, as they are today. */
export const SURFACES = ["web", "mobile", "autoWeb", "autoMobile"] as const;
export type Surface = (typeof SURFACES)[number];
export const PERSON_SURFACES: Surface[] = ["web", "mobile"];
export const SURFACE_LABEL: Record<Surface, string> = {
  web: "Web",
  mobile: "Mobile",
  autoWeb: "Auto web",
  autoMobile: "Auto mobile",
};

/** QA's six words: a row on a surface is one of these. */
export const MARKS = [
  "todo",
  "pass",
  "fail",
  "blocked",
  "skipped",
  "na",
] as const;
export type MarkValue = (typeof MARKS)[number];
export const MARK_LABEL: Record<MarkValue, string> = {
  todo: "to do",
  pass: "pass",
  fail: "fail",
  blocked: "blocked",
  skipped: "skipped",
  na: "n/a",
};

/** Many rows at once only as these; a pass or a fail is one row at a time. */
export const BULK_MARKS: MarkValue[] = ["todo", "blocked", "skipped", "na"];

export const TRIAGES = [
  "bug",
  "spec",
  "case",
  "environment",
  "data",
  "flaky",
  "deferred",
] as const;
export type Triage = (typeof TRIAGES)[number];

/** Which triage a mark may carry: flaky on an automated fail only, deferred
 * on a skip only, the rest on a fail, a blocked or a skip. */
export function triagesFor(surface: Surface, value: MarkValue): Triage[] {
  if (value === "skipped") return ["deferred", "environment", "data", "case"];
  if (value !== "fail" && value !== "blocked") return [];
  const auto = surface === "autoWeb" || surface === "autoMobile";
  const base: Triage[] = ["bug", "spec", "case", "environment", "data"];
  return auto && value === "fail" ? [...base, "flaky"] : base;
}

export type RunState = "open" | "finalized" | "closed";

/** One case as the run selected it: frozen in the run, never edited on the
 * desk, so a later edit to its suite never changes a run. */
export type RunCase = {
  /** The id its heading carries, which the run selects by. */
  id: string;
  /** The stable trace marker, `g10.store-cart-checkout.TC-q5a`, and its
   * revision; absent on a case written before markers. */
  marker?: string;
  rev?: number;
  title: string;
  /** Store-relative path of its suite. */
  suite: string;
  level?: string;
  product?: string;
  domain?: string;
  capability?: string;
  severity?: string;
  priority?: string;
  status?: string;
  /** Raw trace targets, `cart#promo-code/typed` or a scenario id. */
  traces: string[];
  /** The store page and `##` section it is grouped under, where it traces one. */
  page?: string;
  section?: string;
  sectionTitle?: string;
  /** The release phase it was selected for, where the run selected by phase. */
  phase?: string;
  /** What the case says before its parts. */
  lead?: string;
  given: string[];
  steps: string[];
  expect: { step?: number; text: string }[];
  /** Any part that is not a list, under its label. */
  other?: { label: string; text: string }[];
  /** A case run once per row of its test data: the table as written. */
  data?: { header: string[]; rows: string[][] };
  /** The data rows this run walks, from 1, where it walks only some: a
   * re-run of the rows that failed keeps their numbers. Absent, every row. */
  rows?: number[];
  /** The surfaces in play before anyone marks, from its testability and a
   * `[web only]` or `[mobile only]` title: a surface not in play starts n/a. */
  surfaces: Surface[];
  /** The journey or walk text quoted where it traces no page rule. */
  journey?: string;
};

/** A suite's walk: a route over several cases from one starting state. */
export type RunWalk = {
  /** `cart-tcs.md#walk-1`. */
  id: string;
  title: string;
  suite: string;
  start: string[];
  route: { step: string; expect: string; cases: string[] }[];
};

/** What the run sheet sends to open a run once a person confirms its dry
 * run, and what an open run's selection is replaced with. */
export type RunSpec = {
  name: string;
  /** The QA environment the testers walk. */
  env: string;
  /** The phase it was selected for; only such a run leaves cases out of a
   * unit. */
  phase?: string;
  /** The words the selection was asked for in. */
  selection: string;
  /** The store commit the cases were read at. */
  source: string;
  fingerprint: string;
  cases: RunCase[];
  walks: RunWalk[];
  /** A suite's shared test data: placeholder to what the suite says. */
  placeholders: Record<string, string>;
  exclusions: { id: string; reason: string }[];
  /** A re-run names the run whose failed and blocked rows it walks again. */
  rerunOf?: string;
};

/** A row: a case, or one row of its test data. */
export type RunRow = {
  /** `<case id>` or `<case id>#<n>` from 1. */
  key: string;
  case: string;
  /** 0 for a case with no test data, else its data row from 1. */
  index: number;
};

export type Mark = {
  /** Made by the client, so a retried mark is a no-op. */
  id: string;
  row: string;
  surface: Surface;
  value: MarkValue;
  /** Which of the case's expectations broke, by its position from 0. */
  expectation?: number;
  triage?: Triage;
  /** The issue's link, once pasted. */
  issue?: string;
  note?: string;
  /** The e-mail Access names. */
  by: string;
  at: string;
  /** The order the desk took it in. */
  seq: number;
};

/** A route step of a walk, ticked as observed. */
export type Observation = {
  id: string;
  walk: string;
  step: number;
  seen: boolean;
  note?: string;
  by: string;
  at: string;
  seq: number;
};

/** The real objects a row used, placeholder to value. */
export type RowObjects = Record<string, string>;

export type RunSummary = {
  id: string;
  name: string;
  env: string;
  phase?: string;
  state: RunState;
  openedBy: string;
  openedAt: string;
  finalizedAt?: string;
  closedAt?: string;
  source: string;
  fingerprint: string;
  cases: number;
  rows: number;
  rerunOf?: string;
};

/** `GET /api/desk/runs/:id` — the run, its rows and the current state of
 * every row. */
export type RunView = {
  run: RunSummary;
  spec: RunSpec;
  rows: RunRow[];
  /** The current mark per row and surface. */
  marks: Mark[];
  observations: Observation[];
  objects: Record<string, RowObjects>;
  /** The desk's sequence when the view was read; live messages after it
   * apply on top. */
  seq: number;
};

/** One message on a run's live connection. */
export type LiveMessage =
  | { type: "mark"; mark: Mark }
  | { type: "observation"; observation: Observation }
  | { type: "objects"; row: string; objects: RowObjects; seq: number }
  | { type: "run"; run: RunSummary }
  | { type: "spec"; seq: number };

/** `GET /api/desk/verdicts` — what the pages and the board read: for every
 * case, its rows' current marks in the newest run on each environment that
 * holds it. */
export type DeskVerdicts = {
  runs: RunSummary[];
  /** By environment, then by case id. */
  cases: Record<
    string,
    Record<
      string,
      {
        run: string;
        marker?: string;
        rev?: number;
        /** `inPlay` is the case's surfaces, always sent, so `caseVerdict`
         * reads a surface nobody can walk as n/a rather than to do. */
        rows: { key: string; inPlay?: Surface[]; marks: Mark[] }[];
      }
    >
  >;
  /** Cases a finalized run selected by phase left out, with the reason:
   * phase to case id to reason. */
  excluded: Record<string, Record<string, string>>;
};

export type DeskMe = { email: string };

/** A mark as the client sends it. */
export type MarkInput = Omit<Mark, "by" | "at" | "seq">;
export type ObservationInput = Omit<Observation, "by" | "at" | "seq">;

/** The address the manual's Worker answers the desk on. */
export const DESK_BASE = "/api/desk";

/** The header the manual's Worker names the Access identity in, the only one
 * the desk trusts; a client's own is stripped before it reaches the desk. */
export const DESK_EMAIL_HEADER = "x-desk-email";
