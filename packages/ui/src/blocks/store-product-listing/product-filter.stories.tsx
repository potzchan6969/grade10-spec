import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductFilter } from "./product-filter";
import { productFilterArgs } from "./product-filter.story-shared";

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

/** Figma set `Product / Product Filter` (`4357:527`). */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Filter" })).toBeInTheDocument();
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).not.toBeChecked();
    expect(
      canvas.getByRole("checkbox", { name: /Booster Box/ }),
    ).not.toBeChecked();
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

export const TabsInDrawerLayout: Story = {
  args: { facetLayout: "tabs", showHeading: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("tab", { name: "Worlds" })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Types" }));
    expect(
      canvas.getByRole("checkbox", { name: /Booster Box/ }),
    ).toBeInTheDocument();
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
