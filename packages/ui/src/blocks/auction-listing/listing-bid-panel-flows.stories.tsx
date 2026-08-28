import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { LiveActions, WatchOnlyActions } from "./fixtures";
import { ListingBidPanel } from "./listing-bid-panel";

const DAY_SECONDS = 24 * 60 * 60;
const HOUR_SECONDS = 60 * 60;
const REPLAY_DELAY_MS = 3 * 1000;

const meta = {
  title: "Auction Listing/ListingBidPanel/Flows",
  component: ListingBidPanel,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ListingBidPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

type CountdownProps = {
  initialSeconds: number;
  replayBelowSeconds?: number;
  extensionStarted?: boolean;
};

function formatRemaining(seconds: number) {
  const days = Math.floor(seconds / DAY_SECONDS);
  const hours = Math.floor((seconds % DAY_SECONDS) / HOUR_SECONDS);
  const minutes = Math.floor((seconds % HOUR_SECONDS) / 60);
  return `${days}D ${hours}H ${minutes}M ${seconds % 60}S`;
}

function Countdown({
  initialSeconds,
  replayBelowSeconds = 0,
  extensionStarted = false,
}: CountdownProps) {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const elapsedSeconds = Math.floor((now - startedAt) / 1000);
  const seconds = Math.max(0, initialSeconds - elapsedSeconds);
  const reachesReplayPoint = seconds < replayBelowSeconds || seconds === 0;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!reachesReplayPoint) return;

    const replay = window.setTimeout(() => {
      const nextStart = Date.now();
      setStartedAt(nextStart);
      setNow(nextStart);
    }, REPLAY_DELAY_MS);
    return () => window.clearTimeout(replay);
  }, [reachesReplayPoint]);

  return (
    <ListingBidPanel
      copy={{
        ends: "Ends",
        extension: "Extended bidding",
        extensionTooltip: "Extended bidding rules",
        maximum: "Your maximum",
        price: "Current bid",
      }}
      actions={<LiveActions />}
      bidCount="3 Bids"
      deadline="Storybook countdown"
      extensionTooltip="Bids placed in the final 30 minutes extend the auction by 30 minutes."
      extensionValue="30 minutes"
      history="Latest bids appear here."
      kicker={
        extensionStarted
          ? "Extended bidding in progress"
          : "Storybook countdown example"
      }
      price="HK$4,800.00"
      remaining={formatRemaining(seconds)}
      title="1999 Charizard, PSA 10"
      watchAction={<WatchOnlyActions />}
    />
  );
}

/** A standard live-auction countdown. */
export const Countdown: Story = {
  render: () => <Countdown initialSeconds={15 * 60} />,
};

/** Starts within the 30-minute extension evaluation window. */
export const CountdownFrom30m: Story = {
  render: () => <Countdown initialSeconds={30 * 60} />,
};

/** Replays three seconds after the day value drops to zero. */
export const CountdownFrom1d5s: Story = {
  render: () => (
    <Countdown
      initialSeconds={DAY_SECONDS + 5}
      replayBelowSeconds={DAY_SECONDS}
    />
  ),
};

/** Replays three seconds after the hour value drops to zero. */
export const CountdownFrom1h5s: Story = {
  render: () => (
    <Countdown
      initialSeconds={HOUR_SECONDS + 5}
      replayBelowSeconds={HOUR_SECONDS}
    />
  ),
};

/** Replays three seconds after reaching zero. */
export const CountdownFrom5s: Story = {
  render: () => <Countdown initialSeconds={5} />,
};

/** A normal countdown after an extension has started. */
export const CountdownFrom15mAfterExtension: Story = {
  render: () => <Countdown initialSeconds={15 * 60} extensionStarted />,
};

/** Replays three seconds after zero during extended bidding. */
export const CountdownFrom5sAfterExtension: Story = {
  render: () => <Countdown initialSeconds={5} extensionStarted />,
};
