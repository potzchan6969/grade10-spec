/**
 * Where the catalogs are assembled, and the only file that names a message
 * file by path.
 *
 * Two layers. `shared` answers every key no brand claims — the words a
 * feature owns, written once per language however many brands render them —
 * and a brand answers the keys that say something about that brand: what it
 * is called, who runs it, where it sells, what each of its surfaces is
 * named. A brand states those in every language it speaks, so a page never
 * carries one brand's name inside another language's sentence.
 *
 * One JSON per namespace per locale, because a namespace is what a
 * translator, a reviewer and a change all work in at once — and because two
 * changes adding keys to different surfaces then edit different files. What
 * they add up to is here rather than in a barrel beside the data, so the
 * shape of the whole vocabulary is one file to read, and `messages/` stays
 * what its name says: the words, and nothing that assembles them.
 *
 * A namespace is added under `shared` for every language, and under a brand
 * only where that brand has to say it itself.
 */

import grade10EnAuctionListing from "../messages/grade10/en/auctionListing.json";
import grade10EnChrome from "../messages/grade10/en/chrome.json";
import grade10EnEmail from "../messages/grade10/en/email.json";
import grade10EnHead from "../messages/grade10/en/head.json";
import grade10EnMarketing from "../messages/grade10/en/marketing.json";
import grade10EnProfile from "../messages/grade10/en/profile.json";
import grade10EnSignIn from "../messages/grade10/en/signIn.json";
import grade10EnStoreHome from "../messages/grade10/en/storeHome.json";
import grade10ZhHansAuctionListing from "../messages/grade10/zh-Hans/auctionListing.json";
import grade10ZhHansChrome from "../messages/grade10/zh-Hans/chrome.json";
import grade10ZhHansEmail from "../messages/grade10/zh-Hans/email.json";
import grade10ZhHansHead from "../messages/grade10/zh-Hans/head.json";
import grade10ZhHansMarketing from "../messages/grade10/zh-Hans/marketing.json";
import grade10ZhHansProfile from "../messages/grade10/zh-Hans/profile.json";
import grade10ZhHansSignIn from "../messages/grade10/zh-Hans/signIn.json";
import grade10ZhHansStoreHome from "../messages/grade10/zh-Hans/storeHome.json";
import grade10ZhHantAuctionListing from "../messages/grade10/zh-Hant/auctionListing.json";
import grade10ZhHantChrome from "../messages/grade10/zh-Hant/chrome.json";
import grade10ZhHantEmail from "../messages/grade10/zh-Hant/email.json";
import grade10ZhHantHead from "../messages/grade10/zh-Hant/head.json";
import grade10ZhHantMarketing from "../messages/grade10/zh-Hant/marketing.json";
import grade10ZhHantProfile from "../messages/grade10/zh-Hant/profile.json";
import grade10ZhHantSignIn from "../messages/grade10/zh-Hant/signIn.json";
import grade10ZhHantStoreHome from "../messages/grade10/zh-Hant/storeHome.json";
import sharedEnAuction from "../messages/shared/en/auction.json";
import sharedEnAuctionListing from "../messages/shared/en/auctionListing.json";
import sharedEnChrome from "../messages/shared/en/chrome.json";
import sharedEnCommon from "../messages/shared/en/common.json";
import sharedEnEmail from "../messages/shared/en/email.json";
import sharedEnLocale from "../messages/shared/en/locale.json";
import sharedEnMarketing from "../messages/shared/en/marketing.json";
import sharedEnNotFound from "../messages/shared/en/notFound.json";
import sharedEnProduct from "../messages/shared/en/product.json";
import sharedEnProfile from "../messages/shared/en/profile.json";
import sharedEnSignIn from "../messages/shared/en/signIn.json";
import sharedEnStore from "../messages/shared/en/store.json";
import sharedEnStoreHome from "../messages/shared/en/storeHome.json";
import sharedKoAuction from "../messages/shared/ko/auction.json";
import sharedKoAuctionListing from "../messages/shared/ko/auctionListing.json";
import sharedKoChrome from "../messages/shared/ko/chrome.json";
import sharedKoCommon from "../messages/shared/ko/common.json";
import sharedKoEmail from "../messages/shared/ko/email.json";
import sharedKoLocale from "../messages/shared/ko/locale.json";
import sharedKoMarketing from "../messages/shared/ko/marketing.json";
import sharedKoNotFound from "../messages/shared/ko/notFound.json";
import sharedKoProduct from "../messages/shared/ko/product.json";
import sharedKoProfile from "../messages/shared/ko/profile.json";
import sharedKoSignIn from "../messages/shared/ko/signIn.json";
import sharedKoStore from "../messages/shared/ko/store.json";
import sharedKoStoreHome from "../messages/shared/ko/storeHome.json";
import sharedZhHansAuction from "../messages/shared/zh-Hans/auction.json";
import sharedZhHansAuctionListing from "../messages/shared/zh-Hans/auctionListing.json";
import sharedZhHansChrome from "../messages/shared/zh-Hans/chrome.json";
import sharedZhHansCommon from "../messages/shared/zh-Hans/common.json";
import sharedZhHansEmail from "../messages/shared/zh-Hans/email.json";
import sharedZhHansLocale from "../messages/shared/zh-Hans/locale.json";
import sharedZhHansMarketing from "../messages/shared/zh-Hans/marketing.json";
import sharedZhHansNotFound from "../messages/shared/zh-Hans/notFound.json";
import sharedZhHansProduct from "../messages/shared/zh-Hans/product.json";
import sharedZhHansProfile from "../messages/shared/zh-Hans/profile.json";
import sharedZhHansSignIn from "../messages/shared/zh-Hans/signIn.json";
import sharedZhHansStore from "../messages/shared/zh-Hans/store.json";
import sharedZhHansStoreHome from "../messages/shared/zh-Hans/storeHome.json";
import sharedZhHantAuction from "../messages/shared/zh-Hant/auction.json";
import sharedZhHantAuctionListing from "../messages/shared/zh-Hant/auctionListing.json";
import sharedZhHantChrome from "../messages/shared/zh-Hant/chrome.json";
import sharedZhHantCommon from "../messages/shared/zh-Hant/common.json";
import sharedZhHantEmail from "../messages/shared/zh-Hant/email.json";
import sharedZhHantLocale from "../messages/shared/zh-Hant/locale.json";
import sharedZhHantMarketing from "../messages/shared/zh-Hant/marketing.json";
import sharedZhHantNotFound from "../messages/shared/zh-Hant/notFound.json";
import sharedZhHantProduct from "../messages/shared/zh-Hant/product.json";
import sharedZhHantProfile from "../messages/shared/zh-Hant/profile.json";
import sharedZhHantSignIn from "../messages/shared/zh-Hant/signIn.json";
import sharedZhHantStore from "../messages/shared/zh-Hant/store.json";
import sharedZhHantStoreHome from "../messages/shared/zh-Hant/storeHome.json";

