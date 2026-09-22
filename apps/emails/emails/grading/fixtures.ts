import type { PlanSavedProps } from "@/emails/grading/plan-saved";
import type { PlanNudgedProps } from "@/emails/grading/plan-nudged";
import type { PlanExpiredProps } from "@/emails/grading/plan-expired";
import type { DropoffBookedProps } from "@/emails/grading/dropoff-booked";
import type { DropoffMovedProps } from "@/emails/grading/dropoff-moved";
import type { DropoffCancelledProps } from "@/emails/grading/dropoff-cancelled";
import type { DropoffMissedProps } from "@/emails/grading/dropoff-missed";
import type { DropoffReminderProps } from "@/emails/grading/dropoff-reminder";
import type { DropoffDetachedProps } from "@/emails/grading/dropoff-detached";
import type { CheckedInProps } from "@/emails/grading/checked-in";
import type { BatchShippedProps } from "@/emails/grading/batch-shipped";
import type { BatchReestimatedProps } from "@/emails/grading/batch-reestimated";
import type { GradesPostedProps } from "@/emails/grading/grades-posted";
import type { CardNotReturnedProps } from "@/emails/grading/card-not-returned";
import type { CardDamagedProps } from "@/emails/grading/card-damaged";
import type { ReadyProps } from "@/emails/grading/ready";
import type { UncollectedReminderProps } from "@/emails/grading/uncollected-reminder";
import type { StorageStartedProps } from "@/emails/grading/storage-started";
import type { NoticePostedProps } from "@/emails/grading/notice-posted";
import type { CollectedProps } from "@/emails/grading/collected";
import type { CardWithdrawnProps } from "@/emails/grading/card-withdrawn";

/**
 * The fixture every grading preview is written over: submission `5TW8HN`,
 * four cards to PSA Regular, planned on a Saturday in October 2026.
 *
 * Instants are ISO, so the letters print them on the shop's clock through
 * `format.ts` rather than carrying a formatted string each. Amounts are
 * minor units.
 *
 * `GRADING_FIXTURES` below answers one facts member per `NotifyKind` — the
 * application repository's `email/letters/render.test.tsx` reads it back
 * through `external/grade10-spec` to render every kind and compare it
 * against this store's preview. The kinds are `ui-design.md`'s Letters
 * table: the plan's three, the drop-off's six, checked in, the batch's two,
 * the grades' three, ready, the two rungs of waiting to be collected, and
 * the counter's two hand-back receipts.
 */

const submissionUrl = "https://grade10.com/grading/submissions/5TW8HN";

export const previewSubmission = {
  submissionId: "5TW8HN",
  url: submissionUrl,
  startUrl: "https://grade10.com/grading",
  vaultUrl: "https://grade10.com/vault",
  collectorName: "Jasmine",
  collectorFullName: "Jasmine Lam",
  email: "j.lam@example.com",

  grader: "PSA",
  level: "Regular",
  cardCount: 4,
  weeksBack: 5,

  shopName: "Grade10 Shop, Central",
  shopAddress: "Shop 12, 8 Wellington Street, Central, Hong Kong",
  openingHours: "Mon–Sat 11:00–19:00",
  custodianName: "Grade Ten Collectibles Limited",
  complaintsContact: "complaints@grade10.com",
  whatsapp: "+852 9123 4567",

  plannedAt: "2026-10-24T11:25:00Z",
  keptUntil: "2026-11-23T03:00:00Z",
  nudgeDay: "2026-11-14T03:00:00Z",

  visitAt: "2026-10-27T07:00:00Z",
  movedVisitAt: "2026-10-29T09:30:00Z",
  visitMinutes: 20,
  batchCutOff: "2026-10-29T11:00:00Z",
  batchShipDay: "2026-10-30T03:00:00Z",
  batchId: "B-2026-41",
  estimatedBack: "2026-12-04T03:00:00Z",
  reestimatedBack: "2026-12-11T03:00:00Z",

  declaredTotalMinor: 1_520_000,
  feeTotalMinor: 240_000,
  feePerCardMinor: 60_000,
  coverTotalMinor: 22_800,
  paidMethod: "Card",
  paidAt: "2026-10-27T07:12:00Z",
  posReference: "48213",

  courier: "FedEx 7712 3345 9018",
  graderOrder: "88213947",
  graderStage: "Grading",
  graderStageSince: "2026-11-12T03:00:00Z",

  gradesPostedAt: "2026-11-20T02:05:00Z",
  shippedBackAt: "2026-11-23T00:10:00Z",
  readyAt: "2026-11-26T03:40:00Z",

  pickupCode: "4471",
  pickupItems: "4 items · 3 slabs, 1 raw card",
  upchargeMinor: 60_000,
  upchargeCard: "Umbreon VMAX (Alternate Art)",
  upchargeFromLevel: "Regular",
  upchargeToLevel: "Express",
  upchargeCeilingMinor: 1_170_000,
  upchargeValueMinor: 1_500_000,
  idThresholdMinor: 1_000_000,

  reminderDays: ["2026-12-26T03:00:00Z", "2027-01-25T03:00:00Z"],
  storageStartsAt: "2027-02-24T03:00:00Z",
  storageRateMinor: 3_000,
  storageToDateMinor: 36_000,
  noticeDay: "2027-05-25T03:00:00Z",
  noticeEndsAt: "2027-06-24T03:00:00Z",

  collectedAt: "2026-11-28T04:30:00Z",
  settledMinor: 60_000,
  settledPosReference: "51077",
  namedCollector: "Marco Ho",

  notReturnedCard: "Lugia V (Alternate Art)",
  notReturnedIntakeId: "5TW8HN-3",
  notReturnedDeclaredMinor: 360_000,
  notReturnedFeeMinor: 60_000,
  settlementDays: 14,

  withdrawnCard: "Charizard V",
  withdrawnIntakeId: "5TW8HN-4",
  withdrawnFeeMinor: 60_000,
} as const;

