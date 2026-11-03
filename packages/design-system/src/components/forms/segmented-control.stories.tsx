import { Check } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SegmentedControl } from "./segmented-control";
import { SegmentedControlItem } from "./segmented-control-item";

const meta = {
  title: "Design System/Forms/SegmentedControl",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_a84e05b6-8a2e-4a03-8add-c92e1fe955b9" },
  },
};
export const Small: Story = {
  parameters: {
    verification: { caseId: "vc_02c706a4-04b0-4665-af92-e5f347775314" },
  },
  args: { size: "sm" },
};

/** Three options — the track hugs content the way Figma draws it. */
export const ThreeItems: Story = {
  parameters: {
    verification: { caseId: "vc_a5c03ab3-34cf-4e54-940e-d47c0ff675a7" },
  },
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
  parameters: {
    verification: { caseId: "vc_394b6a09-0135-4fa1-8706-edd8230b3b0e" },
  },
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
  parameters: {
    verification: { caseId: "vc_5699c164-3d69-46e1-8e04-e8def06e753f" },
  },
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
