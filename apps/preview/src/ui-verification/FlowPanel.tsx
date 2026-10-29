import type {
  CaptureOutcome,
  VerificationManifest,
} from "@grade10/ui-verification/model";
import { PROFILES } from "@grade10/ui-verification/model";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { verifiedPngUrl } from "./archive-client";
import { CANVAS, type FlowParameter, screenLabel } from "./flow-tree";
import { comparePixels } from "./pixel-compare";

// The Storybook manager builder compiles this TSX with React.createElement.
void React;

/** A pixel diff under this share of the region reads as a match. */
const MATCH_RATIO = 0.005;
/** Over this share the screen reads as broken, in red. */
const HIGH_RATIO = 0.2;

export type DiffTone = "ok" | "warn" | "high";

export function diffTone(ratio: number): DiffTone {
  if (ratio > HIGH_RATIO) return "high";
  return ratio < MATCH_RATIO ? "ok" : "warn";
}

export function diffLabel(ratio: number): string {
  if (ratio === 0) return "Diff 0%";
  return `Diff ${(ratio * 100).toFixed(1)}%`;
}

type FlowScreenRef = FlowParameter["screens"][number];

export type ScreenScore =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "failed" }
  | { kind: "compared"; ratio: number }
  | { kind: "error"; message: string };

function capturesOf(
  run: VerificationManifest | undefined,
  caseId: string,
  screen: FlowScreenRef,
): CaptureOutcome[] {
  return (
    run?.captures.filter(
      (capture) =>
        capture.caseId === caseId &&
        capture.capturePointId === screen.capturePointId,
    ) ?? []
  );
}

/**
 * Each screen from the newest run that captured it, its desktop pair
 * compared in the browser. A run that retried other screens records this
 * one as not selected, so it is passed over. Nothing is stored.
 */
