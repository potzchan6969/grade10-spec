import { Footer } from "@grade10/design-system/components/layout/footer";
import { Nav } from "@grade10/design-system/components/layout/nav";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  ProductCard,
  StoreCollectionGrid,
  StoreHomeHero,
  StoreSectionHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import {
  STORE_FOOTER,
  STORE_HOME_COLLECTIONS,
  STORE_HOME_HERO,
  STORE_HOME_PRODUCTS,
  STORE_HOME_PRODUCT_CARD_COPY,
  STORE_HOME_SECTION_COPY,
  STORE_NAV,
} from "./store-content";

/**
 * The store home page as a store assembles it: `Nav`, the home blocks,
 * a product row of `ProductCard` tiles, and `Footer`.
 *
 * Matches Figma frame `Store` (`4171:9023`). State and destinations live here,
 * not in the blocks.
 */
function StoreHomePage() {
  return (
    <div className="min-h-svh bg-background">
      <Nav {...STORE_NAV} />
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
          <StoreCollectionGrid collections={STORE_HOME_COLLECTIONS} />
        </VStack>

        <VStack className="w-full px-8 py-16" gap="lg">
          <StoreSectionHeader
            browseAllHref="#products"
            copy={STORE_HOME_SECTION_COPY.products}
            title="Section Title"
          />
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
        </VStack>
      </VStack>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Pages/Store Home Page",
  component: StoreHomePage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof StoreHomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Marketplace" }),
    ).toBeInTheDocument();
    expect(
      canvas.getByRole("heading", { name: "Collections" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /Pokémon/ })).toBeInTheDocument();
    expect(
      canvas.getAllByText("Pokémon TCG Sealed Booster Box – Abyss Eye (M5)")
        .length,
    ).toBe(5);
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
