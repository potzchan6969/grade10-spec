import { Button } from "@grade10/design-system/components/forms/button";
import { Link } from "@grade10/design-system/components/forms/link";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { PRODUCT_CARD_CART_COPY } from "../store-product-listing/fixtures";
import { ProductCard } from "../store-product-listing/product-card";
import { SignInCard } from "./sign-in-card";
import { SignInEmailForm } from "./sign-in-email-form";
import { SignInLinkSent } from "./sign-in-link-sent";

const LISTING_IMAGE = new URL(
  "../store-product-listing/product-card.fixture.png",
  import.meta.url,
).href;

/**
 * Sign-in is a dialog over the page the collector was already on, matching
 * [`Login Dialog` 4666:1488](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4666-1488).
 * `open` is the consumer's state: the component has no uncontrolled fallback,
 * so the meta holds it at true and every story below is the open dialog.
 *
 * Figma draws a Google OAuth control above the divider. Storybook cannot host
 * Google's real widget, so gallery stories omit it rather than faking one —
 * the empty `providerSlot` contract stays on `ProviderThatHasNotDrawnYet`.
 *
 * The dialog portals to `document.body`, so play functions query
 * `within(document.body)` rather than the canvas.
 */
const figmaLegal = (
  <>
    By continuing, you agree to our{" "}
    <Link href="/legal/terms" size="xs" target="_blank">
      Terms of Service
    </Link>{" "}
    &{" "}
    <Link href="/legal/privacy" size="xs" target="_blank">
      Privacy Policy
    </Link>
  </>
);

const meta = {
  title: "Auth Sign In/SignInCard",
  component: SignInCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    open: true,
    onOpenChange: fn(),
    copy: {
      title: "Sign In to Grade10",
      legal: figmaLegal,
    },
    children: (
      <SignInEmailForm
        copy={{
          email: "Email",
          emailPlaceholder: "Enter your email",
          submit: "Sign In with Email",
        }}
        email=""
        onEmailChange={fn()}
        onSubmit={fn()}
      />
    ),
  },
} satisfies Meta<typeof SignInCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Figma's Login Dialog without the Google control: title, email step,
 * legal line. Empty email keeps Sign In with Email disabled, which is what the
 * frame draws at rest.
 */
