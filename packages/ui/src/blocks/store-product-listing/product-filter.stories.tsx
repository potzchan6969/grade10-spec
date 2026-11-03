import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductFilter } from "./product-filter";
import { productFilterArgs } from "./product-filter.story-shared";

const meta = {
  title: "Store/Product Listing/Blocks/ProductFilter",
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
  parameters: {
    verification: { caseId: "vc_37c95ec7-112a-41a1-9c16-e83a004e0665" },
  },
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
  parameters: {
    verification: { caseId: "vc_53d9ef29-6bd9-4fee-8256-cbc10fd7bc22" },
  },
  args: { selection: { worlds: ["pokemon"], types: ["booster-box"] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).toBeChecked();
    expect(canvas.getByRole("checkbox", { name: /Booster Box/ })).toBeChecked();
  },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_2632a006-f250-472c-9b6b-4dcf82569e38" },
  },
  args: { groups: { status: "loading" } },
};

export const FilterChangeIsReported: Story = {
  parameters: {
    verification: { caseId: "vc_fb946248-3959-4eb2-bfa6-7377039cce32" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", { name: /Pokémon/ }));
    expect(args.onFilterChange).toHaveBeenCalledWith("worlds", "pokemon", true);
  },
};
