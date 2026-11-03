import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { DESCRIPTION_COPY, PRODUCT_DETAIL_STORY } from "./fixtures";
import { StoreProductDescription } from "./store-product-description";

const meta = {
  title: "Store/Product Page/Blocks/StoreProductDescription",
  component: StoreProductDescription,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
  args: { copy: DESCRIPTION_COPY },
} satisfies Meta<typeof StoreProductDescription>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_69762f85-9689-4752-9bf6-260a8aac86fd" },
  },
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
  parameters: {
    verification: { caseId: "vc_607915b3-cf23-46f2-a7ed-c6113ef43d4d" },
  },
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
