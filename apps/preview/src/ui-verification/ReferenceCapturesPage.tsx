import * as React from "react";
import { useEffect, useState } from "react";
import { useStorybookApi } from "storybook/manager-api";
import { useTheme } from "storybook/theming";
import type { CaptureRun, CaptureStatus } from "./archive-client";
import { getCaptureStatus, requestFullCapture } from "./archive-client";
import { themeVariables } from "./panel-theme";

import "./verification-panel.css";

// The Storybook manager builder compiles this TSX with React.createElement.
void React;

const ARCHIVE_BASE =
  typeof window === "undefined" ? "" : window.location.origin;
/** How often the page asks again while a run is going or waiting. */
const LIVE_REFRESH_MS = 5_000;

const LANE_LABELS: Readonly<Record<CaptureRun["lane"], string>> = {
  full: "Full capture",
  focused: "Focused capture",
};
const TRIGGER_LABELS: Readonly<Record<CaptureRun["trigger"], string>> = {
  deploy: "after a deploy",
  manual: "requested by hand",
  approve: "on approval",
  capture: "from the Approve tab",
};
const STATE_LABELS: Readonly<Record<CaptureRun["state"], string>> = {
  queued: "Queued",
  running: "Running",
  succeeded: "Done",
  failed: "Failed",
};

function shortCommit(value: string | undefined): string {
  return value ? value.slice(0, 9) : "not read yet";
}

function personLabel(person: { subject: string; email?: string }): string {
  return person.email ?? person.subject;
}

function isLive(run: CaptureRun): boolean {
  return run.state === "queued" || run.state === "running";
}

// The coordinator keeps recent runs live; the archive keeps every finished
// one. The live copy wins, so a run shows once.
function allRuns(status: CaptureStatus): CaptureRun[] {
  const byId = new Map<string, CaptureRun>();
  for (const run of status.history.runs) byId.set(run.runId, run);
  for (const run of status.runs) byId.set(run.runId, run);
  return [...byId.values()].sort((left, right) =>
    right.requestedAt.localeCompare(left.requestedAt),
  );
}

