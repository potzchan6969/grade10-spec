// Explicit extensions: the OpenSpec scripts load this under plain node.
import type {
  CommitInfo,
  ItemError,
  PageEntry,
} from "../../manual/src/api/types.ts";

export type { CommitInfo, ItemError, PageEntry };

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

/** Whether an automated test already covers a case
 * (`docs/governance/specs-to-test-cases.md`, Automation status): `manual`
 * means no automated test runs it yet. A case stating no Automation status at
 * all is refused rather than read as `manual` — `AUTOMATION_STATUSES` in
 * `./read-specs.mts` holds that refusal, because a default here would
 * let a generated draft wear a flip nobody made. */
export type AutomationStatus = "manual" | "automated";

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
  automationStatus: AutomationStatus;
};

/** The suite file's persistent review state. Incomplete progress is pending;
 * a lower approved share reopens it, equal progress keeps a reopen, recovery
 * returns it to pending, and no active cases retires it. Active review work is
 * an open `tcs-review/*` branch or pull request, not a file value. */
export type TestSuiteStatus =
  | "pending-review"
  | "reopened"
  | "approved"
  | "retired";

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
  /** The journeys file says `**Walked by:** makers only`: a tool only the
   * product's makers use, which owes no test cases. */
  makersOnly?: boolean;
  testCases?: TestCase[];
  testCasesStatus?: TestSuiteStatus;
  /** Scenario ids QA does not test (`**Out of suite (<category>):**`) —
   * subtracted from coverage, so the untraced count that remains is always
   * actionable. */
  outOfSuite?: string[];
  /** Out-of-suite labels with no category or an unknown one, as written. */
  outOfSuiteMislabelled?: string[];
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
  /** The suite's own file, from the store's root. */
  path: string;
  status?: TestSuiteStatus;
  cases: {
    draft: number;
    actual: number;
    deprecated: number;
    total: number;
    automated: number;
  };
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

export type EnvironmentAvailability = {
  environment: string;
  state: "newly" | "still" | "no-longer" | "partial" | "unknown" | "stale";
  observedAt?: string;
  fetchedAt?: string;
  resolvedRef?: string;
  components: {
    name: string;
    status: string;
    url?: string;
    resolvedRef?: string;
  }[];
  summary?: string;
  manualUrl?: string;
  qaUrl?: string;
};

export type EnvironmentReceiptSummary = {
  environment: string;
  resolvedRef: string;
  observedAt: string;
  fetchedAt?: string;
  deploymentUrl?: string;
  components: {
    name: string;
    status: string;
    url?: string;
    resolvedRef?: string;
  }[];
};

/** Where a change stands, derived and never stored: `proposed` has no
 * deltas yet, `specified` has deltas and no task list, `in-progress` has
 * open tasks, `complete` has finished them all and awaits the archive. */
export type ChangeLane = "proposed" | "specified" | "in-progress" | "complete";

/**
 * The five roles, in the order a change passes through them. Declared here,
 * where `Role` is drawn from it; `scripts/openspec/lib/team.mjs` re-exports it
 * for the checks and the scripts, which read this module under plain node.
 */
export const ROLES = ["pm", "design", "qa", "dev", "release"] as const;

/** A hand a change passes through. */
export type Role = (typeof ROLES)[number];

/** How far a change has got, derived from the files on the store's main and
 * never stored: the eight stages `shared/planning/change-stages` names, of
 * which `ChangeLane`'s four are a projection. */
export type Stage =
  | "proposed"
  | "designed"
  | "specified"
  | "planned"
  | "accepted"
  | "building"
  | "implementation-complete"
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
   * names no hand for it. Any role a row names, the five or not. */
  role: string;
  /** The handle `hands:` names for that role, or the role itself where the
   * change names none. */
  hand: string;
  /** What was asked, as written: the `Asked` cell of a row, and the line the
   * page still carries with its ❓ dropped. */
  text: string;
  /** What the row's `Decided` cell says after `❓ <role> - ` — the
   * recommendation its hand is answering, where a row carries one. */
  recommended?: string;
};

/** One person the store knows, and who the store knows — the one map every
 * surface that names a person and every message that addresses one reads,
 * from `docs/prds/team.yaml`. The shape is declared beside the parser that
 * reads the file, and named here so a surface imports it with the rest of
 * this module; `team-map.test.ts` holds the reader to it. */
export type {
  TeamMap,
  TeamMember,
} from "../../../scripts/openspec/lib/team-parse.mjs";

/** The team map, projected for the browser: a handle against the roles it
 * may take, with no e-mail, Slack member or channel in it — those address a
 * message, which is the notify script's own job, never the manual's. Assign's
 * handle picker offers every handle in `handles`, the chosen role's own
 * first, and My turn reads it to say a handle is unknown; neither needs more
 * of the map than this. */
