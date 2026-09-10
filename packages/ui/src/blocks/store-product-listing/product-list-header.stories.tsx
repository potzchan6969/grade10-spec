import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { APPLIED_FILTERS } from "./fixtures";
import { ProductListHeader } from "./product-list-header";
import {
  productListHeaderArgs,
  SORT_TRIGGER,
} from "./product-list-header.story-shared";

const meta = {
  title: "Store Product Listing/ProductListHeader",
  component: ProductListHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    ...productListHeaderArgs,
    onSortChange: fn(),
    onFilterChange: fn(),
    onClearFilters: fn(),
  },
} satisfies Meta<typeof ProductListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("100 Products")).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: SORT_TRIGGER }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Pokémon" })).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Booster Box" }),
    ).toBeInTheDocument();
  },
};

/** No applied-filter region when none are supplied. */
export const NoAppliedFilters: Story = {
  args: { appliedFilters: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("100 Products")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Pokémon" }),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Clear filters" }),
    ).not.toBeInTheDocument();
  },
};

/** Free-text search sits among applied filters as a dismissible chip. */
export const SearchChip: Story = {
  args: {
    appliedFilters: [
      { groupId: "search", optionId: "abyss", label: 'Search: "abyss"' },
      ...APPLIED_FILTERS,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: 'Search: "abyss"' }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Pokémon" })).toBeInTheDocument();
  },
};
