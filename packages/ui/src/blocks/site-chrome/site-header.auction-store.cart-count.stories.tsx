import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { CartDrawerHeader } from "../store-cart/cart-drawer";
import { DEFAULT_CART_COPY } from "../store-cart/fixtures";
import { SiteHeader } from "./site-header";
import {
  AUCTION_STORE_BASE_ARGS,
  COMPACT_WIDTH,
  cartBadge,
  compactContainer,
  WIDE_MIN,
} from "./site-header.auction-store.story-shared";

const meta = {
  title: "Site Chrome/SiteHeader/Auction & Store/Cart count",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: AUCTION_STORE_BASE_ARGS,
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

function countPlay(
  count: number,
  scenario: string,
  compact = false,
): NonNullable<Story["play"]> {
  return async ({ canvasElement, args, step }) => {
    await step(
      `${scenario} - Full count ${count}${compact ? " at 375px" : ""}`,
      async () => {
        const canvas = within(canvasElement);
        const cart = canvas.getByRole("button", { name: `Cart (${count})` });
        const account = canvas.getByRole("button", { name: "Account" });
        const badge = cartBadge(canvasElement) as HTMLElement;
        expect(cart).toBeVisible();
        expect(account).toBeVisible();
        expect(badge).toBeVisible();
        expect(badge).toHaveAttribute("data-variant", "brand");
        expect(badge).toHaveAttribute("data-type", "count");
        expect(badge.textContent).toBe(String(count));
        expect(badge.scrollWidth).toBeLessThanOrEqual(badge.clientWidth);
        const header =
          canvasElement.querySelector<HTMLElement>('[data-slot="nav"]');
        expect(header).not.toBeNull();
        if (header === null) throw new Error("Nav must render");
        const bounds = header.getBoundingClientRect();
        const badgeBounds = badge.getBoundingClientRect();
        expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
        if (compact) {
          expect(bounds.width).toBe(COMPACT_WIDTH);
          expect(
            canvas.getByRole("button", { name: "Menu" }),
          ).toBeInTheDocument();
        } else if (bounds.width >= WIDE_MIN) {
          expect(canvas.queryByRole("button", { name: "Menu" })).toBeNull();
          expect(
            canvas.getByRole("link", { name: "Store" }),
          ).toBeInTheDocument();
        } else {
          expect(
            canvas.getByRole("button", { name: "Menu" }),
          ).toBeInTheDocument();
        }
        expect(badgeBounds.left).toBeGreaterThanOrEqual(bounds.left);
        expect(badgeBounds.right).toBeLessThanOrEqual(bounds.right);
        expect(badgeBounds.top).toBeGreaterThanOrEqual(bounds.top);
        expect(badgeBounds.bottom).toBeLessThanOrEqual(bounds.bottom);
        const text = document.createRange();
        text.selectNodeContents(badge);
        const digits = text.getBoundingClientRect();
        expect(digits.left).toBeGreaterThanOrEqual(badgeBounds.left);
        expect(digits.right).toBeLessThanOrEqual(badgeBounds.right);
        const controls = compact
          ? [account, canvas.getByRole("button", { name: "Menu" })]
          : [account];
        const cartBounds = cart.getBoundingClientRect();
        for (const control of controls) {
          expect(control).toBeVisible();
          const rect = control.getBoundingClientRect();
          expect(
            rect.right <= cartBounds.left || rect.left >= cartBounds.right,
          ).toBe(true);
          expect(
            rect.right <= badgeBounds.left || rect.left >= badgeBounds.right,
          ).toBe(true);
        }
        await userEvent.click(cart);
        expect(args.onCartClick).toHaveBeenCalledTimes(1);
      },
    );
  };
}

/** Cart control present; count badge hidden. */
export const EmptyNoBadge: Story = {
  name: "Empty — no badge",
  args: { cartItemCount: 0 },
  play: async ({ canvasElement, step }) => {
    await step("shared-ui-site-chrome-SC-23 - EmptyNoBadge", async () => {
      const canvas = within(canvasElement);
      expect(
        canvas.getByRole("button", { name: "Sign In" }),
      ).toBeInTheDocument();
      expect(canvas.getByRole("button", { name: "Cart" })).toBeInTheDocument();
      expect(cartBadge(canvasElement)).toBeNull();
    });
  },
};

/** Brand count shows `1`. Signed in — lines require a session. */
export const Count1: Story = {
  name: "1 item",
  args: { session: "signed-in", cartItemCount: 1 },
  play: countPlay(1, "shared-ui-site-chrome-SC-24"),
};

/** Brand count shows `3` — same full count the drawer title badge would show. */
export const Count3: Story = {
  name: "3 items",
  args: { session: "signed-in", cartItemCount: 3 },
  play: countPlay(3, "shared-ui-site-chrome-SC-25"),
};

/** Counts above two digits stay complete instead of `99+`. */
export const Count123: Story = {
  name: "123 items",
  args: { session: "signed-in", cartItemCount: 123 },
  play: countPlay(123, "shared-ui-site-chrome-SC-26"),
};

/** Compact SoT — count badge beside Account and Menu. */
export const CompactCount3: Story = {
  ...Count3,
  name: "Compact — 3 items (375px)",
  decorators: compactContainer,
  play: countPlay(3, "shared-ui-site-chrome-SC-25", true),
};

/** Header and drawer title use the same supplied active-line count. */
export const MatchesDrawerTitle: Story = {
  name: "Matches drawer title",
  args: { session: "signed-in", cartItemCount: 3 },
  render: (args) => (
    <div className="space-y-4">
      <SiteHeader {...args} />
      <CartDrawerHeader
        itemCount={args.cartItemCount ?? 0}
        copy={DEFAULT_CART_COPY.header}
        onClose={fn()}
      />
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    await step("shared-ui-site-chrome-SC-25 - MatchesDrawerTitle", async () => {
      const canvas = within(canvasElement);
      expect(
        canvas.getByRole("button", { name: "Cart (3)" }),
      ).toBeInTheDocument();
      expect(cartBadge(canvasElement)).toHaveTextContent("3");
      expect(canvas.getByRole("heading", { name: "Cart" })).toBeInTheDocument();
      expect(
        canvasElement.querySelector('[data-slot="badge"]'),
      ).toHaveTextContent("3");
    });
  },
};

/** A positive count is ignored when the host omits the cart handler. */
export const NoCartHandler: Story = {
  name: "No cart handler",
  args: {
    session: "signed-in",
    onCartClick: undefined,
    cartItemCount: 3,
  },
  play: async ({ canvasElement, step }) => {
    await step("shared-ui-site-chrome-SC-04 - NoCartHandler", async () => {
      const canvas = within(canvasElement);
      expect(canvas.queryByRole("button", { name: /Cart/ })).toBeNull();
      expect(
        canvasElement.querySelector('[data-slot="status-indicator"]'),
      ).toBeNull();
    });
  },
};
