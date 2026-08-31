import { describe, expect, it } from "vitest";
import type { Brand } from "./index.ts";
import { brands, getMessages, localesOf } from "./index.ts";

/* The head is what a surface says it is — the words a browser tab, a search
   result and a shared link all read. Two surfaces answering at their own
   addresses have to say two different things there, and the catalogs are
   where they stop doing so. */

const spoken = (Object.keys(brands) as Brand[]).flatMap((brand) =>
  localesOf(brand).map((locale) => ({ brand, locale })),
);

describe("what a store surface says it is", () => {
  /* Scenario: The store and the listing are two surfaces —
     grade10-store/home. The front door and the browse listing are one
     address each, so a collector holding a tab of each can tell them
     apart. */
  it.each(spoken)(
    "tells the front door from the listing for $brand in $locale",
    ({ brand, locale }) => {
      const { head } = getMessages(brand, locale);

      expect(head.storeCollections.title).not.toBe(head.store.title);
      expect(head.storeCollections.description).not.toBe(
        head.store.description,
      );
    },
  );

  /* Distinctness alone would pass two surfaces that both say nothing, which
     is how a surface ships nameless rather than misnamed. */
  it.each(spoken)(
    "names each of them for $brand in $locale",
    ({ brand, locale }) => {
      const { head } = getMessages(brand, locale);

      for (const surface of [head.store, head.storeCollections]) {
        expect(surface.title.trim()).not.toBe("");
        expect(surface.description.trim()).not.toBe("");
      }
    },
  );
});
