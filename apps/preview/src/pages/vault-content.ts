import { G10LogoMono } from "@grade10/design-system/components/display/g10-logo-mono";
import type {
  BookingConfirmationCopy,
  BookingDay,
  BookingDetailsFormCopy,
  BookingLocation,
  BookingManageCardCopy,
  BookingRecord,
  BookingRecordState,
  BookingService,
  BookingServicePickerCopy,
  BookingSlot,
  BookingSlotPickerCopy,
  BookingSummaryCopy,
} from "@grade10/ui";
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
const VAULT_BOOK_VISIT_STORY_ID = "pages-appointment-book-visit--default";
const VAULT_CONFIRMATION_STORY_ID = "pages-appointment-confirmation--default";
const VAULT_MY_VISITS_STORY_ID = "pages-appointment-appointments--default";
const VAULT_MANAGE_VISIT_STORY_ID = VAULT_MY_VISITS_STORY_ID;
const INTAKE_TRACKER_STORY_ID = "pages-submissions--in-progress";
const VAULT_PORTFOLIO_STORY_ID = "pages-vault-portfolio--filled";
const VAULT_ITEM_DETAIL_STORY_ID = "pages-vault-item-detail--in-vault";
const VAULT_RETRIEVAL_STORY_ID = "pages-vault-request-retrieval--default";
/** Storybook ids for vault item-card assemblies (workbench deep links). */
const VAULT_ITEM_CARD_IN_VAULT_STORY_ID =
  "pages-vault-vault-item-card--in-vault";
const VAULT_ITEM_CARD_RETRIEVAL_STORY_ID =
  "pages-vault-vault-item-card--retrieval-pending";
const ACTIVE_INTAKE_ALERT_STORY_ID =
  "pages-vault-active-intake-alert--with-submissions";

const VAULT_SUBMIT_STORY_ID = VAULT_BOOK_VISIT_STORY_ID;

function storyHref(storyId: string): string {
  return `?path=/story/${storyId}`;
}

const VAULT_PORTFOLIO_HREF = storyHref(VAULT_PORTFOLIO_STORY_ID);
const VAULT_BOOK_VISIT_HREF = storyHref(VAULT_BOOK_VISIT_STORY_ID);
const VAULT_SUBMIT_HREF = VAULT_BOOK_VISIT_HREF;
const VAULT_ITEM_DETAIL_HREF = storyHref(VAULT_ITEM_DETAIL_STORY_ID);
const VAULT_RETRIEVAL_HREF = storyHref(VAULT_RETRIEVAL_STORY_ID);
const VAULT_ITEM_CARD_IN_VAULT_HREF = storyHref(
  VAULT_ITEM_CARD_IN_VAULT_STORY_ID,
);
const VAULT_ITEM_CARD_RETRIEVAL_HREF = storyHref(
  VAULT_ITEM_CARD_RETRIEVAL_STORY_ID,
);
const ACTIVE_INTAKE_ALERT_HREF = storyHref(ACTIVE_INTAKE_ALERT_STORY_ID);
const INTAKE_TRACKER_HREF = storyHref(INTAKE_TRACKER_STORY_ID);
const VAULT_CONFIRMATION_HREF = storyHref(VAULT_CONFIRMATION_STORY_ID);
const VAULT_MANAGE_VISIT_HREF = storyHref(VAULT_MANAGE_VISIT_STORY_ID);
const VAULT_MY_VISITS_HREF = storyHref(VAULT_MY_VISITS_STORY_ID);

/** Inventory register categories — [Items](docs/prds/products/grade10-admin/inventory/items.md). */
const REGISTER_CATEGORIES = [
  { value: "trading-card", label: "Trading card" },
  { value: "comic", label: "Comic" },
  { value: "coin", label: "Coin" },
  { value: "banknote", label: "Banknote" },
  { value: "stamp", label: "Stamp" },
  { value: "bullion", label: "Bullion" },
  { value: "watch", label: "Watch" },
  { value: "jewellery", label: "Jewellery" },
  { value: "memorabilia", label: "Memorabilia" },
  { value: "other", label: "Other" },
] as const;

type RegisterCategory = (typeof REGISTER_CATEGORIES)[number]["value"];
type ItemCondition = "Graded" | "Raw";

type VaultAssetStatus =
  | "Registered"
  | "Pre-check"
  | "Signing"
  | "Imaging"
  | "In Vault"
  | "Retrieval pending"
  | "Listed on Auction";

type ValuationSource = "Declared" | "Intake estimate" | "Market";

