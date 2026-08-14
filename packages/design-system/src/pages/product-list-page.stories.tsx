import { BreadcrumbItem } from "@grade10/design-system/components/display/breadcrumb-item";
import { BreadcrumbSeparator } from "@grade10/design-system/components/display/breadcrumb-separator";
import { Breadcrumbs } from "@grade10/design-system/components/display/breadcrumbs";
import {
  Pagination,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@grade10/design-system/components/display/pagination";
import { ProductCard } from "@grade10/design-system/components/display/product-card";
import { Button } from "@grade10/design-system/components/forms/button";
import { CheckboxList } from "@grade10/design-system/components/forms/checkbox-list";
import { CheckboxListInput } from "@grade10/design-system/components/forms/checkbox-list-input";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { StoreHeader } from "@grade10/design-system/components/layout/store-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@grade10/design-system/components/overlays/dropdown-menu";
import { CaretDown } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const IMAGE = new URL(
  "../components/display/product-card.fixture.png",
  import.meta.url,
).href;

const SORT_OPTIONS = [
  "Popularity",
  "Latest deal",
  "Price drop",
  "Lowest price",
  "Highest price",
] as const;

const PRODUCTS = [
  { id: "1", addedToCart: true, quantity: 3 },
  { id: "2" },
  { id: "3" },
  { id: "4" },
  { id: "5" },
  { id: "6" },
  { id: "7" },
  { id: "8", soldOut: true },
] as const;

function ProductListPage() {
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>("Popularity");
  const [quantities, setQuantities] = useState<Record<string, number>>({
    "1": 3,
  });

  return (
    <div className="min-w-[1440px] bg-background">
      <StoreHeader />
      <div className="flex flex-col gap-2 px-10 pt-12 pb-8">
        <Breadcrumbs>
          <BreadcrumbItem href="#home">Home</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem href="#shop">Shop</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem current>Pokémon</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold text-foreground">Pokémon</h1>
          <p className="text-sm text-secondary-foreground">
            Japanese Pokémon sealed product for set builders, collectors, and
            opening nights.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-8 overflow-hidden p-10">
        <aside className="sticky top-0 flex w-[260px] shrink-0 flex-col gap-6 rounded-(--radius-xl) border border-border bg-card p-4">
          <CheckboxList label="Product Type">
            <CheckboxListInput count="19" defaultChecked size="sm" value="box">
              Box
            </CheckboxListInput>
            <CheckboxListInput count="19" size="sm" value="pack">
              Pack
            </CheckboxListInput>
          </CheckboxList>
          <CheckboxList label="Collection">
            {(
              [
                "Pokémon",
                "Dragon Ball",
                "One Piece",
                "Disney",
                "NBA",
                "MLB",
                "Formula 1",
              ] as const
            ).map((name) => (
              <CheckboxListInput
                count="38"
                defaultChecked={name === "Pokémon"}
                key={name}
                size="sm"
                value={name}
              >
                {name}
              </CheckboxListInput>
            ))}
          </CheckboxList>
          <CheckboxList label="Sets">
            <CheckboxListInput count="19" defaultChecked size="sm" value="m4">
              M4
            </CheckboxListInput>
            <CheckboxListInput count="19" size="sm" value="m10">
              M10
            </CheckboxListInput>
          </CheckboxList>
          <CheckboxList label="Availability">
            <CheckboxListInput
              count="38"
              defaultChecked
              size="sm"
              value="in-stock"
            >
              In stock
            </CheckboxListInput>
            <CheckboxListInput count="10" size="sm" value="low-stock">
              Low stock
            </CheckboxListInput>
            <CheckboxListInput count="10" size="sm" value="pre-order">
              Pre-order
            </CheckboxListInput>
          </CheckboxList>
          <p className="w-full text-sm text-secondary-foreground">
            Price: HK$0 - HK$2,000
          </p>
        </aside>
        <div className="flex w-[1052px] flex-col gap-6">
          <div className="flex items-center justify-between border-b border-border py-2">
            <p className="text-base font-medium text-foreground">38 products</p>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    size="sm"
                    trailing={<CaretDown aria-hidden size={14} />}
                    variant="ghost"
                  />
                }
              >
                Sort by {sort.toLowerCase()}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[158px]">
                {SORT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setSort(option)}
                    selected={option === sort}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-6">
            {PRODUCTS.map((product) => (
              <ProductCard
                addedToCart={
                  "addedToCart" in product
                    ? product.addedToCart
                    : (quantities[product.id] ?? 0) > 0
                }
                category="POKÉMON"
                description="M4, Japanese"
                discountLabel="−15%"
                imageAlt="Ninja Spinner booster box"
                imageSrc={IMAGE}
                key={product.id}
                name="Ninja Spinner"
                onAction={() =>
                  setQuantities((prev) => ({ ...prev, [product.id]: 1 }))
                }
                onQuantityChange={(value) =>
                  setQuantities((prev) => ({ ...prev, [product.id]: value }))
                }
                originalPrice="HKD 123"
                price="HKD 105"
                quantity={quantities[product.id] ?? 1}
                soldOut={"soldOut" in product ? product.soldOut : false}
              />
            ))}
          </div>
          <Pagination className="w-full">
            <PaginationPrevious />
            <PaginationLink>1</PaginationLink>
            <PaginationLink isActive>2</PaginationLink>
            <PaginationLink>3</PaginationLink>
            <PaginationEllipsis />
            <PaginationLink>10</PaginationLink>
            <PaginationNext />
          </Pagination>
        </div>
      </div>
      <Footer />
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
