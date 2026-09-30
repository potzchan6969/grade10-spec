import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  BACK_PHOTO,
  CARD_RECORD_COPY,
  FRONT_PHOTO,
  RECORD_BASE,
  SLAB_PHOTO,
} from "./fixtures";
import {
  GradingCardRecord,
  type GradingRecordCard,
} from "./grading-card-record";
import type { GradingCardOutcome, GradingTone } from "./types";

/** The tone each outcome's badge reads in, written out here so a change to
 * the block's one map is a change a story shows. */
const OUTCOME_TONES: Readonly<Record<GradingCardOutcome, GradingTone>> = {
  listed: "outline",
  "handed-in": "outline",
  refused: "error",
  withdrawn: "default",
  graded: "success",
  "moved-up": "warning",
  ungraded: "error",
  "minimum-not-met": "warning",
  held: "warning",
  "not-returned": "error",
  damaged: "error",
  collected: "default",
  vaulted: "default",
};

/** Each card reads the badge and the line it was given, the badge in the
 * tone the block's map gives its outcome. */
function expectOutcomes(
  canvasElement: HTMLElement,
  cards: readonly GradingRecordCard[],
) {
  const canvas = within(canvasElement);
  for (const card of cards) {
    expect(canvas.getByText(card.outcomeLabel)).toHaveAttribute(
      "data-variant",
      OUTCOME_TONES[card.outcome],
    );
    expect(canvas.getByText(card.outcomeLine)).toBeInTheDocument();
  }
}

const HANDED_IN = {
  ...RECORD_BASE,
  intakeId: "GR-2026-0619-004",
  outcome: "handed-in" as const,
  outcomeLabel: "Handed in",
  outcomeLine: "With us, photographed front and back.",
  photographs: { front: FRONT_PHOTO, back: BACK_PHOTO },
};

const meta = {
  title: "Grading Submission/GradingCardRecord",
  component: GradingCardRecord,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: CARD_RECORD_COPY,
    cards: [RECORD_BASE],
    locale: "en",
  },
} satisfies Meta<typeof GradingCardRecord>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Still listed: the card as planned, with no intake id
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const Listed: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expectOutcomes(canvasElement, args.cards);
    expect(canvas.getByText("Listed")).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-card-record-intake"]'),
    ).toBeNull();
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** Handed in: the intake id and the photograph pair, and no control
 * (shared-ui-grading-submission-SC-34, shared-ui-grading-submission-SC-35,
 * shared-ui-grading-submission-SC-64). */
export const HandedIn: Story = {
  args: { cards: [HANDED_IN] },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expectOutcomes(canvasElement, args.cards);
    expect(canvas.getByText("Intake id: GR-2026-0619-004")).toBeInTheDocument();
    expect(canvas.getByAltText("Charizard, front")).toBeInTheDocument();
    expect(canvas.getByAltText("Charizard, back")).toBeInTheDocument();
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** A minimum grade reads on the card's set line, and no control changes the
 * card (shared-ui-grading-submission-SC-34). */
export const MinimumGrade: Story = {
  args: { cards: [{ ...HANDED_IN, minimumGrade: "PSA 9" }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Base Set · 4/102 · Minimum grade: PSA 9"),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** Refused at the counter: the staff's words as typed, never charged
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const RefusedAtTheCounter: Story = {
  args: {
    cards: [
      {
        ...RECORD_BASE,
        outcome: "refused",
        outcomeLabel: "Refused at the counter",
        outcomeLine:
          "Trimmed edges, visible under the loupe. Nothing was charged for this card.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};

/** Withdrawn: the refund
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const Withdrawn: Story = {
  args: {
    cards: [
      {
        ...RECORD_BASE,
        outcome: "withdrawn",
        outcomeLabel: "Withdrawn",
        outcomeLine: "HK$250 refunded the way you paid it.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};

/** Graded: the grade in the grader's words, and the certificate against the
 * address it was given (shared-ui-grading-submission-SC-35,
 * shared-ui-grading-submission-SC-36, shared-ui-grading-submission-SC-64). */
export const Graded: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        outcome: "graded",
        outcomeLabel: "PSA 9, Mint",
        outcomeLine: "Graded by PSA on 13 September.",
        certificate: "84213377",
        lookupHref: "https://www.psacard.com/cert/84213377",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expectOutcomes(canvasElement, args.cards);
    expect(canvas.getByText("Certificate: 84213377")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Look it up" })).toHaveAttribute(
      "href",
      "https://www.psacard.com/cert/84213377",
    );
  },
};

/** Moved up a level: the difference due before collection
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const MovedUpALevel: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        outcome: "moved-up",
        outcomeLabel: "Moved up a level",
        outcomeLine: "HK$300 due before collection.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};

/** Ungraded: the grader's code and note, and that the fee stands
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const Ungraded: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        outcome: "ungraded",
        outcomeLabel: "Ungraded",
        outcomeLine: "N4, evidence of trimming. The fee still stands.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};

/** Minimum grade not met: back raw, and the fee stands
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const MinimumGradeNotMet: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        minimumGrade: "PSA 9",
        outcome: "minimum-not-met",
        outcomeLabel: "Minimum grade not met",
        outcomeLine: "It comes back raw. The fee still stands.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};

/** Held by the grader: the day it is expected
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const HeldByTheGrader: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        outcome: "held",
        outcomeLabel: "Held by the grader",
        outcomeLine: "PSA expects to return it by 12 November.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};

/** Not returned: the payout
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const NotReturned: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        outcome: "not-returned",
        outcomeLabel: "Not returned",
        outcomeLine: "HK$3,800 paid out at your declared value.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};

/** Damaged: the payout
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const Damaged: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        outcome: "damaged",
        outcomeLabel: "Damaged",
        outcomeLine: "HK$3,800 paid out at your declared value.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};

/** Collected: the grade, the grader, the certificate and the slab
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const Collected: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        outcome: "collected",
        outcomeLabel: "Collected",
        outcomeLine: "Back with you on 20 September, PSA 9.",
        certificate: "84213377",
        lookupHref: "https://www.psacard.com/cert/84213377",
        slabPhotograph: SLAB_PHOTO,
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expectOutcomes(canvasElement, args.cards);
    expect(canvas.getByAltText("Charizard in its slab")).toBeInTheDocument();
  },
};

/** Vaulted: the vault case it opened
 * (shared-ui-grading-submission-SC-35, shared-ui-grading-submission-SC-64). */
export const Vaulted: Story = {
  args: {
    cards: [
      {
        ...HANDED_IN,
        outcome: "vaulted",
        outcomeLabel: "Vaulted",
        outcomeLine: "It opened vault case VC-1182.",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectOutcomes(canvasElement, args.cards);
  },
};