type VaultAsset = {
  id: string;
  name: string;
  category: RegisterCategory;
  categoryLabel: string;
  condition: ItemCondition;
  grade: string;
  cert: string | null;
  vaultId: string | null;
  status: VaultAssetStatus;
  estimateHkd: number;
  valuationSource: ValuationSource;
  imageSrc: string;
};

/**
 * Holdings the portfolio may show — vaulted and verified only. Intake stages
 * (registered, pre-check, signing, imaging) stay on Submissions until
 * the item is in the vault; collectors expect auction and retrieval from here.
 */
const PORTFOLIO_HOLDING_STATUSES: readonly VaultAssetStatus[] = [
  "In Vault",
  "Retrieval pending",
  "Listed on Auction",
];

function isPortfolioHolding(asset: VaultAsset): boolean {
  return PORTFOLIO_HOLDING_STATUSES.includes(asset.status);
}

const VAULT_ASSETS: VaultAsset[] = [
  {
    id: "va-001",
    name: "1999 Charizard",
    category: "trading-card",
    categoryLabel: "Trading card · Base Set Holofoil",
    condition: "Graded",
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
    name: "Rolex Submariner Date",
    category: "watch",
    categoryLabel: "Watch · 126610LN",
    condition: "Raw",
    grade: "Raw",
    cert: null,
    vaultId: "G10-VLT-004910",
    status: "In Vault",
    estimateHkd: 72000,
    valuationSource: "Intake estimate",
    imageSrc: SCAN_IMAGE,
  },
  {
    id: "va-003",
    name: "1986 Fleer Michael Jordan",
    category: "trading-card",
    categoryLabel: "Trading card · Rookie",
    condition: "Graded",
    grade: "PSA 9",
    cert: "27710412",
    vaultId: "G10-VLT-004755",
    status: "Retrieval pending",
    estimateHkd: 156000,
    valuationSource: "Intake estimate",
    imageSrc: SCAN_IMAGE,
  },
];

const PORTFOLIO_ASSETS = VAULT_ASSETS.filter(isPortfolioHolding);

const PORTFOLIO_SUMMARY = {
  itemCount: PORTFOLIO_ASSETS.length,
  totalEstimateHkd: PORTFOLIO_ASSETS.reduce((sum, a) => sum + a.estimateHkd, 0),
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
        { label: "Book a visit", href: VAULT_BOOK_VISIT_HREF },
        { label: "Appointments", href: VAULT_MY_VISITS_HREF },
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

const VISIT_TIME_ZONE = "Asia/Hong_Kong";
/** Shop-local today the Book Visit calendar is drawn on. */
const VISIT_TODAY = "2026-09-01";
const VISIT_TODAY_DATE = new Date(2026, 8, 1);
/** Last bookable day: three months from today. */
const VISIT_HORIZON = "2026-12-01";
const VISIT_MIN_MONTH = "2026-09";
const VISIT_MAX_MONTH = "2026-12";

function padDatePart(value: number): string {
  return String(value).padStart(2, "0");
}

function ymd(year: number, monthIndex: number, day: number): string {
  return `${year}-${padDatePart(monthIndex + 1)}-${padDatePart(day)}`;
}

/** Days of the caption months; pickable from the day after today through the horizon, Sundays excepted. */
const VISIT_DAYS: readonly BookingDay[] = (() => {
  const days: BookingDay[] = [];
  for (let monthIndex = 8; monthIndex <= 11; monthIndex += 1) {
    const count = new Date(Date.UTC(2026, monthIndex + 1, 0)).getUTCDate();
    for (let day = 1; day <= count; day += 1) {
      const date = ymd(2026, monthIndex, day);
      const sunday =
        new Date(Date.UTC(2026, monthIndex, day)).getUTCDay() === 0;
      days.push({
        date,
        available: !sunday && date > VISIT_TODAY && date <= VISIT_HORIZON,
      });
    }
  }
  return days;
})();

const NEXT_AVAILABLE_VISIT_DATE = VISIT_DAYS.find((day) => day.available)?.date;

/** First pickable day in a `YYYY-MM` caption month, if any. */
function firstAvailableVisitDay(month: string): string | undefined {
  return VISIT_DAYS.find(
    (day) => day.available && day.date.startsWith(`${month}-`),
  )?.date;
}

function slotsForVisitDay(date: string): readonly BookingSlot[] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return [];
  const start10 = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    2,
    0,
  );
  return [0, 15, 30, 45, 75, 90, 105].map((minutes) => ({
    start: start10 + minutes * 60_000,
    end: start10 + (minutes + 30) * 60_000,
    remaining: 1,
  }));
}

