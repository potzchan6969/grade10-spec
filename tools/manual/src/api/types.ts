/** Shapes of the three static artifacts. Everything comes from the store on
 * disk — nothing here is restated by hand. */

export type ManualConfig = {
  storybookBase: string;
  /** Nav groups in order; each lists product ids in order. */
  groups: { title: string; products: string[] }[];
  /** Cross-cutting topic groups in order; each lists topic ids in order. */
  platform: { title: string; topics: string[] }[];
  /** Guide slugs, in nav order. */
  guides: string[];
};

/** Derived from disk shape: a dir under openspec/specs holding spec.md
 * directly is a topic; a dir of capability dirs is a product. manual.yaml
 * may add page-only products. */
export type Taxonomy = {
  products: string[];
  topics: string[];
};

export type CommitInfo = {
  sha: string;
  /** ISO date of the last commit touching the file. */
  date: string;
};

/** A malformed store file, contained instead of failing the build. */
export type ItemError = {
  file: string;
  line?: number;
  message: string;
};

export type PageEntry = {
  /** Store-relative, e.g. `manual/products/grade10-store/loyalty.md`. */
  path: string;
  /** Raw page text; the client parses it. */
  source: string;
  lastCommit?: CommitInfo;
  /** One entry per unsigned `warning` callout, in document order: who last
   * changed it and when, derived from git at build. Null where git holds no
   * committed line yet; absent when the page has nothing to sign. */
  warningSignatures?: WarningSignature[];
};

/** A derived callout signature — git's answer to whose judgment and when. */
export type WarningSignature = { author: string; date: string } | null;

export type Scenario = {
  /** Permanent store id like `loyalty-SC-04`, when the spec carries one. */
  id?: string;
  name: string;
  text: string;
};

export type Requirement = {
  name: string;
  text: string;
  scenarios: Scenario[];
};

export type Journey = {
  /** Permanent store id like `loyalty-US-01`. */
  id: string;
  title: string;
  text: string;
  /** Scenario ids this story is accepted by. */
  acceptedBy: string[];
};

/** Review state of one case (`docs/governance/specs-to-test-cases.md`):
 * generation writes `draft`, only a human review writes `actual`. */
export type TestCaseStatus = "draft" | "actual" | "deprecated";

export type TestCase = {
  /** Permanent store id like `loyalty-TC-03`. */
  id: string;
  title: string;
  /** Scenario ids this case traces to. */
  traces: string[];
  status: TestCaseStatus;
  /** Handle from the case's `**Reviewed by:**` line — who stood behind the
   * verdict, and when. A verdict without one is unsigned, and `check:manual`
   * says so. */
  reviewedBy?: string;
  reviewedOn?: string;
};

/** The suite file's own status — a summary of its cases, never an
 * independent judgment. */
export type TestSuiteStatus = "pending-review" | "approved";

/** A scenario the suite file cites with a quoted title (`**Covers:**`
 * lines); the drift warn compares the quote against the spec's current
 * heading — the only signal that a reviewed wording moved. */
export type SuiteCitation = {
  id: string;
  title: string;
};

export type SpecEntry = {
  /** `product/capability`, or a bare topic id. */
  id: string;
  title: string;
  purpose: string;
  featureSet?: string;
  requirements: Requirement[];
  journeys?: Journey[];
  testCases?: TestCase[];
  testCasesStatus?: TestSuiteStatus;
  testCaseCitations?: SuiteCitation[];
  /** Scenario ids the suite deliberately leaves uncovered
   * (`**Out of suite:**`) — subtracted from coverage, so the untraced
   * count that remains is always actionable. */
  outOfSuite?: string[];
  /** Highest permanent id issued per kind, counting durable text, every
   * in-flight delta, and the archive — the number the next author must
   * clear, which the durable file's own ceiling understates. */
  issuedThrough?: { sc?: number; us?: number; tc?: number };
  lastCommit?: CommitInfo;
  /** The spec file was malformed; content fields may be incomplete. */
  error?: ItemError;
  /** The suite beside it was malformed — its own channel, so a broken
   * test-cases.md never blanks the spec's requirements or takes down the
   * pages that embed them. */
  testCasesError?: ItemError;
};

/** One checkbox line of a task group. Carried for in-flight changes only —
 * the archive shares this type and its board payload must stay light. */
export type TaskLine = {
  text: string;
  done: boolean;
  owner?: string;
};

