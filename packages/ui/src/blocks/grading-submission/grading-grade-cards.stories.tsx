import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { GRADE_CARDS_COPY, GRADED_CARD } from "./fixtures";
import { GradingGradeCards } from "./grading-grade-cards";

const meta = {
  title: "Grading Submission/GradingGradeCards",
  component: GradingGradeCards,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: GRADE_CARDS_COPY, cards: [GRADED_CARD] },
} satisfies Meta<typeof GradingGradeCards>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The grade, its word, the grader, the card and the certificate. */
export const Graded: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("9")).toBeInTheDocument();
    expect(canvas.getByText("Mint")).toBeInTheDocument();
    expect(canvas.getByText("Graded by: PSA")).toBeInTheDocument();
    expect(canvas.getByText("Certificate: PSA 84213377")).toBeInTheDocument();
  },
};

/** A card the grader moved up a level carries its badge. */
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
};

/** Returned ungraded: no grade, the grader's code and note, drawn apart. */
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
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

/** Below its minimum grade: the grade and the badge, and it comes back raw. */
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
};

/** Held by the grader: no grade, the badge and the date it is expected. */
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Held by PSA until 12 November"),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-grade-card-grade"]'),
    ).toBeNull();
  },
};

export const NotReturned: Story = {
  args: {
    cards: [
      {
        id: "card_lugia",
        name: "Lugia first edition",
        grader: "PSA",
        outcome: "not-returned",
        outcomeLabel: "Not returned",
      },
    ],
  },
};

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
};
