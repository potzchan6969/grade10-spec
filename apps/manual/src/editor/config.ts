import { STORE_REPO } from "../api/paths";

/** The repo every hosted write goes to. Named once, in `api/paths`. */
export const REPO = STORE_REPO;

export const GITHUB_API = "https://api.github.com";

/** Where a fine-grained PAT is minted, linked from the settings dialog with
 * the two fields GitHub's own form reads from the URL. The repository and the
 * permissions are not among them — the dialog spells those out instead. */
export const TOKEN_SETTINGS_URL = `https://github.com/settings/personal-access-tokens/new?name=${encodeURIComponent(
  "Grade10 Manual",
)}&description=${encodeURIComponent(
  `Editing ${REPO.owner}/${REPO.repo} from the Grade10 Manual`,
)}`;

/** Where a pending organization approval is seen, named in the refusal a
 * 404 produces. */
export const TOKEN_LIST_URL =
  "https://github.com/settings/personal-access-tokens";

export const STORAGE = {
  token: "manual.github.token",
  /** The verdict GitHub gave that token: who it belongs to, and that it
   * reaches this repo. Written by verification alone. */
  verified: "manual.github.verified",
  /** Hosted only: the staged set, keyed by page path. */
  drafts: "manual.drafts",
  /** Dev only: the handle a proposal's author line carries. */
  handle: "manual.propose.handle",
  /** Set once the first-visit card has been answered — it never returns. */
  welcome: "manual.welcome",
  /** ISO date of the newest history event this reader has seen. */
  recentSeen: "manual.recent.seen",
} as const;
