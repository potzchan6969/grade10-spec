import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { PAGE_SIZE } from "./auction-catalogue-all-auctions";
import {
  CATALOGUE_CANONICAL,
  CATALOGUE_DESCRIPTION,
  CATALOGUE_PAGE_LOTS,
  CATALOGUE_TITLE,
  FEW_FEATURED_LOTS,
} from "./auction-catalogue-content";
import { AuctionCataloguePage } from "./auction-catalogue-page";

/**
 * Launch catalogue: header and footer, Featured carousel when set, then All
 * auctions — no category tiles. Featured band:
 * Auction List/Featured Auctions. All auctions grid:
 * Auction List/All Auctions.
 */
const meta = {
  title: "Pages/Auction/Auction List",
  component: AuctionCataloguePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    lots: CATALOGUE_PAGE_LOTS,
    featuredLayout: "banner",
    showCategories: false,
  },
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

async function waitForPageEnter(canvas: ReturnType<typeof within>) {
  await waitFor(
    () => {
      expect(
        canvas.queryByLabelText("Loading auctions"),
      ).not.toBeInTheDocument();
    },
    { timeout: 2000 },
  );
}

/** Launch — Featured present, quiet All auctions (no category chrome). */
export const Default: Story = {
  name: "Default",
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    await waitForPageEnter(canvas);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: FEW_FEATURED_LOTS[0].title,
      }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 2, name: "All Auctions" }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("navigation", { name: "Categories" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", {
        level: 3,
        name: FEW_FEATURED_LOTS[0].title,
      }),
    ).toBeInTheDocument();
    const allAuctions = canvas.getByRole("region", { name: "All Auctions" });
    expect(
      within(allAuctions).getAllByRole("heading", { level: 3 }),
    ).toHaveLength(PAGE_SIZE);
    expect(
      allAuctions.querySelector(
        '[data-slot="all-auctions-load-more-sentinel"]',
      ),
    ).not.toBeNull();
  },
};
