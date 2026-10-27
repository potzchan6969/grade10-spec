import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductFilter } from "./product-filter";
import { productFilterArgs } from "./product-filter.story-shared";

/**
 * Layouts the listing no longer uses. The small-screen listing opens one
 * drawer per facet group - Store/Product Listing/Blocks/ProductBrowse → Narrow.
 */
const meta = {
  title: "Store/Product Listing/Blocks/ProductFilter Archived",
  component: ProductFilter,
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
