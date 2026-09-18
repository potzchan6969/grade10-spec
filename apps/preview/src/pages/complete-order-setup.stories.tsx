import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  WINNER_ORDER_FULL_SAVED_ADDRESSES,
  WINNER_ORDER_SAVED_ADDRESSES,
  WinnerOrderSetupDialog,
  type WinnerOrderSavedAddress,
  type WinnerOrderSetupResult,
} from "./winner-order-setup-dialog";

type CompleteOrderSetupDemoProps = {
  savedAddresses?: readonly WinnerOrderSavedAddress[];
  initialNewAddressOpen?: boolean;
  initialStep?: 1 | 2 | 3;
  currency?: "HKD" | "USD" | "JPY";
  onConfirm?: (result: WinnerOrderSetupResult) => void;
};

function CompleteOrderSetupDemo({
  savedAddresses = WINNER_ORDER_SAVED_ADDRESSES,
  initialNewAddressOpen = false,
  initialStep = 1,
  currency = "HKD",
  onConfirm = fn(),
}: CompleteOrderSetupDemoProps) {
  const [open, setOpen] = useState(true);
  const [confirmed, setConfirmed] = useState<WinnerOrderSetupResult | null>(
    null,
  );

  return (
    <div className="flex min-h-svh w-full flex-col bg-background p-8">
      <VStack className="mx-auto w-full max-w-lg" gap="md" hAlign="start">
        <Text as="h2" className="text-xl font-semibold tracking-tight">
          Complete Order Setup
        </Text>
        <Text size="sm" tone="secondary">
          Standalone preview of the stepped setup dialog Winner Order opens
          from Awaiting Setup. Page wiring lives under My Auctions / Winner
          Order / Setup. Delivery → Payment → Billing; the address book
          caps at five saved addresses.
        </Text>
        {!open ? (
          <Button onClick={() => setOpen(true)} size="md">
            Open dialog
          </Button>
        ) : null}
        {confirmed ? (
          <Text className="whitespace-pre-line" size="sm">
            Confirmed delivery:{"\n"}
            {confirmed.delivery}
            {"\n\n"}Payment: {confirmed.paymentMethod}
            {"\n"}Billing:{"\n"}
            {confirmed.billing}
          </Text>
        ) : null}
      </VStack>

      <WinnerOrderSetupDialog
        currency={currency}
        initialNewAddressOpen={initialNewAddressOpen}
        initialStep={initialStep}
        onConfirm={(result) => {
          setConfirmed(result);
          onConfirm(result);
        }}
        onOpenChange={setOpen}
        open={open}
        savedAddresses={savedAddresses}
      />
    </div>
  );
}

const meta = {
  title: "My Auctions/Winner Order/Setup/Complete Order Setup",
  component: CompleteOrderSetupDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone Storybook preview of Winner Order Complete Order Setup (delivery, payment method, billing). Same dialog the Awaiting Setup page opens. Replaces the retired Confirm Delivery Address stories. Address options use `RadioCard`; an empty book uses `EmptyState`. At five saved addresses, Add New Address still confirms a one-time draft and Save for future is refused.",
      },
    },
  },
  args: {
    savedAddresses: [...WINNER_ORDER_SAVED_ADDRESSES],
    initialNewAddressOpen: false,
    initialStep: 1,
    currency: "HKD",
  },
} satisfies Meta<typeof CompleteOrderSetupDemo>;

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

/** Step 1 — saved-address cards, remove controls, Add New Address. */
export const DeliveryPicker: Story = {
  name: "Delivery picker",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Delivery Address");
    const modal = within(dialog);
    expect(modal.getByText("Step 1 of 3")).toBeVisible();
    await waitFor(() => {
      expect(modal.getAllByText("Alex Chan").length).toBeGreaterThan(0);
    });
    expect(
      modal.getAllByRole("button", { name: "Remove Alex Chan" }).length,
    ).toBe(2);
    expect(modal.getByText(/Harbour Road/)).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add New Address" }),
    ).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** Nested Add Address form — Country stays closed. */
export const AddDeliveryAddress: Story = {
  name: "Add delivery address",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const outer = await findVisibleDialog(page, "Delivery Address");
    await userEvent.click(
      within(outer).getByRole("button", { name: "Add New Address" }),
    );

    const nested = await findVisibleDialog(page, "Add Address");
    const form = within(nested);
    expect(form.getByLabelText("First name")).toBeVisible();
    expect(form.getByLabelText("Street address")).toBeVisible();
    expect(form.getByLabelText("Postal code")).toBeVisible();
    expect(form.getByLabelText("Country")).toBeVisible();
    expect(form.getByText("Hong Kong")).toBeVisible();
    expect(form.getByText("Save this address for future orders")).toBeVisible();
    expect(
      form.getByRole("checkbox", {
        name: "Save this address for future orders",
      }),
    ).toBeChecked();
    expect(
      form.getByRole("button", { name: "Use This Address" }),
    ).toBeVisible();
    expect(page.queryByRole("option", { name: "Australia" })).toBeNull();
  },
};

