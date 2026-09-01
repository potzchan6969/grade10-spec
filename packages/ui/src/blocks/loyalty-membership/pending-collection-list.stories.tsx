import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PENDING_COLLECTIONS } from "./fixtures";
import { FIXTURE_COLLECT_BY_SEP_3, FIXTURE_REDEEMED_ON } from "../../lib/datetime-fixtures";
import { PendingCollectionList } from "./pending-collection-list";

const meta = {
  title: "Loyalty Membership/PendingCollectionList",
  component: PendingCollectionList,
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
    copy: {
      label: "Awaiting collection",
      location: "Collect at the Grade10 store, Causeway Bay",
      expired: "Expired",
      points: "pts",
    },
    state: { status: "ready", data: PENDING_COLLECTIONS },
  },
} satisfies Meta<typeof PendingCollectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Waiting is the normal state; only a passed window is marked expired. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Collect at the Grade10 store, Causeway Bay"),
    ).toBeInTheDocument();
    expect(canvas.getByText(FIXTURE_COLLECT_BY_SEP_3)).toBeInTheDocument();
    expect(canvas.getAllByText("Expired")).toHaveLength(1);
  },
};

/** A redemption still inside its window says what it is, what it cost, when it
 * was redeemed and by when to collect it — with nothing that reads as a
 * failure. Where to collect is the list's word, said once. */
export const WaitingReadsAsWaiting: Story = {
  play: async ({ canvasElement }) => {
    const waiting = canvasElement.querySelector(
      '[data-slot="pending-collection-item"]:not([data-expired])',
    );
    expect(waiting).not.toBeNull();

    const row = within(waiting as HTMLElement);
    expect(row.getByText("Grade10 card sleeves")).toBeInTheDocument();
    expect(row.getByText("240 pts")).toBeInTheDocument();
    expect(row.getByText(FIXTURE_REDEEMED_ON)).toBeInTheDocument();
    expect(row.getByText(FIXTURE_COLLECT_BY_SEP_3)).toBeInTheDocument();
    expect(row.queryByText("Expired")).not.toBeInTheDocument();

    expect(
      within(canvasElement).getByText(
        "Collect at the Grade10 store, Causeway Bay",
      ),
    ).toBeInTheDocument();
  },
};

export const Loading: Story = { args: { state: { status: "loading" } } };

export const Empty: Story = {
  args: {
    state: { status: "empty", message: "Nothing waiting to be collected." },
  },
};
