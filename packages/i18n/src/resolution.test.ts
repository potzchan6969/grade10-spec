import { describe, expect, it } from "vitest";
import { brandCatalogs, sharedCatalogs } from "./catalogs.ts";
import type { Brand } from "./index.ts";
import { brands, getMessages, locales, localesOf } from "./index.ts";

type Tree = { [key: string]: string | Tree };

/* The layers are read here the way the package reads them — by brand and by
 * locale, from a table typed per brand — so a test that walks every one of
 * them says which layer it is looking at rather than which literal. */
const layers = (catalogs: unknown): Record<string, Tree> =>
  catalogs as Record<string, Tree>;

const flatten = (tree: Tree, prefix = ""): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((flat, [key, value]) => {
    if (typeof value === "object")
      Object.assign(flat, flatten(value, `${prefix}${key}.`));
    else flat[`${prefix}${key}`] = value;
    return flat;
  }, {});

const brandNames = Object.keys(brands) as Brand[];

/** Every key a brand can answer, from the shared and owned layers. */
const vocabularyFor = (brand: Brand) => {
  const sharedKeys = Object.values(layers(sharedCatalogs)).flatMap((catalog) =>
    Object.keys(flatten(catalog)),
  );
  const ownedKeys = Object.values(layers(brandCatalogs[brand])).flatMap(
    (catalog) => Object.keys(flatten(catalog)),
  );

  return [...new Set([...sharedKeys, ...ownedKeys])].sort();
};

const spoken = brandNames.flatMap((brand) =>
  localesOf(brand).map((locale) => ({ brand, locale })),
);

const PRODUCT_DETAIL_KEYS = [
  "aboutThisItem",
  "shippingAndPickup",
  "shippingCalculatedAtCheckout",
  "freePickupAt",
  "onlyLeft",
  "showMore",
  "showLess",
  "skuLabel",
  "quantityLabel",
  "increaseQuantity",
  "decreaseQuantity",
  "soldOutAction",
];

const STORE_PRODUCT_DETAIL_KEYS = ["adding", "addedToCart"];

/* What the listing's filter panel says for itself. A facet choice is named by
   the shop and travels with the catalogue; the group it sits in is not named
   there at all, and neither is the invitation that opens a capped one. */
const STORE_FILTER_KEYS = ["filterWorlds", "filterTypes", "seeAllWorlds"];

/* What a tile says about itself. The card draws each badge only where the
   word for it is supplied, so a missing one is a badge that never appears
   rather than an error. */
const STORE_CARD_KEYS = ["soldOut", "sale"];

/* The short names the panel's utility row draws, beside the full ones the
   footer's help column already carries — the way the legal bar already
   shortens its two. */
const FOOTER_UTILITY_KEYS = ["footer.help", "footer.shipping", "footer.orders"];

const ORDER_HISTORY_KEYS = [
  "title",
  "orderId",
  "activeHeading",
  "pastHeading",
  "empty.title",
  "empty.description",
  "empty.shopNow",
  "loading",
  "error",
  "retry",
  "pendingTotal",
  "placedOn",
  "total",
  "actions.viewDetails",
  "actions.trackOrder",
  "status.completed",
  "status.shipped",
  "status.processing",
  "status.pickup",
  "status.canceled",
  "status.refunded",
].sort();

const ORDER_DETAIL_KEYS = [
  "title",
  "orderId",
  "loading",
  "error",
  "retry",
  "notFound",
  "needHelp",
  "table.items",
  "table.subtotal",
  "table.quantity",
  "table.total",
  "sidebar.orderSummary",
  "sidebar.paymentMethod",
  "sidebar.shippingAddress",
  "sidebar.pickupAddress",
  "sidebar.loyaltyPointsToEarn",
  "sidebar.loyaltyPointsEarned",
  "money.subtotal",
  "money.paidTotal",
  "money.refund",
  "fulfilment.title",
  "fulfilment.orderPlaced",
  "fulfilment.shipped",
  "fulfilment.pickup",
  "fulfilment.completed",
  "fulfilment.estimate",
  "tracking.trackOrder",
  "status.completed",
  "status.shipped",
  "status.processing",
  "status.pickup",
  "status.canceled",
  "status.refunded",
].sort();

const CART_DRAWER_KEYS = [
  "header.title",
  "header.closeCartLabel",
  "item.lowStockWarning",
  "item.soldOutLabel",
  "item.removeItemLabel",
  "item.decreaseQtyLabel",
  "item.increaseQtyLabel",
  "footer.subtotalLabel",
  "footer.shippingLabel",
  "footer.shippingValue",
  "footer.estimatedTotalLabel",
  "footer.usePromoCode",
  "footer.selectOrEnterPromoCode",
  "footer.promoSheetTitle",
  "footer.promoSheetBackLabel",
  "footer.applyPromo",
  "footer.promoPlaceholder",
  "footer.removePromo",
  "footer.yourPromoCodes",
  "footer.notValidPromoCodes",
  "footer.noHeldPromoCodes",
  "footer.browseLoyaltyOffers",
  "footer.applyHeldPromo",
  "footer.usePoints",
  "footer.applyPoints",
  "footer.pointsPlaceholder",
  "footer.pointsUnit",
  "footer.useMaxPoints",
  "footer.pointsRateLabel",
  "footer.removePoints",
  "footer.pointsLabel",
  "footer.checkoutButton",
  "footer.checkoutRedirecting",
  "footer.checkoutFailed",
  "emptyTitle",
  "emptyDescription",
  "unavailableItemsRemoved",
  "unavailableItemsRemovedDescription",
].sort();

