import { Footer } from "@grade10/design-system/components/layout/footer";
import { Badge } from "@grade10/design-system/components/display/badge";
import {
  CartDrawer,
  type CartItemSummary,
  type FilterGroup,
  type FilterSelection,
  ProductBrowse,
  type PromoState,
  type SearchSuggestion,
  type SearchSuggestionGroup,
  SiteHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { createElement, useEffect, useMemo, useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  appliedFiltersFromSelection,
  FILTER_GROUPS,
  FILTER_GROUPS_EXPANDED,
  INITIAL_SELECTION,
  PRODUCTS,
  SORT_OPTIONS,
  STORE_CART_COPY,
  STORE_FOOTER,
  STORE_SITE_HEADER,
  sortTriggerLabel,
  UTILITY_LINKS,
} from "./store-content";
import { navigateToStory } from "./workbench-story-nav";

/** Storybook story id for the Product Detail page assembly. */
const PRODUCT_DETAIL_STORY_ID = "pages-product-detail-page--default";

const RESULTS_LOAD_MS = 450;
const PAGE_SIZE = 10;
const TOTAL_PRODUCTS = 100;
const CART_FETCH_MS = 400;
const SUGGESTION_MIN_CHARS = 2;
const SUGGESTION_CAP = 5;

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

function suggestionsForDraft(
  draft: string,
  catalog: readonly {
    id: string;
    name: string;
    imageSrc?: string;
    imageAlt?: string;
  }[],
): SearchSuggestionGroup[] | undefined {
  const query = draft.trim().toLowerCase();
  if (query.length < SUGGESTION_MIN_CHARS) {
    return undefined;
  }

  const products: SearchSuggestion[] = catalog
    .filter((product) => product.name.toLowerCase().includes(query))
    .slice(0, SUGGESTION_CAP)
    .map((product) => ({
      id: product.id,
      label: product.name,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
    }));

  const filters: SearchSuggestion[] = [];
  for (const group of FILTER_GROUPS) {
    for (const option of group.options) {
      if (String(option.label).toLowerCase().includes(query)) {
        filters.push({
          id: `${group.id}:${option.id}`,
          label: option.label,
          trailing: createElement(
            Badge,
            { size: "sm", variant: "outline" },
            group.id === "worlds" ? "World" : "Type",
          ),
        });
      }
      if (filters.length >= SUGGESTION_CAP) break;
    }
    if (filters.length >= SUGGESTION_CAP) break;
  }

  const groups: SearchSuggestionGroup[] = [];
  if (products.length > 0) {
    groups.push({ id: "products", label: "Products", suggestions: products });
  }
  if (filters.length > 0) {
    groups.push({ id: "filters", label: "Filters", suggestions: filters });
  }
  return groups.length > 0 ? groups : [];
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
 * workbench stub (consumer-owned in a real store). Header is `SiteHeader`.
 */
function ProductListPage() {
  const [selection, setSelection] =
    useState<FilterSelection>(INITIAL_SELECTION);
  const [filterGroups, setFilterGroups] =
    useState<readonly FilterGroup[]>(FILTER_GROUPS);
  const [searchDraft, setSearchDraft] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [sort, setSort] = useState("new");
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

  const searchSuggestions = useMemo(
    () => suggestionsForDraft(searchDraft, productCatalog),
    [productCatalog, searchDraft],
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

  const appliedFilters = useMemo(() => {
    const facetChips = appliedFiltersFromSelection(filterGroups, selection);
    if (committedSearch.length === 0) {
      return facetChips;
    }
    return [
      {
        groupId: "search",
        optionId: committedSearch,
        label: `Search: "${committedSearch}"`,
      },
      ...facetChips,
    ];
  }, [committedSearch, filterGroups, selection]);

  useEffect(() => {
    void committedSearch;
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
  }, [committedSearch, sort, selection]);

  const handleFilterChange = (
    groupId: string,
    optionId: string,
    selected: boolean,
  ) => {
    if (groupId === "search") {
      if (!selected) {
        setCommittedSearch("");
      }
      return;
    }

    setSelection((previous) => {
      const current = previous[groupId] ?? [];
      if (selected && current.includes(optionId)) {
        return previous;
      }
      return {
        ...previous,
        [groupId]: selected
          ? [...current, optionId]
          : current.filter((id) => id !== optionId),
      };
    });
  };

  const handleSearchSuggestionSelect = (
    suggestion: SearchSuggestion,
    groupId: string,
  ) => {
    setSearchDraft("");
    if (groupId === "filters") {
      const [facetGroup, facetOption] = String(suggestion.id).split(":");
      if (facetGroup && facetOption) {
        handleFilterChange(facetGroup, facetOption, true);
      }
      return;
    }
    if (groupId === "products") {
      // Workbench stub for opening a product — a store would route to the PDP.
      window.location.hash = `product-${suggestion.id}`;
    }
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
      <SiteHeader
        {...STORE_SITE_HEADER}
        promo={null}
        onCartClick={() => setCartOpen(true)}
      />
      <ProductBrowse
        appliedFilters={appliedFilters}
        copy={{
          filterPanel: {
            label: "Store filters",
            heading: "Filter",
            searchPlaceholder: "Find product",
            searchLabel: "Search products",
            drawerClear: "Clear",
            showResults: "Show Results",
          },
          listHeader: {
            sortTrigger: sortTriggerLabel(sort),
            clearFilters: "Clear filters",
          },
          results: {
            label: "Products",
            card: {
              cart: "Add to cart",
              decreaseQuantity: "Decrease quantity",
              increaseQuantity: "Increase quantity",
              removeFromCart: "Remove from cart",
              adjustQuantity: "Adjust cart quantity",
              soldOut: "SOLD OUT",
              sale: "SALE",
            },
          },
        }}
        groups={{ status: "ready", data: filterGroups }}
        hasMore={visibleCount < TOTAL_PRODUCTS}
        loadingMore={loadingMore}
        onClearFilters={() => {
          setSelection({});
          setCommittedSearch("");
        }}
        onFilterChange={handleFilterChange}
        onGroupExpand={(groupId) => {
          if (groupId === "worlds") {
            setFilterGroups(FILTER_GROUPS_EXPANDED);
          }
        }}
        onGroupCollapse={(groupId) => {
          if (groupId === "worlds") {
            setFilterGroups(FILTER_GROUPS);
          }
        }}
        onLoadMore={handleLoadMore}
        onProductClick={() => navigateToStory(PRODUCT_DETAIL_STORY_ID)}
        onProductCartQuantityChange={(productId, quantity) =>
          setCart((previous) => {
            if (quantity <= 0) {
              const next = { ...previous };
              delete next[productId];
              return next;
            }
            return { ...previous, [productId]: quantity };
          })
        }
        onSearchChange={setSearchDraft}
        onSearchClear={() => setSearchDraft("")}
        onSearchCommit={(value) => {
          setCommittedSearch(value);
          setSearchDraft("");
        }}
        onSearchSuggestionSelect={handleSearchSuggestionSelect}
        onSortChange={setSort}
        resultCount="100 Products"
        results={
          resultsStatus === "loading"
            ? { status: "loading" }
            : { status: "ready", data: productData }
        }
        searchSuggestions={searchSuggestions}
        searchValue={searchDraft}
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
        shippingEstimate="Calculated at checkout"
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

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const field = canvas.getByRole("combobox", { name: "Search products" });
    await userEvent.type(field, "abyss");
    const popup = within(document.body);
    expect(await popup.findByRole("listbox")).toBeInTheDocument();
    expect(popup.getByText("Products")).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect(
      canvas.getByRole("button", { name: 'Search: "abyss"' }),
    ).toBeInTheDocument();
  },
};

export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};
