import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import {
  FacebookLogo,
  InstagramLogo,
  ThreadsLogo,
} from "@phosphor-icons/react";
import { createElement, type ReactNode } from "react";
import {
  HELP_NAV_ITEM,
  PRIVACY_POLICY_HREF,
  STORE_LOCATOR_HREF,
  TERMS_OF_SERVICE_HREF,
} from "./workbench-story-nav";

/** Placeholder scan / card art for proposal fixtures. */
const SCAN_IMAGE = new URL("./product.fixture.png", import.meta.url).href;

const noop = () => {};

const NAV_LOGO: ReactNode = createElement(G10LogoMono, {
  className: "h-5 w-auto @4xl:h-7",
});
const FOOTER_LOGO: ReactNode = createElement(G10LogoMono, {
  className: "h-5 w-auto",
});

const ACCOUNT_EMAIL = "collector@example.com";

/** Storybook ids for vault proposal pages (workbench deep links). */
const VAULT_SUBMIT_STORY_ID = "pages-vault-submit--default";
const VAULT_CONFIRMATION_STORY_ID =
  "pages-vault-submission-confirmation--default";
const VAULT_TRACKER_STORY_ID = "pages-vault-intake-tracker--in-transit";
const VAULT_PORTFOLIO_STORY_ID = "pages-vault-portfolio--filled";
const VAULT_ITEM_DETAIL_STORY_ID = "pages-vault-item-detail--in-vault";
const VAULT_RETRIEVAL_STORY_ID = "pages-vault-request-retrieval--default";

function storyHref(storyId: string): string {
  return `?path=/story/${storyId}`;
}

const VAULT_PORTFOLIO_HREF = storyHref(VAULT_PORTFOLIO_STORY_ID);
const VAULT_SUBMIT_HREF = storyHref(VAULT_SUBMIT_STORY_ID);
const VAULT_ITEM_DETAIL_HREF = storyHref(VAULT_ITEM_DETAIL_STORY_ID);
const VAULT_RETRIEVAL_HREF = storyHref(VAULT_RETRIEVAL_STORY_ID);
const VAULT_TRACKER_HREF = storyHref(VAULT_TRACKER_STORY_ID);
const VAULT_CONFIRMATION_HREF = storyHref(VAULT_CONFIRMATION_STORY_ID);

type VaultAssetStatus =
  | "Submitted"
  | "In transit"
  | "At store"
  | "Intake"
  | "Imaging"
  | "In Vault"
  | "Retrieval pending"
  | "Listed on Auction";

type ValuationSource = "Declared" | "Intake estimate" | "Market";

type VaultAsset = {
  id: string;
  name: string;
  set: string;
  grade: string;
  cert: string;
  vaultId: string | null;
  status: VaultAssetStatus;
  estimateHkd: number;
  valuationSource: ValuationSource;
  imageSrc: string;
};

const VAULT_ASSETS: VaultAsset[] = [
  {
    id: "va-001",
    name: "1999 Charizard",
    set: "Base Set · Holofoil",
    grade: "PSA 10",
    cert: "51234567",
    vaultId: "G10-VLT-004821",
    status: "In Vault",
    estimateHkd: 98000,
    valuationSource: "Intake estimate",
    imageSrc: SCAN_IMAGE,
  },
  {
    id: "va-002",
    name: "2023 Pikachu SAR",
    set: "Scarlet & Violet · 151",
    grade: "PSA 10",
    cert: "81220991",
    vaultId: "G10-VLT-004902",
    status: "In Vault",
    estimateHkd: 42000,
    valuationSource: "Intake estimate",
    imageSrc: SCAN_IMAGE,
  },
  {
    id: "va-003",
    name: "2000 Blastoise",
    set: "Base Set 2",
    grade: "BGS 9.5",
    cert: "00110283",
    vaultId: null,
    status: "Imaging",
    estimateHkd: 18500,
    valuationSource: "Declared",
    imageSrc: SCAN_IMAGE,
  },
  {
    id: "va-004",
    name: "2020 Umbreon VMAX",
    set: "Evolving Skies",
    grade: "CGC 10",
    cert: "44129001",
    vaultId: null,
    status: "In transit",
    estimateHkd: 27600,
    valuationSource: "Declared",
    imageSrc: SCAN_IMAGE,
  },
];

const PORTFOLIO_SUMMARY = {
  itemCount: VAULT_ASSETS.filter((a) => a.status === "In Vault").length,
  totalEstimateHkd: VAULT_ASSETS.filter((a) => a.status === "In Vault").reduce(
    (sum, a) => sum + a.estimateHkd,
    0,
  ),
  valuationNote: "Estimates use intake when set; otherwise declared value",
  feeStatus: "Launch offer — storage free until 2026-12-31",
};

