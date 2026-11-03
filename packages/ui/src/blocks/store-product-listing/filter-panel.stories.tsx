import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FilterPanel } from "./filter-panel";
import { FILTER_GROUPS, UTILITY_LINKS } from "./fixtures";

const { common } = getMessages("grade10", "en");

const meta = {
  title: "Store/Product Listing/Blocks/FilterPanel",
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
    copy: {
      label: "Store filters",
      heading: "Filter",
      searchPlaceholder: "Find product",
      searchLabel: "Search products",
      drawerClear: "Clear",
      showResults: "Show Results",
    },
    groups: { status: "ready", data: FILTER_GROUPS },
    selection: {},
    onFilterChange: fn(),
    onGroupExpand: fn(),
    onGroupCollapse: fn(),
    onSearchChange: fn(),
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Product List sidebar instance in Figma (`4288:13952`). */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_5173235c-cd1a-4b69-b7e1-f6fb3db0b39c" },
  },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_e239e59b-6246-48fc-bf31-5fe3294653e3" },
  },
  args: { groups: { status: "loading" } },
};

/** The consumer supplies the message and what to call the action. */
export const ErrorState: Story = {
  parameters: {
    verification: { caseId: "vc_be9e77b1-6bca-4b31-9723-a75e9ac9c3c5" },
  },
  args: {
    groups: {
      status: "error",
      message: "Filters could not be loaded.",
      action: { label: common.retry, onAction: fn() },
    },
  },
};

export const Empty: Story = {
  parameters: {
    verification: { caseId: "vc_67e13dfe-43e4-41c4-8ade-12f105054750" },
  },
  args: {
    groups: {
      status: "empty",
      message: "No filters are available.",
    },
  },
};

/** Empty selection is unrestricted — every checkbox is unchecked. */
export const NoFilterSelected: Story = {
  parameters: {
    verification: { caseId: "vc_b3eb7b60-cd96-436a-b54e-6d11e2c80ac6" },
  },
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
  parameters: {
    verification: { caseId: "vc_2d23770a-1b5f-4de9-bf29-56d2e55fcc94" },
  },
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
  parameters: {
    verification: { caseId: "vc_28e8d7fe-965a-4c2d-9969-13c23afb0435" },
  },
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
  parameters: {
    verification: { caseId: "vc_505ada35-9832-453c-9783-17a36830a1ae" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "See all worlds" }),
    );
    expect(args.onGroupExpand).toHaveBeenCalledTimes(1);
    expect(args.onGroupExpand).toHaveBeenCalledWith("worlds");
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-86 - A group collapse is
 * reported. Collapse reports when the consumer supplied a Show less label.
 */
export const GroupCollapseIsReported: Story = {
  parameters: {
    verification: { caseId: "vc_92cbb762-0b0e-4cc5-be65-8e5822752b09" },
  },
  args: {
    groups: {
      status: "ready",
      data: [
        {
          id: "worlds",
          label: "Worlds",
          collapseLabel: "Show less",
          options: [
            { id: "pokemon", label: "Pokémon", count: "51" },
            { id: "one-piece", label: "One Piece", count: "4" },
          ],
        },
      ],
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show less" }));
    expect(args.onGroupCollapse).toHaveBeenCalledTimes(1);
    expect(args.onGroupCollapse).toHaveBeenCalledWith("worlds");
  },
};

/** A group with no options occupies no space. */
export const EmptyFilterGroup: Story = {
  parameters: {
    verification: { caseId: "vc_57b2340b-4950-4819-a6a0-dd22ee60723d" },
  },
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
  parameters: {
    verification: { caseId: "vc_7f403ad6-20b7-45ca-b5aa-356bfbb0653d" },
  },
  args: { searchValue: "" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });

    await userEvent.type(field, "pika");

    expect(args.onSearchChange).toHaveBeenCalled();
    expect(field).toHaveValue("");
  },
};

/** Clear is offered only when the consumer supplies a value and a handler. */
export const SearchClear: Story = {
  parameters: {
    verification: { caseId: "vc_d818f468-342a-416a-bc8c-79ee08d8e47a" },
  },
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

/** No utility-link region when none are supplied (the product-list default). */
export const NoUtilityLinks: Story = {
  parameters: {
    verification: { caseId: "vc_a925944d-ffe0-45c9-8c4c-aa7931152504" },
  },
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

/** Optional consumer-supplied links under the filter. */
export const WithUtilityLinks: Story = {
  parameters: {
    verification: { caseId: "vc_5f5484a0-86fc-4041-b1c5-94884d2d2551" },
  },
  args: { utilityLinks: UTILITY_LINKS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: "Help" })).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Shipping" })).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "Orders & Returns" }),
    ).toBeInTheDocument();
  },
};
