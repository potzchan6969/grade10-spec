import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { ActivityList } from "./activity-list";
import { ACTIVITY, ACTIVITY_LIST_COPY, ACTIVITY_SUMMARY } from "./fixtures";

const meta = {
  title: "Loyalty/Points/Blocks/ActivityList",
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
    copy: ACTIVITY_LIST_COPY,
    state: { status: "ready", data: ACTIVITY },
    summary: ACTIVITY_SUMMARY,
  },
} satisfies Meta<typeof ActivityList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Totals on top, filters, what is on the way, then the months. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("+440")).toBeInTheDocument();
    expect(canvas.getByText("-820")).toBeInTheDocument();
    expect(canvas.getByText("+128 pts")).toBeInTheDocument();
    expect(canvas.getByText("Order #10511")).toBeInTheDocument();
    expect(canvas.getByText("Redeemed HK$50 off")).toBeInTheDocument();
    expect(canvas.getByText("October 2026")).toBeInTheDocument();
  },
};

/** Each tab answers one track: Earned hides the spends, Pending the months. */
export const Filtered: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("tab", { name: "Earned" }));
    expect(canvas.queryByText("Redeemed HK$50 off")).not.toBeInTheDocument();
    expect(canvas.getByText("Points adjusted")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Pending" }));
    expect(canvas.getByText("Order #10511")).toBeInTheDocument();
    expect(canvas.queryByText("October 2026")).not.toBeInTheDocument();
  },
};

/** A source that did not say carries no channel; the rest name theirs. */
export const ChannelIsNamed: Story = {
  args: {
    state: {
      status: "ready",
      data: [
        {
          id: "entry-online",
          kind: "Online order",
          track: "earned",
          icon: "order",
          delta: 105,
          date: "20 Sep 2026",
          month: "September 2026",
          channel: "Online store",
          context: "Order #10482",
        },
        {
          id: "entry-quiet",
          kind: "Points expired",
          track: "used",
          icon: "expiry",
          delta: -40,
          date: "1 Mar 2026",
          month: "March 2026",
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const named = [
      ...canvasElement.querySelectorAll('[data-slot="activity-list-channel"]'),
    ].map((node) => node.textContent);

    expect(named).toEqual(["Online store"]);
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