export type SnapshotTeam = {
  handles: Record<string, Role[]>;
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
  /** A structurally valid acceptance.json for this change's current plan. */
  accepted?: boolean;
  acceptanceFingerprint?: string;
  /** An implementation.json whose fingerprint matches acceptance.json. */
  implementationComplete?: boolean;
  /** Deployment evidence projected from GitHub Deployments, never stored here. */
  availability?: EnvironmentAvailability[];
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
  /** Why each capability's durable Purpose no longer holds, from
   * `.openspec.yaml` `purpose_rewritten:` — a capability path against the
   * line that lets the change's delta replace that Purpose at acceptance. */
  purposeRewritten?: Record<string, string>;
  /** The change's Slack thread, from `.openspec.yaml` `thread:`, as
   * `<channel>/<ts>`. Written by the round; every message links it. */
  thread?: string;
  /** ISO timestamp of the last commit that ticked a task, claimed a group or
   * added an artifact of this change — what says it has stopped moving, which
   * `lastMoved` cannot: one repository-wide commit moves every change at
   * once. Absent where no history dates it, which is not the same as 0. */
  lastLanded?: string;
  /** What nobody has settled: the change's own open decisions rows, plus the
   * questions a linked page still carries — merged on here by `markQuestions`
   * when the snapshot is read, where the pages are at hand. */
  questions?: OpenQuestion[];
  /** How far the change has got, computed where the schema is — on every
   * entry, so no surface carries a second derivation for one that has none. */
  stage: Stage;
  /** The artifact the ladder stopped at: what the change owes to reach the
   * next stage. Absent where the next rung is proven by something no hand
   * writes — a ticked box, a deploy, a cut, the fold. */
  heldBy?: string;
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
  /** The role that answers for it — the hand a wait, an overlay and a landing
   * on this artifact are addressed to. Beside `teammate` rather than derived
   * from it: `teammate` says who writes a file, `hand` who is told about it.
   * Absent where the schema names no hand. */
  hand?: Role;
  requires: string[];
  /** The artifacts this one's text is drawn from, in reading order — the
   * graph, which the artifact list's order is not: the blind suite is written
   * without sight of the requirements, and the tech design is drawn beside
   * the UI design rather than from it. Empty where the schema says nothing. */
  upstream: string[];
  /** Whether a change owes this artifact by default. An artifact that is not
   * required is owed only when the change says so in `awaiting:`: what makes
   * it owed is a condition no worklist can see. */
  required: boolean;
};

/** What in a draft summons a reader. `always` is every round; the others
 * answer to what the draft itself changed. Read by `scripts/openspec/lib/perspectives.mjs`,
 * which classifies a diff against this same list, and by `read-schema.mts`,
 * which refuses a `when` outside it the way `handOf` refuses a role outside
 * `ROLES`. */
export const TRIGGERS: readonly string[] = [
  "always",
  "surface",
  "schema",
  "export",
  "system",
  "migration",
  "flag",
  "money",
  "deploy",
  "copy",
  "code",
];

/** One reader a bug round may dispatch: its perspective's name, what in a
 * diagnosis or a diff summons it, and the definition under `.claude/agents/`
 * the round runs. A perspective nothing can summon is not an entry. */
export type Perspective = {
  name: string;
  /** The triggers that summon it, each one of `TRIGGERS`. */
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

/** What one commit of a change was, as its thread would tell it. A commit
 * nothing else names keeps its subject: it happened either way. */
/** What every event of a thread carries: the commit it is. */
type ThreadCommit = {
  sha: string;
  /** ISO commit date. */
  date: string;
  /** The commit subject, as written — the line a kind nothing else names
   * shows. */
  subject: string;
};

/**
 * One event of a change's own history on `main` — the file-derived mirror of
 * what its Slack thread shows. Read per commit of the change's directory,
 * never stored.
 *
 * Discriminated on `kind`, so what a row can read is what its kind carries: a
 * landing always names its target, a hand always names hands, and no surface
 * has to write a fallback for a state the store cannot produce.
 */
export type ThreadEvent =
  /** The commit that brought `proposal.md`. */
  | (ThreadCommit & { kind: "opened" })
  /** `chore(openspec): land <target> of <id> on @<handle>` — the artifact or
   * the task group it named, and the handle whose word landed it where the
   * subject names one. A task group's landing names none: the tick is its
   * proof. */
  | (ThreadCommit & { kind: "landed"; target: string; handle?: string })
  /** `chore(openspec): <target> of <id> read again, nothing changed`. */
  | (ThreadCommit & { kind: "read-again"; target: string })
  /** A commit whose record wrote a line under `hands:`, role against
   * handle. */
  | (ThreadCommit & {
      kind: "hand";
      hands: { role: string; handle: string }[];
    })
  /** A commit whose `tasks.md` patch ticked boxes, by task id. */
  | (ThreadCommit & { kind: "tick"; ticked: string[] })
  /** Anything else that touched the change: its subject is the line. */
  | (ThreadCommit & { kind: "commit" });

/** The kinds a thread event comes in — the discriminant itself, for a reader
 * that names one. */
export type ThreadEventKind = ThreadEvent["kind"];

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
  /** The change's own commits, oldest first. Empty where no history dates
   * them — a store that is not a checkout, and the bundled fixture, which is
   * read with none. */
  history: ThreadEvent[];
  /** When each held `Q<n>` was asked, by its id: the commit that added its
   * `decisions.md` row, which is the only thing that dates a row the record
   * carries no date for. Absent where no history dates them. */
  askedAt?: Record<string, string>;
};
