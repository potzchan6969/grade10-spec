import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { POINT_HISTORY_COPY, POINTS_TOTALS } from "./fixtures";
import { PointHistorySummary } from "./point-history-summary";

const meta = {
  title: "Loyalty/Points/Blocks/PointHistorySummary",
  component: PointHistorySummary,
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
    copy: POINT_HISTORY_COPY.summary,
    totals: POINTS_TOTALS,
  },
} satisfies Meta<typeof PointHistorySummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Earned reads success, Used stays neutral, Pending warns — the same
 * tones the ledger's deltas read. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Earned")).toBeInTheDocument();
    expect(canvas.getByText("440 pts")).toBeInTheDocument();
    expect(canvas.getByText("820 pts")).toBeInTheDocument();
    expect(canvas.getByText("128 pts")).toBeInTheDocument();
  },
};

/** Nothing yet: the box still holds its place at zero. */
export const Empty: Story = {
  args: { totals: { earned: 0, used: 0, pending: 0 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("0 pts")).toHaveLength(3);
  },
};
