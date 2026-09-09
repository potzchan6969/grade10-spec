import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { APPLIED_FILTERS, SORT_OPTIONS } from "./fixtures";
import { ProductListHeader } from "./product-list-header";

const SORT_TRIGGER = "Sort by latest product";

const meta = {
  title: "Store Product Listing/ProductListHeader",
  component: ProductListHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: { sortTrigger: SORT_TRIGGER, clearFilters: "Clear filters" },
    resultCount: "100 Products",
    sortOptions: SORT_OPTIONS,
    sortValue: "new",
    appliedFilters: APPLIED_FILTERS,
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
  },
};

/** The count is displayed as supplied, never derived from the page. */
export const CountIsSupplied: Story = {
  args: { resultCount: "1,204 Products" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1,204 Products")).toBeInTheDocument();
  },
};

/** No sort options, no sort control — the count still shows. */
export const WithoutSort: Story = {
  args: { sortOptions: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("100 Products")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: SORT_TRIGGER }),
    ).not.toBeInTheDocument();
  },
};

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

/** Sort and applied filters stay displayed together. */
export const SortAndAppliedFiltersCombine: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", { name: SORT_TRIGGER }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Pokémon" })).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Booster Box" }),
    ).toBeInTheDocument();
  },
};
