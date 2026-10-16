import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { TierCard } from "./tier-card";

const meta = {
  title: "Loyalty/Membership/Blocks/TierCard",
  component: TierCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      balance: "Points to spend",
      points: "pts",
      worthSuffix: "off at checkout",
      qualifying: "Keep Gold",
      benefits: "Benefits",
    },
    variant: "gold",
    tier: "Gold",
    balance: "750",
    worth: "HK$75",
    qualifyingPoints: 250,
    qualifyingThreshold: 500,
    retentionLine: "Earn 250+ pts by 31 Dec 2027 to stay Gold",
    earnLine: "Gold earning 1.2x points",
  },
} satisfies Meta<typeof TierCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Silver: upgrade progress toward Gold under the slate skin. */
export const Silver: Story = {
  args: {
    variant: "silver",
    tier: "Silver",
    balance: "321",
    worth: "HK$32.1",
    qualifyingPoints: 321,
    copy: {
      balance: "Points to spend",
      points: "pts",
      worthSuffix: "off at checkout",
      qualifying: "Upgrade to Gold",
      benefits: "Benefits",
    },
    retentionLine: "Earn 179+ pts by 31 Mar 2027 to upgrade",
    earnLine: "Silver earning 1x points",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("321")).toBeInTheDocument();
    expect(canvas.getByText("321 / 500 pts")).toBeInTheDocument();
    const progress = canvas.getByRole("progressbar", {
      name: "Upgrade to Gold",
    });
    expect(progress).toHaveAttribute("aria-valuenow", "321");
    expect(progress).toHaveAttribute("aria-valuemax", "500");
  },
};

/** Gold: the retention ask is keeping the tier already held. With a Tier & Benefits address the whole card is the link to it. */
export const Gold: Story = {
  args: { href: "#tier-and-benefits" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const card = canvasElement.querySelector('[data-slot="tier-card"]');
    expect(card?.tagName).toBe("A");
    expect(card).toHaveAttribute("href", "#tier-and-benefits");
    expect(canvas.getByText("750")).toBeInTheDocument();
    expect(canvas.getByText("250 / 500 pts")).toBeInTheDocument();
    expect(
      canvas.getByText("Earn 250+ pts by 31 Dec 2027 to stay Gold"),
    ).toBeInTheDocument();
  },
};

/** Black is held by invitation: the crown badge, and no progress at all. */
export const Black: Story = {
  args: {
    variant: "black",
    tier: "Black",
    balance: "6,900",
    worth: "HK$690",
    qualifyingPoints: undefined,
    qualifyingThreshold: undefined,
    retentionLine: undefined,
    earnLine: "Black earning 1.7x points",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("6,900")).toBeInTheDocument();
    expect(canvas.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(canvas.queryByText(/pts\//)).not.toBeInTheDocument();
  },
};

/** Past the threshold the bar caps at the threshold instead of overflowing. */
export const ThresholdReached: Story = {
  args: { qualifyingPoints: 610 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const progress = canvas.getByRole("progressbar", { name: "Keep Gold" });
    expect(progress).toHaveAttribute("aria-valuenow", "500");
    expect(canvas.getByText("610 / 500 pts")).toBeInTheDocument();
  },
};

/** A member holding nothing: zero reads, and a bar at none. */
export const NoPoints: Story = {
  args: {
    variant: "silver",
    tier: "Silver",
    balance: "0",
    worth: "HK$0",
    qualifyingPoints: 0,
    earnLine: "Silver earning 1x points",
    copy: {
      balance: "Points to spend",
      points: "pts",
      worthSuffix: "off at checkout",
      qualifying: "Upgrade to Gold",
      benefits: "Benefits",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("0")).toBeInTheDocument();
    expect(
      canvas.getByRole("progressbar", { name: "Upgrade to Gold" }),
    ).toHaveAttribute("aria-valuenow", "0");
  },
};

/** With only a press handler the card is a button that reports the press. */
export const Pressed: Story = {
  args: { onClick: fn() },
  play: async ({ canvasElement, args }) => {
    const card = canvasElement.querySelector('[data-slot="tier-card"]');
    expect(card?.tagName).toBe("BUTTON");
    (card as HTMLElement).click();
    expect(args.onClick).toHaveBeenCalledOnce();
  },
};
