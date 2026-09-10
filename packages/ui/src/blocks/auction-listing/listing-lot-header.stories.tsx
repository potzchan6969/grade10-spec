import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { ListingLotHeader } from "./listing-lot-header";

const onWatchToggle = fn();

const HEADER_COPY = {
  auctionBreadcrumb: "Auctions",
  lotBreadcrumb: "Lot",
  watch: "Watch",
  watching: "Watching",
  watchAriaLabel: "Watch this lot",
  unwatchAriaLabel: "Unwatch this lot",
  watchedToast: {
    title: "Email alerts on for this lot",
    actionLabel: "View My Auctions",
  },
  unwatchedToast: {
    title: "Unwatched this lot",
    description: "Email alerts for this lot are off too.",
    actionLabel: "Undo",
  },
};

const meta = {
  title: "Auction Listing/LotHeader",
  component: ListingLotHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: HEADER_COPY,
    title: "1999 Base Set Charizard PSA 9",
    onWatchToggle,
    watched: false,
  },
} satisfies Meta<typeof ListingLotHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Watch: Story = {
  name: "Watch",
  play: async ({ canvasElement }) => {
    onWatchToggle.mockClear();
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Watch this lot" }),
    );
    expect(onWatchToggle).toHaveBeenCalled();
  },
};

export const Watching: Story = {
  name: "Watching",
  args: { watched: true },
};

export const LockedWatching: Story = {
  name: "Locked Watching",
  args: {
    watched: true,
    watchLocked: true,
  },
  play: async ({ canvasElement }) => {
    onWatchToggle.mockClear();
    const button = within(canvasElement).getByRole("button", {
      name: "Watching",
    });
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onWatchToggle).not.toHaveBeenCalled();
  },
};

function InteractiveHeader() {
  const [watched, setWatched] = useState(false);
  return (
    <ListingLotHeader
      copy={HEADER_COPY}
      onWatchToggle={() => setWatched((current) => !current)}
      title="1999 Base Set Charizard PSA 9"
      watched={watched}
    />
  );
}

export const Interactive: Story = {
  name: "Interactive",
  render: () => <InteractiveHeader />,
};

/** Closed lot (sold or unsold) — no watch control. */
export const ClosedNoWatch: Story = {
  name: "Closed — no watch",
  args: {
    onWatchToggle: undefined,
    watched: false,
    watchLocked: false,
  },
  play: async ({ canvasElement }) => {
    expect(
      within(canvasElement).queryByRole("button", { name: /watch/i }),
    ).not.toBeInTheDocument();
  },
};