const AUCTION_BIDDING_HISTORY_KEYS = [
  "title",
  "active",
  "completed",
  "loading",
  "emptyActive",
  "emptyCompleted",
  "loadFailed",
  "retry",
  "loadMore",
  "historyLoading",
  "historyLoadFailed",
  "retryHistory",
  "events",
  "showHistory",
  "hideHistory",
  "openListing",
  "bidAgain",
  "latestActivity",
  "currentPrice",
  "finalPrice",
  "amount",
  "time",
  "you",
  "bidder",
  "manual",
  "automatic",
  "standing.pending",
  "standing.leading",
  "standing.outbid",
  "standing.won",
  "standing.lost",
  "standing.canceled",
  "standing.failed_only",
  "youWereOutbid",
  "bidRequested",
  "bidRefused",
  "acceptedPrice",
  "automaticMaximumConfigured",
  "automaticMaximumRaised",
  "standingChanged",
  "failure.window",
  "failure.minimum",
  "failure.account",
  "failure.payment",
  "failure.stale_price",
  "failure.unavailable",
].sort();

describe("what a brand and a language answer between them", () => {
  /* Scenario: The product detail surface has copy for its facts, fulfilment,
     disclosure, and purchase states in every language it serves. */
  it.each(spoken)(
    "resolves product detail copy for $brand in $locale",
    ({ brand, locale }) => {
      const product = getMessages(brand, locale).product;
      const store = getMessages(brand, locale).store;

      for (const key of PRODUCT_DETAIL_KEYS) {
        expect(product[key as keyof typeof product]).toEqual(
          expect.any(String),
        );
      }

      for (const key of STORE_PRODUCT_DETAIL_KEYS) {
        expect(store[key as keyof typeof store]).toEqual(expect.any(String));
      }
    },
  );

  /* Scenario: The listing's filter panel names its facet groups, its
     invitation and its utility row in every language it serves. */
  it.each(spoken)(
    "resolves listing filter copy for $brand in $locale",
    ({ brand, locale }) => {
      const store = getMessages(brand, locale).store;
      const chrome = flatten(getMessages(brand, locale).chrome);

      for (const key of [...STORE_FILTER_KEYS, ...STORE_CARD_KEYS]) {
        expect(store[key as keyof typeof store]).toEqual(expect.any(String));
      }

      for (const key of FOOTER_UTILITY_KEYS) {
        expect(chrome[key]).toEqual(expect.any(String));
      }
    },
  );

  it.each(localesOf("grade10"))(
    "resolves customer order copy for Grade10 in %s",
    (locale) => {
      const messages = getMessages("grade10", locale);

      expect(Object.keys(flatten(messages.orderHistory)).sort()).toEqual(
        ORDER_HISTORY_KEYS,
      );
      expect(Object.keys(flatten(messages.orderDetail)).sort()).toEqual(
        ORDER_DETAIL_KEYS,
      );

      for (const namespace of [messages.orderHistory, messages.orderDetail]) {
        for (const value of Object.values(flatten(namespace))) {
          expect(value).not.toBe("");
        }
      }
    },
  );

  it.each(localesOf("grade10"))(
    "resolves Cart Drawer copy for Grade10 in %s",
    (locale) => {
      const messages = getMessages("grade10", locale);
      const cartDrawer = (
        messages.store as typeof messages.store & { cartDrawer?: Tree }
      ).cartDrawer;

      expect(cartDrawer).toEqual(expect.any(Object));
      expect(Object.keys(cartDrawer ?? {}).length).toBeGreaterThan(0);
      expect(Object.keys(flatten(cartDrawer ?? {})).sort()).toEqual(
        CART_DRAWER_KEYS,
      );

      expect(messages.chrome.cartLabel).toBe(
        ((layers(sharedCatalogs)[locale] as Tree).chrome as Tree).cartLabel,
      );

      for (const value of Object.values(flatten(cartDrawer ?? {}))) {
        expect(value).not.toBe("");
      }
    },
  );

  /* Scenario: Every supported language exposes the shared bidding-history
     vocabulary through the assembled catalog. */
  it.each(locales)("exposes auction bidding history in %s", (locale) => {
    const namespace = layers(sharedCatalogs)[locale]?.auctionBiddingHistory;

    expect(namespace).toEqual(expect.any(Object));
    expect(Object.keys(flatten((namespace ?? {}) as Tree)).sort()).toEqual(
      AUCTION_BIDDING_HISTORY_KEYS,
    );
  });

  /* Scenario: A brand leaves a key unanswered. Nothing renders a key: every
     one of them is answered brand-neutrally or by the brand itself. */
  it.each(spoken)(
    "answers every key for $brand in $locale",
    ({ brand, locale }) => {
      const resolved = flatten(getMessages(brand, locale) as Tree);
      const unanswered = vocabularyFor(brand).filter(
        (key) => typeof resolved[key] !== "string" || resolved[key] === "",
      );

      expect(unanswered).toEqual([]);
    },
  );

  /* Scenario: A brand's own words are missing a language. What a brand states
     for itself, it states in every language it speaks — otherwise one brand's
     name lands inside another language's sentence. */
  it.each(brandNames)(
    "has %s state its own words in every language it speaks",
    (brand) => {
      const locales = localesOf(brand);
      const stated = Object.fromEntries(
        locales.map((locale) => [
          locale,
          new Set(
            Object.keys(flatten(layers(brandCatalogs[brand])[locale] ?? {})),
          ),
        ]),
      );
      const everywhere = [...new Set(locales.flatMap((l) => [...stated[l]]))];

      for (const locale of locales) {
        const missing = everywhere.filter((key) => !stated[locale].has(key));
        expect({ brand, locale, missing }).toEqual({
          brand,
          locale,
          missing: [],
        });
      }
    },
  );

  it("falls back to the English Grade10 Cart Drawer copy for an unsupported locale", () => {
    const english = getMessages("grade10", "en");
    const fallback = getMessages("grade10", "fr");

    expect(fallback.store.cartDrawer).toEqual(english.store.cartDrawer);
    expect(fallback.chrome.cartLabel).toBe(english.chrome.cartLabel);
  });

  /* Scenario: A brand names itself. What a brand states wins over the
     brand-neutral answer, in the language being read. */
  it("renders a brand's own words over the shared ones", () => {
    expect(getMessages("grade10", "en").chrome.wordmark).toBe("Grade10");
    expect(getMessages("zzz", "ko").chrome.wordmark).toBe("ZZZ Store");
  });

  /* Scenario: A brand says nothing of its own. */
  it("renders the shared words where no brand states any", () => {
    const shared = flatten(layers(sharedCatalogs).ko);

    expect(getMessages("zzz", "ko").common.back).toBe(shared["common.back"]);
    expect(
      flatten(layers(brandCatalogs.zzz).ko)["common.back"],
    ).toBeUndefined();
  });
});

