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
  /** The anchors this scenario serves, from its `**Serves:**` line: story ids,
   * or `## Feature set` root group names where no story reaches it. This is the
   * only link between a scenario and a story — the two files never name each
   * other, which is how each stopped inheriting the other's blind spots.
   *
   * More than one is allowed: a scenario is a rule, and one rule can sit on
   * several journeys. A case is a walk and still traces one.
   *
   * An anchor may also be qualified — `<product>/<domain>/<capability>#<id>` —
   * where the rule sits on a journey another capability issues. */
  serves?: string[];
  /** The prose after the anchor's dash: what the walk was, for a human. Read
   * so a check can refuse a line that only repeats the anchor it stands on. */
  servesProse?: string;
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
};

/** Review state of one case (`docs/governance/specs-to-test-cases.md`):
 * generation writes `draft`, only a human review writes `actual`. */
export type TestCaseStatus = "draft" | "actual" | "deprecated";

export type TestCase = {
  /** Permanent store id like `grade10-site-loyalty-programme-US1-TC3-1`, or the flat
   * `grade10-site-loyalty-programme-TC-03` an older suite issued. */
  id: string;
  title: string;
  /** Anchors this case walks, as written: the story
   * (`grade10-site-loyalty-programme-US-01`), a `## Feature set` root group
   * where nobody walks the capability, or a scenario id where an older suite
   * named those. A trace reaches the scenarios that serve the same anchor. */
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
  /** The root groups of the feature set — the anchors a scenario may serve
   * when it stands under the map rather than under a journey. */
  featureGroups?: string[];
  requirements: Requirement[];
  journeys?: Journey[];
  /** The journey ids this capability has retired - the `## Retired`
   * tombstones its journeys file keeps. Not journeys: nothing renders them
   * and no anchor of this capability's own resolves to one. They are held
   * because an id is permanent - archived suites still trace it, and a rule
   * on another capability may still name the walk it stood for. */
  retiredJourneys?: string[];
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
 * Derived from the history of one `tasks.md` on the store's main — HEAD for a
 * change only the checkout has — by `openspec-viewer`'s published `lib/store`,
 * at build time. Absent wherever there is no honest number: an unclaimed
 * group, a finished one, a history that cannot account for the current owner,
 * a store that is not a git checkout, or a checkout with no viewer submodule.
 * An age invented from missing history would aim the nudge at the wrong
 * person.
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
 * Where a change stands against the store's shared branch, where the plan is
 * read: a change missing there cannot be claimed, and a checkout copy that
 * differs from it is not the settled brief. Carried only when one of those
 * holds, read from the refs the clone already has (the build never fetches).
 */
export type MainState = {
  state: "unmerged" | "diverged";
  /** The remote-tracking ref compared against, e.g. `origin/main`. */
  ref: string;
  /** Diverged only: files of this change that differ from the ref. `tasks.md`
   * counts only where the ref has none — every claim and checkmark moves it
   * on main. */
  files?: number;
};

/** Where a change stands, derived and never stored: `proposed` has no
 * deltas yet, `specified` has deltas and no task list, `in-progress` has
 * open tasks, `complete` has finished them all and awaits the archive. */
export type ChangeLane = "proposed" | "specified" | "in-progress" | "complete";

/** A hand a change passes through, as `hands:` keys them. */
export type Role = "pm" | "design" | "tech" | "qa" | "dev" | "release";

/** How far a change has got, derived from the files on the store's main and
 * never stored: the eight stages `shared/planning/change-stages` names, of
 * which `ChangeLane`'s four are a projection. */
export type Stage =
  | "proposed"
  | "designed"
  | "specified"
  | "planned"
  | "building"
  | "on-staging"
  | "released"
  | "archived";

/** One thing about a change nobody has settled, and the hand it is addressed
 * to. A decisions row carries its number; a line the page still holds carries
 * the page and the section it sits under. */
export type OpenQuestion = {
  /** `Q<n>` from the `## Decisions` row, where a row asked it. */
  id?: string;
  /** The page a ❓ line sits on, where the page asked it. */
  page?: string;
  /** Slug of the `## ` section the line sits under. */
  section?: string;
  /** The schema artifact it counts against: `decisions` for a row, `proposal`
   * for a line under a section the proposal links. */
  artifact: string;
  /** The role it is addressed to, which is where it is routed when the change
   * names no hand for it. Any role a row names, the six or not. */
  role: string;
  /** The handle `hands:` names for that role, or the role itself where the
   * change names none. */
  hand: string;
  /** What was asked, as written. */
  text: string;
};

/** One artifact whose upstream moved after it was drawn or last read again,
 * and what moved. Derived per read, never stored. */
export type BehindArtifact = {
  /** The schema artifact id. */
  artifact: string;
  /** What changed before it: a linked page section as `<page>#<slug>`, or an
   * upstream artifact id. */
  changed: string[];
};

/**
 * What one artifact is drawn from, as the store read it off `main`.
 *
 * The reading is the store's, because hashing is `node:crypto`'s and the page
 * texts are the reader's; the verdict is not stored — `behindOf` is a pure
 * comparison over this, so no surface and no check has to be reordered to see
 * a freshness field.
 */
export type UpstreamRead = {
  /** The content id of everything before the artifact, in reading order. */
  id: string;
  /** Each thing before it, in that order: a linked page section as
   * `<page>#<slug>`, or an upstream artifact id. */
  items: string[];
  /** The items a commit dates later than the artifact's own newest commit —
   * what says it is behind where no `reviewed:` line does. Absent where no
   * commit dates the artifact, which is what a depth-1 checkout gives, and an
   * item no commit dates is left out rather than guessed at. */
  newer?: string[];
};

/** One person the store knows, from `docs/prds/team.yaml`. */
export type TeamMember = {
  /** The address `git config user.email` gives. */
  email?: string;
  /** The Slack member id a message is addressed to. A handle with none is
   * sent no message. */
  slack?: string;
  /** The roles this handle may take. */
  roles: string[];
};

/** Who the store knows and where a role is posted to — the one map every
 * surface that names a person and every message that addresses one reads.
 * `scripts/openspec/lib/team.mjs` is its only reader. */
export type TeamMap = {
  handles: Record<string, TeamMember>;
  /** One channel id per role, for a stage whose hand is unnamed. */
  channels: Record<string, string>;
};

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
  /** Why this change carries no spec delta at all, from `.openspec.yaml`
   * `skip_specs_why:`. `skip_specs: true` is the one switch that turns the
   * whole cross-check off — no journeys, no blind suite, no scenarios, no
   * reconciliation — and it is author-declared, so it owes a reason beside it.
   * An empty string is a switch thrown with no `skip_specs_why`: declared,
   * with no reason given. */
  skipSpecs?: string;
  /** Why this change marks no capability page, from `.openspec.yaml`
   * `page_waived:` — the line that stands in for the 🚧 a change with deltas
   * owes a page. */
  pageWaived?: string;
  /** Why this change records no decisions, from `.openspec.yaml`
   * `decisions_waived:` — the line that stands in for `decisions.md`, either
   * where there was genuinely nothing to settle or on a change opened before
   * the file existed, whose scope is in its proposal. */
  decisionsWaived?: string;
  /** Why this change writes no `tech-design.md`, from `.openspec.yaml`
   * `design_waived:`. */
  designWaived?: string;
  /** Why this change draws no `ui-design.md`, from `.openspec.yaml`
   * `ui_waived:` — the line that stands in for the UI design on a change
   * nothing a reader sees moves on. */
  uiWaived?: string;
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
  /** From `tasks.md` on the store's main for an in-flight change there, where
   * every claim and checkmark is recorded; from the checkout otherwise. */
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
  /** The schema artifact ids this change has written. */
  written: string[];
  /** Who takes this change at each stage, from `.openspec.yaml` `hands:` —
   * one handle per role, as the record wrote it. A role outside `Role`
   * survives the read so the `hands` rule can refuse it, and a role the
   * change does not name is unnamed rather than an error. */
  hands?: Record<string, string>;
  /** Whose word landed each artifact, from `.openspec.yaml` `landed_by:` — a
   * schema artifact id against one handle, written by the landing. */
  landedBy?: Record<string, string>;
  /** What each artifact was last read again against, from `.openspec.yaml`
   * `reviewed:` — a schema artifact id against the content id of what was
   * before it. Written by the round; read here. */
  reviewed?: Record<string, string>;
  /** The change's Slack thread, from `.openspec.yaml` `thread:`, as
   * `<channel>/<ts>`. Written by the round; every message links it. */
  thread?: string;
  /** The release this change went out in, from `.openspec.yaml`
   * `released_in:`. */
  releasedIn?: string;
  /** ISO timestamp of the last commit that ticked a task, claimed a group or
   * added an artifact of this change — what says it has stopped moving, which
   * `lastMoved` cannot: one repository-wide commit moves every change at
   * once. Absent where no history dates it, which is not the same as 0. */
  lastLanded?: string;
  /** What nobody has settled: the change's own open decisions rows. The
   * questions a linked page still carries are added by `questionsOf`, which
   * has the parsed pages. */
  questions?: OpenQuestion[];
  /** How many rows of `decisions.md`'s `## Raised` table have landed nowhere
   * — the blind reading's questions, which the requirements are not settled
   * without. Absent where every row landed or the file carries no table. */
  raisedOpen?: number;
  /** What each written artifact was drawn from, keyed by schema artifact id —
   * read where the pages and the history are, compared by `behindOf`. Absent
   * for a change whose record could not be read and for an archived one. */
  upstream?: Record<string, UpstreamRead>;
  /** How far the change has got, computed where the schema is. */
  stage?: Stage;
  /** What the change says it is waiting for, from `.openspec.yaml`
   * `awaiting:` — an artifact id against the line its author wrote. */
  awaiting?: { artifact: string; why: string }[];
  /** Set when a file was malformed; content fields may be incomplete. */
  error?: ItemError;
};

