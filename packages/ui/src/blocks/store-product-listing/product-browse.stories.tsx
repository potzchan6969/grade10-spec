import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, waitFor, within } from "storybook/test";
import { ProductBrowse } from "./product-browse";
import {
  InteractiveProductBrowse,
  productBrowseArgs,
} from "./product-browse.story-shared";

const meta = {
  title: "Store Product Listing/ProductBrowse",
  component: ProductBrowse,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => <InteractiveProductBrowse {...args} />,
  args: {
    ...productBrowseArgs,
    onFilterChange: fn(),
    onGroupExpand: fn(),
    onSearchChange: fn(),
    onSortChange: fn(),
    onClearFilters: fn(),
    onLoadMore: fn(),
    onProductCartQuantityChange: fn(),
  },
} satisfies Meta<typeof ProductBrowse>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("complementary", { name: "Store filters" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("region", { name: "Products" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).not.toBeChecked();
    expect(
      canvas.getByRole("checkbox", { name: /Booster Box/ }),
    ).not.toBeChecked();
    await waitFor(() => {
      expect(
        canvas.getAllByText(/Pokémon TCG Sealed Booster Box – Abyss Eye \(M5\)/)
          .length,
      ).toBeGreaterThan(0);
    });
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
