import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import { AuctionCategoryButton } from "./auction-catalogue-card";

/**
 * Square category tile used as an exclusive filter above All Auctions on
 * small viewports, and in a sidebar grid on large ones. Selected uses the
 * primary border; idle tiles sit at reduced opacity. Click the selected
 * tile again to clear.
 */
const meta = {
  title: "Auction List/Category Button",
  component: AuctionCategoryButton,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-36">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuctionCategoryButton>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToggleCategory({
  name,
  initiallySelected = false,
}: {
  name: string;
  initiallySelected?: boolean;
}) {
  const [selected, setSelected] = useState(initiallySelected);
  return (
    <AuctionCategoryButton
      name={name}
      onSelect={() => setSelected((value) => !value)}
      selected={selected}
    />
  );
}

export const Idle: Story = {
  name: "Idle",
  args: {
    name: "Pokémon",
    selected: false,
    onSelect: () => {},
  },
  render: () => <ToggleCategory name="Pokémon" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Pokémon" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  },
};

export const Selected: Story = {
  name: "Selected",
  args: {
    name: "Pokémon",
    selected: true,
    onSelect: () => {},
  },
  render: () => <ToggleCategory initiallySelected name="Pokémon" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Pokémon" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
};
