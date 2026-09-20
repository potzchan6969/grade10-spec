/**
 * The three calls the relay makes on the code host: what a landing sha changed
 * against `main`, one file as it reads at that sha, and the fast-forward that
 * moves `main`.
 *
 * Thin wrappers on purpose — the decision they serve is in `land.ts`, which is
 * pure and reads what these fetched. A host that answers anything else throws
 * `HostError`, which the room answers as the host being unavailable rather
 * than as the relay being broken.
 */
import { fromBase64, fromUtf8 } from "./bytes.ts";

const API = "https://api.github.com";

/** What the compare answer carries at most. A landing wider than this is not
 * a landing this relay is asked to move: the answer is truncated, so the
 * paths it lists are not all of them. */
export const COMPARE_MAX = 300;

export interface GithubRepo {
  /** `owner/name`. */
  repo: string;
  token: string;
}

/** The host answered something the relay cannot read as either an answer or a
 * refusal. */
export class HostError extends Error {
  readonly status: number;
  /** What the host itself said, which travels into the answer a run reads:
   * "unavailable" alone gives the thread nothing to say. */
  readonly detail: string;

  constructor(call: string, status: number, body: string) {
    super(`${call}: ${status} ${body}`);
    this.name = "HostError";
    this.status = status;
    this.detail = body;
  }
}

export type Compare = { paths: string[] } | { truncated: true };

export type Advance =
  | { landed: string }
  | { refused: "not-fast-forward" }
  | { refused: "host-refused"; message: string };

function headers(repo: GithubRepo): HeadersInit {
  return {
    authorization: `Bearer ${repo.token}`,
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    // The code host refuses a request with no agent.
    "user-agent": "grade10-relay",
  };
}

/** One call's url. Every piece a caller gave is escaped — a repository and a
 * file path carry slashes of their own, so each is escaped segment by segment
 * — and the url is built rather than spelled, so nothing a caller passes can
 * reach the host as a path of its own. */
function apiUrl(path: string): URL {
  return new URL(path, API);
}

const segments = (value: string): string =>
  value.split("/").map(encodeURIComponent).join("/");

async function refusal(response: Response): Promise<string> {
  const text = await response.text();
  try {
    return String((JSON.parse(text) as { message?: unknown }).message ?? text);
  } catch {
    return text;
  }
}

/** Every path the landing sha changed against `base`, or the word that the
 * host listed only some of them. */
export async function compareFiles(
  repo: GithubRepo,
  base: string,
  sha: string,
): Promise<Compare> {
  const response = await fetch(
    apiUrl(
      `repos/${segments(repo.repo)}/compare/${encodeURIComponent(base)}...${encodeURIComponent(sha)}`,
    ),
    { headers: headers(repo) },
  );
  if (!response.ok)
    throw new HostError("compare", response.status, await refusal(response));
  const body = (await response.json()) as {
    files?: { filename?: string }[];
  };
  const files = body.files ?? [];
  if (files.length >= COMPARE_MAX) return { truncated: true };
  return { paths: files.map((file) => String(file.filename ?? "")) };
}

/** One file as it reads at `sha`. The contents API answers base64 wrapped in
 * newlines, and an answer carrying no content at all is the read having gone
 * wrong: reading it as the empty string would send a landing through its
 * checks against a record nobody wrote. */
export async function readFileAt(
  repo: GithubRepo,
  path: string,
  sha: string,
): Promise<string> {
  const response = await fetch(
    apiUrl(
      `repos/${segments(repo.repo)}/contents/${segments(path)}?ref=${encodeURIComponent(sha)}`,
    ),
    { headers: headers(repo) },
  );
  if (!response.ok)
    throw new HostError(
      `contents ${path}`,
      response.status,
      await refusal(response),
    );
  const body = (await response.json()) as { content?: unknown };
  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (content === "")
    throw new HostError(`contents ${path}`, response.status, "no content");
  return fromUtf8(fromBase64(content));
}

/** Move `main` to `sha`, and only forwards: `force: false` is what makes the
 * relay unable to lose a commit somebody else landed first. The code host
 * answers 422 both when the move is not a fast-forward and when it refuses the
 * move for its own reasons, so the answer is read by its message. */
export async function advanceMain(
  repo: GithubRepo,
  sha: string,
): Promise<Advance> {
  const response = await fetch(
    apiUrl(`repos/${segments(repo.repo)}/git/refs/heads/main`),
    {
      method: "PATCH",
      headers: { ...headers(repo), "content-type": "application/json" },
      body: JSON.stringify({ sha, force: false }),
    },
  );
  if (response.status === 422) {
    const message = await refusal(response);
    return /not a fast forward/i.test(message)
      ? { refused: "not-fast-forward" }
      : { refused: "host-refused", message };
  }
  if (!response.ok)
    throw new HostError(
      "advance main",
      response.status,
      await refusal(response),
    );
  return { landed: sha };
}
