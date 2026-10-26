import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PointHistorySummary } from "./point-history-summary";
import { POINT_HISTORY_COPY, POINT_HISTORY_SUMMARY } from "./fixtures";

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
    totals: POINT_HISTORY_SUMMARY,
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
    expect(canvas.getByText("+440")).toBeInTheDocument();
    expect(canvas.getByText("-820")).toBeInTheDocument();
    expect(canvas.getByText("+128")).toBeInTheDocument();
  },
};

/** Nothing yet: the box still holds its place at zero. */
export const Empty: Story = {
  args: { totals: { earned: 0, used: 0, pending: 0 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("0")).toHaveLength(3);
  },
};
