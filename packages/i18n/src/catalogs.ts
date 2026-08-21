/**
 * Where the catalogs are assembled, and the only file that names a message
 * file by path.
 *
 * One JSON per namespace per brand and locale, because a namespace is what a
 * translator, a reviewer and a change all work in at once — and because two
 * changes adding keys to different surfaces then edit different files. What
 * they add up to is here rather than in a barrel beside the data, so the
 * shape of the whole vocabulary is one file to read, and `messages/` stays
 * what its name says: the words, and nothing that assembles them.
 *
 * A namespace is added in one place per locale and nowhere else: create its
 * file under every locale of every brand, and add its line to each catalog
 * below. Miss the line under grade10's English and the namespace is not in
 * the vocabulary at all, which every surface naming one of its keys says so.
 */

import grade10EnAuction from "../messages/grade10/en/auction.json";
import grade10EnAuctionListing from "../messages/grade10/en/auctionListing.json";
import grade10EnChrome from "../messages/grade10/en/chrome.json";
import grade10EnCommon from "../messages/grade10/en/common.json";
import grade10EnEmail from "../messages/grade10/en/email.json";
import grade10EnLocale from "../messages/grade10/en/locale.json";
import grade10EnMarketing from "../messages/grade10/en/marketing.json";
import grade10EnNotFound from "../messages/grade10/en/notFound.json";
import grade10EnProduct from "../messages/grade10/en/product.json";
import grade10EnProfile from "../messages/grade10/en/profile.json";
import grade10EnSignIn from "../messages/grade10/en/signIn.json";
import grade10EnStore from "../messages/grade10/en/store.json";
import grade10ZhHansAuction from "../messages/grade10/zh-Hans/auction.json";
import grade10ZhHansAuctionListing from "../messages/grade10/zh-Hans/auctionListing.json";
import grade10ZhHansChrome from "../messages/grade10/zh-Hans/chrome.json";
import grade10ZhHansCommon from "../messages/grade10/zh-Hans/common.json";
import grade10ZhHansEmail from "../messages/grade10/zh-Hans/email.json";
import grade10ZhHansLocale from "../messages/grade10/zh-Hans/locale.json";
import grade10ZhHansMarketing from "../messages/grade10/zh-Hans/marketing.json";
import grade10ZhHansNotFound from "../messages/grade10/zh-Hans/notFound.json";
import grade10ZhHansProduct from "../messages/grade10/zh-Hans/product.json";
import grade10ZhHansProfile from "../messages/grade10/zh-Hans/profile.json";
import grade10ZhHansSignIn from "../messages/grade10/zh-Hans/signIn.json";
import grade10ZhHansStore from "../messages/grade10/zh-Hans/store.json";
import grade10ZhHantAuction from "../messages/grade10/zh-Hant/auction.json";
import grade10ZhHantAuctionListing from "../messages/grade10/zh-Hant/auctionListing.json";
import grade10ZhHantChrome from "../messages/grade10/zh-Hant/chrome.json";
import grade10ZhHantCommon from "../messages/grade10/zh-Hant/common.json";
import grade10ZhHantEmail from "../messages/grade10/zh-Hant/email.json";
import grade10ZhHantLocale from "../messages/grade10/zh-Hant/locale.json";
import grade10ZhHantMarketing from "../messages/grade10/zh-Hant/marketing.json";
import grade10ZhHantNotFound from "../messages/grade10/zh-Hant/notFound.json";
import grade10ZhHantProduct from "../messages/grade10/zh-Hant/product.json";
import grade10ZhHantProfile from "../messages/grade10/zh-Hant/profile.json";
import grade10ZhHantSignIn from "../messages/grade10/zh-Hant/signIn.json";
import grade10ZhHantStore from "../messages/grade10/zh-Hant/store.json";
import zzzKoAuction from "../messages/zzz/ko/auction.json";
import zzzKoAuctionListing from "../messages/zzz/ko/auctionListing.json";
import zzzKoChrome from "../messages/zzz/ko/chrome.json";
import zzzKoCommon from "../messages/zzz/ko/common.json";
import zzzKoEmail from "../messages/zzz/ko/email.json";
import zzzKoLocale from "../messages/zzz/ko/locale.json";
import zzzKoMarketing from "../messages/zzz/ko/marketing.json";
import zzzKoNotFound from "../messages/zzz/ko/notFound.json";
import zzzKoProduct from "../messages/zzz/ko/product.json";
import zzzKoProfile from "../messages/zzz/ko/profile.json";
import zzzKoSignIn from "../messages/zzz/ko/signIn.json";
import zzzKoStore from "../messages/zzz/ko/store.json";

/** grade10/en */
export const grade10En = {
  common: grade10EnCommon,
  locale: grade10EnLocale,
  chrome: grade10EnChrome,
  marketing: grade10EnMarketing,
  store: grade10EnStore,
  product: grade10EnProduct,
  auction: grade10EnAuction,
  auctionListing: grade10EnAuctionListing,
  signIn: grade10EnSignIn,
  profile: grade10EnProfile,
  notFound: grade10EnNotFound,
  email: grade10EnEmail,
};

/** grade10/zh-Hant */
export const grade10ZhHant = {
  common: grade10ZhHantCommon,
  locale: grade10ZhHantLocale,
  chrome: grade10ZhHantChrome,
  marketing: grade10ZhHantMarketing,
  store: grade10ZhHantStore,
  product: grade10ZhHantProduct,
  auction: grade10ZhHantAuction,
  auctionListing: grade10ZhHantAuctionListing,
  signIn: grade10ZhHantSignIn,
  profile: grade10ZhHantProfile,
  notFound: grade10ZhHantNotFound,
  email: grade10ZhHantEmail,
};

/** grade10/zh-Hans */
export const grade10ZhHans = {
  common: grade10ZhHansCommon,
  locale: grade10ZhHansLocale,
  chrome: grade10ZhHansChrome,
  marketing: grade10ZhHansMarketing,
  store: grade10ZhHansStore,
  product: grade10ZhHansProduct,
  auction: grade10ZhHansAuction,
  auctionListing: grade10ZhHansAuctionListing,
  signIn: grade10ZhHansSignIn,
  profile: grade10ZhHansProfile,
  notFound: grade10ZhHansNotFound,
  email: grade10ZhHansEmail,
};

/** zzz/ko */
export const zzzKo = {
  common: zzzKoCommon,
  locale: zzzKoLocale,
  chrome: zzzKoChrome,
  marketing: zzzKoMarketing,
  store: zzzKoStore,
  product: zzzKoProduct,
  auction: zzzKoAuction,
  auctionListing: zzzKoAuctionListing,
  signIn: zzzKoSignIn,
  profile: zzzKoProfile,
  notFound: zzzKoNotFound,
  email: zzzKoEmail,
};
