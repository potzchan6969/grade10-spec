import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { VStack } from "./vstack";

const Box = ({ children }: { children: ReactNode }) => (
  <div className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
    {children}
  </div>
);

const meta = {
  title: "Design System/Layout/VStack",
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_076729f1-f54d-45d8-8a9c-e1a1e47969b1" },
  },
};

/** The gap rungs are `Stack`'s; nothing is added or renamed here. */
export const Gaps: Story = {
  parameters: {
    verification: { caseId: "vc_a813c728-4b48-46be-a61b-a29c23b8e165" },
  },
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
  parameters: {
    verification: { caseId: "vc_63cae9b7-faaf-48a3-8a35-4a9192d4c76b" },
  },
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
  parameters: {
    verification: { caseId: "vc_c529191c-38f2-4ac1-b77f-b4c3dc1b95de" },
  },
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
  parameters: {
    verification: { caseId: "vc_1d9c2ce6-2da1-4aeb-bc31-5095184bd9f5" },
  },
  args: { align: "flex-end", justify: "space-around" },
  decorators: [
    (Story) => (
      <div className="h-64 w-96">
        <Story />
      </div>
    ),
  ],
};
