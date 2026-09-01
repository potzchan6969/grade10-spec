import type { Meta, StoryObj } from "@storybook/react-vite";
import { QRCodeSVG } from "qrcode.react";
import { expect, fn, userEvent, within } from "storybook/test";
import { FIXTURE_MEMBER_FIRST_USE_AT } from "../../lib/datetime-fixtures";
import { FALLBACK_CODE, MEMBER_TOKEN } from "./fixtures";
import { MemberCard } from "./member-card";

const meta = {
  title: "Loyalty Membership/MemberCard",
  component: MemberCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: {
      qrAlt: "Your member code, scannable at the till",
      fallbackCode: "Or read this code out",
      refresh: "New code",
      expiresIn: "Expires in",
      secondsUnit: "s",
      expired: "This code has expired",
      used: "This code has already been used",
    },
    displayName: "Collector",
    tier: "Gold",
    token: MEMBER_TOKEN,
    fallbackCode: FALLBACK_CODE,
    state: { status: "live", remainingSeconds: 45 },
    onRefresh: fn(),
  },
} satisfies Meta<typeof MemberCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The card encodes the token it was given and only reports the refresh —
 * minting stays with the consumer. */
export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(FALLBACK_CODE)).toBeInTheDocument();
    expect(canvas.getByText(/45s/)).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "New code" }));
    expect(args.onRefresh).toHaveBeenCalledTimes(1);
  },
};

/** The code on the card is the one the consumer minted: the scannable
 * rendering is the token's own code, the typed fallback is the supplied one,
 * and refresh only asks — nothing moves until a new token arrives. */
export const CardNeverMintsItsCode: Story = {
  render: (args) => (
    <>
      <MemberCard {...args} />
      {/* The same token encoded on its own, to compare the card against. */}
      <div data-slot="token-code" hidden>
        <QRCodeSVG level="M" marginSize={4} value={args.token} />
      </div>
    </>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const modules = (slot: string) =>
      canvasElement
        .querySelector(`[data-slot="${slot}"] svg path[fill="#000000"]`)
        ?.getAttribute("d");

    expect(
      canvas.getByRole("img", {
        name: "Your member code, scannable at the till",
      }),
    ).toBeInTheDocument();
    const scanned = modules("member-card-qr");
    expect(scanned).toBeTruthy();
    expect(scanned).toBe(modules("token-code"));
    expect(canvas.getByText(FALLBACK_CODE)).toBeInTheDocument();

    await userEvent.click(canvas.getByRole("button", { name: "New code" }));
    expect(args.onRefresh).toHaveBeenCalledOnce();
    expect(modules("member-card-qr")).toBe(scanned);
    expect(canvas.getByText(FALLBACK_CODE)).toBeInTheDocument();
    expect(canvas.getByText(/45s/)).toBeInTheDocument();
  },
};

/** Out of time: the code dims, the card says so, and refresh stays offered. */
export const Expired: Story = {
  args: { state: { status: "expired" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("This code has expired")).toBeInTheDocument();
    expect(canvas.queryByText(/Expires in/)).not.toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "New code" })).toBeEnabled();
  },
};

/** Already scanned: the card names where and when, the same fact the till
 * refuses the second scan with. Nothing counts down any more, the code stops
 * offering itself to a scanner, and refresh is the way out. */
export const AlreadyUsed: Story = {
  args: {
    state: {
      status: "used",
      firstUse: { place: "Causeway Bay", when: FIXTURE_MEMBER_FIRST_USE_AT },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const used = canvasElement.querySelector('[data-slot="member-card-used"]');
    expect(used).toBeTruthy();

    const said = within(used as HTMLElement);
    expect(
      said.getByText("This code has already been used"),
    ).toBeInTheDocument();
    expect(said.getByText(/Causeway Bay/)).toBeInTheDocument();
    expect(
      said.getByText(new RegExp(FIXTURE_MEMBER_FIRST_USE_AT)),
    ).toBeInTheDocument();

    expect(canvas.queryByText(/Expires in/)).not.toBeInTheDocument();
    expect(canvas.queryByText("This code has expired")).not.toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="member-card-qr"]'),
    ).toHaveAttribute("aria-hidden", "true");
    expect(canvas.getByRole("button", { name: "New code" })).toBeEnabled();
  },
};
