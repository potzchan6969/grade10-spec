import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  BACK_PHOTO,
  CARD_RECORD_COPY,
  FRONT_PHOTO,
  RECORD_BASE,
  SLAB_PHOTO,
} from "./fixtures";
import { GradingCardRecord } from "./grading-card-record";

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

/** Still listed: the card as planned, with no intake id. */
export const Listed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Listed")).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-card-record-intake"]'),
    ).toBeNull();
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** Handed in: the intake id and the photograph pair, and no control. */
export const HandedIn: Story = {
  args: { cards: [HANDED_IN] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Intake id: GR-2026-0619-004")).toBeInTheDocument();
    expect(canvas.getByAltText("Charizard, front")).toBeInTheDocument();
    expect(canvas.getByAltText("Charizard, back")).toBeInTheDocument();
    expect(canvas.queryByRole("button")).toBeNull();
  },
};

/** A minimum grade reads on the card's set line. */
export const MinimumGrade: Story = {
  args: { cards: [{ ...HANDED_IN, minimumGrade: "PSA 9" }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Base Set · 4/102 · Minimum grade: PSA 9"),
    ).toBeInTheDocument();
  },
};

/** Refused at the counter: the staff's words as typed, never charged. */
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
};

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
};

/** Graded: the grade in the grader's words, and the certificate. */
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Look Up" })).toHaveAttribute(
      "href",
      "https://www.psacard.com/cert/84213377",
    );
  },
};

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
};

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
};

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
};

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
};

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
};

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
};

/** Collected: the grade, the grader, the certificate and the slab. */
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByAltText("Charizard in its slab")).toBeInTheDocument();
  },
};

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
};
