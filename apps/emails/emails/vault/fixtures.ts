import type { CaseCancelledProps } from "@/emails/vault/case-cancelled";
import type { CaseDeclinedProps } from "@/emails/vault/case-declined";
import type { CaseExpiredDraftProps } from "@/emails/vault/case-expired-draft";
import type { CaseExpiredUnbookedProps } from "@/emails/vault/case-expired-unbooked";
import type { CaseNoShowProps } from "@/emails/vault/case-no-show";
import type { CaseReleasedProps } from "@/emails/vault/case-released";
import type { CaseVaultedProps } from "@/emails/vault/case-vaulted";
import type { DocumentsSealedProps } from "@/emails/vault/documents-sealed";
import type { ForfeitedProps } from "@/emails/vault/forfeited";
import type { ForfeitureNoticeProps } from "@/emails/vault/forfeiture-notice";
import type { IdentityCheckInvitedProps } from "@/emails/vault/identity-check-invited";
import type { LoanRepaidProps } from "@/emails/vault/loan-repaid";
import type { OfferExpiredProps } from "@/emails/vault/offer-expired";
import type { OfferMadeProps } from "@/emails/vault/offer-made";
import type { PayoutRecordedProps } from "@/emails/vault/payout-recorded";
import type { PayoutReversedProps } from "@/emails/vault/payout-reversed";
import type { RepaymentDueSoonProps } from "@/emails/vault/repayment-due-soon";
import type { RepaymentOverdueProps } from "@/emails/vault/repayment-overdue";
import type { RepaymentRecordedProps } from "@/emails/vault/repayment-recorded";
import type { RepaymentReversedProps } from "@/emails/vault/repayment-reversed";
import type { VisitBookedProps } from "@/emails/vault/visit-booked";
import type { VisitCancelledProps } from "@/emails/vault/visit-cancelled";
import type { VisitMissedProps } from "@/emails/vault/visit-missed";
import type { VisitRescheduledProps } from "@/emails/vault/visit-rescheduled";

/**
 * The fixture every vault letter preview is written over: case `H7K4PQ`, a
 * Rolex Datejust 41 financed for HKD 38,000.00 over 90 days.
 *
 * Instants are ISO, so the letters print them on the shop's clock through
 * `format.ts` rather than carrying a formatted string each. Amounts are
 * integer minor units, always HKD.
 *
 * `VAULT_FIXTURES` below answers one `LetterFacts` member per `NotifyKind` —
 * the application repository's `email/letters/render.test.tsx` reads it back
 * through `external/grade10-spec` to render every kind and compare it
 * against this store's preview. The kinds are `openspec/changes/
 * complete-vault-collector-flow/specs/grade10-site/vault/
 * collector-notifications/spec.md`'s message table: the visit's four, the
 * offer's two, custody's three, the loan's five, falling due's three, the
 * end of a case's five, the paper, and the identity check.
 */

const caseUrl = "https://grade10.com/vault/cases/vc_9f2a7c3d1e";

