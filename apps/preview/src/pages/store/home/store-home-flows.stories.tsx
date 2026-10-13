import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  ProductCard,
  type ProductSummary,
  SiteHeader,
  StoreCollectionGrid,
  StoreHomeHero,
  StoreSectionHeader,
} from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { FlowContainer } from "../../../../../../packages/ui/src/blocks/shared/flow-container";
import {
  STORE_HOME_COLLECTIONS,
  STORE_HOME_HERO,
  STORE_HOME_PRODUCT_CARD_COPY,
  STORE_HOME_PRODUCTS,
  STORE_HOME_SECTION_COPY,
  STORE_SITE_HEADER,
} from "../../store-content";
import {
  STORE_HOME_READ_COPY,
  STORE_HOME_READ_MS,
  STORE_HOME_SOLD_OUT,
} from "./store-home-content";
import { LoadingTiles, ReadFailed } from "./store-home-states";

const PRODUCT_NAME = "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)";

const meta = {
  title: "Store/Home/Flows/Front Door",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** A row of product tiles, each opening its own page and none selling. */
function ProductRow({
  cards,
  copy = STORE_HOME_PRODUCT_CARD_COPY,
  columns = 2,
}: {
  cards: readonly ProductSummary[];
  copy?: typeof STORE_HOME_PRODUCT_CARD_COPY & { soldOut?: string };
  columns?: number;
}) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {cards.map((card) => (
        <ProductCard
          copy={copy}
          imageAlt={card.imageAlt}
          imageSrc={card.imageSrc}
          key={`${card.id}-${card.soldOut ? "sold" : "on-sale"}`}
          name={card.name}
          onClick={fn()}
          originalPrice={card.originalPrice}
          price={card.price}
          soldOut={card.soldOut}
        />
      ))}
    </div>
  );
}

const ENTER_CASES: [string, "hero" | "collections" | "products"][] = [
  ["Front door hero", "hero"],
  ["Collection tiles", "collections"],
  ["Merchandised row", "products"],
];

function EnterStep({ step }: { step: "hero" | "collections" | "products" }) {
  if (step === "hero") {
    return (
      <StoreHomeHero
        {...STORE_HOME_HERO}
        onAuctionClick={fn()}
        onShopClick={fn()}
      />
    );
  }
  if (step === "collections") {
    return (
      <VStack gap="lg">
        <StoreSectionHeader
          browseAllHref="#collections"
          copy={STORE_HOME_SECTION_COPY.collections}
          title="Collections"
        />
        <StoreCollectionGrid collections={STORE_HOME_COLLECTIONS} />
      </VStack>
    );
  }
  return (
    <VStack gap="lg">
      <StoreSectionHeader
        browseAllHref="#products"
        copy={STORE_HOME_SECTION_COPY.products}
        title="Section Title"
      />
      <ProductRow cards={STORE_HOME_PRODUCTS.slice(0, 3)} columns={3} />
    </VStack>
  );
}

/** The products row while its read runs: loading, failed with Retry, or ready. */
function ProductsReadCase({ start }: { start: "failed" | "ready" }) {
  const [read, setRead] = useState<"loading" | "failed" | "ready">(start);

  const retry = () => {
    setRead("loading");
    window.setTimeout(() => setRead("ready"), STORE_HOME_READ_MS);
  };

  return (
    <VStack gap="lg">
      <StoreSectionHeader
        browseAllHref="#products"
        copy={STORE_HOME_SECTION_COPY.products}
        title="Section Title"
      />
      {read === "ready" && (
        <ProductRow cards={STORE_HOME_PRODUCTS.slice(0, 3)} columns={3} />
      )}
      {read === "loading" && (
        <LoadingTiles
          className="grid grid-cols-3 gap-4"
          count={3}
          label={STORE_HOME_READ_COPY.productsLoading}
        />
      )}
      {read === "failed" && (
        <ReadFailed
          message={STORE_HOME_READ_COPY.productsFailed}
          onRetry={retry}
          retryLabel={STORE_HOME_READ_COPY.retry}
        />
      )}
    </VStack>
  );
}

const LAG_CASES: [
  string,
  "collections" | "products-failed" | "products-ready",
][] = [
  ["Collections loading", "collections"],
  ["Products failed", "products-failed"],
  ["Products read again", "products-ready"],
];

function LagStep({
  step,
}: {
  step: "collections" | "products-failed" | "products-ready";
}) {
  if (step === "collections") {
    return (
      <VStack gap="lg">
        <StoreSectionHeader
          browseAllHref="#collections"
          copy={STORE_HOME_SECTION_COPY.collections}
          title="Collections"
        />
        <LoadingTiles
          className="grid grid-cols-4 gap-4"
          count={4}
          label={STORE_HOME_READ_COPY.collectionsLoading}
        />
      </VStack>
    );
  }
  return (
    <ProductsReadCase start={step === "products-failed" ? "failed" : "ready"} />
  );
}

