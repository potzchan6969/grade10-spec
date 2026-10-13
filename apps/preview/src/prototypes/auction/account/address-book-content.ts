import type { AuctionAddressFormValues } from "@grade10/ui";

/** The manual page these wireframes settle, under grade10-site. */
export const ADDRESS_BOOK_MANUAL_PATH = "auction/account";

/** Saved addresses an account may hold; a one-time address is not saved. */
export const ADDRESS_BOOK_CAP = 5;

export type AddressBookState = "empty" | "saved" | "add" | "edit" | "full-book";

export const ADDRESS_BOOK_STORY_IDS = {
  empty: "auction-account-prototypes-address-book--empty",
  saved: "auction-account-prototypes-address-book--saved",
  add: "auction-account-prototypes-address-book--add",
  edit: "auction-account-prototypes-address-book--edit",
  "full-book": "auction-account-prototypes-address-book--full-book",
} as const satisfies Record<AddressBookState, string>;

/** The form's words, as the shared catalog spells them in English. */
export const ADDRESS_FORM_COPY = {
  personal: "Personal",
  companyKind: "Company",
  firstName: "First Name",
  lastName: "Last Name",
  phone: "Phone",
  company: "Company Name",
  country: "Country/Region",
  city: "Town/City",
  addressLine1: "Address Line 1",
  addressLine2: "Address Line 2",
  apartment: "Apt./Suite/Building",
  state: "State/Province/Region",
  postalCode: "Postal Code",
  optional: "Optional",
  confirm: "Confirm",
  cancel: "Cancel",
  phonePlaceholder: "+852 12345678",
  countrySearchPlaceholder: "e.g. United States",
};

const HOME: AuctionAddressFormValues = {
  addressKind: "personal",
  firstName: "Alex",
  lastName: "Chan",
  phone: "+85261234567",
  phoneCountry: "HK",
  company: "",
  country: "Hong Kong",
  city: "Wan Chai",
  addressLine1: "12/F, Tower 1, 1 Harbour Road",
  addressLine2: "",
  apartment: "",
  state: "",
  postalCode: "",
};

const OFFICE: AuctionAddressFormValues = {
  ...HOME,
  addressKind: "company",
  company: "Chan & Co.",
  city: "Causeway Bay",
  addressLine1: "Office 1204, 88 Hysan Avenue",
};

/** Saved addresses in the book, the default first. */
export const SAVED_ADDRESSES = [
  { id: "home", label: "Home", isDefault: true, values: HOME },
  { id: "office", label: "Office", isDefault: false, values: OFFICE },
  {
    id: "parents",
    label: "Parents",
    isDefault: false,
    values: {
      ...HOME,
      firstName: "Mei",
      lastName: "Chan",
      city: "Kowloon Tong",
      addressLine1: "Flat 7, 20 Beech Street",
    },
  },
  {
    id: "studio",
    label: "Studio",
    isDefault: false,
    values: {
      ...OFFICE,
      company: "Chan Studio",
      city: "Sheung Wan",
      addressLine1: "Unit 3, 22 Des Voeux Road",
    },
  },
  {
    id: "storage",
    label: "Storage",
    isDefault: false,
    values: {
      ...HOME,
      firstName: "Alex",
      city: "Tsuen Wan",
      addressLine1: "Block B, 5 Castle Peak Road",
    },
  },
] as const;

export const ADDRESS_BOOK_COPY = {
  title: "Address book",
  description:
    "The addresses you confirm onto an order you win. Your book keeps up to five.",
  saved: "Saved addresses",
  defaultLabel: "Default",
  edit: "Edit",
  remove: "Remove",
  add: "Add an address",
  full: "The book is full: five saved addresses. Remove one to save another.",
  oneTime:
    "A one-time address can still be confirmed onto an order without being saved.",
  empty: {
    title: "No saved addresses",
    description: "Save an address to confirm it onto an order you win.",
  },
  addTitle: "Add an address",
  editTitle: "Edit address",
  useDefault: "Use as the default address",
} as const;
