/** Shapes of the static artifacts. Everything comes from the pages and the
 * references on disk — nothing here is restated by hand. */

export type ManualConfig = {
  storybookBase: string;
  /** Nav groups in order; each lists product ids in order. */
  groups: { title: string; products: string[] }[];
  /** Cross-cutting topic groups in order; each lists topic ids in order. */
  platform: { title: string; topics: string[] }[];
  /** Guide slugs, in nav order. */
  guides: string[];
};

/** The products and platform topics, in nav order: `manual.yaml`'s own order
 * first, then any directory under the manual's `products/` or `platform/` it
 * does not name yet. */
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

/** A malformed file, contained instead of failing the build. */
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

/** A `*-tcs.md` suite beside the pages it tests, as written; the app reads
 * its cases. */
export type SuiteEntry = { path: string; source: string };

/** A derived callout signature — git's answer to whose judgment and when. */
export type WarningSignature = { author: string; date: string } | null;

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
  /** The test-case suites under the manual. Absent from a snapshot built
   * before they shipped. */
  suites?: SuiteEntry[];
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

/** `/api/relay` — the relay a page listens to for `main` moving, written at
 * build from `RELAY_URL`. No relay is the honest default: the feature is off
 * and no page opens a socket. */
export type RelayUrl = { url?: string };

/** `/api/head` — the store head this site was built from. A page told `main`
 * moved polls it, and re-reads the snapshot once it answers with `main`. */
export type DeployedHead = { storeHead: string };

/** `/api/upstream` — how the checkout the dev server runs on stands against
 * `main`. Dev only: the hosted site is static files and serves no such
 * endpoint. */
export type CheckoutStanding = {
  /** Commits on `origin/main` this checkout does not have. */
  behind: number;
  /** Commits this checkout has that `origin/main` does not. */
  ahead: number;
  /** Anything uncommitted in the working tree, tracked or not. */
  dirty: boolean;
  /** When `origin` was last read to any effect, absent where it never was —
   * a checkout with no `origin`, or a read that failed, leaves the counts
   * against whatever refs the clone already had. */
  fetchedAt?: string;
  /** The latest read of `origin` failed after one that worked: the counts
   * are as of `fetchedAt`, and the page says so. */
  stale?: true;
};

/** `POST /api/pull` — the fast-forward onto `main`, or the line the reader is
 * shown instead. The endpoint owns the words, and a refusal is `{ error }` as
 * every other refusal the store answers is. */
export type PullOutcome = { pulled: true; head: string } | { error: string };