import zzzKoAuctionListing from "../messages/zzz/ko/auctionListing.json";
import zzzKoChrome from "../messages/zzz/ko/chrome.json";
import zzzKoEmail from "../messages/zzz/ko/email.json";
import zzzKoHead from "../messages/zzz/ko/head.json";
import zzzKoMarketing from "../messages/zzz/ko/marketing.json";
import zzzKoProfile from "../messages/zzz/ko/profile.json";
import zzzKoSignIn from "../messages/zzz/ko/signIn.json";
import zzzKoStoreHome from "../messages/zzz/ko/storeHome.json";

/** The words no brand claims, in every language any brand speaks. */
export const sharedCatalogs = {
  en: {
    auction: sharedEnAuction,
    auctionListing: sharedEnAuctionListing,
    chrome: sharedEnChrome,
    common: sharedEnCommon,
    email: sharedEnEmail,
    locale: sharedEnLocale,
    marketing: sharedEnMarketing,
    notFound: sharedEnNotFound,
    product: sharedEnProduct,
    profile: sharedEnProfile,
    signIn: sharedEnSignIn,
    store: sharedEnStore,
    storeHome: sharedEnStoreHome,
  },
  "zh-Hant": {
    auction: sharedZhHantAuction,
    auctionListing: sharedZhHantAuctionListing,
    chrome: sharedZhHantChrome,
    common: sharedZhHantCommon,
    email: sharedZhHantEmail,
    locale: sharedZhHantLocale,
    marketing: sharedZhHantMarketing,
    notFound: sharedZhHantNotFound,
    product: sharedZhHantProduct,
    profile: sharedZhHantProfile,
    signIn: sharedZhHantSignIn,
    store: sharedZhHantStore,
    storeHome: sharedZhHantStoreHome,
  },
  "zh-Hans": {
    auction: sharedZhHansAuction,
    auctionListing: sharedZhHansAuctionListing,
    chrome: sharedZhHansChrome,
    common: sharedZhHansCommon,
    email: sharedZhHansEmail,
    locale: sharedZhHansLocale,
    marketing: sharedZhHansMarketing,
    notFound: sharedZhHansNotFound,
    product: sharedZhHansProduct,
    profile: sharedZhHansProfile,
    signIn: sharedZhHansSignIn,
    store: sharedZhHansStore,
    storeHome: sharedZhHansStoreHome,
  },
  ko: {
    auction: sharedKoAuction,
    auctionListing: sharedKoAuctionListing,
    chrome: sharedKoChrome,
    common: sharedKoCommon,
    email: sharedKoEmail,
    locale: sharedKoLocale,
    marketing: sharedKoMarketing,
    notFound: sharedKoNotFound,
    product: sharedKoProduct,
    profile: sharedKoProfile,
    signIn: sharedKoSignIn,
    store: sharedKoStore,
    storeHome: sharedKoStoreHome,
  },
};

/** What each brand says for itself, in every language it speaks. */
export const brandCatalogs = {
  grade10: {
    en: {
      auctionListing: grade10EnAuctionListing,
      chrome: grade10EnChrome,
      email: grade10EnEmail,
      head: grade10EnHead,
      marketing: grade10EnMarketing,
      profile: grade10EnProfile,
      signIn: grade10EnSignIn,
      storeHome: grade10EnStoreHome,
    },
    "zh-Hant": {
      auctionListing: grade10ZhHantAuctionListing,
      chrome: grade10ZhHantChrome,
      email: grade10ZhHantEmail,
      head: grade10ZhHantHead,
      marketing: grade10ZhHantMarketing,
      profile: grade10ZhHantProfile,
      signIn: grade10ZhHantSignIn,
      storeHome: grade10ZhHantStoreHome,
    },
    "zh-Hans": {
      auctionListing: grade10ZhHansAuctionListing,
      chrome: grade10ZhHansChrome,
      email: grade10ZhHansEmail,
      head: grade10ZhHansHead,
      marketing: grade10ZhHansMarketing,
      profile: grade10ZhHansProfile,
      signIn: grade10ZhHansSignIn,
      storeHome: grade10ZhHansStoreHome,
    },
  },
  zzz: {
    ko: {
      auctionListing: zzzKoAuctionListing,
      chrome: zzzKoChrome,
      email: zzzKoEmail,
      head: zzzKoHead,
      marketing: zzzKoMarketing,
      profile: zzzKoProfile,
      signIn: zzzKoSignIn,
      storeHome: zzzKoStoreHome,
    },
  },
};
