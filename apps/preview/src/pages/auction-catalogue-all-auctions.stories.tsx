import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import {
  AuctionCatalogueAllAuctionsGrid,
  PAGE_SIZE,
} from "./auction-catalogue-all-auctions";
import {
  CATALOGUE_PAGE_LOTS,
  type CatalogueLot,
  type CatalogueStatus,
  FEW_FEATURED_LOTS,
} from "./auction-catalogue-content";

/**
 * Quiet All auctions grid (launch layout — no category chrome) with infinite
 * scroll. Assembled with Featured under Pages/Auction List → Default. Lot card
 * states live under All Auctions/Lot Card. Category button (later) lives under
 * All Auctions/Later.
 */
const meta = {
  title: "Auction List/All Auctions",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function rank(status: CatalogueStatus): number {
  if (status === "Active") return 0;
  if (status === "Upcoming") return 1;
  return 2;
}

function byCatalogueOrder(lots: readonly CatalogueLot[]): CatalogueLot[] {
  return [...lots].sort((a, b) => {
    const status = rank(a.status) - rank(b.status);
    if (status !== 0) return status;
    if (a.status === "Ended") return b.closesAt.localeCompare(a.closesAt);
    if (a.status === "Upcoming") return a.startsAt.localeCompare(b.startsAt);
    return a.closesAt.localeCompare(b.closesAt);
  });
}

function AllAuctionsList({ lots }: { lots: readonly CatalogueLot[] }) {
  const ordered = byCatalogueOrder(lots);
  const [watched, setWatched] = useState<ReadonlySet<string>>(new Set());

  function toggleWatch(id: string) {
    setWatched((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="w-full bg-background px-4 pt-16 pb-16 text-foreground sm:px-8 lg:px-12">
      <section aria-labelledby="all-auctions" className="min-w-0">
        <h2
          className="text-2xl font-semibold text-foreground"
          id="all-auctions"
        >
          All Auctions
        </h2>
        {ordered.length === 0 ? (
          <p className="mt-8 max-w-prose text-base text-foreground">
            There are no auctions.
          </p>
        ) : (
          <div className="mt-8">
            <AuctionCatalogueAllAuctionsGrid
              lots={ordered}
              onToggle={toggleWatch}
              watched={watched}
            />
          </div>
        )}
      </section>
    </div>
  );
}

/** Launch All auctions grid — same band as Pages/Auction List → Default. */
export const Default: Story = {
  name: "All auctions",
  render: () => <AllAuctionsList lots={CATALOGUE_PAGE_LOTS} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "All Auctions" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", {
        level: 3,
        name: FEW_FEATURED_LOTS[0].title,
      }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Categories" }),
    ).not.toBeInTheDocument();
    const headings = canvas.getAllByRole("heading", { level: 3 });
    expect(headings.length).toBe(PAGE_SIZE);
    expect(
      canvasElement.querySelector(
        '[data-slot="all-auctions-load-more-sentinel"]',
      ),
    ).not.toBeNull();

    // The test browser's viewport is taller than the observer's root, so the
    // sentinel is brought into range by scrolling the window to its end, again
    // on each retry while the page is still laying out.
    await waitFor(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
      expect(
        canvas.getByLabelText("Loading more auctions"),
      ).toBeInTheDocument();
    });
    await waitFor(
      () => {
        expect(
          canvas.getAllByRole("heading", { level: 3 }).length,
        ).toBeGreaterThan(PAGE_SIZE);
      },
      { timeout: 2000 },
    );
  },
};

/** Empty All auctions — no lots to list. */
export const Empty: Story = {
  name: "No auctions",
  render: () => <AllAuctionsList lots={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "All Auctions" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("There are no auctions.")).toBeInTheDocument();
    expect(canvas.queryByRole("heading", { level: 3 })).toBeNull();
  },
};
