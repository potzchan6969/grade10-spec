import { Package } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Design System/Display/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "No results found",
    description:
      "Try adjusting your search or filters to find what you are looking for.",
    icon: <Package aria-hidden weight="regular" />,
    actions: (
      <>
        <Button size="md" variant="secondary">
          Take action
        </Button>
        <Button size="md">Take action</Button>
      </>
    ),
  },
  argTypes: {
    compact: { control: "boolean" },
    frameless: { control: "boolean" },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma's default rung: `isCompact=false, hasFrame=true`. */
export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_7d06e7bf-b13c-451b-8d31-3a74e9b496c4" },
  },
};

/** Figma's compact framed rung: tighter padding, icon well, and description type. */
export const Compact: Story = {
  parameters: {
    verification: { caseId: "vc_8abe095a-7b2e-4ba9-a1cd-6bd02d5544ba" },
  },
  args: { compact: true },
};

/** Figma's frameless rung: `hasFrame=false` — no border, fill, or radius. */
export const Frameless: Story = {
  parameters: {
    verification: { caseId: "vc_fc1daf1d-1ed6-477c-a15f-c0aa2b154316" },
  },
  args: { frameless: true },
};

/** Figma's compact frameless rung: both axes at their non-default. */
export const CompactFrameless: Story = {
  parameters: {
    verification: { caseId: "vc_13df4250-8912-414c-90a5-8354ee4390fe" },
  },
  args: { compact: true, frameless: true },
};

export const WithoutIcon: Story = {
  parameters: {
    verification: { caseId: "vc_f447660a-8605-489b-9a6e-a4ef68134898" },
  },
  args: { icon: undefined },
};

export const WithoutDescription: Story = {
  parameters: {
    verification: { caseId: "vc_cc7a6a8a-c40f-4101-bd64-25d40d32a735" },
  },
  args: { description: undefined },
};

export const WithoutActions: Story = {
  parameters: {
    verification: { caseId: "vc_f6ec2acd-b986-4307-8411-399b7bda4d56" },
  },
  args: { actions: undefined },
};

export const TitleOnly: Story = {
  parameters: {
    verification: { caseId: "vc_18ac38a5-158e-40f4-9e24-6c0f443baf56" },
  },
  args: {
    icon: undefined,
    description: undefined,
    actions: undefined,
  },
};
