import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  FIXTURE_ALT_TIME_ZONE,
  FIXTURE_SHIPPED_LOCALE,
  FIXTURE_TIME_ZONE,
} from "../../lib/datetime-fixtures";
import { formatListingEnds } from "../../lib/format-datetime";
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

export const ViewerZoneHongKong: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(
        formatListingEnds(CLOSE_MS, {
          locale: FIXTURE_SHIPPED_LOCALE,
          timeZone: FIXTURE_TIME_ZONE,
        }),
      ),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/\bUTC\b/)).not.toBeInTheDocument();
  },
};

export const ViewerZoneNewYork: Story = {
  args: { timeZone: FIXTURE_ALT_TIME_ZONE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ny = formatListingEnds(CLOSE_MS, {
      locale: FIXTURE_SHIPPED_LOCALE,
      timeZone: FIXTURE_ALT_TIME_ZONE,
    });
    const hk = formatListingEnds(CLOSE_MS, {
      locale: FIXTURE_SHIPPED_LOCALE,
      timeZone: FIXTURE_TIME_ZONE,
    });
    expect(ny).not.toBe(hk);
    expect(ny).toMatch(/ EDT$/);
    expect(canvas.getByText(ny)).toBeInTheDocument();
    expect(canvas.queryByText(hk)).not.toBeInTheDocument();
    expect(canvas.queryByText(/HKT|\bUTC\b/)).not.toBeInTheDocument();
  },
};
