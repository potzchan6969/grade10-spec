import type { Meta, StoryObj } from "@storybook/react-vite";
import { LISTING_COPY } from "./fixtures";
import { ProductResultsPanel } from "./product-results-panel";

const meta = {
  title: "Store Product Listing/ProductResultsPanel",
  component: ProductResultsPanel,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: { copy: LISTING_COPY },
} satisfies Meta<typeof ProductResultsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    results: { status: "loading" },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-6xl p-6">
        <Story />
      </div>
    ),
  ],
};
