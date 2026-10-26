import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { CampaignBanner } from "./campaign-banner";

const meta = {
  title: "Loyalty/Campaigns/Blocks/CampaignBanner",
  component: CampaignBanner,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    title: "Catch Me If You Can",
    tagline: "Find the car, win the pack",
    action: { label: "See the campaign", href: "/campaigns/catch-me" },
  },
} satisfies Meta<typeof CampaignBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A prototype: the card primitive's look until the banner is designed. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Catch Me If You Can")).toBeInTheDocument();
    expect(
      canvas.getByRole("link", { name: "See the campaign" }),
    ).toHaveAttribute("href", "/campaigns/catch-me");
    expect(
      canvasElement.querySelector('[data-slot="campaign-banner"]'),
    ).toHaveAttribute("data-prototype");
  },
};

/** With its picture above the name. */
export const WithPicture: Story = {
  args: {
    imageUrl:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 1'><rect width='3' height='1' fill='%23ddd'/></svg>",
  },
  play: async ({ canvasElement }) => {
    expect(
      canvasElement.querySelector('[data-slot="campaign-banner-image"]'),
    ).toBeInTheDocument();
  },
};

/** No tagline: the name and the link alone. */
export const NoTagline: Story = {
  args: { tagline: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText("Find the car, win the pack")).toBeNull();
  },
};
