import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { LISTING_COPY, PRODUCTS } from "./fixtures";
import { ProductList } from "./product-list";

const meta = {
  title: "Store/Product Listing/Blocks/ProductList",
  component: ProductList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LISTING_COPY,
    products: PRODUCTS,
    onProductClick: fn(),
  },
} satisfies Meta<typeof ProductList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_80cfec5a-d1dc-407c-973a-82b449502126" },
  },
};

/** No products, no tiles. The empty and no-match messages are the browse
 * root's job, not the list's. */
export const NoProducts: Story = {
  parameters: {
    verification: { caseId: "vc_bba31da7-fdac-4444-969d-b24e360d90f3" },
  },
  args: { products: [] },
};

/** One column when the viewport cannot fit a 240px tile beside padding. */
export const Narrow: Story = {
  parameters: {
    verification: { caseId: "vc_d9c6ab45-3789-4202-92e1-e5306088e8aa" },
  },
  globals: { viewport: { value: "mobile1" } },
};

/** shared-ui-store-product-listing-SC-93 on the list: a product given its
 * address is drawn as a tile whose photo and name are links to it, beside the
 * cart control the list still draws. */
export const AddressedProducts: Story = {
  parameters: {
    verification: { caseId: "vc_eae07314-4ee5-4bda-a74b-e591aa39587c" },
  },
  args: {
    products: [
      { ...PRODUCTS[1], id: "addressed", href: "/store/products/addressed" },
    ],
    onProductCartQuantityChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const name = canvas.getByRole("link", { name: PRODUCTS[1].name });
    const tile = name.closest('[data-slot="product-card"]') as HTMLElement;
    const links = [
      name,
      tile.querySelector('[data-slot="product-card-image"] a') as HTMLElement,
    ];
    expect(
      canvas.getAllByRole("link", { name: PRODUCTS[1].name }),
    ).toHaveLength(1);
    for (const link of links) {
      expect(link).toHaveAttribute("href", "/store/products/addressed");
    }
    expect(
      canvas.getByRole("button", { name: "Add to cart" }),
    ).toBeInTheDocument();
  },
};

/** Scenario: shared-ui-store-product-listing-SC-87 - The product name
 * activates the tile. Pressing one product's name, then its photo, reports
 * that product's id each time. */
export const NameAndPhotoOpenTheirProduct: Story = {
  parameters: {
    verification: { caseId: "vc_52eeb04b-fd43-4b6a-bd88-d1dfbb0d4dd6" },
  },
  args: { onProductCartQuantityChange: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const product = PRODUCTS.find((each) => !each.soldOut) ?? PRODUCTS[0];
    const name = canvas.getByRole("button", { name: product.name });
    const tile = name.closest('[data-slot="product-card"]') as HTMLElement;
    await userEvent.click(name);
    await userEvent.click(
      tile.querySelector('[data-slot="product-card-image"] img') as HTMLElement,
    );
    expect(args.onProductClick).toHaveBeenCalledTimes(2);
    expect(args.onProductClick).toHaveBeenNthCalledWith(1, product.id);
    expect(args.onProductClick).toHaveBeenNthCalledWith(2, product.id);
  },
};

/** Appending the next page shows Boneyard skeleton tiles below the grid. */
export const LoadingMore: Story = {
  parameters: {
    verification: { caseId: "vc_4fea3cc5-df2d-4cfc-bd03-1ba64b0d7877" },
  },
  args: {
    loading: false,
    loadingMore: true,
    products: PRODUCTS,
  },
};

/** The cart action is reported, not performed: the tile does not change until
 * the consumer supplies a new `inCart`. */
export const ActionIsReported: Story = {
  parameters: {
    verification: { caseId: "vc_6b31cefd-c128-437e-b66c-34a11afa5cd0" },
  },
  args: {
    products: [{ ...PRODUCTS[1], id: "reported", inCart: false }],
    onProductCartQuantityChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });

    cart.focus();
    await userEvent.keyboard("{Enter}");

    expect(args.onProductCartQuantityChange).toHaveBeenCalledTimes(1);
    expect(args.onProductCartQuantityChange).toHaveBeenCalledWith(
      "reported",
      1,
    );
    expect(
      canvas.getByRole("button", { name: "Add to cart" }),
    ).toBeInTheDocument();
  },
};

/**
 * A tile's ceiling and remaining count travel on its `ProductSummary`, so the
 * listing supplies both per product rather than once for the grid.
 */
export const TileCeilingAndRemainingCount: Story = {
  parameters: {
    verification: { caseId: "vc_a711837c-30ca-46ca-b0aa-2f8dbb2be6b9" },
  },
  args: {
    products: [
      {
        ...PRODUCTS[1],
        id: "bounded",
        inCart: true,
        cartCount: "2",
        maxCartQuantity: 2,
        remainingLabel: "Only 2 left",
      },
    ],
    onProductCartQuantityChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Only 2 left")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "2. Adjust cart quantity" }),
    );
    const increment = canvas.getByRole("button", {
      name: "Increase quantity",
    });
    expect(increment).toBeDisabled();

    await userEvent.click(increment, { pointerEventsCheck: 0 });
    expect(args.onProductCartQuantityChange).not.toHaveBeenCalled();
  },
};

const REFUSAL = "The cart could not be changed. Try again.";

function RefusingList() {
  const [failed, setFailed] = useState<string>();
  return (
    <ProductList
      copy={LISTING_COPY}
      onProductCartQuantityChange={() => setFailed(REFUSAL)}
      products={[
        { ...PRODUCTS[1], id: "refused", inCart: false, cartFailed: failed },
      ]}
    />
  );
}

/** A refused cart change shows on the tile it was pressed on, and the tile's
 * control stays pressable for a retry. */
export const CartChangeRefused: Story = {
  parameters: {
    verification: { caseId: "vc_71c10375-e67c-4730-85d4-351b614777b1" },
  },
  render: () => <RefusingList />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("alert")).toBeNull();
    const cart = canvas.getByRole("button", { name: "Add to cart" });

    cart.focus();
    await userEvent.keyboard("{Enter}");

    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(REFUSAL),
    );
    expect(cart).toBeEnabled();
  },
};
