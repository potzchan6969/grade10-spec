import { Check } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "./segmented-control";
import { SegmentedControlItem } from "./segmented-control-item";

const meta = {
  title: "Components/SegmentedControlItem",
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

export const Active: Story = {};
export const Inactive: Story = { args: { value: "b" } };
export const Small: Story = { args: { size: "sm" } };
export const Disabled: Story = { args: { disabled: true, value: "b" } };

export const WithLeading: Story = {
  args: {
    leading: <Check weight="bold" />,
  },
};
