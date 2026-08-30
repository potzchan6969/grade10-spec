/** Shapes of the three static artifacts. Everything comes from the store on
 * disk — nothing here is restated by hand. */

export type ManualConfig = {
  storybookBase: string;
  /** Nav groups in order; each lists product ids in order. */
  groups: { title: string; products: string[] }[];
  /** Cross-cutting topic ids, in nav order. */
  platform: string[];
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
};

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

export type TestCase = {
  /** Permanent store id like `loyalty-TC-03`. */
  id: string;
  title: string;
  /** Scenario ids this case traces to. */
  traces: string[];
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
  lastCommit?: CommitInfo;
  /** Set when the file was malformed; content fields may be incomplete. */
  error?: ItemError;
};

export type TaskGroup = {
  title: string;
  repo: string;
  done: number;
  total: number;
};

export type DeltaKind = "added" | "modified" | "removed" | "renamed";

/** One requirement a delta touches. `name` is the durable heading the row
 * matches on — for a rename, the FROM name, since that is the row that
 * exists until the change archives. Group headings in a delta are not
 * requirements and never appear here. */
export type DeltaRequirement = {
  name: string;
  kind: DeltaKind;
};

export type Delta = {
  /** The spec id the delta touches. */
  spec: string;
  /** Delta headings, e.g. `ADDED`, `MODIFIED`. */
  kinds: string[];
  requirements: DeltaRequirement[];
};

export type ChangeStatus = "in-flight" | "archived";

export type ChangeEntry = {
  id: string;
  schema: string;
  status: ChangeStatus;
  owners: string[];
  /** Handle from the proposal's `**Author:**` line — who proposed it, which
   * is not who owns it. Named only when no owner claimed a task. */
  author?: string;
  created: string;
  title: string;
  why: string;
  taskGroups: TaskGroup[];
  /** ISO date of the last commit touching the change's tasks.md. */
  lastMoved?: string;
  deltas: Delta[];
  /** Set when a file was malformed; content fields may be incomplete. */
  error?: ItemError;
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
};

/** `/api/archive` — fetched only by planning and timeline views. */
export type Archive = {
  generatedAt: string;
  storeHead: string;
  changes: ChangeEntry[];
};
