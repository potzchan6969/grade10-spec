import { describe, expect, it } from "vitest";
import type {
  StoreLocatorCopy,
  StoreLocatorHoursRow,
  StoreLocatorProps,
} from "../../index";
import * as publicEntry from "../../index";
import { StoreLocator } from "../../index";
import { STORE_LOCATOR_PROPS } from "./fixtures";

type PublicStoreLocatorTypes = [
  StoreLocatorCopy,
  StoreLocatorHoursRow,
  StoreLocatorProps,
];

const publicStoreLocatorTypes: PublicStoreLocatorTypes | undefined = undefined;
void publicStoreLocatorTypes;

const { mapEmbedSrc: _embed, ...noEmbed } = STORE_LOCATOR_PROPS;
const { mapsHref: _maps, ...noMaps } = STORE_LOCATOR_PROPS;

/** Scenario: shared-ui-store-locator-SC-06 - A map with no destination does
 * not build. Scenario: shared-ui-store-locator-SC-07 - A block with no hours
 * does not build. Never called: the type check is the test. */
function refusedShapes() {
  // @ts-expect-error a block with no map embed source
  const embedless: StoreLocatorProps = noEmbed;
  // @ts-expect-error a block with no Maps destination
  const destinationless: StoreLocatorProps = noMaps;
  // @ts-expect-error a block with no hours row
  const hourless: StoreLocatorProps = { ...STORE_LOCATOR_PROPS, hours: [] };
  return [embedless, destinationless, hourless];
}
void refusedShapes;

/** Scenario: shared-ui-store-locator-SC-01 - An application imports the
 * surface. */
describe("store-locator public entry", () => {
  it("exports the store locator component", () => {
    expect(StoreLocator).toEqual(expect.any(Function));
  });

  it("exports no other name for the surface", () => {
    expect(
      Object.keys(publicEntry).filter((name) => /StoreLocator/.test(name)),
    ).toEqual(["StoreLocator"]);
  });
});
