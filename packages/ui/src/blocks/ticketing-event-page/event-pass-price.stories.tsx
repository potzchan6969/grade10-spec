import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { EventPassPriceText } from "./event-pass-price";

const meta = {
  title: "Ticketing/Buying/Blocks/EventPassPriceText",
  component: EventPassPriceText,
  parameters: { layout: "padded" },
  args: {
    price: "HK$380.00",
    was: "HK$480.00",
    wasWord: "Was",
    size: "md",
    className: "gap-2.5",
  },
} satisfies Meta<typeof EventPassPriceText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Early bird: the full price struck, read as "Was …". */
export const EarlyBird: Story = {
  name: "Early Bird",
  play: async ({ canvasElement }) => {
    const struck = canvasElement.querySelector("s");
    await expect(struck).toHaveTextContent("Was HK$480.00");
  },
};

/** Sales ended: the price alone, in grey. */
export const Ended: Story = {
  args: { was: undefined, muted: true, price: "HK$480.00" },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByText("Was"),
    ).not.toBeInTheDocument();
  },
};
