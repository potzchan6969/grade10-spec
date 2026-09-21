import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  BUSY_MANY_LOTS,
  CATALOGUE_CANONICAL,
  CATALOGUE_DESCRIPTION,
  CATALOGUE_TITLE,
  ENDED_ONLY_LOTS,
  FEW_FEATURED_LOTS,
  ONE_FEATURED_LOTS,
  QUIET_TILE_LOTS,
} from "./auction-catalogue-content";
import { AuctionCataloguePage } from "./auction-catalogue-page";

/**
 * The Auction list as the site assembles it: the existing header and footer,
 * then featured lots, categories, and the full list. Every lot is from the
 * collection draw. Density follows how many of those lots the story keeps live.
 */
const meta = {
  title: "Pages/Auction List",
  component: AuctionCataloguePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { lots: ONE_FEATURED_LOTS },
} satisfies Meta<typeof AuctionCataloguePage>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectCatalogueHead(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  expect(
    canvas.getByRole("heading", { level: 1, name: "Auctions" }),
  ).toBeInTheDocument();
  expect(document.title).toBe(CATALOGUE_TITLE);
  expect(
    document.head
      .querySelector('meta[name="description"][data-auction-catalogue]')
      ?.getAttribute("content"),
  ).toBe(CATALOGUE_DESCRIPTION);
  expect(
    document.head
      .querySelector('link[rel="canonical"][data-auction-catalogue]')
      ?.getAttribute("href"),
  ).toBe(CATALOGUE_CANONICAL);
  return canvas;
}

export const OneFeatured: Story = {
  name: "One featured lot",
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Featured auctions" }),
    ).toBeInTheDocument();
    expect(
      within(
        canvas.getByRole("region", { name: "Featured auctions" }),
      ).queryByRole("heading", { level: 3 }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: "Categories" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: "Filter" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 2, name: "All auctions" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 3, name: ONE_FEATURED_LOTS[0].title }),
    ).toBeInTheDocument();
    expect(
      within(
        canvas.getByRole("region", { name: "Featured auctions" }),
      ).getAllByRole("link", { name: ONE_FEATURED_LOTS[0].title }).length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).not.toBeNull();
  },
};

export const FewFeatured: Story = {
  name: "A few featured lots",
  args: { lots: FEW_FEATURED_LOTS },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Featured auctions" }),
    ).toBeInTheDocument();
    expect(canvas.getAllByText("Upcoming").length).toBeGreaterThan(0);
    expect(
      canvas.queryByRole("heading", { name: "Categories" }),
    ).not.toBeInTheDocument();
  },
};

export const BusyMany: Story = {
  name: "Many categories",
  args: { lots: BUSY_MANY_LOTS },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    expect(
      canvas.getByRole("button", { name: "View Minecraft" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 2, name: "Categories" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 2, name: "Filter" }),
    ).toBeInTheDocument();
  },
};

export const QuietTiles: Story = {
  name: "Category tiles",
  args: { lots: QUIET_TILE_LOTS },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    expect(
      canvas.getByRole("navigation", { name: "Categories" }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: "Categories" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: "Filter" }),
    ).not.toBeInTheDocument();
  },
};

export const EndedOnly: Story = {
  name: "Closed lots",
  args: { lots: ENDED_ONLY_LOTS },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    expect(
      canvas.queryByRole("heading", { name: "Featured auctions" }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: /Watch / })).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 3, name: ENDED_ONLY_LOTS[0].title }),
    ).toBeInTheDocument();
  },
};

export const Empty: Story = {
  name: "No auctions",
  args: { lots: [] },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    expect(canvas.getByText("There are no auctions.")).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: "Featured auctions" }),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toBeNull();
  },
};
