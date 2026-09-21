import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  RELATED_RAIL_COPY,
  RELATED_RAIL_SOLD_OUT,
  RELATED_RAIL_STORY,
} from "./fixtures";
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

/** The tiles the rail drew, in document order: the card's own root. */
function tiles(canvasElement: HTMLElement) {
  return Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-slot="product-card"]'),
  );
}

/** grade10-site-store-cross-sell-SC-26: the rail draws what it is given, in
 * order, sells nothing and draws no browse-all link under its heading. */
export const PicksAndSimilar: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: RELATED_RAIL_COPY.heading }),
    ).toBeVisible();
    const drawn = tiles(canvasElement);
    expect(
      drawn.map(
        (tile) =>
          tile.querySelector('[data-slot="product-card-content"] button')
            ?.textContent,
      ),
    ).toEqual(RELATED_RAIL_STORY.map((card) => card.name));
    expect(canvas.queryByRole("link")).toBeNull();
    expect(
      canvasElement.querySelector('[data-slot="product-card-cart-control"]'),
    ).toBeNull();
    const last = drawn.at(-1);
    expect(last).toHaveAttribute("data-sold-out", "true");
    expect(
      within(last as HTMLElement).getByText(RELATED_RAIL_COPY.card.soldOut),
    ).toBeVisible();
    await userEvent.click(
      within(drawn[0]).getAllByRole("button", {
        name: RELATED_RAIL_STORY[0].name,
      })[0],
    );
    expect(args.onCardClick).toHaveBeenCalledWith(RELATED_RAIL_STORY[0].id);
  },
};

/** A rail of one card keeps its heading and its one tile. */
export const OneCard: Story = {
  args: { cards: [RELATED_RAIL_STORY[0]] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: RELATED_RAIL_COPY.heading }),
    ).toBeVisible();
    expect(tiles(canvasElement)).toHaveLength(1);
  },
};

/** shared-ui-store-product-listing-SC-91 on the rail: a sold-out pick keeps
 * its treatment and still opens its card, from the photo well as from the
 * name. */
export const SoldOutPickOpens: Story = {
  args: { cards: [RELATED_RAIL_SOLD_OUT] },
  play: async ({ canvasElement, args }) => {
    const [tile] = tiles(canvasElement);
    expect(tile).toHaveAttribute("data-sold-out", "true");
    expect(
      within(tile).getByText(RELATED_RAIL_COPY.card.soldOut),
    ).toBeVisible();
    const controls = within(tile).getAllByRole("button", {
      name: RELATED_RAIL_SOLD_OUT.name,
    });
    expect(controls).toHaveLength(2);
    const [photoWell] = controls;
    await userEvent.click(photoWell);
    expect(args.onCardClick).toHaveBeenCalledWith(RELATED_RAIL_SOLD_OUT.id);
  },
};

/** Narrow viewport: as the frame draws it; the frame is awaited. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
