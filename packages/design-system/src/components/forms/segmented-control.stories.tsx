import { Check } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "./segmented-control";
import { SegmentedControlItem } from "./segmented-control-item";

const meta = {
  title: "Components/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  args: {
    defaultValue: ["a"],
    children: (
      <>
        <SegmentedControlItem value="a">Item</SegmentedControlItem>
        <SegmentedControlItem value="b">Item</SegmentedControlItem>
      </>
    ),
  },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };

/** Three options — the track hugs content the way Figma draws it. */
export const ThreeItems: Story = {
  args: {
    defaultValue: ["list"],
    children: (
      <>
        <SegmentedControlItem value="list">List</SegmentedControlItem>
        <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
        <SegmentedControlItem value="map">Map</SegmentedControlItem>
      </>
    ),
  },
};

export const WithLeadingIcon: Story = {
  args: {
    defaultValue: ["a"],
    children: (
      <>
        <SegmentedControlItem value="a" leading={<Check weight="bold" />}>
          Item
        </SegmentedControlItem>
        <SegmentedControlItem value="b" leading={<Check weight="bold" />}>
          Item
        </SegmentedControlItem>
      </>
    ),
  },
};

export const DisabledItem: Story = {
  args: {
    defaultValue: ["a"],
    children: (
      <>
        <SegmentedControlItem value="a">Item</SegmentedControlItem>
        <SegmentedControlItem value="b" disabled>
          Item
        </SegmentedControlItem>
      </>
    ),
  },
};