const VISIT_SLOTS: readonly BookingSlot[] = slotsForVisitDay(
  NEXT_AVAILABLE_VISIT_DATE ?? VISIT_HORIZON,
);

const SLOT_PICKER_COPY: BookingSlotPickerCopy = {
  dayTitle: "Choose a Day",
  timeTitle: "Choose a Time",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  timesIn: "Times in",
  pickADay: "Choose a day to see its times.",
  noTimes: "Nothing is free on this day.",
};

const SHOP_NAME = "Hong Kong Grade10 Store";
const SHOP_ADDRESS = "13 Pak Sha Road, Causeway Bay, Hong Kong";

const GRADING_VISIT_SERVICE: BookingService = {
  id: "svc_grading",
  slug: "grading",
  name: "Grading Submission",
  description: "Tell us a bit about the items you plan to submit for grading.",
  durationLabel: "~30 min",
  questions: [
    {
      key: "quantity",
      label: "Estimated Quantity",
      kind: "select",
      options: ["1–5 cards", "6–20 cards", "21+ cards"],
      required: true,
    },
    {
      key: "company",
      label: "Preferred Grading Company",
      kind: "radio",
      options: ["PSA", "Beckett (BGS)", "CGC", "Undecided / Need Advice"],
      required: true,
    },
    {
      key: "value",
      label: "Estimated Total Value (HKD)",
      kind: "number",
      required: false,
      placeholder: "10,000",
      prefix: "$",
      hint: "For insurance reference",
    },
    {
      key: "notes",
      label: "Additional Notes",
      kind: "long_text",
      required: false,
      placeholder:
        "Any specific cards or requests you’d like us to know in advance?",
    },
  ],
};

const VAULT_DROP_OFF_SERVICE: BookingService = {
  id: "svc_vault_drop_off",
  slug: "vault-drop-off",
  name: "Vault Drop-Off",
  description: "Help us prepare for your item intake and security logging.",
  durationLabel: "~30 min",
  questions: [
    {
      key: "itemType",
      label: "Item Type",
      kind: "checkboxes",
      options: [
        "Graded Slabs (PSA / BGS / CGC)",
        "Ungraded / Raw Cards",
        "Sealed Boxes / Booster Packs",
        "Others",
      ],
      required: true,
    },
    {
      key: "count",
      label: "Estimated Item Count",
      kind: "select",
      options: ["1–5 items", "6–15 items", "16+ items"],
      required: true,
    },
    {
      key: "value",
      label: "Estimated Total Vault Value (HKD)",
      kind: "number",
      required: true,
      placeholder: "50,000",
      prefix: "$",
      hint: "For initial coverage during intake",
    },
  ],
};

const CONSULTATION_VISIT_SERVICE: BookingService = {
  id: "svc_consultation",
  slug: "consultation",
  name: "Store/Auction Listing",
  description:
    "Let us know what you would like to discuss with our specialists.",
  durationLabel: "~60 min",
  questions: [
    {
      key: "topic",
      label: "Consultation Topic",
      kind: "select",
      options: [
        "Consignment / Listing items on Auction",
        "Private Sales & Buying Advice",
        "Vault Portfolio Review",
        "Other Enquiries",
      ],
      required: true,
    },
    {
      key: "details",
      label: "Details of Your Collection / Inquiry",
      kind: "long_text",
      required: true,
      placeholder:
        "Briefly describe the key items you’d like to consult on (e.g., 1997 Pokémon Carddass PSA 10, looking to consignment).",
    },
  ],
};

const BOOK_VISIT_SERVICES: readonly BookingService[] = [
  GRADING_VISIT_SERVICE,
  VAULT_DROP_OFF_SERVICE,
  CONSULTATION_VISIT_SERVICE,
];

const CAUSEWAY_BAY: BookingLocation = {
  id: "loc_causeway_bay",
  slug: "causeway-bay",
  name: SHOP_NAME,
  address: SHOP_ADDRESS,
  timeZone: VISIT_TIME_ZONE,
};

const VISIT_RECORD: BookingRecord = {
  id: "bk_vault",
  service: VAULT_DROP_OFF_SERVICE.name,
  location: SHOP_NAME,
  address: SHOP_ADDRESS,
  timeZone: VISIT_TIME_ZONE,
  start: Date.UTC(2026, 8, 3, 2, 15),
  end: Date.UTC(2026, 8, 3, 2, 45),
  state: "booked",
};

