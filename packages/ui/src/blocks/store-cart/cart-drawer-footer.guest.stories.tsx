import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CartDrawerFooter, CartPromoSheet } from "./cart-drawer";
import {
  FooterWithPromoNest,
  footerMeta,
  heldPromoSelectionSpy,
} from "./cart-drawer-footer.story-fixtures";
import {
  DEFAULT_CART_COPY,
  SAMPLE_HELD_PROMO_CODES,
  SAMPLE_PUBLIC_PROMO_CODES,
} from "./fixtures";
import type { PromoState } from "./types";

/** The signed-out footer and the public promo-code section. */
const meta = {
  title: "Store/Cart/Blocks/CartDrawerFooter/Guest",
  component: CartDrawerFooter,
  ...footerMeta,
} satisfies Meta<typeof CartDrawerFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed-out footer: guest checkout primary, quiet sign-in line, no points. */
export const Guest: Story = {
  args: {
    pointsState: null,
    onSignIn: fn(),
    copy: {
      ...DEFAULT_CART_COPY.footer,
      checkoutButton: "Check Out as Guest",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole("button", { name: "Check Out as Guest" }),
    ).toBeInTheDocument();
    const signIn = canvas.getByRole("button", { name: "Sign in" });
    expect(signIn).toBeInTheDocument();
    expect(canvas.getByText("for points and rewards")).toBeInTheDocument();
    expect(canvas.queryByText("Use points")).not.toBeInTheDocument();

    await userEvent.click(signIn);
    expect(args.onSignIn).toHaveBeenCalled();
  },
};

/** Guest's promo sheet: `heldPromoCodes={null}` hides the member empty
 * state and Browse loyalty, while `publicPromoCodes` still lists the codes
 * open to everyone under "Promo codes". */
export const GuestWithPublicCode: Story = {
  name: "Guest With Public Code",
  render: (args) => {
    const promo: PromoState = { status: "expanded" };
    return (
      <FooterWithPromoNest
        promoOpen
        sheet={
          <CartPromoSheet
            open
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            heldPromoCodes={null}
            publicPromoCodes={SAMPLE_PUBLIC_PROMO_CODES}
            onClose={() => {}}
            onPromoStateChange={() => {}}
            onApplyPromo={() => false}
            onSelectHeldPromo={heldPromoSelectionSpy}
          />
        }
      >
        <CartDrawerFooter {...args} pointsState={null} promoState={promo} />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getAllByText("Promo codes")).toHaveLength(1);
    expect(canvas.getByText("G10LAUNCH")).toBeInTheDocument();
    expect(
      canvas.queryByText("You don’t have any promo codes yet."),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Browse loyalty offers" }),
    ).not.toBeInTheDocument();
  },
};

/** Member's promo sheet: held and public codes list together under one
 * "Promo codes" heading, before "Not valid for this order". */
export const MemberWithPublicCodes: Story = {
  name: "Member With Public Codes",
  render: (args) => {
    const promo: PromoState = { status: "expanded" };
    return (
      <FooterWithPromoNest
        promoOpen
        sheet={
          <CartPromoSheet
            open
            copy={DEFAULT_CART_COPY.footer}
            promoState={promo}
            heldPromoCodes={SAMPLE_HELD_PROMO_CODES}
            publicPromoCodes={SAMPLE_PUBLIC_PROMO_CODES}
            onClose={() => {}}
            onPromoStateChange={() => {}}
            onApplyPromo={() => false}
            onSelectHeldPromo={heldPromoSelectionSpy}
          />
        }
      >
        <CartDrawerFooter {...args} promoState={promo} />
      </FooterWithPromoNest>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const heading = canvas.getByText("Promo codes");
    const notValid = canvas.getByText("Not valid for this order");
    expect(heading).toBeInTheDocument();
    expect(notValid).toBeInTheDocument();
    expect(canvas.getByText("WELCOME100")).toBeInTheDocument();
    expect(canvas.getByText("G10LAUNCH")).toBeInTheDocument();
    // Node.compareDocumentPosition: the one list precedes Not valid.
    expect(
      heading.compareDocumentPosition(notValid) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
};
