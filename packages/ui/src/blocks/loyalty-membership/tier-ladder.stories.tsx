import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TierLadder } from "./tier-ladder";

const meta = {
  title: "Loyalty/Membership/Blocks/TierLadder",
  component: TierLadder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: { qualifying: "Qualifying points this year" },
    rungs: [
      { tier: "Silver", caption: "Free to join" },
      { tier: "Gold", caption: "500 pts / year" },
      {
        tier: "Black",
        caption: "By invitation only",
        invitationOnly: true,
      },
    ],
    currentTier: "Gold",
    qualifyingPoints: 320,
    qualifyingTarget: 500,
  },
} satisfies Meta<typeof TierLadder>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A Gold member: Silver and Gold are filled, Black stands unconnected. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("320")).toBeInTheDocument();
    expect(
      canvasElement.querySelectorAll('[data-slot="tier-ladder-connector"]'),
    ).toHaveLength(1);
    expect(
      canvasElement.querySelectorAll('[data-slot="tier-ladder-rung"]'),
    ).toHaveLength(3);
  },
};

/** A Silver member: only the entry rung is filled, the rest open. */
export const SilverHeld: Story = {
  args: { currentTier: "Silver" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("320")).toBeInTheDocument();
  },
};

/** A Black member: the held rung is the unconnected one, and there is no
 * threshold to count toward, so no progress line is drawn. */
export const BlackHeld: Story = {
  args: { currentTier: "Black", qualifyingPoints: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("By invitation only")).toBeInTheDocument();
    expect(
      canvas.queryByText("Qualifying points this year"),
    ).not.toBeInTheDocument();
  },
};

/** The track keeps its three columns at a phone width. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
