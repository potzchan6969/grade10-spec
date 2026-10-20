import { Toast } from "@grade10/design-system/components/overlays/toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { MEMBER_TOKEN } from "./fixtures";
import { MemberPass, type MemberPassProps } from "./member-pass";

const meta = {
  title: "Loyalty/Membership/Blocks/MemberPass",
  component: MemberPass,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    // The toaster sits before the story so it is already listening when a
    // refusal toasts on mount.
    (Story) => (
      <>
        <Toast position="bottom-right" />
        <Story />
      </>
    ),
  ],
  args: {
    copy: {
      qrAlt: "Your member code, scannable at the till",
      refresh: "Refresh",
      refreshesIn: "Refreshes in",
    },
    email: "collector@example.com",
    tier: "Gold",
    variant: "gold",
    token: MEMBER_TOKEN,
    state: { remainingSeconds: 45 },
    onRefresh: fn(),
  },
} satisfies Meta<typeof MemberPass>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The square's drawn modules, so a test can tell one token's code from the next's. */
function qrModules(canvasElement: HTMLElement) {
  return canvasElement
    .querySelector('[data-slot="member-pass-qr"] svg path[fill="#000000"]')
    ?.getAttribute("d");
}

/**
 * The consumer-owned code loop, wired live: the countdown ticks, refresh
 * draws busy while a new token is minted, and the square swaps in and out of
 * view — the pass moves on the storyboard the way it does on a phone at the
 * till. Minting stays the consumer's ask: the pass only reports it.
 */
function TickingPass(args: MemberPassProps) {
  const [seconds, setSeconds] = useState(args.state.remainingSeconds);
  const [generation, setGeneration] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const mintTimer = useRef<number | null>(null);
  const lifeSeconds = args.state.remainingSeconds;

  const mint = useCallback(() => {
    if (mintTimer.current != null) return;
    setRefreshing(true);
    mintTimer.current = window.setTimeout(() => {
      mintTimer.current = null;
      setGeneration((value) => value + 1);
      setSeconds(lifeSeconds);
      setRefreshing(false);
    }, 400);
  }, [lifeSeconds]);

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

  return (
    <MemberPass
      {...args}
      onRefresh={() => {
        args.onRefresh();
        mint();
      }}
      refreshing={args.refreshing || refreshing}
      state={{ remainingSeconds: seconds }}
      token={`${args.token}.${generation}`}
    />
  );
}

/** The pass encodes the token it was given and only reports the refresh —
 * minting stays with the consumer. Drawn live: the countdown ticks, and a
 * refresh mints a fresh square that swaps in and out of view. */
export const Default: Story = {
  render: (args) => <TickingPass {...args} />,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("collector@example.com")).toBeInTheDocument();
    expect(canvas.getByText("Gold")).toBeInTheDocument();
    expect(canvas.getByText(/Refreshes in/)).toBeInTheDocument();

    const before = qrModules(canvasElement);
    expect(before).toBeTruthy();
    await userEvent.click(canvas.getByRole("button", { name: "Refresh" }));
    expect(args.onRefresh).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(qrModules(canvasElement)).not.toBe(before));
  },
};

/** Each tier wears its own skin: the badge is the signal once the header's
 * warm gradient is shared between gold and black. */
export const Silver: Story = {
  args: { tier: "Silver", variant: "silver" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Silver")).toBeInTheDocument();
    expect(canvas.getByText(/Refreshes in 0:45/)).toBeInTheDocument();
  },
};

/** The black pass shares gold's warm header; the crowned white badge is
 * what says it — the same badge the tier card wears. */
export const Black: Story = {
  args: { tier: "Black", variant: "black" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Black")).toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="member-pass-tier"] svg'),
    ).toBeInTheDocument();
  },
};

/** The code on the pass is the one the consumer minted: the scannable
 * rendering is the token's own code, and refresh only asks — nothing moves
 * until a new token arrives. */
export const PassNeverMintsItsCode: Story = {
  render: (args) => (
    <>
      <MemberPass {...args} />
      {/* The same token encoded on its own, to compare the pass against. */}
      <div data-slot="token-code" hidden>
        <QRCodeSVG level="M" marginSize={2} value={args.token} />
      </div>
    </>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const tokenModules = canvasElement
      .querySelector('[data-slot="token-code"] svg path[fill="#000000"]')
      ?.getAttribute("d");

    expect(
      canvas.getByRole("img", {
        name: "Your member code, scannable at the till",
      }),
    ).toBeInTheDocument();
    const scanned = qrModules(canvasElement);
    expect(scanned).toBeTruthy();
    expect(scanned).toBe(tokenModules);

    await userEvent.click(canvas.getByRole("button", { name: "Refresh" }));
    expect(args.onRefresh).toHaveBeenCalledOnce();
    expect(qrModules(canvasElement)).toBe(scanned);
    expect(canvas.getByText(/0:45/)).toBeInTheDocument();
  },
};

const ROTATED_TOKEN = `${MEMBER_TOKEN}.rotated`;

/** A fresh token dips the square out of view and settles the new one in
 * rather than snapping — the swap happens while the square is out of sight. */
export const CodeRotates: Story = {
  render: (args) => {
    const [token, setToken] = useState(args.token);
    return (
      <MemberPass
        {...args}
        onRefresh={() => {
          setToken(ROTATED_TOKEN);
          args.onRefresh();
        }}
        token={token}
      />
    );
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const before = qrModules(canvasElement);
    expect(before).toBeTruthy();

    await userEvent.click(canvas.getByRole("button", { name: "Refresh" }));
    expect(args.onRefresh).toHaveBeenCalledOnce();

    await waitFor(() => expect(qrModules(canvasElement)).not.toBe(before));
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll(
          '[data-slot="member-pass-code-area"] [aria-hidden="true"]',
        ),
      ).toHaveLength(0),
    );
  },
};

/** A new code is on its way: refresh draws busy and the pass stays shown. */
export const Refreshing: Story = {
  args: { refreshing: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Refresh" })).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(qrModules(canvasElement)).toBeTruthy();
  },
};

/** A refused refresh toasts its reason once — the control is pressable
 * again and nothing sits inline under it. */
export const RefreshFailed: Story = {
  args: {
    refreshFailed: "We could not get a new code.",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    await waitFor(() =>
      expect(
        body.getByText("We could not get a new code."),
      ).toBeInTheDocument(),
    );
    expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Refresh" }));
    expect(args.onRefresh).toHaveBeenCalledOnce();
  },
};
