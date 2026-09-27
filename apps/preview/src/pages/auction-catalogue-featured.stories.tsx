import {
  FeaturedAuctionsBanner,
  type FeaturedAuctionsBannerCopy,
  type FeaturedAuctionsBannerSlide,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  FeaturedAuctions,
  FeaturedAuctionsPair,
} from "./auction-catalogue-card";
import {
  type CatalogueLot,
  FEW_FEATURED_LOTS,
  ONE_FEATURED_LOTS,
} from "./auction-catalogue-content";

/**
 * The featured band on its own. One card from that row lives under Lot Card →
 * A featured lot. Site chrome and the rest of the list live on the page story.
 */
const meta = {
  title: "Auction List/Featured",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const featuredLots = FEW_FEATURED_LOTS;

const FEATURED_BANNER_COPY: FeaturedAuctionsBannerCopy = {
  active: "LIVE BIDDING",
  upcoming: "UPCOMING",
  ended: "ENDED",
  currentBid: "CURRENT BID",
  startingBid: "STARTING BID",
  finalBid: "FINAL BID",
  bidNow: "Bid Now",
  viewAuction: "View Auction",
  endsIn: "Ends in",
  opensIn: "Opens in",
  endedAt: "Ended",
  progress: "Featured lots",
  slide: "Show featured lot {position}: {title}",
};

function bidsLabel(count: number) {
  return `${count} ${count === 1 ? "bid" : "bids"}`;
}

function toFeaturedSlide(lot: CatalogueLot): FeaturedAuctionsBannerSlide {
  const status =
    lot.status === "Upcoming"
      ? "upcoming"
      : lot.status === "Ended"
        ? "ended"
        : "active";
  return {
    id: lot.id,
    title: lot.title,
    status,
    imageSrc: lot.imageSrc,
    imageAlt: lot.imageAlt,
    href: `https://grade10.com/auction/listings/${lot.slug}`,
    currentBidMinor: lot.currentBidMinor,
    currency: lot.currency,
    bidCountLabel: bidsLabel(lot.bidCount),
    countdown:
      lot.status === "Ended"
        ? undefined
        : {
            kind: lot.status === "Upcoming" ? "opens" : "ends",
            atMs: Date.parse(
              lot.status === "Upcoming" ? lot.startsAt : lot.closesAt,
            ),
          },
  };
}

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

/**
 * Full-width Figma carousel banner (`6945:12258`): muted copy column + bronze
 * staged image, as on the Auctions page frame. Promoted `FeaturedAuctionsBanner`
 * from `@grade10/ui`.
 */
export const CarouselBanner: Story = {
  name: "Carousel banner",
  render: () => (
    <FeaturedAuctionsBanner
      copy={FEATURED_BANNER_COPY}
      slides={featuredLots.map(toFeaturedSlide)}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: featuredLots[0].title,
      }),
    ).toBeInTheDocument();
    expect(canvas.getByText("LIVE BIDDING")).toBeInTheDocument();
    expect(canvas.getByText("CURRENT BID")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /Bid Now/i })).toBeInTheDocument();
    expect(
      canvas.getByRole("navigation", { name: "Featured lots" }),
    ).toBeInTheDocument();

    const second = canvas.getByRole("button", {
      name: `Show featured lot 2: ${featuredLots[1].title}`,
    });
    await userEvent.click(second);
    await waitFor(() => {
      expect(
        canvas.getByRole("heading", {
          level: 2,
          name: featuredLots[1].title,
        }),
      ).toBeInTheDocument();
    });
    expect(second).toHaveAttribute("aria-current", "true");
  },
};

/** One Featured slide — progress multi-dot advance is not required (SC-36). */
export const CarouselBannerOne: Story = {
  name: "Carousel banner one slide",
  render: () => (
    <FeaturedAuctionsBanner
      copy={FEATURED_BANNER_COPY}
      slides={ONE_FEATURED_LOTS.filter((lot) => lot.status !== "Ended").map(
        toFeaturedSlide,
      )}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const live = ONE_FEATURED_LOTS.find((lot) => lot.status !== "Ended");
    expect(live).toBeDefined();
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: live?.title,
      }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Featured lots" }),
    ).not.toBeInTheDocument();
  },
};