export type TaskGroup = {
  title: string;
  repo: string;
  /** Handle from the heading's `(owner: @handle)` tag — who claimed the
   * group, which the card-level owner list cannot say. */
  owner?: string;
  done: number;
  total: number;
  tasks?: TaskLine[];
};

export type DeltaKind = "added" | "modified" | "removed" | "renamed";

/** One requirement a delta touches. `name` is the durable heading the row
 * matches on — for a rename, the FROM name, since that is the row that
 * exists until the change archives. Group headings in a delta are not
 * requirements and never appear here. */
export type DeltaRequirement = {
  name: string;
  kind: DeltaKind;
  /** For a rename, the heading the requirement moves to. */
  to?: string;
  /** The delta's full block — heading, prose, scenarios. In-flight only,
   * so ADDED work is readable and MODIFIED can render as a diff against
   * the durable block; the archive stays light. */
  text?: string;
};

export type Delta = {
  /** The spec id the delta touches. */
  spec: string;
  /** Delta headings, e.g. `ADDED`, `MODIFIED`. */
  kinds: string[];
  requirements: DeltaRequirement[];
};

export type ChangeStatus = "in-flight" | "archived";

/** A `test-cases.md` sitting beside one of a change's delta specs — the suite
 * QA reviews while the change is still in flight, which no durable capability
 * page can show yet. */
export type ChangeSuite = {
  /** The spec id the suite belongs to. */
  spec: string;
  status?: TestSuiteStatus;
  cases: { draft: number; actual: number; deprecated: number; total: number };
  error?: ItemError;
};

/**
 * Where a change stands against the store's shared branch. The plan is read at
 * `origin/main`, so a change that is not settled there cannot be claimed or
 * archived — carried only when that is the case, read from the refs the clone
 * already has (the build never fetches).
 */
export type MainState = {
  state: "unmerged" | "diverged";
  /** The remote-tracking ref compared against, e.g. `origin/main`. */
  ref: string;
  /** Diverged only: files of this change ahead of the ref, `tasks.md`
   * excluded — claim and done churn it by design. */
  files?: number;
};

/** Where a change stands, derived and never stored: `proposed` has no
 * deltas yet, `specified` has deltas and no task list, `in-progress` has
 * open tasks, `complete` has finished them all and awaits the archive. */
export type ChangeLane = "proposed" | "specified" | "in-progress" | "complete";

export type ChangeEntry = {
  id: string;
  schema: string;
  status: ChangeStatus;
  /** From `.openspec.yaml` `owner:`/`owners:`, merged with the
   * `(owner: @handle)` task tags — so an unclaimed change can still be
   * somebody's. */
  owners: string[];
  /** Handle from the proposal's `**Author:**` line — who proposed it, which
   * is not who owns it. Named only when no owner claimed a task. */
  author?: string;
  /** Handle from `.openspec.yaml` `promoted_by:` — the engineer who promoted
   * a pm-planning change and wrote its delivery plan. */
  promotedBy?: string;
  created: string;
  /** Optional `target:` date from `.openspec.yaml`. */
  target?: string;
  /** Change ids from `.openspec.yaml` `depends_on:`; resolution against
   * the in-flight and archived sets happens in derivation. */
  dependsOn?: string[];
  title: string;
  why: string;
  /** Ids the proposal's `## References` names, read back so the
   * capability a proposal is about can show it before any delta exists. */
  cites?: string[];
  taskGroups: TaskGroup[];
  /** ISO date of the last commit touching any file of the change — a
   * pm-planning change with no tasks.md still moves. */
  lastMoved?: string;
  deltas: Delta[];
  /** In-flight only: the suites sitting beside this change's deltas. */
  suites?: ChangeSuite[];
  /** Carried only when the change is not settled on the store's main. */
  mainState?: MainState;
  /** Set when a file was malformed; content fields may be incomplete. */
  error?: ItemError;
};

/** How a change's artifact renders: a prose document, the directory of
 * spec deltas, or the task checklist — from what the schema says the
 * artifact generates, never from its name. */
export type ChangeArtifactKind = "doc" | "specs" | "tasks";

/** One artifact a change's schema asks for, or a file the change carries that
 * the schema never named. Present or not, in the schema's own order. */
