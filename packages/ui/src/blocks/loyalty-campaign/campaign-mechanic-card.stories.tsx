import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CampaignMechanicCard } from "./campaign-mechanic-card";

const meta = {
  title: "Loyalty/Campaigns/Blocks/CampaignMechanicCard",
  component: CampaignMechanicCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "First 50 signups",
    description: "Sign up before the store opens.",
    rewardLabel: "A Pokémon card pack",
    remaining: "12 left",
    step: "join",
    children: (
      <>
        <Text size="sm">Become a member to claim yours</Text>
        <Button size="sm" type="button">
          Join now
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof CampaignMechanicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A prototype: the card primitive's look until the card is designed. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("A Pokémon card pack")).toBeInTheDocument();
    expect(canvas.getByText("12 left")).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Join now" })).toBeVisible();
    const card = canvasElement.querySelector('[data-slot="campaign-mechanic"]');
    expect(card).toHaveAttribute("data-step", "join");
    expect(card).toHaveAttribute("data-prototype");
  },
};

/** A gift held for the member: no count left to show. */
export const Held: Story = {
  args: {
    remaining: null,
    step: "held",
    children: (
      <Text role="status" size="sm" tone="success" weight="medium">
        This gift is reserved for you. It will appear in your wallet once it is
        ready to collect at the store.
      </Text>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("12 left")).toBeNull();
    expect(canvas.getByRole("status")).toBeVisible();
  },
};
