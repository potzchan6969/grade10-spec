import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ActivityList } from "./activity-list";
import { ACTIVITY } from "./fixtures";

const meta = {
  title: "Loyalty Membership/ActivityList",
  component: ActivityList,
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
    copy: { label: "Recent activity" },
    state: { status: "ready", data: ACTIVITY },
  },
} satisfies Meta<typeof ActivityList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Earns carry a plus, spends their minus; every name arrived member-readable. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("+105")).toBeInTheDocument();
    expect(canvas.getByText("-500")).toBeInTheDocument();
    expect(canvas.getByText("Redeemed HK$50 off")).toBeInTheDocument();
    expect(canvas.getByText("Order #10482")).toBeInTheDocument();
  },
};

export const Loading: Story = { args: { state: { status: "loading" } } };

export const Empty: Story = {
  args: {
    state: {
      status: "empty",
      message: "Nothing here yet — points will show up as you shop.",
    },
  },
};