export function useFlowScores({
  active,
  archiveBase,
  caseId,
  runs,
  screens,
}: {
  active: boolean;
  archiveBase: string;
  caseId: string;
  runs: readonly VerificationManifest[];
  screens: readonly FlowScreenRef[] | undefined;
}) {
  const runOf = useMemo(
    () =>
      Object.fromEntries(
        (screens ?? []).flatMap((screen) => {
          const run = runs.find((item) =>
            capturesOf(item, caseId, screen).some(
              (capture) => capture.status !== "not-selected",
            ),
          );
          return run ? [[screen.id, run]] : [];
        }),
      ) as Record<string, VerificationManifest>,
    [caseId, runs, screens],
  );
  const [scores, setScores] = useState<Record<string, ScreenScore>>({});
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});

  useEffect(() => {
    setScores({});
    setThumbnails({});
    if (!active || !screens) return;
    const controller = new AbortController();
    const urls: string[] = [];
    const score = (id: string, value: ScreenScore) => {
      if (!controller.signal.aborted)
        setScores((previous) => ({ ...previous, [id]: value }));
    };
    for (const screen of screens) {
      const desktop = capturesOf(runOf[screen.id], caseId, screen).find(
        (capture) => capture.profileId === "desktop",
      );
      if (desktop?.status !== "captured" || !desktop.reference) {
        score(screen.id, {
          kind: desktop?.status === "failed" ? "failed" : "missing",
        });
        continue;
      }
      const reference = desktop.reference;
      score(screen.id, { kind: "loading" });
      void (async () => {
        const [siteUrl, referenceUrl] = await Promise.all([
          verifiedPngUrl(archiveBase, desktop.site, controller.signal),
          verifiedPngUrl(archiveBase, reference, controller.signal),
        ]);
        urls.push(siteUrl, referenceUrl);
        if (!controller.signal.aborted)
          setThumbnails((previous) => ({ ...previous, [screen.id]: siteUrl }));
        const result = await comparePixels({
          referenceUrl,
          siteUrl,
          referenceRegion: desktop.referenceRegion,
          siteRegion: desktop.siteRegion,
        });
        if (result.kind === "compared") urls.push(result.diffUrl);
        score(
          screen.id,
          result.kind === "compared"
            ? { kind: "compared", ratio: result.ratio }
            : {
                kind: "error",
                message:
                  result.kind === "error"
                    ? result.message
                    : "The two images differ in size.",
              },
        );
      })().catch((error: unknown) => {
        score(screen.id, {
          kind: "error",
          message: error instanceof Error ? error.message : String(error),
        });
      });
    }
    return () => {
      controller.abort();
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [active, archiveBase, caseId, runOf, screens]);

  return { runOf, scores, thumbnails };
}

function scoreText(score: ScreenScore | undefined): string {
  switch (score?.kind) {
    case "compared":
      return diffLabel(score.ratio);
    case "missing":
      return "Not captured";
    case "failed":
      return "Capture failed";
    case "error":
      return "Comparison failed";
    default:
      return "Comparing…";
  }
}

function scoreTone(score: ScreenScore | undefined): DiffTone | "idle" {
  if (score?.kind === "compared") return diffTone(score.ratio);
  return score?.kind === "failed" || score?.kind === "error" ? "warn" : "idle";
}

/**
 * The panel's own Screen control, so a viewer never leaves Verification: one
 * button per screen, wrapping onto more lines when the flow is long, each
 * coloured by its score.
 */
export function FlowScreenControl({
  screens,
  scores,
  current,
  onSelect,
}: {
  screens: readonly FlowScreenRef[];
  scores: Record<string, ScreenScore>;
  current: string;
  onSelect: (id: string) => void;
}) {
  const ids = [CANVAS, ...screens.map((screen) => screen.id)];
  const index = Math.max(0, ids.indexOf(current));
  const nameOf = (id: string) => {
    const screen = screens.find((item) => item.id === id);
    if (!screen) return `Canvas - all ${screens.length} screens`;
    const score = scores[id];
    return score?.kind === "compared"
      ? `${screenLabel(screen)} · ${diffLabel(score.ratio)}`
      : screenLabel(screen);
  };
  return (
    <div className="verification-flow-select">
      <div className="verification-flow-strip">
        <button
          aria-label={
            index > 0 ? `Previous: ${nameOf(ids[index - 1])}` : "Previous"
          }
          className="verification-icon-button"
          disabled={index === 0}
          onClick={() => onSelect(ids[index - 1])}
          type="button"
        >
          ‹
        </button>
        <fieldset className="verification-flow-screens">
          <legend className="verification-visually-hidden">Screen</legend>
          {ids.map((id) => (
            <label
              className="verification-flow-screen"
              data-checked={id === current}
              data-tone={id === CANVAS ? undefined : scoreTone(scores[id])}
              key={id}
              title={nameOf(id)}
            >
              <input
                checked={id === current}
                name="verification-flow-screen"
                onChange={() => onSelect(id)}
                type="radio"
                value={id}
              />
              {id === CANVAS ? "Canvas" : id}
            </label>
          ))}
        </fieldset>
        <button
          aria-label={
            index < ids.length - 1 ? `Next: ${nameOf(ids[index + 1])}` : "Next"
          }
          className="verification-icon-button"
          disabled={index === ids.length - 1}
          onClick={() => onSelect(ids[index + 1])}
          type="button"
        >
          ›
        </button>
      </div>
      <p
        className="verification-flow-current"
        data-tone={
          ids[index] === CANVAS ? undefined : scoreTone(scores[ids[index]])
        }
      >
        {nameOf(ids[index])}
      </p>
    </div>
  );
}

/** The Canvas's verification: every screen as a row, scored and counted. */
export function FlowOverview({
  caseId,
  runOf,
  scores,
  thumbnails,
  screens,
  onSelect,
}: {
  caseId: string;
  runOf: Record<string, VerificationManifest>;
  scores: Record<string, ScreenScore>;
  thumbnails: Record<string, string>;
  screens: readonly FlowScreenRef[];
  onSelect: (id: string) => void;
}) {
  const used = [
    ...new Map(
      Object.values(runOf).map((run) => [run.runId, run] as const),
    ).values(),
  ].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  if (used.length === 0) {
    return (
      <p className="verification-empty">
        No run holds this flow yet. Capture it with pnpm ui:verify capture, then
        press Refresh.
      </p>
    );
  }

  const tones = screens.map((screen) => scoreTone(scores[screen.id]));
  const ratios = screens.flatMap((screen) => {
    const score = scores[screen.id];
    return score?.kind === "compared" ? [score.ratio] : [];
  });
  const missing = screens.filter((screen) => {
    const kind = scores[screen.id]?.kind;
    return kind === "missing" || kind === "failed";
  }).length;
  const high = tones.filter((tone) => tone === "high").length;

  return (
    <section aria-label="Flow overview" className="verification-flow-overview">
      <dl className="verification-flow-counts">
        <div>
          <dd>{screens.length}</dd>
          <dt>Screens</dt>
        </div>
        <div data-tone="ok">
          <dd>{ratios.filter((ratio) => ratio < MATCH_RATIO).length}</dd>
          <dt>Match</dt>
        </div>
        <div data-tone={high > 0 ? "high" : "warn"}>
          <dd>{ratios.filter((ratio) => ratio >= MATCH_RATIO).length}</dd>
          <dt>{high > 0 ? `Differ, ${high} over 20%` : "Differ"}</dt>
        </div>
        <div>
          <dd>{missing}</dd>
          <dt>Missing</dt>
        </div>
      </dl>
      <p className="verification-metadata">
        {used.length === 1 ? "Run" : "Runs"}{" "}
        {used
          .map(
            (run) =>
              `${run.runId.slice(0, 8)} (app ${run.checkpoint.app.commit.slice(0, 7)}, reference ${run.checkpoint.reference.commit.slice(0, 7)})`,
          )
          .join(" · ")}
      </p>
      <ul className="verification-flow-list">
        {screens.map((screen, index) => {
          const score = scores[screen.id];
          const run = runOf[screen.id];
          const captured = capturesOf(run, caseId, screen).filter(
            (capture) => capture.status === "captured",
          ).length;
          return (
            <li key={screen.id}>
              <button
                data-tone={tones[index]}
                onClick={() => onSelect(screen.id)}
                title={score?.kind === "error" ? score.message : undefined}
                type="button"
              >
                <span aria-hidden="true" className="verification-flow-thumb">
                  {thumbnails[screen.id] ? (
                    <img alt="" src={thumbnails[screen.id]} />
                  ) : null}
                </span>
                <span className="verification-flow-row">
                  <span className="verification-flow-name">
                    <strong>{screen.id}</strong>
                    <span>{screen.name}</span>
                  </span>
                  <span className="verification-flow-score">
                    {scoreText(score)}
                  </span>
                  <span className="verification-metadata">
                    {captured} of {Object.keys(PROFILES).length} sizes captured
                    {run && used.length > 1
                      ? ` · run ${run.runId.slice(0, 8)}`
                      : ""}
                  </span>
                </span>
                <span aria-hidden="true">›</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
