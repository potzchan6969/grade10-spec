import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AuctionRecordSkeleton } from "./auction-record-skeleton";

const LABEL = "Loading your auctions…";

const meta = {
  title: "Auction/Bidding/Blocks/AuctionRecordSkeleton",
  component: AuctionRecordSkeleton,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { label: LABEL },
} satisfies Meta<typeof AuctionRecordSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The record's layout while it is read: one busy status a reader hears once,
 * no placeholder announced on its own. */
export const Loading: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const statuses = canvas.getAllByRole("status");
    expect(statuses).toHaveLength(1);
    expect(statuses[0]).toHaveAccessibleName(LABEL);
    expect(statuses[0]).toHaveAttribute("aria-busy", "true");
    const placeholders = statuses[0].querySelectorAll('[data-slot="skeleton"]');
    expect(placeholders.length).toBeGreaterThan(0);
    for (const placeholder of placeholders) {
      expect(placeholder).toHaveAttribute("aria-hidden", "true");
    }
  },
};
