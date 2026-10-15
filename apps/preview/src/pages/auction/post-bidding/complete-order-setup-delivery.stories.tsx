import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { CompleteOrderSetupDemo } from "./complete-order-setup-demo";
import { fillWinnerOrderAddAddress } from "./winner-order.story-shared";
import { WINNER_ORDER_FULL_SAVED_ADDRESSES } from "./winner-order-setup-dialog";

const meta = {
  title:
    "Auction/Post Bidding/Parts/CompleteOrderSetupDemo/Delivery Address",
  component: CompleteOrderSetupDemo,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Step 1 of Complete Order Setup — the delivery address picker. Address options use `RadioCard`; an empty book uses `EmptyState`. At five saved addresses, Add New Address still confirms a one-time draft and Save for future is refused. Add Address uses `AuctionAddressForm` — Personal/Company, country-aware phone, and a searchable Country/Region field.",
      },
    },
  },
  args: {
    initialNewAddressOpen: false,
    initialStep: 1,
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
    ).toBe(1);
    expect(modal.getByText("Harbour View Ltd")).toBeVisible();
    expect(modal.getByText(/Harbour Road/)).toBeVisible();
    expect(
      modal.getByRole("button", { name: "Add New Address" }),
    ).toBeVisible();
    expect(modal.getByRole("button", { name: "Continue" })).toBeEnabled();
  },
};

/** Nested Add Address form — Country/Region stays closed until opened. */
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
    expect(form.getByRole("button", { name: "Personal" })).toBeVisible();
    expect(form.getByRole("button", { name: "Company" })).toBeVisible();
    expect(form.getByLabelText(/First name/i)).toBeVisible();
    expect(form.getByLabelText(/Phone/i)).toBeVisible();
    expect(form.getByPlaceholderText("+852 12345678")).toBeVisible();
    expect(form.getByLabelText(/Address line 1/i)).toBeVisible();
    expect(form.getByLabelText(/Address line 2/i)).toBeVisible();
    expect(form.queryByLabelText(/Apt/i)).toBeNull();
    expect(form.getByLabelText(/State/i)).toBeVisible();
    expect(form.getAllByText(/\(Optional\)/).length).toBeGreaterThan(0);
    expect(form.getByLabelText(/Postal code/i)).toBeVisible();
    expect(form.getByLabelText(/Country\/Region/i)).toBeVisible();
    expect(form.queryByText("+852")).toBeNull();
    expect(form.queryByText("Hong Kong")).toBeNull();
    expect(form.queryByLabelText(/Company Name/i)).toBeNull();
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

    const country = form.getByRole("combobox", { name: /Country\/Region/i });
    await userEvent.click(country);
    await waitFor(() => {
      expect(page.getAllByRole("option").length).toBeGreaterThan(1);
    });
    await userEvent.type(country, "hong");
    await waitFor(() => {
      expect(page.getByRole("option", { name: "Hong Kong" })).toBeVisible();
      expect(page.queryByRole("option", { name: "Australia" })).toBeNull();
    });
    const option = page.getByRole("option", { name: "Hong Kong" });
    await waitFor(() => {
      expect(option.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    });
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
    expect(page.queryByRole("dialog", { name: "Add Address" })).toBeNull();
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

    await fillWinnerOrderAddAddress(page, form, {
      firstName: "Pat",
      lastName: "Ng",
      street: "9 Queen's Road Central",
      city: "Central",
      postalCode: "000000",
    });
    await userEvent.click(
      form.getByRole("button", { name: "Use This Address" }),
    );

    await waitFor(() => {
      expect(page.queryByRole("dialog", { name: "Add Address" })).toBeNull();
    });
    const confirmedOuter = await findVisibleDialog(page, "Delivery Address");
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
