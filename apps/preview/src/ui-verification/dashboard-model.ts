import type {
  CaptureOutcome,
  ImageArtifact,
  ImageRegion,
  ProfileId,
  VerificationManifest,
} from "@grade10/ui-verification/model";
import {
  captureLocale,
  currentRuns,
  isStoryCatalogue,
} from "@grade10/ui-verification/model";
import {
  pairKey,
  settledWithoutPixels,
} from "@grade10/ui-verification/pixel-diff";
import type {
  Approval,
  ReferenceRecord,
  VerificationIdentity,
} from "./archive-client";
import { identityKey } from "./archive-client";
import {
  type ReferenceFlag,
  type ReferenceStatus,
  referenceStatus,
} from "./capture-stamp";
import { type DiffTone, diffTone, HIGH_RATIO } from "./FlowPanel";

export const PROFILE_ORDER: readonly {
  id: ProfileId;
  label: string;
  size: string;
}[] = [
  { id: "desktop", label: "Desktop", size: "1440 × 900" },
  { id: "tablet", label: "Tablet", size: "768 × 1024" },
  { id: "mobile", label: "Mobile", size: "390 × 844" },
];

/** A reference or site picture, with the box both sides of a diff crop to. */
export interface PairSide {
  artifact: ImageArtifact;
  region?: ImageRegion;
}

export interface ImagePair {
  key: string;
  reference: PairSide;
  other: PairSide;
}

/** What a compared pair came to, without its diff image. */
export type PairResult =
  | { kind: "compared"; ratio: number }
  | { kind: "size-mismatch" }
  | { kind: "error"; message: string };

export type DriftReading =
  | { kind: "ratio"; ratio: number }
  | { kind: "size" }
  | { kind: "no-baseline" }
  | { kind: "not-captured" }
  | { kind: "pending" }
  | { kind: "error"; message: string };

export interface CaseSize {
  status: ReferenceStatus;
  capture: CaptureOutcome | null;
  drift: ImagePair | null;
  siteAgainstApproved: ImagePair | null;
  siteAgainstRun: ImagePair | null;
}

export interface DashboardCase {
  key: string;
  identity: VerificationIdentity;
  storyId: string;
  name: string;
  /** The Storybook path the story sits under, such as "Auction / Bidding". */
  path: string;
  domain: string;
  runId: string;
  capturedAt: string;
  appCommit: string;
  referenceCommit: string;
  recipe: string | null;
  thumbnail: ImageArtifact | null;
  sizes: Record<ProfileId, CaseSize>;
}

export type CompareMode = "approved" | "run";
export type DashboardTab = "approvals" | "site";
export type StoryStatus =
  | "approved"
  | "not-approved"
  | "none"
  | "changes-requested";
export type DriftTile = "ref-drift" | "ref-size" | "site-drift" | "site-size";
export type Tile = StoryStatus | DriftTile;

// One key and one settlement rule for the browser and the coordinator, so a
// stored score is found under the key the dashboard looks it up by.
export { pairKey, settledWithoutPixels };

function makePair(reference: PairSide, other: PairSide): ImagePair {
  return { key: pairKey(reference, other), reference, other };
}

export function readPair(
  pair: ImagePair,
  results: ReadonlyMap<string, PairResult>,
): DriftReading {
  const result = settledWithoutPixels(pair) ?? results.get(pair.key);
  if (!result) return { kind: "pending" };
  if (result.kind === "compared") return { kind: "ratio", ratio: result.ratio };
  if (result.kind === "size-mismatch") return { kind: "size" };
  return { kind: "error", message: result.message };
}

/** The Storybook index's words for a story, when the story still exists. */
export interface StoryEntry {
  title: string;
  name: string;
}

