import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import heroImage from "../store-home/store-home-hero.fixture.png";
import { CampaignHero } from "./campaign-hero";

const meta = {
  title: "Loyalty/Campaigns/Blocks/CampaignHero",
  component: CampaignHero,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Catch Me If You Can",
    tagline: "Two ways to win a Pokémon card pack before our doors open.",
    phase: "live",
    phaseLabel: "Live · ends 30 Nov",
    actions: <Button type="button">Join free and take part</Button>,
  },
} satisfies Meta<typeof CampaignHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No key art yet: the hero draws its own night with a warm glow. */
export const WithoutArt: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Catch Me If You Can" }),
    ).toBeVisible();
    expect(canvas.getByText("Live · ends 30 Nov")).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="campaign-hero-glow"]'),
    ).not.toBeNull();
  },
};

export const WithArt: Story = {
  args: {
    imageUrl: heroImage,
  },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="campaign-hero-image"]'),
    ).not.toBeNull();
  },
};

export const Ended: Story = {
  args: { phase: "ended", phaseLabel: "Ended 30 Nov", actions: undefined },
  play: async ({ canvasElement }) => {
    const hero = canvasElement.querySelector('[data-slot="campaign-hero"]');
    expect(hero).toHaveAttribute("data-phase", "ended");
    expect(within(canvasElement).queryByRole("button")).toBeNull();
  },
};
