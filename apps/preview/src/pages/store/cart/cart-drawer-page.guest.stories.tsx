import { Footer } from "@grade10/design-system/components/layout/footer";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Drawer,
  DrawerContent,
} from "@grade10/design-system/components/overlays/drawer";
import { CartDrawerBody, CartDrawerHeader, SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect } from "storybook/test";
import {
  STORE_CART_COPY,
  STORE_FOOTER,
  STORE_SITE_HEADER,
} from "../../store-content";
import { navigateToStory } from "../../workbench-story-nav";
import {
  BAR_ITEMS,
  BOOSTER_NAME,
  GUEST_BAR_ASK,
  POINTS_COLLAPSED,
  READY_ITEMS,
  READY_SUBTOTAL,
  SIGN_IN_STORY_ID,
} from "../cart-content";
import { GuestBarSignInAsk } from "../guest-bar-ask";
import { CartDrawerPage, drawer } from "./cart-drawer-page";

/** The signed-out drawer: guest checkout, the sign-in line, and the bar ask. */
const meta = {
  title: "Store/Cart/Screens/Cart Drawer/Guest",
  component: CartDrawerPage,
  parameters: { layout: "fullscreen" },
  args: {
    items: READY_ITEMS,
    subtotal: READY_SUBTOTAL,
    estimatedTotal: READY_SUBTOTAL,
    pointsState: POINTS_COLLAPSED,
  },
} satisfies Meta<typeof CartDrawerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Signed-out drawer: guest checkout first, a quiet sign-in line, public codes
 * and no points or member codes. Checkout continues to Order Confirmed. */
export const Guest: Story = {
  args: { guest: true },
  parameters: {
    journeys: ["g10.store-cart-drawer.US10", "g10.store-cart-drawer.US11"],
  },
  play: () => {
    const canvas = drawer();
    expect(canvas.getByText(BOOSTER_NAME)).toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Check Out as Guest" }),
    ).toBeEnabled();
    expect(canvas.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(canvas.getByText("for points and rewards")).toBeInTheDocument();
    expect(canvas.queryByText("Use points")).not.toBeInTheDocument();
  },
};

/** Goods at the HKD 120,000 bar: the same drawer shell, but the sign-in ask
 * stands where the guest checkout was — no checkout starts signed out. */
function GuestBarDrawerPage() {
  const [open, setOpen] = useState(true);
  const lines = BAR_ITEMS.filter((item) => item.status !== "soldOut").length;

  return (
    <div className="flex min-h-svh w-full flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} onCartClick={() => setOpen(true)} />
      <main className="flex-1" />
      <Footer {...STORE_FOOTER} />
      <Drawer
        open={open}
        swipeDirection="right"
        onOpenChange={(next) => {
          if (!next) setOpen(false);
        }}
      >
        <DrawerContent aria-label={STORE_CART_COPY.header.title}>
          <VStack gap="none" className="relative min-h-0 flex-1">
            <CartDrawerHeader
              itemCount={lines}
              copy={STORE_CART_COPY.header}
              onClose={() => setOpen(false)}
            />
            <CartDrawerBody
              items={BAR_ITEMS}
              copy={STORE_CART_COPY.item}
              emptyTitle={STORE_CART_COPY.emptyTitle}
              emptyDescription={STORE_CART_COPY.emptyDescription}
            />
            <GuestBarSignInAsk
              prompt={GUEST_BAR_ASK.prompt}
              action={GUEST_BAR_ASK.action}
              onSignIn={() => navigateToStory(SIGN_IN_STORY_ID)}
            />
          </VStack>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export const GuestAtTheBar: Story = {
  name: "Guest At The Bar",
  render: () => <GuestBarDrawerPage />,
  parameters: { journeys: ["g10.store-checkout.US9"] },
  play: () => {
    const canvas = drawer();
    expect(
      canvas.getByText(
        "To check out HK$120,000 or more, sign in to your account.",
      ),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Check Out as Guest" }),
    ).not.toBeInTheDocument();
    expect(canvas.queryByText("Use points")).not.toBeInTheDocument();
  },
};
