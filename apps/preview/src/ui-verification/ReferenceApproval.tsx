import * as React from "react";
import { useState } from "react";
import {
  DECISION_LABELS,
  FLAG_LABELS,
  type ReferenceStatus,
} from "./capture-stamp";

// The Storybook manager builder compiles this TSX with React.createElement.
void React;

type Pending = "capture" | "approve" | "changes" | null;

function shortCommit(value: string): string {
  return value.slice(0, 9);
}

export function ReferenceFlagChip({ status }: { status: ReferenceStatus }) {
  const decision = status.currentApproval;
  return (
    <span
      className="verification-flag"
      data-flag={status.flag}
      title={
        decision
          ? `${DECISION_LABELS[decision.decision]} by ${decision.approver} · ${decision.createdAt}`
          : undefined
      }
    >
      {FLAG_LABELS[status.flag]}
      {status.approved
        ? ` · ${shortCommit(status.approved.reference.commit)}`
        : ""}
    </span>
  );
}

function statusLine(status: ReferenceStatus): string {
  const { current, currentApproval, approved } = status;
  if (currentApproval) {
    return `${DECISION_LABELS[currentApproval.decision]} by ${currentApproval.approver} · ${currentApproval.createdAt}`;
  }
  if (current && approved) {
    return `The current reference is not approved. The last approval was at commit ${shortCommit(approved.reference.commit)}.`;
  }
  if (current) {
    return "The current reference is not approved yet. Approve it to make it the first baseline.";
  }
  return "No reference captured yet. Approve captures the live story at every size and approves it.";
}

const PENDING_LINES = {
  loading: "Loading the reference and its approvals…",
  failed: "The reference and its approvals did not load. Refresh to retry.",
} as const;

export function ReferenceApproval({
  status,
  pending: recordsPending,
  onCapture,
  onApprove,
  onRequestChanges,
}: {
  status: ReferenceStatus;
  /** The records are not in, so the status is unknown and nothing is offered. */
  pending?: keyof typeof PENDING_LINES;
  onCapture: () => Promise<void>;
  onApprove: (comment: string) => Promise<void>;
  onRequestChanges: (comment: string) => Promise<void>;
}) {
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState<Pending>(null);
  const [error, setError] = useState("");
  const trimmed = comment.trim();
  const busy = pending !== null || recordsPending !== undefined;
  const currentHash = status.current?.image.sha256 ?? "";

  async function run(
    kind: Exclude<Pending, null>,
    action: () => Promise<void>,
  ) {
    setPending(kind);
    setError("");
    try {
      await action();
      if (kind !== "capture") setComment("");
    } catch (failure) {
      setError(
        failure instanceof Error ? failure.message : "The request failed.",
      );
    } finally {
      setPending(null);
    }
  }

  return (
    <section className="verification-approval" aria-label="Approval">
      <h4>Approve the reference</h4>
      <p
        aria-busy={recordsPending === "loading" || undefined}
        className="verification-approval-status"
        data-flag={recordsPending ? "pending" : status.flag}
        role="status"
      >
        {recordsPending ? PENDING_LINES[recordsPending] : statusLine(status)}
      </p>
      {status.currentApproval?.comment ? (
        <blockquote>{status.currentApproval.comment}</blockquote>
      ) : null}
      <label className="verification-field">
        Comment
        <input
          maxLength={10000}
          onChange={(event) =>
            setComment(event.currentTarget.value.replace(/[\r\n]+/g, " "))
          }
          placeholder="Required to request changes"
          type="text"
          value={comment}
        />
      </label>
      <div className="verification-inline-actions">
        <button
          className="verification-primary"
          disabled={busy}
          onClick={() => void run("approve", () => onApprove(trimmed))}
          type="button"
        >
          {pending === "approve"
            ? "Capturing and approving all sizes…"
            : "Approve all sizes"}
        </button>
        <button
          disabled={busy || !status.current || trimmed === ""}
          onClick={() => void run("changes", () => onRequestChanges(trimmed))}
          type="button"
        >
          {pending === "changes" ? "Saving…" : "Request changes"}
        </button>
        <button
          disabled={busy}
          onClick={() => void run("capture", onCapture)}
          type="button"
        >
          {pending === "capture"
            ? "Capturing all sizes…"
            : "Capture current reference"}
        </button>
      </div>
      {error ? (
        <p role="alert" className="verification-error">
          Approval: {error}
        </p>
      ) : null}
      {status.history.length > 0 ? (
        <div className="verification-approval-history">
          <h5 className="verification-label">Approval history, newest first</h5>
          <ol>
            {status.history.map((approval) => (
              <li key={approval.approvalId} data-decision={approval.decision}>
                <strong>{DECISION_LABELS[approval.decision]}</strong>
                <span>
                  {approval.referenceHash === currentHash
                    ? "current reference"
                    : `sha256 ${approval.referenceHash.slice(0, 8)}`}
                </span>
                <span className="verification-metadata">
                  {approval.approver} · {approval.createdAt}
                  {approval.comment ? ` · “${approval.comment}”` : ""}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <p className="verification-hint">
        Approve and Capture render the live story at desktop, tablet and mobile
        in this locale, in this workbench, and store each image; Approve then
        approves all three. Request changes judges this size.
        {status.current
          ? ` The current reference was captured at commit ${shortCommit(status.current.commit)}${status.current.verified ? "" : " from a checkout with uncommitted changes"}.`
          : ""}
      </p>
    </section>
  );
}