export const previewCase = {
  id: "vc_9f2a7c3d1e",
  reference: "H7K4PQ",
  itemTitle: "Rolex Datejust 41",
  currency: "HKD",
  url: caseUrl,
  verifyUrl: "https://grade10.com/vault/verify#preview-secret",

  collectorName: "Wing",
  collectorFullName: "Wing-Yan Chu",
  email: "wing.chu@example.com",

  custodianName: "Grade Ten Vault Limited",
  lenderLegalName: "Grade Ten Finance Limited",
  licenceWording:
    "Licensed under the Money Lenders Ordinance, licence no. ML/2026/00142.",
  shopName: "Grade10 Shop, Causeway Bay",
  shopAddress: "Shop 5, 18 Yee Wo Street, Causeway Bay, Hong Kong",
  complaintsContact: "complaints@grade10.com",

  visitAt: "2026-09-16T05:30:00Z",
  movedVisitAt: "2026-09-18T07:00:00Z",
  visitMinutes: 20,

  offerPrincipalMinor: 3_800_000,
  offerTermDays: 90,
  offerInterestMinor: 95_000,
  offerTotalMinor: 3_895_000,
  offerLateDayMinor: 1_000,
  offerExpiresAt: "2026-09-23T10:00:00Z",

  vaultedAt: "2026-09-16T06:15:00Z",

  payoutMinor: 3_800_000,
  payoutAt: "2026-09-17T06:00:00Z",
  dueAt: "2026-12-16T06:00:00Z",
  advanceTotalMinor: 3_895_000,
  advanceLateDayMinor: 1_000,

  repaymentMinor: 1_000_000,
  repaymentAt: "2026-10-20T05:00:00Z",
  repaymentBalanceAfterMinor: 2_895_000,

  reversedPayoutMinor: 3_800_000,
  reversedPayoutAt: "2026-09-19T04:00:00Z",
  reversedPayoutBalanceAfterMinor: 0,

  reversedRepaymentMinor: 600_000,
  reversedRepaymentAt: "2026-10-22T05:00:00Z",
  reversedRepaymentBalanceAfterMinor: 3_895_000,

  dueSoonOutstandingMinor: 3_895_000,
  dueSoonLateDayMinor: 1_000,

  overdueOutstandingMinor: 3_909_000,
  overdueLateInterestMinor: 14_000,
  overdueLateDayMinor: 1_000,
  overdueDays: 14,

  noticeClause: "Clause 9.2 of the loan agreement",
  noticeWrittenAt: "2027-01-15T05:00:00Z",
  noticePayBy: "2027-01-29T05:00:00Z",
  noticeOutstandingMinor: 4_023_000,
  noticeLateDayMinor: 1_000,

  loanRepaidAt: "2026-12-15T05:00:00Z",
  loanRepaidTotalMinor: 3_895_000,

  releasedAt: "2026-12-18T05:00:00Z",

  forfeitedAt: "2027-01-30T05:00:00Z",
  forfeitedSettledMinor: 4_024_000,

  declineReason: "the item's authenticity could not be confirmed",
  declinedAt: "2026-09-16T06:30:00Z",

  cancelledAt: "2026-09-14T03:00:00Z",

  draftKeptUntil: "2026-09-13T03:00:00Z",
  draftExpiredAt: "2026-09-13T03:00:01Z",

  unbookedSubmittedAt: "2026-08-10T03:00:00Z",
  unbookedExpiredAt: "2026-09-09T03:00:00Z",

  noShowVisitAt: "2026-09-16T05:30:00Z",
  noShowExpiredAt: "2026-09-19T03:00:00Z",

  packetId: "pk_4b7e1a90",
  documentsSealedAt: "2026-09-16T06:20:00Z",

  fpsId: "165 2200 7743",
  bankAccount: "004-231-8-847215",

  reminderScheduleAdvance: ["2026-12-09T05:00:00Z", "2026-12-15T05:00:00Z"],
  reminderScheduleDueSoon: ["2026-12-15T05:00:00Z", "2026-12-23T05:00:00Z"],
  reminderScheduleOverdue: ["2027-01-06T05:00:00Z"],
} as const;

export type PreviewCase = typeof previewCase;

/** The how-to-pay block every money message with something outstanding carries. */
export const previewHowToPay = {
  payee: previewCase.lenderLegalName,
  fpsId: previewCase.fpsId,
  bankAccount: previewCase.bankAccount,
  reference: previewCase.reference,
} as const;

/** The case line, directly above the footer of every letter. */
export const previewCaseLine = {
  reference: previewCase.reference,
  itemTitle: previewCase.itemTitle,
} as const;

/**
 * The footer's own lines, widened `EmailFooter`'s `lines` prop. A message
 * naming money names the lender, under its licence; every other message
 * names the custodian.
 */
export function footerLines(party: "lender" | "custodian"): string[] {
  const name =
    party === "lender"
      ? `${previewCase.lenderLegalName}, trading as Grade10. ${previewCase.licenceWording}`
      : `${previewCase.custodianName}, trading as Grade10.`;

  return [
    name,
    previewCase.shopAddress,
    `Complaints: ${previewCase.complaintsContact}.`,
    "Dates and times are Hong Kong time.",
  ];
}

/**
 * The kinds `NOTIFY_KINDS` names (`packages/vault/backend/src/notify/
 * vocabulary.ts`), one per row of the collector-notifications spec's message
 * table: the visit (booked, moved, cancelled, missed), the offer (made,
 * expired), custody (vaulted, released, forfeited), the loan (advance,
 * repayment, two corrections, repaid), falling due (due soon, overdue,
 * notice), the end of a case (declined, cancelled, and the three expiries),
 * the paper, and the identity check.
 */
export type NotifyKind =
  | "identity_check_invited"
  | "visit_booked"
  | "visit_rescheduled"
  | "visit_cancelled"
  | "visit_missed"
  | "offer_made"
  | "offer_expired"
  | "case_vaulted"
  | "payout_recorded"
  | "repayment_recorded"
  | "payout_reversed"
  | "repayment_reversed"
  | "repayment_due_soon"
  | "repayment_overdue"
  | "forfeiture_notice"
  | "loan_repaid"
  | "case_released"
  | "forfeited"
  | "case_declined"
  | "case_cancelled"
  | "case_expired_draft"
  | "case_expired_unbooked"
  | "case_no_show"
  | "documents_sealed";

/**
 * Each kind's own props beyond the case, the case line and the footer, keyed
 * to the letter that takes them. The application repository reads this map
 * back through the submodule to render every kind, so a field dropped or
 * renamed here is a type error rather than a failure in that repository.
 */
