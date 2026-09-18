import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionAddressForm } from "./auction-address-form";

const COPY = {
  firstName: "First Name",
  lastName: "Last Name",
  phone: "Phone",
  company: "Company Name",
  country: "Country/Region",
  city: "Town/City",
  addressLine1: "Address Line 1",
  addressLine2: "Address Line 2",
  apartment: "Apt./Suite/Building",
  state: "State/Province/Region",
  postalCode: "Postal Code",
  optional: "Optional",
  confirm: "Confirm",
  cancel: "Cancel",
};

const meta = {
  title: "Auction Order/AuctionAddressForm",
  component: AuctionAddressForm,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: COPY,
    errors: { city: "Enter a town or city." },
    initialValues: {
      firstName: "Alex",
      lastName: "Chen",
      phone: "not-a-standard-phone",
      country: "Hong Kong",
      addressLine1: "12/F, Tower 1",
      state: "Hong Kong",
      postalCode: "000000",
    },
    onConfirm: fn(),
    onCancel: fn(),
  },
} satisfies Meta<typeof AuctionAddressForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShowsSuppliedFieldError: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Enter a town or city.")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ phone: "not-a-standard-phone" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

export const Default: Story = { args: { errors: undefined } };
