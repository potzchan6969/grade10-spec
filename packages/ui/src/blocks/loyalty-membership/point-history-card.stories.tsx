import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PointHistoryCard } from "./point-history-card";
import { LEDGER_ENTRIES, POINT_HISTORY_COPY } from "./fixtures";

const SETTLED = LEDGER_ENTRIES.filter((entry) => !entry.pending);
const PENDING = LEDGER_ENTRIES.filter((entry) => entry.pending);

const meta = {
  title: "Loyalty/Points/Blocks/PointHistoryCard",
  component: PointHistoryCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    entries: SETTLED.filter((entry) => entry.month === "October 2026"),
    label: POINT_HISTORY_COPY.label,
    month: "October 2026",
  },
} satisfies Meta<typeof PointHistoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The month heads a card of that month's entries. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("October 2026")).toBeInTheDocument();
    expect(
      canvas.getByText("Redeemed Grade10 card sleeves"),
    ).toBeInTheDocument();
  },
};

/** The icon names the record — a redemption's gift, an order's bag, a
 * top-up's coin, credits' hand, an expiry's clock, an adjustment's sparkle. */
export const Icons: Story = {
  args: {
    entries: SETTLED.filter((entry) => entry.icon),
    month: "August 2026",
  },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelectorAll('[data-slot="point-history-icon"]')
        .length,
    ).toBe(7);
  },
};

/** The pending variant: its own header, hourglass tiles, brand deltas, and
 * no dates — nothing has landed yet. */
export const Pending: Story = {
  args: {
    entries: PENDING,
    header: {
      title: `Pending ${PENDING.reduce((sum, entry) => sum + entry.delta, 0)}pts`,
      description: POINT_HISTORY_COPY.pending.body,
    },
    month: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Pending 128pts")).toBeInTheDocument();
    expect(canvas.getByText("Online purchase")).toBeInTheDocument();
    expect(canvas.queryByText(/Lands/)).not.toBeInTheDocument();
  },
};

/** An entry whose month the consumer did not supply lists ungrouped. */
export const Ungrouped: Story = {
  args: {
    entries: [
      {
        id: "entry-quiet",
        kind: "Points expired",
        track: "used",
        icon: "expiry",
        delta: -40,
        date: "1 Mar 2026",
      },
    ],
    month: undefined,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("March 2026")).not.toBeInTheDocument();
    expect(canvas.getByText("Points expired")).toBeInTheDocument();
  },
};
