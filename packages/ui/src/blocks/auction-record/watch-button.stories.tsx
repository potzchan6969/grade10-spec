import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { WATCH_COPY } from "./fixtures";
import type { WatchButtonCopy } from "./types";
import { WatchButton } from "./watch-button";

const watchPressed = fn();
const openMyAuctions = fn();
const undoUnwatch = fn();

/**
 * Lot-page / catalogue watch control. My Auctions table rows use trash
 * Unwatch instead; this is the Bell control `ListingLotHeader` composes.
 */
const meta = {
  title: "Auction Listing/WatchButton",
  component: WatchButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <>
        <Toast position="bottom-right" />
        <Story />
      </>
    ),
  ],
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
    watchPressed.mockClear();
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

/** Bid stands — Watching stays on; press is not reported. */
export const LockedWatching: Story = {
  name: "Locked Watching",
  args: {
    copy: WATCH_COPY,
    locked: true,
    onPress: watchPressed,
    watched: true,
  },
  play: async ({ canvasElement }) => {
    watchPressed.mockClear();
    const button = within(canvasElement).getByRole("button", {
      name: "Watching",
    });
    expect(button).toBeDisabled();
    /* The locked button carries `pointer-events: none`, so a plain click is
       refused before it reaches the DOM. Forcing the pointer through proves
       the press itself reports nothing. */
    await userEvent.click(button, { pointerEventsCheck: 0 });
    expect(watchPressed).not.toHaveBeenCalled();
  },
};

function WatchWithToasts({
  initialWatched = false,
  copy = WATCH_COPY,
}: {
  initialWatched?: boolean;
  copy?: WatchButtonCopy;
}) {
  const [watched, setWatched] = useState(initialWatched);

  return (
    <WatchButton
      copy={copy}
      onPress={() => setWatched((current) => !current)}
      onUnwatchedToastAction={() => {
        undoUnwatch();
        setWatched(true);
      }}
      onWatchedToastAction={openMyAuctions}
      watched={watched}
    />
  );
}

export const WatchAnnounces: Story = {
  name: "Watch announces",
  args: {
    copy: WATCH_COPY,
    onPress: watchPressed,
    watched: false,
  },
  render: () => <WatchWithToasts />,
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
    copy: WATCH_COPY,
    onPress: watchPressed,
    watched: true,
  },
  render: () => <WatchWithToasts initialWatched />,
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
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "Unwatch this lot" }),
      ).toBeVisible(),
    );
  },
};
