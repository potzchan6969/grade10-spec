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
  parameters: {
    verification: { caseId: "vc_d57ebcd4-c56a-4e02-8ae5-f1c24a787f6e" },
  },
  args: { item: PICTURE_CART_ITEM },
  play: pictureActions,
};
export const PictureWithoutAlt: Story = {
  parameters: {
    verification: { caseId: "vc_385c65e9-717d-498b-8d60-5fe2e3170eaf" },
  },
  args: { item: { ...PICTURE_CART_ITEM, imageAlt: undefined } },
};
export const PictureWithEmptyAlt: Story = {
  parameters: {
    verification: { caseId: "vc_dc3923c6-5734-4eea-bb63-b5697af6a96b" },
  },
  args: { item: { ...PICTURE_CART_ITEM, imageAlt: "" } },
};
export const PictureWithWhitespaceAlt: Story = {
  parameters: {
    verification: { caseId: "vc_84a971c4-616c-4ca6-a494-679580d35e20" },
  },
  args: { item: { ...PICTURE_CART_ITEM, imageAlt: "  " } },
};
export const WithoutPicture: Story = {
  parameters: {
    verification: { caseId: "vc_5e3d93dc-57ed-47ea-8457-694a1867d089" },
  },
  args: { item: { ...PICTURE_CART_ITEM, imageSrc: undefined } },
  play: pictureActions,
};
export const EmptyPictureSource: Story = {
  parameters: {
    verification: { caseId: "vc_90a6cecd-5819-4705-b942-f8f240cde786" },
  },
  args: { item: { ...PICTURE_CART_ITEM, imageSrc: "" } },
  play: pictureActions,
};
export const SoldOutPicture: Story = {
  parameters: {
    verification: { caseId: "vc_f2cef7d7-5f88-484e-865a-f60f9a3ed3c9" },
  },
  args: { item: { ...PICTURE_CART_ITEM, status: "soldOut" } },
  play: pictureActions,
};
