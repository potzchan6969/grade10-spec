import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { VStack } from "./vstack";

const Box = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
    {children}
  </div>
);

const meta = {
  title: "Components/VStack",
  component: VStack,
  tags: ["autodocs"],
  args: {
    children: (
      <>
        <Box>One</Box>
        <Box>Two</Box>
        <Box>Three</Box>
      </>
    ),
  },
  argTypes: {
    gap: { control: "select", options: ["none", "xs", "sm", "md", "lg"] },
  },
} satisfies Meta<typeof VStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The gap rungs are `Stack`'s; nothing is added or renamed here. */
export const Gaps: Story = {
  render: (args) => (
    <div className="flex flex-row gap-6">
      <VStack {...args} gap="none" />
      <VStack {...args} gap="xs" />
      <VStack {...args} gap="sm" />
      <VStack {...args} gap="lg" />
    </div>
  ),
};

/** `hAlign` moves the items sideways — the cross axis of a vertical stack. */
export const HorizontalAlignment: Story = {
  args: { hAlign: "center" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

/** `vAlign` distributes along the stacking axis, so it needs a taller box. */
export const VerticalAlignment: Story = {
  args: { vAlign: "space-between" },
  decorators: [
    (Story) => (
      <div className="h-64">
        <Story />
      </div>
    ),
  ],
};

/** `align` and `justify` still work; `hAlign` and `vAlign` win over them. */
export const CssNamedAliases: Story = {
  args: { align: "flex-end", justify: "space-around" },
  decorators: [
    (Story) => (
      <div className="h-64 w-96">
        <Story />
      </div>
    ),
  ],
};
