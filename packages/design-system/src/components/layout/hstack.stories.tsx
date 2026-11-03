import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { HStack } from "./hstack";

const Box = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
    {children}
  </div>
);

const meta = {
  title: "Design System/Layout/HStack",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_6371256e-3a50-485b-83e7-4cee23459327" },
  },
};

/** The gap rungs are `Stack`'s; nothing is added or renamed here. */
export const Gaps: Story = {
  parameters: {
    verification: { caseId: "vc_044b8ee7-4356-4a57-86c3-2929115ea788" },
  },
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
  parameters: {
    verification: { caseId: "vc_075c22d5-1716-4549-a0d0-417dcf1b0dfb" },
  },
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
  parameters: {
    verification: { caseId: "vc_8a365dc8-dd69-4edf-8426-d6ca6dd24a69" },
  },
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
  parameters: {
    verification: { caseId: "vc_bde94177-d30f-4071-be04-467bee0bcea1" },
  },
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
  parameters: {
    verification: { caseId: "vc_9b413d47-9ec7-4bb7-9199-1942d4326d1a" },
  },
  args: { gap: "sm", wrap: true },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
};
