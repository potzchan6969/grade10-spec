import { Toast } from "@grade10/design-system/components/overlays/toast";
import { MemberPass } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useCallback, useEffect, useRef, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { MEMBER, MEMBER_PASS_COPY, MEMBERSHIP_VIEW } from "../loyalty-content";

/** The member code's life on this surface, in seconds. */
const CODE_SECONDS = 600;
/** Letters only — none of I, L, O or U, as the programme mints them. */
const CODES = ["KRMT-QWPB", "XJCD-4WMB", "DVDT-73CA", "FNHV-8SKC"];

type WakeLockSentinelLike = { release: () => Promise<void> };
type WakeLockLike = {
  request: (type: "screen") => Promise<WakeLockSentinelLike>;
};

/**
 * The member pass on its own page — the presentation a member holds up at a
 * till on their phone. The page owns the code loop: it counts the code down,
 * mints a fresh one the moment the last runs out and whenever the member asks,
 * and holds a screen wake lock while the pass is up so the screen cannot dim
 * or lock under the scanner. Nothing else shares the page.
 */
function MemberPassPage() {
  const [generation, setGeneration] = useState(0);
  const [seconds, setSeconds] = useState(CODE_SECONDS);
  const [refreshing, setRefreshing] = useState(false);
  const mintTimer = useRef<number | null>(null);

  const mint = useCallback(() => {
    if (mintTimer.current != null) return;
    setRefreshing(true);
    mintTimer.current = window.setTimeout(() => {
      mintTimer.current = null;
      setGeneration((value) => value + 1);
      setSeconds(CODE_SECONDS);
      setRefreshing(false);
    }, 400);
  }, []);

  useEffect(() => {
    const tick = window.setInterval(
      () => setSeconds((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => {
      window.clearInterval(tick);
      if (mintTimer.current != null) window.clearTimeout(mintTimer.current);
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) mint();
  }, [seconds, mint]);

  useEffect(() => {
    const wakeLock = (navigator as Navigator & { wakeLock?: WakeLockLike })
      .wakeLock;
    if (!wakeLock) return;
    let sentinel: WakeLockSentinelLike | null = null;
    let dropped = false;
    const request = () => {
      wakeLock
        .request("screen")
        .then((held) => {
          if (dropped) void held.release();
          else sentinel = held;
        })
        .catch(() => {});
    };
    request();
    const onVisible = () => {
      if (document.visibilityState === "visible") request();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      dropped = true;
      document.removeEventListener("visibilitychange", onVisible);
      void sentinel?.release();
    };
  }, []);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-10">
      <h1 className="sr-only">Member pass</h1>
      <MemberPass
        copy={MEMBER_PASS_COPY}
        email={MEMBER.email}
        fallbackCode={CODES[generation % CODES.length]}
        onRefresh={mint}
        refreshing={refreshing}
        state={{ status: "live", remainingSeconds: seconds }}
        tier={MEMBERSHIP_VIEW.tier}
        token={`${MEMBER.token}.${generation}`}
        variant={MEMBERSHIP_VIEW.tierVariant}
      />
      <Toast position="bottom-center" />
    </main>
  );
}

const meta = {
  title: "Loyalty/Membership/Screens/Member Pass",
  component: MemberPassPage,
  tags: ["autodocs"],
  globals: { viewport: { value: "mobile1" } },
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-store-membership-US-02"],
  },
} satisfies Meta<typeof MemberPassPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The pass alone on the page: countdown running, a wake lock held so the
 * screen cannot dim mid-scan, and Refresh minting a new code that swaps in
 * and out of view. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("mei.lin@example.com")).toBeInTheDocument();
    expect(canvas.getByText("Gold")).toBeInTheDocument();
    expect(canvas.getByText("KRMT-QWPB")).toBeInTheDocument();
    expect(canvas.getByText(/Refreshes in 10:0\d/)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "Refresh" }));
    await waitFor(() =>
      expect(canvas.getByText("XJCD-4WMB")).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(canvas.queryByText("KRMT-QWPB")).not.toBeInTheDocument(),
    );
  },
};
