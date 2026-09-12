import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { ProductListHeader } from "./product-list-header";
import {
  productListHeaderArgs,
  SORT_TRIGGER,
} from "./product-list-header.story-shared";

const meta = {
  title: "Store Product Listing/ProductListHeader/Actions",
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

/** Choosing an option reports it and dismisses the list; the trigger stays
 * on the previous label until the consumer supplies a new one. */
export const SortIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: SORT_TRIGGER }));
    expect(
      await screen.findByRole("menuitem", { name: "Latest product" }),
    ).toHaveAttribute("aria-current", "true");
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Lowest price" }),
    );

    expect(args.onSortChange).toHaveBeenCalledTimes(1);
    expect(args.onSortChange).toHaveBeenCalledWith("price-asc");
    expect(
      canvas.getByRole("button", { name: SORT_TRIGGER }),
    ).toBeInTheDocument();
  },
};

/** Choosing the already-active option reports nothing. */
export const ActiveSortReportsNothing: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: SORT_TRIGGER }));
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Latest product" }),
    );

    expect(args.onSortChange).not.toHaveBeenCalled();
  },
};

/** Dismissing a chip reports the group and option as unselected. */
export const AppliedFilterIsRemoved: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Pokémon" }));

    expect(args.onFilterChange).toHaveBeenCalledTimes(1);
    expect(args.onFilterChange).toHaveBeenCalledWith(
      "worlds",
      "pokemon",
      false,
    );
    expect(canvas.getByRole("button", { name: "Pokémon" })).toBeInTheDocument();
  },
};

/** Clear-all reports once; chips stay until the consumer supplies a new list. */
export const AppliedFiltersAreCleared: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Clear filters" }),
    );

    expect(args.onClearFilters).toHaveBeenCalledTimes(1);
    expect(canvas.getByRole("button", { name: "Pokémon" })).toBeInTheDocument();
  },
};
