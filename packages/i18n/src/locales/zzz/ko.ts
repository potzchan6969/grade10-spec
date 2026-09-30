import { assemble } from "../../assemble.ts";
import { sharedEn, sharedKo, zzzKo } from "../../catalogs.ts";

/** zzz's copy in Korean, importing no language it does not
 * read. */
export const messages = assemble("zzz", "ko", {
  shared: { en: sharedEn, ko: sharedKo },
  brand: { ko: zzzKo },
});
