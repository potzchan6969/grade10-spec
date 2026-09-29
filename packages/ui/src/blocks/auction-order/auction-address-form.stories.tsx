import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionAddressForm } from "./auction-address-form";

const { common } = getMessages("grade10", "en");

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
  confirm: common.confirm,
  cancel: common.cancel,
  phonePlaceholder: "+852 12345678",
  countrySearchPlaceholder: "e.g. United States",
};

const COMPLETE_PERSONAL = {
  addressKind: "personal" as const,
  firstName: "Alex",
  lastName: "Chen",
  phone: "+85261239999",
  phoneCountry: "HK",
  country: "Hong Kong",
  city: "Wan Chai",
  addressLine1: "12/F, Tower 1",
  addressLine2: "",
  state: "",
  postalCode: "000000",
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

/** How far a focused control paints past its own box: the widest outer
 * `box-shadow` it computes once its focus transition ends. */
async function ringOf(control: HTMLElement) {
  control.focus();
  await Promise.all(control.getAnimations().map((motion) => motion.finished));
  const reach = [
    ...getComputedStyle(control).boxShadow.matchAll(
      /(-?[\d.]+)px (-?[\d.]+)px ([\d.]+)px (-?[\d.]+)px(?! inset)/g,
    ),
  ].map(
    ([, x, y, blur, spread]) =>
      Math.max(Math.abs(Number(x)), Math.abs(Number(y))) +
      Number(blur) +
      Number(spread),
  );
  return Math.max(0, ...reach);
}

/**
 * The fields scroll, so their region clips at its own edge. Confirm sits in
 * its bottom-left corner, still lines up with the address kind above it, and
 * keeps room for its whole focus ring.
 */
export const ActionsKeepTheirFocusRing: Story = {
  args: { errors: undefined },
  play: async ({ canvasElement }) => {
    const slot = (name: string) => {
      const node = canvasElement.querySelector(`[data-slot="${name}"]`);
      if (node === null) throw new Error(`The form renders no ${name}`);
      return node.getBoundingClientRect();
    };
    const clip = slot("auction-address-fields");
    const kind = slot("auction-address-kind");
    const control = within(canvasElement).getByRole("button", {
      name: "Confirm",
    });
    const confirm = control.getBoundingClientRect();
    const ring = await ringOf(control);

    expect(ring).toBeGreaterThan(0);
    expect(confirm.left).toBeCloseTo(kind.left, 1);
    expect(confirm.left - ring).toBeGreaterThanOrEqual(clip.left);
    expect(confirm.bottom + ring).toBeLessThanOrEqual(clip.bottom);
  },
};

/** Personal default — Company Name hidden; Confirm clears company (SC-09, SC-12). */
export const Personal: Story = {
  args: {
    errors: undefined,
    initialValues: {
      ...COMPLETE_PERSONAL,
      company: "Should Clear On Confirm",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByLabelText(/Company Name/i)).toBeNull();
    expect(canvas.getByPlaceholderText("+852 12345678")).toBeVisible();
    expect(canvas.queryByLabelText(/Apt\.|Suite|Building/i)).toBeNull();
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        addressKind: "personal",
        phone: "+85261239999",
        company: "",
      }),
    );
  },
};

/** Company — Company Name required (SC-10). */
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

/** Empty phone country refuses beside Phone (SC-07). */
export const EmptyPhoneCountryRefuse: Story = {
  args: {
    errors: undefined,
    initialValues: {
      ...COMPLETE_PERSONAL,
      phone: "",
      phoneCountry: "",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).not.toHaveBeenCalled();
    expect(canvas.getByText("Enter a phone number.")).toBeVisible();
  },
};

/** Empty digits with country selected refuses (SC-07). Unusual digits still confirm (SC-08). */
export const PhoneSoftRule: Story = {
  args: {
    errors: undefined,
    initialValues: {
      ...COMPLETE_PERSONAL,
      phone: "",
      phoneCountry: "HK",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).not.toHaveBeenCalled();
    expect(canvas.getByText("Enter a phone number.")).toBeVisible();
  },
};

/** Unusual digit string with country still confirms and keeps the value (SC-08). */
export const UnusualPhoneAccepted: Story = {
  args: {
    errors: undefined,
    initialValues: {
      ...COMPLETE_PERSONAL,
      phone: "612345678901234",
      phoneCountry: "HK",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        addressKind: "personal",
        phone: "612345678901234",
      }),
    );
  },
};

/** Parseable national digits export as E.164 (SC-08, SC-12). */
export const PhoneReportsE164: Story = {
  args: {
    errors: undefined,
    initialValues: {
      ...COMPLETE_PERSONAL,
      phone: "4155550100",
      phoneCountry: "US",
      country: "United States",
      city: "San Francisco",
      addressLine1: "1 Market St",
      postalCode: "94105",
    },
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        addressKind: "personal",
        phone: "+14155550100",
        phoneCountry: "US",
      }),
    );
  },
};

/** Line 2 and state optional; no Apt. field (SC-11). */
export const OptionalLocality: Story = {
  args: {
    errors: undefined,
    initialValues: COMPLETE_PERSONAL,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByLabelText(/Apt\.|Suite|Building/i)).toBeNull();
    expect(canvas.getByLabelText(/Address Line 2/i)).toBeVisible();
    expect(canvas.getByLabelText(/State\/Province\/Region/i)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({
        addressLine1: "12/F, Tower 1",
        addressLine2: "",
        state: "",
        postalCode: "000000",
        addressKind: "personal",
        phone: "+85261239999",
      }),
    );
  },
};
