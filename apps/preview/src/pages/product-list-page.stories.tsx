import { Footer } from "@grade10/design-system/components/layout/footer";
import { Nav } from "@grade10/design-system/components/layout/nav";
import {
  CartDrawer,
  type CartItemSummary,
  type FilterSelection,
  ProductBrowse,
  type PromoState,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";
import {
  appliedFiltersFromSelection,
  FILTER_GROUPS,
  INITIAL_SELECTION,
  PRODUCTS,
  SORT_OPTIONS,
  STORE_CART_COPY,
  STORE_FOOTER,
  STORE_NAV,
  sortTriggerLabel,
  UTILITY_LINKS,
} from "./store-content";

const RESULTS_LOAD_MS = 450;
const PAGE_SIZE = 10;
const TOTAL_PRODUCTS = 100;
const CART_FETCH_MS = 400;

/** Parse a display price like `HK$105` or `HK$24,500.00` into a number. */
function parseDisplayAmount(value: unknown): number {
  if (typeof value !== "string") {
    return 0;
  }
  const match = value.replace(/,/g, "").match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
}

function formatHkd(amount: number): string {
  return `HK$${amount.toLocaleString("en-HK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * The product listing page as a store assembles it: `Nav`, the shared
 * `ProductBrowse` compound, `CartDrawer`, and `Footer`.
 *
 * The state loop lives here rather than in the component, which is the
 * contract: the surface renders a selection and reports a change, and this
 * page decides what the new selection is. A real store would refetch on each
 * change; this workbench simulates that fetch with a short loading beat.
 *
 * The nav cart button opens the shared drawer; checkout redirect stays a
 * workbench stub (consumer-owned in a real store).
 */
function ProductListPage() {
  const [selection, setSelection] =
    useState<FilterSelection>(INITIAL_SELECTION);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({ "1": 3 });
  const [cartOpen, setCartOpen] = useState(false);
  const [promoState, setPromoState] = useState<PromoState>({
    status: "collapsed",
  });
  const [resultsStatus, setResultsStatus] = useState<"loading" | "ready">(
    "loading",
  );

  const productCatalog = useMemo(
    () =>
      Array.from({ length: TOTAL_PRODUCTS }, (_, index) => {
        const template = PRODUCTS[index % PRODUCTS.length];
        return {
          ...template,
          id: String(index + 1),
          name: `Pokémon TCG Sealed Booster Box – Abyss Eye (M5), item ${index + 1}`,
        };
      }),
    [],
  );

  const productData = useMemo(
    () =>
      productCatalog.slice(0, visibleCount).map((product) => {
        const cartCount = cart[product.id] ?? 0;
        return {
          ...product,
          inCart: cartCount > 0,
          cartCount: cartCount > 0 ? String(cartCount) : undefined,
        };
      }),
    [cart, productCatalog, visibleCount],
  );

  const cartItems = useMemo((): CartItemSummary[] => {
    return Object.entries(cart)
      .filter(([, quantity]) => quantity > 0)
      .flatMap(([id, quantity]) => {
        const product = productCatalog.find((item) => item.id === id);
        if (!product) {
          return [];
        }
        const item: CartItemSummary = {
          id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          imageSrc: product.imageSrc,
          imageAlt: product.imageAlt,
          quantity,
          status: product.soldOut ? "soldOut" : "default",
        };
        return [item];
      });
  }, [cart, productCatalog]);

  const cartTotal = useMemo(() => {
    const amount = cartItems.reduce((sum, item) => {
      if (item.status === "soldOut") {
        return sum;
      }
      return sum + parseDisplayAmount(item.price) * item.quantity;
    }, 0);
    return formatHkd(amount);
  }, [cartItems]);

  const appliedFilters = useMemo(
    () => appliedFiltersFromSelection(FILTER_GROUPS, selection),
    [selection],
  );

  useEffect(() => {
    void search;
    void sort;
    void selection;
    setVisibleCount(PAGE_SIZE);
    setLoadingMore(false);
    setResultsStatus("loading");
    const timeout = setTimeout(
      () => setResultsStatus("ready"),
      RESULTS_LOAD_MS,
    );
    return () => clearTimeout(timeout);
  }, [search, sort, selection]);

  const handleFilterChange = (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => {
    setSelection((previous) => {
      const current = previous[groupId] ?? [];
      return {
        ...previous,
        [groupId]: selected
          ? [...current, optionId]
          : current.filter((id) => id !== optionId),
      };
    });
  };

  const handleLoadMore = () => {
    if (loadingMore || visibleCount >= TOTAL_PRODUCTS) {
      return;
    }

    setLoadingMore(true);
    window.setTimeout(() => {
      setVisibleCount((previous) =>
        Math.min(previous + PAGE_SIZE, TOTAL_PRODUCTS),
      );
      setLoadingMore(false);
    }, RESULTS_LOAD_MS);
  };

  return (
    <div className="min-h-svh bg-white">
      <Nav {...STORE_NAV} promo={null} onCartClick={() => setCartOpen(true)} />
      <ProductBrowse
        appliedFilters={appliedFilters}
        copy={{
          filterPanel: {
            label: "Store filters",
            heading: "Filter",
            searchPlaceholder: "Find product",
            searchLabel: "Search products",
          },
          listHeader: {
            sortTrigger: sortTriggerLabel(sort),
            clearFilters: "Clear filters",
          },
          results: {
            label: "Products",
            card: { cart: "Add to cart", soldOut: "SOLD OUT", sale: "SALE" },
          },
        }}
        groups={{ status: "ready", data: FILTER_GROUPS }}
        hasMore={visibleCount < TOTAL_PRODUCTS}
        loadingMore={loadingMore}
        onClearFilters={() => setSelection({})}
        onFilterChange={handleFilterChange}
        onLoadMore={handleLoadMore}
        onProductAction={(productId) =>
          setCart((previous) => ({
            ...previous,
            [productId]: (previous[productId] ?? 0) + 1,
          }))
        }
        onSearchChange={setSearch}
        onSearchClear={() => setSearch("")}
        onSortChange={setSort}
        resultCount="100 Products"
        results={
          resultsStatus === "loading"
            ? { status: "loading" }
            : { status: "ready", data: productData }
        }
        searchValue={search}
        selection={selection}
        sortOptions={SORT_OPTIONS}
        sortValue={sort}
        utilityLinks={UTILITY_LINKS}
      />
      <Footer {...STORE_FOOTER} />
      <CartDrawer
        copy={STORE_CART_COPY}
        estimatedTotal={cartTotal}
        items={cartItems}
        onBrowseMore={() => setCartOpen(false)}
        onCheckout={async () => {
          await new Promise((resolve) => setTimeout(resolve, 800));
        }}
        onClose={() => setCartOpen(false)}
        onFetchStatusAndPrice={async () => {
          await new Promise((resolve) => setTimeout(resolve, CART_FETCH_MS));
        }}
        onPromoStateChange={setPromoState}
        onQuantityChange={(itemId, quantity) =>
          setCart((previous) => {
            if (quantity <= 0) {
              const next = { ...previous };
              delete next[itemId];
              return next;
            }
            return { ...previous, [itemId]: quantity };
          })
        }
        onRemoveItem={(itemId) =>
          setCart((previous) => {
            const next = { ...previous };
            delete next[itemId];
            return next;
          })
        }
        open={cartOpen}
        promoState={promoState}
        shippingEstimate="TBD"
        subtotal={cartTotal}
      />
    </div>
  );
}

const meta = {
  title: "Pages/Product List Page",
  component: ProductListPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProductListPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
