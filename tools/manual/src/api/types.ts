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
  subject: string;
};

/** A malformed store file, contained instead of failing the build. */
export type ItemError = {
  file: string;
  line?: number;
  message: string;
};

export type PageEntry = {
  /** Content-relative, e.g. `docs/prds/products/grade10-store/loyalty.md`. */
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
  /** Permanent store id like `grade10-site-loyalty-programme-SC-04`, when the spec carries one. */
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
  /** Permanent store id like `grade10-site-loyalty-programme-US-01`. */
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
  /** Permanent store id like `grade10-site-loyalty-programme-US1-TC3-1`, or the flat
   * `grade10-site-loyalty-programme-TC-03` an older suite issued. */
  id: string;
  title: string;
  /** Ids this case traces to, as written: the journey it walks
   * (`grade10-site-loyalty-programme-US-01`), or a scenario id where an older suite named those. A
   * journey trace reaches the scenarios its `Accepted by` lists. */
  traces: string[];
  status: TestCaseStatus;
};

/** The suite file's own status — derived from its cases, never chosen:
 * `pending-review` while every case is a draft, `in-review` from the first
 * verdict, `approved` once no draft is left. */
export type TestSuiteStatus = "pending-review" | "in-review" | "approved";

export type SpecEntry = {
  /** `product/capability`, or a bare topic id. */
  id: string;
  title: string;
  purpose: string;
  featureSet?: string;
  requirements: Requirement[];
  journeys?: Journey[];
  /** The journeys file says `**Walked by:** nobody`: no end user reaches
   * this capability on its own, so it has no stories by decision rather
   * than by omission. */
  unwalked?: boolean;
  testCases?: TestCase[];
  testCasesStatus?: TestSuiteStatus;
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
   * feature-tcs.md never blanks the spec's requirements or takes down the
   * pages that embed them. */
  testCasesError?: ItemError;
  /** The journeys beside it were malformed — its own channel for the same
   * reason: a broken user-journeys.md is the PM's file, not the contract. */
  journeysError?: ItemError;
};

/** One checkbox line of a task group. Carried for in-flight changes only —
 * the archive shares this type and its board payload must stay light. */
export type TaskLine = {
  text: string;
  done: boolean;
  owner?: string;
};

/**
 * How long a claimed, unfinished group has sat without progress — the later of
 * when the current owner's unbroken hold began and the newest commit that
 * raised its checked count.
 *
 * Derived from the git history of one `tasks.md` by `openspec-viewer`'s
 * published `lib/store`, at build time. Absent wherever there is no honest
 * number: an unclaimed group, a finished one, a history that cannot account for
 * the current owner, a store that is not a git checkout, or a checkout with no
 * viewer submodule. An age invented from missing history would aim the nudge at
 * the wrong person.
 */
export type IdleClaim = {
  /** ISO date the clock started from. */
  since: string;
  /** Whole days from `since` to the build. */
  days: number;
  /** Which of the two dates won — a claim nobody has moved, or the last
   * checkmark against it. */
  source: "claim" | "progress";
};