/** Storybook titles read Domain/Area/Screens/Name; a Flows story has no name. */
export function storyPlace(
  entry: StoryEntry | undefined,
  label: string,
): { name: string; path: string; domain: string } {
  const labelName = label.split("/").pop()?.trim() || label;
  if (!entry) {
    const parts = label.split("/").map((part) => part.trim());
    const path = parts.slice(0, -1).join(" / ") || "Other";
    return {
      name: labelName,
      path,
      domain: parts.length > 1 ? parts[0] : path,
    };
  }
  const parts = entry.title
    .split("/")
    .map((part) => part.trim())
    .filter((part) => part !== "Screens");
  const last = parts[parts.length - 1];
  if (last === "Flows") {
    return { name: labelName, path: parts.join(" / "), domain: parts[0] };
  }
  return {
    name: /^default$/i.test(entry.name) ? last : `${last} · ${entry.name}`,
    path: parts.slice(0, -1).join(" / ") || parts[0],
    domain: parts[0],
  };
}

function sameIdentityAs(
  capture: CaptureOutcome,
  identity: VerificationIdentity,
): boolean {
  return (
    capture.caseId === identity.caseId &&
    capture.targetId === identity.targetId &&
    capture.capturePointId === identity.capturePointId
  );
}

function sizeOf(
  run: VerificationManifest,
  identity: VerificationIdentity,
  profileId: ProfileId,
  locale: string,
  references: readonly ReferenceRecord[],
  approvals: readonly Approval[],
): CaseSize {
  const status = referenceStatus(
    references,
    approvals,
    identity,
    profileId,
    locale,
  );
  const capture =
    run.captures.find(
      (item) =>
        sameIdentityAs(item, identity) &&
        item.profileId === profileId &&
        captureLocale(item).toLowerCase() === locale.toLowerCase(),
    ) ?? null;
  const captured = capture?.status === "captured" ? capture : null;
  const runReference: PairSide | null = captured?.reference
    ? { artifact: captured.reference, region: captured.referenceRegion }
    : null;
  const newest: PairSide | null = status.current
    ? { artifact: status.current.image, region: status.current.region }
    : runReference;
  const approved: PairSide | null = status.approved
    ? {
        artifact: status.approved.reference.image,
        region: status.approved.reference.region,
      }
    : null;
  const site: PairSide | null = captured
    ? { artifact: captured.site, region: captured.siteRegion }
    : null;
  return {
    status,
    capture,
    drift: approved && newest ? makePair(approved, newest) : null,
    siteAgainstApproved: approved && site ? makePair(approved, site) : null,
    siteAgainstRun: runReference && site ? makePair(runReference, site) : null,
  };
}

