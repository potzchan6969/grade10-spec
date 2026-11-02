import type {
  ImageArtifact,
  ProfileId,
  VerificationManifest,
} from "@grade10/ui-verification/model";
import { captureLocale } from "@grade10/ui-verification/model";
import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStorybookApi, useStorybookState } from "storybook/manager-api";
import { useTheme } from "storybook/theming";
import type { Approval, ReferenceRecord } from "./archive-client";
import {
  archiveImageUrl,
  captureReference,
  createApproval,
  listApprovals,
  listReferences,
  verifiedPngUrl,
} from "./archive-client";
import type { ReferenceFlag } from "./capture-stamp";
import {
  APPROVE_PANEL,
  type ApprovalBucket,
  approvalBucket,
  BUCKET_LABELS,
  batchPrompt,
  batchTargets,
  buildCases,
  type CaseSize,
  type CompareMode,
  type DashboardCase,
  type DashboardTab,
  type DriftReading,
  type DriftTile,
  driftOf,
  hasSiteDrift,
  type ImagePair,
  isPastTolerance,
  matchesDriftTile,
  needsAttention,
  orderForApprovals,
  orderForSite,
  type PairResult,
  PROFILE_ORDER,
  type PromptContext,
  pairsToCompare,
  readingLong,
  readingShort,
  readingTone,
  SITE_COMPARE_PANEL,
  type StoryStatus,
  settledWithoutPixels,
  siteOf,
  statusOfCase,
  storyPanelHref,
  storyPrompt,
  storyStatuses,
  type Tile,
  worstSite,
} from "./dashboard-model";
import { HIGH_RATIO } from "./FlowPanel";
import { themeVariables } from "./panel-theme";
import { comparePixels } from "./pixel-compare";
import {
  type FullSizeImage,
  FullSizeViewer,
  listAllRuns,
  listEvery,
  localeShortLabel,
} from "./VerificationPanel";

import "./verification-dashboard.css";
import "./verification-panel.css";

// The Storybook manager builder compiles this TSX with React.createElement.
void React;

const ARCHIVE_BASE =
  typeof window === "undefined" ? "" : window.location.origin;
/** Two PNG downloads and a canvas per pair, so only a few run at once. */
const COMPARE_CONCURRENCY = 4;
const TOLERANCE_LABEL = `${HIGH_RATIO * 100}%`;

const FLAG_SHORT: Readonly<Record<ReferenceFlag, string>> = {
  approved: "Approved",
  "not-approved": "Not approved",
  "changes-requested": "Comments",
  none: "No baseline",
};
const FLAG_LONG: Readonly<Record<ReferenceFlag, string>> = {
  approved: "Reference approved",
  "not-approved": "Reference not approved",
  "changes-requested": "Pending comments",
  none: "No approved reference",
};

const STATUS_TILES: readonly {
  key: StoryStatus;
  label: string;
  sub: string;
  tone: string;
}[] = [
  {
    key: "approved",
    label: "Approved",
    sub: "every size approved",
    tone: "ok",
  },
  {
    key: "not-approved",
    label: "Not approved",
    sub: "at least one size not approved",
    tone: "warn",
  },
  {
    key: "none",
    label: "No baseline",
    sub: "New flows not approved before",
    tone: "none",
  },
  {
    key: "changes-requested",
    label: "Pending Comments",
    sub: "a designer asked for a fix at a size",
    tone: "high",
  },
];

const DRIFT_TILES: Readonly<
  Record<
    DashboardTab,
    readonly { key: DriftTile; label: string; sub: string }[]
  >
> = {
  approvals: [
    {
      key: "ref-drift",
      label: `Reference drift over ${TOLERANCE_LABEL}`,
      sub: "newest reference vs last approved",
    },
    {
      key: "ref-size",
      label: "Reference resized",
      sub: "reference region changed size since approval",
    },
  ],
  site: [
    {
      key: "site-drift",
      label: `Site drift over ${TOLERANCE_LABEL}`,
      sub: "site vs the reference it is held to",
    },
    {
      key: "site-size",
      label: "Site resized",
      sub: "site box ≠ reference box",
    },
  ],
};

interface Archive {
  runs: VerificationManifest[];
  references: ReferenceRecord[];
  approvals: Approval[];
}

/** How many placeholder rows stand in for the table before the runs arrive. */
const SKELETON_ROWS = 6;

function Skeleton({ width }: { width?: string }) {
  return (
    <span
      aria-hidden="true"
      className="vd-skeleton"
      style={width ? { width } : undefined}
    />
  );
}

function SkeletonCell({ first }: { first?: boolean }) {
  return (
    <td className="vd-cell" data-first={first || undefined}>
      <Skeleton width="48px" />
    </td>
  );
}

