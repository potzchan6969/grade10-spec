import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FILTER_GROUPS } from "./fixtures";
import { ProductFilter } from "./product-filter";

const meta = {
  title: "Store Product Listing/ProductFilter",
  component: ProductFilter,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
  args: {
    heading: "Filter",
    searchPlaceholder: "Find product",
    searchLabel: "Search products",
    groups: { status: "ready", data: FILTER_GROUPS },
    selection: {},
    onFilterChange: fn(),
    onGroupExpand: fn(),
    onSearchChange: fn(),
  },
} satisfies Meta<typeof ProductFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma set `Product / Product Filter` (`4357:527`). */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Filter" })).toBeInTheDocument();
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).not.toBeChecked();
  },
};

export const WithSelection: Story = {
  args: { selection: { worlds: ["pokemon"], types: ["booster-box"] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).toBeChecked();
    expect(canvas.getByRole("checkbox", { name: /Booster Box/ })).toBeChecked();
  },
};

export const Loading: Story = {
  args: { groups: { status: "loading" } },
};

export const FilterChangeIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: /Pokémon/ }));
    expect(args.onFilterChange).toHaveBeenCalledWith("worlds", "pokemon", true);
  },
};