export const Default: Story = {
  play: async () => {
    const body = within(document.body);
    const dialog = body.getByRole("dialog");

    expect(
      body.getByRole("heading", { name: "Sign In to Grade10" }),
    ).toBeInTheDocument();
    expect(body.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "placeholder",
      "Enter your email",
    );
    expect(
      body.getByRole("button", { name: "Sign In with Email" }),
    ).toBeDisabled();
    expect(
      dialog.querySelector('[data-slot="sign-in-legal"]'),
    ).toBeInTheDocument();
    expect(
      body.getByRole("link", { name: "Terms of Service" }),
    ).toBeInTheDocument();
    expect(
      body.getByRole("link", { name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(dialog.querySelector('[data-slot="divider"]')).toBeNull();
  },
};

/**
 * Progress / wait copy under the email step — field errors stay on the
 * step's `error` prop. Post-send confirmation is `LinkSent`, not this line.
 * Also proves legal stays the body's last node when a status line is present.
 */
export const WithMessage: Story = {
  name: "Status message",
  args: {
    message: "Please wait a minute before requesting another email.",
    children: (
      <SignInEmailForm
        copy={{
          email: "Email",
          emailPlaceholder: "Enter your email",
          submit: "Sign In with Email",
        }}
        email="collector@example.com"
        onEmailChange={fn()}
        onSubmit={fn()}
      />
    ),
  },
  play: async () => {
    const body = within(document.body);
    const dialog = body.getByRole("dialog");
    const submit = body.getByRole("button", { name: "Sign In with Email" });
    const message = dialog.querySelector(
      '[data-slot="sign-in-message"]',
    ) as HTMLElement;
    const legal = dialog.querySelector('[data-slot="sign-in-legal"]');

    expect(message).toHaveTextContent(
      "Please wait a minute before requesting another email.",
    );
    expect(
      submit.compareDocumentPosition(message) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(message.className).toMatch(/text-center/);
    expect(message.className).toMatch(/text-secondary-foreground/);
    expect(message.className).toMatch(/text-xs/);
    expect(message.parentElement?.className).toMatch(/gap-2/);
    expect(legal).toBe(
      dialog.querySelector('[data-slot="dialog-body"]')?.lastElementChild,
    );
  },
};

/**
 * Scenario: shared-ui-auth-sign-in-SC-08 — the block draws no legal node of
 * its own, so a consumer that supplies no wording gets none.
 */
export const WithoutLegal: Story = {
  name: "Without legal",
  args: {
    copy: { title: "Sign In to Grade10" },
  },
  play: async () => {
    const body = within(document.body);

    expect(
      body.getByRole("dialog").querySelector('[data-slot="sign-in-legal"]'),
    ).toBeNull();
  },
};

/**
 * Documents `providerSlot` above the labelled divider. Not a Google stand-in —
 * Google's real widget cannot run in Storybook; see
 * `ProviderThatHasNotDrawnYet` for the empty async slot. This story only
 * proves order and the divider label for a consumer-owned control.
 */
export const WithProviderSlot: Story = {
  name: "Provider slot",
  args: {
    copy: {
      title: "Sign In to Grade10",
      providerDivider: "or",
      legal: figmaLegal,
    },
    providerSlot: (
      <Button size="md" type="button" variant="outline">
        Provider widget mounts here
      </Button>
    ),
  },
  play: async () => {
    const body = within(document.body);
    const provider = body.getByRole("button", {
      name: "Provider widget mounts here",
    });
    const email = body.getByLabelText("Email");
    const group = body
      .getByRole("dialog")
      .querySelector('[data-slot="divider"]')?.parentElement as HTMLElement;

    expect(getComputedStyle(group).display).not.toBe("none");
    expect(body.getByText("or")).toBeInTheDocument();
    // Node.compareDocumentPosition: 4 === provider precedes email.
    expect(
      provider.compareDocumentPosition(email) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
};

/**
 * A widget a script fills in later — Google's own button — marks its own
 * container, and the divider waits for it. An "or" over blank space is what
 * a collector sees when that script never answers, so the pair hides until
 * something is actually there to divide. Gallery omits a fake Google control.
 */
export const ProviderThatHasNotDrawnYet: Story = {
  name: "Provider empty",
  args: {
    copy: {
      title: "Sign In to Grade10",
      providerDivider: "or",
      legal: figmaLegal,
    },
    providerSlot: <div data-slot="sign-in-provider" />,
  },
  play: async () => {
    const dialog = within(document.body).getByRole("dialog");
    const container = dialog.querySelector(
      '[data-slot="sign-in-provider"]',
    ) as HTMLElement;
    const group = dialog.querySelector('[data-slot="divider"]')
      ?.parentElement as HTMLElement;

    expect(getComputedStyle(group).display).toBe("none");

    container.appendChild(document.createElement("button"));

    await waitFor(() =>
      expect(getComputedStyle(group).display).not.toBe("none"),
    );
  },
};

/**
 * The close control reports dismissal and leaves the page beneath alone.
 *
 * `!dev` on this and the two below: each renders exactly what `Default`
 * renders, so the gallery gains nothing by listing them. The tag hides a
 * story from the sidebar and not from the run — they still prove
 * `shared-ui-auth-sign-in-SC-04`, one route each from a pristine dialog,
 * which is what `DismissalLeavesThePageBeneath` cannot do for the two it
 * reaches second and third.
 */
export const CloseControlReportsDismissal: Story = {
  tags: ["!dev"],
  play: async ({ args }) => {
    const body = within(document.body);
    await userEvent.click(body.getByRole("button", { name: "Close dialog" }));
    await waitFor(() => {
      expect(args.onOpenChange).toHaveBeenCalledWith(false);
    });
  },
};

export const EscapeReportsDismissal: Story = {
  tags: ["!dev"],
  play: async ({ args }) => {
    await userEvent.keyboard("{Escape}");
    await waitFor(() => {
      expect(args.onOpenChange).toHaveBeenCalledWith(false);
    });
  },
};

/**
 * The scrim is the third way out, alongside the close control and Escape.
 * `DialogContent` mounts its own `DialogOverlay`, so activating it is
 * activating what the dialog already renders — no separate mount to reach for.
 */
export const ScrimReportsDismissal: Story = {
  tags: ["!dev"],
  play: async ({ args }) => {
    const scrim = document.body.querySelector('[data-slot="dialog-overlay"]');
    expect(scrim).toBeInTheDocument();

    await userEvent.click(scrim as Element);

    await waitFor(() => {
      expect(args.onOpenChange).toHaveBeenCalledWith(false);
    });
  },
};

/**
 * What dismissal is *for*: the collector goes back to what they were doing.
 * The page renders behind the dialog and is still there after every way out —
 * a card on a route could not promise that, which is the whole reason this
 * surface moved onto `Dialog`.
 *
 * Queried with `hidden`, because Base UI marks everything outside an open
 * modal `aria-hidden` and inert. That is the contract, not a defect: the page
 * is mounted and untouched, and setting `open` to false is what hands it back.
 * Mounted is the whole claim — this story holds `open` at true, so what it can
 * show is that dismissing never unmounts or navigates.
 */
export const DismissalLeavesThePageBeneath: Story = {
  name: "Dismissal leaves page",
  decorators: [
    (Story) => (
      <>
        <main>
          <h1>Your cart</h1>
          <p>1999 Charizard, PSA 10</p>
        </main>
        <Story />
      </>
    ),
  ],
  play: async ({ args, canvas }) => {
    const page = canvas.getByRole("heading", {
      name: "Your cart",
      hidden: true,
    });
    const body = within(document.body);
    const scrim = () =>
      document.body.querySelector('[data-slot="dialog-overlay"]') as Element;

    for (const dismiss of [
      () => userEvent.click(body.getByRole("button", { name: "Close dialog" })),
      () => userEvent.keyboard("{Escape}"),
      () => userEvent.click(scrim()),
    ]) {
      args.onOpenChange.mockClear();

      await dismiss();

      await waitFor(() => {
        expect(args.onOpenChange).toHaveBeenCalledWith(false);
      });
      expect(page).toBeInTheDocument();
      expect(canvas.getByText("1999 Charizard, PSA 10")).toBeInTheDocument();
    }
  },
};

/**
 * After a successful send: dialog title **Check Your Email**; confirmation
 * lead line then the address on the next line; Resend secondary and hugging
 * with **Resend (n)** for the sixty-second wait. No Back control — leave via
 * dialog dismiss. Consumer omits `providerSlot` on this step.
 *
 * Spec: shared-auth-sign-in-SC-42 / SC-46; shared-ui-auth-sign-in-SC-13–14.
 */
export const LinkSent: Story = {
  name: "Link sent",
  args: {
    providerSlot: undefined,
    copy: {
      title: "Check Your Email",
      legal: figmaLegal,
    },
    children: (
      <SignInLinkSent
        copy={{
          message: "We've just sent a sign-in link to",
          resend: "Resend",
          resendCountdown: "Resend (60)",
        }}
        email="collector@example.com"
        onResend={fn()}
        resendCooldownRemaining={60}
      />
    ),
  },
  play: async () => {
    const body = within(document.body);
    const dialog = body.getByRole("dialog");

    expect(
      body.getByRole("heading", { name: "Check Your Email" }),
    ).toBeInTheDocument();
    expect(
      body.getByText("We've just sent a sign-in link to"),
    ).toBeInTheDocument();
    expect(body.getByText("collector@example.com")).toBeInTheDocument();
    expect(body.getByRole("button", { name: "Resend (60)" })).toBeDisabled();
    expect(body.queryByRole("button", { name: "Back" })).toBeNull();
    expect(body.queryByRole("textbox", { name: "Email" })).toBeNull();
    expect(dialog.querySelector('[data-slot="divider"]')).toBeNull();
    expect(
      dialog.querySelector('[data-slot="sign-in-link-sent"]'),
    ).toBeInTheDocument();
  },
};

/**
 * Signed-out Add to cart on a listing tile opens the Login Dialog — the
 * consumer owns session and `open`, so the cart control reports quantity and
 * this demo opens sign-in instead of adding a guest line. Narrow viewport
 * keeps the cart control visible without hover (same as listing on touch).
 *
 * Why-title: `copy.title` is **Sign In to Add to Cart** (not the meta
 * default **Sign In to Grade10**). Spec:
 * `grade10-site-store-product-listing-SC-47` (product-page twin SC-29);
 * open-from-add gate remains SC-44 / SC-26.
 */
export const FromAddToCart: Story = {
  name: "From add to cart",
  args: {
    open: false,
    copy: {
      title: "Sign In to Add to Cart",
      legal: figmaLegal,
    },
  },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  render: function FromAddToCartDemo(args) {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    return (
      <>
        <main className="bg-background p-6">
          <div className="w-[260px]">
            <ProductCard
              copy={PRODUCT_CARD_CART_COPY}
              imageAlt="Pokémon TCG Sealed Booster Box – Abyss Eye (M5)"
              imageSrc={LISTING_IMAGE}
              name="Pokémon TCG Sealed Booster Box – Abyss Eye (M5)"
              onCartQuantityChange={() => {
                setOpen(true);
              }}
              onClick={() => {}}
              price="HK$105"
            />
          </div>
        </main>
        <SignInCard {...args} onOpenChange={setOpen} open={open}>
          <SignInEmailForm
            copy={{
              email: "Email",
              emailPlaceholder: "Enter your email",
              submit: "Sign In with Email",
            }}
            email={email}
            onEmailChange={setEmail}
            onSubmit={fn()}
          />
        </SignInCard>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });

    expect(within(document.body).queryByRole("dialog")).toBeNull();

    await userEvent.click(cart);

    const body = within(document.body);
    await waitFor(() => {
      expect(body.getByRole("dialog")).toBeInTheDocument();
    });
    expect(
      body.getByRole("heading", { name: "Sign In to Add to Cart" }),
    ).toBeInTheDocument();
    // Consumer never marked the tile in-cart — no guest line.
    expect(
      canvasElement.querySelector(
        '[data-slot="product-card-image"][data-in-cart]',
      ),
    ).toBeNull();
  },
};
