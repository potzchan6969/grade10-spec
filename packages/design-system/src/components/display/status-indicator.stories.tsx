import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusIndicator } from "./status-indicator";

const meta = {
  title: "Components/StatusIndicator",
  component: StatusIndicator,
  tags: ["autodocs"],
  argTypes: {
    type: { control: "inline-radio", options: ["dot", "count"] },
    variant: {
      control: "inline-radio",
      options: ["default", "error", "brand"],
    },
  },
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DotError: Story = { args: { variant: "error" } };

export const DotBrand: Story = { args: { variant: "brand" } };

/** Count contents are consumer-supplied — Figma's default `1` is not a fallback. */
export const Count: Story = {
  args: { type: "count", children: "1" },
};

export const CountError: Story = {
  args: { type: "count", variant: "error", children: "1" },
};

export const CountBrand: Story = {
  args: { type: "count", variant: "brand", children: "1" },
};

export const CountSupplied: Story = {
  args: { type: "count", children: "12" },
};