/** The footer's values, set. A preview shows them unset on its own. */
export const previewFooter = {
  custodianName: previewSubmission.custodianName,
  shopName: previewSubmission.shopName,
  shopAddress: previewSubmission.shopAddress,
  complaintsContact: previewSubmission.complaintsContact,
};

/** The submission's line, under every letter. */
export const previewSubmissionLine = {
  submissionId: previewSubmission.submissionId,
  cardCount: previewSubmission.cardCount,
  grader: previewSubmission.grader,
  level: previewSubmission.level,
};

/** The four cards as the grades letter lists them. */
export const previewGradedCards = [
  {
    mark: "10",
    name: "Umbreon VMAX (Alternate Art)",
    detail: "PSA 10 GEM MT · cert 98765433",
    note: "Moved up a level",
  },
  {
    mark: "9",
    name: "Pikachu VMAX",
    detail: "PSA 9 MINT · cert 98765434",
  },
  {
    mark: "9",
    name: "Lugia V (Alternate Art)",
    detail: "PSA 9 MINT · cert 98765435",
  },
  {
    mark: "N1",
    name: "Charizard V",
    detail: "Returned ungraded · evidence of trimming",
  },
];

/** What was handed back at the counter. */
export const previewHandedBackCards = [
  {
    mark: "10",
    name: "Umbreon VMAX (Alternate Art)",
    detail: "PSA 10 GEM MT · cert 98765433",
  },
  {
    mark: "9",
    name: "Pikachu VMAX",
    detail: "PSA 9 MINT · cert 98765434",
  },
  {
    mark: "9",
    name: "Lugia V (Alternate Art)",
    detail: "PSA 9 MINT · cert 98765435",
  },
  {
    mark: "N1",
    name: "Charizard V",
    detail: "Returned ungraded, raw in a sleeve with PSA’s note",
  },
];

/**
 * The kinds `ui-design.md`'s Letters table names, one per row of that table
 * (a kind sent twice — `checked_in`, `grades_posted`, `ready` — keeps one
 * entry here; its second preview is a state variant, not a second kind).
 */
export type NotifyKind =
  | "plan_saved"
  | "plan_nudged"
  | "plan_expired"
  | "dropoff_booked"
  | "dropoff_moved"
  | "dropoff_cancelled"
  | "dropoff_missed"
  | "dropoff_reminder"
  | "dropoff_detached"
  | "checked_in"
  | "batch_shipped"
  | "batch_reestimated"
  | "grades_posted"
  | "card_not_returned"
  | "card_damaged"
  | "ready"
  | "uncollected_reminder"
  | "storage_started"
  | "notice_posted"
  | "collected"
  | "card_withdrawn";

