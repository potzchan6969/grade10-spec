/**
 * The three calls the relay makes on the code host: what a landing sha changed
 * against `main`, one file as it reads at that sha, and the fast-forward that
 * moves `main`.
 *
 * Thin wrappers on purpose — the decision they serve is in `land.ts`, which is
 * pure and reads what these fetched.
 */
import { fromBase64, fromUtf8 } from "./bytes.ts";

const API = "https://api.github.com";

export interface GithubRepo {
  /** `owner/name`. */
  repo: string;
  token: string;
}

export interface ComparedFile {
  path: string;
  /** The unified diff of that file, as the compare answer carries it. A file
   * too large to diff carries none. */
  patch: string;
}

export type Advance = { landed: string } | { reason: "not-fast-forward" };

function headers(repo: GithubRepo): HeadersInit {
  return {
    authorization: `Bearer ${repo.token}`,
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
    // The code host refuses a request with no agent.
    "user-agent": "grade10-relay",
  };
}

async function failure(response: Response, call: string): Promise<never> {
  throw new Error(`${call}: ${response.status} ${await response.text()}`);
}

/** Every file the landing sha changed against `base`. The compare answer lists
 * up to 300 files; a landing wider than that is not a landing this relay is
 * asked to move. */
export async function compareFiles(
  repo: GithubRepo,
  base: string,
  sha: string,
): Promise<ComparedFile[]> {
  const response = await fetch(
    `${API}/repos/${repo.repo}/compare/${base}...${sha}`,
    { headers: headers(repo) },
  );
  if (!response.ok) await failure(response, "compare");
  const body = (await response.json()) as {
    files?: { filename?: string; patch?: string }[];
  };
  return (body.files ?? []).map((file) => ({
    path: String(file.filename ?? ""),
    patch: String(file.patch ?? ""),
  }));
}

/** One file as it reads at `sha`. The contents API answers base64 wrapped in
 * newlines. */
export async function readFileAt(
  repo: GithubRepo,
  path: string,
  sha: string,
): Promise<string> {
  const response = await fetch(
    `${API}/repos/${repo.repo}/contents/${path}?ref=${sha}`,
    { headers: headers(repo) },
  );
  if (!response.ok) await failure(response, `contents ${path}`);
  const body = (await response.json()) as { content?: string };
  return fromUtf8(fromBase64(String(body.content ?? "")));
}

/** Move `main` to `sha`, and only forwards: `force: false` is what makes the
 * relay unable to lose a commit somebody else landed first. The code host
 * answers 422 when the move is not a fast-forward. */
export async function advanceMain(
  repo: GithubRepo,
  sha: string,
): Promise<Advance> {
  const response = await fetch(
    `${API}/repos/${repo.repo}/git/refs/heads/main`,
    {
      method: "PATCH",
      headers: { ...headers(repo), "content-type": "application/json" },
      body: JSON.stringify({ sha, force: false }),
    },
  );
  if (response.status === 422) return { reason: "not-fast-forward" };
  if (!response.ok) await failure(response, "advance main");
  return { landed: sha };
}
