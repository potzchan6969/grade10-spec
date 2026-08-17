import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen, userEvent, within } from "storybook/test";
import { SORT_OPTIONS } from "./fixtures";
import { ProductListHeader } from "./product-list-header";

const meta = {
  title: "Store Product Listing/ProductListHeader",
  component: ProductListHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    resultCount: "38 products",
    sortOptions: SORT_OPTIONS,
    sortValue: "popularity",
    sortTriggerLabel: "Sort by popularity",
    onSortChange: fn(),
  },
} satisfies Meta<typeof ProductListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The count is displayed as supplied, never derived from the page. */
export const CountIsSupplied: Story = {
  args: { resultCount: "1,204 products" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("1,204 products")).toBeInTheDocument();
  },
};

/** No sort options, no sort control — the count still shows. */
export const WithoutSort: Story = {
  args: { sortOptions: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("38 products")).toBeInTheDocument();
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

/** Choosing an option reports it and dismisses the list; the trigger keeps
 * naming the previous option until the consumer supplies a new one. */
export const SortIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: /Sort by popularity/ }),
    );
    // The menu renders in a portal, so query the whole document.
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Price drop" }),
    );

    expect(args.onSortChange).toHaveBeenCalledTimes(1);
    expect(args.onSortChange).toHaveBeenCalledWith("price-drop");
    expect(
      canvas.getByRole("button", { name: /Sort by popularity/ }),
    ).toBeInTheDocument();
  },
};
