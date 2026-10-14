import { Toast, toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ListingLotHeader } from "./listing-lot-header";

const onWatchToggle = fn();
const openMyAuctions = fn();
const undoUnwatch = fn();

const HEADER_COPY = {
  auctionBreadcrumb: "Auctions",
  lotBreadcrumb: "Auction Details",
  watch: "Watch",
  watching: "Watching",
  watchAriaLabel: "Watch this auction",
  unwatchAriaLabel: "Unwatch this auction",
  watchedToast: {
    title: "Email alerts on for this auction",
    actionLabel: "View My Auctions",
  },
  unwatchedToast: {
    title: "Unwatched this auction",
    description: "Email alerts for this auction are off.",
    actionLabel: "Undo",
  },
};

const meta = {
  title: "Auction/Display/Blocks/ListingLotHeader",
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
  play: async ({ canvasElement }) => {
    onWatchToggle.mockClear();
    await userEvent.click(
      within(canvasElement).getByRole("button", {
        name: "Watch this auction",
      }),
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
    onWatchToggle,
    watched: true,
  },
  render: () => <InteractiveHeader initialWatched />,
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

/** The owner refused the last watch press: the refusal shows beside Watch. */
export const WatchRefused: Story = {
  name: "Watch refused",
  args: {
    watchFailed: "We could not watch this auction. Try again.",
  },
  play: async ({ canvasElement }) => {
    onWatchToggle.mockClear();
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "We could not watch this auction. Try again.",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Watch this auction" }),
    );
    expect(onWatchToggle).toHaveBeenCalled();
  },
};

/** The watch write is in flight: busy, focusable, a second press is refused. */
export const WatchPending: Story = {
  name: "Watch pending",
  args: { watchPending: true },
  play: async ({ canvasElement }) => {
    onWatchToggle.mockClear();
    const button = within(canvasElement).getByRole("button", {
      name: "Watch this auction",
    });
    expect(button).toHaveAttribute("aria-busy", "true");
    button.focus();
    expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    expect(onWatchToggle).not.toHaveBeenCalled();
  },
};
