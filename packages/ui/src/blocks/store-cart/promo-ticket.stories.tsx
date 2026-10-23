import { Button } from "@grade10/design-system/components/forms/button";
import { Storefront } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId, useState } from "react";
import { expect, fn, waitFor, within } from "storybook/test";
import { SAMPLE_HELD_PROMO_CODES } from "./fixtures";
import { PromoQrCard } from "./promo-qr-card";
import { PromoTicket } from "./promo-ticket";

const applicable = SAMPLE_HELD_PROMO_CODES.find((c) => c.applicable)!;
const inapplicable = SAMPLE_HELD_PROMO_CODES.find((c) => !c.applicable)!;

const meta = {
  title: "Store/Cart/Blocks/PromoTicket",
  component: PromoTicket,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="max-w-md bg-sidebar p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    code: applicable,
  },
} satisfies Meta<typeof PromoTicket>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Applicable ticket with Apply in the action slot. */
export const Default: Story = {
  args: {
    action: (
      <Button size="sm" variant="secondary" onClick={fn()}>
        Apply
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$100 discount")).toBeInTheDocument();
    expect(canvas.getByText(applicable.label)).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Apply" })).toBeInTheDocument();
  },
};

/** Selected when this held code is the applied promo on the cart. */
export const Selected: Story = {
  args: {
    selected: true,
    action: (
      <Button size="sm" variant="secondary" onClick={fn()}>
        Apply
      </Button>
    ),
  },
};

/** Inapplicable — muted, reason in the footer, no action. */
export const NotApplicable: Story = {
  args: {
    code: inapplicable,
    muted: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(inapplicable.label)).toBeInTheDocument();
    expect(
      canvas.getByText(inapplicable.inapplicableReason!),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
    // shared-ui-store-cart-SC-29: muted, its reason shown, no Apply.
    const ticket = canvas.getByRole("group", { name: inapplicable.label });
    expect(ticket).toHaveAttribute("aria-disabled", "true");
    expect(ticket).toHaveClass("opacity-70");
  },
};

/** Wires the ticket's Use now control to the scan card a surface lays out
 * for it — the QR never lives inside the ticket, so a coupons grid picks
 * where it opens. */
function TicketWithScanCard(args: Parameters<typeof PromoTicket>[0]) {
  const regionId = useId();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-col gap-2">
      <PromoTicket
        {...args}
        onQrToggle={setOpen}
        qrOpen={open}
        qrRegionId={regionId}
      />
      {args.qrCode ? (
        <PromoQrCard
          caption={args.qrCode.caption}
          id={regionId}
          open={open}
          qrCode={args.qrCode}
        />
      ) : null}
    </div>
  );
}

/** Till-facing: a Use now control in the stub unfolds the member's scan
 * card below the ticket; the readable code stays shown either way. No
 * Apply — that belongs to the online cart. */
export const WithQrCode: Story = {
  args: {
    code: { ...applicable, label: "G10-50-7Q2M" },
    qrCode: {
      value: "g10:redeem:voucher-50:7Q2M",
      altText: "Show this code to store staff",
      toggleLabel: "Use now",
      caption: "Staff scan this at the counter",
    },
  },
  render: (args) => <TicketWithScanCard {...args} />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    // The readable code is always shown; the scan card starts folded away.
    expect(canvas.getByText("G10-50-7Q2M")).toBeInTheDocument();
    const toggle = canvas.getByRole("button", { name: "Use now" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    const qr = canvasElement.querySelector('[data-slot="promo-qr-card"]');
    expect(qr).not.toBeVisible();
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await waitFor(() => expect(qr).toBeVisible());
    await userEvent.click(toggle);
    await waitFor(() => expect(qr).not.toBeVisible());
    // No Apply on a store-facing ticket.
    expect(
      canvas.queryByRole("button", { name: "Apply" }),
    ).not.toBeInTheDocument();
  },
};

/** A redeemed good's collection ticket — no discount code; the stub names
 * the collection under a storefront mark, and Use now opens its scan
 * card. */
export const CollectionTicket: Story = {
  args: {
    code: {
      applicable: true,
      id: "reward-slab-sleeves",
      title: "UV slab sleeves",
      detailLabel: "Collect by 5 Nov 2026",
      label: "Collect at any Grade10 store",
    },
    labelIcon: <Storefront size={14} weight="bold" />,
    qrCode: {
      value: "g10:collect:reward-slab-sleeves:7Q2M",
      altText: "Show this code to store staff",
      toggleLabel: "Use now",
      caption: "Staff scan this at the counter",
    },
  },
  render: (args) => <TicketWithScanCard {...args} />,
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    // Collection line, never a discount code; scan card folded until asked.
    expect(
      canvas.getByText("Collect at any Grade10 store"),
    ).toBeInTheDocument();
    const toggle = canvas.getByRole("button", { name: "Use now" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    const qr = canvasElement.querySelector('[data-slot="promo-qr-card"]');
    await waitFor(() => expect(qr).toBeVisible());
  },
};

/** Spent: the ticket mutes, names it used, and drops both the scan
 * control and any action — there is nothing left to scan or apply. */
export const UsedTicket: Story = {
  args: {
    code: { ...applicable, label: "G10-50-7Q2M" },
    usedLabel: "Used on 12 Oct 2026",
    qrCode: {
      value: "g10:redeem:voucher-50:7Q2M",
      altText: "Show this code to store staff",
      toggleLabel: "Use now",
    },
    action: (
      <Button size="sm" variant="secondary" onClick={fn()}>
        Apply
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const ticket = canvas.getByRole("group", { name: "G10-50-7Q2M" });
    expect(ticket).toHaveAttribute("aria-disabled", "true");
    expect(ticket).toHaveClass("opacity-70");
    expect(canvas.getByText("Used on 12 Oct 2026")).toBeInTheDocument();
    expect(canvas.queryByText("Use by 31 Dec 2026")).not.toBeInTheDocument();
    expect(canvas.getByText("G10-50-7Q2M")).toBeInTheDocument();
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
    expect(
      canvasElement.querySelector('[data-slot="promo-qr-card"]'),
    ).not.toBeInTheDocument();
  },
};

/** Boneyard skeleton while the held codes resolve. */
export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("group")).not.toBeInTheDocument();
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

/** Boneyard capture target — keep `loading` so the CLI reads the fixture. */
export const BoneyardCapture: Story = {
  args: { loading: true },
};

/** Stack of tickets as they appear in the promo sheet. */
export const List: Story = {
  render: () => (
    <div className="flex w-full flex-col gap-2">
      {SAMPLE_HELD_PROMO_CODES.map((code) => (
        <PromoTicket
          key={code.id}
          code={code}
          muted={!code.applicable}
          action={
            code.applicable ? (
              <Button size="sm" variant="secondary" onClick={fn()}>
                Apply
              </Button>
            ) : undefined
          }
        />
      ))}
    </div>
  ),
};