const GRADING_VISIT_RECORD: BookingRecord = {
  ...VISIT_RECORD,
  id: "bk_grading",
  service: GRADING_VISIT_SERVICE.name,
  start: Date.UTC(2026, 8, 10, 6, 0),
  end: Date.UTC(2026, 8, 10, 7, 0),
};

const COMPLETED_VISIT_RECORD: BookingRecord = {
  ...VISIT_RECORD,
  id: "bk_vault_done",
  start: Date.UTC(2026, 7, 24, 2, 0),
  end: Date.UTC(2026, 7, 24, 2, 30),
  state: "completed",
};

const VISIT_NOW_MS = Date.UTC(2026, 8, 1, 4, 0);

const BOOKING_STATE_LABELS: Record<BookingRecordState, string> = {
  booked: "Booked",
  checked_in: "Checked in",
  cancelled: "Cancelled",
  completed: "Visited",
  no_show: "Missed",
};

const SERVICE_PICKER_COPY: BookingServicePickerCopy = {
  title: "Choose a Service",
};

const BOOK_VISIT_NAV_COPY = {
  continue: "Choose a Date and Time",
  change: "Change",
  changeService: "Change service",
  changeDate: "Change date",
  prepTitle: "What to Prepare",
};

const DETAILS_FORM_COPY: BookingDetailsFormCopy = {
  title: "Your Details",
  name: "Name",
  email: "Email",
  phone: "Phone",
  phonePlaceholder: "+852 12345678",
  countrySearchPlaceholder: "e.g. United States",
  optional: "optional",
  nameMissing: "Tell us your name.",
  emailMissing: "Tell us where to send the confirmation.",
  emailInvalid: "That doesn’t look like an email address.",
  phoneMissing: "Enter a phone number.",
  answerMissing: "This is needed to continue.",
  choose: "Choose",
  submit: "Confirm Appointment",
};

const SUMMARY_COPY: BookingSummaryCopy = {
  title: "Your Visit",
  service: "Service",
  location: "Shop",
  when: "When",
};

const MANAGE_CARD_COPY: BookingManageCardCopy = {
  service: "Service",
  location: "Shop",
  when: "When",
  state: BOOKING_STATE_LABELS,
  move: "Move the visit",
  cancel: "Cancel the visit",
  cancelTitle: "Cancel this visit?",
  cancelBody: "The desk goes back to being free, and we’ll send you a note.",
  cancelConfirm: "Yes, cancel it",
  cancelKeep: "Keep it",
};

const APPOINTMENTS_COPY = {
  upcomingHeading: "Upcoming",
  pastHeading: "Past",
  emptyTitle: "No appointments yet",
  emptyDescription: "Book a visit and it shows up here.",
};

const VISIT_CONFIRMATION_COPY: BookingConfirmationCopy = {
  title: "You’re booked",
  body: "We’ve sent the details to your email, with a calendar file.",
  service: "Service",
  location: "Shop",
  when: "When",
  beforeYouCome: "Before you come",
  answers: "What you told us",
  manage: "Move or cancel this visit",
  calendar: "Add to calendar",
};

const VISIT_PREP_TIPS = [
  "Bring the pieces you want to vault",
  "Bring photo ID",
  "You do not need a Grade10 account",
  "Staff register each item, then you sign on the iPad",
] as const;

const GRADING_PREP_TIPS = [
  "Bring the card you want graded",
  "Bring photo ID",
  "Say at the desk if it is raw or already slabbed",
] as const;

const CONSULTATION_PREP_TIPS = [
  "Bring photos or a short list of pieces to talk through",
  "Bring photo ID",
] as const;

function prepTipsForService(serviceId: string): readonly string[] {
  if (serviceId === GRADING_VISIT_SERVICE.id) return GRADING_PREP_TIPS;
  if (serviceId === CONSULTATION_VISIT_SERVICE.id)
    return CONSULTATION_PREP_TIPS;
  return VISIT_PREP_TIPS;
}

const VISIT_FIXTURE = {
  visitId: "VIS-2026-09140",
  email: ACCOUNT_EMAIL,
  phone: "+852 9123 4567",
  shop: SHOP_NAME,
  address: SHOP_ADDRESS,
  bringTips: VISIT_PREP_TIPS,
};

function formatHkd(amount: number): string {
  return `HK$${amount.toLocaleString("en-HK")}`;
}

