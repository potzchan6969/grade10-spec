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

/** A desktop pixel diff under this share of the region reads as a match. */
const MATCH_RATIO = 0.005;

type FlowScreenRef = FlowParameter["screens"][number];

type ScreenStatus =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "failed" }
  | { kind: "compared"; ratio: number }
  | { kind: "error"; message: string };

/** The panel's own Screen control, so a viewer never leaves Verification. */
export function FlowScreenStrip({
  screens,
  current,
  onSelect,
}: {
  screens: readonly FlowScreenRef[];
  current: string;
  onSelect: (id: string) => void;
}) {
  const ids = [CANVAS, ...screens.map((screen) => screen.id)];
  const index = Math.max(0, ids.indexOf(current));
  const nameOf = (id: string) => {
    const screen = screens.find((item) => item.id === id);
    return screen ? screenLabel(screen) : "Canvas";
  };
  return (
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
        <legend>Screen</legend>
        {ids.map((id) => (
          <label
            className="verification-flow-screen"
            data-checked={id === current}
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
  );
}

function statusOf(status: ScreenStatus): { text: string; tone: string } {
  switch (status.kind) {
    case "loading":
      return { text: "Comparing…", tone: "idle" };
    case "missing":
      return { text: "Not captured", tone: "idle" };
    case "failed":
      return { text: "Capture failed", tone: "warn" };
    case "error":
      return { text: "Comparison failed", tone: "warn" };
    default:
      return status.ratio < MATCH_RATIO
        ? { text: "Matches", tone: "ok" }
        : { text: "Differs", tone: "warn" };
  }
}

function diffText(status: ScreenStatus): string {
  if (status.kind !== "compared") return "-";
  if (status.ratio === 0) return "0%";
  return `${(status.ratio * 100).toFixed(status.ratio < 0.1 ? 2 : 1)}%`;
}

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
 * The Canvas's verification: every screen of the flow from the newest run
 * that holds it, its desktop pair compared in the browser, and a count of how
 * many match, differ or wait for a capture. Nothing is stored.
 */
export function FlowOverview({
  active,
  archiveBase,
  caseId,
  runs,
  screens,
  onSelect,
}: {
  active: boolean;
  archiveBase: string;
  caseId: string;
  runs: readonly VerificationManifest[];
  screens: readonly FlowScreenRef[];
  onSelect: (id: string) => void;
}) {
  const run = useMemo(
    () =>
      runs.find((item) =>
        item.captures.some((capture) => capture.caseId === caseId),
      ),
    [caseId, runs],
  );
  const [statuses, setStatuses] = useState<Record<string, ScreenStatus>>({});

  useEffect(() => {
    if (!active || !run) return;
    const controller = new AbortController();
    const urls: string[] = [];
    setStatuses({});
    for (const screen of screens) {
      const desktop = capturesOf(run, caseId, screen).find(
        (capture) => capture.profileId === "desktop",
      );
      if (!desktop) {
        setStatuses((previous) => ({
          ...previous,
          [screen.id]: { kind: "missing" },
        }));
        continue;
      }
      if (desktop.status !== "captured" || !desktop.reference) {
        setStatuses((previous) => ({
          ...previous,
          [screen.id]: {
            kind: desktop.status === "failed" ? "failed" : "missing",
          },
        }));
        continue;
      }
      const reference = desktop.reference;
      setStatuses((previous) => ({
        ...previous,
        [screen.id]: { kind: "loading" },
      }));
      void (async () => {
        const [siteUrl, referenceUrl] = await Promise.all([
          verifiedPngUrl(archiveBase, desktop.site, controller.signal),
          verifiedPngUrl(archiveBase, reference, controller.signal),
        ]);
        urls.push(siteUrl, referenceUrl);
        const result = await comparePixels({
          referenceUrl,
          siteUrl,
          referenceRegion: desktop.referenceRegion,
          siteRegion: desktop.siteRegion,
        });
        if (result.kind === "compared") urls.push(result.diffUrl);
        if (controller.signal.aborted) return;
        setStatuses((previous) => ({
          ...previous,
          [screen.id]:
            result.kind === "compared"
              ? { kind: "compared", ratio: result.ratio }
              : {
                  kind: "error",
                  message:
                    result.kind === "error"
                      ? result.message
                      : "The two images differ in size.",
                },
        }));
      })().catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setStatuses((previous) => ({
          ...previous,
          [screen.id]: {
            kind: "error",
            message: error instanceof Error ? error.message : String(error),
          },
        }));
      });
    }
    return () => {
      controller.abort();
      for (const url of urls) URL.revokeObjectURL(url);
    };
  }, [active, archiveBase, caseId, run, screens]);

  if (!run) {
    return (
      <p className="verification-empty">
        No run holds this flow yet. Capture it with pnpm ui:verify capture, then
        press Refresh.
      </p>
    );
  }

  const counted = screens.map((screen) =>
    statusOf(statuses[screen.id] ?? { kind: "loading" }),
  );
  const count = (text: string) =>
    counted.filter((item) => item.text === text).length;

  return (
    <section aria-label="Flow overview" className="verification-flow-overview">
      <p className="verification-label">
        Run {run.runId.slice(0, 8)} · app{" "}
        {run.checkpoint.app.commit.slice(0, 7)} · reference{" "}
        {run.checkpoint.reference.commit.slice(0, 7)}
      </p>
      <dl className="verification-flow-counts">
        <div>
          <dt>Screens</dt>
          <dd>{screens.length}</dd>
        </div>
        <div>
          <dt>Match the design</dt>
          <dd>{count("Matches")}</dd>
        </div>
        <div>
          <dt>Differ</dt>
          <dd>{count("Differs")}</dd>
        </div>
        <div>
          <dt>Not captured</dt>
          <dd>{count("Not captured") + count("Capture failed")}</dd>
        </div>
      </dl>
      <table className="verification-flow-table">
        <thead>
          <tr>
            <th scope="col">Screen</th>
            <th scope="col">Step</th>
            <th scope="col">Desktop pixel diff</th>
            <th scope="col">Sizes captured</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {screens.map((screen) => {
            const status = statuses[screen.id] ?? { kind: "loading" as const };
            const { text, tone } = statusOf(status);
            const captured = capturesOf(run, caseId, screen).filter(
              (capture) => capture.status === "captured",
            ).length;
            return (
              <tr key={screen.id}>
                <th scope="row">
                  <button onClick={() => onSelect(screen.id)} type="button">
                    {screen.id}
                  </button>
                </th>
                <td>{screen.name}</td>
                <td>{diffText(status)}</td>
                <td>
                  {captured} of {Object.keys(PROFILES).length}
                </td>
                <td>
                  <span
                    className={`verification-chip verification-chip--${tone}`}
                    title={status.kind === "error" ? status.message : undefined}
                  >
                    {text}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
