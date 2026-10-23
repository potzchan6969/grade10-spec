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
  parameters: {
    verification: { caseId: "vc_312e9df7-9ad0-419a-9580-af4b3b22a890" },
  },
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
  parameters: {
    verification: { caseId: "vc_c734e0e6-3c1b-472f-b2ff-ede7988105a0" },
  },
  name: "Watching",
  args: {
    copy: WATCH_COPY,
    onPress: watchPressed,
    watched: true,
  },
};

/** Bid stands — Watching stays on; press is not reported. */
export const LockedWatching: Story = {
  parameters: {
    verification: { caseId: "vc_f1614692-224b-476a-ba11-6da98cbccab4" },
  },
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
  parameters: {
    verification: { caseId: "vc_404af8ce-4106-4aba-9ca6-fa028073d873" },
  },
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
  parameters: {
    verification: { caseId: "vc_85ec0e5e-4052-460d-a40b-1d2c6279429f" },
  },
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
  parameters: {
    verification: { caseId: "vc_ebfa142f-ac61-41b6-a75d-8acf00deb109" },
  },
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
  parameters: {
    verification: { caseId: "vc_5072b61d-f9f3-4c00-b6aa-57fadb5c341c" },
  },
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
  parameters: {
    verification: { caseId: "vc_e4f63145-9846-4a51-8a83-392a0098afad" },
  },
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
