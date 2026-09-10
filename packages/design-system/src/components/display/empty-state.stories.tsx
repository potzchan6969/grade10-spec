import { Package } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../forms/button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Components/EmptyState",
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
export const Default: Story = {};

/** Figma's compact framed rung: tighter padding, icon well, and description type. */
export const Compact: Story = {
  args: { compact: true },
};

/** Figma's frameless rung: `hasFrame=false` — no border, fill, or radius. */
export const Frameless: Story = {
  args: { frameless: true },
};

/** Figma's compact frameless rung: both axes at their non-default. */
export const CompactFrameless: Story = {
  args: { compact: true, frameless: true },
};

export const WithoutIcon: Story = {
  args: { icon: undefined },
};

export const WithoutDescription: Story = {
  args: { description: undefined },
};

export const WithoutActions: Story = {
  args: { actions: undefined },
};

export const TitleOnly: Story = {
  args: {
    icon: undefined,
    description: undefined,
    actions: undefined,
  },
};
