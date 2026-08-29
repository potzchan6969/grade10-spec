import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveCountdownDemo } from "./live-countdown-demo";

const meta = {
  title: "Auction Listing/ListingBidPanel/Flows",
  component: LiveCountdownDemo,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LiveCountdownDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Countdown: Story = {
  render: () => <LiveCountdownDemo />,
};