function assetSubtitle(asset: VaultAsset): string {
  if (asset.condition === "Graded" && asset.cert) {
    return `${asset.categoryLabel} · ${asset.grade}`;
  }
  return `${asset.categoryLabel} · Raw`;
}

function statusBadgeVariant(
  status: VaultAssetStatus,
): "default" | "success" | "warning" | "info" | "brand" {
  switch (status) {
    case "In Vault":
      return "success";
    case "Registered":
    case "Pre-check":
    case "Signing":
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

/** Item-card story for this portfolio holding (grid → card assembly). */
function vaultItemCardStoryId(asset: VaultAsset): string {
  if (asset.status === "Retrieval pending") {
    return VAULT_ITEM_CARD_RETRIEVAL_STORY_ID;
  }
  return VAULT_ITEM_CARD_IN_VAULT_STORY_ID;
}

/** Page the card opens — detail, or retrieval when pickup is pending. */
function vaultItemRelatedStoryId(asset: VaultAsset): string {
  if (asset.status === "Retrieval pending") return VAULT_RETRIEVAL_STORY_ID;
  return VAULT_ITEM_DETAIL_STORY_ID;
}

export type {
  ItemCondition,
  RegisterCategory,
  ValuationSource,
  VaultAsset,
  VaultAssetStatus,
};
export {
  ACCOUNT_EMAIL,
  ACTIVE_INTAKE_ALERT_HREF,
  ACTIVE_INTAKE_ALERT_STORY_ID,
  APPOINTMENTS_COPY,
  assetSubtitle,
  BOOK_VISIT_NAV_COPY,
  BOOK_VISIT_SERVICES,
  CAUSEWAY_BAY,
  COMPLETED_VISIT_RECORD,
  CONSULTATION_VISIT_SERVICE,
  DETAILS_FORM_COPY,
  firstAvailableVisitDay,
  formatHkd,
  GRADING_VISIT_RECORD,
  GRADING_VISIT_SERVICE,
  INTAKE_TRACKER_HREF,
  INTAKE_TRACKER_STORY_ID,
  isPortfolioHolding,
  MANAGE_CARD_COPY,
  NEXT_AVAILABLE_VISIT_DATE,
  PORTFOLIO_ASSETS,
  PORTFOLIO_HOLDING_STATUSES,
  PORTFOLIO_SUMMARY,
  prepTipsForService,
  REGISTER_CATEGORIES,
  SCAN_IMAGE,
  SERVICE_PICKER_COPY,
  SHOP_ADDRESS,
  SHOP_NAME,
  SLOT_PICKER_COPY,
  SUMMARY_COPY,
  slotsForVisitDay,
  statusBadgeVariant,
  VAULT_ASSETS,
  VAULT_BOOK_VISIT_HREF,
  VAULT_BOOK_VISIT_STORY_ID,
  VAULT_CONFIRMATION_HREF,
  VAULT_CONFIRMATION_STORY_ID,
  VAULT_DROP_OFF_SERVICE,
  VAULT_FOOTER,
  VAULT_ITEM_CARD_IN_VAULT_HREF,
  VAULT_ITEM_CARD_IN_VAULT_STORY_ID,
  VAULT_ITEM_CARD_RETRIEVAL_HREF,
  VAULT_ITEM_CARD_RETRIEVAL_STORY_ID,
  VAULT_ITEM_DETAIL_HREF,
  VAULT_ITEM_DETAIL_STORY_ID,
  VAULT_MANAGE_VISIT_HREF,
  VAULT_MANAGE_VISIT_STORY_ID,
  VAULT_MY_VISITS_HREF,
  VAULT_MY_VISITS_STORY_ID,
  VAULT_PORTFOLIO_HREF,
  VAULT_PORTFOLIO_STORY_ID,
  VAULT_RETRIEVAL_HREF,
  VAULT_RETRIEVAL_STORY_ID,
  VAULT_SITE_HEADER,
  VAULT_SUBMIT_HREF,
  VAULT_SUBMIT_STORY_ID,
  VISIT_CONFIRMATION_COPY,
  VISIT_DAYS,
  VISIT_FIXTURE,
  VISIT_MAX_MONTH,
  VISIT_MIN_MONTH,
  VISIT_NOW_MS,
  VISIT_PREP_TIPS,
  VISIT_RECORD,
  VISIT_SLOTS,
  VISIT_TIME_ZONE,
  VISIT_TODAY_DATE,
  vaultItemCardStoryId,
  vaultItemRelatedStoryId,
};
