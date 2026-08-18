import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { CHIP_FILTERS, SELECT_FILTERS, SORT_OPTIONS } from "./fixtures";
import { ProductListHeader } from "./product-list-header";

const meta = {
  title: "Store Product Listing/ProductListHeader",
  component: ProductListHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Pokémon",
    resultCount: "38",
    sortOptions: SORT_OPTIONS,
    sortValue: "popular",
    chipFilters: CHIP_FILTERS,
    selectFilters: SELECT_FILTERS,
    selection: {},
    selectFilterValues: { series: "all" },
    onSortChange: fn(),
    onFilterChange: fn(),
    onSelectFilterChange: fn(),
  },
} satisfies Meta<typeof ProductListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pack" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(canvas.getByRole("button", { name: "Box" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(
      canvas.getByRole("button", { name: /Price/ }).querySelector("svg"),
    ).not.toBeNull();
    expect(
      canvas.getByRole("button", { name: "Popular" }).querySelector("svg"),
    ).toBeNull();
  },
};

/** The count is displayed as supplied, never derived from the page. */
export const CountIsSupplied: Story = {
  args: { resultCount: "1,204" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1,204")).toBeInTheDocument();
  },
};

/** The title is displayed as supplied, with no fallback. */
export const TitleIsSupplied: Story = {
  args: { title: "Search Results" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Search Results" }),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Pokémon")).not.toBeInTheDocument();
  },
};

/** No sort options, no sort control — the title and count still show. */
export const WithoutSort: Story = {
  args: { sortOptions: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Pokémon" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("38")).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Popular" }),
    ).not.toBeInTheDocument();
  },
};

/** Choosing an option reports it; the previous chip stays selected until the
 * consumer supplies a new one. */
export const SortIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "New" }));

    expect(args.onSortChange).toHaveBeenCalledTimes(1);
    expect(args.onSortChange).toHaveBeenCalledWith("new");
    expect(canvas.getByRole("button", { name: "Popular" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

/** A second tap on Price reports the paired identifier. */
export const PriceReversesOnSecondTap: Story = {
  args: { sortValue: "price-desc" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const price = canvas.getByRole("button", { name: /Price/ });

    expect(price).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(price);

    expect(args.onSortChange).toHaveBeenCalledTimes(1);
    expect(args.onSortChange).toHaveBeenCalledWith("price-asc");
  },
};

/** Once the consumer supplies the paired identifier, the arrow is reversed. */
export const PriceDirectionIsReversed: Story = {
  args: { sortValue: "price-asc" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const price = canvas.getByRole("button", { name: /Price/ });
    expect(price).toHaveAttribute("aria-pressed", "true");
    expect(price.querySelector("[data-reversed]")).not.toBeNull();
    expect(price.querySelector("svg")).not.toBeNull();
  },
};

/** Activating a type chip reports the group and option, and leaves the
 * displayed selection alone until the consumer supplies a new one. */
export const ChipFilterIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const pack = canvas.getByRole("button", { name: "Pack" });

    expect(pack).toHaveAttribute("aria-pressed", "false");
    expect(canvas.getByRole("button", { name: "Box" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await userEvent.click(pack);

    expect(args.onFilterChange).toHaveBeenCalledTimes(1);
    expect(args.onFilterChange).toHaveBeenCalledWith(
      "product-type",
      "pack",
      true,
    );
    expect(canvas.getByRole("button", { name: "Pack" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(canvas.getByRole("button", { name: "Box" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  },
};

/** Both type chips selected together — the consumer shows Pack and Box
 * products, same result set as none selected, with both chips marked. */
export const BothTypeChipsSelected: Story = {
  args: { selection: { "product-type": ["pack", "box"] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pack" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(canvas.getByRole("button", { name: "Box" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};

/** Choosing a series option reports it and dismisses the list; the trigger
 * keeps naming the previous option until the consumer supplies a new one. */
export const ExclusiveFilterIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: /All Series/ }));
    await userEvent.click(await screen.findByRole("menuitem", { name: "M4" }));

    expect(args.onSelectFilterChange).toHaveBeenCalledTimes(1);
    expect(args.onSelectFilterChange).toHaveBeenCalledWith("series", "m4");
    expect(
      canvas.getByRole("button", { name: /All Series/ }),
    ).toBeInTheDocument();
  },
};

/** An exclusive-filter group with no options occupies no space. */
export const ExclusiveFilterWithNoOptions: Story = {
  args: {
    selectFilters: [{ id: "series", label: "Series", options: [] }],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.queryByRole("button", { name: /All Series/ }),
    ).not.toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Popular" })).toBeInTheDocument();
  },
};

/** Sort, type, and series stay selected together. */
export const SortAndFiltersCombine: Story = {
  args: {
    sortValue: "popular",
    selection: { "product-type": ["pack"] },
    selectFilterValues: { series: "m4" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Popular" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(canvas.getByRole("button", { name: "Pack" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(canvas.getByRole("button", { name: /M4/ })).toBeInTheDocument();
  },
};
