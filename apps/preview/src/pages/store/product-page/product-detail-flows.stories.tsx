import type { CartItemSummary } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import { STORE_LOCATOR_HREF } from "../../workbench-story-nav";
import { CartPanel } from "../cart-panel";
import { ProductDetailCase } from "./product-detail-case";
import {
  PRODUCT_DETAIL_PRODUCT,
  SOLD_OUT_PRODUCT,
} from "./product-detail-content";

const meta = {
  title: "Store/Product Page/Flows/Product Detail",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SALE_ITEM = PRODUCT_DETAIL_PRODUCT.variants[0];

/** The cart once the add lands: two of the card, the stepper back to one. */
const ADDED_ITEMS: readonly CartItemSummary[] = [
  {
    id: SALE_ITEM.id,
    name: PRODUCT_DETAIL_PRODUCT.title,
    price: SALE_ITEM.price,
    originalPrice: SALE_ITEM.compareAtPrice,
    imageSrc: PRODUCT_DETAIL_PRODUCT.images[0]?.src,
    imageAlt: PRODUCT_DETAIL_PRODUCT.images[0]?.alt,
    quantity: 2,
    status: "default",
  },
];
const ADDED_TOTAL = "HK$210.00";

const READ_CASES: [string, "own-address" | "expanded" | "no-media"][] = [
  ["Card at its own address", "own-address"],
  ["Description read in full", "expanded"],
  ["No supplied images", "no-media"],
];

const CART_CASES: [string, "ready" | "quantity" | "pending" | "added"][] = [
  ["Ready to add", "ready"],
  ["Quantity raised before adding", "quantity"],
  ["Add pending", "pending"],
  ["Added, the cart drawer opens", "added"],
];

const SOLD_CASES: [string, "sold-out" | "for-sale"][] = [
  ["Every variant sold out", "sold-out"],
  ["Card still for sale", "for-sale"],
];

const CLAIM_CASES: [string, "claim"][] = [["Free pick-up claim", "claim"]];

/** A collector reads one card at its own address, expands the description, and sees a card with no images. */
export const ReadACard: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-product-page-US-01",
      "grade10-site-store-product-page-US-06",
      "grade10-site-store-product-page-US-07",
    ],
  },
  render: () => (
    <FlowContainer
      cases={READ_CASES}
      description={
        <p>
          The card shows its supplied images, its price with any compare-at
          price, and its item facts. A long description opens in place, and Show
          less folds it again. A card with no images still names itself in its
          picture.
        </p>
      }
    >
      {(step) =>
        step === "no-media" ? (
          <ProductDetailCase
            product={{ ...PRODUCT_DETAIL_PRODUCT, images: [] }}
          />
        ) : (
          <ProductDetailCase product={PRODUCT_DETAIL_PRODUCT} />
        )
      }
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("img", { name: /front view/ })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    await userEvent.click(canvas.getByRole("button", { name: "Show more" }));
    expect(canvas.getByRole("button", { name: "Show less" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getByRole("img", { name: PRODUCT_DETAIL_PRODUCT.title }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      READ_CASES.length,
    );
    // Several cards repeat the block's named landmark, so the run ends back
    // on one card for the accessibility check.
    await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
          1,
        ),
      { timeout: 3000 },
    );
  },
};

/** A collector raises the quantity, adds the card, and the cart drawer opens with it. */
export const AddToCart: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-product-page-US-03",
      "grade10-site-store-product-page-US-08",
    ],
  },
  render: () => (
    <FlowContainer
      cases={CART_CASES}
      description={
        <p>
          The quantity steps before the add. Add to cart waits while the add
          runs, then the cart drawer opens with the card at the quantity chosen,
          and the stepper returns to one.
        </p>
      }
    >
      {(step) =>
        step === "added" ? (
          <CartPanel
            estimatedTotal={ADDED_TOTAL}
            items={ADDED_ITEMS}
            subtotal={ADDED_TOTAL}
          />
        ) : (
          <ProductDetailCase
            adding={step === "pending"}
            product={PRODUCT_DETAIL_PRODUCT}
            quantity={step === "ready" ? 1 : 2}
          />
        )
      }
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeVisible();
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
      "1",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
      "2",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("button", { name: "Adding…" })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(
      canvas.getByRole("button", { name: "Proceed to Checkout" }),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      CART_CASES.length,
    );
    // Several cards repeat the block's named landmark, so the run ends back
    // on one card for the accessibility check.
    await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
          1,
        ),
      { timeout: 3000 },
    );
  },
};

/** A sold-out card shows that it cannot be bought and still reads as the card it is. */
export const MeetASoldOutCard: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-product-page-US-04",
      "grade10-site-store-product-page-US-09",
    ],
  },
  render: () => (
    <FlowContainer
      cases={SOLD_CASES}
      description={
        <p>
          A card with nothing for sale names it on its button and draws no cart
          control. Its name and price still read as the card they are.
        </p>
      }
    >
      {(step) => (
        <ProductDetailCase
          product={
            step === "sold-out" ? SOLD_OUT_PRODUCT : PRODUCT_DETAIL_PRODUCT
          }
        />
      )}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sold out" })).toBeDisabled();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      SOLD_CASES.length,
    );
    // Several cards repeat the block's named landmark, so the run ends back
    // on one card for the accessibility check.
    await userEvent.click(canvas.getByRole("tab", { name: "Transition" }));
    await waitFor(
      () =>
        expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
          1,
        ),
      { timeout: 3000 },
    );
  },
};

/** A collector reads the free pick-up claim and opens Store Locator from the store name. */
export const OpenStoreLocatorFromFreePickup: Story = {
  parameters: {
    journeys: ["grade10-site-store-product-page-US-10"],
  },
  render: () => (
    <FlowContainer
      cases={CLAIM_CASES}
      description={
        <p>
          The store name in the free pick-up claim is a link to Store Locator.
          Shipping fee sits beside it as the checkout calculates it.
        </p>
      }
    >
      {() => <ProductDetailCase product={PRODUCT_DETAIL_PRODUCT} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("link", { name: "Hong Kong Grade10 Store" }),
    ).toHaveAttribute("href", STORE_LOCATOR_HREF);
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      CLAIM_CASES.length,
    );
  },
};
