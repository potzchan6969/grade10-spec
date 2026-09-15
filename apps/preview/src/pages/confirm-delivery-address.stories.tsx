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
          "Standalone Storybook preview of the Winner Order Confirm delivery address picker and its nested Add delivery address form. Same dialog Winner Order opens from Awaiting Address. Address options use design-system `RadioCard`.",
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
    const dialog = await findVisibleDialog(page, "Confirm delivery address");
    const modal = within(dialog);
    await waitFor(() => {
      expect(modal.getByText("Wan Chai home")).toBeVisible();
    });
    expect(
      modal.getByRole("button", { name: "Remove Wan Chai home" }),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add new address" }),
    ).toBeVisible();
  },
};

/** Nested Add delivery address form — open via CTA (reliable vs dual-open mount). */
export const AddDeliveryAddress: Story = {
  name: "Add delivery address",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const outer = await findVisibleDialog(page, "Confirm delivery address");
    await userEvent.click(
      within(outer).getByRole("button", { name: "Add new address" }),
    );

    const nested = await findVisibleDialog(page, "Add delivery address");
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

    await userEvent.click(form.getByLabelText("Country"));
    await waitFor(() => {
      expect(page.getByRole("option", { name: "United States" })).toBeVisible();
    });
    expect(page.getByRole("option", { name: "Hong Kong" })).toBeVisible();
    expect(page.getByRole("option", { name: "Japan" })).toBeVisible();
  },
};

/** Empty account address book — prompt to add. */
export const NoSavedAddresses: Story = {
  name: "No saved addresses",
  args: { savedAddresses: [] },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Confirm delivery address");
    const modal = within(dialog);
    await waitFor(() => {
      expect(modal.getByText(/No saved addresses yet/i)).toBeVisible();
    });
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
    const dialog = await findVisibleDialog(page, "Confirm delivery address");
    const modal = within(dialog);
    await waitFor(() => {
      expect(modal.getByText("Wan Chai home")).toBeVisible();
    });
    await userEvent.click(
      modal.getByRole("button", { name: "Remove Wan Chai home" }),
    );
    await waitFor(() => {
      expect(modal.queryByText("Wan Chai home")).not.toBeInTheDocument();
    });
    expect(modal.getByText("Tsim Sha Tsui")).toBeVisible();
  },
};
