import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductFilter } from "./product-filter";
import {
  InteractiveSearchFilter,
  productFilterArgs,
} from "./product-filter.story-shared";

const meta = {
  title: "Store Product Listing/ProductFilter/Search",
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
  render: (args) => <InteractiveSearchFilter {...args} />,
  args: {
    ...productFilterArgs,
    onFilterChange: fn(),
    onGroupExpand: fn(),
    onSearchChange: fn(),
    onSearchClear: fn(),
    onSearchCommit: fn(),
    onSearchSuggestionSelect: fn(),
  },
} satisfies Meta<typeof ProductFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Typing opens product and filter suggestion groups under the field. */
export const Suggestions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "po");
    const popup = within(document.body);
    expect(await popup.findByRole("listbox")).toBeInTheDocument();
    expect(popup.getByText("Products")).toBeInTheDocument();
    expect(popup.getByText("Filters")).toBeInTheDocument();
    expect(
      popup.getByRole("option", {
        name: /Pokémon TCG Sealed Booster Box – Abyss Eye \(M5\), item 1/,
      }),
    ).toBeInTheDocument();
    expect(
      popup.getByRole("option", { name: /Pokémon.*World/ }),
    ).toBeInTheDocument();
  },
};

/** Enter with no row highlighted commits free text. */
export const Commit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "abyss");
    await userEvent.keyboard("{Enter}");
    expect(args.onSearchCommit).toHaveBeenCalledWith("abyss");
  },
};

/** Activating a suggestion reports it and does not navigate. */
export const SelectSuggestion: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "po");
    const option = await within(document.body).findByRole("option", {
      name: /Pokémon.*World/,
    });
    await userEvent.click(option);
    expect(args.onSearchSuggestionSelect).toHaveBeenCalledTimes(1);
    expect(args.onSearchSuggestionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "worlds:pokemon" }),
      "filters",
    );
  },
};

/** Supplied empty groups show Figma empty copy; Enter still commits. */
export const Empty: Story = {
  render: (args) => <ProductFilter {...args} />,
  args: {
    searchValue: "zzz",
    searchSuggestions: [],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.click(field);
    expect(
      await within(document.body).findByText("No results found."),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect(args.onSearchCommit).toHaveBeenCalledWith("zzz");
  },
};

/** Omitting suggestion groups keeps the panel closed; Enter still commits. */
export const GroupsOmitted: Story = {
  render: (args) => <ProductFilter {...args} />,
  args: {
    searchValue: "zzz",
    searchSuggestions: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.click(field);
    await userEvent.keyboard("{Enter}");
    expect(args.onSearchCommit).toHaveBeenCalledWith("zzz");
    expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
  },
};
