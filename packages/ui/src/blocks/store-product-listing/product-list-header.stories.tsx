import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { APPLIED_FILTERS } from "./fixtures";
import { ProductListHeader } from "./product-list-header";
import {
  productListHeaderArgs,
  SORT_TRIGGER,
} from "./product-list-header.story-shared";

const meta = {
  title: "Store/Product Listing/Blocks/ProductListHeader",
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
  parameters: {
    verification: { caseId: "vc_35b8a477-a35d-4d95-a1af-c0216b7ef287" },
  },
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
  parameters: {
    verification: { caseId: "vc_458545f9-5e7d-4c48-bc74-d4311b7fff62" },
  },
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
  parameters: {
    verification: { caseId: "vc_ac430b70-f32a-4cab-8d64-0c546d2fa2ec" },
  },
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
