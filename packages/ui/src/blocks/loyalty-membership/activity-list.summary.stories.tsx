import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ActivitySummary } from "./activity-summary";
import { ACTIVITY_LIST_COPY, ACTIVITY_SUMMARY } from "./fixtures";

const meta = {
  title: "Loyalty/Points/Blocks/ActivitySummary",
  component: ActivitySummary,
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
    copy: ACTIVITY_LIST_COPY.summary,
    totals: ACTIVITY_SUMMARY,
  },
} satisfies Meta<typeof ActivitySummary>;

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
