import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
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
    expect(canvas.queryByRole("tab", { name: "Worlds" })).toBeNull();
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
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: "Filter" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("combobox", { name: "Search products" }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Filter" }));
    const dialog = await within(document.body).findByRole("dialog");
    expect(within(dialog).getByRole("tab", { name: "Worlds" })).toBeInTheDocument();
    expect(within(dialog).queryByRole("button", { name: "See all worlds" })).toBeNull();
    expect(within(dialog).queryByRole("link", { name: "Help" })).toBeNull();
    await waitFor(() => {
      expect(within(dialog).getByRole("checkbox", { name: /One Piece/ })).toBeInTheDocument();
    });
    expect(within(dialog).getByRole("tab", { name: "Types" })).toBeInTheDocument();
    await userEvent.click(within(dialog).getByRole("button", { name: "Done" }));
    expect(args.onClearFilters).not.toHaveBeenCalled();
  },
};

export const FacetTabsKeepTypesReachable: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Filter" }));
    const dialog = await within(document.body).findByRole("dialog");
    expect(
      within(dialog).queryByRole("button", { name: "See all worlds" }),
    ).toBeNull();
    await userEvent.click(within(dialog).getByRole("tab", { name: "Types" }));
    expect(
      within(dialog).getByRole("checkbox", { name: /Booster Box/ }),
    ).toBeInTheDocument();
  },
};
