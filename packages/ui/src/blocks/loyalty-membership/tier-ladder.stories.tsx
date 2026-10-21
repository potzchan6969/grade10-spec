import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TierLadder } from "./tier-ladder";

const meta = {
  title: "Loyalty/Membership/Blocks/TierLadder",
  component: TierLadder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      qualifying: "Qualifying pts this year",
      footnote:
        "Only points from purchases count toward your tier. Your tier year renews 1 Mar 2027.",
    },
    rungs: [
      { tier: "Silver", caption: "Join" },
      { tier: "Gold", caption: "500 pts / yr" },
      {
        tier: "Black",
        caption: "Invitation Only",
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

/** A Gold member: Silver is checked off, Gold is in progress, and Black
 * stands unconnected — both sides of its gap are hidden. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const steps = canvasElement.querySelectorAll('[data-slot="step"]');
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveAttribute("data-state", "completed");
    expect(steps[1]).toHaveAttribute("data-state", "progress");
    expect(steps[1]).toHaveAttribute("aria-current", "step");
    expect(steps[2]).toHaveAttribute("data-state", "upcoming");
    // Gold's trailing connector and both of Black's are hidden, so nothing
    // is drawn into the invitation-only rung.
    expect(steps[1].querySelectorAll(".opacity-0")).toHaveLength(1);
    expect(steps[2].querySelectorAll(".opacity-0")).toHaveLength(2);
    expect(canvas.getByText("320")).toBeInTheDocument();
  },
};

/** A Silver member: the entry rung is the one in progress. */
export const SilverHeld: Story = {
  args: { currentTier: "Silver" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const steps = canvasElement.querySelectorAll('[data-slot="step"]');
    expect(steps[0]).toHaveAttribute("data-state", "progress");
    expect(steps[1]).toHaveAttribute("data-state", "upcoming");
    expect(canvas.getByText("320")).toBeInTheDocument();
  },
};

/** A Black member: the held rung is the unconnected one, and there is no
 * threshold to count toward, so no progress line is drawn. */
export const BlackHeld: Story = {
  args: { currentTier: "Black", qualifyingPoints: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const steps = canvasElement.querySelectorAll('[data-slot="step"]');
    expect(steps[2]).toHaveAttribute("data-state", "progress");
    expect(canvas.getByText("Invitation Only")).toBeInTheDocument();
    expect(
      canvas.queryByText("Qualifying pts this year"),
    ).not.toBeInTheDocument();
  },
};

/** The track keeps its three columns at a phone width. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
