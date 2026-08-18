import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { useState } from "react";
import { FilterPanel } from "./filter-panel";
import { COLLECTIONS, UTILITY_LINKS } from "./fixtures";

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
    label: "Store navigation",
    searchPlaceholder: "Search...",
    searchLabel: "Search products",
    collections: { status: "ready", data: COLLECTIONS },
    activeCollection: "pokemon",
    onCollectionChange: fn(),
    onSearchChange: fn(),
    utilityLinks: UTILITY_LINKS,
  },
} satisfies Meta<typeof FilterPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Matches the Product Listing sidebar instance in Figma (`4288:13952`). */
export const Default: Story = {
  render: (args) => {
    const [activeCollection, setActiveCollection] = useState(
      args.activeCollection ?? "pokemon",
    );

    return (
      <div className="w-64">
        <FilterPanel
          {...args}
          activeCollection={activeCollection}
          onCollectionChange={(collectionId) => {
            setActiveCollection(collectionId);
            args.onCollectionChange?.(collectionId);
          }}
        />
      </div>
    );
  },
};

export const Loading: Story = {
  args: { collections: { status: "loading" } },
};

/** The consumer supplies the message and what to call the action. */
export const ErrorState: Story = {
  args: {
    collections: {
      status: "error",
      message: "Collections could not be loaded.",
      action: { label: "Try again", onAction: fn() },
    },
  },
};

export const Empty: Story = {
  args: {
    collections: {
      status: "empty",
      message: "No collections are available.",
    },
  },
};

/** A collection change is reported and the active item stays put until the
 * consumer supplies a new value. */
export const CollectionChangeIsReported: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const dragonBall = canvas.getByRole("button", { name: "Dragon Ball" });

    expect(dragonBall).not.toHaveAttribute("aria-current");
    await userEvent.click(dragonBall);

    expect(args.onCollectionChange).toHaveBeenCalledTimes(1);
    expect(args.onCollectionChange).toHaveBeenCalledWith("dragon-ball");
    expect(canvas.getByRole("button", { name: "Pokémon" })).toHaveAttribute(
      "aria-current",
      "true",
    );
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
