import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { hkd, MONEY_BLOCK_COPY, SETTLE_LEAD } from "./fixtures";
import { GradingMoneyBlock } from "./grading-money-block";

const FEE_LINE = {
  label: "Fee, 4 cards × HK$250",
  amount: hkd(100000),
  note: "Paid at the counter once every card is checked.",
};

const meta = {
  title: "Grading Submission/GradingMoneyBlock",
  component: GradingMoneyBlock,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: MONEY_BLOCK_COPY,
    lines: { fee: FEE_LINE },
    locale: "en",
  },
} satisfies Meta<typeof GradingMoneyBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Before hand-in: the fee, and what it includes. Nothing is paid yet. */
export const Estimate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Fee, 4 cards × HK$250")).toBeInTheDocument();
    expect(canvas.getByText("HK$1,000")).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-money-block-paid"]'),
    ).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="grading-money-block-lead"]'),
    ).toBeNull();
  },
};

/** The cover reads under the fee. */
export const EstimateWithCover: Story = {
  args: {
    lines: {
      fee: FEE_LINE,
      cover: {
        label: "Cover",
        amount: hkd(12000),
        note: "1% of the declared value, both ways.",
      },
    },
  },
};

/** What was paid reads how it was paid. */
export const Paid: Story = {
  args: {
    lines: {
      fee: FEE_LINE,
      paid: {
        label: "Paid",
        amount: hkd(100000),
        note: "Card · 15 Jun 2026, 17:00 · POS 4471-0098",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Card · 15 Jun 2026, 17:00 · POS 4471-0098"),
    ).toBeInTheDocument();
  },
};

/** A refunded line reads the way it was paid. */
export const Refunded: Story = {
  args: {
    lines: {
      fee: FEE_LINE,
      refunded: {
        label: "Refunded",
        amount: hkd(25000),
        note: "Back to the card you paid with.",
      },
    },
  },
};

/** Something due leads the block, so what stands in the way reads first. */
export const Due: Story = {
  args: {
    copy: { ...MONEY_BLOCK_COPY, lead: SETTLE_LEAD },
    lines: {
      fee: FEE_LINE,
      movedUp: {
        label: "Moved up a level, Charizard",
        amount: hkd(30000),
        note: "PSA graded it above the level you picked.",
      },
      due: {
        label: "Due at the counter before collection",
        amount: hkd(30000),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(SETTLE_LEAD)).toBeInTheDocument();
    expect(
      canvas.getByText("Due at the counter before collection"),
    ).toBeInTheDocument();
  },
};

/** A waived upcharge, and nothing due. */
export const Waived: Story = {
  args: {
    lines: {
      fee: FEE_LINE,
      waived: {
        label: "Upcharge waived",
        amount: hkd(30000),
        note: "We waived it this time.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="grading-money-block-lead"]'),
    ).toBeNull();
  },
};

/** Storage reads per card and per month, accruing. */
export const Storage: Story = {
  args: {
    copy: { ...MONEY_BLOCK_COPY, lead: SETTLE_LEAD },
    lines: {
      fee: FEE_LINE,
      storage: {
        label: "Storage",
        amount: hkd(3000),
        note: "A card a month from 14 Aug 2026.",
      },
      due: { label: "Due at the counter before collection", amount: hkd(9000) },
    },
  },
};

/** A card paid out reads its route, beside the refunded fee. */
export const PaidOut: Story = {
  args: {
    lines: {
      fee: FEE_LINE,
      refunded: { label: "Fee refunded", amount: hkd(25000) },
      paidOut: {
        label: "Paid out, Lugia first edition",
        amount: hkd(600000),
        note: "To your bank account ending 4471.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$6,000")).toBeInTheDocument();
    expect(
      canvas.getByText("To your bank account ending 4471."),
    ).toBeInTheDocument();
  },
};

/** Settled at collection, with the till reference and nothing due. */
export const Settled: Story = {
  args: {
    lines: {
      fee: FEE_LINE,
      waived: { label: "Upcharge waived", amount: hkd(30000) },
      settled: {
        label: "Settled at collection",
        amount: hkd(30000),
        note: "POS 4471-1180",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("POS 4471-1180")).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-money-block-lead"]'),
    ).toBeNull();
  },
};
