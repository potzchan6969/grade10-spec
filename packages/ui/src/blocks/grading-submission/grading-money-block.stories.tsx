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

/** Before hand-in: the fee and the line that it is paid at the counter, the
 * amount in the locale given and no other amount derived from it. Nothing is
 * paid yet (shared-ui-grading-submission-SC-46,
 * shared-ui-grading-submission-SC-55). */
export const Estimate: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Fee, 4 cards × HK$250")).toBeInTheDocument();
    expect(canvas.getByText("HK$1,000")).toBeInTheDocument();
    expect(canvas.getAllByText(/HK\$/)).toHaveLength(2);
    expect(
      canvas.getByText("Paid at the counter once every card is checked."),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-money-block-paid"]'),
    ).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="grading-money-block-lead"]'),
    ).toBeNull();
  },
};

/** The cover reads under the fee, and nothing reads as paid
 * (shared-ui-grading-submission-SC-46). */
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fee = canvas.getByText("Fee, 4 cards × HK$250");
    const cover = canvas.getByText("Cover");
    expect(canvas.getByText("HK$120")).toBeInTheDocument();
    expect(
      fee.compareDocumentPosition(cover) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(canvas.queryByText("Paid")).toBeNull();
  },
};

/** What was paid reads its amount, its method, its instant and its till
 * reference (shared-ui-grading-submission-SC-50). */
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
    expect(canvas.getByText("Paid")).toBeInTheDocument();
    expect(canvas.getAllByText("HK$1,000")).toHaveLength(2);
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

/** Something due leads the block, so what stands in the way reads first; the
 * moved-up line and the due figure follow it
 * (shared-ui-grading-submission-SC-47). */
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
    const lead = canvas.getByText(SETTLE_LEAD);
    expect(
      lead.compareDocumentPosition(canvas.getByText("Fee, 4 cards × HK$250")) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(canvas.getByText("Moved up a level, Charizard")).toBeInTheDocument();
    expect(
      canvas.getByText("Due at the counter before collection"),
    ).toBeInTheDocument();
    expect(canvas.getAllByText("HK$300")).toHaveLength(2);
  },
};

/** A waived upcharge, and no settle lead
 * (shared-ui-grading-submission-SC-49). */
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
      within(canvasElement).getByText("Upcharge waived"),
    ).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-money-block-lead"]'),
    ).toBeNull();
  },
};

/** Storage reads per card and per month, accruing, under the settle lead and
 * above the due figure (shared-ui-grading-submission-SC-47). */
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(SETTLE_LEAD)).toBeInTheDocument();
    expect(canvas.getByText("Storage")).toBeInTheDocument();
    expect(
      canvas.getByText("A card a month from 14 Aug 2026."),
    ).toBeInTheDocument();
    expect(canvas.getByText("HK$30")).toBeInTheDocument();
    expect(canvas.getByText("HK$90")).toBeInTheDocument();
  },
};

/** A card paid out reads its route, beside the refunded fee
 * (shared-ui-grading-submission-SC-48). */
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
    expect(canvas.getByText("Fee refunded")).toBeInTheDocument();
    expect(canvas.getByText("HK$250")).toBeInTheDocument();
    expect(
      canvas.getByText("To your bank account ending 4471."),
    ).toBeInTheDocument();
  },
};

/** A waived upcharge and the line settled at collection with its till
 * reference, and no settle lead (shared-ui-grading-submission-SC-49). */
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
    expect(canvas.getByText("Upcharge waived")).toBeInTheDocument();
    expect(canvas.getByText("Settled at collection")).toBeInTheDocument();
    expect(canvas.getByText("POS 4471-1180")).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="grading-money-block-lead"]'),
    ).toBeNull();
  },
};
