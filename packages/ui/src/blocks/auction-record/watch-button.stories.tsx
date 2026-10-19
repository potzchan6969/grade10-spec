import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
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
  title: "Auction/Bidding/Blocks/WatchButton",
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

/** Toasts outlive a story in the shared frame; each announcing play starts clear. */
async function clearToasts() {
  toast.dismiss();
  await waitFor(() =>
    expect(document.querySelector("[data-sonner-toast]")).toBeNull(),
  );
}

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
      within(canvasElement).getByRole("button", { name: "Watch this auction" }),
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
    await clearToasts();
    openMyAuctions.mockClear();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "Watch this auction" }),
    );
    await waitFor(() =>
      expect(
        body.getByText("Email alerts on for this auction"),
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
    await clearToasts();
    undoUnwatch.mockClear();
    const canvas = within(canvasElement);
    const body = within(document.body);

    await userEvent.click(
      canvas.getByRole("button", { name: "Unwatch this auction" }),
    );
    await waitFor(() =>
      expect(body.getByText("Unwatched this auction")).toBeInTheDocument(),
    );
    expect(
      body.getByText("Email alerts for this auction are off."),
    ).toBeInTheDocument();
    await userEvent.click(body.getByRole("button", { name: "Undo" }));
    expect(undoUnwatch).toHaveBeenCalled();
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "Unwatch this auction" }),
      ).toBeVisible(),
    );
  },
};

/** The owner's write is in flight: busy, still focusable, a second press is refused. */
export const Pending: Story = {
  name: "Pending",
  args: {
    copy: WATCH_COPY,
    onPress: watchPressed,
    pending: true,
    watched: true,
  },
  play: async ({ canvasElement }) => {
    watchPressed.mockClear();
    const button = within(canvasElement).getByRole("button", {
      name: "Unwatch this auction",
    });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    button.focus();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(watchPressed).not.toHaveBeenCalled();
  },
};

/** The owner refused the last press: the refusal shows beside the control. */
export const Refused: Story = {
  name: "Refused",
  args: {
    copy: WATCH_COPY,
    failed: "We could not watch this auction. Try again.",
    onPress: watchPressed,
    watched: false,
  },
  play: async ({ canvasElement }) => {
    watchPressed.mockClear();
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "We could not watch this auction. Try again.",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Watch this auction" }),
    );
    expect(watchPressed).toHaveBeenCalled();
  },
};

function WatchRefusedOwner() {
  const [watched, setWatched] = useState(false);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState<string>();

  return (
    <WatchButton
      copy={WATCH_COPY}
      failed={failed}
      onPress={() => {
        setFailed(undefined);
        setWatched(true);
        setPending(true);
        setTimeout(() => {
          setWatched(false);
          setPending(false);
          setFailed("We could not watch this auction. Try again.");
        }, 50);
      }}
      onWatchedToastAction={openMyAuctions}
      pending={pending}
      watched={watched}
    />
  );
}

/** A refused write moves back and says why; no Watched toast announces it. */
export const RefusedRollbackIsSilent: Story = {
  name: "Refused rollback is silent",
  args: {
    copy: WATCH_COPY,
    onPress: watchPressed,
    watched: false,
  },
  render: () => <WatchRefusedOwner />,
  play: async ({ canvasElement }) => {
    await clearToasts();
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Watch this auction" }),
    );
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(
        "We could not watch this auction. Try again.",
      ),
    );
    expect(
      within(document.body).queryByText("Email alerts on for this auction"),
    ).toBeNull();
    expect(
      canvas.getByRole("button", { name: "Watch this auction" }),
    ).not.toHaveAttribute("aria-busy");
  },
};
