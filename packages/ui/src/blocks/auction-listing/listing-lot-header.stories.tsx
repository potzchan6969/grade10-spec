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
  parameters: {
    verification: { caseId: "vc_d3210c02-27d9-40c0-b3e0-1c4c021ba0e8" },
  },
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
  parameters: {
    verification: { caseId: "vc_e16db52a-feca-49b3-a4cc-32afe6a9f706" },
  },
  name: "Watching",
  args: { watched: true },
};

export const LockedWatching: Story = {
  parameters: {
    verification: { caseId: "vc_79977274-4dd1-41aa-a417-d5c13e230c3e" },
  },
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
  parameters: {
    verification: { caseId: "vc_73d5c8e9-a8d3-4db2-a517-25674f2ad7d7" },
  },
  name: "Interactive",
  render: () => <InteractiveHeader />,
};

export const WatchAnnounces: Story = {
  parameters: {
    verification: { caseId: "vc_57bdfe9e-2470-4139-8f21-f472430c2b0e" },
  },
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
  parameters: {
    verification: { caseId: "vc_4a91deea-4dc3-4e91-8011-2488b669cd17" },
  },
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
  parameters: {
    verification: { caseId: "vc_add015d7-3e5b-4add-84ba-cb2cfccc2844" },
  },
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
  parameters: {
    verification: { caseId: "vc_3e3e8ae9-a49c-494b-86f3-b89e7bac5cf1" },
  },
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
  parameters: {
    verification: { caseId: "vc_85ce483e-5312-40e5-9e7e-f499fb78a06c" },
  },
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
