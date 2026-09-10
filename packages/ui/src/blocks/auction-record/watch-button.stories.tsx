import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { WATCH_COPY } from "./fixtures";
import { WatchButton } from "./watch-button";

const watchPressed = fn();

/**
 * Lot-page watch control (`WatchButton`) — Bell / BellSlash treatment used on
 * listing details and catalogue tiles. My Auctions table rows use the trash
 * Unwatch button instead; this story is not the account table.
 */
const meta = {
  title: "My Auctions/WatchButton",
  component: WatchButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof WatchButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Watch: Story = {
  name: "Watch",
  args: {
    copy: WATCH_COPY,
    onPress: watchPressed,
    watched: false,
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Watch this lot" }),
    );
    expect(watchPressed).toHaveBeenCalled();
  },
};

export const Watching: Story = {
  name: "Watching",
  args: {
    copy: WATCH_COPY,
    onPress: watchPressed,
    watched: true,
  },
};
