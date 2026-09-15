import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  WINNER_ORDER_SAVED_ADDRESSES,
  WinnerOrderAddressDialog,
  type WinnerOrderSavedAddress,
} from "./winner-order-address-dialog";

type ConfirmDeliveryAddressDemoProps = {
  savedAddresses?: readonly WinnerOrderSavedAddress[];
  initialNewAddressOpen?: boolean;
  onConfirm?: (addressLines: string) => void;
};

function ConfirmDeliveryAddressDemo({
  savedAddresses = WINNER_ORDER_SAVED_ADDRESSES,
  initialNewAddressOpen = false,
  onConfirm = fn(),
}: ConfirmDeliveryAddressDemoProps) {
  const [open, setOpen] = useState(true);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Delivery address preview
        </Text>
        <Text size="sm" tone="secondary">
          Preview-only modal under My Auctions. Winner Order still opens the
          same dialog from Awaiting Address.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
        {confirmed ? (
          <Text className="whitespace-pre-line" size="sm">
            Confirmed:{"\n"}
            {confirmed}
          </Text>
        ) : null}
      </VStack>

      <WinnerOrderAddressDialog
        initialNewAddressOpen={initialNewAddressOpen}
        onConfirm={(lines) => {
          setConfirmed(lines);
          onConfirm(lines);
        }}
        onOpenChange={setOpen}
        open={open}
        savedAddresses={savedAddresses}
      />
    </div>
  );
}

const meta = {
  title: "My Auctions/Confirm Delivery Address",
  component: ConfirmDeliveryAddressDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone Storybook preview of the Winner Order Confirm Delivery Address picker and its nested Add Delivery Address form. Same dialog Winner Order opens from Awaiting Address. Address options use design-system `RadioCard`; an empty book uses `EmptyState`.",
      },
    },
  },
  args: {
    savedAddresses: [...WINNER_ORDER_SAVED_ADDRESSES],
    initialNewAddressOpen: false,
  },
} satisfies Meta<typeof ConfirmDeliveryAddressDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

async function findVisibleDialog(
  page: ReturnType<typeof within>,
  name: string | RegExp,
) {
  return waitFor(() => {
    const dialog = page.getByRole("dialog", { name });
    expect(dialog).toBeVisible();
    return dialog;
  });
}

/** Outer picker: saved-address cards, remove controls, Add new address. */
export const Picker: Story = {
  name: "Picker",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Confirm Delivery Address");
    const modal = within(dialog);
    await waitFor(() => {
      expect(modal.getAllByText("Alex Chan").length).toBeGreaterThan(0);
    });
    expect(
      modal.getAllByRole("button", { name: "Remove Alex Chan" }).length,
    ).toBe(2);
    expect(modal.getByText(/Harbour Road/)).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add new address" }),
    ).toBeVisible();
  },
};

/** Nested Add Delivery Address form — open via CTA; Country stays closed. */
export const AddDeliveryAddress: Story = {
  name: "Add delivery address",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const outer = await findVisibleDialog(page, "Confirm Delivery Address");
    await userEvent.click(
      within(outer).getByRole("button", { name: "Add new address" }),
    );

    const nested = await findVisibleDialog(page, "Add Delivery Address");
    const form = within(nested);
    expect(form.getByLabelText("First name")).toBeVisible();
    expect(form.getByLabelText("Street address")).toBeVisible();
    expect(form.getByLabelText("Postal code")).toBeVisible();
    expect(form.getByLabelText("Country")).toBeVisible();
    expect(form.getByText("Hong Kong")).toBeVisible();
    expect(form.getByText("Save this address for future orders")).toBeVisible();
    expect(
      form.getByRole("button", { name: "Use this address" }),
    ).toBeVisible();
    expect(
      form.queryByText(/shipping fee on the invoice/i),
    ).not.toBeInTheDocument();
    // Leave Country closed until the viewer opens it.
    expect(page.queryByRole("option", { name: "Australia" })).toBeNull();
  },
};

/** Empty account address book — EmptyState only; viewer opens nested form via CTA. */
export const NoSavedAddresses: Story = {
  name: "No saved addresses",
  args: { savedAddresses: [] },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Confirm Delivery Address");
    const modal = within(dialog);
    await waitFor(() => {
      expect(modal.getByText("No saved addresses")).toBeVisible();
    });
    expect(
      modal.getByText("Add a delivery address to continue."),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add new address" }),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Confirm address" }),
    ).toBeDisabled();
    expect(
      page.queryByRole("dialog", { name: "Add Delivery Address" }),
    ).toBeNull();
  },
};

/** Remove a saved card from the picker. */
export const RemoveSavedAddress: Story = {
  name: "Remove saved address",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Confirm Delivery Address");
    const modal = within(dialog);
    await waitFor(() => {
      expect(modal.getByText(/Harbour Road/)).toBeVisible();
    });
    const removeButtons = modal.getAllByRole("button", {
      name: "Remove Alex Chan",
    });
    expect(removeButtons[0]).toBeTruthy();
    await userEvent.click(removeButtons[0] as HTMLElement);
    await waitFor(() => {
      expect(modal.queryByText(/Harbour Road/)).not.toBeInTheDocument();
    });
    expect(modal.getByText(/Canton Road/)).toBeVisible();
  },
};
