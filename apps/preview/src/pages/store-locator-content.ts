import { FILLED_PICKUP_ADDRESS } from "../../../../packages/ui/src/blocks/store-order-detail/fixtures";

/**
 * Store Locator page content. Address, hours, and maps destination match the
 * free-pickup fixture on order details — one Hong Kong store, not a finder.
 */

const STORE_LOCATOR_COPY = {
  title: "Location & Hours",
  getDirections: "Get directions",
  hoursHeading: "Hours",
  mapTitle: "Map of Hong Kong Grade10 Store",
} as const;

const STORE_LOCATOR_STORE = {
  name: FILLED_PICKUP_ADDRESS.name,
  addressLines: FILLED_PICKUP_ADDRESS.lines,
  openingHours: FILLED_PICKUP_ADDRESS.openingHours,
  mapsHref: FILLED_PICKUP_ADDRESS.mapsHref,
  /** Same place query as `mapsHref`, for a lightweight embed (no API key). */
  mapEmbedSrc:
    "https://www.google.com/maps?q=13+Pak+Sha+Road,+Causeway+Bay,+Hong+Kong&output=embed",
} as const;

/**
 * Day rows for the Location & Hours composition. Fixture hours are one open
 * window; every day uses that window until ops names exceptions.
 */
const STORE_LOCATOR_HOURS = [
  { day: "Monday", hours: "11am – 9pm" },
  { day: "Tuesday", hours: "11am – 9pm" },
  { day: "Wednesday", hours: "11am – 9pm" },
  { day: "Thursday", hours: "11am – 9pm" },
  { day: "Friday", hours: "11am – 9pm" },
  { day: "Saturday", hours: "11am – 9pm" },
  { day: "Sunday", hours: "11am – 9pm" },
] as const;

export { STORE_LOCATOR_COPY, STORE_LOCATOR_HOURS, STORE_LOCATOR_STORE };