/**
 * What the layering is for: a string a feature owns is written once per
 * language however many brands render it, and a brand owes the platform only
 * the words that say something about itself.
 */
describe("what each layer is answerable for", () => {
  const keysIn = (tree: Tree) => new Set(Object.keys(flatten(tree)));

  /* Scenario: A brand says nothing of its own — held as the rule rather than
     one example. A key answered in both layers is a translation written
     twice, which is the cost this shape exists to remove. */
  it.each(brandNames)(
    "has %s restate nothing the shared words answer",
    (brand) => {
      for (const locale of localesOf(brand)) {
        const shared = keysIn(layers(sharedCatalogs)[locale] ?? {});
        const stated = keysIn(layers(brandCatalogs[brand])[locale] ?? {});
        const twice = [...stated].filter((key) => shared.has(key));

        expect({ locale, twice }).toEqual({ locale, twice: [] });
      }
    },
  );

  /* Scenario: a brand can own a product surface without adding its words to
     another brand's vocabulary. */
  it("measures brand-owned words separately", () => {
    expect(vocabularyFor("grade10")).toEqual(
      expect.arrayContaining(["orderDetail.title", "orderHistory.title"]),
    );
    expect(vocabularyFor("zzz")).not.toEqual(
      expect.arrayContaining(["orderDetail.title", "orderHistory.title"]),
    );
  });

  /* Scenario: a language is declared and nobody speaks it. The shipped list
     is what the brands speak, so the pairs walked below are every language
     the platform has — a second list cannot drift out from under them. */
  it("ships exactly the languages the brands speak", () => {
    const spokenLocales = [...new Set(spoken.map(({ locale }) => locale))];

    expect([...locales].sort()).toEqual(spokenLocales.sort());
  });

  /* Scenario: a language is left half-written. Every language a brand speaks
     answers the whole vocabulary from its own two layers, so nothing falls
     through to English — a fallback that renders is a missing translation
     nobody sees. */
  it.each(spoken)(
    "answers $brand in $locale without falling back",
    ({ brand, locale }) => {
      const answered = new Set([
        ...keysIn(layers(sharedCatalogs)[locale] ?? {}),
        ...keysIn(layers(brandCatalogs[brand])[locale] ?? {}),
      ]);
      const untranslated = vocabularyFor(brand).filter(
        (key) => !answered.has(key),
      );

      expect({ brand, locale, untranslated }).toEqual({
        brand,
        locale,
        untranslated: [],
      });
    },
  );
});