function RunProgress({ run }: { run: CaptureRun }) {
  const finished = run.done + run.failed;
  return (
    <section
      className="verification-capture-run"
      aria-label={`${LANE_LABELS[run.lane]} ${run.runId}`}
      data-state={run.state}
    >
      <div className="verification-section-heading">
        <h3>
          {LANE_LABELS[run.lane]}, {TRIGGER_LABELS[run.trigger]}
        </h3>
        <span className="verification-flag" data-flag={run.state}>
          {STATE_LABELS[run.state]}
        </span>
      </div>
      <progress
        aria-label={`${finished} of ${run.total} shots captured`}
        max={Math.max(run.total, 1)}
        value={finished}
      />
      <p className="verification-metadata">
        {run.total === 0
          ? "Reading the cases to capture…"
          : `${finished} of ${run.total} shots${run.failed ? ` · ${run.failed} failed` : ""}`}
      </p>
      <dl className="verification-provenance">
        <div>
          <dt>Commit being captured</dt>
          <dd title={run.commit}>{shortCommit(run.commit)}</dd>
        </div>
        <div>
          <dt>Requested</dt>
          <dd>
            {personLabel(run.requestedBy)} · {run.requestedAt}
          </dd>
        </div>
        {run.startedAt ? (
          <div>
            <dt>Started</dt>
            <dd>{run.startedAt}</dd>
          </div>
        ) : null}
        {run.browser ? (
          <div>
            <dt>Browser</dt>
            <dd>{run.browser}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

export function ReferenceCapturesPage() {
  const theme = useTheme();
  const managerApi = useStorybookApi();
  const [status, setStatus] = useState<CaptureStatus | null>(null);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const [requesting, setRequesting] = useState(false);
  const [requestNote, setRequestNote] = useState("");
  const runs = status ? allRuns(status) : [];
  const live = runs.filter(isLive);

  // biome-ignore lint/correctness/useExhaustiveDependencies: refresh reloads the report on demand
  useEffect(() => {
    const controller = new AbortController();
    void getCaptureStatus(ARCHIVE_BASE, controller.signal)
      .then((value) => {
        if (controller.signal.aborted) return;
        setStatus(value);
        setError("");
      })
      .catch((failure: unknown) => {
        if (!controller.signal.aborted)
          setError(
            failure instanceof Error ? failure.message : "The report failed.",
          );
      });
    return () => controller.abort();
  }, [refresh]);

  // While a run goes or a request waits, the page follows it: each report
  // that still shows one arms the next refresh.
  useEffect(() => {
    if (!status) return;
    const following =
      allRuns(status).some(isLive) || Boolean(status.schedule.pending);
    if (!following) return;
    const timer = setTimeout(
      () => setRefresh((value) => value + 1),
      LIVE_REFRESH_MS,
    );
    return () => clearTimeout(timer);
  }, [status]);

  async function request() {
    setRequesting(true);
    setRequestNote("");
    try {
      const result = await requestFullCapture(ARCHIVE_BASE);
      setRequestNote(
        result.state === "started"
          ? "A full capture started."
          : `A full capture is scheduled for ${result.startsAt}.`,
      );
      setRefresh((value) => value + 1);
    } catch (failure) {
      setRequestNote(
        failure instanceof Error ? failure.message : "The request failed.",
      );
    } finally {
      setRequesting(false);
    }
  }

  return (
    <main
      className="verification-panel verification-page"
      style={themeVariables(theme)}
    >
      <header className="verification-panel-header">
        <h2>Reference captures</h2>
        <div className="verification-inline-actions">
          <button onClick={() => managerApi.navigate("/")} type="button">
            Back to stories
          </button>
          <button
            onClick={() => managerApi.navigate("/verification-dashboard/")}
            type="button"
          >
            Dashboard
          </button>
          <button
            onClick={() => setRefresh((value) => value + 1)}
            type="button"
          >
            Refresh
          </button>
          <button
            className="verification-primary"
            disabled={requesting}
            onClick={() => void request()}
            type="button"
          >
            {requesting ? "Requesting…" : "Request a full capture"}
          </button>
        </div>
      </header>
      {requestNote ? (
        <p className="verification-notice" role="status">
          {requestNote}
        </p>
      ) : null}
      {error ? (
        <p className="verification-error" role="alert">
          Captures: {error}
        </p>
      ) : null}
      {status ? (
        <>
          <section className="verification-section" aria-label="Schedule">
            <h3>Schedule</h3>
            <p className="verification-metadata">
              A full capture starts after each deploy or request, at most once
              every six hours. A focused capture from the Approve tab runs at
              once.
            </p>
            <dl className="verification-provenance">
              <div>
                <dt>Last full capture started</dt>
                <dd>{status.schedule.lastFullStartedAt ?? "Never"}</dd>
              </div>
              <div>
                <dt>Next full capture can start</dt>
                <dd>{status.schedule.nextFullAt}</dd>
              </div>
              <div>
                <dt>Waiting request</dt>
                <dd>
                  {status.schedule.pending
                    ? `${status.schedule.pending.trigger} by ${personLabel(status.schedule.pending.requestedBy)} · ${status.schedule.pending.requestedAt}`
                    : "None"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="verification-section" aria-label="Current runs">
            <h3>Current runs</h3>
            {live.length === 0 ? (
              <p className="verification-muted">No capture is running.</p>
            ) : (
              live.map((run) => <RunProgress key={run.runId} run={run} />)
            )}
          </section>

          <section className="verification-section" aria-label="Run history">
            <h3>Run history</h3>
            {runs.filter((run) => !isLive(run)).length === 0 ? (
              <p className="verification-muted">No capture has finished yet.</p>
            ) : (
              <div className="verification-table-scroll">
                <table className="verification-capture-table">
                  <thead>
                    <tr>
                      <th scope="col">Run</th>
                      <th scope="col">State</th>
                      <th scope="col">Commit</th>
                      <th scope="col">Shots</th>
                      <th scope="col">Finished</th>
                    </tr>
                  </thead>
                  <tbody>
                    {runs
                      .filter((run) => !isLive(run))
                      .map((run) => (
                        <tr key={run.runId} data-state={run.state}>
                          <td>
                            {LANE_LABELS[run.lane]},{" "}
                            {TRIGGER_LABELS[run.trigger]}
                            <div className="verification-metadata">
                              {personLabel(run.requestedBy)}
                            </div>
                          </td>
                          <td>
                            {STATE_LABELS[run.state]}
                            {run.message ? (
                              <div className="verification-metadata">
                                {run.message}
                              </div>
                            ) : null}
                          </td>
                          <td title={run.commit}>{shortCommit(run.commit)}</td>
                          <td>
                            {run.done} of {run.total}
                            {run.failed ? ` · ${run.failed} failed` : ""}
                          </td>
                          <td>{run.finishedAt ?? ""}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      ) : error ? null : (
        <p className="verification-muted" role="status">
          Loading captures…
        </p>
      )}
    </main>
  );
}
