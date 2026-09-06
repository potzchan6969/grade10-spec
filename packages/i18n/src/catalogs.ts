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
import grade10EnIdentity from "../messages/grade10/en/identity.json";
import grade10EnMarketing from "../messages/grade10/en/marketing.json";
import grade10EnOrderDetail from "../messages/grade10/en/orderDetail.json";
import grade10EnOrderHistory from "../messages/grade10/en/orderHistory.json";
import grade10EnProfile from "../messages/grade10/en/profile.json";
import grade10EnSignIn from "../messages/grade10/en/signIn.json";
import grade10EnStoreHome from "../messages/grade10/en/storeHome.json";
import grade10EnVault from "../messages/grade10/en/vault.json";
import grade10ZhHansAuctionListing from "../messages/grade10/zh-Hans/auctionListing.json";
import grade10ZhHansChrome from "../messages/grade10/zh-Hans/chrome.json";
import grade10ZhHansEmail from "../messages/grade10/zh-Hans/email.json";
import grade10ZhHansHead from "../messages/grade10/zh-Hans/head.json";
import grade10ZhHansIdentity from "../messages/grade10/zh-Hans/identity.json";
import grade10ZhHansMarketing from "../messages/grade10/zh-Hans/marketing.json";
import grade10ZhHansOrderDetail from "../messages/grade10/zh-Hans/orderDetail.json";
import grade10ZhHansOrderHistory from "../messages/grade10/zh-Hans/orderHistory.json";
import grade10ZhHansProfile from "../messages/grade10/zh-Hans/profile.json";
import grade10ZhHansSignIn from "../messages/grade10/zh-Hans/signIn.json";
import grade10ZhHansStoreHome from "../messages/grade10/zh-Hans/storeHome.json";
import grade10ZhHansVault from "../messages/grade10/zh-Hans/vault.json";
import grade10ZhHantAuctionListing from "../messages/grade10/zh-Hant/auctionListing.json";
import grade10ZhHantChrome from "../messages/grade10/zh-Hant/chrome.json";
import grade10ZhHantEmail from "../messages/grade10/zh-Hant/email.json";
import grade10ZhHantHead from "../messages/grade10/zh-Hant/head.json";
import grade10ZhHantIdentity from "../messages/grade10/zh-Hant/identity.json";
import grade10ZhHantMarketing from "../messages/grade10/zh-Hant/marketing.json";
import grade10ZhHantOrderDetail from "../messages/grade10/zh-Hant/orderDetail.json";
import grade10ZhHantOrderHistory from "../messages/grade10/zh-Hant/orderHistory.json";
import grade10ZhHantProfile from "../messages/grade10/zh-Hant/profile.json";
import grade10ZhHantSignIn from "../messages/grade10/zh-Hant/signIn.json";
import grade10ZhHantStoreHome from "../messages/grade10/zh-Hant/storeHome.json";
import grade10ZhHantVault from "../messages/grade10/zh-Hant/vault.json";
import sharedEnAppointment from "../messages/shared/en/appointment.json";
import sharedEnAuction from "../messages/shared/en/auction.json";
import sharedEnAuctionBiddingHistory from "../messages/shared/en/auctionBiddingHistory.json";
import sharedEnAuctionListing from "../messages/shared/en/auctionListing.json";
import sharedEnCheckout from "../messages/shared/en/checkout.json";
import sharedEnChrome from "../messages/shared/en/chrome.json";
import sharedEnCommon from "../messages/shared/en/common.json";
import sharedEnDates from "../messages/shared/en/dates.json";
import sharedEnEmail from "../messages/shared/en/email.json";
import sharedEnIdentity from "../messages/shared/en/identity.json";
import sharedEnLegal from "../messages/shared/en/legal.json";
import sharedEnLocale from "../messages/shared/en/locale.json";
import sharedEnMarketing from "../messages/shared/en/marketing.json";
import sharedEnMembership from "../messages/shared/en/membership.json";
import sharedEnNotFound from "../messages/shared/en/notFound.json";
import sharedEnNotifications from "../messages/shared/en/notifications.json";
import sharedEnProduct from "../messages/shared/en/product.json";
import sharedEnProfile from "../messages/shared/en/profile.json";
import sharedEnSignIn from "../messages/shared/en/signIn.json";
import sharedEnStore from "../messages/shared/en/store.json";
import sharedEnStoreHome from "../messages/shared/en/storeHome.json";
import sharedEnVault from "../messages/shared/en/vault.json";
import sharedKoAppointment from "../messages/shared/ko/appointment.json";
import sharedKoAuction from "../messages/shared/ko/auction.json";
import sharedKoAuctionBiddingHistory from "../messages/shared/ko/auctionBiddingHistory.json";
import sharedKoAuctionListing from "../messages/shared/ko/auctionListing.json";
import sharedKoCheckout from "../messages/shared/ko/checkout.json";
import sharedKoChrome from "../messages/shared/ko/chrome.json";
import sharedKoCommon from "../messages/shared/ko/common.json";
import sharedKoDates from "../messages/shared/ko/dates.json";
import sharedKoEmail from "../messages/shared/ko/email.json";
import sharedKoIdentity from "../messages/shared/ko/identity.json";
import sharedKoLegal from "../messages/shared/ko/legal.json";
import sharedKoLocale from "../messages/shared/ko/locale.json";
import sharedKoMarketing from "../messages/shared/ko/marketing.json";
import sharedKoMembership from "../messages/shared/ko/membership.json";
import sharedKoNotFound from "../messages/shared/ko/notFound.json";
import sharedKoNotifications from "../messages/shared/ko/notifications.json";
import sharedKoProduct from "../messages/shared/ko/product.json";
import sharedKoProfile from "../messages/shared/ko/profile.json";
import sharedKoSignIn from "../messages/shared/ko/signIn.json";
import sharedKoStore from "../messages/shared/ko/store.json";
import sharedKoStoreHome from "../messages/shared/ko/storeHome.json";
import sharedKoVault from "../messages/shared/ko/vault.json";
import sharedZhHansAppointment from "../messages/shared/zh-Hans/appointment.json";
import sharedZhHansAuction from "../messages/shared/zh-Hans/auction.json";
import sharedZhHansAuctionBiddingHistory from "../messages/shared/zh-Hans/auctionBiddingHistory.json";
import sharedZhHansAuctionListing from "../messages/shared/zh-Hans/auctionListing.json";
import sharedZhHansCheckout from "../messages/shared/zh-Hans/checkout.json";
import sharedZhHansChrome from "../messages/shared/zh-Hans/chrome.json";
import sharedZhHansCommon from "../messages/shared/zh-Hans/common.json";
import sharedZhHansDates from "../messages/shared/zh-Hans/dates.json";
import sharedZhHansEmail from "../messages/shared/zh-Hans/email.json";
import sharedZhHansIdentity from "../messages/shared/zh-Hans/identity.json";
import sharedZhHansLegal from "../messages/shared/zh-Hans/legal.json";
import sharedZhHansLocale from "../messages/shared/zh-Hans/locale.json";
import sharedZhHansMarketing from "../messages/shared/zh-Hans/marketing.json";
import sharedZhHansMembership from "../messages/shared/zh-Hans/membership.json";
import sharedZhHansNotFound from "../messages/shared/zh-Hans/notFound.json";
import sharedZhHansNotifications from "../messages/shared/zh-Hans/notifications.json";
import sharedZhHansProduct from "../messages/shared/zh-Hans/product.json";
import sharedZhHansProfile from "../messages/shared/zh-Hans/profile.json";
import sharedZhHansSignIn from "../messages/shared/zh-Hans/signIn.json";
import sharedZhHansStore from "../messages/shared/zh-Hans/store.json";
import sharedZhHansStoreHome from "../messages/shared/zh-Hans/storeHome.json";
import sharedZhHansVault from "../messages/shared/zh-Hans/vault.json";
import sharedZhHantAppointment from "../messages/shared/zh-Hant/appointment.json";
import sharedZhHantAuction from "../messages/shared/zh-Hant/auction.json";
import sharedZhHantAuctionBiddingHistory from "../messages/shared/zh-Hant/auctionBiddingHistory.json";
import sharedZhHantAuctionListing from "../messages/shared/zh-Hant/auctionListing.json";
import sharedZhHantCheckout from "../messages/shared/zh-Hant/checkout.json";
import sharedZhHantChrome from "../messages/shared/zh-Hant/chrome.json";
import sharedZhHantCommon from "../messages/shared/zh-Hant/common.json";
import sharedZhHantDates from "../messages/shared/zh-Hant/dates.json";
import sharedZhHantEmail from "../messages/shared/zh-Hant/email.json";
import sharedZhHantIdentity from "../messages/shared/zh-Hant/identity.json";
import sharedZhHantLegal from "../messages/shared/zh-Hant/legal.json";
import sharedZhHantLocale from "../messages/shared/zh-Hant/locale.json";
import sharedZhHantMarketing from "../messages/shared/zh-Hant/marketing.json";
import sharedZhHantMembership from "../messages/shared/zh-Hant/membership.json";
import sharedZhHantNotFound from "../messages/shared/zh-Hant/notFound.json";
import sharedZhHantNotifications from "../messages/shared/zh-Hant/notifications.json";
import sharedZhHantProduct from "../messages/shared/zh-Hant/product.json";
import sharedZhHantProfile from "../messages/shared/zh-Hant/profile.json";
import sharedZhHantSignIn from "../messages/shared/zh-Hant/signIn.json";
import sharedZhHantStore from "../messages/shared/zh-Hant/store.json";
import sharedZhHantStoreHome from "../messages/shared/zh-Hant/storeHome.json";
import sharedZhHantVault from "../messages/shared/zh-Hant/vault.json";

