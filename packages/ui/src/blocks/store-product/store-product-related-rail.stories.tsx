import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import type { ProductSummary } from "../store-product-listing/types";
import { RELATED_RAIL_COPY, RELATED_RAIL_STORY } from "./fixtures";
import { StoreProductRelatedRail } from "./store-product-related-rail";

const meta = {
  title: "Store Product/Related Rail",
  component: StoreProductRelatedRail,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: RELATED_RAIL_COPY,
    cards: RELATED_RAIL_STORY,
    onCardClick: fn(),
  },
} satisfies Meta<typeof StoreProductRelatedRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/** grade10-site-store-cross-sell-SC-26: the rail draws what it is given, in
 * order, sells nothing and draws no browse-all link under its heading. */
export const PicksAndSimilar: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: RELATED_RAIL_COPY.heading }),
    ).toBeVisible();
    const tiles = canvas.getAllByTestId("store-product-related-rail-tile");
    expect(tiles).toHaveLength(RELATED_RAIL_STORY.length);
    expect(
      tiles.map((tile) => within(tile).getByText(/.+/).textContent),
    ).toEqual(expect.arrayContaining([RELATED_RAIL_STORY[0].name]));
    expect(canvas.queryByRole("link")).toBeNull();
    expect(canvas.queryByRole("button", { name: /cart/i })).toBeNull();
    expect(canvas.queryByRole("spinbutton")).toBeNull();
    const soldOut = tiles.at(-1);
    expect(soldOut).toHaveAttribute("data-sold-out", "true");
    await userEvent.click(
      within(tiles[0]).getAllByRole("button", {
        name: RELATED_RAIL_STORY[0].name,
      })[0],
    );
    expect(args.onCardClick).toHaveBeenCalledWith(RELATED_RAIL_STORY[0].id);
  },
};

/** A rail of one card keeps its heading and its one tile. */
export const OneCard: Story = {
  args: { cards: [RELATED_RAIL_STORY[0]] as ProductSummary[] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: RELATED_RAIL_COPY.heading }),
    ).toBeVisible();
    expect(
      canvas.getAllByTestId("store-product-related-rail-tile"),
    ).toHaveLength(1);
  },
};

/** shared-ui-store-product-listing-SC-91 on the rail: a sold-out pick keeps
 * its treatment and still opens its card. */
export const SoldOutPickOpens: Story = {
  args: { cards: [RELATED_RAIL_STORY.at(-1) as ProductSummary] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const tile = canvas.getByTestId("store-product-related-rail-tile");
    expect(tile).toHaveAttribute("data-sold-out", "true");
    expect(within(tile).getByText("SOLD OUT")).toBeVisible();
    const card = RELATED_RAIL_STORY.at(-1) as ProductSummary;
    await userEvent.click(
      within(tile).getAllByRole("button", { name: card.name })[0],
    );
    expect(args.onCardClick).toHaveBeenCalledWith(card.id);
  },
};

/** Narrow viewport: as the frame draws it; the frame is awaited. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
