import { useEffect, useState } from "react";

export const DAY_SECONDS = 24 * 60 * 60;
export const HOUR_SECONDS = 60 * 60;
export const COUNTDOWN_REPLAY_DELAY_MS = 3 * 1000;

export type CountdownScenario = {
  initialSeconds: number;
  replayBelowSeconds?: number;
  extensionStarted?: boolean;
};

export const COUNTDOWN_FLOW_SCENARIOS: ReadonlyArray<
  readonly [string, CountdownScenario]
> = [
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

export function countdownFormatForScenario(
  scenario: CountdownScenario,
): "short" | "long" {
  return scenario.initialSeconds >= HOUR_SECONDS ? "long" : "short";
}

export function useCountdownReplay({
  initialSeconds,
  replayBelowSeconds = 0,
}: CountdownScenario) {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const closesAtMs = startedAt + initialSeconds * 1000;
  const seconds = Math.max(0, Math.floor((closesAtMs - now) / 1000));
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
    }, COUNTDOWN_REPLAY_DELAY_MS);
    return () => window.clearTimeout(replay);
  }, [reachesReplayPoint]);

  return { closesAtMs, seconds };
}
