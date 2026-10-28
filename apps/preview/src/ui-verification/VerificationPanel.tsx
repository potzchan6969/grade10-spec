import { localesOf } from "@grade10/i18n";
import type {
  CaptureOutcome,
  ImageArtifact,
  ImageRegion,
  ProfileId,
  VerificationManifest,
} from "@grade10/ui-verification/model";
import { captureLocale } from "@grade10/ui-verification/model";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useArgs,
  useStorybookApi,
  useStorybookState,
} from "storybook/manager-api";
import { useTheme } from "storybook/theming";
import type { VerificationIdentity } from "./archive-client";
import {
  getRun,
  identityKey,
  isRecord,
  listRuns,
  sameIdentity,
  verificationIdentity,
  verifiedPngUrl,
} from "./archive-client";

import {
  diffLabel,
  diffTone,
  FlowOverview,
  FlowScreenSelect,
  useFlowScores,
} from "./FlowPanel";
import { CANVAS, type FlowParameter } from "./flow-tree";
import type { PixelComparison } from "./pixel-compare";
import { anchorOf, comparePixels, describeAnchor } from "./pixel-compare";

import "./verification-panel.css";

// The Storybook manager builder compiles this TSX with React.createElement.
void React;

const ARCHIVE_BASE =
  typeof window === "undefined" ? "" : window.location.origin;
const PROFILE_TABS: readonly {
  id: ProfileId;
  shortLabel: string;
  size: string;
}[] = [
  { id: "desktop", shortLabel: "Desktop", size: "1440 × 900" },
  { id: "tablet", shortLabel: "Tablet", size: "768 × 1024" },
  { id: "mobile", shortLabel: "Mobile", size: "390 × 844" },
];
const GRADE10_LOCALES = localesOf("grade10");
const LOCALE_LABELS: Readonly<Record<string, string>> = {
  en: "English",
  "zh-hant": "Traditional Chinese",
  "zh-hans": "Simplified Chinese",
  ko: "Korean",
};

interface IdentityOption {
  identity: VerificationIdentity;
  label: string;
  status: string;
  storyId: string;
  referenceStoryId: string;
  storyIds: string[];
  createdAt: string;
}

interface VersionOption {
  key: string;
  appRef: string;
  appCommit: string;
  referenceRef: string;
  referenceCommit: string;
  runs: VerificationManifest[];
  latestCreatedAt: string;
}

interface ImageUrls {
  site?: string;
  reference?: string;
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "The archive request failed.";
}

function localeKey(value: string): string {
  return value.toLowerCase();
}

function localeLabel(value: string): string {
  const language = LOCALE_LABELS[localeKey(value)];
  return language ? `${language} (${value})` : value;
}

function localeOptions(
  manifest: VerificationManifest | null | undefined,
): string[] {
  if (!manifest) return [...GRADE10_LOCALES];
  const recorded = manifest.captures.map((capture) => captureLocale(capture));
  const requested = manifest.locales ?? [...GRADE10_LOCALES, ...recorded];
  const unique = new Map<string, string>();
  for (const locale of requested) {
    const key = localeKey(locale);
    if (!unique.has(key)) unique.set(key, locale);
  }
  return [...unique.values()];
}

function entryIdentity(value: unknown): VerificationIdentity | null {
  return verificationIdentity(value);
}

function caseIdOf(value: unknown): string {
  return isRecord(value) && typeof value.caseId === "string"
    ? value.caseId
    : "";
}