/** Empty account address book — EmptyState; Continue disabled. */
export const NoSavedAddresses: Story = {
  name: "No saved addresses",
  args: { savedAddresses: [] },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Delivery Address");
    const modal = within(dialog);
    await waitFor(() => {
      expect(modal.getByText("No saved addresses")).toBeVisible();
    });
    expect(
      modal.getByText("Add a delivery address to continue."),
    ).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add New Address" }),
    ).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeDisabled();
    expect(
      page.queryByRole("dialog", { name: "Add Address" }),
    ).toBeNull();
  },
};

/** Remove a saved card from the delivery picker. */
export const RemoveSavedAddress: Story = {
  name: "Remove saved address",
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Delivery Address");
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

/**
 * Five saved addresses — Add New Address still opens; Save for future is
 * refused so Use This Address keeps a one-time draft on step 1.
 */
export const AddressBookFull: Story = {
  name: "Address book full",
  args: {
    savedAddresses: [...WINNER_ORDER_FULL_SAVED_ADDRESSES],
  },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const outer = await findVisibleDialog(page, "Delivery Address");
    const picker = within(outer);
    await waitFor(() => {
      expect(picker.getByText(/Chater House/)).toBeVisible();
    });
    expect(picker.getByText(/Festival Walk/)).toBeVisible();
    expect(
      picker.getByRole("button", { name: "Add New Address" }),
    ).toBeVisible();

    await userEvent.click(
      picker.getByRole("button", { name: "Add New Address" }),
    );

    const nested = await findVisibleDialog(page, "Add Address");
    const form = within(nested);
    const saveCheckbox = form.getByRole("checkbox", {
      name: /Save this address for future orders/,
    });
    expect(saveCheckbox).toHaveAttribute("aria-disabled", "true");
    expect(saveCheckbox).not.toBeChecked();
    expect(
      form.getByRole("button", {
        name: "You already have 5 saved addresses. Remove one to save another.",
      }),
    ).toBeVisible();

    await userEvent.type(form.getByLabelText("First name"), "Pat");
    await userEvent.type(form.getByLabelText("Last name"), "Ng");
    await userEvent.type(
      form.getByLabelText("Street address"),
      "9 Queen's Road Central",
    );
    await userEvent.type(form.getByLabelText("City"), "Central");
    await userEvent.type(form.getByLabelText("Postal code"), "000000");
    await userEvent.click(
      form.getByRole("button", { name: "Use This Address" }),
    );

    await waitFor(() => {
      expect(
        page.queryByRole("dialog", { name: "Add Address" }),
      ).toBeNull();
    });
    const confirmedOuter = await findVisibleDialog(
      page,
      "Delivery Address",
    );
    const confirmedPicker = within(confirmedOuter);
    expect(confirmedPicker.getByText("Pat Ng")).toBeVisible();
    expect(confirmedPicker.getByText(/Queen's Road Central/)).toBeVisible();
    const cards = confirmedPicker.getByLabelText("Delivery address");
    const firstCardTitle = within(cards).getAllByText(
      /Pat Ng|Alex Chan|Jordan Lee|Sam Wong/,
    )[0];
    expect(firstCardTitle).toHaveTextContent("Pat Ng");
    expect(
      confirmedPicker.getAllByRole("button", { name: /^Remove / }).length,
    ).toBe(5);
  },
};

/** Step 2 — card and bank transfer (HKD). */
export const PaymentMethod: Story = {
  name: "Payment method",
  args: { initialStep: 2 },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Payment Method");
    const modal = within(dialog);
    expect(modal.getByText("Step 2 of 3")).toBeVisible();
    expect(modal.getByRole("radio", { name: /Card/i })).toBeVisible();
    expect(modal.getByRole("radio", { name: /Bank transfer/i })).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeDisabled();
    await userEvent.click(modal.getByRole("radio", { name: /Card/i }));
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** Step 3 — same-as-delivery default. */
export const BillingAddress: Story = {
  name: "Billing address",
  args: { initialStep: 3 },
  play: async ({ canvasElement }) => {
    const page = within(canvasElement.ownerDocument.body);
    const dialog = await findVisibleDialog(page, "Billing Address");
    const modal = within(dialog);
    expect(modal.getByText("Step 3 of 3")).toBeVisible();
    expect(modal.getByText("Same as delivery address")).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Complete Order Setup" }),
    ).toBeEnabled();
  },
};

/** Full three steps → confirmed payload on the demo surface. */
export const FinishSetup: Story = {
  name: "Finish setup",
  args: { onConfirm: fn() },
  play: async ({ canvasElement, args }) => {
    const page = within(canvasElement.ownerDocument.body);
    const canvas = within(canvasElement);
    const dialog = await findVisibleDialog(page, "Delivery Address");
    const modal = within(dialog);

    await userEvent.click(modal.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(modal.getByText("Step 2 of 3")).toBeVisible();
    });
    await userEvent.click(modal.getByRole("radio", { name: /Card/i }));
    await userEvent.click(modal.getByRole("button", { name: "Continue" }));
    await waitFor(() => {
      expect(modal.getByText("Step 3 of 3")).toBeVisible();
    });
    await userEvent.click(
      modal.getByRole("button", { name: "Complete Order Setup" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(canvas.getByText(/Confirmed delivery/i)).toBeVisible();
    expect(args.onConfirm).toHaveBeenCalled();
  },
};
