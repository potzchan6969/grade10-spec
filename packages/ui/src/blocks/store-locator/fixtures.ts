import type {
  StoreLocatorCopy,
  StoreLocatorHoursRow,
  StoreLocatorProps,
} from "./store-locator";

/** Words no catalog holds, so a story that finds them proves the block drew
 * what it was given rather than words of its own. */
const STORE_LOCATOR_COPY: StoreLocatorCopy = {
  heading: "Where To Find Us (fixture)",
  hoursHeading: "Opening Times (fixture)",
  mapTitle: "Fixture map of the test shop",
  openMap: "Open the test shop in Maps (fixture)",
};

const STORE_LOCATOR_HOURS: readonly [
  StoreLocatorHoursRow,
  ...StoreLocatorHoursRow[],
] = [
  { day: "Fixture Monday", hours: "10:01 – 20:59" },
  { day: "Fixture Tuesday", hours: "10:02 – 20:58" },
  { day: "Fixture Wednesday", hours: "Closed (fixture)" },
];

const STORE_LOCATOR_PROPS: StoreLocatorProps = {
  copy: STORE_LOCATOR_COPY,
  name: "Fixture Test Shop",
  addressLines: ["1 Fixture Lane", "Testville, Nowhere"],
  hours: STORE_LOCATOR_HOURS,
  mapEmbedSrc: "about:blank",
  mapsHref: "https://maps.example.test/?q=1+Fixture+Lane",
};

export { STORE_LOCATOR_COPY, STORE_LOCATOR_HOURS, STORE_LOCATOR_PROPS };
