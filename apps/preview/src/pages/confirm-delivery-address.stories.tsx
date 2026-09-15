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
          Confirm delivery address
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
          "Standalone Storybook preview of the Winner Order Confirm delivery address picker and its nested Add delivery address form. Same dialog Winner Order opens from Awaiting Address.",
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

/** Outer picker: saved-address cards, remove controls, Add new address. */
export const Picker: Story = {
  name: "Picker",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole("dialog");
    const modal = within(dialog);
    expect(
      modal.getByRole("heading", { name: "Confirm delivery address" }),
    ).toBeVisible();
    expect(modal.getByText("Wan Chai home")).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Remove Wan Chai home" }),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add new address" }),
    ).toBeVisible();
  },
};

/** Nested Add delivery address form open on load. */
export const AddDeliveryAddress: Story = {
  name: "Add delivery address",
  args: { initialNewAddressOpen: true },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    await waitFor(() => {
      expect(
        page.getByRole("heading", { name: "Add delivery address" }),
      ).toBeVisible();
    });
    const nestedHeading = page.getByRole("heading", {
      name: "Add delivery address",
    });
    const nested = within(
      nestedHeading.closest('[role="dialog"]') as HTMLElement,
    );
    expect(nested.getByLabelText("First name")).toBeVisible();
    expect(nested.getByLabelText("Street address")).toBeVisible();
    expect(nested.getByLabelText("Postal code")).toBeVisible();
    expect(
      nested.getByText("Save this address for future orders"),
    ).toBeVisible();
    expect(
      nested.getByRole("button", { name: "Use this address" }),
    ).toBeVisible();
  },
};

/** Empty account address book — prompt to add. */
export const NoSavedAddresses: Story = {
  name: "No saved addresses",
  args: { savedAddresses: [] },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole("dialog");
    const modal = within(dialog);
    expect(modal.getByText(/No saved addresses yet/i)).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add new address" }),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Confirm address" }),
    ).toBeDisabled();
  },
};

/** Remove a saved card from the picker. */
export const RemoveSavedAddress: Story = {
  name: "Remove saved address",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await page.findByRole("dialog");
    const modal = within(dialog);
    expect(modal.getByText("Wan Chai home")).toBeVisible();
    await userEvent.click(
      modal.getByRole("button", { name: "Remove Wan Chai home" }),
    );
    await waitFor(() => {
      expect(modal.queryByText("Wan Chai home")).not.toBeInTheDocument();
    });
    expect(modal.getByText("Tsim Sha Tsui")).toBeVisible();
  },
};
