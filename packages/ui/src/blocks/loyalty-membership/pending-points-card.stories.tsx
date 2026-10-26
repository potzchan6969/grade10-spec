import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PendingPointsCard } from "./pending-points-card";
import { LEDGER_ENTRIES, POINT_HISTORY_COPY } from "./fixtures";

const PENDING = LEDGER_ENTRIES.filter((entry) => entry.pending);

const meta = {
  title: "Loyalty/Points/Blocks/PendingPointsCard",
  component: PendingPointsCard,
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
    copy: POINT_HISTORY_COPY.pending,
    entries: PENDING,
  },
} satisfies Meta<typeof PendingPointsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The total sums the entries; each row tags Pending under its delta. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("+128 pts")).toBeInTheDocument();
    expect(canvas.getByText("Online order")).toBeInTheDocument();
    expect(canvas.getByText("In-store purchase")).toBeInTheDocument();
    expect(canvas.getAllByText("Pending").length).toBeGreaterThan(1);
  },
};

/** One order on the way. */
export const Single: Story = {
  args: { entries: PENDING.slice(0, 1) },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("+86 pts")).toBeInTheDocument();
  },
};
