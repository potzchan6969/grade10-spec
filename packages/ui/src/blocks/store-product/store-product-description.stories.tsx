import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { DESCRIPTION_COPY, PRODUCT_DETAIL_STORY } from "./fixtures";
import { StoreProductDescription } from "./store-product-description";

const meta = {
  title: "Store Product/Product Description",
  component: StoreProductDescription,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: DESCRIPTION_COPY },
} satisfies Meta<typeof StoreProductDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { description: PRODUCT_DETAIL_STORY.description },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const showMore = canvas.getByRole("button", { name: "Show more" });
    expect(showMore).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(showMore);
    expect(canvas.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  },
};

export const Short: Story = {
  args: {
    copy: DESCRIPTION_COPY,
    description: "A sealed collector item.",
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: /Show/ }),
    ).toBeNull();
  },
};