export type LetterFacts = {
  identity_check_invited: Required<IdentityCheckInvitedProps>;
  visit_booked: Required<VisitBookedProps>;
  visit_rescheduled: Required<VisitRescheduledProps>;
  visit_cancelled: Required<VisitCancelledProps>;
  visit_missed: Required<VisitMissedProps>;
  offer_made: Required<OfferMadeProps>;
  offer_expired: Required<OfferExpiredProps>;
  case_vaulted: Required<CaseVaultedProps>;
  payout_recorded: Required<PayoutRecordedProps>;
  repayment_recorded: Required<RepaymentRecordedProps>;
  payout_reversed: Required<PayoutReversedProps>;
  repayment_reversed: Required<RepaymentReversedProps>;
  repayment_due_soon: Required<RepaymentDueSoonProps>;
  repayment_overdue: Required<RepaymentOverdueProps>;
  forfeiture_notice: Required<ForfeitureNoticeProps>;
  loan_repaid: Required<LoanRepaidProps>;
  case_released: Required<CaseReleasedProps>;
  forfeited: Required<ForfeitedProps>;
  case_declined: Required<CaseDeclinedProps>;
  case_cancelled: Required<CaseCancelledProps>;
  case_expired_draft: Required<CaseExpiredDraftProps>;
  case_expired_unbooked: Required<CaseExpiredUnbookedProps>;
  case_no_show: Required<CaseNoShowProps>;
  documents_sealed: Required<DocumentsSealedProps>;
};

/**
 * One `LetterFacts` member per `NotifyKind`, each the props its preview
 * passes beyond `previewCase` — the render test supplies that the same way
 * for every kind.
 */
export const VAULT_FIXTURES: LetterFacts = {
  identity_check_invited: {
    visitAt: previewCase.visitAt,
    verifyUrl: previewCase.verifyUrl,
  },
  visit_booked: {
    visitAt: previewCase.visitAt,
  },
  visit_rescheduled: {
    visitAt: previewCase.movedVisitAt,
  },
  visit_cancelled: {},
  visit_missed: {
    visitAt: previewCase.visitAt,
  },
  offer_made: {
    principalMinor: previewCase.offerPrincipalMinor,
    termDays: previewCase.offerTermDays,
    interestMinor: previewCase.offerInterestMinor,
    totalMinor: previewCase.offerTotalMinor,
    lateDayMinor: previewCase.offerLateDayMinor,
    expiresAt: previewCase.offerExpiresAt,
  },
  offer_expired: {
    expiresAt: previewCase.offerExpiresAt,
  },
  case_vaulted: {
    vaultedAt: previewCase.vaultedAt,
  },
  payout_recorded: {
    amountMinor: previewCase.payoutMinor,
    dueAt: previewCase.dueAt,
    totalMinor: previewCase.advanceTotalMinor,
    lateDayMinor: previewCase.advanceLateDayMinor,
  },
  repayment_recorded: {
    amountMinor: previewCase.repaymentMinor,
    balanceAfterMinor: previewCase.repaymentBalanceAfterMinor,
  },
  payout_reversed: {
    amountMinor: previewCase.reversedPayoutMinor,
    balanceAfterMinor: previewCase.reversedPayoutBalanceAfterMinor,
  },
  repayment_reversed: {
    amountMinor: previewCase.reversedRepaymentMinor,
    balanceAfterMinor: previewCase.reversedRepaymentBalanceAfterMinor,
  },
  repayment_due_soon: {
    outstandingMinor: previewCase.dueSoonOutstandingMinor,
    dueAt: previewCase.dueAt,
    lateDayMinor: previewCase.dueSoonLateDayMinor,
  },
  repayment_overdue: {
    outstandingMinor: previewCase.overdueOutstandingMinor,
    dueAt: previewCase.dueAt,
    lateInterestMinor: previewCase.overdueLateInterestMinor,
    lateDayMinor: previewCase.overdueLateDayMinor,
  },
  forfeiture_notice: {
    clause: previewCase.noticeClause,
    payBy: previewCase.noticePayBy,
    outstandingMinor: previewCase.noticeOutstandingMinor,
    lateDayMinor: previewCase.noticeLateDayMinor,
  },
  loan_repaid: {
    repaidAt: previewCase.loanRepaidAt,
    totalMinor: previewCase.loanRepaidTotalMinor,
  },
  case_released: {
    releasedAt: previewCase.releasedAt,
  },
  forfeited: {
    settledMinor: previewCase.forfeitedSettledMinor,
    at: previewCase.forfeitedAt,
  },
  case_declined: {
    reason: previewCase.declineReason,
  },
  case_cancelled: {},
  case_expired_draft: {
    keptUntil: previewCase.draftKeptUntil,
  },
  case_expired_unbooked: {
    submittedAt: previewCase.unbookedSubmittedAt,
  },
  case_no_show: {
    visitAt: previewCase.noShowVisitAt,
  },
  documents_sealed: {
    packetId: previewCase.packetId,
    attachments: ["the loan agreement", "the intake receipt"],
  },
};
