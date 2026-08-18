import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowDownIcon } from "lucide-react";
import { FilterChip } from "./filter-chip";

const meta = {
  title: "Components/FilterChip",
  component: FilterChip,
  tags: ["autodocs"],
  args: { children: "Chip" },
  argTypes: {
    size: { control: "inline-radio", options: ["md", "sm"] },
  },
} satisfies Meta<typeof FilterChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Selected: Story = { args: { selected: true } };
export const SelectedSmall: Story = { args: { size: "sm", selected: true } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledSelected: Story = {
  args: { disabled: true, selected: true },
};

/** `trailing` mirrors Figma's BOOLEAN + INSTANCE_SWAP pair. */
export const WithTrailing: Story = {
  args: { trailing: <ArrowDownIcon /> },
};
export const WithTrailingSmall: Story = {
  args: { size: "sm", trailing: <ArrowDownIcon /> },
};
export const WithTrailingSelected: Story = {
  args: { selected: true, trailing: <ArrowDownIcon /> },
};
