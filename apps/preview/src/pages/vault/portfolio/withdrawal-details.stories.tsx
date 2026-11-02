import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";
import { PAYOUT_REQUESTS, type VaultPayoutRequest } from "../../vault-content";
import { WithdrawalDetails } from "./withdrawal-details";

function WithdrawalDetailsDemo({ request }: { request: VaultPayoutRequest }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Withdrawal details
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the drawer opened from a withdrawal row on the
          portfolio ledger.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open drawer
          </Button>
        ) : null}
      </VStack>
      <WithdrawalDetails onOpenChange={setOpen} open={open} request={request} />
    </div>
  );
}

const meta = {
  title: "Vault/Portfolio/Screens/Withdrawal Details Drawer",
  component: WithdrawalDetailsDemo,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WithdrawalDetailsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

const page = (canvasElement: HTMLElement) =>
  within(canvasElement.ownerDocument.body);

async function openDrawer(canvasElement: HTMLElement) {
  const drawer = await waitFor(() => {
    const found = page(canvasElement).getByRole("dialog", {
      name: "Withdrawal details",
    });
    expect(found).toBeVisible();
    return found;
  });
  return within(drawer);
}

const COMPLETED = PAYOUT_REQUESTS[2];
const PENDING = PAYOUT_REQUESTS[0];
const PROCESSING = PAYOUT_REQUESTS[1];
const DECLINED = PAYOUT_REQUESTS[4];

/** A paid-out HKD request — rate applied, every step done. */
export const Completed: Story = {
  args: { request: COMPLETED },
  play: async ({ canvasElement }) => {
    const drawer = await openDrawer(canvasElement);
    expect(drawer.getByText(`Withdrawal · ${COMPLETED.id}`)).toBeVisible();
    expect(drawer.getByText("US$40")).toBeVisible();
    expect(drawer.getByText("Completed")).toBeVisible();
    expect(drawer.getByText("HK$312.40 received")).toBeVisible();
    expect(drawer.getByText("Withdrawal requested")).toBeVisible();
    expect(drawer.getByText("Grade10 review")).toBeVisible();
    expect(drawer.getByText("Exchange rate applied")).toBeVisible();
    expect(drawer.getByText("HSBC ••• 8304")).toBeVisible();
  },
};

/** Awaiting Grade10's review — the HKD figure is still an estimate. */
export const Pending: Story = {
  args: { request: PENDING },
  play: async ({ canvasElement }) => {
    const drawer = await openDrawer(canvasElement);
    expect(drawer.getByText("Pending review")).toBeVisible();
    expect(drawer.getByText("Est. ~HK$650")).toBeVisible();
    expect(drawer.getByText("Waiting for review")).toBeVisible();
    expect(drawer.queryByText("Exchange rate applied")).not.toBeInTheDocument();
  },
};

/** Approved and on the way — the transfer step is in progress. */
export const Processing: Story = {
  args: { request: PROCESSING },
  play: async ({ canvasElement }) => {
    const drawer = await openDrawer(canvasElement);
    expect(drawer.getByText("Processing")).toBeVisible();
    expect(drawer.getByText("To HSBC ••• 8304")).toBeVisible();
    expect(drawer.getByText("4 Oct 2026")).toBeVisible();
  },
};

/** Turned down at review — the timeline ends there. */
export const Declined: Story = {
  args: { request: DECLINED },
  play: async ({ canvasElement }) => {
    const drawer = await openDrawer(canvasElement);
    expect(drawer.getByText("Declined")).toBeVisible();
    expect(drawer.getByText("Returned to rewards")).toBeVisible();
    expect(drawer.queryByText("Completed")).not.toBeInTheDocument();
  },
};

/** 390px phone — the drawer becomes a bottom sheet capped at 85dvh. */
export const Narrow: Story = {
  ...Completed,
  globals: { viewport: { value: "mobile1" } },
};
