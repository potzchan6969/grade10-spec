import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { GRADE_CARDS_COPY, GRADED_CARD, SLAB_PHOTO } from "./fixtures";
import {
  type GradingGradeCard,
  GradingGradeCards,
} from "./grading-grade-cards";
import type { GradingCardOutcome, GradingTone } from "./types";

/** The tones `GradingCardRecord`'s stories pin for the same outcomes: an
 * outcome is dressed the same on every page that draws it. */
const OUTCOME_TONES: Readonly<
  Partial<Record<GradingCardOutcome, GradingTone>>
> = {
  "moved-up": "warning",
  ungraded: "error",
  "minimum-not-met": "warning",
  held: "warning",
  "not-returned": "error",
  damaged: "error",
};

/** Each card with a badge reads it in the tone its outcome names, and a card
 * the grader issued no grade for shows none. */
function expectBadges(
  canvasElement: HTMLElement,
  cards: readonly GradingGradeCard[],
) {
  const canvas = within(canvasElement);
  for (const card of cards) {
    if (card.outcome == null || card.outcomeLabel == null) continue;
    expect(canvas.getByText(card.outcomeLabel)).toHaveAttribute(
      "data-variant",
      OUTCOME_TONES[card.outcome],
    );
  }
  if (cards.every((card) => card.grade == null)) {
    expect(
      canvasElement.querySelector('[data-slot="grading-grade-card-grade"]'),
    ).toBeNull();
  }
}

const meta = {
  title: "Grading Submission/GradingGradeCards",
  component: GradingGradeCards,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: GRADE_CARDS_COPY, cards: [GRADED_CARD] },
} satisfies Meta<typeof GradingGradeCards>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The grade, its word, the grader, the card and the certificate
 * (shared-ui-grading-submission-SC-37). */
export const Graded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("9")).toBeInTheDocument();
    expect(canvas.getByText("Mint")).toBeInTheDocument();
    expect(canvas.getByText("Graded by: PSA")).toBeInTheDocument();
    expect(canvas.getByText("Certificate: PSA 84213377")).toBeInTheDocument();
  },
};

/** A collected slab carries the photograph taken at hand-back, beside its
 * grade, grader and certificate (shared-ui-grading-submission-SC-37,
 * shared-ui-grading-submission-SC-70). */
export const Collected: Story = {
  args: {
    cards: [{ ...GRADED_CARD, slabPhotograph: SLAB_PHOTO }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("9")).toBeInTheDocument();
    expect(canvas.getByAltText("Charizard in its slab")).toBeInTheDocument();
  },
};

/** A card the grader moved up a level carries its badge
 * (shared-ui-grading-submission-SC-39, shared-ui-grading-submission-SC-64). */
export const MovedUp: Story = {
  args: {
    cards: [
      {
        ...GRADED_CARD,
        outcome: "moved-up",
        outcomeLabel: "Moved up a level",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectBadges(canvasElement, args.cards);
  },
};

/** Returned ungraded: no grade, the grader's code and note, drawn apart
 * (shared-ui-grading-submission-SC-38, shared-ui-grading-submission-SC-64). */
export const Ungraded: Story = {
  args: {
    cards: [
      GRADED_CARD,
      {
        id: "card_typed",
        name: "Umbreon holo, Japanese promo",
        grader: "PSA",
        outcome: "ungraded",
        outcomeLabel: "Ungraded",
        ungraded: {
          code: "N4",
          note: "Evidence of trimming along the right edge.",
        },
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expectBadges(canvasElement, args.cards);
    const ungraded = canvasElement.querySelector(
      '[data-slot="grading-grade-card-ungraded"]',
    );
    expect(ungraded).not.toBeNull();
    expect(within(ungraded as HTMLElement).queryByText("9")).toBeNull();
    expect(canvas.getByText("Grader’s code: N4")).toBeInTheDocument();
    expect(
      canvas.getByText("Evidence of trimming along the right edge."),
    ).toBeInTheDocument();
  },
};

/** Below its minimum grade: the grade and the badge, and it comes back raw
 * (shared-ui-grading-submission-SC-39, shared-ui-grading-submission-SC-64). */
export const MinimumNotMet: Story = {
  args: {
    cards: [
      {
        ...GRADED_CARD,
        grade: "8",
        gradeLabel: "Near mint to mint",
        outcome: "minimum-not-met",
        outcomeLabel: "Minimum grade not met",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectBadges(canvasElement, args.cards);
  },
};

/** Held by the grader: no grade, the badge and the date it is expected
 * (shared-ui-grading-submission-SC-39, shared-ui-grading-submission-SC-64). */
export const Held: Story = {
  args: {
    cards: [
      {
        id: "card_lugia",
        name: "Lugia first edition",
        grader: "PSA",
        outcome: "held",
        outcomeLabel: "Held by PSA until 12 November",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expectBadges(canvasElement, args.cards);
    expect(
      canvas.getByText("Held by PSA until 12 November"),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-grade-card-grade"]'),
    ).toBeNull();
  },
};

/** Not returned: no grade, the badge, and its payout's own route and the day
 * it was recorded (shared-ui-grading-submission-SC-39,
 * shared-ui-grading-submission-SC-64,
 * grade10-site-grading-submission-lifecycle-SC-41). */
export const NotReturned: Story = {
  args: {
    cards: [
      {
        id: "card_lugia",
        name: "Lugia first edition",
        grader: "PSA",
        outcome: "not-returned",
        outcomeLabel: "Not returned",
        payoutLine: "Settled at $800.00 on 1 Jun 2026, till, its fee refunded",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expectBadges(canvasElement, args.cards);
    expect(
      canvas.getByText(
        "Settled at $800.00 on 1 Jun 2026, till, its fee refunded",
      ),
    ).toBeInTheDocument();
  },
};

/** A card that turned up after its payout was made carries the reversal on
 * its own record, not a grade — the collected page's own reading of
 * `grade10-site-grading-submission-lifecycle-SC-43`. */
export const PayoutReversed: Story = {
  args: {
    cards: [
      {
        id: "card_lugia",
        name: "Lugia first edition",
        grader: "PSA",
        outcome: "not-returned",
        outcomeLabel: "Not returned",
        payoutLine:
          "The card turned up, so the settlement was reversed and the card is back on this submission.",
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/the settlement was reversed/)).toBeInTheDocument();
  },
};

/** Damaged: no grade, and the badge
 * (shared-ui-grading-submission-SC-39, shared-ui-grading-submission-SC-64). */
export const Damaged: Story = {
  args: {
    cards: [
      {
        id: "card_lugia",
        name: "Lugia first edition",
        grader: "PSA",
        outcome: "damaged",
        outcomeLabel: "Damaged",
      },
    ],
  },
  play: async ({ args, canvasElement }) => {
    expectBadges(canvasElement, args.cards);
  },
};
