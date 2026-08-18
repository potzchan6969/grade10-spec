import { Footer } from "@grade10/design-system/components/layout/footer";
import { Nav } from "@grade10/design-system/components/layout/nav";
import { type FilterSelection, ProductBrowse } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useMemo, useState } from "react";
import {
  CHIP_FILTERS,
  COLLECTIONS,
  collectionLabel,
  INITIAL_SELECTION,
  PAGINATION_LABELS,
  PRODUCTS,
  SORT_OPTIONS,
  STORE_FOOTER,
  STORE_NAV,
  seriesFiltersForCollection,
  UTILITY_LINKS,
} from "./store-content";

const RESULTS_LOAD_MS = 450;

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
  const [activeCollection, setActiveCollection] = useState("pokemon");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [series, setSeries] = useState("all");
  const [page, setPage] = useState(2);
  const [cart, setCart] = useState<Record<string, number>>({ "1": 3 });
  const [resultsStatus, setResultsStatus] = useState<"loading" | "ready">(
    "loading",
  );

  const productData = useMemo(
    () =>
      PRODUCTS.map((product) => ({
        ...product,
        addedToCart: (cart[product.id] ?? 0) > 0,
        quantity: cart[product.id] ?? 1,
      })),
    [cart],
  );

  useEffect(() => {
    setResultsStatus("loading");
    const timeout = setTimeout(
      () => setResultsStatus("ready"),
      RESULTS_LOAD_MS,
    );
    return () => clearTimeout(timeout);
  }, [activeCollection]);

  const handleCollectionChange = (collectionId: string) => {
    setActiveCollection(collectionId);
    setSelection({});
    setSeries("all");
  };

  return (
    <div className="bg-background">
      <Nav {...STORE_NAV} />
      <ProductBrowse
        {...PAGINATION_LABELS}
        activeCollection={activeCollection}
        chipFilters={CHIP_FILTERS}
        collections={{ status: "ready", data: COLLECTIONS }}
        filterPanelLabel="Store navigation"
        onCollectionChange={handleCollectionChange}
        onFilterChange={(groupId, optionId, selected) =>
          setSelection((previous) => {
            const current = previous[groupId] ?? [];
            return {
              ...previous,
              [groupId]: selected
                ? [...current, optionId]
                : current.filter((id) => id !== optionId),
            };
          })
        }
        onPageChange={setPage}
        onProductAction={(productId) =>
          setCart((previous) => ({
            ...previous,
            [productId]: (previous[productId] ?? 0) + 1,
          }))
        }
        onSearchChange={setSearch}
        onSearchClear={() => setSearch("")}
        onSelectFilterChange={(_groupId, optionId) => setSeries(optionId)}
        onSortChange={setSort}
        page={page}
        pageCount={10}
        resultCount="38"
        results={
          resultsStatus === "loading"
            ? { status: "loading" }
            : { status: "ready", data: productData }
        }
        resultsLabel="Products"
        searchLabel="Search products"
        searchPlaceholder="Search..."
        searchValue={search}
        selectFilters={seriesFiltersForCollection(activeCollection)}
        selectFilterValues={{ series }}
        selection={selection}
        sortOptions={SORT_OPTIONS}
        sortValue={sort}
        title={collectionLabel(activeCollection, COLLECTIONS)}
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
