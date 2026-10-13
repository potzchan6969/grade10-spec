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

/** Guest's promo sheet: `heldPromoCodes={null}` hides the member section —
 * no "Your promo codes", no empty state, no Browse loyalty — while
 * `publicPromoCodes` still lists the codes open to everyone. */
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

    expect(canvas.getByText("Promo codes")).toBeInTheDocument();
    expect(canvas.getByText("G10LAUNCH")).toBeInTheDocument();
    expect(canvas.queryByText("Your promo codes")).not.toBeInTheDocument();
    expect(
      canvas.queryByText("You don’t have any promo codes yet."),
    ).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Browse loyalty offers" }),
    ).not.toBeInTheDocument();
  },
};

/** Member's promo sheet: public codes under their own heading, after the
 * member's "Your promo codes" and "Not valid" sections. */
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

    const yourHeading = canvas.getByText("Your promo codes");
    const publicHeading = canvas.getByText("Promo codes");
    expect(yourHeading).toBeInTheDocument();
    expect(publicHeading).toBeInTheDocument();
    expect(canvas.getByText("Not valid for this order")).toBeInTheDocument();
    expect(canvas.getByText("G10LAUNCH")).toBeInTheDocument();
    // Node.compareDocumentPosition: public section follows the member one.
    expect(
      yourHeading.compareDocumentPosition(publicHeading) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
};
