import { Button } from "@grade10/design-system/components/forms/button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CampaignFacts } from "./campaign-facts";
import { CampaignGift } from "./campaign-gift";
import {
  CampaignDates,
  CampaignPanel,
  CampaignQuestions,
} from "./campaign-panel";
import { CampaignShare } from "./campaign-share";

/** The sections under a campaign's hero, in page order. */
function CampaignSections() {
  return (
    <div className="grid max-w-4xl gap-8">
      <CampaignFacts
        facts={[
          { label: "Runs", value: "1 Nov – 30 Nov" },
          { label: "Prize", value: "Pokémon card pack" },
          { label: "Collect at", value: "Grade10, Causeway Bay" },
        ]}
      />
      <CampaignGift
        eyebrow="What you can win"
        text="One per way to win. Collect it at the store once it opens."
        title="A sealed Pokémon card pack"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <CampaignPanel title="Key dates">
          <CampaignDates
            dates={[
              { day: "1 Nov", text: "The campaign opens.", past: true },
              { day: "30 Nov", text: "Last day to take part." },
              { day: "15 Jan", text: "Collect at the store from today." },
            ]}
          />
        </CampaignPanel>
        <CampaignPanel title="Good to know">
          <CampaignQuestions
            questions={[
              { question: "Can I win both?", answer: "Yes." },
              {
                question: "What if my link is turned down?",
                answer: "Send another one.",
              },
            ]}
          />
        </CampaignPanel>
      </div>
      <CampaignShare
        action={
          <Button size="sm" type="button">
            Share the campaign
          </Button>
        }
        text="Know someone who should be hunting too?"
      />
    </div>
  );
}

const meta = {
  title: "Loyalty/Campaigns/Blocks/CampaignSections",
  component: CampaignSections,
  parameters: { layout: "padded" },
} satisfies Meta<typeof CampaignSections>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Collect at")).toBeVisible();
    expect(canvas.getByText("A sealed Pokémon card pack")).toBeVisible();
    expect(canvas.getByText("Yes.")).toBeVisible();
    expect(
      canvasElement.querySelector('[data-slot="campaign-dates"] [data-past]'),
    ).toHaveTextContent("1 Nov");
  },
};
