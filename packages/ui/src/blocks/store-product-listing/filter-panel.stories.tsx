import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FilterPanel } from "./filter-panel";
import { FIGMA_SELECTION, FILTER_GROUPS, SELECTION } from "./fixtures";

const meta = {
  title: "Store Product Listing/FilterPanel",
  component: FilterPanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Filters",
    groups: { status: "ready", data: FILTER_GROUPS },
    selection: FIGMA_SELECTION,
    onFilterChange: fn(),
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Product Listing filter panel instance in Figma (`4238:3996`). */
export const Default: Story = {};

export const Loading: Story = { args: { groups: { status: "loading" } } };

/** The consumer supplies the message and what to call the action. */
export const ErrorState: Story = {
  args: {
    groups: {
      status: "error",
      message: "Filters could not be loaded.",
      action: { label: "Try again", onAction: fn() },
    },
  },
};

export const Empty: Story = {
  args: {
    groups: { status: "empty", message: "No filters apply to this category." },
  },
};

/** A group with no options takes no space and shows no heading. */
export const GroupWithNoOptions: Story = {
  args: {
    groups: {
      status: "ready",
      data: [
        FILTER_GROUPS[0],
        { id: "sizes", label: "Sizes", options: [] },
        FILTER_GROUPS[2],
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Sizes")).not.toBeInTheDocument();
    expect(canvas.getByText("Product Type")).toBeInTheDocument();
  },
};

/** Activating an option reports the group and the option, and leaves the
 * displayed selection alone until the consumer supplies a new one. */
export const SelectionIsReported: Story = {
  args: { selection: SELECTION },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const pack = canvas.getByRole("checkbox", { name: /Pack/ });

    expect(pack).not.toBeChecked();
    await userEvent.click(pack);

    expect(args.onFilterChange).toHaveBeenCalledTimes(1);
    expect(args.onFilterChange).toHaveBeenCalledWith(
      "product-type",
      "pack",
      true,
    );
    expect(canvas.getByRole("checkbox", { name: /Pack/ })).not.toBeChecked();
  },
};

/** Two options in one group can be selected at once. */
export const MultipleSelected: Story = {
  args: { selection: { ...SELECTION, "product-type": ["box", "pack"] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("checkbox", { name: /Box/ })).toBeChecked();
    expect(canvas.getByRole("checkbox", { name: /Pack/ })).toBeChecked();
  },
};
