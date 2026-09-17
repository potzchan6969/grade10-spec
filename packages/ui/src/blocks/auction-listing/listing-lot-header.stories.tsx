import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ListingLotHeader } from "./listing-lot-header";

const onWatchToggle = fn();
const openMyAuctions = fn();
const undoUnwatch = fn();

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
  decorators: [
    (Story) => (
      <>
        <Toast position="bottom-right" />
        <Story />
      </>
    ),
  ],
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
    /* The locked button carries `pointer-events: none`, so a plain click is
       refused before it reaches the DOM. Forcing the pointer through proves
       the press itself reports nothing. */
    await userEvent.click(button, { pointerEventsCheck: 0 });
    expect(onWatchToggle).not.toHaveBeenCalled();
  },
};

function InteractiveHeader({
  initialWatched = false,
}: {
  initialWatched?: boolean;
}) {
  const [watched, setWatched] = useState(initialWatched);
  return (
    <ListingLotHeader
      copy={HEADER_COPY}
      onUnwatchedToastAction={() => {
        undoUnwatch();
        setWatched(true);
      }}
      onWatchToggle={() => setWatched((current) => !current)}
      onWatchedToastAction={openMyAuctions}
      title="1999 Base Set Charizard PSA 9"
      watched={watched}
    />
  );
}

export const Interactive: Story = {
  name: "Interactive",
  render: () => <InteractiveHeader />,
};

export const WatchAnnounces: Story = {
  name: "Watch announces",
  args: {
    onWatchToggle,
    watched: false,
  },
  render: () => <InteractiveHeader />,
  play: async ({ canvasElement }) => {
    openMyAuctions.mockClear();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "Watch this lot" }),
    );
    await waitFor(() =>
      expect(
        body.getByText("Email alerts on for this lot"),
      ).toBeInTheDocument(),
    );
    await userEvent.click(
      body.getByRole("button", { name: "View My Auctions" }),
    );
    expect(openMyAuctions).toHaveBeenCalled();
  },
};

export const UnwatchAnnounces: Story = {
  name: "Unwatch announces",
  args: {
    onWatchToggle,
    watched: true,
  },
  render: () => <InteractiveHeader initialWatched />,
  play: async ({ canvasElement }) => {
    undoUnwatch.mockClear();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "Unwatch this lot" }),
    );
    await waitFor(() =>
      expect(body.getByText("Unwatched this lot")).toBeInTheDocument(),
    );
    expect(
      body.getByText("Email alerts for this lot are off too."),
    ).toBeInTheDocument();
    await userEvent.click(body.getByRole("button", { name: "Undo" }));
    expect(undoUnwatch).toHaveBeenCalled();
  },
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
