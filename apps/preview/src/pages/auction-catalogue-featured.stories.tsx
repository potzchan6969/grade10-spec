import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  FeaturedAuctions,
  FeaturedAuctionsPair,
} from "./auction-catalogue-card";
import { COLLECTION_LOTS } from "./auction-catalogue-content";

/**
 * The featured band on its own. One card from that row lives under Lot Card →
 * A featured lot. Site chrome and the rest of the list live on the page story.
 * The four lots are the soonest closes from the collection.
 */
const meta = {
  title: "Auction List/Featured",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const featuredLots = COLLECTION_LOTS.slice(0, 4);

function useWatchState() {
  const [watched, setWatched] = useState<ReadonlySet<string>>(new Set());
  return {
    watched,
    onToggle: (id: string) => {
      setWatched((current) => {
        const next = new Set(current);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
  };
}

function FeaturedRow() {
  const { watched, onToggle } = useWatchState();
  return (
    <FeaturedAuctions
      lots={featuredLots}
      onToggle={onToggle}
      watched={watched}
    />
  );
}

function FeaturedPair() {
  const { watched, onToggle } = useWatchState();
  return (
    <FeaturedAuctionsPair
      lots={featuredLots}
      onToggle={onToggle}
      watched={watched}
    />
  );
}

/** Grade10 Auctions band with the four soonest lots in one scrolling row. */
export const Scrolling: Story = {
  name: "Scrolling row",
  render: () => <FeaturedRow />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Grade10 Auctions" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("New auctions every week")).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: featuredLots[0].title }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("heading", { level: 3 })).toBeNull();

    const scroller = canvasElement.querySelector("ul");
    expect(scroller).not.toBeNull();
    const next = canvas.queryByRole("button", {
      name: "Next featured auctions",
    });
    if (next) {
      await userEvent.click(next);
      await waitFor(() => {
        expect(scroller?.scrollLeft ?? 0).toBeGreaterThan(0);
      });
    }
  },
};

/**
 * Thanks.co-style exploration: image card + info card overlap as a pair,
 * with pill/dot pagination instead of a scrolling row.
 */
export const OverlappingPair: Story = {
  name: "Overlapping pair",
  render: () => <FeaturedPair />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Grade10 Auctions" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: featuredLots[0].title }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "Bid Now" }),
    ).toBeInTheDocument();

    const second = canvas.getByRole("button", {
      name: `Show featured lot 2: ${featuredLots[1].title}`,
    });
    await userEvent.click(second);
    expect(
      canvas.getByRole("link", { name: featuredLots[1].title }),
    ).toBeInTheDocument();
    expect(second).toHaveAttribute("aria-current", "true");
  },
};
