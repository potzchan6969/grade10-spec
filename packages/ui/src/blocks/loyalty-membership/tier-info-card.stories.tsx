import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { TierInfoCard } from "./tier-info-card";

const meta = {
  title: "Loyalty/Membership/Blocks/TierInfoCard",
  component: TierInfoCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    tier: "Gold",
    caption: "500 pts / year",
    benefits: ["1.2 pt for every HK$10 spent"],
  },
} satisfies Meta<typeof TierInfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Silver: free to join, the plain border — not the rung held. */
export const Silver: Story = {
  args: {
    tier: "Silver",
    caption: "Free to join",
    benefits: ["1 pt for every HK$10 spent"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Silver")).toBeInTheDocument();
    expect(canvas.getByText("Free to join")).toBeInTheDocument();
    expect(canvas.getByText("1 pt for every HK$10 spent")).toBeInTheDocument();
    const card = canvasElement.querySelector('[data-slot="tier-info-card"]');
    expect(card).toHaveClass("border-border");
    expect(card).not.toHaveClass("border-primary-border");
  },
};

/** Gold is the rung held: the primary border and its tinted shadow mark it. */
export const Gold: Story = {
  args: { currentTier: true },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="tier-info-card"]');
    expect(card).toHaveClass("border-primary-border");
    expect(card?.className).toContain("drop-shadow");
  },
};

/** Black: held by invitation, so no threshold is asked. */
export const Black: Story = {
  args: {
    tier: "Black",
    caption: "By invitation only",
    benefits: ["1.7 pt for every HK$10 spent"],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("By invitation only")).toBeInTheDocument();
  },
};

/** Every benefit line draws behind its own check, however many there are. */
export const SeveralBenefits: Story = {
  args: {
    benefits: [
      "1.5 pt for every HK$10 spent",
      "Priority grading queue",
      "Invitation-only drops and previews, worded however long the benefit needs to run",
    ],
  },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelectorAll('[data-slot="tier-info-card-benefit"]'),
    ).toHaveLength(3);
    expect(
      canvasElement.querySelectorAll(
        '[data-slot="tier-info-card-benefit"] svg',
      ),
    ).toHaveLength(3);
  },
};

/** The card fills a narrow column; its designed cap only applies at `sm` up. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="tier-info-card"]');
    expect(card).toHaveClass("sm:max-w-(--container-xs)");
  },
};