const VAULT_SITE_HEADER = {
  copy: {
    locale: "English",
    account: "Account",
    cart: "Cart",
    signIn: "Sign In",
    menu: "Menu",
    menuTitle: "Menu",
    language: "Language",
    accountMenuLabel: "Account",
    profile: "Profile",
    myOrders: "My Orders",
    myAuctions: "My Auctions",
    signOut: "Sign Out",
  },
  session: "signed-in" as const,
  accountEmail: ACCOUNT_EMAIL,
  promo: null as string | null,
  logo: NAV_LOGO,
  logoHref: "/",
  locales: [
    { value: "en", label: "English" },
    { value: "zh-Hant", label: "繁體中文" },
    { value: "zh-Hans", label: "简体中文" },
  ],
  locale: "en",
  utilityLinks: [],
  navItems: [
    { label: "Store", href: "#shop" },
    { label: "Auction", href: "#auction" },
    { label: "Vault", href: VAULT_PORTFOLIO_HREF, current: true },
    { label: "Store Locator", href: STORE_LOCATOR_HREF },
    { ...HELP_NAV_ITEM },
  ],
  onLocaleChange: noop,
  onSignIn: noop,
  onProfile: noop,
  onMyAuctions: noop,
  onSignOut: noop,
  onCartClick: noop,
};

const SOCIAL_ICON_PROPS = {
  "aria-hidden": true,
  size: 16,
  weight: "fill",
} as const;

const VAULT_FOOTER = {
  copy: {
    attribution: "A division of MemeStrategy (HKEX: 2440)",
    copyright: "© 2026 Grade10. All rights reserved.",
  },
  logo: FOOTER_LOGO,
  logoHref: "/",
  socialLinks: [
    {
      label: "Instagram",
      href: "https://www.instagram.com/grade10hk/",
      external: true,
      icon: createElement(InstagramLogo, SOCIAL_ICON_PROPS),
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/grade10hk/",
      external: true,
      icon: createElement(FacebookLogo, SOCIAL_ICON_PROPS),
    },
    {
      label: "Threads",
      href: "https://www.threads.com/@grade10hk",
      external: true,
      icon: createElement(ThreadsLogo, SOCIAL_ICON_PROPS),
    },
  ],
  legalLinks: [],
  columns: [
    {
      heading: "VAULT",
      links: [
        { label: "My Portfolio", href: VAULT_PORTFOLIO_HREF },
        { label: "Submit to Vault", href: VAULT_SUBMIT_HREF },
      ],
    },
    {
      heading: "HELP",
      links: [
        { label: "Store Locator", href: STORE_LOCATOR_HREF },
        { label: "Docs", href: "/docs", external: true },
      ],
    },
    {
      heading: "LEGAL",
      links: [
        { label: "Privacy Policy", href: PRIVACY_POLICY_HREF },
        { label: "Terms of Service", href: TERMS_OF_SERVICE_HREF },
      ],
    },
  ],
};

const MANIFEST_FIXTURE = {
  submissionId: "SUB-2026-09140",
  qrCode: "G10-SUB-202609140-QR",
  email: ACCOUNT_EMAIL,
  phone: "+852 9123 4567",
  items: [
    {
      name: "1999 Charizard · Base Set Holofoil",
      grade: "PSA 10",
      cert: "51234567",
      declaredHkd: 95000,
    },
    {
      name: "2023 Pikachu SAR · SV 151",
      grade: "PSA 10",
      cert: "81220991",
      declaredHkd: 40000,
    },
  ],
  packingTips: [
    "Put each slab in a team bag",
    "Wrap in bubble wrap",
    "Use a hard box",
    "Insert packing slip inside",
    "Tape shipping label outside",
  ],
};

function formatHkd(amount: number): string {
  return `HK$${amount.toLocaleString("en-HK")}`;
}

function statusBadgeVariant(
  status: VaultAssetStatus,
): "default" | "success" | "warning" | "info" | "brand" {
  switch (status) {
    case "In Vault":
      return "success";
    case "In transit":
    case "At store":
    case "Intake":
    case "Imaging":
      return "info";
    case "Retrieval pending":
      return "warning";
    case "Listed on Auction":
      return "brand";
    default:
      return "default";
  }
}

export type { ValuationSource, VaultAsset, VaultAssetStatus };
export {
  formatHkd,
  MANIFEST_FIXTURE,
  PORTFOLIO_SUMMARY,
  SCAN_IMAGE,
  statusBadgeVariant,
  VAULT_ASSETS,
  VAULT_CONFIRMATION_HREF,
  VAULT_CONFIRMATION_STORY_ID,
  VAULT_FOOTER,
  VAULT_ITEM_DETAIL_HREF,
  VAULT_ITEM_DETAIL_STORY_ID,
  VAULT_PORTFOLIO_HREF,
  VAULT_PORTFOLIO_STORY_ID,
  VAULT_RETRIEVAL_HREF,
  VAULT_RETRIEVAL_STORY_ID,
  VAULT_SITE_HEADER,
  VAULT_SUBMIT_HREF,
  VAULT_SUBMIT_STORY_ID,
  VAULT_TRACKER_HREF,
  VAULT_TRACKER_STORY_ID,
};
