import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_ALT_TIME_ZONE,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "../../lib/datetime-fixtures";
import { AuctionCard } from "./auction-card";

const CLOSE_MS = Date.UTC(2026, 8, 1, 18, 0);

const meta = {
  title: "Auction Listing/AuctionCard",
  component: AuctionCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      live: "Live",
      endingSoon: "Ending soon",
      watch: {
        watch: "Watch",
        watching: "Watching",
        unwatch: "Unwatch",
        watchAriaLabel: "Watch this auction",
        unwatchAriaLabel: "Unwatch this auction",
      },
    },
    name: "1999 Base Set Charizard PSA 9",
    currentBidMinor: 12_800_000,
    currency: "HKD",
    priceLabel: "Current bid",
    bidCountLabel: "6 bids",
    when: { kind: "ends", at: CLOSE_MS },
    locale: FIXTURE_SHIPPED_LOCALE,
    timeZone: FIXTURE_TIME_ZONE,
    live: "open",
  },
} satisfies Meta<typeof AuctionCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Scenario: shared-ui-auction-listing-SC-55 - A catalogue tile close follows the viewer
 * Scenario: shared-dates-and-times-SC-29 - Two collectors read different collector clocks
 * Case: shared-ui-auction-listing-US1-TC55-1
 */
export const ViewerZoneHongKong: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ends 2 Sep 2026, 02:00 HKT")).toBeInTheDocument();
    expect(canvas.queryByText(/\bUTC\b|EDT/)).not.toBeInTheDocument();
  },
};

/**
 * Scenario: shared-ui-auction-listing-SC-55 - A catalogue tile close follows the viewer
 * Scenario: shared-dates-and-times-SC-29 - Two collectors read different collector clocks
 * Case: shared-ui-auction-listing-US1-TC55-1
 */
export const ViewerZoneNewYork: Story = {
  args: { timeZone: FIXTURE_ALT_TIME_ZONE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ends 1 Sep 2026, 14:00 EDT")).toBeInTheDocument();
    expect(canvas.queryByText(/HKT|\bUTC\b/)).not.toBeInTheDocument();
  },
};
