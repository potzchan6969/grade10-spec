import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { Stack } from "./stack";

const Box = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
    {children}
  </div>
);

const meta = {
  title: "Design System/Layout/Stack",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_5ae5e73f-b100-4cc9-8279-cd49dbf484de" },
  },
};

export const Horizontal: Story = {
  parameters: {
    verification: { caseId: "vc_d5993293-3878-4d4f-90cf-193d1d54d7e8" },
  },
  args: { direction: "horizontal" },
};

/** Every gap rung comes from the spacing scale; `md` is the default. */
export const Gaps: Story = {
  parameters: {
    verification: { caseId: "vc_3aad1c81-0811-44db-9eb8-e24ffc88c923" },
  },
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
  parameters: {
    verification: { caseId: "vc_f112f01a-6926-4fcb-b9b1-4c436e24fa23" },
  },
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
  parameters: {
    verification: { caseId: "vc_0199a839-f87b-40fb-9b89-8b51e673bab0" },
  },
  args: { direction: "horizontal", gap: "sm", wrap: true },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
};
