import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { T } from "../ticketing-words";
import { REFUSAL_ACTIONS, REFUSALS, type Refusal } from "./buying-content";
import { ReviewPage } from "./checkout-pages";

/**
 * What the checkout answered instead of a payment page, the Refusals
 * board: one notice above Your Order, its sentence and the way on. Every
 * refusal's words are on the TicketCheckoutRefusalNotice block's stories;
 * these are the screen with the ones a buyer meets most.
 */
const meta = {
  title: "Ticketing/Buying/Screens/Check Your Order/Refusals",
  component: ReviewPage,
  parameters: {
    layout: "fullscreen",
    journeys: ["grade10-site-ticketing-buying-US-01"],
  },
  args: { defaultAgreed: true },
} satisfies Meta<typeof ReviewPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const refusal = (code: string) =>
  REFUSALS.find((item) => item.code === code) as Refusal;

const shows =
  (item: Refusal) =>
  async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(within(canvasElement).getByRole("main"));
    await expect(canvas.getByText(item.copy.title)).toBeVisible();
    if (item.action)
      await expect(
        canvas.getByRole("button", {
          name: REFUSAL_ACTIONS[item.action].label,
        }),
      ).toBeVisible();
  };

export const SoldOut: Story = {
  parameters: {
    verification: { caseId: "vc_f7256c2e-36f1-44a3-a64b-937c3a7a3c16" },
  },
  name: "Sold out",
  args: { refusal: refusal("SOLD_OUT") },
  play: shows(refusal("SOLD_OUT")),
};

export const SomeLeft: Story = {
  parameters: {
    verification: { caseId: "vc_6f5405b6-d235-4f8c-8cb1-5eddd08eea44" },
  },
  name: "Only some left",
  args: { refusal: refusal("SOLD_OUT (some left)") },
  play: shows(refusal("SOLD_OUT (some left)")),
};

export const CheckoutBusy: Story = {
  parameters: {
    verification: { caseId: "vc_9fb76e40-bb17-4d51-92e5-fc5b541bb1b1" },
  },
  name: "Checkout busy",
  args: { refusal: refusal("CHECKOUT_BUSY") },
  play: shows(refusal("CHECKOUT_BUSY")),
};

export const AccountLimit: Story = {
  parameters: {
    verification: { caseId: "vc_60fa61fe-aa5f-4631-9a62-0f412b50644b" },
  },
  name: "Over the email's limit",
  args: { refusal: refusal("ACCOUNT_LIMIT (guest)") },
  play: shows(refusal("ACCOUNT_LIMIT (guest)")),
};

export const NotOpenToYouYet: Story = {
  parameters: {
    verification: { caseId: "vc_e6ed767f-0472-4a91-9053-13f3b641debc" },
  },
  name: "Not open to you yet",
  args: { refusal: refusal("NOT_OPEN_TO_YOU_YET") },
  play: shows(refusal("NOT_OPEN_TO_YOU_YET")),
};

export const AccessLimit: Story = {
  parameters: {
    verification: { caseId: "vc_45daf687-b293-4208-a6a3-7aa411491a1d" },
  },
  name: "Over your access limit",
  args: { refusal: refusal("ACCESS_LIMIT") },
  play: shows(refusal("ACCESS_LIMIT")),
};

export const SignedOut: Story = {
  parameters: {
    verification: { caseId: "vc_fc756a11-d022-44b5-8ba6-fbd3cc995906" },
  },
  name: "Signed out",
  args: { refusal: refusal("Signed out mid-checkout") },
  play: shows(refusal("Signed out mid-checkout")),
};

export const PaymentUnavailable: Story = {
  parameters: {
    verification: { caseId: "vc_cd49541f-3daa-463a-96ae-cc650b383da5" },
  },
  name: "Payment unavailable",
  args: { refusal: refusal("PAYMENT_UNAVAILABLE") },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(T.refusals.paymentUnavailable.title),
    ).toBeVisible();
    await expect(
      canvas.getByText(T.refusals.paymentUnavailable.body),
    ).toBeVisible();
  },
};

export const SomethingWentWrong: Story = {
  parameters: {
    verification: { caseId: "vc_ff2d76f9-f902-4e4f-9734-8327f140a103" },
  },
  name: "Something went wrong",
  args: { refusal: refusal("Anything else") },
  play: shows(refusal("Anything else")),
};
