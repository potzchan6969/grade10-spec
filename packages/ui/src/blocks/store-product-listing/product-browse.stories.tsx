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
    onGroupCollapse: fn(),
    onSearchChange: fn(),
    onSortChange: fn(),
    onClearFilters: fn(),
    onLoadMore: fn(),
    onProductClick: fn(),
    onProductCartQuantityChange: fn(),
  },
} satisfies Meta<typeof ProductBrowse>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Lets Storybook viewers follow the drawer before the next click. */
const pause = (ms = 900) => new Promise((resolve) => setTimeout(resolve, ms));

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
    expect(canvas.queryByRole("button", { name: "Latest" })).toBeNull();
    await waitFor(() => {
      expect(
        canvas.getAllByRole("button", {
          name: /Pokémon TCG Sealed Booster Box – Abyss Eye \(M5\)/,
        }).length,
      ).toBeGreaterThan(0);
    });
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup({ delay: 120 });
    let dialog: HTMLElement;

    await step("Show narrow pills, no search", async () => {
      expect(canvas.getByRole("button", { name: "Latest" })).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: "Worlds" })).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: "Types" })).toBeInTheDocument();
      expect(
        canvas.queryByRole("combobox", { name: "Search products" }),
      ).toBeNull();
      expect(canvas.queryByRole("button", { name: "Filter" })).toBeNull();
      await pause(600);
    });

    await step("Open Worlds drawer", async () => {
      await user.click(canvas.getByRole("button", { name: "Worlds" }));
      dialog = await within(document.body).findByRole("dialog");
      expect(
        within(dialog).getByRole("heading", { name: "Worlds" }),
      ).toBeInTheDocument();
      await waitFor(() => {
        expect(
          within(dialog).getByRole("checkbox", { name: /One Piece/ }),
        ).toBeInTheDocument();
      });
      expect(args.onGroupExpand).toHaveBeenCalledWith("worlds");
      await pause();
    });

    await step("Draft Pokémon and Show Results", async () => {
      await user.click(within(dialog).getByRole("checkbox", { name: /Pokémon/ }));
      await pause(500);
      await user.click(
        within(dialog).getByRole("button", { name: "Show Results" }),
      );
      expect(args.onFilterChange).toHaveBeenCalledWith(
        "worlds",
        "pokemon",
        true,
      );
      await waitFor(() => {
        expect(
          canvas.getByRole("button", { name: "Pokémon" }),
        ).toBeInTheDocument();
      });
      await pause(600);
    });
  },
};

export const NarrowSortAppliesOnChoose: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup({ delay: 120 });
    let dialog: HTMLElement;

    await step("Open sort drawer", async () => {
      await user.click(canvas.getByRole("button", { name: "Latest" }));
      dialog = await within(document.body).findByRole("dialog");
      expect(
        within(dialog).getByRole("heading", { name: "Sort" }),
      ).toBeInTheDocument();
      await pause();
    });

    await step("Choose Lowest price", async () => {
      await user.click(
        within(dialog).getByRole("button", { name: "Lowest price" }),
      );
      expect(args.onSortChange).toHaveBeenCalledWith("price-asc");
      await waitFor(() => {
        expect(
          canvas.getByRole("button", { name: "Lowest" }),
        ).toBeInTheDocument();
      });
      await pause(600);
    });
  },
};

export const NarrowFacetClearDraft: Story = {
  globals: { viewport: { value: "mobile1" } },
  args: {
    selection: { types: ["booster-box"] },
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup({ delay: 120 });
    let dialog: HTMLElement;

    await step("Open Types drawer from Booster Box pill", async () => {
      expect(
        canvas.getByRole("button", { name: "Booster Box" }),
      ).toBeInTheDocument();
      await user.click(canvas.getByRole("button", { name: "Booster Box" }));
      dialog = await within(document.body).findByRole("dialog");
      await pause();
    });

    await step("Clear draft only", async () => {
      await user.click(within(dialog).getByRole("button", { name: "Clear" }));
      expect(
        within(dialog).getByRole("checkbox", { name: /Booster Box/ }),
      ).not.toBeChecked();
      expect(args.onFilterChange).not.toHaveBeenCalled();
      await pause();
    });

    await step("Show Results applies the empty draft", async () => {
      await user.click(
        within(dialog).getByRole("button", { name: "Show Results" }),
      );
      expect(args.onFilterChange).toHaveBeenCalledWith(
        "types",
        "booster-box",
        false,
      );
      await pause(600);
    });
  },
};
