import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { BiddingList, WatchingList } from "./auction-record-lists";
import { AuctionRecordTabs } from "./auction-record-tabs";
import { WatchButton } from "./watch-button";

const copy = {
  watching: "Watching",
  bidding: "Bidding",
  openListing: "Open listing",
};

const meta = {
  title: "Auction Record/AuctionRecord",
  component: AuctionRecordTabs,
  tags: ["autodocs"],
  args: { activeTab: "watching", copy, onTabChange: fn() },
  parameters: { layout: "centered" },
} satisfies Meta<typeof AuctionRecordTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Watching: Story = {
  render: (args) => (
    <AuctionRecordTabs {...args}>
      <WatchingList
        empty={{
          title: "Nothing watched",
          description: "Browse the catalogue to find a lot.",
        }}
        items={[
          {
            title: "Vintage Camera",
            state: "ending_soon",
            stateLabel: "Ending soon",
            detail: "Closes in 25 minutes",
            copy,
          },
        ]}
      />
    </AuctionRecordTabs>
  ),
};

export const Bidding: Story = {
  args: { activeTab: "bidding" },
  render: (args) => (
    <AuctionRecordTabs {...args}>
      <BiddingList
        items={[
          {
            title: "Signed Poster",
            state: "outbid",
            stateLabel: "Outbid",
            detail: "Next bid HK$1,100",
            copy,
          },
        ]}
      />
    </AuctionRecordTabs>
  ),
};

export const WatchControl: Story = {
  render: () => (
    <WatchButton
      copy={{ watch: "Watch", unwatch: "Unwatch" }}
      onPress={watchPressed}
      watched={false}
    />
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Watch" }),
    );
    expect(watchPressed).toHaveBeenCalled();
  },
};

const watchPressed = fn();
