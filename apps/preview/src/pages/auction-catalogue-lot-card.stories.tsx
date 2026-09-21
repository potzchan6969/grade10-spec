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
 * One list lot, the card Featured and the list both use. Site chrome lives
 * on the page story. The lots are from the collection draw.
 */
const meta = {
  title: "Auction List/Lot Card",
  component: AuctionLotCard,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[17.5rem]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionLotCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const activeLot = COLLECTION_LOTS[0];
const upcomingLot = FEW_FEATURED_LOTS[2];
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

/** A live lot. The title is a heading, and watch is on the card. */
export const Active: Story = {
  name: "An active lot",
  args: cardArgs,
  render: () => <WatchedCard lot={activeLot} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Active")).toBeInTheDocument();
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
  name: "An upcoming lot",
  args: { ...cardArgs, lot: upcomingLot },
  render: () => <WatchedCard lot={upcomingLot} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Upcoming")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: `Watch ${upcomingLot.title}` }),
    ).toBeInTheDocument();
  },
};

/** A closed lot. The card keeps the result and drops watch. */
export const Ended: Story = {
  name: "A closed lot",
  args: { ...cardArgs, lot: endedLot },
  render: () => <WatchedCard lot={endedLot} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Ended")).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 3, name: endedLot.title }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /Watch/ })).toBeNull();
  },
};
