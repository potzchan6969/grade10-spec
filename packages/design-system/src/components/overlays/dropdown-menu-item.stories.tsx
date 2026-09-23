import { Check, Star } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { DropdownMenu } from "./dropdown-menu";
import { DropdownMenuItem } from "./dropdown-menu-item";

const leading = <Star aria-hidden size={14} />;

const meta = {
  title: "Components/DropdownMenuItem",
  component: DropdownMenuItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <DropdownMenu modal={false} open>
        {/* The popup's role without its portal and positioner: an item is
            only a menu item inside a menu. */}
        <div aria-label="Menu" className="w-60" role="menu" tabIndex={-1}>
          <Story />
        </div>
      </DropdownMenu>
    ),
  ],
  args: {
    children: "Item",
    leading,
    trailing: "Value",
  },
} satisfies Meta<typeof DropdownMenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Medium: Story = { args: { size: "md" } };
export const Selected: Story = {
  args: {
    selected: true,
    trailing: <Check aria-hidden size={14} />,
  },
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole("menuitem", { name: "Item" });
    expect(item).toHaveAttribute("aria-current", "true");
  },
};
export const Disabled: Story = { args: { disabled: true } };
