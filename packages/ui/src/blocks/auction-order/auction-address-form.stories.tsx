import { getMessages } from "@grade10/i18n";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuctionAddressForm } from "./auction-address-form";

const { common, auctionOrders } = getMessages("grade10", "en");
const { addAddress } = auctionOrders;

const COPY = {
  personal: addAddress.personal,
  companyKind: addAddress.companyKind,
  firstName: addAddress.firstName,
  lastName: addAddress.lastName,
  phone: addAddress.phone,
  company: addAddress.company,
  country: addAddress.country,
  city: addAddress.city,
  addressLine1: addAddress.addressLine1,
  addressLine2: addAddress.addressLine2,
  // Production currently leaves this label blank (apartment: "" in
  // AuctionAddressForm's own default and in the app's copy assembly); the
  // catalog carries the full label for a consumer that wants to show it.
  apartment: addAddress.apartment,
  state: addAddress.state,
  postalCode: addAddress.postalCode,
  optional: addAddress.optional,
  confirm: common.confirm,
  cancel: common.cancel,
  phonePlaceholder: addAddress.phonePlaceholder,
  countrySearchPlaceholder: addAddress.countrySearchPlaceholder,
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
  title: "Auction/Post Bidding/Blocks/AuctionAddressForm",
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
  parameters: {
    verification: { caseId: "vc_3596a37c-eb1c-456b-8239-07fd701af08a" },
  },
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

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_0662380e-9337-4c41-bdd8-463dddcbb2d0" },
  },
  args: { errors: undefined },
};

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
  parameters: {
    verification: { caseId: "vc_60e638b1-dfc0-4b65-a3bb-23b9f66abf61" },
  },
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
  parameters: {
    verification: { caseId: "vc_cebc22b0-ab17-46a3-8efa-16a9b02054e5" },
  },
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
  parameters: {
    verification: { caseId: "vc_842041a6-25b4-4370-a535-90eb74a2c16c" },
  },
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
  parameters: {
    verification: { caseId: "vc_1f08b2a2-649d-4942-b157-6336414f3225" },
  },
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
  parameters: {
    verification: { caseId: "vc_3f09c763-e2c9-4cd6-9495-abaae0050a6a" },
  },
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
  parameters: {
    verification: { caseId: "vc_ba6007cc-a650-4ed7-abf2-e48e5858d40c" },
  },
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
  parameters: {
    verification: { caseId: "vc_204a1078-cb35-41fe-a6a4-7e40f428340c" },
  },
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
  parameters: {
    verification: { caseId: "vc_212ec7ae-b74e-4257-817e-43072fd075b3" },
  },
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

/** Confirm draws busy while the address saves; a second submit does nothing. */
export const ConfirmPending: Story = {
  parameters: {
    verification: { caseId: "vc_b09cd3c6-9fd8-4b01-bad9-ba054634a83e" },
  },
  args: { errors: undefined, initialValues: COMPLETE_PERSONAL, pending: true },
  play: async ({ args, canvasElement }) => {
    const confirm = within(canvasElement).getByRole("button", {
      name: "Confirm",
    });
    expect(confirm).toHaveAttribute("aria-busy", "true");
    confirm.closest("form")?.requestSubmit();
    expect(args.onConfirm).not.toHaveBeenCalled();
  },
};

/** A refused confirm says why above the actions, and Confirm submits again. */
export const ConfirmRefused: Story = {
  parameters: {
    verification: { caseId: "vc_43a8c5bf-a812-49b1-b358-c8c5e054e262" },
  },
  args: {
    errors: undefined,
    initialValues: COMPLETE_PERSONAL,
    failed: "We couldn't save this address. Try again.",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("alert")).toHaveTextContent(
      "We couldn't save this address. Try again.",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Confirm" }));
    expect(args.onConfirm).toHaveBeenCalledTimes(1);
  },
};
