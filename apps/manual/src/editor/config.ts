import { STORE_REPO } from "../api/paths";

/** The repo every hosted write goes to. Named once, in `api/paths`. */
export const REPO = STORE_REPO;

/** One branch per author, so two people never share a working branch. */
export const BRANCH_PREFIX = "manual/";

export const GITHUB_API = "https://api.github.com";

/** Where a save lands. `main` writes the base branch the deploy listens on,
 * so an edit is live in about a minute; `branch` proposes it instead. The
 * mode picks the ref for read and write together — the editor never loads one
 * branch while claiming to edit another. */
export const WRITE_MODES = ["main", "branch"] as const;

export type WriteMode = (typeof WRITE_MODES)[number];

export const DEFAULT_WRITE_MODE: WriteMode = "main";

export function asWriteMode(value: string | null): WriteMode {
  return value === "branch" || value === "main" ? value : DEFAULT_WRITE_MODE;
}

/** Where a fine-grained PAT is minted, linked from the settings dialog. */
export const TOKEN_SETTINGS_URL =
  "https://github.com/settings/personal-access-tokens/new";

export const STORAGE = {
  token: "manual.github.token",
  login: "manual.github.login",
  pr: "manual.github.pr",
  mode: "manual.github.mode",
  /** Dev only: the handle a proposal's author line carries. */
  handle: "manual.propose.handle",
} as const;
