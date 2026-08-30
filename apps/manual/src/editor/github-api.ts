import { GITHUB_API, REPO } from "./config";

/** The one place a GitHub request is shaped. The hosted store writes through
 * it and the header's health probe reads through it, so neither invents its
 * own headers, its own error reading, or its own path spelling. */

export type Answer = {
  status: number;
  body: Record<string, unknown> | unknown[];
  /** What GitHub sent back with it. Absent only where an answer is made up
   * rather than received — the token's expiry is read from here. */
  headers?: Headers;
};

export function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

export function repoPath(rest: string): string {
  return `/repos/${REPO.owner}/${REPO.repo}/${rest}`;
}

/** Reading a ref is `git/ref`, moving one is `git/refs` — GitHub's spelling. */
export function refPath(branch: string): string {
  return repoPath(`git/ref/heads/${encodePath(branch)}`);
}

export function updateRefPath(branch: string): string {
  return repoPath(`git/refs/heads/${encodePath(branch)}`);
}

export async function githubCall(
  http: typeof fetch,
  token: string | null,
  path: string,
  init?: RequestInit,
): Promise<Answer> {
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "x-github-api-version": "2022-11-28",
  };
  if (token) headers.authorization = `Bearer ${token}`;
  if (init?.body) headers["content-type"] = "application/json";

  const response = await http(`${GITHUB_API}${path}`, { ...init, headers });
  const text = await response.text();
  let body: Answer["body"] = {};
  if (text.trim() !== "") {
    try {
      body = JSON.parse(text) as Answer["body"];
    } catch {
      body = { message: text };
    }
  }
  return { status: response.status, body, headers: response.headers };
}

/** What GitHub said went wrong, or the bare status when it said nothing. */
export function messageOf(answer: Answer): string {
  const said = (answer.body as Record<string, unknown>).message;
  return typeof said === "string" ? said : `HTTP ${answer.status}`;
}

export function shaOfRef(answer: Answer): string | null {
  const object = (answer.body as Record<string, unknown>).object as
    | Record<string, unknown>
    | undefined;
  return typeof object?.sha === "string" ? object.sha : null;
}