import zzzKoAuctionListing from "../messages/zzz/ko/auctionListing.json";
import zzzKoChrome from "../messages/zzz/ko/chrome.json";
import zzzKoEmail from "../messages/zzz/ko/email.json";
import zzzKoHead from "../messages/zzz/ko/head.json";
import zzzKoIdentity from "../messages/zzz/ko/identity.json";
import zzzKoMarketing from "../messages/zzz/ko/marketing.json";
import zzzKoProfile from "../messages/zzz/ko/profile.json";
import zzzKoSignIn from "../messages/zzz/ko/signIn.json";
import zzzKoStoreHome from "../messages/zzz/ko/storeHome.json";
import zzzKoVault from "../messages/zzz/ko/vault.json";

/** The words no brand claims, in every language any brand speaks. */
export const sharedCatalogs = {
  en: {
    appointment: sharedEnAppointment,
    auction: sharedEnAuction,
    auctionBiddingHistory: sharedEnAuctionBiddingHistory,
    auctionListing: sharedEnAuctionListing,
    checkout: sharedEnCheckout,
    chrome: sharedEnChrome,
    common: sharedEnCommon,
    dates: sharedEnDates,
    email: sharedEnEmail,
    identity: sharedEnIdentity,
    legal: sharedEnLegal,
    locale: sharedEnLocale,
    marketing: sharedEnMarketing,
    membership: sharedEnMembership,
    notFound: sharedEnNotFound,
    notifications: sharedEnNotifications,
    product: sharedEnProduct,
    profile: sharedEnProfile,
    signIn: sharedEnSignIn,
    store: sharedEnStore,
    storeHome: sharedEnStoreHome,
    vault: sharedEnVault,
  },
  "zh-Hant": {
    appointment: sharedZhHantAppointment,
    auction: sharedZhHantAuction,
    auctionBiddingHistory: sharedZhHantAuctionBiddingHistory,
    auctionListing: sharedZhHantAuctionListing,
    checkout: sharedZhHantCheckout,
    chrome: sharedZhHantChrome,
    common: sharedZhHantCommon,
    dates: sharedZhHantDates,
    email: sharedZhHantEmail,
    identity: sharedZhHantIdentity,
    legal: sharedZhHantLegal,
    locale: sharedZhHantLocale,
    marketing: sharedZhHantMarketing,
    membership: sharedZhHantMembership,
    notFound: sharedZhHantNotFound,
    notifications: sharedZhHantNotifications,
    product: sharedZhHantProduct,
    profile: sharedZhHantProfile,
    signIn: sharedZhHantSignIn,
    store: sharedZhHantStore,
    storeHome: sharedZhHantStoreHome,
    vault: sharedZhHantVault,
  },
  "zh-Hans": {
    appointment: sharedZhHansAppointment,
    auction: sharedZhHansAuction,
    auctionBiddingHistory: sharedZhHansAuctionBiddingHistory,
    auctionListing: sharedZhHansAuctionListing,
    checkout: sharedZhHansCheckout,
    chrome: sharedZhHansChrome,
    common: sharedZhHansCommon,
    dates: sharedZhHansDates,
    email: sharedZhHansEmail,
    identity: sharedZhHansIdentity,
    legal: sharedZhHansLegal,
    locale: sharedZhHansLocale,
    marketing: sharedZhHansMarketing,
    membership: sharedZhHansMembership,
    notFound: sharedZhHansNotFound,
    notifications: sharedZhHansNotifications,
    product: sharedZhHansProduct,
    profile: sharedZhHansProfile,
    signIn: sharedZhHansSignIn,
    store: sharedZhHansStore,
    storeHome: sharedZhHansStoreHome,
    vault: sharedZhHansVault,
  },
  ko: {
    appointment: sharedKoAppointment,
    auction: sharedKoAuction,
    auctionBiddingHistory: sharedKoAuctionBiddingHistory,
    auctionListing: sharedKoAuctionListing,
    checkout: sharedKoCheckout,
    chrome: sharedKoChrome,
    common: sharedKoCommon,
    dates: sharedKoDates,
    email: sharedKoEmail,
    identity: sharedKoIdentity,
    legal: sharedKoLegal,
    locale: sharedKoLocale,
    marketing: sharedKoMarketing,
    membership: sharedKoMembership,
    notFound: sharedKoNotFound,
    notifications: sharedKoNotifications,
    product: sharedKoProduct,
    profile: sharedKoProfile,
    signIn: sharedKoSignIn,
    store: sharedKoStore,
    storeHome: sharedKoStoreHome,
    vault: sharedKoVault,
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
      identity: grade10EnIdentity,
      marketing: grade10EnMarketing,
      orderDetail: grade10EnOrderDetail,
      orderHistory: grade10EnOrderHistory,
      profile: grade10EnProfile,
      signIn: grade10EnSignIn,
      storeHome: grade10EnStoreHome,
      vault: grade10EnVault,
    },
    "zh-Hant": {
      auctionListing: grade10ZhHantAuctionListing,
      chrome: grade10ZhHantChrome,
      email: grade10ZhHantEmail,
      head: grade10ZhHantHead,
      identity: grade10ZhHantIdentity,
      marketing: grade10ZhHantMarketing,
      orderDetail: grade10ZhHantOrderDetail,
      orderHistory: grade10ZhHantOrderHistory,
      profile: grade10ZhHantProfile,
      signIn: grade10ZhHantSignIn,
      storeHome: grade10ZhHantStoreHome,
      vault: grade10ZhHantVault,
    },
    "zh-Hans": {
      auctionListing: grade10ZhHansAuctionListing,
      chrome: grade10ZhHansChrome,
      email: grade10ZhHansEmail,
      head: grade10ZhHansHead,
      identity: grade10ZhHansIdentity,
      marketing: grade10ZhHansMarketing,
      orderDetail: grade10ZhHansOrderDetail,
      orderHistory: grade10ZhHansOrderHistory,
      profile: grade10ZhHansProfile,
      signIn: grade10ZhHansSignIn,
      storeHome: grade10ZhHansStoreHome,
      vault: grade10ZhHansVault,
    },
  },
  zzz: {
    ko: {
      auctionListing: zzzKoAuctionListing,
      chrome: zzzKoChrome,
      email: zzzKoEmail,
      head: zzzKoHead,
      identity: zzzKoIdentity,
      marketing: zzzKoMarketing,
      profile: zzzKoProfile,
      signIn: zzzKoSignIn,
      storeHome: zzzKoStoreHome,
      vault: zzzKoVault,
    },
  },
};
