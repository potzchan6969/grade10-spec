import { useEffect, useState } from "react";
import { DemoFlow } from "../shared/demo-flow";
import { LiveActions, WatchOnlyActions } from "./fixtures";
import { ListingBidPanel } from "./listing-bid-panel";

const DAY_SECONDS = 24 * 60 * 60;
const HOUR_SECONDS = 60 * 60;
const REPLAY_DELAY_MS = 3 * 1000;

type CountdownScenario = {
  initialSeconds: number;
  replayBelowSeconds?: number;
  extensionStarted?: boolean;
};

const SCENARIOS: ReadonlyArray<readonly [string, CountdownScenario]> = [
  ["15 minutes", { initialSeconds: 15 * 60 }],
  ["30 minutes · extension evaluation", { initialSeconds: 30 * 60 }],
  [
    "1 day 5 seconds · zero day",
    { initialSeconds: DAY_SECONDS + 5, replayBelowSeconds: DAY_SECONDS },
  ],
  [
    "1 hour 5 seconds · zero hour",
    { initialSeconds: HOUR_SECONDS + 5, replayBelowSeconds: HOUR_SECONDS },
  ],
  ["5 seconds · final countdown", { initialSeconds: 5 }],
  [
    "15 minutes · extension started",
    { initialSeconds: 15 * 60, extensionStarted: true },
  ],
  [
    "5 seconds · extension started",
    { initialSeconds: 5, extensionStarted: true },
  ],
];

function formatRemaining(seconds: number) {
  const days = Math.floor(seconds / DAY_SECONDS);
  const hours = Math.floor((seconds % DAY_SECONDS) / HOUR_SECONDS);
  const minutes = Math.floor((seconds % HOUR_SECONDS) / 60);
  return `${days}D ${hours}H ${minutes}M ${seconds % 60}S`;
}

function CountdownPreview({
  initialSeconds,
  replayBelowSeconds = 0,
  extensionStarted = false,
}: CountdownScenario) {
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

/** Steps through countdown boundaries, then lays them out for comparison. */
function LiveCountdownDemo() {
  return (
    <DemoFlow cases={SCENARIOS}>
      {(scenario, title) => <CountdownPreview key={title} {...scenario} />}
    </DemoFlow>
  );
}

export { LiveCountdownDemo };
