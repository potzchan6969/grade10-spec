import { STORE_REPO } from "../api/paths";

/** The repo every hosted write goes to. Named once, in `api/paths`. */
export const REPO = STORE_REPO;

/** One branch per author, so two people never share a working branch. */
export const BRANCH_PREFIX = "manual/";

export const GITHUB_API = "https://api.github.com";

/** Where a fine-grained PAT is minted, linked from the settings dialog. */
export const TOKEN_SETTINGS_URL =
  "https://github.com/settings/personal-access-tokens/new";

export const STORAGE = {
  token: "manual.github.token",
  login: "manual.github.login",
  pr: "manual.github.pr",
} as const;
