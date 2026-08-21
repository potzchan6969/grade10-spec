import { Footer } from "@grade10/design-system/components/layout/footer";
import { Nav } from "@grade10/design-system/components/layout/nav";
import { type FilterSelection, ProductBrowse } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";
import {
  appliedFiltersFromSelection,
  FILTER_GROUPS,
  INITIAL_SELECTION,
  PRODUCTS,
  SORT_OPTIONS,
  STORE_FOOTER,
  STORE_NAV,
  sortTriggerLabel,
  UTILITY_LINKS,
} from "./store-content";

const RESULTS_LOAD_MS = 450;
const PAGE_SIZE = 10;
const TOTAL_PRODUCTS = 100;

/**
 * The product listing page as a store assembles it: `Nav`, the shared
 * `ProductBrowse` compound, and `Footer`.
 *
 * The state loop lives here rather than in the component, which is the
 * contract: the surface renders a selection and reports a change, and this
 * page decides what the new selection is. A real store would refetch on each
 * change; this workbench simulates that fetch with a short loading beat.
 */
function ProductListPage() {
  const [selection, setSelection] =
    useState<FilterSelection>(INITIAL_SELECTION);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({ "1": 3 });
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
          ariaLabel: `Pokémon TCG Sealed Booster Box – Abyss Eye (M5), item ${index + 1}`,
        };
      }),
    [],
  );

  const productData = useMemo(
    () =>
      productCatalog.slice(0, visibleCount).map((product) => ({
        ...product,
        addedToCart: (cart[product.id] ?? 0) > 0,
        quantity: cart[product.id] ?? 1,
      })),
    [cart, productCatalog, visibleCount],
  );

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
      <Nav {...STORE_NAV} />
      <ProductBrowse
        appliedFilters={appliedFilters}
        clearFiltersLabel="Clear filters"
        filterPanelLabel="Store filters"
        groups={{ status: "ready", data: FILTER_GROUPS }}
        hasMore={visibleCount < TOTAL_PRODUCTS}
        heading="Filter"
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
        resultsLabel="Products"
        searchLabel="Search products"
        searchPlaceholder="Find product"
        searchValue={search}
        selection={selection}
        sortOptions={SORT_OPTIONS}
        sortTriggerLabel={sortTriggerLabel(sort)}
        sortValue={sort}
        utilityLinks={UTILITY_LINKS}
      />
      <Footer {...STORE_FOOTER} />
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
