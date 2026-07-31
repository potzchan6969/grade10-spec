import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Stack } from "./stack";

const Box = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
    {children}
  </div>
);

const meta = {
  title: "Components/Stack",
  component: Stack,
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
    direction: { control: "select", options: ["vertical", "horizontal"] },
    gap: { control: "select", options: ["none", "xs", "sm", "md", "lg"] },
  },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = { args: { direction: "horizontal" } };

/** Every gap rung comes from the spacing scale; `md` is the default. */
export const Gaps: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      <Stack {...args} direction="horizontal" gap="none" />
      <Stack {...args} direction="horizontal" gap="xs" />
      <Stack {...args} direction="horizontal" gap="sm" />
      <Stack {...args} direction="horizontal" gap="lg" />
    </div>
  ),
};

/** `align` and `justify` pass through to the style attribute for arbitrary values. */
export const Aligned: Story = {
  args: {
    direction: "horizontal",
    align: "center",
    justify: "space-between",
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

/** `wrap` lets a horizontal stack fall onto a second line at a narrow width. */
export const Wrapped: Story = {
  args: { direction: "horizontal", gap: "sm", wrap: true },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
};
