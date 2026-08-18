import { Footer } from "@grade10/design-system/components/layout/footer";
import { Nav } from "@grade10/design-system/components/layout/nav";
import { type FilterSelection, ProductBrowse } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  CHIP_FILTERS,
  FILTER_GROUPS,
  INITIAL_SELECTION,
  PAGINATION_LABELS,
  PRODUCTS,
  SELECT_FILTERS,
  SORT_OPTIONS,
  STORE_FOOTER,
  STORE_NAV,
} from "./store-content";

/**
 * The product listing page as a store assembles it: `Nav`, the shared
 * `ProductBrowse` compound, and `Footer`.
 *
 * The state loop lives here rather than in the component, which is the
 * contract: the surface renders a selection and reports a change, and this
 * page decides what the new selection is. A real store would refetch on each
 * change; this workbench only re-renders.
 */
function ProductListPage() {
  const [selection, setSelection] =
    useState<FilterSelection>(INITIAL_SELECTION);
  const [sort, setSort] = useState("popular");
  const [series, setSeries] = useState("all");
  const [page, setPage] = useState(2);
  const [cart, setCart] = useState<Record<string, number>>({ "1": 3 });

  return (
    <div className="bg-background">
      <Nav {...STORE_NAV} />
      <ProductBrowse
        {...PAGINATION_LABELS}
        filterPanelLabel="Filters"
        filters={{ status: "ready", data: FILTER_GROUPS }}
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
          setCart((previous) => ({ ...previous, [productId]: 1 }))
        }
        onProductQuantityChange={(productId, quantity) =>
          setCart((previous) => ({ ...previous, [productId]: quantity }))
        }
        onSelectFilterChange={(_groupId, optionId) => setSeries(optionId)}
        onSortChange={setSort}
        page={page}
        pageCount={10}
        resultCount="38"
        results={{
          status: "ready",
          data: PRODUCTS.map((product) => ({
            ...product,
            addedToCart: (cart[product.id] ?? 0) > 0,
            quantity: cart[product.id] ?? 1,
          })),
        }}
        resultsLabel="Products"
        selectFilters={SELECT_FILTERS}
        selectFilterValues={{ series }}
        selection={selection}
        sortOptions={SORT_OPTIONS}
        sortValue={sort}
        title="Pokémon"
        chipFilters={CHIP_FILTERS}
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