/**
 * Each kind's own props, keyed to the letter that takes them. The
 * application repository reads this map back through the submodule to render
 * every kind, so a field dropped or renamed here is a type error rather than
 * a failure in that repository.
 */
export type GradingLetterFacts = {
  plan_saved: Required<PlanSavedProps>;
  plan_nudged: Required<PlanNudgedProps>;
  plan_expired: Required<PlanExpiredProps>;
  dropoff_booked: Required<DropoffBookedProps>;
  dropoff_moved: Required<DropoffMovedProps>;
  dropoff_cancelled: Required<DropoffCancelledProps>;
  dropoff_missed: Required<DropoffMissedProps>;
  dropoff_reminder: Required<DropoffReminderProps>;
  dropoff_detached: Required<DropoffDetachedProps>;
  checked_in: Required<CheckedInProps>;
  batch_shipped: Required<BatchShippedProps>;
  batch_reestimated: Required<BatchReestimatedProps>;
  grades_posted: Required<GradesPostedProps>;
  card_not_returned: Required<CardNotReturnedProps>;
  card_damaged: Required<CardDamagedProps>;
  ready: Required<ReadyProps>;
  uncollected_reminder: Required<UncollectedReminderProps>;
  storage_started: Required<StorageStartedProps>;
  notice_posted: Required<NoticePostedProps>;
  collected: Required<CollectedProps>;
  card_withdrawn: Required<CardWithdrawnProps>;
};

/**
 * One member per `NotifyKind`, each the props its preview passes beyond
 * `previewSubmission`, `previewFooter` and `previewSubmissionLine` — the
 * render test supplies those three the same way for every kind.
 */
export const GRADING_FIXTURES: GradingLetterFacts = {
  plan_saved: {
    plannedAt: previewSubmission.plannedAt,
    keptUntil: previewSubmission.keptUntil,
    nudgeDay: previewSubmission.nudgeDay,
  },
  plan_nudged: {
    plannedAt: previewSubmission.plannedAt,
    keptUntil: previewSubmission.keptUntil,
  },
  plan_expired: {
    plannedAt: previewSubmission.plannedAt,
    keptDays: 30,
  },
  dropoff_booked: {
    visitAt: previewSubmission.visitAt,
  },
  dropoff_moved: {
    visitAt: previewSubmission.visitAt,
    movedVisitAt: previewSubmission.movedVisitAt,
  },
  dropoff_cancelled: {
    visitAt: previewSubmission.visitAt,
  },
  dropoff_missed: {
    visitAt: previewSubmission.visitAt,
  },
  dropoff_reminder: {
    visitAt: previewSubmission.visitAt,
  },
  dropoff_detached: {
    visitAt: previewSubmission.visitAt,
  },
  checked_in: {
    paidAt: previewSubmission.paidAt,
  },
  batch_shipped: {
    shippedOn: previewSubmission.batchShipDay,
  },
  batch_reestimated: {
    estimatedBack: previewSubmission.estimatedBack,
    reestimatedBack: previewSubmission.reestimatedBack,
  },
  grades_posted: {
    gradesPostedAt: previewSubmission.gradesPostedAt,
    backAtShopBy: previewSubmission.readyAt,
    cards: previewGradedCards,
  },
  card_not_returned: {
    card: previewSubmission.notReturnedCard,
    intakeId: previewSubmission.notReturnedIntakeId,
  },
  card_damaged: {
    card: previewSubmission.notReturnedCard,
    intakeId: previewSubmission.notReturnedIntakeId,
  },
  ready: {
    readyAt: previewSubmission.readyAt,
  },
  uncollected_reminder: {
    rungDays: 30,
    nextRungDays: 60,
  },
  storage_started: {
    storageStartsAt: previewSubmission.storageStartsAt,
  },
  notice_posted: {
    noticeDay: previewSubmission.noticeDay,
    noticeDays: 30,
  },
  collected: {
    collectedAt: previewSubmission.collectedAt,
    cards: previewHandedBackCards,
  },
  card_withdrawn: {
    card: previewSubmission.withdrawnCard,
    intakeId: previewSubmission.withdrawnIntakeId,
    withdrawnAt: previewSubmission.batchCutOff,
  },
};
