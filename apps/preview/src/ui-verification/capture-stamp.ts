import type { ProfileId } from "@grade10/ui-verification/model";
import type {
  Approval,
  ApprovalDecision,
  ReferenceRecord,
  VerificationIdentity,
} from "./archive-client";
import { diffTone } from "./FlowPanel";
import type { PixelComparison } from "./pixel-compare";

export type ReferenceFlag =
  | "approved"
  | "changes-requested"
  | "not-approved"
  | "none";

export interface ReferenceStatus {
  flag: ReferenceFlag;
  /** The newest reference the workbench captured at this size and locale. */
  current: ReferenceRecord | null;
  /** The newest decision on the current reference's bytes. */
  currentApproval: Approval | null;
  /** The newest approval at this size and locale, with its captured image. */
  approved: { approval: Approval; reference: ReferenceRecord } | null;
  /** Every decision at this size and locale, newest first. */
  history: Approval[];
}

export const DECISION_LABELS: Readonly<Record<ApprovalDecision, string>> = {
  approved: "Approved",
  "changes-requested": "Changes requested",
};

export const FLAG_LABELS: Readonly<Record<ReferenceFlag, string>> = {
  approved: "Reference approved",
  "changes-requested": "Changes requested",
  "not-approved": "Reference not approved",
  none: "No approved reference",
};

type Scoped = VerificationIdentity & { profileId: ProfileId; locale: string };

function inScope(
  item: Scoped,
  identity: VerificationIdentity,
  profileId: ProfileId,
  locale: string,
): boolean {
  return (
    item.caseId === identity.caseId &&
    item.targetId === identity.targetId &&
    item.capturePointId === identity.capturePointId &&
    item.profileId === profileId &&
    item.locale.toLowerCase() === locale.toLowerCase()
  );
}

// A decision judges reference bytes, so a later capture of the same PNG
// carries it; the newest decision on those bytes is the one that stands.
export function referenceStatus(
  references: readonly ReferenceRecord[],
  approvals: readonly Approval[],
  identity: VerificationIdentity,
  profileId: ProfileId,
  locale: string,
): ReferenceStatus {
  const captured = references
    .filter((item) => inScope(item, identity, profileId, locale))
    .sort((left, right) => right.capturedAt.localeCompare(left.capturedAt));
  const history = approvals
    .filter((item) => inScope(item, identity, profileId, locale))
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const current = captured[0] ?? null;
  const currentApproval = current
    ? (history.find((item) => item.referenceHash === current.image.sha256) ??
      null)
    : null;
  const approval = history.find((item) => item.decision === "approved");
  const approvedReference = approval
    ? captured.find((item) => item.referenceId === approval.referenceId)
    : undefined;
  const approved =
    approval && approvedReference
      ? { approval, reference: approvedReference }
      : null;
  const flag: ReferenceFlag = currentApproval
    ? currentApproval.decision
    : approved
      ? "not-approved"
      : "none";
  return { flag, current, currentApproval, approved, history };
}

// The same red line as a flow screen: past 10% the current reference no
// longer reads as the design that was approved.
export function driftNotice(comparison: PixelComparison | undefined): string {
  if (comparison?.kind === "size-mismatch") {
    return "Reference size changed since approval";
  }
  if (
    comparison?.kind === "compared" &&
    diffTone(comparison.ratio) === "high"
  ) {
    return `Reference drifted ${(comparison.ratio * 100).toFixed(1)}% since approval`;
  }
  return "";
}