function messageOf(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function isAbort(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function shortCommit(value: string): string {
  return value.slice(0, 9);
}

function storyCount(cases: readonly DashboardCase[]): number {
  return new Set(cases.map((item) => item.storyId)).size;
}

async function comparePair(
  pair: ImagePair,
  signal: AbortSignal,
): Promise<PairResult> {
  const [referenceUrl, otherUrl] = await Promise.all([
    verifiedPngUrl(ARCHIVE_BASE, pair.reference.artifact, signal),
    verifiedPngUrl(ARCHIVE_BASE, pair.other.artifact, signal),
  ]);
  try {
    const result = await comparePixels({
      referenceUrl,
      siteUrl: otherUrl,
      referenceRegion: pair.reference.region,
      siteRegion: pair.other.region,
    });
    if (result.kind === "compared") {
      URL.revokeObjectURL(result.diffUrl);
      return { kind: "compared", ratio: result.ratio };
    }
    return result.kind === "size-mismatch"
      ? { kind: "size-mismatch" }
      : { kind: "error", message: result.message };
  } finally {
    URL.revokeObjectURL(referenceUrl);
    URL.revokeObjectURL(otherUrl);
  }
}

// Ranking needs every number, so the pass covers all pairs rather than the rows
// on screen. A pair is named by its hashes, so a result never goes stale.
function usePairResults(pairs: readonly ImagePair[]) {
  const [results, setResults] = useState<ReadonlyMap<string, PairResult>>(
    new Map(),
  );
  const known = useRef(results);
  known.current = results;
  const pairsKey = pairs.map((pair) => pair.key).join("\n");
  // biome-ignore lint/correctness/useExhaustiveDependencies: pairsKey stands for the pairs
  useEffect(() => {
    const controller = new AbortController();
    const queue = pairs.filter(
      (pair) => !settledWithoutPixels(pair) && !known.current.has(pair.key),
    );
    const work = async () => {
      for (
        let pair = queue.shift();
        pair && !controller.signal.aborted;
        pair = queue.shift()
      ) {
        const { key } = pair;
        try {
          const result = await comparePair(pair, controller.signal);
          if (!controller.signal.aborted) {
            setResults((previous) => new Map(previous).set(key, result));
          }
        } catch (error) {
          if (isAbort(error)) return;
          setResults((previous) =>
            new Map(previous).set(key, {
              kind: "error",
              message: messageOf(error, "The comparison failed."),
            }),
          );
        }
      }
    };
    for (let worker = 0; worker < COMPARE_CONCURRENCY; worker += 1) {
      void work();
    }
    return () => controller.abort();
  }, [pairsKey]);
  return results;
}

/** A dialog image that opens at full size when pressed. */
function OpenableImage({
  url,
  label,
  onOpen,
}: {
  url: string;
  label: string;
  onOpen: (image: FullSizeImage) => void;
}) {
  return (
    <button
      aria-label={`Open ${label} at full size`}
      className="vd-shot-open"
      onClick={() => onOpen({ title: label, url })}
      title="Open at full size"
      type="button"
    >
      <img alt={label} src={url} />
    </button>
  );
}

function ArchiveImage({
  artifact,
  label,
  onOpen,
}: {
  artifact: ImageArtifact;
  label: string;
  onOpen: (image: FullSizeImage) => void;
}) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    let created = "";
    void verifiedPngUrl(ARCHIVE_BASE, artifact, controller.signal)
      .then((value) => {
        created = value;
        setUrl(value);
      })
      .catch((failure: unknown) => {
        if (!isAbort(failure)) {
          setError(messageOf(failure, "The image failed to load."));
        }
      });
    return () => {
      controller.abort();
      if (created) URL.revokeObjectURL(created);
    };
  }, [artifact]);
  if (error) return <p className="vd-shot-note">{error}</p>;
  return url ? (
    <OpenableImage label={label} onOpen={onOpen} url={url} />
  ) : (
    <p className="vd-shot-note">Loading…</p>
  );
}

function PairDiffImage({
  pair,
  label,
  onOpen,
}: {
  pair: ImagePair;
  label: string;
  onOpen: (image: FullSizeImage) => void;
}) {
  const [state, setState] = useState<{ url?: string; note: string }>({
    note: "Comparing…",
  });
  useEffect(() => {
    const controller = new AbortController();
    let created = "";
    let referenceUrl = "";
    let otherUrl = "";
    void (async () => {
      referenceUrl = await verifiedPngUrl(
        ARCHIVE_BASE,
        pair.reference.artifact,
        controller.signal,
      );
      otherUrl = await verifiedPngUrl(
        ARCHIVE_BASE,
        pair.other.artifact,
        controller.signal,
      );
      const result = await comparePixels({
        referenceUrl,
        siteUrl: otherUrl,
        referenceRegion: pair.reference.region,
        siteRegion: pair.other.region,
      });
      if (result.kind === "compared") created = result.diffUrl;
      if (controller.signal.aborted) return;
      setState(
        result.kind === "compared"
          ? { url: result.diffUrl, note: "" }
          : {
              note:
                result.kind === "size-mismatch"
                  ? "The boxes differ in size, so pixels were not compared."
                  : result.message,
            },
      );
    })().catch((failure: unknown) => {
      if (!isAbort(failure)) {
        setState({ note: messageOf(failure, "The comparison failed.") });
      }
    });
    return () => {
      controller.abort();
      for (const url of [created, referenceUrl, otherUrl]) {
        if (url) URL.revokeObjectURL(url);
      }
    };
  }, [pair]);
  return state.url ? (
    <OpenableImage label={label} onOpen={onOpen} url={state.url} />
  ) : (
    <p className="vd-shot-note">{state.note}</p>
  );
}

type Shot =
  | { caption: string; kind: "image"; artifact: ImageArtifact }
  | { caption: string; kind: "diff"; pair: ImagePair }
  | { caption: string; kind: "empty"; note: string }
  | { caption: string; kind: "loading" };

function shotsOf(
  size: CaseSize,
  tab: DashboardTab,
  mode: CompareMode,
  loading: boolean,
): Shot[] {
  const waits = (shot: Shot): Shot =>
    loading ? { caption: shot.caption, kind: "loading" } : shot;
  const image = (caption: string, artifact?: ImageArtifact, note = ""): Shot =>
    artifact
      ? { caption, kind: "image", artifact }
      : { caption, kind: "empty", note };
  const diff = (pair: ImagePair | null, note: string): Shot =>
    pair
      ? { caption: "Pixel diff", kind: "diff", pair }
      : { caption: "Pixel diff", kind: "empty", note };
  if (tab === "approvals") {
    const capture = size.capture?.status === "captured" ? size.capture : null;
    return [
      image(
        "Last approved",
        size.status.approved?.reference.image,
        "No approved reference",
      ),
      image(
        "Current reference",
        size.status.current?.image ?? capture?.reference,
        "No reference captured",
      ),
      diff(size.drift, "Nothing to diff yet"),
    ].map(waits);
  }
  const capture = size.capture?.status === "captured" ? size.capture : null;
  const pair =
    mode === "approved" ? size.siteAgainstApproved : size.siteAgainstRun;
  const held = (shot: Shot) => (mode === "approved" ? waits(shot) : shot);
  return [
    held(
      image(
        mode === "approved" ? "Last approved" : "Current reference",
        pair?.reference.artifact,
        mode === "approved" ? "No approved reference" : "No reference recorded",
      ),
    ),
    image("Site", capture?.site, "Not captured"),
    held(
      diff(pair, capture ? "No approved reference to compare" : "Not captured"),
    ),
  ];
}