/** One row per case: the newest run that holds evidence for it, at this locale. */
export function buildCases(input: {
  runs: readonly VerificationManifest[];
  references: readonly ReferenceRecord[];
  approvals: readonly Approval[];
  locale: string;
  entryOf: (storyId: string) => StoryEntry | undefined;
}): DashboardCase[] {
  const { runs, references, approvals, locale, entryOf } = input;
  const newestFirst = currentRuns(runs).sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
  const cases = new Map<string, DashboardCase>();
  const retired = new Set<string>();
  for (const run of newestFirst) {
    for (const entry of run.catalogue) {
      const identity: VerificationIdentity = {
        caseId: entry.caseId,
        targetId: entry.targetId,
        capturePointId: entry.capturePointId,
      };
      const key = identityKey(identity);
      if (cases.has(key) || retired.has(key)) continue;
      if (entry.status === "retired") {
        retired.add(key);
        continue;
      }
      // A run that retried other cases holds no evidence for this one. A
      // story catalogue's evidence is its references, never a site capture.
      if (
        !isStoryCatalogue(run) &&
        !run.captures.some(
          (capture) =>
            capture.status !== "not-selected" &&
            sameIdentityAs(capture, identity),
        )
      ) {
        continue;
      }
      const size = (profileId: ProfileId) =>
        sizeOf(run, identity, profileId, locale, references, approvals);
      const sizes = {
        desktop: size("desktop"),
        tablet: size("tablet"),
        mobile: size("mobile"),
      };
      const desktop = sizes.desktop;
      const desktopCapture =
        desktop.capture?.status === "captured" ? desktop.capture : null;
      cases.set(key, {
        key,
        identity,
        storyId: entry.storyId,
        ...storyPlace(entryOf(entry.storyId), entry.label),
        runId: run.runId,
        capturedAt: run.createdAt,
        appCommit: run.checkpoint.app.commit,
        referenceCommit: run.checkpoint.reference.commit,
        recipe: typeof entry.recipe === "string" ? entry.recipe : null,
        thumbnail:
          desktop.status.current?.image ?? desktopCapture?.reference ?? null,
        sizes,
      });
    }
  }
  return [...cases.values()].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

export function driftOf(
  size: CaseSize,
  results: ReadonlyMap<string, PairResult>,
): DriftReading {
  if (!size.drift) return { kind: "no-baseline" };
  return readPair(size.drift, results);
}

export function siteOf(
  size: CaseSize,
  mode: CompareMode,
  results: ReadonlyMap<string, PairResult>,
): DriftReading {
  if (size.capture?.status !== "captured") return { kind: "not-captured" };
  const pair =
    mode === "approved" ? size.siteAgainstApproved : size.siteAgainstRun;
  if (!pair)
    return { kind: mode === "approved" ? "no-baseline" : "not-captured" };
  return readPair(pair, results);
}

/** Every pair that still needs pixels: drift, and the site in the mode shown. */
export function pairsToCompare(
  cases: readonly DashboardCase[],
  mode: CompareMode,
): ImagePair[] {
  const pairs = new Map<string, ImagePair>();
  for (const item of cases) {
    for (const { id } of PROFILE_ORDER) {
      const size = item.sizes[id];
      const site =
        mode === "approved" ? size.siteAgainstApproved : size.siteAgainstRun;
      for (const pair of [size.drift, site]) {
        if (pair) pairs.set(pair.key, pair);
      }
    }
  }
  return [...pairs.values()];
}

/** Worst first: another box beats any percentage, and no reading comes last. */
export function severity(reading: DriftReading): number {
  if (reading.kind === "size") return 1000;
  return reading.kind === "ratio" ? reading.ratio * 100 : -1;
}

export function isPastTolerance(reading: DriftReading): boolean {
  return (
    reading.kind === "size" ||
    (reading.kind === "ratio" && reading.ratio > HIGH_RATIO)
  );
}

export function readingTone(reading: DriftReading): DiffTone | "muted" {
  if (reading.kind === "size") return "high";
  return reading.kind === "ratio" ? diffTone(reading.ratio) : "muted";
}

export function readingShort(reading: DriftReading): string {
  switch (reading.kind) {
    case "ratio":
      return `${(reading.ratio * 100).toFixed(1)}%`;
    case "size":
      return "Size ≠";
    case "no-baseline":
      return "-";
    case "not-captured":
      return "Not captured";
    case "pending":
      return "Comparing…";
    case "error":
      return "Unreadable";
  }
}

export function readingLong(reading: DriftReading): string {
  switch (reading.kind) {
    case "ratio":
      return `${(reading.ratio * 100).toFixed(1)}% differs`;
    case "size":
      return "region size differs";
    case "no-baseline":
      return "no approved reference to compare";
    case "not-captured":
      return "not captured";
    case "pending":
      return "comparing…";
    case "error":
      return `unreadable: ${reading.message}`;
  }
}

function flagsOf(item: DashboardCase): ReferenceFlag[] {
  return PROFILE_ORDER.map(({ id }) => item.sizes[id].status.flag);
}

/** A story is approved only when every size is; each story has one status. */
export function statusOfFlags(flags: readonly ReferenceFlag[]): StoryStatus {
  if (flags.every((flag) => flag === "approved")) return "approved";
  if (flags.includes("changes-requested")) return "changes-requested";
  if (flags.every((flag) => flag === "none")) return "none";
  return "not-approved";
}

export function statusOfCase(item: DashboardCase): StoryStatus {
  return statusOfFlags(flagsOf(item));
}

/** A flow's steps are one story, so its status spans all of them. */
export function storyStatuses(
  cases: readonly DashboardCase[],
): Map<string, StoryStatus> {
  const flags = new Map<string, ReferenceFlag[]>();
  for (const item of cases) {
    flags.set(item.storyId, [
      ...(flags.get(item.storyId) ?? []),
      ...flagsOf(item),
    ]);
  }
  return new Map(
    [...flags].map(([storyId, value]) => [storyId, statusOfFlags(value)]),
  );
}

export function matchesDriftTile(
  item: DashboardCase,
  tile: DriftTile,
  mode: CompareMode,
  results: ReadonlyMap<string, PairResult>,
): boolean {
  return PROFILE_ORDER.some(({ id }) => {
    const size = item.sizes[id];
    if (tile === "ref-drift" || tile === "ref-size") {
      const reading = driftOf(size, results);
      return tile === "ref-size"
        ? reading.kind === "size"
        : reading.kind === "ratio" && isPastTolerance(reading);
    }
    const reading = siteOf(size, mode, results);
    return tile === "site-size"
      ? reading.kind === "size"
      : reading.kind === "ratio" && isPastTolerance(reading);
  });
}

export function needsAttention(
  item: DashboardCase,
  mode: CompareMode,
  results: ReadonlyMap<string, PairResult>,
): boolean {
  return PROFILE_ORDER.some(({ id }) => {
    const size = item.sizes[id];
    return (
      size.status.flag !== "approved" ||
      isPastTolerance(driftOf(size, results)) ||
      isPastTolerance(siteOf(size, mode, results))
    );
  });
}

function worstUnapproved(
  item: DashboardCase,
  results: ReadonlyMap<string, PairResult>,
): number {
  return Math.max(
    -1,
    ...PROFILE_ORDER.map(({ id }) => item.sizes[id])
      .filter(
        (size) =>
          size.status.flag === "not-approved" ||
          size.status.flag === "changes-requested",
      )
      .map((size) => severity(driftOf(size, results))),
  );
}

export type ApprovalBucket = 0 | 1 | 2 | 3;

export const BUCKET_LABELS: Readonly<Record<ApprovalBucket, string>> = {
  0: `Unapproved reference drift over ${HIGH_RATIO * 100}%`,
  1: "No baseline",
  2: "Other unapproved references",
  3: "Approved",
};

export function approvalBucket(
  item: DashboardCase,
  results: ReadonlyMap<string, PairResult>,
): ApprovalBucket {
  if (worstUnapproved(item, results) > HIGH_RATIO * 100) return 0;
  const status = statusOfCase(item);
  if (status === "none") return 1;
  return status === "approved" ? 3 : 2;
}

/** The approval queue, worst first; approved cases sit last when asked for. */
export function orderForApprovals(
  cases: readonly DashboardCase[],
  results: ReadonlyMap<string, PairResult>,
  includeApproved: boolean,
): DashboardCase[] {
  return cases
    .filter((item) => includeApproved || approvalBucket(item, results) !== 3)
    .map((item) => ({
      item,
      bucket: approvalBucket(item, results),
      worst: worstUnapproved(item, results),
    }))
    .sort(
      (left, right) =>
        left.bucket - right.bucket ||
        right.worst - left.worst ||
        left.item.name.localeCompare(right.item.name),
    )
    .map(({ item }) => item);
}

export function worstSite(
  item: DashboardCase,
  profiles: readonly ProfileId[],
  mode: CompareMode,
  results: ReadonlyMap<string, PairResult>,
): number {
  return Math.max(
    ...profiles.map((id) => severity(siteOf(item.sizes[id], mode, results))),
  );
}

/** Highest site drift first, taken over the sizes on show. */
export function orderForSite(
  cases: readonly DashboardCase[],
  profiles: readonly ProfileId[],
  mode: CompareMode,
  results: ReadonlyMap<string, PairResult>,
): DashboardCase[] {
  return [...cases].sort(
    (left, right) =>
      worstSite(right, profiles, mode, results) -
        worstSite(left, profiles, mode, results) ||
      left.name.localeCompare(right.name),
  );
}

function driftedProfiles(
  item: DashboardCase,
  profiles: readonly ProfileId[],
  mode: CompareMode,
  results: ReadonlyMap<string, PairResult>,
  isDrift: (reading: DriftReading) => boolean,
): ProfileId[] {
  return profiles.filter((id) =>
    isDrift(siteOf(item.sizes[id], mode, results)),
  );
}

/** Any real drift earns a prompt; a pixel diff under 0.5% reads as a match. */
export function hasSiteDrift(
  item: DashboardCase,
  profiles: readonly ProfileId[],
  mode: CompareMode,
  results: ReadonlyMap<string, PairResult>,
): boolean {
  return driftedProfiles(item, profiles, mode, results, isAnyDrift).length > 0;
}

function isAnyDrift(reading: DriftReading): boolean {
  return (
    reading.kind === "size" ||
    (reading.kind === "ratio" && diffTone(reading.ratio) !== "ok")
  );
}

export interface PromptContext {
  origin: string;
  locale: string;
  mode: CompareMode;
  profiles: readonly ProfileId[];
  results: ReadonlyMap<string, PairResult>;
}

function storyReport(
  item: DashboardCase,
  context: PromptContext,
  isDrift: (reading: DriftReading) => boolean,
): string {
  const { origin, locale, mode, profiles, results } = context;
  const against =
    mode === "approved"
      ? "the last approved reference"
      : "the run's own reference";
  const lines = driftedProfiles(item, profiles, mode, results, isDrift).map(
    (id) => {
      const profile = PROFILE_ORDER.find((entry) => entry.id === id);
      const reading = siteOf(item.sizes[id], mode, results);
      return `  - ${profile?.label} (${profile?.size}): ${
        reading.kind === "size"
          ? "the site box and the reference box differ in size, so pixels were not compared"
          : `${readingLong(reading).replace(" differs", "")} of the component region differs`
      }`;
    },
  );
  return [
    `${item.name} (${item.path})`,
    `- Story: ${item.storyId} · Case: ${item.identity.caseId}`,
    `- Target: ${item.identity.targetId} · Capture point: ${item.identity.capturePointId} · Locale: ${locale}`,
    `- Site run: ${item.runId} · app ${item.appCommit.slice(0, 12)}, reference ${item.referenceCommit.slice(0, 12)} (${item.capturedAt})`,
    ...(item.recipe ? [`- Site recipe: ${item.recipe}`] : []),
    `- Site Compare: ${origin}/${siteCompareHref(item.storyId)}`,
    `- Drift against ${against}:`,
    ...lines,
  ].join("\n");
}

const PROMPT_RULES = [
  "Rules:",
  "- The Storybook reference is the design. Change the site, not external/grade10-spec, and do not restyle a design-system component.",
  "- Fix a size mismatch before any pixel difference: pixels are only compared when both boxes match.",
  "- Look for the cause in the site's composition and data, and check for siblings of the same bug.",
  "- If the reference itself looks wrong, stop and tell me instead of matching it.",
  "",
  "Verify:",
  "1. Commit first, because a dirty tree is captured as unverified evidence.",
  "2. Run pnpm ui:verify capture --selection all --path <the story's .verification.json>.",
  "3. Press Refresh in Site Compare and report the new numbers for every size.",
].join("\n");

export function storyPrompt(
  item: DashboardCase,
  context: PromptContext,
): string {
  return `Fix this layout drift on the Grade10 site so it matches its Storybook reference.\n\n${storyReport(item, context, isAnyDrift)}\n\n${PROMPT_RULES}`;
}

/** Stories past the tolerance, in the order given. */
export function batchTargets(
  ordered: readonly DashboardCase[],
  context: PromptContext,
): DashboardCase[] {
  return ordered.filter(
    (item) =>
      driftedProfiles(
        item,
        context.profiles,
        context.mode,
        context.results,
        isPastTolerance,
      ).length > 0,
  );
}

export function batchPrompt(
  targets: readonly DashboardCase[],
  context: PromptContext,
): string {
  return `Fix these ${targets.length} layout drifts on the Grade10 site so each matches its Storybook reference. They are listed worst first. Group stories that share a cause into one fix.\n\n${targets
    .map(
      (item, index) =>
        `${index + 1}. ${storyReport(item, context, isPastTolerance)}`,
    )
    .join("\n\n")}\n\n${PROMPT_RULES}`;
}

export const SITE_COMPARE_PANEL = "grade10/ui-verification";
export const APPROVE_PANEL = `${SITE_COMPARE_PANEL}/approve`;

export function storyPanelHref(storyId: string, panel: string): string {
  return `?path=/story/${encodeURIComponent(storyId)}&addonPanel=${panel}`;
}

export function siteCompareHref(storyId: string): string {
  return storyPanelHref(storyId, SITE_COMPARE_PANEL);
}
