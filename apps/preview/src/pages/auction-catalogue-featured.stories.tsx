import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { formatMoney } from "@grade10/ui";
import {
  FeaturedAuctions,
  FeaturedAuctionsBanner,
  FeaturedAuctionsPair,
} from "./auction-catalogue-card";
import {
  type CatalogueLot,
  FEW_FEATURED_LOTS,
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

/** Preview-only: bump every Active featured bid so the visible slide can roll. */
const LIVE_BID_TICK_MS = 2_800;
const LIVE_BID_STEP_MINOR = 50_000;

function bumpFeaturedBids(lots: readonly CatalogueLot[]): CatalogueLot[] {
  return lots.map((lot) => {
    if (lot.status !== "Active" || lot.bidAmountMinor == null) return lot;
    const currency = lot.currency ?? "HKD";
    const bidAmountMinor = lot.bidAmountMinor + LIVE_BID_STEP_MINOR;
    return {
      ...lot,
      bidAmountMinor,
      bidLabel: formatMoney(bidAmountMinor, currency),
    };
  });
}

function LiveFeaturedAuctionsBanner({
  initialLots,
}: {
  initialLots: readonly CatalogueLot[];
}) {
  const [lots, setLots] = useState(() => [...initialLots]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLots((current) => bumpFeaturedBids(current));
    }, LIVE_BID_TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  return <FeaturedAuctionsBanner lots={lots} />;
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

/**
 * Full-width Figma carousel banner (`6945:12258`): muted copy column + bronze
 * staged image, as on the Auctions page frame. Default Featured story.
 * Current bid ticks up every few seconds so the rolling digits can be checked.
 */
export const CarouselBanner: Story = {
  name: "Carousel banner",
  render: () => <LiveFeaturedAuctionsBanner initialLots={featuredLots} />,
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
    expect(canvas.getByRole("link", { name: "Bid Now" })).toBeInTheDocument();
    expect(
      canvas.getByRole("navigation", { name: "Featured lots" }),
    ).toBeInTheDocument();
    expect(canvas.queryByText(/\d+ bids?/)).toBeNull();
    // Stay on slide 1 — do not click through slides here; Storybook runs play
    // on open and that looked like an instant auto-advance.
    expect(
      canvas.getByRole("button", {
        name: `Show featured lot 1: ${featuredLots[0].title}`,
      }),
    ).toHaveAttribute("aria-current", "true");
  },
};

/** One curated Active slide — no progress dots. */
export const CarouselBannerOneSlide: Story = {
  name: "Carousel banner · one slide",
  render: () => <FeaturedAuctionsBanner lots={[featuredLots[0]]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("LIVE BIDDING")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Bid Now" })).toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Featured lots" }),
    ).toBeNull();
  },
};

/** Upcoming Featured slide: no live dot, STARTING BID, View Auction. */
export const CarouselBannerUpcoming: Story = {
  name: "Carousel banner · upcoming",
  render: () => {
    const upcoming: CatalogueLot = {
      ...featuredLots[0],
      id: "featured-upcoming",
      status: "Upcoming",
      startsAt: "2026-10-10T18:00:00+08:00",
      closesAt: "2026-10-17T18:00:00+08:00",
      closeLabel: "10 Oct 2026, 6:00 pm",
      bidLabel: "HK$12,000.00",
      bidAmountMinor: 1_200_000,
      currency: "HKD",
      bidCount: 0,
    };
    return <FeaturedAuctionsBanner lots={[upcoming]} />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("UPCOMING")).toBeInTheDocument();
    expect(canvas.queryByText("LIVE BIDDING")).toBeNull();
    expect(canvas.getByText("STARTING BID")).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "View Auction" }),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("link", { name: "Bid Now" })).toBeNull();
  },
};

/** Mixed Active + Upcoming in one carousel — chrome follows each slide. */
export const CarouselBannerMixed: Story = {
  name: "Carousel banner · mixed",
  render: () => {
    const upcoming: CatalogueLot = {
      ...featuredLots[1],
      id: "featured-mixed-upcoming",
      status: "Upcoming",
      startsAt: "2026-10-10T18:00:00+08:00",
      closesAt: "2026-10-17T18:00:00+08:00",
      closeLabel: "10 Oct 2026, 6:00 pm",
      bidLabel: "HK$12,000.00",
      bidAmountMinor: 1_200_000,
      currency: "HKD",
      bidCount: 0,
    };
    return (
      <FeaturedAuctionsBanner lots={[featuredLots[0], upcoming, featuredLots[2]]} />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("LIVE BIDDING")).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Bid Now" })).toBeInTheDocument();

    const second = canvas.getByRole("button", {
      name: /Show featured lot 2:/,
    });
    await userEvent.click(second);
    await waitFor(() => {
      expect(canvas.getByText("UPCOMING")).toBeInTheDocument();
    });
    expect(
      canvas.getByRole("link", { name: "View Auction" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("STARTING BID")).toBeInTheDocument();
  },
};

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
