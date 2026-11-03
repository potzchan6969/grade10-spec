import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { PRODUCT_CARD_CART_COPY } from "./fixtures";
import { ProductCardImage } from "./product-card-image";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;
const PORTRAIT = new URL("./product-card.portrait.fixture.png", import.meta.url)
  .href;
const LANDSCAPE = new URL(
  "./product-card.landscape.fixture.png",
  import.meta.url,
).href;
const SMALL = new URL("./product-card.small.fixture.png", import.meta.url).href;

const defaults = {
  copy: PRODUCT_CARD_CART_COPY,
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  onCartQuantityChange: fn(),
};

const meta = {
  title: "Store/Product Listing/Blocks/ProductCardImage",
  component: ProductCardImage,
  tags: ["autodocs"],
  args: defaults,
} satisfies Meta<typeof ProductCardImage>;

export default meta;
type Story = StoryObj<typeof meta>;

const well: Decorator[] = [
  (Story) => (
    <div className="w-[260px]">
      <Story />
    </div>
  ),
];

type Box = { left: number; top: number; right: number; bottom: number };

/** The box inside a well's 1px border, which the photo fills. */
function innerBox(well: HTMLElement): Box {
  const rect = well.getBoundingClientRect();
  const left = rect.left + well.clientLeft;
  const top = rect.top + well.clientTop;
  return {
    left,
    top,
    right: left + well.clientWidth,
    bottom: top + well.clientHeight,
  };
}

/** Where a value of `object-position` puts the photo along one axis. */
function offset(position: string, free: number) {
  if (position.endsWith("%")) return (free * Number.parseFloat(position)) / 100;
  return Number.parseFloat(position);
}

/**
 * The box a decoded photo is painted in, from its own size and the element's
 * box under its computed `object-fit` and `object-position` - what the
 * shopper sees, not a class name.
 */
async function paintedBox(img: HTMLImageElement): Promise<Box> {
  await img.decode();
  const rect = img.getBoundingClientRect();
  const style = getComputedStyle(img);
  const contain = Math.min(
    rect.width / img.naturalWidth,
    rect.height / img.naturalHeight,
  );
  const cover = Math.max(
    rect.width / img.naturalWidth,
    rect.height / img.naturalHeight,
  );
  const scales: Record<string, [number, number]> = {
    contain: [contain, contain],
    cover: [cover, cover],
    none: [1, 1],
    "scale-down": [Math.min(1, contain), Math.min(1, contain)],
    fill: [rect.width / img.naturalWidth, rect.height / img.naturalHeight],
  };
  const [sx, sy] = scales[style.objectFit];
  const width = img.naturalWidth * sx;
  const height = img.naturalHeight * sy;
  const [px, py] = style.objectPosition.split(" ");
  const left = rect.left + offset(px, rect.width - width);
  const top = rect.top + offset(py, rect.height - height);
  return { left, top, right: left + width, bottom: top + height };
}

const NEAR = 0.75;

/**
 * The photo inside its square well, centred, meeting the two edges along its
 * longer side; where `clearCorners`, the space it leaves on each side is at
 * least the well's corner radius.
 */
async function expectWholePhoto(slot: HTMLElement, clearCorners: boolean) {
  const well = slot.querySelector(
    '[data-slot="product-card-image-well"]',
  ) as HTMLElement;
  const img = well.querySelector("img") as HTMLImageElement;
  const inner = innerBox(well);
  const painted = await paintedBox(img);
  const innerWidth = inner.right - inner.left;
  const innerHeight = inner.bottom - inner.top;
  expect(Math.abs(innerWidth - innerHeight)).toBeLessThan(NEAR);
  for (const [a, b] of [
    [painted.left, inner.left],
    [painted.top, inner.top],
    [inner.right, painted.right],
    [inner.bottom, painted.bottom],
  ]) {
    expect(a).toBeGreaterThanOrEqual(b - NEAR);
  }
  const portrait = img.naturalHeight >= img.naturalWidth;
  const [nearStart, nearEnd, farStart, farEnd] = portrait
    ? [
        painted.top - inner.top,
        inner.bottom - painted.bottom,
        painted.left - inner.left,
        inner.right - painted.right,
      ]
    : [
        painted.left - inner.left,
        inner.right - painted.right,
        painted.top - inner.top,
        inner.bottom - painted.bottom,
      ];
  expect(Math.abs(nearStart)).toBeLessThan(NEAR);
  expect(Math.abs(nearEnd)).toBeLessThan(NEAR);
  expect(Math.abs(farStart - farEnd)).toBeLessThan(NEAR);
  if (clearCorners) {
    const radius = Number.parseFloat(
      getComputedStyle(well).borderTopLeftRadius,
    );
    expect(farStart).toBeGreaterThanOrEqual(radius);
  }
  return img;
}

