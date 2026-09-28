import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  RELATED_RAIL_COPY,
  RELATED_RAIL_LONG_NAME,
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

/** The tiles under `root`, in document order: the card's own root. */
function tiles(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>('[data-slot="product-card"]'),
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

/** Whether a tile shows whole inside the row, give or take a pixel. */
function whole(tile: HTMLElement, scroller: HTMLElement) {
  const edge = scroller.getBoundingClientRect();
  const box = tile.getBoundingClientRect();
  return box.left >= edge.left - 1 && box.right <= edge.right + 1;
}

/** The rail drawn at a width of its own, whatever the screen: the row
 * answers the width it is given. */
const box =
  (width: number): Decorator =>
  (Story) => (
    <div data-testid="rail-box" style={{ width }}>
      <Story />
    </div>
  );

/** The row scrolls sideways, snapping to each tile's start, and shows the
 * first `shownWhole` tiles whole and part of the next. */
function expectScrollingRow(canvasElement: HTMLElement, shownWhole: number) {
  const scroller = row(canvasElement);
  expect(getComputedStyle(scroller).overflowX).toBe("auto");
  expect(getComputedStyle(scroller).scrollSnapType).toBe("x mandatory");
  expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
  const drawn = tiles(canvasElement);
  expect(getComputedStyle(drawn[0]).scrollSnapAlign).toBe("start");
  for (const tile of drawn.slice(0, shownWhole)) {
    expect(whole(tile, scroller)).toBe(true);
  }
  const next = drawn[shownWhole].getBoundingClientRect();
  const edge = scroller.getBoundingClientRect().right;
  expect(next.left).toBeLessThan(edge);
  expect(next.right).toBeGreaterThan(edge);
}

/** grade10-site-store-cross-sell-SC-26: the rail is a region named by its
 * heading, holding what it is given, in order, each tile a link to its card;
 * it sells nothing and draws no browse-all link under its heading. The
 * suite's grade10-site-store-cross-sell-US1-TC4-1 credits this story with the
 * cart control's absence. */
export const PicksAndSimilar: Story = {
  play: async ({ canvasElement, args }) => {
    const region = rail(canvasElement);
    expect(
      within(region).getByRole("heading", { name: RELATED_RAIL_COPY.heading }),
    ).toBeVisible();
    const drawn = tiles(region);
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
    const link = nameLink(tiles(rail(canvasElement))[0]);
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
    const user = userEvent.setup();
    await user.keyboard("{Control>}");
    await user.click(link);
    await user.keyboard("{/Control}");
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
    expect(tiles(region)).toHaveLength(1);
  },
};

/** shared-ui-store-product-listing-SC-91 on the rail: a sold-out pick keeps
 * its treatment and price, and still opens its card from the photo well as
 * from the name. */
export const SoldOutPickOpens: Story = {
  args: { cards: [RELATED_RAIL_SOLD_OUT] },
  play: async ({ canvasElement, args }) => {
    const [tile] = tiles(rail(canvasElement));
    expect(tile).toHaveAttribute("data-sold-out", "true");
    expect(
      within(tile).getByText(RELATED_RAIL_COPY.card.soldOut),
    ).toBeVisible();
    const controls = within(tile).getAllByRole("link", {
      name: RELATED_RAIL_SOLD_OUT.name,
    });
    expect(controls).toHaveLength(2);
    for (const control of controls) await userEvent.click(control);
    expect(args.onCardClick).toHaveBeenCalledTimes(2);
    expect(args.onCardClick).toHaveBeenCalledWith(RELATED_RAIL_SOLD_OUT.id);
    expect(
      within(tile).getByText(String(RELATED_RAIL_SOLD_OUT.price)),
    ).toBeVisible();
  },
};

/** A phone: two whole tiles and part of the third. A long discounted name is
 * held to two lines, and its two prices stay inside the tile. */
export const Narrow: Story = {
  args: { cards: [RELATED_RAIL_LONG_NAME, ...RELATED_RAIL_STORY.slice(0, 5)] },
  decorators: [box(360)],
  play: async ({ canvasElement }) => {
    expectScrollingRow(canvasElement, 2);
    const [dear] = tiles(canvasElement);

    const longName = nameLink(dear);
    const lineHeight = Number.parseFloat(getComputedStyle(longName).lineHeight);
    expect(longName.getBoundingClientRect().height).toBeLessThanOrEqual(
      lineHeight * 2 + 1,
    );

    const edge = dear.getBoundingClientRect();
    for (const price of [
      RELATED_RAIL_LONG_NAME.price,
      RELATED_RAIL_LONG_NAME.originalPrice,
    ]) {
      const shown = within(dear)
        .getByText(String(price))
        .getBoundingClientRect();
      expect(shown.left).toBeGreaterThanOrEqual(edge.left - 1);
      expect(shown.right).toBeLessThanOrEqual(edge.right + 1);
    }
  },
};

/** A wide page: from 1152px six tiles fit side by side and nothing scrolls;
 * a pixel narrower and the row scrolls again. */
export const Wide: Story = {
  args: { cards: RELATED_RAIL_STORY.slice(0, 6) },
  decorators: [box(1152)],
  play: async ({ canvasElement }) => {
    const scroller = row(canvasElement);
    const drawn = tiles(canvasElement);
    expect(drawn).toHaveLength(6);
    expect(scroller.scrollWidth).toBeLessThanOrEqual(scroller.clientWidth);
    for (const tile of drawn) expect(whole(tile, scroller)).toBe(true);

    const frame = within(canvasElement).getByTestId("rail-box");
    frame.style.width = "1151px";
    try {
      expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
    } finally {
      frame.style.width = "1152px";
    }
  },
};
