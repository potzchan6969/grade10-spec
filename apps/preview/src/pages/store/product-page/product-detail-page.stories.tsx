import { Button } from "@grade10/design-system/components/forms/button";
import { Footer } from "@grade10/design-system/components/layout/footer";
import {
  type ProductSummary,
  SiteHeader,
  StoreProductRelatedRail,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { STORE_FOOTER, STORE_SITE_HEADER } from "../../store-content";
import { navigateToStory } from "../../workbench-story-nav";
import {
  PRODUCT_DETAIL_PRODUCT,
  PRODUCT_LIST_STORY_ID,
  type ProductDetailProduct,
  RELATED_PRODUCTS,
  SOLD_OUT_PRODUCT,
  UNKNOWN_PRODUCT_COPY,
  YOU_MAY_ALSO_LIKE_COPY,
} from "./product-detail-content";
import { StoreProductDetail } from "./store-product-detail";

/**
 * The Store product detail page as a store assembles it: storefront chrome,
 * the product-detail composition, the cards shown under it, and the footer.
 * The page story owns the chrome while StoreProductDetail owns the preview
 * state and surface. An address with no product gets a not-found page.
 */
function ProductDetailPage({
  product,
  related = [],
}: {
  product: ProductDetailProduct | null;
  /** The cards shown under this one, in order. None draws no rail. */
  related?: readonly ProductSummary[];
}) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} promo={null} />
      {product ? (
        <>
          <StoreProductDetail product={product} />
          {related.length > 0 && (
            <div className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-8">
              <StoreProductRelatedRail
                cards={related}
                copy={YOU_MAY_ALSO_LIKE_COPY}
              />
            </div>
          )}
        </>
      ) : (
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-6 px-8 py-16">
          <h1 className="text-3xl font-semibold text-foreground">
            {UNKNOWN_PRODUCT_COPY.title}
          </h1>
          <p className="text-sm text-secondary-foreground">
            {UNKNOWN_PRODUCT_COPY.description}
          </p>
          <Button
            onClick={() => navigateToStory(PRODUCT_LIST_STORY_ID)}
            type="button"
          >
            {UNKNOWN_PRODUCT_COPY.browseStore}
          </Button>
        </main>
      )}
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Store/Product Page/Screens/Product Detail",
  component: ProductDetailPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProductDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: PRODUCT_DETAIL_PRODUCT.title,
      }),
    ).toBeVisible();
    expect(canvas.getByRole("img", { name: /front view/ })).toBeVisible();
    expect(canvas.queryByText("Only 3 left")).toBeNull();
    expect(canvas.queryByRole("radiogroup")).toBeNull();
    expect(canvas.queryByText("Standard box")).toBeNull();
    expect(canvas.queryByText("Collector case")).toBeNull();
    expect(canvas.queryByText("Gift bundle")).toBeNull();
    expect(canvas.getByText("HK$105.00")).toBeVisible();
    expect(canvas.getByText("SKU: G10-M5-ABYSS-STD")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeVisible();
    expect(canvas.getByRole("contentinfo")).toBeInTheDocument();

    await canvas.getByRole("button", { name: "Show more" }).click();
    expect(canvas.getByRole("button", { name: "Show less" })).toBeVisible();
  },
};

export const Narrow: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  globals: { viewport: { value: "mobile1" } },
};

export const NoMedia: Story = {
  args: { product: { ...PRODUCT_DETAIL_PRODUCT, images: [] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("img", { name: PRODUCT_DETAIL_PRODUCT.title }),
    ).toBeVisible();
  },
};

export const SoldOut: Story = {
  args: { product: SOLD_OUT_PRODUCT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(canvas.queryByText("This product is not for sale.")).toBeNull();
  },
};

/** The description opens in place, and Show less folds it again. */
export const DescriptionExpanded: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show more" }));
    expect(canvas.getByRole("button", { name: "Show less" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Show less" }));
    expect(canvas.getByRole("button", { name: "Show more" })).toBeVisible();
  },
};

/** Add to cart waits while the add runs, then the cart drawer opens with the card and the stepper resets. */
export const AddQuantityPendingThenDrawerOpens: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Add to cart" }));
    expect(canvas.getByRole("button", { name: "Adding…" })).toBeInTheDocument();
    expect(
      await within(document.body).findByRole("button", {
        name: "Proceed to Checkout",
      }),
    ).toBeVisible();
    expect(
      canvas.getByRole("spinbutton", { name: "Quantity", hidden: true }),
    ).toHaveValue("1");
  },
};

/** An address with no product: a not-found page that sends the collector back to the listing. */
export const UnknownProductAddress: Story = {
  args: { product: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: UNKNOWN_PRODUCT_COPY.title,
      }),
    ).toBeVisible();
    expect(
      canvas.getByRole("button", { name: UNKNOWN_PRODUCT_COPY.browseStore }),
    ).toBeVisible();
    expect(canvas.queryByRole("button", { name: "Add to cart" })).toBeNull();
  },
};

/** The rail under the card: its picks, one sold out, each tile opening its own page. */
export const WithYouMayAlsoLike: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT, related: RELATED_PRODUCTS },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rail = canvas.getByRole("region", {
      name: YOU_MAY_ALSO_LIKE_COPY.heading,
    });
    expect(
      within(rail).getByRole("heading", {
        name: YOU_MAY_ALSO_LIKE_COPY.heading,
      }),
    ).toBeVisible();
    expect(within(rail).getByText("SOLD OUT")).toBeVisible();
    expect(
      within(rail).queryByRole("button", { name: "Add to cart" }),
    ).toBeNull();
  },
};
