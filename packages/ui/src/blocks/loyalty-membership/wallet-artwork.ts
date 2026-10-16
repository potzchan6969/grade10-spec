import appleAddPlaceholder from "./wallet-artwork/apple-wallet-add.placeholder.svg?url&no-inline";
import googleAddEn from "./wallet-artwork/google-wallet-add.en.svg?url&no-inline";
import googleAddZhHant from "./wallet-artwork/google-wallet-add.zh-Hant.svg?url&no-inline";

/** A wallet whose own artwork this block draws as the save action. */
type WalletArtworkName = "apple" | "google";

/** The languages a vendor's artwork is drawn in; any other reads English. */
type WalletArtworkLanguage = "en" | "zh-Hant";

/**
 * Which vendor artwork to draw for one wallet, and in which language. The
 * artwork is the vendor's, unaltered; the block never redraws it.
 */
type WalletPassArtwork = {
  wallet: WalletArtworkName;
  language?: WalletArtworkLanguage;
};

type ResolvedArtwork = {
  src: string;
  width: number;
  height: number;
  /** True where the vendor's licensed file is not in the package yet. */
  placeholder: boolean;
};

/**
 * Google's "Add to Google Wallet" button is its published SVG. Apple's badge
 * is a placeholder drawn to its proportions until Apple's licensed SVG is
 * added, and is marked so on the page.
 */
const ARTWORK: Record<
  WalletArtworkName,
  Record<WalletArtworkLanguage, ResolvedArtwork>
> = {
  google: {
    en: { src: googleAddEn, width: 283, height: 50, placeholder: false },
    "zh-Hant": {
      src: googleAddZhHant,
      width: 263,
      height: 50,
      placeholder: false,
    },
  },
  apple: {
    en: { src: appleAddPlaceholder, width: 220, height: 50, placeholder: true },
    "zh-Hant": {
      src: appleAddPlaceholder,
      width: 220,
      height: 50,
      placeholder: true,
    },
  },
};

function resolveArtwork(artwork: WalletPassArtwork): ResolvedArtwork {
  return ARTWORK[artwork.wallet][artwork.language ?? "en"];
}

export type { WalletArtworkLanguage, WalletArtworkName, WalletPassArtwork };
export { resolveArtwork };
