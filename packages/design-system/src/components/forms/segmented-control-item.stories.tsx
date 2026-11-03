import { Check } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "./segmented-control";
import { SegmentedControlItem } from "./segmented-control-item";

const meta = {
  title: "Design System/Forms/SegmentedControlItem",
  component: SegmentedControlItem,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <SegmentedControl defaultValue={["a"]} className="bg-transparent p-0">
        <Story />
      </SegmentedControl>
    ),
  ],
  args: { children: "Item", value: "a" },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
} satisfies Meta<typeof SegmentedControlItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  parameters: {
    verification: { caseId: "vc_02568027-8000-4235-8b1d-3a7a374f132e" },
  },
};
export const Inactive: Story = {
  parameters: {
    verification: { caseId: "vc_b2454391-24bd-4e5e-8b7e-19fd7dcdb148" },
  },
  args: { value: "b" },
};
export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_79120bce-0a36-4190-b180-ac41d4210075" },
  },
  args: { size: "sm" },
};
export const Disabled: Story = {
  parameters: {
    verification: { caseId: "vc_d29820ae-0807-4e39-933c-daf8df31e8e5" },
  },
  args: { disabled: true, value: "b" },
};

export const WithLeading: Story = {
  parameters: {
    verification: { caseId: "vc_bdb616da-3947-40f4-873a-ab0000dd09aa" },
  },
  args: {
    leading: <Check weight="bold" />,
  },
};
