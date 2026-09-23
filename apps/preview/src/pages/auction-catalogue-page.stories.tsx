import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
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
 * then featured lots, category tiles, and the full list. Every lot is from the
 * collection draw.
 */
const meta = {
  title: "Pages/Auction List",
  component: AuctionCataloguePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { lots: FEW_FEATURED_LOTS, featuredLayout: "pair" },
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

/** Full page with the overlapping image + info featured band. Docs primary. */
export const OverlappingFeatured: Story = {
  name: "Overlapping featured",
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    await waitForPageEnter(canvas);
    const featured = canvas.getByRole("region", { name: "Grade10 Auctions" });
    expect(
      within(featured).getByRole("heading", {
        level: 2,
        name: "Grade10 Auctions",
      }),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(within(featured).getByText("Bid Now")).toBeInTheDocument();
    });
    expect(
      within(featured).getByRole("navigation", { name: "Featured lots" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 2, name: "All Auctions" }),
    ).toBeInTheDocument();
  },
};

export const OneFeatured: Story = {
  name: "One featured lot",
  args: { lots: ONE_FEATURED_LOTS, featuredLayout: "row" },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    await waitForPageEnter(canvas);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Grade10 Auctions" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("New auctions every week")).toBeInTheDocument();
    expect(
      within(
        canvas.getByRole("region", { name: "Grade10 Auctions" }),
      ).queryByRole("heading", { level: 3 }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 2, name: "All Auctions" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("navigation", { name: "Categories" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", {
        level: 3,
        name: ONE_FEATURED_LOTS[0].title,
      }),
    ).toBeInTheDocument();
    expect(
      within(
        canvas.getByRole("region", { name: "Grade10 Auctions" }),
      ).getAllByRole("link", { name: ONE_FEATURED_LOTS[0].title }).length,
    ).toBeGreaterThan(0);
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).not.toBeNull();
  },
};

export const FewFeatured: Story = {
  name: "A few featured lots",
  args: { lots: FEW_FEATURED_LOTS, featuredLayout: "row" },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    await waitForPageEnter(canvas);
    expect(
      canvas.getByRole("heading", { level: 2, name: "Grade10 Auctions" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("New auctions every week")).toBeInTheDocument();
    expect(
      canvas.getByRole("navigation", { name: "Categories" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Pokémon" })).toBeInTheDocument();
  },
};

export const BusyMany: Story = {
  name: "Many categories",
  args: { lots: BUSY_MANY_LOTS, featuredLayout: "row" },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    await waitForPageEnter(canvas);
    expect(
      canvas.getByRole("navigation", { name: "Categories" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Minecraft" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Pokémon" })).toBeInTheDocument();

    const allAuctions = canvas.getByRole("region", { name: "All Auctions" });
    const pokemonLot = BUSY_MANY_LOTS.find(
      (lot) => lot.categoryId === "pokemon",
    );
    const minecraftLot = BUSY_MANY_LOTS.find(
      (lot) => lot.categoryId === "minecraft",
    );
    expect(pokemonLot).toBeDefined();
    expect(minecraftLot).toBeDefined();

    const pokemon = canvas.getByRole("button", { name: "Pokémon" });
    await userEvent.click(pokemon);
    expect(pokemon).toHaveAttribute("aria-pressed", "true");
    await waitFor(() => {
      expect(
        within(allAuctions).getByRole("heading", {
          level: 3,
          name: pokemonLot!.title,
        }),
      ).toBeInTheDocument();
    });
    expect(
      within(allAuctions).queryByRole("heading", {
        level: 3,
        name: minecraftLot!.title,
      }),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { level: 2, name: "All Auctions" }),
    ).toBeInTheDocument();
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toBeNull();

    const lorcana = canvas.getByRole("button", { name: "Lorcana" });
    await userEvent.click(lorcana);
    expect(lorcana).toHaveAttribute("aria-pressed", "true");
    expect(pokemon).toHaveAttribute("aria-pressed", "false");
    await waitFor(() => {
      expect(
        within(allAuctions).queryByRole("heading", {
          level: 3,
          name: pokemonLot!.title,
        }),
      ).not.toBeInTheDocument();
    });

    await userEvent.click(lorcana);
    expect(lorcana).toHaveAttribute("aria-pressed", "false");
    await waitFor(() => {
      expect(
        within(allAuctions).getByRole("heading", {
          level: 3,
          name: minecraftLot!.title,
        }),
      ).toBeInTheDocument();
    });
  },
};

export const QuietTiles: Story = {
  name: "Category tiles",
  args: { lots: QUIET_TILE_LOTS, featuredLayout: "row" },
  play: async ({ canvasElement }) => {
    const canvas = await expectCatalogueHead(canvasElement);
    await waitForPageEnter(canvas);
    expect(
      canvas.getByRole("navigation", { name: "Categories" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Lorcana" })).toBeInTheDocument();
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
    await waitForPageEnter(canvas);
    expect(
      canvas.queryByRole("heading", { name: "Grade10 Auctions" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /Watch / }),
    ).not.toBeInTheDocument();
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
    await waitForPageEnter(canvas);
    expect(canvas.getByText("There are no auctions.")).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: "Grade10 Auctions" }),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('script[type="application/ld+json"]'),
    ).toBeNull();
  },
};
