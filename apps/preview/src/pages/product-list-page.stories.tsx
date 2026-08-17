import { BreadcrumbItem } from "@grade10/design-system/components/display/breadcrumb-item";
import { BreadcrumbSeparator } from "@grade10/design-system/components/display/breadcrumb-separator";
import { Breadcrumbs } from "@grade10/design-system/components/display/breadcrumbs";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { StoreHeader } from "@grade10/design-system/components/layout/store-header";
import type { FilterSelection } from "@grade10/ui";
import { ProductListing } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  FILTER_GROUPS,
  INITIAL_SELECTION,
  PAGINATION_LABELS,
  PRODUCTS,
  SORT_OPTIONS,
  STORE_FOOTER,
  STORE_HEADER,
} from "./store-content";

/**
 * The product listing page as a store assembles it: design-system chrome, an
 * app-owned header block, and the shared `ProductListing` compound component.
 *
 * The state loop lives here rather than in the component, which is the
 * contract: the surface renders a selection and reports a change, and this
 * page decides what the new selection is. A real store would refetch on each
 * change; this workbench only re-renders.
 */
function ProductListPage() {
  const [selection, setSelection] =
    useState<FilterSelection>(INITIAL_SELECTION);
  const [sort, setSort] = useState("popularity");
  const [page, setPage] = useState(2);
  const [cart, setCart] = useState<Record<string, number>>({ "1": 3 });

  const sortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label;

  return (
    <div className="bg-background">
      <StoreHeader {...STORE_HEADER} />
      <ProductListing
        {...PAGINATION_LABELS}
        filterPanelLabel="Filters"
        filterSummary="Price: HK$0 - HK$2,000"
        filters={{ status: "ready", data: FILTER_GROUPS }}
        header={
          <div className="flex flex-col gap-2 px-10 pt-12 pb-8">
            <Breadcrumbs>
              <BreadcrumbItem href="#home">Home</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem href="#shop">Shop</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem current>Pokémon</BreadcrumbItem>
            </Breadcrumbs>
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-5xl text-foreground">Pokémon</h1>
              <p className="text-secondary-foreground text-sm">
                Japanese Pokémon sealed product for set builders, collectors,
                and opening nights.
              </p>
            </div>
          </div>
        }
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
        onSortChange={setSort}
        page={page}
        pageCount={10}
        resultCount="38 products"
        results={{
          status: "ready",
          data: PRODUCTS.map((product) => ({
            ...product,
            addedToCart: (cart[product.id] ?? 0) > 0,
            quantity: cart[product.id] ?? 1,
          })),
        }}
        resultsLabel="Products"
        selection={selection}
        sortOptions={SORT_OPTIONS}
        sortTriggerLabel={`Sort by ${String(sortLabel).toLowerCase()}`}
        sortValue={sort}
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
