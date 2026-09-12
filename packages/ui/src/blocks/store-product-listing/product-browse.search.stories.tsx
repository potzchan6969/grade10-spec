import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductBrowse } from "./product-browse";
import {
  productBrowseArgs,
  SearchInteractiveBrowse,
} from "./product-browse.story-shared";

const meta = {
  title: "Store Product Listing/ProductBrowse/Search",
  component: ProductBrowse,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  render: (args) => <SearchInteractiveBrowse {...args} />,
  args: {
    ...productBrowseArgs,
    onFilterChange: fn(),
    onGroupExpand: fn(),
    onSearchChange: fn(),
    onSearchCommit: fn(),
    onSearchSuggestionSelect: fn(),
    onSortChange: fn(),
    onClearFilters: fn(),
    onLoadMore: fn(),
    onProductClick: fn(),
    onProductCartQuantityChange: fn(),
  },
} satisfies Meta<typeof ProductBrowse>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typing offers suggestions; Enter commits a Search chip above the grid. */
export const SuggestionsAndCommit: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "abyss");
    expect(
      await within(document.body).findByRole("listbox"),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect(
      canvas.getByRole("button", { name: 'Search: "abyss"' }),
    ).toBeInTheDocument();
  },
};

/** Picking a filter suggestion applies that facet chip, not a search chip. */
export const SelectFilterAppliesChip: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "Pokémon");
    const option = await within(document.body).findByRole("option", {
      name: /Pokémon.*World/,
    });
    await userEvent.click(option);
    expect(canvas.getByRole("button", { name: "Pokémon" })).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: /Search:/ }),
    ).not.toBeInTheDocument();
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).toBeChecked();
    expect(field).toHaveValue("");
    expect(args.onSearchSuggestionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "worlds:pokemon" }),
      "filters",
    );
    expect(args.onSearchCommit).not.toHaveBeenCalled();
  },
};
