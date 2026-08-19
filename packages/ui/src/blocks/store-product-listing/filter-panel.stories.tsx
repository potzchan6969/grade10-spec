import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FilterPanel } from "./filter-panel";
import { FILTER_GROUPS, UTILITY_LINKS } from "./fixtures";

const meta = {
  title: "Store Product Listing/FilterPanel",
  component: FilterPanel,
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
    label: "Store filters",
    heading: "Filter",
    searchPlaceholder: "Find product",
    searchLabel: "Search products",
    groups: { status: "ready", data: FILTER_GROUPS },
    selection: {},
    onFilterChange: fn(),
    onGroupExpand: fn(),
    onSearchChange: fn(),
    utilityLinks: UTILITY_LINKS,
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Product List sidebar instance in Figma (`4288:13952`). */
export const Default: Story = {};

export const Loading: Story = {
  args: { groups: { status: "loading" } },
};

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
    groups: {
      status: "empty",
      message: "No filters are available.",
    },
  },
};

/** Empty selection is unrestricted — every checkbox is unchecked. */
export const NoFilterSelected: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).not.toBeChecked();
    expect(
      canvas.getByRole("checkbox", { name: /Booster Box/ }),
    ).not.toBeChecked();
  },
};

/** A filter change is reported and the box stays unchecked until the consumer
 * supplies a new selection. */
export const FilterChangeIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const pokemon = canvas.getByRole("checkbox", { name: /Pokémon/ });

    expect(pokemon).not.toBeChecked();
    await userEvent.click(pokemon);

    expect(args.onFilterChange).toHaveBeenCalledTimes(1);
    expect(args.onFilterChange).toHaveBeenCalledWith("worlds", "pokemon", true);
    expect(pokemon).not.toBeChecked();
  },
};

/** Two options in one group selected together. */
export const TwoOptionsSelected: Story = {
  args: { selection: { worlds: ["pokemon", "formula-1"] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("checkbox", { name: /Pokémon/ })).toBeChecked();
    expect(canvas.getByRole("checkbox", { name: /Formula 1/ })).toBeChecked();
    expect(
      canvas.getByRole("checkbox", { name: /Shohei Ohtani/ }),
    ).not.toBeChecked();
  },
};

/** Expand reports the group; the option list is unchanged until the consumer
 * supplies a longer one. */
export const GroupExpandIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "See all worlds" }),
    );
    expect(args.onGroupExpand).toHaveBeenCalledTimes(1);
    expect(args.onGroupExpand).toHaveBeenCalledWith("worlds");
  },
};

/** A group with no options occupies no space. */
export const EmptyFilterGroup: Story = {
  args: {
    groups: {
      status: "ready",
      data: [
        { id: "worlds", label: "Worlds", options: [] },
        {
          id: "types",
          label: "Types",
          options: [{ id: "booster-box", label: "Booster Box", count: "24" }],
        },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Worlds")).not.toBeInTheDocument();
    expect(canvas.getByText("Types")).toBeInTheDocument();
  },
};

/** Search reports each change; the field shows the supplied value only. */
export const SearchChangeIsReported: Story = {
  args: { searchValue: "" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("searchbox");

    await userEvent.type(field, "pika");

    expect(args.onSearchChange).toHaveBeenCalled();
    expect(field).toHaveValue("");
  },
};

/** Clear is offered only when the consumer supplies a value and a handler. */
export const SearchClear: Story = {
  args: {
    searchValue: "Search query",
    onSearchClear: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    expect(args.onSearchClear).toHaveBeenCalledTimes(1);
  },
};

/** No utility-link region when none are supplied. */
export const NoUtilityLinks: Story = {
  args: { utilityLinks: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvasElement.querySelector("[data-slot='filter-panel-utility-links']"),
    ).toBeNull();
    expect(
      canvas.queryByRole("link", { name: "Help" }),
    ).not.toBeInTheDocument();
  },
};
