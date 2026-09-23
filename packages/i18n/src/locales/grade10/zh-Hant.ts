import { assemble } from "../../assemble.ts";
import {
  grade10En,
  grade10ZhHant,
  sharedEn,
  sharedZhHant,
} from "../../catalogs.ts";

/** grade10's copy in Traditional Chinese, importing no language it does not
 * read. */
export const messages = assemble("grade10", "zh-Hant", {
  shared: { en: sharedEn, "zh-Hant": sharedZhHant },
  brand: { en: grade10En, "zh-Hant": grade10ZhHant },
});