/** One artifact a workflow schema declares. */
export type SchemaArtifact = {
  id: string;
  generates: string;
  /** The teammate that writes it. A schema naming none leaves the artifact off
   * every worklist rather than guessing whose turn it is. */
  teammate?: string;
  requires: string[];
  /** The artifacts this one's text is drawn from, in reading order — the
   * graph, which the artifact list's order is not: the blind suite is written
   * without sight of the requirements, and the tech design is drawn beside
   * the UI design rather than from it. Empty where the schema says nothing. */
  upstream: string[];
  /** The readers a round on this artifact may dispatch, in the order the
   * schema records them. Empty where it records none: `spec.md` and
   * `feature-tcs.md` are challenged by the two blind readings instead. */
  perspectives: Perspective[];
  /** Whether a change owes this artifact by default. An artifact that is not
   * required is owed only when the change says so in `awaiting:`: what makes
   * it owed is a condition no worklist can see. */
  required: boolean;
};

/** One reader a round may dispatch: its perspective's name, what in a draft
 * summons it, and the definition under `.claude/agents/` the round runs. The
 * size of a round is the draft's own diff read against every `when`, so a
 * perspective no draft can summon is not an entry. */
export type Perspective = {
  name: string;
  /** The triggers that summon it — `always`, or any of `surface`, `schema`,
   * `export`, `system`, `migration`, `flag`, `money`, `deploy`, `copy`. */
  when: string[];
  /** The reader's definition, as a store-relative path. */
  agent: string;
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
  /** Each workflow schema the changes in flight name, against the artifacts
   * it declares, in schema order. A schema this store does not define is
   * absent, so a change on one is left off every worklist. */
  schemas: Record<string, SchemaArtifact[]>;
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