const CHROME_CASES: [string, "chrome" | "front-door"][] = [
  ["Store marked in the chrome", "chrome"],
  ["Store leads to the front door", "front-door"],
];

const STANDING_CASES: [string, "sold-out" | "marked-down" | "full-price"][] = [
  ["Sold out card", "sold-out"],
  ["Marked down card", "marked-down"],
  ["Full price card", "full-price"],
];

const STANDING_CARD = STORE_HOME_PRODUCTS[0];

function StandingStep({
  step,
}: {
  step: "sold-out" | "marked-down" | "full-price";
}) {
  const card: ProductSummary =
    step === "sold-out"
      ? { ...STANDING_CARD, soldOut: true, originalPrice: undefined }
      : step === "marked-down"
        ? { ...STANDING_CARD, originalPrice: "HK$123", soldOut: false }
        : { ...STANDING_CARD, originalPrice: undefined, soldOut: false };
  return (
    <ProductRow
      cards={[card]}
      columns={1}
      copy={{ ...STORE_HOME_PRODUCT_CARD_COPY, soldOut: STORE_HOME_SOLD_OUT }}
    />
  );
}

/** Collector arrives, enters the catalogue through a collection, and browses. */
export const EnterTheCatalogue: Story = {
  parameters: {
    journeys: [
      "grade10-site-store-home-US-01",
      "grade10-site-store-home-US-02",
      "grade10-site-store-home-US-03",
    ],
  },
  render: () => (
    <FlowContainer
      cases={ENTER_CASES}
      description={
        <p>
          The hero and its two ways on are on screen before the catalogue
          answers. A collection opens the catalogue, and the merchandised row
          opens each card&rsquo;s own page. No card in the row offers a way into
          the cart.
        </p>
      }
    >
      {(step) => <EnterStep step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Marketplace" })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("link", { name: /Pokémon/ })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(PRODUCT_NAME).length).toBe(3);
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      ENTER_CASES.length,
    );
  },
};

/** The catalogue lags: each section says it is loading, or failed and retries. */
export const KeepBrowsingWhileTheCatalogueLags: Story = {
  parameters: {
    journeys: ["grade10-site-store-home-US-04"],
  },
  render: () => (
    <FlowContainer
      cases={LAG_CASES}
      description={
        <p>
          A section whose read is in flight says it is loading and shows no
          empty grid or row. A failed read says so and offers Retry, which reads
          again without a page load.
        </p>
      }
    >
      {(step) => <LagStep step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText(STORE_HOME_READ_COPY.collectionsLoading),
    ).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText(STORE_HOME_READ_COPY.productsFailed)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await waitFor(() =>
      expect(canvas.getAllByText(PRODUCT_NAME).length).toBe(3),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getAllByText(PRODUCT_NAME).length).toBe(3);
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      LAG_CASES.length,
    );
  },
};

/** The chrome marks the store on the front door and on the way into the catalogue. */
export const MoveAroundFromTheChrome: Story = {
  parameters: {
    journeys: ["grade10-site-store-home-US-05"],
  },
  render: () => (
    <FlowContainer
      cases={CHROME_CASES}
      description={
        <p>
          The chrome marks the store as the surface being viewed, on the front
          door and on the listing alike. Its Store link opens the front door.
        </p>
      }
    >
      {(step) =>
        step === "chrome" ? (
          <SiteHeader {...STORE_SITE_HEADER} promo={null} />
        ) : (
          <StoreHomeHero
            {...STORE_HOME_HERO}
            onAuctionClick={fn()}
            onShopClick={fn()}
          />
        )
      }
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole("button", { name: "Menu" }));
    expect(await body.findByRole("link", { name: "Store" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByRole("heading", { name: "Marketplace" })).toBeVisible();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      CHROME_CASES.length,
    );
  },
};

/** A card says whether it is sold out and whether it is marked down. */
export const ReadACardsStanding: Story = {
  parameters: {
    journeys: ["grade10-site-store-home-US-06"],
  },
  render: () => (
    <FlowContainer
      cases={STANDING_CASES}
      description={
        <p>
          A sold-out card says so in place of the sale badge and still opens its
          page. A marked-down card shows its crossed-out price and the sale
          badge before the collector opens it.
        </p>
      }
    >
      {(step) => <StandingStep step={step} />}
    </FlowContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(STORE_HOME_SOLD_OUT)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.getByText("SALE")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));
    expect(canvas.queryByText("SALE")).toBeNull();
    await userEvent.click(canvas.getByRole("tab", { name: "Expanded" }));
    expect(canvasElement.querySelectorAll(".demo-flow-case")).toHaveLength(
      STANDING_CASES.length,
    );
  },
};