export type ChangeArtifact = {
  /** The schema's artifact id — `proposal`, `specs`, `design`, `ui`,
   * `tasks` — or an undeclared file's name without its extension. */
  name: string;
  kind: ChangeArtifactKind;
  /** Store-relative path of the file, for a file artifact. */
  path?: string;
  present: boolean;
  /** Prose artifacts only, when present: the file as written. Specs and
   * tasks are read structurally and ride the document elsewhere. */
  text?: string;
  lastCommit?: CommitInfo;
};

/** One delta section of a change's spec file, read as the requirements it
 * will become. A RENAMED section carries FROM/TO pairs instead of rows. */
export type DeltaSection = {
  kind: DeltaKind;
  requirements: Requirement[];
  renames?: { from: string; to: string }[];
};

/** One `specs/<spec>/spec.md` of a change, whole: the raw text for a full
 * reading, the delta parsed as the contract it proposes, and the suite QA
 * wrote beside it. A malformed delta keeps its text and carries `error`. */
export type ChangeDeltaDocument = {
  spec: string;
  /** Store-relative path of the delta file. */
  path: string;
  text: string;
  /** The file's `# ` title, when it opens with one. */
  title?: string;
  purpose?: string;
  featureSet?: string;
  journeys?: Journey[];
  sections: DeltaSection[];
  /** The `test-cases.md` beside the delta, when QA has written one. */
  suite?: {
    status: TestSuiteStatus;
    cases: TestCase[];
    outOfSuite?: string[];
  };
  suiteError?: ItemError;
  lastCommit?: CommitInfo;
  error?: ItemError;
};

/** `/api/change/<id>` — one in-flight change's files, fetched only by the
 * change page. The snapshot's `ChangeEntry` stays the board's light row; this
 * is the reading. */
export type ChangeDocument = {
  id: string;
  /** Store-relative change directory. */
  dir: string;
  schema: string;
  /** False when the schema is not one this store defines, so nothing can say
   * which artifacts are still to write. */
  schemaKnown: boolean;
  artifacts: ChangeArtifact[];
  deltas: ChangeDeltaDocument[];
};

/** A `check:manual` warning the build ships so the app can show it —
 * failures never reach a deploy, so warnings are all a snapshot carries. */
export type CheckWarning = {
  rule: string;
  message: string;
  /** `manual/…` path when the warning is about one page. */
  page?: string;
};

/** One component set's verdict from the nightly design-sync check. */
export type DesignSyncClass = "ok" | "warn" | "skipped" | "fail";

export type DesignSyncReport = {
  generatedAt: string;
  /** Figma file key the run read, when it read one over REST. */
  file?: string;
  /** Keyed by component-set name, as the checker names them. */
  sets: Record<string, DesignSyncClass>;
  /** Every node a link can name — components, pages, and the frames sitting on
   * one — against the component set it belongs to. Keyed as a Figma URL writes
   * an id (`4735-6493`). Absent when the run's source could not say, which is
   * not the same as "no node exists". */
  nodes?: Record<string, string>;
  /** Why a set got its verdict, in the checker's own words. */
  messages?: Record<string, string[]>;
};

/** What one commit touched, named the way the manual knows it. A path no
 * reader claims stays a path — the commit happened either way. */
export type HistoryRef =
  | { kind: "page"; path: string }
  | { kind: "spec"; id: string }
  | { kind: "change"; id: string }
  | { kind: "archived"; id: string }
  | { kind: "file"; path: string };

/** One commit of the store, as the recent feed reads it. */
export type HistoryEvent = {
  sha: string;
  /** ISO commit date. */
  date: string;
  subject: string;
  refs: HistoryRef[];
};

/** `/api/snapshot` — boots the app. */
export type Snapshot = {
  generatedAt: string;
  storeHead: string;
  config: ManualConfig;
  taxonomy: Taxonomy;
  pages: PageEntry[];
  specs: SpecEntry[];
  /** In-flight only; archived changes live in `/api/archive`. */
  changes: ChangeEntry[];
  /** Every file under `manual/assets/`, as `assets/<name>` paths. */
  assets: string[];
  /** The newest commits of the store, newest first. Empty where the store is
   * not a git checkout. */
  history: HistoryEvent[];
  warnings: CheckWarning[];
  designSync?: DesignSyncReport;
};

/** `/api/archive` — fetched only by planning and timeline views. */
export type Archive = {
  generatedAt: string;
  storeHead: string;
  changes: ChangeEntry[];
};
