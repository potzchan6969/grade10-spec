import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CartItem } from "./cart-drawer";
import {
  DEFAULT_CART_COPY,
  PICTURE_CART_ITEM,
  SAMPLE_CART_ITEMS,
} from "./fixtures";

const container: Decorator[] = [
  (Story) => (
    // Match drawer body inset (`px-6`) so the item fills the content column.
    <div className="w-(--container-md) overflow-hidden rounded-2xl border border-border bg-sidebar px-6 py-4">
      <Story />
    </div>
  ),
];

/** Product picture: supplied, missing, empty and sold out. */
const meta = {
  title: "Store/Cart/Blocks/CartItem/Picture",
  component: CartItem,
  decorators: container,
  args: {
    item: SAMPLE_CART_ITEMS[0],
    copy: DEFAULT_CART_COPY.item,
    onQuantityChange: fn(),
    onRemove: fn(),
    onClickProduct: fn(),
  },
} satisfies Meta<typeof CartItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const pictureActions: Story["play"] = async ({ canvasElement, args }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole("button", { name: "Gengar VMAX" }));
  expect(args.onClickProduct).toHaveBeenCalledTimes(1);
  if (args.item.status !== "soldOut") {
    await userEvent.click(
      canvas.getByRole("button", { name: "Increase quantity" }),
    );
    expect(args.onQuantityChange).toHaveBeenCalledWith(2);
    await userEvent.click(
      canvas.getByRole("button", { name: "Decrease quantity" }),
    );
    expect(args.onQuantityChange).toHaveBeenCalledWith(1);
  }
  await userEvent.click(canvas.getByRole("button", { name: "Remove item" }));
  expect(args.onRemove).toHaveBeenCalledTimes(1);
};

export const Picture: Story = {
  args: { item: PICTURE_CART_ITEM },
  play: pictureActions,
};
export const PictureWithoutAlt: Story = {
  args: { item: { ...PICTURE_CART_ITEM, imageAlt: undefined } },
};
export const PictureWithEmptyAlt: Story = {
  args: { item: { ...PICTURE_CART_ITEM, imageAlt: "" } },
};
export const PictureWithWhitespaceAlt: Story = {
  args: { item: { ...PICTURE_CART_ITEM, imageAlt: "  " } },
};
export const WithoutPicture: Story = {
  args: { item: { ...PICTURE_CART_ITEM, imageSrc: undefined } },
  play: pictureActions,
};
export const EmptyPictureSource: Story = {
  args: { item: { ...PICTURE_CART_ITEM, imageSrc: "" } },
  play: pictureActions,
};
export const SoldOutPicture: Story = {
  args: { item: { ...PICTURE_CART_ITEM, status: "soldOut" } },
  play: pictureActions,
};
