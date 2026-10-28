import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import cover from "../store-home/store-home-hero.fixture.png";
import { CampaignWayCard } from "./campaign-way-card";

const stages = ["Sent", "Checking", "Won", "Collect"];

const meta = {
  title: "Loyalty/Campaigns/Blocks/CampaignWayCard",
  component: CampaignWayCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
  args: {
    kindLabel: "Photo hunt",
    title: "Find the car",
    description: "Our car is parked somewhere in the city.",
    rewardLabel: "A Pokémon card pack",
    steps: [
      "Find the gold car with the GR 10 plate.",
      "Post a photo on Instagram or Threads and tag @grade10.",
      "Paste the link here.",
    ],
    tone: "act",
    step: "submit",
    children: (
      <>
        <TextInput
          label="Link to your post"
          message="Instagram or Threads, public post"
          placeholder="https://www.instagram.com/p/…"
        />
        <Button size="sm" type="button">
          Send for review
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof CampaignWayCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Something to do: the steps, then the link form in the gold band. */
export const SendYourLink: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("A Pokémon card pack")).toBeVisible();
    expect(canvas.getAllByRole("listitem")).toHaveLength(3);
    const card = canvasElement.querySelector('[data-slot="campaign-way"]');
    expect(card).toHaveAttribute("data-tone", "act");
    expect(card).toHaveAttribute("data-step", "submit");
  },
};

export const Checking: Story = {
  args: {
    steps: [],
    tone: "wait",
    step: "pending",
    track: { stages, at: 1 },
    children: <Text weight="bold">We're checking your post.</Text>,
  },
  play: async ({ canvasElement }) => {
    const current = canvasElement.querySelector('[aria-current="step"]');
    expect(current).toHaveTextContent("Checking");
  },
};

export const Won: Story = {
  args: {
    steps: [],
    tone: "won",
    step: "held",
    track: { stages, at: 2 },
    children: <Text weight="bold">You found it. The pack is yours.</Text>,
  },
};

export const AllGone: Story = {
  args: {
    kindLabel: "Sign-up win",
    title: "First 50 sign-ups",
    steps: [],
    tone: "off",
    step: "soldOut",
    children: <Text weight="bold">All 50 packs are gone.</Text>,
  },
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('[data-slot="campaign-way"]');
    expect(card).toHaveAttribute("data-tone", "off");
  },
};

/** A scene across the top; the gift moves down beside its name. */
export const WithCover: Story = {
  args: { coverImageUrl: cover },
  play: async ({ canvasElement }) => {
    const top = canvasElement.querySelector('[data-slot="campaign-way-cover"]');
    expect(top?.tagName).toBe("IMG");
    expect(
      canvasElement.querySelector(
        '[data-slot="campaign-way-gift"] [data-slot="campaign-gift-art"]',
      ),
    ).not.toBeNull();
  },
};

/** Two cards side by side: one height, bands level whatever each holds. */
export const SideBySide: Story = {
  decorators: [
    (Story) => (
      <div className="grid max-w-4xl gap-4 md:grid-cols-2">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <>
      <CampaignWayCard
        kindLabel="Sign-up win"
        rewardLabel="A Pokémon card pack"
        step="join"
        steps={["Join Grade10 free.", "The first 50 each win a pack."]}
        title="First 50 sign-ups"
        tone="act"
      >
        <Text weight="bold">Become a member to claim yours.</Text>
      </CampaignWayCard>
      <CampaignWayCard {...args} coverImageUrl={cover} step="signIn">
        <Text weight="bold">Sign in to take part.</Text>
      </CampaignWayCard>
    </>
  ),
  play: async ({ canvasElement }) => {
    const bands = [
      ...canvasElement.querySelectorAll('[data-slot="campaign-way-band"]'),
    ].map((band) => band.getBoundingClientRect().bottom);
    expect(bands).toHaveLength(2);
    if (window.innerWidth >= 768) expect(bands[0]).toBe(bands[1]);
  },
};
