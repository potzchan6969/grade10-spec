import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import { TextInput } from "@grade10/design-system/components/forms/text-input";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { CampaignBanner, CampaignMechanicCard } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";

/** English copy as `@grade10/i18n`'s `membership.campaign` words it. */
const words = {
  title: "Catch Me If You Can",
  tagline: "Find the car, win the pack",
  endsOn: "Runs until 30 Nov 2026",
  body: "A car is parked somewhere in town. Find it, post it, and the pack is yours.",
  rules: "Full rules",
  bannerAction: "See the campaign",
  join: "Become a member to claim yours",
  joinAction: "Join now",
  linkLabel: "Link to your post",
  linkHint: "Paste the link to your public Instagram or Threads post.",
  submitAction: "Send for review",
  held: "This gift is reserved for you. It will appear in your wallet once it is ready to collect at the store.",
  pending: "We are checking your post. The result shows here.",
};

const pack = "A Pokémon card pack";

/**
 * The campaign page and the membership banner, drawn on the two prototype
 * blocks until the designer draws them. One card per state the page most
 * needs designed.
 */
function CampaignPagePrototype() {
  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-background px-8 py-12">
      <aside className="max-w-xl rounded-2xl border border-border p-4 text-sm">
        <Text size="sm" weight="medium">
          Not yet designed
        </Text>
        <Text size="sm" tone="secondary">
          CampaignBanner and CampaignMechanicCard are prototype blocks: the card
          primitive's look, standing in. The design must still settle the banner
          on the membership page (its picture, where it sits, how two running
          campaigns stack), the campaign page's hero and how its rules read, the
          way-of-taking-part card (the gift's art in place of a badge, how the
          count left reads) and each state it holds — join, sign in, the link
          form, checking, a rejected link, held, granted, collected, missed, all
          gone, opens soon and closed. Manual page:{" "}
          <Link href="https://spec.grade10-stg.com/p/grade10-site/loyalty/campaigns">
            Campaigns
          </Link>
          .
        </Text>
      </aside>

      <section className="max-w-md">
        <CampaignBanner
          action={{ label: words.bannerAction, href: "#campaign" }}
          tagline={words.tagline}
          title={words.title}
        />
      </section>

      <VStack className="max-w-2xl" gap="md" id="campaign">
        <h1 className="text-3xl font-bold text-foreground">{words.title}</h1>
        <Text size="lg" weight="medium">
          {words.tagline}
        </Text>
        <Text tone="secondary">{words.endsOn}</Text>
        <Text as="p" tone="secondary">
          {words.body}
        </Text>
        <Link href="#rules">{words.rules}</Link>

        <CampaignMechanicCard
          description="Sign up before the store opens."
          remaining="12 left"
          rewardLabel={pack}
          step="join"
          title="First 50 signups"
        >
          <Text size="sm">{words.join}</Text>
          <Button size="sm" type="button">
            {words.joinAction}
          </Button>
        </CampaignMechanicCard>

        <CampaignMechanicCard
          description="Post the car you found on Instagram or Threads."
          remaining="3 left"
          rewardLabel={pack}
          step="submit"
          title="Find the car"
        >
          <TextInput
            inputMode="url"
            label={words.linkLabel}
            message={words.linkHint}
            placeholder="https://www.instagram.com/p/…"
            type="url"
          />
          <Button size="sm" type="button">
            {words.submitAction}
          </Button>
        </CampaignMechanicCard>

        <CampaignMechanicCard
          rewardLabel={pack}
          step="pending"
          title="Find the car"
        >
          <Text role="status" size="sm">
            {words.pending}
          </Text>
        </CampaignMechanicCard>

        <CampaignMechanicCard
          rewardLabel={pack}
          step="held"
          title="First 50 signups"
        >
          <Text role="status" size="sm" tone="success" weight="medium">
            {words.held}
          </Text>
        </CampaignMechanicCard>
      </VStack>
    </div>
  );
}

const meta = {
  title: "Loyalty/Campaigns/Prototypes/Campaign Page",
  component: CampaignPagePrototype,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof CampaignPagePrototype>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The banner, then the page with a card in each state it most needs drawn. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Not yet designed")).toBeVisible();
    expect(
      canvas.getByRole("link", { name: words.bannerAction }),
    ).toBeVisible();
    expect(
      canvasElement.querySelectorAll('[data-slot="campaign-mechanic"]'),
    ).toHaveLength(4);
  },
};
