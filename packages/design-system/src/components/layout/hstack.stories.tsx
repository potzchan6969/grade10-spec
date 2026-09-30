import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { HStack } from "./hstack";

const Box = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
    {children}
  </div>
);

const meta = {
  title: "Components/HStack",
  component: HStack,
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
} satisfies Meta<typeof HStack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The gap rungs are `Stack`'s; nothing is added or renamed here. */
export const Gaps: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <HStack {...args} gap="none" />
      <HStack {...args} gap="xs" />
      <HStack {...args} gap="sm" />
      <HStack {...args} gap="lg" />
    </div>
  ),
};

/** `hAlign` distributes along the stacking axis — the main axis here. */
export const HorizontalAlignment: Story = {
  args: { hAlign: "space-between" },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

/** `vAlign` moves the items up and down — the cross axis of a row. */
export const VerticalAlignment: Story = {
  args: { vAlign: "center" },
  decorators: [
    (Story) => (
      <div className="h-32">
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
      <div className="h-32 w-96">
        <Story />
      </div>
    ),
  ],
};

/** `wrap` carries over from `Stack` unchanged. */
export const Wrapped: Story = {
  args: { gap: "sm", wrap: true },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
};