function StoryDialog({
  item,
  tab,
  mode,
  loading,
  locale,
  results,
  onClose,
  onApproved,
  onRequested,
  onCopy,
  canCopy,
}: {
  item: DashboardCase;
  tab: DashboardTab;
  mode: CompareMode;
  /** The references and approvals are not in yet. */
  loading: boolean;
  locale: string;
  results: ReadonlyMap<string, PairResult>;
  onClose: () => void;
  onApproved: (result: {
    references: ReferenceRecord[];
    approvals: Approval[];
  }) => void;
  onRequested: (approval: Approval, profile: ProfileId) => void;
  onCopy: () => void;
  canCopy: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestSize, setRequestSize] = useState<ProfileId>("desktop");
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState<"approve" | "request" | null>(null);
  const [error, setError] = useState("");
  const [fullSize, setFullSize] = useState<FullSizeImage | null>(null);
  const allApproved = statusOfCase(item) === "approved";
  const canApprove = tab === "approvals" && !allApproved && !loading;
  const readingWaits = loading && (tab === "approvals" || mode === "approved");
  const trimmed = comment.trim();
  const requestReference = item.sizes[requestSize].status.current;

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  async function run(kind: "approve" | "request", action: () => Promise<void>) {
    setPending(kind);
    setError("");
    try {
      await action();
    } catch (failure) {
      setError(messageOf(failure, "The request failed."));
      setPending(null);
    }
  }

  const approve = () =>
    run("approve", async () => {
      const capture = PROFILE_ORDER.map(
        ({ id }) => item.sizes[id].capture,
      ).find(Boolean);
      onApproved(
        await captureReference(ARCHIVE_BASE, {
          targets: [{ sourceRunId: item.runId, ...item.identity }],
          locale: capture ? captureLocale(capture) : locale,
          approve: true,
        }),
      );
    });

  const request = () =>
    run("request", async () => {
      if (!requestReference) throw new Error("No captured reference to judge.");
      onRequested(
        await createApproval(ARCHIVE_BASE, {
          referenceId: requestReference.referenceId,
          decision: "changes-requested",
          comment: trimmed,
        }),
        requestSize,
      );
    });

  const reasons = PROFILE_ORDER.flatMap(({ id, label }) => {
    const size = item.sizes[id];
    const drift = driftOf(size, results);
    const site = siteOf(size, mode, results);
    return [
      ...(size.status.flag === "approved"
        ? []
        : [
            {
              flag: size.status.flag,
              text: `${label}: ${FLAG_LONG[size.status.flag].toLowerCase()}`,
            },
          ]),
      ...(tab === "approvals" && isPastTolerance(drift)
        ? [{ flag: "drift", text: `${label}: reference ${readingLong(drift)}` }]
        : []),
      ...(tab === "site" && isPastTolerance(site)
        ? [{ flag: "drift", text: `${label}: site ${readingLong(site)}` }]
        : []),
    ];
  });

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Escape closes a modal dialog natively
    <dialog
      aria-labelledby="vd-dialog-title"
      className="vd-dialog"
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      // The full-size image is a dialog inside this one; React hands its close
      // event up here too, and closing it must leave the story open.
      onClose={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      ref={dialog}
    >
      <div className="vd-dialog-frame">
        <header className="vd-dialog-head">
          <div className="vd-dialog-title">
            <div>
              <p className="vd-muted-strong">{item.path}</p>
              <h2 id="vd-dialog-title">{item.name}</h2>
            </div>
            <button
              aria-label="Close story detail"
              className="vd-icon-button"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </div>
          <div className="vd-flags">
            {loading ? (
              <Skeleton width="24ch" />
            ) : reasons.length ? (
              reasons.map((reason) => (
                <span
                  className="verification-flag"
                  data-flag={reason.flag}
                  key={reason.text}
                >
                  {reason.text}
                </span>
              ))
            ) : (
              <span className="verification-flag" data-flag="approved">
                Nothing needs attention
              </span>
            )}
          </div>
        </header>
        <div className="vd-dialog-body">
          {PROFILE_ORDER.map(({ id, label, size: pixels }) => {
            const size = item.sizes[id];
            return (
              <section className="vd-size" key={id}>
                <div className="vd-size-meta">
                  <h3>
                    {label}
                    <span>{pixels}</span>
                  </h3>
                  {loading ? (
                    <Skeleton width="16ch" />
                  ) : (
                    <span
                      className="verification-flag"
                      data-flag={size.status.flag}
                    >
                      {FLAG_LONG[size.status.flag]}
                    </span>
                  )}
                  <p>
                    {tab === "approvals"
                      ? "Reference drift"
                      : `Site vs ${mode === "approved" ? "approved" : "run reference"}`}
                    {readingWaits ? (
                      <Skeleton width="12ch" />
                    ) : (
                      <strong>
                        {readingLong(
                          tab === "approvals"
                            ? driftOf(size, results)
                            : siteOf(size, mode, results),
                        )}
                      </strong>
                    )}
                  </p>
                </div>
                <div className="vd-shots">
                  {shotsOf(size, tab, mode, loading).map((shot) => (
                    <figure key={shot.caption}>
                      <div
                        className="vd-shot"
                        data-loading={shot.kind === "loading" || undefined}
                      >
                        {shot.kind === "image" ? (
                          <ArchiveImage
                            artifact={shot.artifact}
                            label={`${shot.caption} at ${label}`}
                            onOpen={setFullSize}
                          />
                        ) : shot.kind === "diff" ? (
                          <PairDiffImage
                            label={`Pixel diff at ${label}`}
                            onOpen={setFullSize}
                            pair={shot.pair}
                          />
                        ) : shot.kind === "empty" ? (
                          <p className="vd-shot-note">{shot.note}</p>
                        ) : null}
                      </div>
                      <figcaption>{shot.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            );
          })}
          <dl className="vd-identity">
            <div>
              <dt>Story</dt>
              <dd title={item.storyId}>{item.storyId}</dd>
            </div>
            <div>
              <dt>Case</dt>
              <dd title={item.identity.caseId}>{item.identity.caseId}</dd>
            </div>
            <div>
              <dt>Target · capture point</dt>
              <dd>
                {item.identity.targetId} · {item.identity.capturePointId}
              </dd>
            </div>
            <div>
              <dt>Captured</dt>
              <dd>
                {item.capturedAt} · {locale}
              </dd>
            </div>
            <div>
              <dt>App commit</dt>
              <dd title={item.appCommit}>{shortCommit(item.appCommit)}</dd>
            </div>
            <div>
              <dt>Reference commit</dt>
              <dd title={item.referenceCommit}>
                {shortCommit(item.referenceCommit)}
              </dd>
            </div>
          </dl>
        </div>
        <footer className="vd-dialog-foot">
          {error ? (
            <p className="verification-error" role="alert">
              {error}
            </p>
          ) : null}
          {requesting ? (
            <div className="vd-request">
              <div className="vd-field">
                Size
                <fieldset
                  aria-label="Size to request changes on"
                  className="vd-seg"
                >
                  {PROFILE_ORDER.map(({ id, label }) => (
                    <button
                      aria-pressed={requestSize === id}
                      key={id}
                      onClick={() => setRequestSize(id)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </fieldset>
              </div>
              <label className="vd-field vd-grow">
                What should change (required)
                <input
                  maxLength={10000}
                  onChange={(event) =>
                    setComment(
                      event.currentTarget.value.replace(/[\r\n]+/g, " "),
                    )
                  }
                  placeholder="One line for the designer's fix"
                  type="text"
                  value={comment}
                />
              </label>
              <button
                disabled={pending !== null}
                onClick={() => setRequesting(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="verification-primary"
                disabled={
                  pending !== null || trimmed === "" || !requestReference
                }
                onClick={() => void request()}
                type="button"
              >
                {pending === "request" ? "Saving…" : "Send request"}
              </button>
            </div>
          ) : (
            <div className="vd-dialog-actions">
              <p>
                {tab === "site"
                  ? "Nobody approves a site capture. Fix the site, or change the reference in Approve."
                  : loading
                    ? "Approval opens once the references and approvals are in."
                    : allApproved
                      ? "Every size of this story is approved."
                      : `Approve all sizes captures the live story at desktop, tablet and mobile in ${locale}, then approves those images.`}
              </p>
              <div className="verification-inline-actions">
                <button onClick={onClose} type="button">
                  Close
                </button>
                <a
                  className="vd-button"
                  href={storyPanelHref(item.storyId, APPROVE_PANEL)}
                >
                  Open in Approve
                </a>
                {canCopy ? (
                  <button onClick={onCopy} type="button">
                    Copy fix prompt
                  </button>
                ) : null}
                <a
                  className="vd-button"
                  data-primary={tab === "site" || undefined}
                  href={storyPanelHref(item.storyId, SITE_COMPARE_PANEL)}
                >
                  Open in Site Compare
                </a>
                {canApprove ? (
                  <>
                    <button
                      disabled={pending !== null}
                      onClick={() => setRequesting(true)}
                      type="button"
                    >
                      Request changes
                    </button>
                    <button
                      className="verification-primary"
                      disabled={pending !== null}
                      onClick={() => void approve()}
                      type="button"
                    >
                      {pending === "approve"
                        ? "Capturing and approving all sizes…"
                        : "Approve all sizes"}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          )}
        </footer>
      </div>
      {fullSize ? (
        <FullSizeViewer image={fullSize} onClose={() => setFullSize(null)} />
      ) : null}
    </dialog>
  );
}

/** The table's shape before the runs arrive, so the page does not jump. */
function SkeletonRow({
  profiles,
  perSize,
  gridStyle,
}: {
  profiles: readonly ProfileId[];
  perSize: number;
  gridStyle: React.CSSProperties;
}) {
  return (
    <tr className="vd-row" style={gridStyle}>
      <td className="vd-story-cell">
        <span className="vd-story">
          <span aria-hidden="true" className="vd-thumb" data-loading="true" />
          <Skeleton width="26px" />
          <span className="vd-story-text">
            <Skeleton width="14ch" />
            <Skeleton width="20ch" />
          </span>
        </span>
      </td>
      {profiles.flatMap((id) =>
        ["first", "second"]
          .slice(0, perSize)
          .map((slot) => (
            <SkeletonCell first={slot === "first"} key={`${id}-${slot}`} />
          )),
      )}
      <td className="vd-actions">
        <Skeleton width="64px" />
      </td>
    </tr>
  );
}

function Row({
  item,
  rank,
  rankTone,
  profiles,
  tab,
  mode,
  loading,
  results,
  gridStyle,
  onOpen,
  onCopy,
}: {
  item: DashboardCase;
  rank: number;
  rankTone: string;
  profiles: readonly ProfileId[];
  tab: DashboardTab;
  mode: CompareMode;
  /** The references and approvals are not in yet. */
  loading: boolean;
  results: ReadonlyMap<string, PairResult>;
  gridStyle: React.CSSProperties;
  onOpen: () => void;
  onCopy: () => void;
}) {
  const needsApproval = statusOfCase(item) !== "approved";
  // The site held to the run's own reference is the one reading the runs settle alone.
  const siteWaits = loading && mode === "approved";
  const rankWaits = loading && (tab === "approvals" || mode === "approved");
  return (
    <tr className="vd-row" style={gridStyle}>
      <td className="vd-story-cell">
        <button className="vd-story" onClick={onOpen} type="button">
          <span
            aria-hidden="true"
            className="vd-thumb"
            data-loading={loading || undefined}
          >
            {item.thumbnail && !loading ? (
              <img
                alt=""
                loading="lazy"
                src={archiveImageUrl(ARCHIVE_BASE, item.thumbnail)}
              />
            ) : null}
          </span>
          {rankWaits ? (
            <Skeleton width="26px" />
          ) : (
            <span className="vd-rank" data-tone={rankTone}>
              {rank}
            </span>
          )}
          <span className="vd-story-text">
            <span className="vd-story-name">{item.name}</span>
            <span className="vd-story-path">{item.path}</span>
          </span>
        </button>
      </td>
      {profiles.flatMap((id) => {
        const size = item.sizes[id];
        if (loading && tab === "approvals") {
          return [
            <SkeletonCell first key={`${id}-a`} />,
            <SkeletonCell key={`${id}-d`} />,
          ];
        }
        return tab === "approvals"
          ? [
              <ApprovalCell flag={size.status.flag} key={`${id}-a`} />,
              <ReadingCell
                key={`${id}-d`}
                reading={driftOf(size, results)}
                title={`Reference drift: ${readingLong(driftOf(size, results))}`}
              />,
            ]
          : [
              siteWaits ? (
                <SkeletonCell first key={`${id}-s`} />
              ) : (
                <ReadingCell
                  first
                  key={`${id}-s`}
                  reading={siteOf(size, mode, results)}
                  title={`Site drift: ${readingLong(siteOf(size, mode, results))}`}
                />
              ),
              ...(mode === "run" && loading
                ? [<SkeletonCell key={`${id}-r`} />]
                : mode === "run"
                  ? [
                      <td
                        className="vd-cell vd-ref-label"
                        key={`${id}-r`}
                        title={FLAG_LONG[size.status.flag]}
                      >
                        {size.status.flag === "approved" ? "Approved" : ""}
                      </td>,
                    ]
                  : []),
            ];
      })}
      <td className="vd-actions">
        {tab === "approvals" && loading ? <Skeleton width="72px" /> : null}
        {tab === "approvals" && !loading && needsApproval ? (
          <button
            aria-label={`Review the images of ${item.name} to approve`}
            className="verification-primary"
            onClick={onOpen}
            type="button"
          >
            Approve
          </button>
        ) : null}
        {tab === "site" &&
        !siteWaits &&
        hasSiteDrift(item, profiles, mode, results) ? (
          <button
            aria-label={`Copy a fix prompt for ${item.name}`}
            onClick={onCopy}
            title="Copies the drift report and a sample prompt to fix the site"
            type="button"
          >
            Copy prompt
          </button>
        ) : null}
        <a
          className="vd-button"
          href={storyPanelHref(
            item.storyId,
            tab === "site" ? SITE_COMPARE_PANEL : APPROVE_PANEL,
          )}
        >
          {tab === "site" ? "Compare" : "Review"}
        </a>
        <button
          aria-label={`Show details for ${item.name}`}
          onClick={onOpen}
          type="button"
        >
          Details
        </button>
      </td>
    </tr>
  );
}

function ApprovalCell({ flag }: { flag: ReferenceFlag }) {
  return (
    <td
      className="vd-cell"
      data-first="true"
      data-flag={flag}
      title={FLAG_LONG[flag]}
    >
      <span aria-hidden="true" className="vd-dot" />
      {FLAG_SHORT[flag]}
    </td>
  );
}

function ReadingCell({
  reading,
  title,
  first,
}: {
  reading: DriftReading;
  title: string;
  first?: boolean;
}) {
  return (
    <td
      className="vd-cell"
      data-first={first || undefined}
      data-kind={reading.kind}
      data-tone={readingTone(reading)}
      title={title}
    >
      <span>{readingShort(reading)}</span>
    </td>
  );
}

export function VerificationDashboardPage() {
  const theme = useTheme();
  const managerApi = useStorybookApi();
  const { index } = useStorybookState();
  const [archive, setArchive] = useState<Archive | null>(null);
  // The runs draw the rows at once; what the references and approvals decide
  // is drawn as a skeleton until both lists are in.
  const [referencesLoading, setReferencesLoading] = useState(true);
  const [readError, setReadError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [tab, setTab] = useState<DashboardTab>("approvals");
  const [tile, setTile] = useState<Tile | null>(null);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("all");
  const [target, setTarget] = useState("all");
  const [locale, setLocale] = useState("en");
  const [mode, setMode] = useState<CompareMode>("approved");
  const [sizeFocus, setSizeFocus] = useState<ProfileId | "all">("all");
  const [attention, setAttention] = useState(false);
  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(new Set());
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [prompt, setPrompt] = useState<{
    title: string;
    text: string;
    copied: boolean;
  } | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refresh reloads the archive on demand
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const fail = (failure: unknown) => {
      if (isAbort(failure)) return;
      // A partial list must not look complete, so nothing is drawn.
      setArchive(null);
      setReadError(messageOf(failure, "The archive request failed."));
    };
    setReadError("");
    const runs = listAllRuns(ARCHIVE_BASE, "", signal);
    const decisions = Promise.all([
      listEvery(listReferences, ARCHIVE_BASE, "", signal),
      listEvery(listApprovals, ARCHIVE_BASE, "", signal),
    ]);
    // A refresh keeps the last archive whole until the new runs replace it.
    // This then settles before the one below, whichever list answers first.
    void runs
      .then((list) => {
        if (signal.aborted) return;
        setArchive({ runs: list, references: [], approvals: [] });
        setReferencesLoading(true);
      })
      .catch(fail);
    void Promise.all([runs, decisions])
      .then(([list, [references, approvals]]) => {
        if (signal.aborted) return;
        setArchive({ runs: list, references, approvals });
        setReferencesLoading(false);
      })
      .catch(fail);
    return () => controller.abort();
  }, [refresh]);

  const entryOf = (storyId: string) => {
    const entry = index?.[storyId];
    return entry && "title" in entry
      ? { title: entry.title, name: entry.name }
      : undefined;
  };
  // biome-ignore lint/correctness/useExhaustiveDependencies: the index only supplies names
  const cases = useMemo(
    () =>
      archive
        ? buildCases({
            runs: archive.runs,
            references: archive.references,
            approvals: archive.approvals,
            locale,
            entryOf,
          })
        : [],
    [archive, index, locale],
  );
  const pairs = useMemo(() => pairsToCompare(cases, mode), [cases, mode]);
  const results = usePairResults(pairs);

  const locales = useMemo(() => {
    const unique = new Map<string, string>([["en", "en"]]);
    for (const run of archive?.runs ?? []) {
      for (const capture of run.captures) {
        const value = captureLocale(capture);
        unique.set(value.toLowerCase(), value);
      }
    }
    return [...unique.values()];
  }, [archive]);
  const domains = [...new Set(cases.map((item) => item.domain))].sort();
  const targets = [
    ...new Set(cases.map((item) => item.identity.targetId)),
  ].sort();

  const scoped = cases.filter(
    (item) =>
      (domain === "all" || item.domain === domain) &&
      (target === "all" || item.identity.targetId === target),
  );
  const statuses = storyStatuses(scoped);
  const storyTotal = storyCount(scoped);
  const matchesTile = (item: DashboardCase, key: Tile): boolean =>
    key === "approved" ||
    key === "not-approved" ||
    key === "none" ||
    key === "changes-requested"
      ? statuses.get(item.storyId) === key
      : matchesDriftTile(item, key, mode, results);
  const tileCount = (key: Tile) =>
    storyCount(scoped.filter((item) => matchesTile(item, key)));

  const runsLoading = archive === null;
  const loading = runsLoading || referencesLoading;
  // Only the site tiles held to the run's own reference need no reference.
  const tileLoading = (key: Tile) =>
    runsLoading ||
    (referencesLoading && (!key.startsWith("site-") || mode === "approved"));
  // Approvals, and the site held to the last approved reference, rank by what
  // the references decide; until they are in, the rows keep their name order.
  const rankLoading = loading && (tab === "approvals" || mode === "approved");

  // A filter that waits on the references is held until they are in.
  const needle = query.trim().toLowerCase();
  const visible = scoped.filter(
    (item) =>
      (!tile || tileLoading(tile) || matchesTile(item, tile)) &&
      (!attention || rankLoading || needsAttention(item, mode, results)) &&
      (!needle ||
        [item.name, item.storyId, item.identity.caseId, item.path]
          .join(" ")
          .toLowerCase()
          .includes(needle)),
  );

  const profiles: readonly ProfileId[] =
    tab === "site" && sizeFocus !== "all"
      ? [sizeFocus]
      : PROFILE_ORDER.map(({ id }) => id);
  const order = rankLoading
    ? visible
    : tab === "approvals"
      ? orderForApprovals(visible, results, tile === "approved")
      : orderForSite(visible, profiles, mode, results);

  const rankToneOf = (item: DashboardCase): string => {
    if (tab === "site") {
      const worst = worstSite(item, profiles, mode, results);
      if (worst < 0) return "none";
      if (worst > HIGH_RATIO * 100) return "high";
      return worst < 0.5 ? "ok" : "warn";
    }
    if (approvalBucket(item, results) === 0) return "high";
    return approvalBucket(item, results) === 2 ? "warn" : "none";
  };

  const sections: {
    key: string;
    name: string;
    meta: string;
    rows: DashboardCase[];
    header: boolean;
    restartRank: boolean;
  }[] =
    domain !== "all"
      ? [...new Set(scoped.map((item) => item.path))].flatMap((path) => {
          const rows = order.filter((item) => item.path === path);
          if (!rows.length) return [];
          const total = storyCount(scoped.filter((item) => item.path === path));
          const shown = storyCount(rows);
          const needs = storyCount(
            rows.filter((item) => needsAttention(item, mode, results)),
          );
          return [
            {
              key: `path:${path}`,
              name: path,
              meta: `${shown} of ${total} ${total === 1 ? "story" : "stories"}${
                rankLoading
                  ? ""
                  : ` · ${
                      needs
                        ? `${needs} ${needs === 1 ? "needs" : "need"} attention`
                        : "all clear"
                    }`
              }`,
              rows,
              header: true,
              restartRank: true,
            },
          ];
        })
      : tab === "approvals" && !rankLoading
        ? ([0, 1, 2, 3] as ApprovalBucket[]).flatMap((bucket) => {
            const rows = order.filter(
              (item) => approvalBucket(item, results) === bucket,
            );
            if (!rows.length) return [];
            const shown = storyCount(rows);
            return [
              {
                key: `bucket:${bucket}`,
                name: BUCKET_LABELS[bucket],
                meta: `${shown} ${shown === 1 ? "story" : "stories"}`,
                rows,
                header: true,
                restartRank: false,
              },
            ];
          })
        : [
            {
              key: "site",
              name: "",
              meta: "",
              rows: order,
              header: false,
              restartRank: false,
            },
          ];

  const perSize = tab === "site" && mode === "approved" ? 1 : 2;
  const cellColumns =
    tab === "site" && mode === "run"
      ? `repeat(${profiles.length}, minmax(84px, 1fr) 72px)`
      : `repeat(${profiles.length * perSize}, minmax(84px, 1fr))`;
  const actionsWidth = tab === "site" ? 280 : 244;
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `minmax(300px, 2.2fr) ${cellColumns} ${actionsWidth}px`,
  };
  const minWidth = 300 + profiles.length * perSize * 84 + actionsWidth;

  const context: PromptContext = {
    origin: ARCHIVE_BASE,
    locale,
    mode,
    profiles,
    results,
  };
  const targetsForBatch = batchTargets(
    orderForSite(visible, profiles, mode, results),
    context,
  );
  const waiting = storyCount(
    scoped.filter((item) => statusOfCase(item) !== "approved"),
  );
  const siteHigh = storyCount(
    scoped.filter((item) =>
      PROFILE_ORDER.some(({ id }) =>
        isPastTolerance(siteOf(item.sizes[id], mode, results)),
      ),
    ),
  );

  const settled = pairs.map((pair) => settledWithoutPixels(pair));
  const byHash = settled.filter((value) => value?.kind === "compared").length;
  const bySize = settled.filter(
    (value) => value?.kind === "size-mismatch",
  ).length;
  const byPixels = pairs.filter(
    (pair, position) => !settled[position] && results.has(pair.key),
  ).length;
  const settledCount = byHash + bySize + byPixels;

  const selected = cases.find((item) => item.key === selectedKey) ?? null;

  function copyPrompt(title: string, text: string) {
    setPrompt({ title, text, copied: true });
    const failed = () => setPrompt({ title, text, copied: false });
    try {
      navigator.clipboard.writeText(text).catch(failed);
    } catch {
      failed();
    }
  }

  const clearFilters = () => {
    setTile(null);
    setQuery("");
    setAttention(false);
    setDomain("all");
    setTarget("all");
  };

  const shownStories = storyCount(order);
  const filterNote =
    domain !== "all"
      ? `grouped by path in ${domain}, ${tab === "approvals" ? "priority order" : "highest site drift first"} within each`
      : tab === "approvals"
        ? "waiting on a reference approval"
        : "highest site drift first";

  const tiles = (
    defs: readonly { key: Tile; label: string; sub: string; tone?: string }[],
  ) =>
    defs.map((def) => (
      <button
        aria-pressed={tile === def.key}
        className="vd-tile"
        data-tone={def.tone ?? "high"}
        disabled={tileLoading(def.key)}
        key={def.key}
        onClick={() => setTile(tile === def.key ? null : def.key)}
        type="button"
      >
        <span className="vd-tile-count">
          {tileLoading(def.key) ? <Skeleton width="2ch" /> : tileCount(def.key)}
          <span> / {runsLoading ? <Skeleton width="2ch" /> : storyTotal}</span>
        </span>
        <span className="vd-tile-label">{def.label}</span>
        <span className="vd-tile-sub">{def.sub}</span>
      </button>
    ));

  return (
    <main
      className="verification-panel verification-page vd-page"
      style={themeVariables(theme)}
    >
      <header className="vd-header">
        <div>
          <h2>UI Verification Dashboard</h2>
          <p>
            Every story's approval and layout changes, from the newest site run
            of each version. Pixel diffs are worked out in this browser and
            never stored.
          </p>
        </div>
        <div className="verification-inline-actions">
          <button onClick={() => managerApi.navigate("/")} type="button">
            Back to stories
          </button>
          <button
            onClick={() => managerApi.navigate("/reference-captures/")}
            type="button"
          >
            Reference captures
          </button>
          <button
            className="verification-primary"
            onClick={() => setRefresh((value) => value + 1)}
            type="button"
          >
            Refresh
          </button>
        </div>
      </header>

      {readError ? (
        <section className="vd-state" data-state="error" role="alert">
          <h3>The archive did not answer</h3>
          <p>{readError}</p>
          <p>Nothing is shown, so a partial list cannot look complete.</p>
          <button
            className="verification-primary"
            onClick={() => setRefresh((value) => value + 1)}
            type="button"
          >
            Try again
          </button>
        </section>
      ) : !runsLoading && cases.length === 0 ? (
        <section className="vd-state">
          <h3>No site run yet</h3>
          <p>
            The dashboard lists the stories that a site run names. Capture one
            from the application repository, then press Refresh.
          </p>
          <pre>
            pnpm ui:verify capture --selection all --path
            apps/frontend/grade10/src/pages/auctions
          </pre>
        </section>
      ) : (
        <>
          <section aria-label="Approvals" className="vd-group-block">
            <h3>
              Approvals ·{" "}
              {runsLoading ? (
                <Skeleton width="8ch" />
              ) : (
                `${storyTotal} ${storyTotal === 1 ? "story" : "stories"}`
              )}
            </h3>
            <div className="vd-tiles vd-tiles-four">{tiles(STATUS_TILES)}</div>
          </section>

          <section aria-label="Filters" className="vd-filters">
            <label className="vd-field vd-grow">
              Find a story or case
              <input
                onChange={(event) => setQuery(event.currentTarget.value)}
                placeholder="Story title, story id or vc_ case id"
                type="search"
                value={query}
              />
            </label>
            <label className="vd-field">
              Domain
              <select
                onChange={(event) => setDomain(event.currentTarget.value)}
                value={domain}
              >
                <option value="all">All domains</option>
                {domains.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="vd-field">
              Target
              <select
                onChange={(event) => setTarget(event.currentTarget.value)}
                value={target}
              >
                <option value="all">All targets</option>
                {targets.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <div className="vd-field">
              Locale
              <fieldset aria-label="Locale" className="vd-seg">
                {locales.map((value) => (
                  <button
                    aria-pressed={locale === value}
                    key={value}
                    onClick={() => setLocale(value)}
                    type="button"
                  >
                    {localeShortLabel(value)}
                  </button>
                ))}
              </fieldset>
            </div>
            <label className="vd-check">
              <input
                checked={attention}
                disabled={rankLoading}
                onChange={(event) => setAttention(event.currentTarget.checked)}
                type="checkbox"
              />
              Needs attention only
            </label>
          </section>

          <div className="vd-summary-line">
            {runsLoading ? (
              <p>
                <Skeleton width="16ch" />
              </p>
            ) : (
              <p>
                <strong>
                  {shownStories} of {storyTotal}{" "}
                  {storyTotal === 1 ? "story" : "stories"}
                </strong>{" "}
                · {rankLoading ? "in name order" : filterNote}
              </p>
            )}
            {loading ? (
              <p className="vd-progress" role="status">
                Loading the references and approvals
              </p>
            ) : (
              <p className="vd-progress">
                <progress
                  aria-label={`${settledCount} of ${pairs.length} image pairs settled`}
                  max={Math.max(pairs.length, 1)}
                  value={settledCount}
                />
                {settledCount} of {pairs.length} pairs settled · {byHash} by
                matching hash · {bySize} by region size · {byPixels} by pixels
              </p>
            )}
          </div>

          <div aria-label="Dashboard view" className="vd-tabs" role="tablist">
            {(
              [
                [
                  "approvals",
                  "Approvals",
                  loading ? null : `${waiting} waiting`,
                ],
                [
                  "site",
                  "Site drift",
                  tileLoading("site-drift")
                    ? null
                    : `${siteHigh} past ${TOLERANCE_LABEL} or resized`,
                ],
              ] as const
            ).map(([id, label, sub]) => (
              <button
                aria-selected={tab === id}
                key={id}
                onClick={() => setTab(id)}
                role="tab"
                type="button"
              >
                {label}
                <span>{sub ?? <Skeleton width="10ch" />}</span>
              </button>
            ))}
          </div>

          <section className="vd-group-block" aria-label="Drift tiles">
            <h3>
              {tab === "approvals"
                ? "Reference drifts · the story moved since approval"
                : "Site drift · the site moved away from its reference"}
            </h3>
            <div className="vd-tiles">{tiles(DRIFT_TILES[tab])}</div>
          </section>

          {tab === "approvals" ? (
            <p className="vd-muted">
              Reference approvals only; site drift is left out. Unapproved
              references that drifted over {TOLERANCE_LABEL} come first, then
              flows with no baseline, then the other unapproved references.
            </p>
          ) : (
            <div className="vd-site-tools">
              <div className="vd-field">
                Screen size
                <fieldset aria-label="Screen size" className="vd-seg">
                  {(
                    [
                      ["all", "All sizes"],
                      ...PROFILE_ORDER.map(({ id, label }) => [id, label]),
                    ] as [ProfileId | "all", string][]
                  ).map(([id, label]) => (
                    <button
                      aria-pressed={sizeFocus === id}
                      key={id}
                      onClick={() => setSizeFocus(id)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </fieldset>
              </div>
              <div className="vd-field">
                Compare the site with
                <fieldset aria-label="Compare the site with" className="vd-seg">
                  {(
                    [
                      ["approved", "Last approved"],
                      ["run", "Current reference"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      aria-pressed={mode === id}
                      key={id}
                      onClick={() => setMode(id)}
                      type="button"
                    >
                      {label}
                    </button>
                  ))}
                </fieldset>
              </div>
              <p className="vd-muted vd-grow">
                {sizeFocus === "all"
                  ? "Ranked by the highest site drift across all three sizes."
                  : `Ranked by the ${sizeFocus} site drift only.`}
              </p>
              <button
                className="verification-primary"
                disabled={
                  tileLoading("site-drift") || targetsForBatch.length === 0
                }
                onClick={() =>
                  copyPrompt(
                    `Batch prompt for ${targetsForBatch.length} ${
                      targetsForBatch.length === 1 ? "story" : "stories"
                    }`,
                    batchPrompt(targetsForBatch, context),
                  )
                }
                title="Copies every drift past the tolerance in the current filters as one prompt"
                type="button"
              >
                {tileLoading("site-drift")
                  ? "Copy drifts as a prompt"
                  : `Copy ${targetsForBatch.length} ${
                      targetsForBatch.length === 1 ? "drift" : "drifts"
                    } as a prompt`}
              </button>
            </div>
          )}

          {prompt ? (
            <section
              aria-label="Copied prompt"
              className="vd-prompt"
              role="status"
            >
              <div>
                <p>
                  <strong>
                    {prompt.copied
                      ? "Copied to clipboard"
                      : "Could not reach the clipboard, so select the text below"}
                  </strong>{" "}
                  · {prompt.title}
                </p>
                <button onClick={() => setPrompt(null)} type="button">
                  Dismiss
                </button>
              </div>
              <pre>{prompt.text}</pre>
            </section>
          ) : null}

          {note ? (
            <div className="vd-note" role="status">
              <span>{note}</span>
              <button onClick={() => setNote("")} type="button">
                Dismiss
              </button>
            </div>
          ) : null}

          <div className="vd-table-box">
            <table
              aria-label={
                tab === "approvals"
                  ? "Reference approvals by priority"
                  : "Site drift by priority"
              }
              aria-busy={loading || undefined}
              className="vd-table"
              style={{ minWidth }}
            >
              <thead>
                <tr className="vd-row vd-head" style={gridStyle}>
                  <th className="vd-head-story" scope="col">
                    Rank · story
                  </th>
                  {profiles.map((id) => {
                    const profile = PROFILE_ORDER.find(
                      (entry) => entry.id === id,
                    );
                    return (
                      <th
                        className="vd-head-size"
                        key={id}
                        scope="colgroup"
                        style={{ gridColumn: `span ${perSize}` }}
                      >
                        {profile?.label}
                        <span>{profile?.size}</span>
                      </th>
                    );
                  })}
                  <th className="vd-head-story" scope="col">
                    Actions
                  </th>
                  {profiles.flatMap((id) =>
                    (tab === "approvals"
                      ? ["Approval", "Ref drift"]
                      : mode === "run"
                        ? ["Site drift", "Ref"]
                        : ["Site drift"]
                    ).map((label, position) => (
                      <th
                        className="vd-head-cell"
                        data-first={position === 0 || undefined}
                        key={`${id}-${label}`}
                        scope="col"
                      >
                        {label}
                      </th>
                    )),
                  )}
                </tr>
              </thead>
              <tbody>
                {runsLoading
                  ? Array.from({ length: SKELETON_ROWS }, (_, row) => (
                      <SkeletonRow
                        gridStyle={gridStyle}
                        // biome-ignore lint/suspicious/noArrayIndexKey: placeholder rows have no identity
                        key={row}
                        profiles={profiles}
                        perSize={perSize}
                      />
                    ))
                  : null}
                {(() => {
                  let running = 0;
                  return sections.map((section) => {
                    if (section.restartRank) running = 0;
                    const open = !collapsed.has(section.key);
                    return (
                      <React.Fragment key={section.key}>
                        {section.header ? (
                          <tr className="vd-section">
                            <td>
                              <button
                                aria-expanded={open}
                                onClick={() =>
                                  setCollapsed((previous) => {
                                    const next = new Set(previous);
                                    if (open) next.add(section.key);
                                    else next.delete(section.key);
                                    return next;
                                  })
                                }
                                type="button"
                              >
                                <span aria-hidden="true">
                                  {open ? "▾" : "▸"}
                                </span>
                                {section.name}
                              </button>
                              <span>{section.meta}</span>
                            </td>
                          </tr>
                        ) : null}
                        {open
                          ? section.rows.map((item) => {
                              running += 1;
                              return (
                                <Row
                                  gridStyle={gridStyle}
                                  item={item}
                                  key={item.key}
                                  loading={referencesLoading}
                                  mode={mode}
                                  onCopy={() =>
                                    copyPrompt(
                                      `Fix prompt for ${item.name}`,
                                      storyPrompt(item, context),
                                    )
                                  }
                                  onOpen={() => setSelectedKey(item.key)}
                                  profiles={profiles}
                                  rank={running}
                                  rankTone={rankToneOf(item)}
                                  results={results}
                                  tab={tab}
                                />
                              );
                            })
                          : null}
                      </React.Fragment>
                    );
                  });
                })()}
              </tbody>
            </table>
            {!runsLoading && order.length === 0 ? (
              <div className="vd-empty">
                <p>No story matches these filters.</p>
                <button onClick={clearFilters} type="button">
                  Clear filters
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}

      {selected ? (
        <StoryDialog
          canCopy={
            tab === "site" && hasSiteDrift(selected, profiles, mode, results)
          }
          item={selected}
          key={selected.key}
          loading={referencesLoading}
          locale={locale}
          mode={mode}
          onApproved={(result) => {
            setArchive((previous) =>
              previous
                ? {
                    ...previous,
                    references: [...result.references, ...previous.references],
                    approvals: [...result.approvals, ...previous.approvals],
                  }
                : previous,
            );
            setNote(
              `Approved ${selected.name} at desktop, tablet and mobile in ${locale}. The live story was captured and each image's SHA-256 recorded.`,
            );
            setSelectedKey(null);
          }}
          onClose={() => setSelectedKey(null)}
          onCopy={() => {
            copyPrompt(
              `Fix prompt for ${selected.name}`,
              storyPrompt(selected, context),
            );
            setSelectedKey(null);
          }}
          onRequested={(approval, profile) => {
            setArchive((previous) =>
              previous
                ? { ...previous, approvals: [approval, ...previous.approvals] }
                : previous,
            );
            setNote(
              `Requested changes on ${selected.name} at ${profile} in ${locale}.`,
            );
            setSelectedKey(null);
          }}
          results={results}
          tab={tab}
        />
      ) : null}
    </main>
  );
}