/** The photo as supplied: never blended into the well. */
function expectAsSupplied(canvasElement: HTMLElement, opacity: string) {
  const photo = canvasElement.querySelector("img") as HTMLImageElement;
  expect(getComputedStyle(photo).mixBlendMode).toBe("normal");
  expect(getComputedStyle(photo).opacity).toBe(opacity);
}

/**
 * Scenarios: shared-ui-store-product-listing-SC-63a - A photo that reaches
 * the well's corners rounds with them; shared-ui-store-product-listing-SC-64 -
 * An available photo is drawn as supplied. The square photo meets all four
 * edges of a square well that clips to its rounded corners, unblended.
 */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_293495a9-c41b-4779-870d-4ae7ecc0217e" },
  },
  decorators: well,
  play: async ({ canvasElement }) => {
    const slot = canvasElement.querySelector(
      '[data-slot="product-card-image"]',
    ) as HTMLElement;
    const well = slot.querySelector(
      '[data-slot="product-card-image-well"]',
    ) as HTMLElement;
    const img = await expectWholePhoto(slot, false);
    const inner = innerBox(well);
    const painted = await paintedBox(img);
    expect(Math.abs(painted.left - inner.left)).toBeLessThan(NEAR);
    expect(Math.abs(painted.top - inner.top)).toBeLessThan(NEAR);
    expect(Math.abs(inner.right - painted.right)).toBeLessThan(NEAR);
    expect(Math.abs(inner.bottom - painted.bottom)).toBeLessThan(NEAR);
    expect(getComputedStyle(well).overflow).toBe("hidden");
    expect(
      Number.parseFloat(getComputedStyle(well).borderTopLeftRadius),
    ).toBeGreaterThan(0);
    expectAsSupplied(canvasElement, "1");
  },
};

/** Scenario: shared-ui-store-product-listing-SC-64 - An on-sale photo is
 * drawn as supplied. */
export const Sale: Story = {
  parameters: {
    verification: { caseId: "vc_b3c0a24f-f403-4420-89bb-638c0d33ca29" },
  },
  args: { discounted: true },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SALE")).toBeInTheDocument();
    expectAsSupplied(canvasElement, "1");
  },
};

/** Scenario: shared-ui-store-product-listing-SC-64a - A sold-out photo takes
 * the sold-out treatment unblended. */
export const SoldOut: Story = {
  parameters: {
    verification: { caseId: "vc_9b53490d-9e17-48a8-8ddd-94d381bb66db" },
  },
  args: { soldOut: true },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SOLD OUT")).toBeVisible();
    expect(canvas.queryByText("SALE")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();
    expectAsSupplied(canvasElement, "0.5");
  },
};

/** Scenario: shared-ui-store-product-listing-SC-64 - An in-cart photo is
 * drawn as supplied. */
export const InCart: Story = {
  parameters: {
    verification: { caseId: "vc_f242365b-11ba-4972-9873-73a18f1a17f0" },
  },
  args: { inCart: true, cartCount: "1" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: /1\./i })).toBeVisible();
    expect(canvas.getByText("×1")).toBeInTheDocument();
    expectAsSupplied(canvasElement, "1");
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-63 - The whole photo is
 * visible. A portrait photo shot on white in available, on-sale, sold-out and
 * in-cart wells, then a landscape photo and a portrait smaller than the well:
 * each whole, centred, meeting the well's two edges along its longer side.
 */
export const NonSquarePhoto: Story = {
  parameters: {
    verification: { caseId: "vc_74d72c65-6efb-481c-8d85-1f93cf09c145" },
  },
  name: "Non Square Photo",
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      {[
        { imageSrc: PORTRAIT },
        { imageSrc: PORTRAIT, discounted: true },
        { imageSrc: PORTRAIT, soldOut: true },
        { imageSrc: PORTRAIT, inCart: true, cartCount: "1" },
        { imageSrc: LANDSCAPE },
        { imageSrc: SMALL },
      ].map((well) => (
        <div className="w-[200px]" key={JSON.stringify(well)}>
          <ProductCardImage {...args} {...well} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const slots = [
      ...canvasElement.querySelectorAll('[data-slot="product-card-image"]'),
    ] as HTMLElement[];
    expect(slots).toHaveLength(6);
    for (const slot of slots) await expectWholePhoto(slot, true);
    const soldOut = slots[2].querySelector("img") as HTMLImageElement;
    expect(Number(getComputedStyle(soldOut).opacity)).toBeLessThan(1);
  },
};

export const NoImage: Story = {
  parameters: {
    verification: { caseId: "vc_6daa885c-967b-4f92-b9a3-bcd952cc47d3" },
  },
  args: { imageSrc: undefined },
  decorators: well,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("img")).toBeNull();
  },
};

