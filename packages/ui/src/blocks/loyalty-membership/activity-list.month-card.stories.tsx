import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ActivityMonthCard } from "./activity-month-card";
import { ACTIVITY, ACTIVITY_LIST_COPY } from "./fixtures";

const OCTOBER = ACTIVITY.filter((entry) => entry.month === "October 2026");

const meta = {
  title: "Loyalty/Points/Blocks/ActivityMonthCard",
  component: ActivityMonthCard,
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
    entries: OCTOBER,
    label: ACTIVITY_LIST_COPY.label,
    month: "October 2026",
  },
} satisfies Meta<typeof ActivityMonthCard>;

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

/** The icon names the record — a redemption's gift, an order's cart, an
 * adjustment's sparkle, an expiry's hourglass. */
export const Icons: Story = {
  args: {
    entries: ACTIVITY.filter((entry) => !entry.pending && entry.icon),
    month: "August 2026",
  },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelectorAll('[data-slot="activity-list-icon"]')
        .length,
    ).toBe(5);
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
