import { Check, Star } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { DropdownMenu } from "./dropdown-menu";
import { DropdownMenuItem } from "./dropdown-menu-item";

const leading = <Star aria-hidden size={14} />;

const meta = {
  title: "Design System/Overlays/DropdownMenuItem",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_8debb795-1f49-4711-878d-f04d7e751a1f" },
  },
};
export const Medium: Story = {
  parameters: {
    verification: { caseId: "vc_36816e3e-6c9b-4a8f-a28f-0288a58dddbd" },
  },
  args: { size: "md" },
};
export const Selected: Story = {
  parameters: {
    verification: { caseId: "vc_50748959-a893-4ede-aa62-d544646129ba" },
  },
  args: {
    selected: true,
    trailing: <Check aria-hidden size={14} />,
  },
  play: async ({ canvasElement }) => {
    const item = within(canvasElement).getByRole("menuitem", { name: "Item" });
    expect(item).toHaveAttribute("aria-current", "true");
  },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_fe6758e2-69d7-4cd4-b459-9f760f603827" },
  },
  args: { disabled: true },
};
export const Pending: Story = {
  parameters: {
    verification: { caseId: "vc_ecafcda6-d9ff-473a-8ca4-60a4c6ee297a" },
  },
  args: { pending: true, onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const item = within(canvasElement).getByRole("menuitem", {
      name: "Item Value",
    });
    expect(item).toHaveAttribute("aria-busy", "true");
    await userEvent.click(item);
    expect(args.onClick).not.toHaveBeenCalled();
  },
};
