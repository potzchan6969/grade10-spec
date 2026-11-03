import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductFilter } from "./product-filter";
import {
  InteractiveSearchFilter,
  productFilterArgs,
} from "./product-filter.story-shared";

const meta = {
  title: "Store/Product Listing/Blocks/ProductFilter/Search",
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
  render: (args) => <InteractiveSearchFilter {...args} />,
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

/** Typing opens product and filter suggestion groups under the field. */
export const Suggestions: Story = {
  // Base UI's open autocomplete hides the page from assistive tech but leaves
  // it tabbable; see docs/governance/ui-component-testing.md.
  parameters: {
    verification: { caseId: "vc_cc73669c-7b84-463d-8be0-5e20e54d321a" },
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "po");
    const popup = within(document.body);
    expect(await popup.findByRole("listbox")).toBeInTheDocument();
    expect(popup.getByText("Products")).toBeInTheDocument();
    expect(popup.getByText("Filters")).toBeInTheDocument();
    expect(
      popup.getByRole("option", {
        name: /Pokémon TCG Sealed Booster Box – Abyss Eye \(M5\), item 1/,
      }),
    ).toBeInTheDocument();
    expect(
      popup.getByRole("option", { name: /Pokémon.*World/ }),
    ).toBeInTheDocument();
  },
};

/** Enter with no row highlighted commits free text. */
export const Commit: Story = {
  parameters: {
    verification: { caseId: "vc_05bc114b-297f-4441-b981-ea148c76cd10" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "abyss");
    await userEvent.keyboard("{Enter}");
    expect(args.onSearchCommit).toHaveBeenCalledWith("abyss");
  },
};

/** Activating a suggestion reports it and does not navigate. */
export const SelectSuggestion: Story = {
  parameters: {
    verification: { caseId: "vc_90de7e46-8b9b-46e0-8f4f-80a9784ca07a" },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "po");
    const option = await within(document.body).findByRole("option", {
      name: /Pokémon.*World/,
    });
    await userEvent.click(option);
    expect(args.onSearchSuggestionSelect).toHaveBeenCalledTimes(1);
    expect(args.onSearchSuggestionSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "worlds:pokemon" }),
      "filters",
    );
  },
};

/** Supplied empty groups show Figma empty copy; Enter still commits. */
export const Empty: Story = {
  parameters: {
    verification: { caseId: "vc_8400767c-680b-4bc9-972c-6acf198b1820" },
  },
  render: (args) => <ProductFilter {...args} />,
  args: {
    searchValue: "zzz",
    searchSuggestions: [],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.click(field);
    expect(
      await within(document.body).findByText("No results found."),
    ).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect(args.onSearchCommit).toHaveBeenCalledWith("zzz");
  },
};

/** Omitting suggestion groups keeps the panel closed; Enter still commits. */
export const GroupsOmitted: Story = {
  parameters: {
    verification: { caseId: "vc_fc7b27f6-09a6-4db2-b7f0-810484b5812b" },
  },
  render: (args) => <ProductFilter {...args} />,
  args: {
    searchValue: "zzz",
    searchSuggestions: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.click(field);
    await userEvent.keyboard("{Enter}");
    expect(args.onSearchCommit).toHaveBeenCalledWith("zzz");
    expect(canvas.queryByRole("listbox")).not.toBeInTheDocument();
  },
};

/**
 * Scenario: shared-ui-store-product-listing-SC-74 - Pending suggestions show
 * searching. The field shows its searching row and invents no suggestion row;
 * Enter still commits.
 */
export const Pending: Story = {
  render: (args) => <ProductFilter {...args} />,
  args: {
    searchValue: "abyss",
    searchSuggestions: undefined,
    searchPending: true,
    copy: { ...productFilterArgs.copy, searchSearching: "Searching…" },
  },
  parameters: {
    verification: { caseId: "vc_558fa672-6a49-4039-a6be-818c24bc0193" },
    a11y: { config: { rules: [{ id: "aria-hidden-focus", enabled: false }] } },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.click(field);
    const popup = within(document.body);
    expect(await popup.findByText("Searching…")).toBeInTheDocument();
    expect(popup.queryAllByRole("option")).toHaveLength(0);
    expect(popup.queryByText("No results found.")).not.toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect(args.onSearchCommit).toHaveBeenCalledWith("abyss");
  },
};
