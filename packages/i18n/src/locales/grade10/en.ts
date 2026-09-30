import { assemble } from "../../assemble.ts";
import { grade10En, sharedEn } from "../../catalogs.ts";

/** grade10's copy in English, importing no language it does not
 * read. */
export const messages = assemble("grade10", "en", {
  shared: { en: sharedEn },
  brand: { en: grade10En },
});
