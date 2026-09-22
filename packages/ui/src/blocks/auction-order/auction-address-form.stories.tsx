import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionAddressForm } from "./auction-address-form";

const COPY = {
  personal: "Personal",
  companyKind: "Company",
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
  phonePlaceholder: "Enter phone number",
  countrySearchPlaceholder: "e.g. United States",
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
      addressKind: "personal",
      firstName: "Alex",
      lastName: "Chen",
      phone: "+85261234567",
      phoneCountry: "HK",
      country: "Hong Kong",
      addressLine1: "12/F, Tower 1",
      state: "Hong Kong",
      postalCode: "000000",
      city: "",
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
    expect(canvas.getByRole("button", { name: /Personal/i })).toBeVisible();
    expect(canvas.queryByLabelText(/Company Name/i)).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole("button", { name: "Cancel" }));
    expect(args.onCancel).toHaveBeenCalledTimes(1);
  },
};

export const Default: Story = { args: { errors: undefined } };

/** Personal default — Company Name hidden. */
export const Personal: Story = {
  args: {
    errors: undefined,
    initialValues: {
      addressKind: "personal",
      firstName: "Alex",
      lastName: "Chen",
      phone: "+85261239999",
      phoneCountry: "HK",
      country: "Hong Kong",
      city: "Wan Chai",
      addressLine1: "12/F, Tower 1",
      state: "Hong Kong",
      postalCode: "000000",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByLabelText(/Company Name/i)).toBeNull();
    expect(canvas.getByPlaceholderText("Enter phone number")).toBeVisible();
  },
};

/** Company — Company Name required. */
export const Company: Story = {
  args: {
    errors: undefined,
    initialValues: {
      addressKind: "company",
      firstName: "Alex",
      lastName: "Chen",
      phone: "+85261238888",
      phoneCountry: "HK",
      company: "Harbour Cards Ltd",
      country: "Hong Kong",
      city: "Wan Chai",
      addressLine1: "12/F, Tower 1",
      state: "Hong Kong",
      postalCode: "000000",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByLabelText(/Company Name/i)).toBeVisible();
    await userEvent.clear(canvas.getByLabelText(/Company Name/i));
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).not.toHaveBeenCalled();
    expect(canvas.getByText("Enter a company name.")).toBeVisible();
  },
};

/** Phone empty refused; unusual digit string with country still confirms. */
export const PhoneSoftRule: Story = {
  args: {
    errors: undefined,
    initialValues: {
      addressKind: "personal",
      firstName: "Alex",
      lastName: "Chen",
      phone: "",
      phoneCountry: "HK",
      country: "Hong Kong",
      city: "Wan Chai",
      addressLine1: "12/F, Tower 1",
      state: "Hong Kong",
      postalCode: "000000",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).not.toHaveBeenCalled();
    expect(canvas.getByText("Enter a phone number.")).toBeVisible();

    const phone = canvas.getByPlaceholderText("Enter phone number");
    await userEvent.type(phone, "612345678901234");
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).toHaveBeenCalled();
  },
};
