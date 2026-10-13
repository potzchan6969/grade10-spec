import type {
  ProfileCardCopy,
  ProfileDetailsCopy,
  ProfileFormCopy,
} from "@grade10/ui";

/** English copy as the shared catalogue words it. */
const profile = {
  title: "My profile",
  loadFailed: "Could not load your profile.",
  displayNameLabel: "Display name",
  bioLabel: "Bio",
  editLabel: "Edit profile",
  emptyBio: "No bio yet.",
  memberSince: "Member since {date}",
};
const common = { save: "Save", cancel: "Cancel", retry: "Try again" };

/** The profile as the account page shows it. */
type ProfileView = {
  displayName: string;
  bio: string;
  /** Formatted date of the first save; absent until the collector saves. */
  memberSince?: string;
};

const PROFILE_CARD_COPY: ProfileCardCopy = {
  title: "Profile details",
};

const PROFILE_DETAILS_COPY: ProfileDetailsCopy = {
  edit: profile.editLabel,
};

const PROFILE_FORM_COPY: ProfileFormCopy = {
  displayName: profile.displayNameLabel,
  bio: profile.bioLabel,
  submit: common.save,
  cancel: common.cancel,
};

/** Draft words for states the catalogue does not hold yet. */
const PROFILE_COPY = {
  title: profile.title,
  loadFailed: profile.loadFailed,
  retry: common.retry,
  emptyBio: profile.emptyBio,
  memberSince: (date: string) => profile.memberSince.replace("{date}", date),
  emptyName: "Enter a display name to save your profile.",
  refused: "Your name could not be saved. Choose another and try again.",
  failed: "We could not save your profile. Your changes are kept.",
} as const;

/** Stand-in data: a collector whose account name is the default. */
const NEVER_SAVED_PROFILE: ProfileView = {
  displayName: "Kit Lam",
  bio: "",
};

/** A session with no account name: the address before the `@` stands in. */
const NAMELESS_PROFILE: ProfileView = {
  displayName: "kitlam",
  bio: "",
};

const SAVED_PROFILE: ProfileView = {
  displayName: "Kit Lam",
  bio: "Chasing PSA 10s since 2019.",
  memberSince: "March 2024",
};

const SEVERAL_LINES_PROFILE: ProfileView = {
  displayName: "Kit Lam",
  bio: "Chasing PSA 10s since 2019.\nSets, promos and vintage Pokémon.\nAsk me about the Base Set trades.",
  memberSince: "March 2024",
};

/** The date the first save records, for a story that saves. */
const FIRST_SAVE_DATE = "October 2026";

export type { ProfileView };
export {
  FIRST_SAVE_DATE,
  NAMELESS_PROFILE,
  NEVER_SAVED_PROFILE,
  PROFILE_CARD_COPY,
  PROFILE_COPY,
  PROFILE_DETAILS_COPY,
  PROFILE_FORM_COPY,
  SAVED_PROFILE,
  SEVERAL_LINES_PROFILE,
};
