import { STORE_REPO } from "../api/paths";

/** The repo every hosted write goes to. Named once, in `api/paths`. */
export const REPO = STORE_REPO;

export const GITHUB_API = "https://api.github.com";

export const STORAGE = {
  token: "manual.github.token",
  /** The verdict GitHub gave that token: who it belongs to, and that it
   * reaches this repo. Written by verification alone. */
  verified: "manual.github.verified",
  /** How the sign-in renews itself: the token's expiry and the refresh
   * token GitHub issued beside it. Written by sign-in and refresh alone. */
  grant: "manual.github.grant",
  /** Hosted only: the staged set, keyed by page path. */
  drafts: "manual.drafts",
  /** Dev only: the handle a proposal's author line carries. */
  handle: "manual.propose.handle",
  /** Set once the first-visit card has been answered — it never returns. */
  welcome: "manual.welcome",
  /** ISO date of the newest history event this reader has seen. */
  recentSeen: "manual.recent.seen",
} as const;
