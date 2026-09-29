import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { FactCardSkeleton } from "./fact-card-skeleton";
import { LOADING_LABEL } from "./fixtures";

const meta = {
  title: "Page Blocks/FactCardSkeleton",
  component: FactCardSkeleton,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { copy: { label: LOADING_LABEL }, count: 2 },
} satisfies Meta<typeof FactCardSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two placeholder cards inside one busy status a reader hears once
 * (shared-ui-page-blocks-SC-06). */
export const Two: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const statuses = canvas.getAllByRole("status");
    expect(statuses).toHaveLength(1);
    expect(statuses[0]).toHaveAccessibleName(LOADING_LABEL);
    expect(statuses[0]).toHaveAttribute("aria-busy", "true");
    expect(statuses[0].querySelectorAll('[data-slot="card"]')).toHaveLength(2);
  },
};
