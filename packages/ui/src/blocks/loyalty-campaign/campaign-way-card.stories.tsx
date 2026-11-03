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
      <div className="max-w-4xl">
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
  parameters: {
    verification: { caseId: "vc_727be7fa-fcab-47ab-a935-ed11197fb5bd" },
  },
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
  parameters: {
    verification: { caseId: "vc_408c12dc-27dd-4a67-8749-088d917c40ba" },
  },
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
  parameters: {
    verification: { caseId: "vc_9cc3d0c1-a6d5-48ed-8935-9ed23169f9d8" },
  },
  args: {
    steps: [],
    tone: "won",
    step: "held",
    track: { stages, at: 2 },
    children: <Text weight="bold">You found it. The pack is yours.</Text>,
  },
};

export const AllGone: Story = {
  parameters: {
    verification: { caseId: "vc_8c67399b-9e2f-4063-883b-68e73e3241e9" },
  },
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
  parameters: {
    verification: { caseId: "vc_d46768cd-86c0-4261-87ff-e6e426021cc5" },
  },
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

/** The ways stacked, as the page lays them out. */
export const Stacked: Story = {
  parameters: {
    verification: { caseId: "vc_e036116a-8ca1-4be5-9b2e-57ce4d337b54" },
  },
  decorators: [
    (Story) => (
      <div className="grid max-w-4xl gap-4">
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
    const [first, second] = [
      ...canvasElement.querySelectorAll('[data-slot="campaign-way"]'),
    ].map((card) => card.getBoundingClientRect());
    expect(second?.top).toBeGreaterThanOrEqual(first?.bottom ?? 0);
  },
};
