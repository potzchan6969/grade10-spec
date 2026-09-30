import { type Brand, defaultLocaleOf, type LocaleOf } from "./brands.ts";
import type { Messages } from "./index.ts";

type MessageTree = { [key: string]: string | MessageTree };

/** The layers one brand's copy is read from, by locale. A caller passes the
 * whole table, or only the languages its one locale reads. */
export type Layers = {
  shared: Readonly<Record<string, unknown>>;
  brand: Readonly<Record<string, unknown>>;
};

/** The language every layer is measured against, and the one a partial
 * translation falls back to. */
const VOCABULARY_LOCALE = "en";

function merge(base: MessageTree, overlaid: MessageTree): MessageTree {
  const result: MessageTree = { ...base };
  for (const [key, value] of Object.entries(overlaid)) {
    const current = result[key];
    result[key] =
      typeof value === "object" && typeof current === "object"
        ? merge(current, value)
        : value;
  }
  return result;
}

/**
 * One brand's copy in one language, from the two layers that answer it.
 *
 * Four merges, each overriding the one before: the vocabulary's own language,
 * the vocabulary in the language asked for, what the brand says for itself,
 * and what the brand says for itself in that language. Language before brand,
 * because a brand states its own words in every language it speaks — so the
 * only thing the brand layer can override is a sentence written in the same
 * language, and the only thing that ever falls back across languages is a
 * translation a brand chose to leave partial.
 *
 * A layer the chain reads and the caller did not pass is an error, never an
 * empty layer.
 */
export function assemble<B extends Brand>(
  brand: B,
  locale: LocaleOf<B>,
  layers: Layers,
): Messages<B> {
  const read = (half: keyof Layers, at: string): MessageTree => {
    const found = layers[half][at];
    if (found === undefined)
      throw new Error(`${brand}/${locale} reads the ${half} layer in ${at}`);
    return found as MessageTree;
  };

  return merge(
    merge(
      merge(read("shared", VOCABULARY_LOCALE), read("shared", locale)),
      read("brand", defaultLocaleOf(brand)),
    ),
    read("brand", locale),
  ) as Messages<B>;
}