export type TaskGroup = {
  /** The integer its `## <n>. <title>` heading carries. The convention makes
   * this the group's address: an owner is recorded against it, and a task id
   * is written under it. */
  num: string;
  title: string;
  repo: string;
  /** Handle from the heading's `(owner: @handle)` tag — who claimed the
   * group, which the card-level owner list cannot say. */
  owner?: string;
  done: number;
  total: number;
  tasks?: TaskLine[];
  /** In-flight only, and only where git can date it. */
  idle?: IdleClaim;
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

/** A `feature-tcs.md` sitting beside one of a change's delta specs — the suite
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

/** One `## ` heading of a manual page, as a proposal links it. */
export type PageSectionRef = { page: string; slug: string };

export type ChangeEntry = {
  id: string;
  /** Store-relative change directory. An archived one carries the
   * `YYYY-MM-DD-` prefix the id drops, so this is the only way back to its
   * files. */
  dir: string;
  /** The planning schema `.openspec.yaml` declares, and `""` where the change
   * carries no manifest at all. */
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
   * a change somebody else specified and wrote its delivery plan. */
  promotedBy?: string;
  created: string;
  /** Optional `target:` date from `.openspec.yaml`. */
  target?: string;
  /** Change ids from `.openspec.yaml` `depends_on:`; resolution against
   * the in-flight and archived sets happens in derivation. */
  dependsOn?: string[];
  /** Why this change marks no capability page, from `.openspec.yaml`
   * `page_waived:` — the line that stands in for the 🚧 a change with deltas
   * owes a page. */
  pageWaived?: string;
  /** Why this change writes no `tech-design.md`, from `.openspec.yaml`
   * `design_waived:`. */
  designWaived?: string;
  /** The deploy that carried the change, from `.openspec.yaml` `deployed_at:`
   * and `deployed_env:` — the sha the application repository verified, and the
   * environment it ran in. */
  deployedAt?: string;
  deployedEnv?: string;
  /** Who archived the change without deploy evidence, and why, from
   * `.openspec.yaml` `deploy_waived:`. */
  deployWaived?: string;
  /** Who archived the change with tasks still unchecked, and why, from
   * `.openspec.yaml` `tasks_waived:`. */
  tasksWaived?: string;
  title: string;
  why: string;
  /** Ids the proposal's `## References` names, read back so the
   * capability a proposal is about can show it before any delta exists. */
  cites?: string[];
  /** The page sections the proposal's `## References` link, as a store path
   * and the heading's slug — where on the manual this change lands, section
   * by section. */
  sections?: PageSectionRef[];
  /** The proposal's `## Follow-on changes` bullets, verbatim. What the author
   * said this change makes possible next — intent recorded on the day the
   * proposal was written, never a commitment, and only ever readable as the
   * change that carries it. */
  followOns?: string[];
  taskGroups: TaskGroup[];
  /** ISO date of the last commit touching any file of the change — a
   * change with no tasks.md still moves. */
  lastMoved?: string;
  /** Archived only: the day the change shipped, from the `YYYY-MM-DD-` prefix
   * of its archive directory. `openspec archive` writes that prefix once and a
   * rebase cannot move it, which the commit dates under it cannot promise. */
  shippedOn?: string;
  deltas: Delta[];
  /** In-flight only: the suites sitting beside this change's deltas. */
  suites?: ChangeSuite[];
  /** Carried only when the change is not settled on the store's main. */
  mainState?: MainState;
  /** Set when a file was malformed; content fields may be incomplete. */
  error?: ItemError;
};

/** How a change's artifact renders: a prose document, the directory of
 * spec deltas, the stories or the suites beside them, or the task
 * checklist — from what the schema says the artifact generates, never from
 * its name. The three spec-directory kinds are all per-capability, so each
 * reads out of the deltas rather than out of a file of its own. */
export type ChangeArtifactKind =
  | "doc"
  | "specs"
  | "journeys"
  | "cases"
  | "tasks";

/** One artifact a change's schema asks for, or a file the change carries that
 * the schema never named. Present or not, in the schema's own order. */
export type ChangeArtifact = {
  /** The schema's artifact id — `proposal`, `specs`, `user-journeys`,
   * `test-cases`, `ui-design`, `tech-design`, `tasks` — or an undeclared
   * file's name without its extension. */
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
  /** The `user-journeys.md` beside the delta was malformed. */
  journeysError?: ItemError;
  sections: DeltaSection[];
  /** The `feature-tcs.md` beside the delta, when QA has written one. */
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
  /** The page's path when the warning is about one page. */
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

/** One document under `docs/references/`, as the nav and the landing list
 * it. The text rides its own artifact. */
export type ReferenceEntry = {
  /** The file name without `.md`: `grade10-loyalty-program`. */
  slug: string;
  /** Store-relative: `docs/references/<slug>.md`. */
  path: string;
  /** The document's `#` heading, or the slug read out when it has none. */
  title: string;
  lastCommit?: CommitInfo;
};

/** `/api/reference/<slug>` — the document as written. */
export type ReferenceDocument = ReferenceEntry & { text: string };

/** `/api/snapshot` — boots the app. */
export type Snapshot = {
  generatedAt: string;
  storeHead: string;
  config: ManualConfig;
  taxonomy: Taxonomy;
  /** Where the pages sit, relative to their repository: `docs/prds` in the
   * store's own. Every page path opens with it. */
  manualDir: string;
  pages: PageEntry[];
  specs: SpecEntry[];
  /** In-flight only; archived changes live in `/api/archive`. */
  changes: ChangeEntry[];
  /** Every file under the manual's `assets/`, as `assets/<name>` paths. */
  assets: string[];
  /** The store's `docs/references/`, in path order, without their text. The
   * landing's own prose is `referencesReadme`. */
  references: ReferenceEntry[];
  referencesReadme?: string;
  /** The newest commits of the store, newest first. Empty where the store is
   * not a git checkout. */
  history: HistoryEvent[];
  warnings: CheckWarning[];
  designSync?: DesignSyncReport;
};

/** `/api/archive` — fetched only by the In Flight and timeline views. */
export type Archive = {
  generatedAt: string;
  storeHead: string;
  changes: ChangeEntry[];
};
