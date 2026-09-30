import { assemble } from "../../assemble.ts";
import {
  grade10En,
  grade10ZhHans,
  sharedEn,
  sharedZhHans,
} from "../../catalogs.ts";

/** grade10's copy in Simplified Chinese, importing no language it does not
 * read. */
export const messages = assemble("grade10", "zh-Hans", {
  shared: { en: sharedEn, "zh-Hans": sharedZhHans },
  brand: { en: grade10En, "zh-Hans": grade10ZhHans },
});
