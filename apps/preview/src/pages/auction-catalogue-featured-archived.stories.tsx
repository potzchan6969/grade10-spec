import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  AuctionLotCard,
  FeaturedAuctions,
  FeaturedAuctionsPair,
} from "./auction-catalogue-card";
import { FEW_FEATURED_LOTS } from "./auction-catalogue-content";

/**
 * Earlier Featured band explorations kept for reference — scrolling row,
 * overlapping pair, and the lifted card those rows used. The live surface is
 * Auction List/Featured Auctions → Carousel banner.
 */
const meta = {
  title: "Auction List/Featured Auctions/Archived",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const featuredLots = FEW_FEATURED_LOTS;
const featuredLot = featuredLots[0];

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
 * One card as the scrolling row renders it — white shell, title stays a link
 * (the section already heads the band).
 */
export const FeaturedLot: Story = {
  name: "A featured lot",
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
  render: function FeaturedLotCard() {
    const [watched, setWatched] = useState(false);
    return (
      <AuctionLotCard
        eager
        heading={false}
        lift
        lot={featuredLot}
        onToggle={() => setWatched((value) => !value)}
        watched={watched}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Current Bid")).toBeInTheDocument();
    expect(
      canvas.getByText(`${featuredLot.bidCount} bids`),
    ).toBeInTheDocument();
    expect(canvas.getByText(/Ends in \d+d \d+h \d+m/)).toBeInTheDocument();
    expect(canvas.queryByRole("heading", { level: 3 })).toBeNull();
    expect(
      canvas.getByRole("link", { name: featuredLot.title }),
    ).toBeInTheDocument();
    const watch = canvas.getByRole("button", {
      name: `Watch ${featuredLot.title}`,
    });
    await userEvent.click(watch);
    expect(
      canvas.getByRole("button", { name: `Unwatch ${featuredLot.title}` }),
    ).toBeInTheDocument();
  },
};

/**
 * Thanks.co-style exploration: image card + info card overlap as a pair,
 * with pill/dot pagination instead of a scrolling row.
 *
 * Dots and auto-play fill use the design-system `CarouselProgress` primitive
 * (`Components/CarouselProgress` in design-system Storybook).
 */
export const OverlappingPair: Story = {
  name: "Overlapping pair",
  render: () => <FeaturedPair />,
  parameters: {
    docs: {
      description: {
        story:
          "Pagination and the auto-play timer are `CarouselProgress` / `CarouselProgressItem` from `@grade10/design-system`. See Components/CarouselProgress in the design-system Storybook.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Grade10 Auctions" }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(
        canvas.getByRole("link", { name: featuredLots[0].title }),
      ).toBeInTheDocument();
      expect(canvas.getByRole("link", { name: "Bid Now" })).toBeInTheDocument();
    });

    const second = canvas.getByRole("button", {
      name: `Show featured lot 2: ${featuredLots[1].title}`,
    });
    await userEvent.click(second);
    await waitFor(() => {
      expect(
        canvas.getByRole("link", { name: featuredLots[1].title }),
      ).toBeInTheDocument();
    });
    expect(second).toHaveAttribute("aria-current", "true");
  },
};
