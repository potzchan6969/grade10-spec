import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { AuctionLotCard } from "./auction-catalogue-card";
import {
  type CatalogueLot,
  COLLECTION_LOTS,
  ENDED_ONLY_LOTS,
  FEW_FEATURED_LOTS,
} from "./auction-catalogue-content";

/**
 * One lot card on the All auctions grid. The title is a heading. Site chrome
 * lives on the page story. The scrolling-row featured card (lift, link title)
 * lives under Featured Auctions/Archived. Lots are from the collection draw.
 */
const meta = {
  title: "Auction List/All Auctions/Lot Card",
  component: AuctionLotCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionLotCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const activeLot = FEW_FEATURED_LOTS[0];
const upcomingLot = {
  ...COLLECTION_LOTS[2],
  status: "Upcoming" as const,
  startsAt: "2026-10-20T10:00:00+08:00",
  closesAt: "2026-10-24T18:00:00+08:00",
  closeLabel: "24 Oct 2026, 6:00 pm",
};
const endedLot = ENDED_ONLY_LOTS[0];

function WatchedCard({ lot }: { lot: CatalogueLot }) {
  const [watched, setWatched] = useState(false);
  return (
    <AuctionLotCard
      heading
      lot={lot}
      onToggle={() => setWatched((value) => !value)}
      watched={watched}
    />
  );
}

const cardArgs = {
  heading: true,
  lot: activeLot,
  watched: false,
  onToggle: () => {},
} satisfies Story["args"];

/** A live lot on the list. The title is a heading, and watch is on the card. */
export const Active: Story = {
  name: "Active",
  args: cardArgs,
  render: () => <WatchedCard lot={activeLot} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Current Bid")).toBeInTheDocument();
    expect(
      canvas.queryByText(`${activeLot.bidCount} bids`),
    ).not.toBeInTheDocument();
    expect(canvas.getByText(/Ends in \d+d \d+h \d+m/)).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", {
        level: 3,
        name: activeLot.title,
      }),
    ).toBeInTheDocument();
    const watch = canvas.getByRole("button", {
      name: `Watch ${activeLot.title}`,
    });
    await userEvent.click(watch);
    expect(
      canvas.getByRole("button", { name: `Unwatch ${activeLot.title}` }),
    ).toBeInTheDocument();
  },
};

/** A lot that has not opened. Watch is still there. */
export const Upcoming: Story = {
  name: "Upcoming",
  args: { ...cardArgs, lot: upcomingLot },
  render: () => <WatchedCard lot={upcomingLot} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Starting bid")).toBeNull();
    expect(canvas.queryByText("Current Bid")).toBeNull();
    expect(canvas.queryByText(upcomingLot.bidLabel)).toBeNull();
    expect(canvas.getByText(/Opens in \d+d \d+h \d+m/)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: `Watch ${upcomingLot.title}` }),
    ).toBeInTheDocument();
  },
};

/** A closed lot. The card keeps the result and drops watch. */
export const Ended: Story = {
  name: "Closed",
  args: { ...cardArgs, lot: endedLot },
  render: () => <WatchedCard lot={endedLot} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(endedLot.closeLabel)).toBeInTheDocument();
    expect(canvas.queryByText(/Ends in/)).toBeNull();
    expect(
      canvas.getByRole("heading", { level: 3, name: endedLot.title }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /Watch/ })).toBeNull();
  },
};