/** Keyboard focus reveals the cart control and activating it reports quantity 1. */
export const KeyboardRevealsCart: Story = {
  parameters: {
    verification: { caseId: "vc_9e0e0302-a12a-4712-9895-c949cac76a7c" },
  },
  args: { onCartQuantityChange: fn() },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });

    cart.focus();
    expect(cart).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    expect(args.onCartQuantityChange).toHaveBeenCalledTimes(1);
    expect(args.onCartQuantityChange).toHaveBeenCalledWith(1);
  },
};

/**
 * `SC-66` — below the wide listing breakpoint the cart stays visible without
 * hover (Storybook mobile viewport).
 */
export const NarrowViewportCartVisible: Story = {
  args: { onCartQuantityChange: fn(), name: "Ninja Spinner booster box" },
  parameters: {
    verification: { caseId: "vc_932e427a-324b-401b-8712-e1a23b4fec28" },
    viewport: { defaultViewport: "mobile1" },
  },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });
    expect(cart).toBeVisible();
    const control = cart.closest(".cart-control");
    expect(control).not.toBeNull();
    expect(getComputedStyle(control as HTMLElement).opacity).toBe("1");
  },
};

/**
 * `SC-55` — a surface that merchandises rather than sells supplies no
 * quantity-change handler, so no cart control is drawn at rest, on hover, or
 * on focus. The tile itself still activates.
 */
export const DoesNotSell: Story = {
  parameters: {
    verification: { caseId: "vc_6be2fcc6-e2b8-43df-bc84-cfd04fb1c2c8" },
  },
  args: {
    copy: { soldOut: "SOLD OUT", sale: "SALE" },
    name: "Ninja Spinner booster box",
    onClick: fn(),
  },
  decorators: well,
  render: (args) => (
    <ProductCardImage {...args} onCartQuantityChange={undefined} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const tile = canvas.getByRole("button", {
      name: "Ninja Spinner booster box",
    });

    await userEvent.hover(tile);
    expect(
      canvas.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();

    tile.focus();
    expect(
      canvas.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();

    await userEvent.click(tile);
    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Scenario: shared-ui-store-product-listing-SC-64a - A sold-out image
 * that opens keeps its treatment unblended. The image applies the tile's
 * rule: sold out, given a handler and no cart handler, it opens. */
export const SoldOutWithHandler: Story = {
  parameters: {
    verification: { caseId: "vc_257ecc79-b86c-459c-aa4c-b78f483f1073" },
  },
  args: {
    copy: { soldOut: "SOLD OUT", sale: "SALE" },
    name: "Ninja Spinner booster box",
    soldOut: true,
    onClick: fn(),
  },
  decorators: well,
  render: (args) => (
    <ProductCardImage {...args} onCartQuantityChange={undefined} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const [well] = canvas.getAllByRole("button", {
      name: "Ninja Spinner booster box",
    });
    expect(canvas.getAllByRole("button")).toHaveLength(1);
    expect(canvas.getByText("SOLD OUT")).toBeVisible();
    expectAsSupplied(canvasElement, "0.5");
    await userEvent.click(well);
    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Scenario: shared-ui-store-product-listing-SC-101 - The image used alone
 * opens by the tile's rule, as its own stop: Tab lands on the one control
 * named for the product, and Enter reports once. */
export const OpensAlone: Story = {
  parameters: {
    verification: { caseId: "vc_bfa7c504-30e6-458f-ad8e-f282952c1d2f" },
  },
  args: { name: "Ninja Spinner booster box", onClick: fn() },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("button", {
      name: "Ninja Spinner booster box",
    });
    expect(
      canvas.getAllByRole("button", { name: "Ninja Spinner booster box" }),
    ).toHaveLength(1);
    await userEvent.tab();
    expect(control).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/** Scenario: shared-ui-store-product-listing-SC-101 - The image used alone,
 * sold out where it sells, stays inert: pressing the photo reports nothing,
 * and no link or button is drawn. */
export const SoldOutWhereItSells: Story = {
  parameters: {
    verification: { caseId: "vc_53365e47-4c3f-47a7-b49a-f2021119a529" },
  },
  args: {
    copy: { soldOut: "SOLD OUT", sale: "SALE" },
    name: "Ninja Spinner booster box",
    soldOut: true,
    onClick: fn(),
    onCartQuantityChange: fn(),
  },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvasElement.querySelector("img") as HTMLElement);
    expect(args.onClick).not.toHaveBeenCalled();
    expect(canvas.queryAllByRole("button")).toHaveLength(0);
    expect(canvas.queryAllByRole("link")).toHaveLength(0);
  },
};
