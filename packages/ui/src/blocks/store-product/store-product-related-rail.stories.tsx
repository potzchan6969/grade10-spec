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

/** The rail the canvas drew: the region its heading names. */
function rail(canvasElement: HTMLElement) {
  return within(canvasElement).getByRole("region", {
    name: RELATED_RAIL_COPY.heading,
  });
}

/** The tiles the rail drew, in document order: the card's own root. */
function tiles(canvasElement: HTMLElement) {
  return Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[data-slot="product-card"]'),
  );
}

/** The row the tiles sit in. */
function row(canvasElement: HTMLElement) {
  return canvasElement.querySelector(
    '[data-slot="store-product-related-rail-row"]',
  ) as HTMLElement;
}

/** A tile's name: the link to its card. */
function nameLink(tile: HTMLElement) {
  return tile.querySelector(
    '[data-slot="product-card-content"] a',
  ) as HTMLAnchorElement;
}

/** grade10-site-store-cross-sell-SC-26: the rail is a region named by its
 * heading, draws what it is given, in order, each tile a link to its card,
 * sells nothing and draws no browse-all link under its heading. The suite's
 * grade10-site-store-cross-sell-US1-TC4-1 credits this story with the cart
 * control's absence. */
export const PicksAndSimilar: Story = {
  play: async ({ canvasElement, args }) => {
    const region = rail(canvasElement);
    expect(
      within(region).getByRole("heading", { name: RELATED_RAIL_COPY.heading }),
    ).toBeVisible();
    const drawn = tiles(canvasElement);
    expect(drawn.map((tile) => nameLink(tile).textContent)).toEqual(
      RELATED_RAIL_STORY.map((card) => card.name),
    );
    for (const [index, tile] of drawn.entries()) {
      const links = within(tile).getAllByRole("link", {
        name: RELATED_RAIL_STORY[index].name,
      });
      expect(links).toHaveLength(2);
      for (const link of links) {
        expect(link).toHaveAttribute("href", RELATED_RAIL_STORY[index].href);
      }
    }
    const header = region.querySelector(
      '[data-slot="store-section-header"]',
    ) as HTMLElement;
    expect(within(header).queryByRole("link")).toBeNull();
    expect(
      region.querySelector('[data-slot="product-card-cart-control"]'),
    ).toBeNull();
    const last = drawn.at(-1) as HTMLElement;
    expect(last).toHaveAttribute("data-sold-out", "true");
    expect(
      within(last).getByText(RELATED_RAIL_COPY.card.soldOut),
    ).toBeVisible();
    await userEvent.click(nameLink(drawn[0]));
    expect(args.onCardClick).toHaveBeenCalledWith(RELATED_RAIL_STORY[0].id);
  },
};

/** shared-ui-store-product-listing-SC-93 on the rail: a press with a
 * modifier key is the browser's, so the tile's link opens where the browser
 * puts it, a new tab or window, and the rail reports nothing. */
export const ModifiedPressOpensElsewhere: Story = {
  play: async ({ canvasElement, args }) => {
    const link = nameLink(tiles(canvasElement)[0]);
    let prevented: boolean | undefined;
    /* Runs after the tile's own handler, records what it decided, then stops
       the story's frame from following the link. */
    window.addEventListener(
      "click",
      (event) => {
        prevented = event.defaultPrevented;
        event.preventDefault();
      },
      { once: true },
    );
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        button: 0,
        cancelable: true,
        ctrlKey: true,
      }),
    );
    expect(prevented).toBe(false);
    expect(args.onCardClick).not.toHaveBeenCalled();
  },
};

/** A rail of one card keeps its heading and its one tile. */
export const OneCard: Story = {
  args: { cards: [RELATED_RAIL_STORY[0]] },
  play: async ({ canvasElement }) => {
    const region = rail(canvasElement);
    expect(
      within(region).getByRole("heading", { name: RELATED_RAIL_COPY.heading }),
    ).toBeVisible();
    expect(tiles(canvasElement)).toHaveLength(1);
  },
};

/** shared-ui-store-product-listing-SC-91 on the rail: a sold-out pick keeps
 * its treatment and still opens its card, from the photo well as from the
 * name. It takes the focus ring and the photo's grow on hover like any other
 * tile, over its dim photo. */
export const SoldOutPickOpens: Story = {
  args: { cards: [RELATED_RAIL_SOLD_OUT] },
  play: async ({ canvasElement, args }) => {
    const [tile] = tiles(canvasElement);
    expect(tile).toHaveAttribute("data-sold-out", "true");
    expect(
      within(tile).getByText(RELATED_RAIL_COPY.card.soldOut),
    ).toBeVisible();
    const controls = within(tile).getAllByRole("link", {
      name: RELATED_RAIL_SOLD_OUT.name,
    });
    expect(controls).toHaveLength(2);
    const [photoWell, nameControl] = controls;
    await userEvent.tab();
    expect(photoWell).toHaveFocus();
    const photo = tile.querySelector(
      '[data-slot="product-card-image-well"] img',
    ) as HTMLImageElement;
    expect(photo.className).toContain("opacity-50");
    expect(photo.className).toContain(
      "group-hover/product-card-image:scale-105",
    );
    await userEvent.click(photoWell);
    await userEvent.click(nameControl);
    expect(args.onCardClick).toHaveBeenCalledTimes(2);
    expect(args.onCardClick).toHaveBeenCalledWith(RELATED_RAIL_SOLD_OUT.id);
    expect(
      within(tile).getByText(String(RELATED_RAIL_SOLD_OUT.price)),
    ).toBeVisible();
  },
};

/** A narrow screen: two whole tiles and part of the third show, the row
 * scrolls sideways, and each tile snaps to its start. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const scroller = row(canvasElement);
    expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    expect(getComputedStyle(scroller).scrollSnapType).toBe("x mandatory");
    const edge = scroller.getBoundingClientRect().right;
    const [, second, third] = tiles(canvasElement).map((tile) =>
      tile.getBoundingClientRect(),
    );
    expect(second.right).toBeLessThanOrEqual(edge);
    expect(third.left).toBeLessThan(edge);
    expect(third.right).toBeGreaterThan(edge);
  },
};

/** A wide page: six tiles fit side by side, and nothing scrolls. */
export const Wide: Story = {
  args: { cards: RELATED_RAIL_STORY.slice(0, 6) },
  decorators: [
    (Story) => (
      <div style={{ width: 1216 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const scroller = row(canvasElement);
    expect(tiles(canvasElement)).toHaveLength(6);
    expect(scroller.scrollWidth).toBeLessThanOrEqual(scroller.clientWidth);
  },
};