function identityOptions(runs: VerificationManifest[]): IdentityOption[] {
  const latest = new Map<string, IdentityOption>();
  for (const run of runs) {
    for (const entry of run.catalogue) {
      const identity = entryIdentity(entry);
      if (!identity) continue;
      const key = identityKey(identity);
      const prior = latest.get(key);
      const referenceStoryId =
        isRecord(entry.reference) && typeof entry.reference.storyId === "string"
          ? entry.reference.storyId
          : "";
      const storyIds = [
        ...new Set(
          [...(prior?.storyIds ?? []), entry.storyId, referenceStoryId].filter(
            Boolean,
          ),
        ),
      ];
      if (prior && prior.createdAt >= run.createdAt) {
        latest.set(key, { ...prior, storyIds });
        continue;
      }
      latest.set(key, {
        identity,
        label: entry.label,
        status: entry.status,
        storyId: entry.storyId,
        referenceStoryId,
        storyIds,
        createdAt: run.createdAt,
      });
    }
  }
  return [...latest.values()].sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

function versionKeyOf(run: VerificationManifest): string {
  return JSON.stringify([
    run.checkpoint.app.commit,
    run.checkpoint.reference.commit,
  ]);
}

function versionOptions(runs: VerificationManifest[]): VersionOption[] {
  const versions = new Map<string, VersionOption>();
  const newestFirst = [...runs].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
  for (const run of newestFirst) {
    const key = versionKeyOf(run);
    const prior = versions.get(key);
    if (prior) {
      prior.runs.push(run);
      continue;
    }
    versions.set(key, {
      key,
      appRef: run.checkpoint.app.ref,
      appCommit: run.checkpoint.app.commit,
      referenceRef: run.checkpoint.reference.ref,
      referenceCommit: run.checkpoint.reference.commit,
      runs: [run],
      latestCreatedAt: run.createdAt,
    });
  }
  return [...versions.values()];
}

function versionLabel(version: VersionOption): string {
  return `${version.appRef} ${version.appCommit.slice(0, 12)} / ${version.referenceRef} ${version.referenceCommit.slice(0, 12)}`;
}

function runHasIdentity(
  run: VerificationManifest,
  identity: VerificationIdentity,
): boolean {
  return run.catalogue.some((entry) => {
    const entryId = entryIdentity(entry);
    return entryId !== null && sameIdentity(entryId, identity);
  });
}

function isCaseOnlyVerification(value: unknown, caseId: string): boolean {
  return (
    isRecord(value) &&
    caseIdOf(value) === caseId &&
    !("targetId" in value) &&
    !("capturePointId" in value)
  );
}

async function listAllRuns(
  base: string,
  caseId: string,
  signal: AbortSignal,
): Promise<VerificationManifest[]> {
  const byId = new Map<string, VerificationManifest>();
  const seenCursors = new Set<string>();
  let cursor: string | undefined;
  do {
    const page = await listRuns(base, caseId, cursor, signal);
    for (const run of page.runs) byId.set(run.runId, run);
    cursor = page.cursor;
    if (cursor && seenCursors.has(cursor)) {
      throw new Error("The archive repeated a run history cursor.");
    }
    if (cursor) seenCursors.add(cursor);
  } while (cursor && !signal.aborted);
  if (signal.aborted) {
    throw new DOMException("The request was aborted.", "AbortError");
  }
  return [...byId.values()].sort((left, right) =>
    right.createdAt.localeCompare(left.createdAt),
  );
}

function formatIdentity(identity: VerificationIdentity): string {
  return `${identity.caseId} · ${identity.targetId} · ${identity.capturePointId}`;
}

function captureFor(
  manifest: VerificationManifest | null,
  identity: VerificationIdentity | null,
  profileId: ProfileId,
  locale: string,
): CaptureOutcome | null {
  if (!manifest || !identity) return null;
  return (
    manifest.captures.find(
      (capture) =>
        capture.caseId === identity.caseId &&
        capture.targetId === identity.targetId &&
        capture.capturePointId === identity.capturePointId &&
        capture.profileId === profileId &&
        localeKey(captureLocale(capture)) === localeKey(locale),
    ) ?? null
  );
}

type Tone = "ok" | "warn" | "idle";

type ComparisonState = PixelComparison | "running";

function shortHash(value: string): string {
  return value.length > 20 ? `${value.slice(0, 8)}…${value.slice(-6)}` : value;
}

function shortCommit(value: string): string {
  return value.slice(0, 12);
}

function percent(ratio: number): string {
  if (ratio === 0) return "Exact match";
  if (ratio < 0.0001) return "<0.01% differ";
  return `${(ratio * 100).toFixed(ratio < 0.1 ? 2 : 1)}% differ`;
}

function profileStatus(
  capture: CaptureOutcome | null,
  comparison: ComparisonState | undefined,
): { text: string; tone: Tone } {
  if (!capture) return { text: "Not captured", tone: "idle" };
  if (capture.status === "failed")
    return { text: "Capture failed", tone: "warn" };
  if (capture.status === "not-selected") {
    return { text: "Not selected", tone: "idle" };
  }
  if (!capture.reference) return { text: "No reference", tone: "idle" };
  if (comparison === "running") return { text: "Comparing…", tone: "idle" };
  if (!comparison) return { text: "Not compared", tone: "idle" };
  if (comparison.kind === "size-mismatch") {
    return { text: "Size differs", tone: "warn" };
  }
  if (comparison.kind === "error") {
    return { text: "Comparison failed", tone: "warn" };
  }
  return {
    text: percent(comparison.ratio),
    tone: comparison.ratio < 0.005 ? "ok" : "warn",
  };
}

function ImageEvidence({
  title,
  artifact,
  imageUrl,
  cropRegion,
}: {
  title: string;
  artifact: ImageArtifact;
  imageUrl: string | undefined;
  cropRegion?: ImageRegion;
}) {
  const imageStyle = cropRegion
    ? {
        left: `${(-cropRegion.x / cropRegion.width) * 100}%`,
        top: `${(-cropRegion.y / cropRegion.height) * 100}%`,
        width: `${(artifact.width / cropRegion.width) * 100}%`,
        height: `${(artifact.height / cropRegion.height) * 100}%`,
      }
    : undefined;
  return (
    <section
      className="verification-image-card"
      aria-label={`${title} evidence`}
    >
      <div className="verification-image-heading">
        <h4>{title}</h4>
        <span>
          {artifact.width} × {artifact.height}
        </span>
      </div>
      <div
        className={`verification-image-frame${cropRegion ? " verification-image-frame--crop" : ""}`}
        style={{
          aspectRatio: cropRegion
            ? `${cropRegion.width} / ${cropRegion.height}`
            : `${artifact.width} / ${artifact.height}`,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={
              cropRegion ? `${title} capture region` : `${title} full viewport`
            }
            style={imageStyle}
          />
        ) : (
          <p role="status">Loading original PNG…</p>
        )}
      </div>
      <div className="verification-hash-row">
        <code title={`SHA-256 ${artifact.sha256}`}>
          sha256 {shortHash(artifact.sha256)}
        </code>
        {imageUrl ? (
          <a href={imageUrl} rel="noreferrer" target="_blank">
            Open full size
          </a>
        ) : null}
        {imageUrl ? (
          <a
            href={imageUrl}
            download={`${title.toLocaleLowerCase()}.png`}
            aria-label={`Download original ${title} PNG · SHA-256 ${artifact.sha256}`}
          >
            Download PNG
          </a>
        ) : null}
      </div>
      {title === "Reference" && !cropRegion ? (
        <p className="verification-notice">
          No reference region was recorded; showing the full reference image.
        </p>
      ) : null}
    </section>
  );
}

function DiffEvidence({
  comparison,
  aspect,
  canCompare,
}: {
  comparison: ComparisonState | undefined;
  aspect: string;
  canCompare: boolean;
}) {
  let body: React.ReactNode;
  let note = "";
  if (comparison === "running") {
    body = <p role="status">Comparing pixels…</p>;
  } else if (!comparison) {
    body = (
      <p className="verification-muted">
        {canCompare ? "Not compared yet" : "Needs both images"}
      </p>
    );
  } else if (comparison.kind === "error") {
    body = (
      <p role="alert" className="verification-error">
        {comparison.message}
      </p>
    );
  } else if (comparison.kind === "size-mismatch") {
    body = (
      <p className="verification-notice">
        The anchors differ in size: reference {comparison.reference.width} ×{" "}
        {comparison.reference.height}, site {comparison.site.width} ×{" "}
        {comparison.site.height}. Fix the layout before comparing pixels.
      </p>
    );
  } else {
    note = `${comparison.regions.length} region${comparison.regions.length === 1 ? "" : "s"}`;
    body = (
      <>
        <img src={comparison.diffUrl} alt="Pixel difference overlay" />
        {comparison.regions.map((region) => (
          <span
            key={`${region.x}:${region.y}`}
            className="verification-diff-box"
            style={{
              left: `${(region.x / comparison.size.width) * 100}%`,
              top: `${(region.y / comparison.size.height) * 100}%`,
              width: `${(region.width / comparison.size.width) * 100}%`,
              height: `${(region.height / comparison.size.height) * 100}%`,
            }}
          />
        ))}
      </>
    );
  }
  const framed =
    comparison !== undefined &&
    comparison !== "running" &&
    comparison.kind === "compared";
  return (
    <section
      className="verification-image-card"
      aria-label="Pixel diff evidence"
    >
      <div className="verification-image-heading">
        <h4>Pixel diff</h4>
        <span>{note}</span>
        {framed ? (
          <a href={comparison.diffUrl} rel="noreferrer" target="_blank">
            Open full size
          </a>
        ) : null}
      </div>
      <div
        className={`verification-image-frame${framed ? "" : " verification-image-frame--empty"}`}
        style={{ aspectRatio: aspect }}
      >
        {body}
      </div>
    </section>
  );
}

// The panel renders in the Storybook manager, where the design-system theme CSS
// is not loaded, so it borrows the manager theme through scoped variables.
function themeVariables(theme: ReturnType<typeof useTheme>) {
  const dark = theme.base === "dark";
  return {
    "--vp-fg": theme.color.defaultText,
    "--vp-muted": theme.color.mediumdark,
    "--vp-bg": theme.background.content,
    "--vp-surface": theme.background.app,
    "--vp-border": theme.appBorderColor,
    "--vp-accent": theme.color.secondary,
    "--vp-on-accent": dark ? "#08141e" : "#ffffff",
    "--vp-font": theme.typography.fonts.base,
    "--vp-mono": theme.typography.fonts.mono,
    "--vp-ok-bg": dark ? "#17331f" : "#e5f5ea",
    "--vp-ok-border": dark ? "#2f6b42" : "#a9d8b8",
    "--vp-ok-fg": dark ? "#8fe0a8" : "#14602e",
    "--vp-warn-bg": dark ? "#3a2f10" : "#fff9e8",
    "--vp-warn-border": dark ? "#7a6320" : "#d8c691",
    "--vp-warn-fg": dark ? "#f2dfa2" : "#523f12",
    "--vp-error-bg": dark ? "#3d1717" : "#fff0f0",
    "--vp-error-border": dark ? "#9b3b3b" : "#d65a5a",
    "--vp-error-fg": dark ? "#ffc9c9" : "#7d1818",
    "--vp-diff": dark ? "#ff6b6b" : "#d92d2d",
    "--vp-score-ok": dark ? "#a9ccff" : "#1f5fbf",
    "--vp-score-warn": dark ? "#f6c78e" : "#8a5300",
    "--vp-score-high": dark ? "#ff9b9b" : "#b42318",
  } as React.CSSProperties;
}

// Storybook hands back fresh parameter objects on every render. Equal
// identities must stay one object, or a late render reloads the run and wipes
// the comparisons the reviewer just made.
function useStableIdentity(value: VerificationIdentity | null) {
  const stable = useRef(value);
  const next = value ? identityKey(value) : "";
  const current = stable.current ? identityKey(stable.current) : "";
  if (next !== current) stable.current = value;
  return stable.current;
}

export function VerificationPanel({ active }: { active: boolean }) {
  const theme = useTheme();
  const managerApi = useStorybookApi();
  const managerState = useStorybookState();
  const currentStoryId = managerState.storyId;
  const verificationParameter = currentStoryId
    ? managerApi.getParameters(currentStoryId, "verification")
    : undefined;
  const caseIdHint = caseIdOf(verificationParameter);
  // A flow story names its screens; its Screen arg says which one is focused,
  // and that screen's capture point is the target this panel shows.
  const flow = (
    currentStoryId
      ? managerApi.getParameters(currentStoryId, "flow")
      : undefined
  ) as FlowParameter | undefined;
  const [storyArgs, updateStoryArgs] = useArgs();
  const flowScreenId = flow ? String(storyArgs.screen ?? CANVAS) : "";
  const flowCapturePointId =
    flow?.screens.find((screen) => screen.id === flowScreenId)
      ?.capturePointId ?? "";
  const exactIdentityHint = useMemo(
    () => verificationIdentity(verificationParameter),
    [verificationParameter],
  );

  const archiveBase = ARCHIVE_BASE;
  const [storyListOpen, setStoryListOpen] = useState(false);
  const [identitySearch, setIdentitySearch] = useState("");
  const [selectedIdentityKey, setSelectedIdentityKey] = useState("");
  const [selectedVersionKey, setSelectedVersionKey] = useState("");
  const [selectedCurrentCaseId, setSelectedCurrentCaseId] = useState("");
  const [selectedCurrentIdentityKey, setSelectedCurrentIdentityKey] =
    useState("");
  const [runs, setRuns] = useState<VerificationManifest[]>([]);
  const [manifest, setManifest] = useState<VerificationManifest | null>(null);
  const [localeId, setLocaleId] = useState<string>("en");
  const [selectedProfile, setSelectedProfile] = useState<ProfileId>("desktop");
  const [imageUrls, setImageUrls] = useState<
    Partial<Record<ProfileId, ImageUrls>>
  >({});
  const [comparisons, setComparisons] = useState<
    Partial<Record<ProfileId, ComparisonState>>
  >({});
  const [historyError, setHistoryError] = useState("");
  const [manifestError, setManifestError] = useState("");
  const [imageError, setImageError] = useState("");
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [loadingRun, setLoadingRun] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const diffUrls = useRef<string[]>([]);
  const comparisonGeneration = useRef(0);
  const identityChoices = useMemo(() => identityOptions(runs), [runs]);
  const currentIdentityChoices = useMemo(() => {
    if (caseIdHint) {
      const choices = identityChoices.filter(
        (choice) => choice.identity.caseId === caseIdHint,
      );
      if (
        exactIdentityHint &&
        !choices.some((choice) =>
          sameIdentity(choice.identity, exactIdentityHint),
        )
      ) {
        choices.unshift({
          identity: exactIdentityHint,
          label: currentStoryId || exactIdentityHint.caseId,
          status: "current, not archived",
          storyId: currentStoryId || "Current story",
          referenceStoryId: "",
          storyIds: [currentStoryId || "Current story"],
          createdAt: "",
        });
      }
      return choices;
    }
    if (!currentStoryId) return [];
    return identityChoices.filter((choice) =>
      choice.storyIds.includes(currentStoryId),
    );
  }, [caseIdHint, currentStoryId, exactIdentityHint, identityChoices]);
  const currentCaseIds = useMemo(
    () =>
      [
        ...new Set(
          currentIdentityChoices.map((choice) => choice.identity.caseId),
        ),
      ].sort(),
    [currentIdentityChoices],
  );
  const effectiveCurrentCaseId =
    (currentCaseIds.includes(caseIdHint) ? caseIdHint : "") ||
    (currentCaseIds.includes(selectedCurrentCaseId)
      ? selectedCurrentCaseId
      : currentCaseIds.length === 1
        ? currentCaseIds[0]
        : "");
  const currentTargetChoices = currentIdentityChoices.filter(
    (choice) => choice.identity.caseId === effectiveCurrentCaseId,
  );
  const currentTargetKeys = currentTargetChoices.map((choice) =>
    identityKey(choice.identity),
  );
  const flowIdentityKey = flowCapturePointId
    ? (currentTargetChoices
        .filter(
          (choice) => choice.identity.capturePointId === flowCapturePointId,
        )
        .map((choice) => identityKey(choice.identity))[0] ?? "")
    : "";
  const effectiveCurrentIdentityKey = flow
    ? flowIdentityKey
    : (currentTargetKeys.includes(selectedCurrentIdentityKey)
        ? selectedCurrentIdentityKey
        : "") ||
      (exactIdentityHint &&
      currentTargetKeys.includes(identityKey(exactIdentityHint))
        ? identityKey(exactIdentityHint)
        : "") ||
      (currentTargetChoices.length === 1
        ? identityKey(currentTargetChoices[0].identity)
        : "");
  const currentIdentity =
    currentTargetChoices.find(
      (choice) => identityKey(choice.identity) === effectiveCurrentIdentityKey,
    )?.identity ?? null;
  const currentVersionRuns = useMemo(
    () =>
      currentIdentity
        ? runs.filter((run) => runHasIdentity(run, currentIdentity))
        : runs,
    [currentIdentity, runs],
  );
  const versionRuns = storyListOpen ? runs : currentVersionRuns;
  const availableVersions = useMemo(
    () => versionOptions(versionRuns),
    [versionRuns],
  );
  const effectiveVersionKey = availableVersions.some(
    (version) => version.key === selectedVersionKey,
  )
    ? selectedVersionKey
    : (availableVersions[0]?.key ?? "");
  const selectedVersion =
    availableVersions.find((version) => version.key === effectiveVersionKey) ??
    null;
  const versionIdentityChoices = useMemo(
    () => identityOptions(selectedVersion?.runs ?? []),
    [selectedVersion],
  );
  const filteredVersionIdentityChoices = useMemo(() => {
    const query = identitySearch.trim().toLocaleLowerCase();
    if (!query) return versionIdentityChoices;
    return versionIdentityChoices.filter((choice) =>
      [
        choice.label,
        choice.identity.caseId,
        choice.identity.targetId,
        choice.identity.capturePointId,
        choice.storyId,
        ...choice.storyIds,
        choice.status,
      ]
        .join(" ")
        .toLocaleLowerCase()
        .includes(query),
    );
  }, [identitySearch, versionIdentityChoices]);
  const effectiveIdentityKey = storyListOpen
    ? versionIdentityChoices.some(
        (choice) => identityKey(choice.identity) === selectedIdentityKey,
      )
      ? selectedIdentityKey
      : ""
    : effectiveCurrentIdentityKey;
  const selectedStoryChoice = storyListOpen
    ? (versionIdentityChoices.find(
        (choice) => identityKey(choice.identity) === effectiveIdentityKey,
      ) ?? null)
    : null;
  const pendingIdentity = storyListOpen
    ? (selectedStoryChoice?.identity ?? null)
    : currentIdentity;
  const selectedIdentity = useStableIdentity(pendingIdentity);
  const listFilterCaseId = storyListOpen ? "" : caseIdHint;
  const listStoryScope = storyListOpen ? "" : (currentStoryId ?? "");
  // A version has one static layout, so its newest run is the one that counts.
  // Older runs stay in the archive but the panel does not offer them.
  const effectiveRunId = useMemo(
    () =>
      (selectedIdentity && selectedVersion
        ? selectedVersion.runs.find((run) =>
            runHasIdentity(run, selectedIdentity),
          )
        : undefined
      )?.runId ?? "",
    [selectedIdentity, selectedVersion],
  );
  const selectedManifestSummary =
    selectedVersion?.runs.find((run) => run.runId === effectiveRunId) ??
    manifest;
  const localeChoices = useMemo(
    () => localeOptions(selectedManifestSummary),
    [selectedManifestSummary],
  );
  const selectedLocaleHasOption = localeChoices.some(
    (locale) => localeKey(locale) === localeKey(localeId),
  );
  useEffect(() => {
    if (selectedLocaleHasOption) return;
    const firstLocale = localeChoices[0];
    if (firstLocale) setLocaleId(firstLocale);
  }, [localeChoices, selectedLocaleHasOption]);
  const selectedLocaleHasEvidence = Boolean(
    selectedManifestSummary &&
      selectedIdentity &&
      selectedManifestSummary.captures.some(
        (capture) =>
          capture.caseId === selectedIdentity.caseId &&
          capture.targetId === selectedIdentity.targetId &&
          capture.capturePointId === selectedIdentity.capturePointId &&
          localeKey(captureLocale(capture)) === localeKey(localeId),
      ),
  );
  const captures = useMemo(
    () =>
      Object.fromEntries(
        PROFILE_TABS.map((item) => [
          item.id,
          captureFor(manifest, selectedIdentity, item.id, localeId),
        ]),
      ) as Record<ProfileId, CaptureOutcome | null>,
    [localeId, manifest, selectedIdentity],
  );
  const provenanceCapture =
    PROFILE_TABS.map((item) => captures[item.id]).find(Boolean) ?? null;

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshVersion reloads the run list on demand
  useEffect(() => {
    if (!active || !archiveBase || (!storyListOpen && !listStoryScope)) {
      setRuns([]);
      setLoadingRuns(false);
      return;
    }
    const controller = new AbortController();
    setLoadingRuns(true);
    setHistoryError("");
    setRuns([]);
    void listAllRuns(archiveBase, listFilterCaseId, controller.signal)
      .then((nextRuns) => {
        if (controller.signal.aborted) return;
        setRuns(nextRuns);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setHistoryError(messageOf(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingRuns(false);
      });
    return () => controller.abort();
  }, [active, listFilterCaseId, listStoryScope, refreshVersion, storyListOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshVersion reloads the manifest on demand
  useEffect(() => {
    if (!active || !archiveBase || !effectiveRunId || !selectedIdentity) {
      setManifest(null);
      setLoadingRun(false);
      return;
    }
    const controller = new AbortController();
    setLoadingRun(true);
    setManifest(null);
    setManifestError("");
    void getRun(archiveBase, effectiveRunId, controller.signal)
      .then((value) => {
        if (!controller.signal.aborted) setManifest(value);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setManifestError(messageOf(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingRun(false);
      });
    return () => controller.abort();
  }, [active, effectiveRunId, refreshVersion, selectedIdentity]);

  useEffect(() => {
    if (!active || !archiveBase) {
      setImageUrls({});
      setLoadingImages(false);
      return;
    }
    const controller = new AbortController();
    const createdUrls: string[] = [];
    const targets = PROFILE_TABS.flatMap((item) => {
      const capture = captures[item.id];
      return capture?.status === "captured" ? [{ id: item.id, capture }] : [];
    });
    setImageUrls({});
    setImageError("");
    setLoadingImages(targets.length > 0);
    let pending = targets.length;
    const track = async (artifact: ImageArtifact) => {
      const url = await verifiedPngUrl(
        archiveBase,
        artifact,
        controller.signal,
      );
      createdUrls.push(url);
      return url;
    };
    for (const { id, capture } of targets) {
      void (async () => {
        const site = await track(capture.site);
        const reference = capture.reference
          ? await track(capture.reference)
          : undefined;
        if (controller.signal.aborted) return;
        setImageUrls((previous) => ({
          ...previous,
          [id]: { site, ...(reference ? { reference } : {}) },
        }));
      })()
        .catch((error: unknown) => {
          if (!controller.signal.aborted) setImageError(messageOf(error));
        })
        .finally(() => {
          pending -= 1;
          if (!controller.signal.aborted && pending === 0) {
            setLoadingImages(false);
          }
        });
    }
    return () => {
      controller.abort();
      for (const url of createdUrls) URL.revokeObjectURL(url);
    };
  }, [active, captures]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: a new capture selection drops the earlier comparisons
  useEffect(() => {
    comparisonGeneration.current += 1;
    setComparisons({});
    return () => {
      comparisonGeneration.current += 1;
      for (const url of diffUrls.current) URL.revokeObjectURL(url);
      diffUrls.current = [];
    };
  }, [captures]);

  function comparable(id: ProfileId): boolean {
    const capture = captures[id];
    const urls = imageUrls[id];
    return Boolean(
      capture?.status === "captured" &&
        capture.reference &&
        urls?.site &&
        urls.reference,
    );
  }

  async function runComparison(ids: ProfileId[]) {
    const generation = comparisonGeneration.current;
    setComparisons((previous) => ({
      ...previous,
      ...Object.fromEntries(ids.map((id) => [id, "running"])),
    }));
    for (const id of ids) {
      const capture = captures[id];
      const urls = imageUrls[id];
      if (
        capture?.status !== "captured" ||
        !capture.reference ||
        !urls?.site ||
        !urls.reference
      ) {
        continue;
      }
      const result = await comparePixels({
        referenceUrl: urls.reference,
        siteUrl: urls.site,
        referenceRegion: capture.referenceRegion,
        siteRegion: capture.siteRegion,
      });
      if (generation !== comparisonGeneration.current) {
        if (result.kind === "compared") URL.revokeObjectURL(result.diffUrl);
        return;
      }
      if (result.kind === "compared") diffUrls.current.push(result.diffUrl);
      setComparisons((previous) => ({ ...previous, [id]: result }));
    }
  }

  const comparableIds = PROFILE_TABS.map((item) => item.id).filter(comparable);
  const comparing = PROFILE_TABS.some(
    (item) => comparisons[item.id] === "running",
  );
  const uncompared = comparableIds.filter((id) => !comparisons[id]).join(",");
  // biome-ignore lint/correctness/useExhaustiveDependencies: each pair is compared once its two images arrive
  useEffect(() => {
    if (active && uncompared)
      void runComparison(uncompared.split(",") as ProfileId[]);
  }, [active, uncompared]);
  const flowScores = useFlowScores({
    active,
    archiveBase,
    caseId: caseIdHint,
    runs,
    screens: flow?.screens,
  });

  const selectedDeclaration = manifest?.catalogue.find(
    (entry) =>
      selectedIdentity !== null &&
      entry.caseId === selectedIdentity.caseId &&
      entry.targetId === selectedIdentity.targetId &&
      entry.capturePointId === selectedIdentity.capturePointId,
  );
  function storyNavigation(choice: IdentityOption) {
    if (choice.storyId && managerApi.resolveStory(choice.storyId)) {
      return { target: choice.storyId, notice: "" };
    }
    if (
      choice.referenceStoryId &&
      managerApi.resolveStory(choice.referenceStoryId)
    ) {
      return {
        target: choice.referenceStoryId,
        notice:
          "Recorded story unavailable; the reference story is available in this Storybook.",
      };
    }

    const exactMatches: string[] = [];
    const caseOnlyMatches: string[] = [];
    for (const indexedEntry of Object.values(managerState.index ?? {})) {
      if (indexedEntry.type !== "story") continue;
      const indexedStory = managerApi.getData(indexedEntry.id);
      if (indexedStory?.type !== "story") continue;
      const verification = indexedStory.parameters?.verification;
      const indexedIdentity = verificationIdentity(verification);
      if (indexedIdentity && sameIdentity(indexedIdentity, choice.identity)) {
        exactMatches.push(indexedStory.id);
      } else if (isCaseOnlyVerification(verification, choice.identity.caseId)) {
        caseOnlyMatches.push(indexedStory.id);
      }
    }
    if (exactMatches.length === 1) {
      return {
        target: exactMatches[0],
        notice:
          "Recorded story IDs are unavailable; opened the unique Storybook story with the matching verification identity.",
      };
    }
    if (exactMatches.length === 0 && caseOnlyMatches.length === 1) {
      return {
        target: caseOnlyMatches[0],
        notice:
          "Recorded story IDs are unavailable; opened the unique Storybook story mapped to this case.",
      };
    }
    if (exactMatches.length > 1 || caseOnlyMatches.length > 1) {
      return {
        target: "",
        notice:
          "Recorded story IDs are unavailable, and the current Storybook mapping is ambiguous. Historical evidence remains available.",
      };
    }
    return {
      target: "",
      notice:
        "The recorded story is no longer in this Storybook. Historical evidence remains available.",
    };
  }

  const selectedStoryNavigation = selectedStoryChoice
    ? storyNavigation(selectedStoryChoice)
    : null;

  function selectArchivedStory(choice: IdentityOption) {
    setSelectedIdentityKey(identityKey(choice.identity));
    const navigation = storyNavigation(choice);
    if (navigation.target) managerApi.selectStory(navigation.target);
  }

  function openStoryList() {
    setSelectedVersionKey(effectiveVersionKey);
    setSelectedIdentityKey(
      currentIdentity &&
        versionIdentityChoices.some((choice) =>
          sameIdentity(choice.identity, currentIdentity),
        )
        ? identityKey(currentIdentity)
        : "",
    );
    setIdentitySearch("");
    setStoryListOpen(true);
  }

  return (
    <div className="verification-panel" style={themeVariables(theme)}>
      <header className="verification-panel-header">
        <h2>Verification</h2>
        <div className="verification-inline-actions">
          {storyListOpen ? (
            <button type="button" onClick={() => setStoryListOpen(false)}>
              Return to current story
            </button>
          ) : (
            <button type="button" onClick={openStoryList}>
              All recordings
            </button>
          )}
          <button
            type="button"
            className="verification-icon-button"
            aria-label="Refresh"
            onClick={() => setRefreshVersion((value) => value + 1)}
            disabled={!archiveBase}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-3-6.7" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
        </div>
      </header>

      {flow && !storyListOpen ? (
        <FlowScreenSelect
          current={flowScreenId}
          onSelect={(id) => updateStoryArgs({ screen: id })}
          scores={flowScores.scores}
          screens={flow.screens}
        />
      ) : null}

      {flow && !storyListOpen && flowScreenId === CANVAS ? (
        <FlowOverview
          caseId={caseIdHint}
          onSelect={(id) => updateStoryArgs({ screen: id })}
          run={flowScores.run}
          scores={flowScores.scores}
          screens={flow.screens}
          thumbnails={flowScores.thumbnails}
        />
      ) : (
        <>
          <details
            className="verification-context"
            aria-labelledby="verification-story-heading"
            open={!flow || storyListOpen}
          >
            <summary className="verification-label">
              Details: story, version and run
            </summary>
            <div className="verification-context-grid">
              <div className="verification-story-block">
                <h3
                  id="verification-story-heading"
                  className="verification-label"
                >
                  Expected layout (Story)
                </h3>
                <p className="verification-readonly">
                  {currentStoryId || "No story is selected"}
                </p>
              </div>
              {!storyListOpen && !flow && currentTargetChoices.length > 1 ? (
                <label className="verification-field">
                  Verification target
                  <select
                    value={effectiveCurrentIdentityKey}
                    onChange={(event) =>
                      setSelectedCurrentIdentityKey(event.currentTarget.value)
                    }
                  >
                    <option value="">Choose a target</option>
                    {currentTargetChoices.map((choice) => (
                      <option
                        key={identityKey(choice.identity)}
                        value={identityKey(choice.identity)}
                      >
                        {choice.label} · {choice.identity.targetId} ·{" "}
                        {choice.identity.capturePointId}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              {!storyListOpen && currentCaseIds.length > 1 ? (
                <label className="verification-field">
                  Current verification case
                  <select
                    value={effectiveCurrentCaseId}
                    onChange={(event) => {
                      setSelectedCurrentCaseId(event.currentTarget.value);
                      setSelectedCurrentIdentityKey("");
                    }}
                  >
                    <option value="">Choose a case</option>
                    {currentCaseIds.map((caseId) => (
                      <option key={caseId} value={caseId}>
                        {caseId}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              {availableVersions.length > 0 ? (
                <label className="verification-field">
                  Compared version
                  <select
                    value={effectiveVersionKey}
                    onChange={(event) => {
                      setSelectedVersionKey(event.currentTarget.value);
                      setSelectedIdentityKey("");
                    }}
                  >
                    {availableVersions.map((version) => (
                      <option key={version.key} value={version.key}>
                        {versionLabel(version)}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
              {selectedManifestSummary ? (
                <div className="verification-story-block">
                  <p className="verification-label">Captured</p>
                  <p className="verification-readonly">
                    {selectedManifestSummary.createdAt}
                  </p>
                </div>
              ) : null}
            </div>
            {caseIdHint ? (
              <p className="verification-metadata">
                {storyListOpen ? "Current live case: " : "Mapped case: "}
                {caseIdHint}
              </p>
            ) : currentIdentityChoices.length > 0 ? (
              <p className="verification-metadata">
                {storyListOpen
                  ? "The current live story matches an archived entry."
                  : "Archived entries match this story ID or its reference story ID."}
              </p>
            ) : currentStoryId ? (
              <p className="verification-muted">
                No archived verification entries match this story.
              </p>
            ) : null}
            {currentIdentity ? (
              <p className="verification-metadata">
                {storyListOpen
                  ? "Current live identity: "
                  : "Mapped identity: "}
                {formatIdentity(currentIdentity)}
              </p>
            ) : null}
            {storyListOpen ? (
              <>
                <label className="verification-field">
                  Search archived stories
                  <input
                    type="search"
                    value={identitySearch}
                    onChange={(event) =>
                      setIdentitySearch(event.currentTarget.value)
                    }
                    placeholder="Label, case ID, target, capture point, or story ID"
                  />
                </label>
                <fieldset className="verification-story-field">
                  <legend>Archived stories</legend>
                  <div className="verification-story-list">
                    {filteredVersionIdentityChoices.length > 0 ? (
                      filteredVersionIdentityChoices.map((choice) => {
                        const key = identityKey(choice.identity);
                        const isSelected = key === effectiveIdentityKey;
                        return (
                          <button
                            key={key}
                            type="button"
                            aria-pressed={isSelected}
                            className="verification-story-choice"
                            onClick={() => selectArchivedStory(choice)}
                          >
                            <span>{choice.label}</span>
                            <span className="verification-metadata">
                              {choice.identity.targetId} ·{" "}
                              {choice.identity.capturePointId} · {choice.status}{" "}
                              · {choice.storyId}
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <p className="verification-muted">
                        No archived stories in this version.
                      </p>
                    )}
                  </div>
                </fieldset>
                {selectedStoryNavigation?.notice ? (
                  <p className="verification-notice">
                    {selectedStoryNavigation.notice}
                  </p>
                ) : null}
              </>
            ) : null}
          </details>

          {!storyListOpen && !currentStoryId ? (
            <p className="verification-empty">
              Select a story with a verification mapping or open a story list
              for a selected version.
            </p>
          ) : null}
          {!storyListOpen &&
          currentStoryId &&
          currentIdentityChoices.length > 0 &&
          !currentIdentity ? (
            <p className="verification-empty">
              Choose a verification case and target to view its archived
              history.
            </p>
          ) : null}
          {!storyListOpen &&
          currentStoryId &&
          caseIdHint &&
          currentIdentityChoices.length === 0 &&
          !loadingRuns &&
          !historyError ? (
            <p className="verification-empty">
              No archived entries match this verification case.
            </p>
          ) : null}

          {historyError ? (
            <p role="alert" className="verification-error">
              Run history: {historyError}
              <span className="verification-hint">
                {" "}
                Refresh to retry; if it persists, restart Storybook with pnpm
                storybook:workbench.
              </span>
            </p>
          ) : null}
          {loadingRuns ? (
            <p role="status" className="verification-muted">
              Loading archived runs…
            </p>
          ) : null}
          {archiveBase &&
          selectedIdentity &&
          !loadingRuns &&
          !effectiveRunId &&
          !historyError ? (
            <p className="verification-empty">
              No archived runs match this verification identity.
            </p>
          ) : null}

          {manifestError ? (
            <p role="alert" className="verification-error">
              Selected run: {manifestError}
              <span className="verification-hint">
                {" "}
                Refresh to retry; if it persists, restart Storybook with pnpm
                storybook:workbench.
              </span>
            </p>
          ) : null}
          {loadingRun ? (
            <p role="status" className="verification-muted">
              Loading archived evidence…
            </p>
          ) : null}

          {manifest && selectedIdentity ? (
            <>
              <div className="verification-controls">
                <div
                  className="verification-locale-tabs"
                  role="tablist"
                  aria-label="Capture locale"
                >
                  {localeChoices.map((locale) => (
                    <button
                      key={locale}
                      type="button"
                      role="tab"
                      aria-selected={localeKey(localeId) === localeKey(locale)}
                      aria-controls="verification-evidence"
                      onClick={() => setLocaleId(locale)}
                    >
                      {localeLabel(locale)}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="verification-primary"
                  disabled={
                    loadingImages || comparableIds.length === 0 || comparing
                  }
                  onClick={() => void runComparison(comparableIds)}
                >
                  {comparing ? "Comparing…" : "Compare pixels"}
                </button>
              </div>

              {selectedDeclaration?.status === "retired" ? (
                <p className="verification-notice">Retired at capture</p>
              ) : null}
              {provenanceCapture?.provenance.verified === false ? (
                <p className="verification-notice">
                  Capture provenance is unverified
                </p>
              ) : null}
              {provenanceCapture?.provenance.reusedFrom ? (
                <p className="verification-metadata">
                  Reused from {provenanceCapture.provenance.reusedFrom.runId},
                  captured {provenanceCapture.provenance.reusedFrom.capturedAt},
                  app {provenanceCapture.provenance.reusedFrom.appCommit},
                  reference{" "}
                  {provenanceCapture.provenance.reusedFrom.referenceCommit}
                </p>
              ) : null}

              <div id="verification-evidence" role="tabpanel">
                {!selectedLocaleHasEvidence ? (
                  <p className="verification-notice">
                    No archived evidence for {localeLabel(localeId)} in this
                    run. The panel does not substitute another locale.
                  </p>
                ) : (
                  <>
                    <section
                      className="verification-section"
                      aria-label="Status"
                    >
                      <div className="verification-section-heading">
                        <h3>Status</h3>
                        <p className="verification-metadata">
                          Selected locale: {localeLabel(localeId)}
                        </p>
                      </div>
                      <fieldset className="verification-size-tabs">
                        <legend className="verification-visually-hidden">
                          Size, with how far the site differs from the design
                        </legend>
                        {PROFILE_TABS.map((item) => {
                          const comparison = comparisons[item.id];
                          const scored =
                            comparison !== undefined &&
                            comparison !== "running" &&
                            comparison.kind === "compared"
                              ? comparison.ratio
                              : null;
                          const status =
                            scored === null
                              ? profileStatus(captures[item.id], comparison)
                              : {
                                  text: diffLabel(scored),
                                  tone: diffTone(scored),
                                };
                          return (
                            <label
                              key={item.id}
                              className="verification-size-tab"
                              data-checked={item.id === selectedProfile}
                              data-tone={status.tone}
                              title={item.size}
                            >
                              <input
                                checked={item.id === selectedProfile}
                                name="verification-size"
                                onChange={() => setSelectedProfile(item.id)}
                                type="radio"
                                value={item.id}
                              />
                              <span>{item.shortLabel}</span>
                              <strong>{status.text}</strong>
                            </label>
                          );
                        })}
                      </fieldset>
                    </section>

                    {loadingImages ? (
                      <p role="status" className="verification-muted">
                        Loading original screenshots…
                      </p>
                    ) : null}
                    {imageError ? (
                      <p role="alert" className="verification-error">
                        Images: {imageError}
                      </p>
                    ) : null}

                    {PROFILE_TABS.filter(
                      (item) => item.id === selectedProfile,
                    ).map((item) => {
                      const capture = captures[item.id];
                      const urls = imageUrls[item.id];
                      return (
                        <section
                          key={item.id}
                          className="verification-profile"
                          data-profile={item.id}
                          aria-label={`${item.shortLabel} evidence`}
                        >
                          <div className="verification-profile-heading">
                            <h3>{item.shortLabel}</h3>
                            <span className="verification-metadata">
                              {item.size}
                            </span>
                            {capture?.status === "captured" ? (
                              <span
                                className="verification-chip"
                                title="Both images are cropped to the component box and aligned at its top-left corner before comparing."
                              >
                                Anchor{" "}
                                {describeAnchor(
                                  capture.siteRegion,
                                  capture.site,
                                )}
                              </span>
                            ) : null}
                            {capture?.status === "captured" &&
                            capture.reference ? (
                              <button
                                type="button"
                                disabled={
                                  !comparable(item.id) ||
                                  comparisons[item.id] === "running"
                                }
                                onClick={() => void runComparison([item.id])}
                              >
                                {comparisons[item.id] &&
                                comparisons[item.id] !== "running"
                                  ? "Recompare"
                                  : "Compare pixels"}
                              </button>
                            ) : null}
                          </div>
                          {!capture ? (
                            <p role="alert">
                              This run has no outcome for the selected identity
                              and profile.
                            </p>
                          ) : capture.status === "failed" ? (
                            <p role="alert">
                              Capture failed: {capture.failure.message}
                            </p>
                          ) : capture.status === "not-selected" ? (
                            <p className="verification-notice">
                              This profile was not selected
                            </p>
                          ) : (
                            <div className="verification-image-grid">
                              {capture.reference ? (
                                <ImageEvidence
                                  title="Reference"
                                  artifact={capture.reference}
                                  imageUrl={urls?.reference}
                                  cropRegion={capture.referenceRegion}
                                />
                              ) : (
                                <p className="verification-notice">
                                  No matching reference at this viewport. Not
                                  scored at this profile.
                                </p>
                              )}
                              <ImageEvidence
                                title="Site"
                                artifact={capture.site}
                                imageUrl={urls?.site}
                              />
                              {capture.reference ? (
                                <DiffEvidence
                                  comparison={comparisons[item.id]}
                                  canCompare={comparable(item.id)}
                                  aspect={`${anchorOf(capture.siteRegion, capture.site).width} / ${anchorOf(capture.siteRegion, capture.site).height}`}
                                />
                              ) : null}
                            </div>
                          )}
                        </section>
                      );
                    })}
                  </>
                )}
              </div>

              <section
                className="verification-section"
                aria-label="Run provenance"
              >
                <details className="verification-details-toggle">
                  <summary>
                    <h3 className="verification-inline-heading">
                      {manifest.runId}
                    </h3>
                  </summary>
                  <p className="verification-metadata">
                    Run created: {manifest.createdAt}
                  </p>
                  <dl className="verification-provenance">
                    <div>
                      <dt>App checkpoint</dt>
                      <dd>
                        {manifest.checkpoint.app.ref} ·{" "}
                        <span title={manifest.checkpoint.app.commit}>
                          {shortCommit(manifest.checkpoint.app.commit)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>Story reference</dt>
                      <dd>
                        {manifest.checkpoint.reference.ref} ·{" "}
                        <span title={manifest.checkpoint.reference.commit}>
                          {shortCommit(manifest.checkpoint.reference.commit)}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt>Recorded story</dt>
                      <dd>
                        {selectedDeclaration?.storyId ??
                          "Not present in this run"}
                      </dd>
                    </div>
                    <div>
                      <dt>Identity</dt>
                      <dd>{formatIdentity(selectedIdentity)}</dd>
                    </div>
                    <div>
                      <dt>Source capture time</dt>
                      <dd>
                        {provenanceCapture?.provenance.capturedAt ??
                          "Not recorded"}
                      </dd>
                    </div>
                    <div>
                      <dt>Capture source commits</dt>
                      <dd>
                        {provenanceCapture
                          ? `${shortCommit(provenanceCapture.provenance.appCommit)} · ${shortCommit(provenanceCapture.provenance.referenceCommit)}`
                          : "Not recorded"}
                      </dd>
                    </div>
                  </dl>
                </details>
              </section>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
