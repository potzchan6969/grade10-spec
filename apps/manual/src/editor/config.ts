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
  pr: "manual.github.pr",
  mode: "manual.github.mode",
  /** Hosted only: the staged set, keyed by page path. */
  drafts: "manual.drafts",
  /** Dev only: the handle a proposal's author line carries. */
  handle: "manual.propose.handle",
} as const;
