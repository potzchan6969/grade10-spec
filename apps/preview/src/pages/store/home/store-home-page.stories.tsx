import { Footer } from "@grade10/design-system/components/layout/footer";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  ProductCard,
  SiteHeader,
  StoreCollectionGrid,
  StoreHomeHero,
  StoreSectionHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  STORE_FOOTER,
  STORE_HOME_COLLECTIONS,
  STORE_HOME_HERO,
  STORE_HOME_PRODUCT_CARD_COPY,
  STORE_HOME_PRODUCTS,
  STORE_HOME_SECTION_COPY,
  STORE_SITE_HEADER,
} from "../../store-content";
import { STORE_HOME_READ_COPY, STORE_HOME_READ_MS } from "./store-home-content";
import { LoadingTiles, ReadFailed } from "./store-home-states";

type ProductsRead = "ready" | "loading" | "failed" | "empty";

/**
 * The store home page as a store assembles it: `SiteHeader`, the home blocks,
 * a product row of `ProductCard` tiles, and `Footer`.
 *
 * Matches Figma frame `Store` (`4171:9023`). State and destinations live here,
 * not in the blocks. A section read in flight says so; a failed read offers
 * Retry; a product section the catalogue leaves empty is not drawn at all.
 */
function StoreHomePage({
  collections = "ready",
  products = "ready",
}: {
  /** The collections read; `loading` draws skeleton tiles under the heading. */
  collections?: "ready" | "loading";
  /** The merchandised read. `empty` draws no section, heading and all. */
  products?: ProductsRead;
}) {
  const [productsRead, setProductsRead] = useState<ProductsRead>(products);

  const retryProducts = () => {
    setProductsRead("loading");
    window.setTimeout(() => setProductsRead("ready"), STORE_HOME_READ_MS);
  };

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader {...STORE_SITE_HEADER} />
      <VStack className="w-full" gap="none">
        <VStack className="w-full px-8 pb-8" gap="none">
          <StoreHomeHero
            {...STORE_HOME_HERO}
            onAuctionClick={fn()}
            onShopClick={fn()}
          />
        </VStack>

        <VStack className="w-full px-8 py-16" gap="lg">
          <StoreSectionHeader
            browseAllHref="#collections"
            copy={STORE_HOME_SECTION_COPY.collections}
            title="Collections"
          />
          {collections === "loading" ? (
            <LoadingTiles
              className="grid grid-cols-7 gap-4"
              count={7}
              label={STORE_HOME_READ_COPY.collectionsLoading}
            />
          ) : (
            <StoreCollectionGrid collections={STORE_HOME_COLLECTIONS} />
          )}
        </VStack>

        {productsRead !== "empty" && (
          <VStack className="w-full px-8 py-16" gap="lg">
            <StoreSectionHeader
              browseAllHref="#products"
              copy={STORE_HOME_SECTION_COPY.products}
              title="Section Title"
            />
            {productsRead === "ready" && (
              <div className="grid grid-cols-5 gap-4">
                {STORE_HOME_PRODUCTS.map((product) => (
                  <ProductCard
                    copy={STORE_HOME_PRODUCT_CARD_COPY}
                    imageAlt={product.imageAlt}
                    imageSrc={product.imageSrc}
                    key={product.id}
                    name={product.name}
                    onClick={fn()}
                    originalPrice={product.originalPrice}
                    price={product.price}
                  />
                ))}
              </div>
            )}
            {productsRead === "loading" && (
              <LoadingTiles
                className="grid grid-cols-5 gap-4"
                count={5}
                label={STORE_HOME_READ_COPY.productsLoading}
              />
            )}
            {productsRead === "failed" && (
              <ReadFailed
                message={STORE_HOME_READ_COPY.productsFailed}
                onRetry={retryProducts}
                retryLabel={STORE_HOME_READ_COPY.retry}
              />
            )}
          </VStack>
        )}
      </VStack>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Store/Home/Screens/Store Home",
  component: StoreHomePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StoreHomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

const PRODUCT_NAME = "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)";

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Marketplace" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: "Collections" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: "Pokémon" })).toBeInTheDocument();
    expect(canvas.getAllByText(PRODUCT_NAME).length).toBe(5);
  },
};

/** The collections read is in flight: the heading stays, no empty grid shows. */
export const CollectionsLoading: Story = {
  args: { collections: "loading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Collections" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByText(STORE_HOME_READ_COPY.collectionsLoading),
    ).toBeInTheDocument();
    expect(canvas.queryByRole("link", { name: "Pokémon" })).toBeNull();
  },
};

/** The merchandised read is in flight: the row says it is loading, no cards. */
export const ProductsLoading: Story = {
  args: { products: "loading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(STORE_HOME_READ_COPY.productsLoading),
    ).toBeInTheDocument();
    expect(canvas.queryAllByText(PRODUCT_NAME).length).toBe(0);
  },
};

/** The read failed: the row says so and offers Retry, which reads again. */
export const ProductsFailed: Story = {
  args: { products: "failed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(STORE_HOME_READ_COPY.productsFailed),
    ).toBeInTheDocument();
    expect(canvas.queryAllByText(PRODUCT_NAME).length).toBe(0);

    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    expect(
      canvas.getByText(STORE_HOME_READ_COPY.productsLoading),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(canvas.getAllByText(PRODUCT_NAME).length).toBe(5),
    );
  },
};

/** The catalogue lists no products: the section is absent, heading and all. */
export const ProductsEmpty: Story = {
  args: { products: "empty" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Collections" }),
    ).toBeInTheDocument();
    expect(
      canvas.queryByRole("heading", { name: "Section Title" }),
    ).not.toBeInTheDocument();
    expect(canvas.queryAllByText(PRODUCT_NAME).length).toBe(0);
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
