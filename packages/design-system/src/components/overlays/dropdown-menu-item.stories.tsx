import { Star } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DropdownMenu } from "./dropdown-menu";
import { DropdownMenuItem } from "./dropdown-menu-item";

const leading = <Star aria-hidden size={14} weight="regular" />;

const meta = {
  title: "Components/DropdownMenuItem",
  component: DropdownMenuItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <DropdownMenu modal={false} open>
        <div className="w-60">
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
export const Selected: Story = { args: { selected: true } };
export const Disabled: Story = { args: { disabled: true } };
