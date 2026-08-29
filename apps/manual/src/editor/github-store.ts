import { BRANCH_PREFIX, GITHUB_API, REPO, STORAGE } from "./config";
import {
  assertManualPath,
  base64FromBytes,
  type ContentStore,
  type StoredFile,
  StoreError,
  textFromBase64,
  utf8Bytes,
  type Version,
  type WriteOutcome,
} from "./store";

/**
 * The hosted transport. A fine-grained PAT writes to one branch per author —
 * `manual/<login>` — and the branch never rots: before the first write of a
 * session GitHub says whether a pull request from it is still open, and a
 * branch whose PR is gone starts again from the default branch. The first
 * successful write then makes sure a pull request exists.
 */

export type KeyStore = {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
};

export const browserKeyStore: KeyStore = {
  get: (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* a browser with storage switched off still edits, it just forgets */
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      /* see above */
    }
  },
};

type Answer = { status: number; body: Record<string, unknown> | unknown[] };

const NO_TOKEN =
  "Read-only: no GitHub token. Add a fine-grained token with contents:write and pull_requests:write to save.";

export type GithubStoreOptions = {
  token: string | null;
  http?: typeof fetch;
  storage?: KeyStore;
  /** Called when the login or the pull request URL becomes known. */
  onChange?: () => void;
};

export class GithubStore implements ContentStore {
  readonly kind = "github" as const;

  private readonly token: string | null;
  private readonly http: typeof fetch;
  private readonly storage: KeyStore;
  private readonly onChange: () => void;
  private login: string | null;
  private pr: string | null;
  private prepared: Promise<string> | null = null;
  private opening: Promise<void> | null = null;
  private branchReset = false;

  constructor(options: GithubStoreOptions) {
    this.token = options.token;
    this.http = options.http ?? fetch;
    this.storage = options.storage ?? browserKeyStore;
    this.onChange = options.onChange ?? (() => {});
    this.login = this.storage.get(STORAGE.login);
    this.pr = this.storage.get(STORAGE.pr);
  }

  get label(): string {
    const where = this.login ? `${BRANCH_PREFIX}${this.login}` : "a branch";
    return `GitHub — ${REPO.owner}/${REPO.repo}, ${where}`;
  }

  get readOnly(): string | null {
    return this.token ? null : NO_TOKEN;
  }

  get reviewUrl(): string | null {
    return this.pr;
  }

  async read(path: string): Promise<StoredFile> {
    const login = await this.whoami();
    const branch = `${BRANCH_PREFIX}${login}`;
    const onBranch = await this.contents(path, branch);
    const answer =
      onBranch.status === 404 ? await this.contents(path) : onBranch;
    if (answer.status !== 200)
      throw this.failure(answer, `cannot read ${path}`);

    const body = answer.body as Record<string, unknown>;
    if (typeof body.content !== "string" || typeof body.sha !== "string") {
      throw new StoreError(answer.status, `${path} is not a readable file`);
    }
    return { source: textFromBase64(body.content), version: body.sha };
  }

  async write(
    path: string,
    source: string,
    baseVersion: Version | null,
  ): Promise<WriteOutcome> {
    assertManualPath(path);
    return this.put(path, utf8Bytes(source), baseVersion, `manual: ${path}`);
  }

  async writeBinary(
    path: string,
    bytes: Uint8Array,
    baseVersion: Version | null,
  ): Promise<WriteOutcome> {
    assertManualPath(path);
    return this.put(path, bytes, baseVersion, `manual: upload ${path}`);
  }

  private async put(
    path: string,
    bytes: Uint8Array,
    baseVersion: Version | null,
    message: string,
  ): Promise<WriteOutcome> {
    if (!this.token) throw new StoreError(401, NO_TOKEN);
    const branch = await this.ensureBranch();
    const sha = await this.baseOnBranch(path, branch, baseVersion);

    const answer = await this.call(
      `/repos/${REPO.owner}/${REPO.repo}/contents/${encodePath(path)}`,
      {
        method: "PUT",
        body: JSON.stringify({
          message,
          content: base64FromBytes(bytes),
          branch,
          ...(sha ? { sha } : {}),
        }),
      },
    );

    if (answer.status === 409 || answer.status === 422) {
      return {
        status: "conflict",
        current: await this.currentOf(path, branch),
      };
    }
    if (answer.status !== 200 && answer.status !== 201) {
      throw this.failure(answer, `cannot write ${path}`);
    }

    await this.ensurePullRequest(branch);
    const content = (answer.body as Record<string, unknown>).content as
      | Record<string, unknown>
      | undefined;
    const version = content?.sha;
    if (typeof version !== "string") {
      throw new StoreError(answer.status, "GitHub answered without a blob sha");
    }
    return { status: "ok", version };
  }

  /** A conflict is only useful with the other side in hand, so re-read it. */
  private async currentOf(
    path: string,
    branch: string,
  ): Promise<StoredFile | null> {
    const answer = await this.contents(path, branch);
    const body = answer.body as Record<string, unknown>;
    if (
      answer.status !== 200 ||
      typeof body.content !== "string" ||
      typeof body.sha !== "string"
    ) {
      return null;
    }
    return { source: textFromBase64(body.content), version: body.sha };
  }

  private async whoami(): Promise<string> {
    if (this.login) return this.login;
    if (!this.token) throw new StoreError(401, NO_TOKEN);

    const answer = await this.call("/user");
    const login = (answer.body as Record<string, unknown>).login;
    if (answer.status !== 200 || typeof login !== "string") {
      throw this.failure(
        answer,
        "GitHub did not say who this token belongs to",
      );
    }
    this.login = login;
    this.storage.set(STORAGE.login, login);
    this.onChange();
    return login;
  }

  /** The author's branch, ready to write on — prepared once a session, and
   * once only: two saves at the same time must not both reset it. */
  private ensureBranch(): Promise<string> {
    if (!this.prepared) {
      this.prepared = this.prepareBranch().catch((cause: unknown) => {
        this.prepared = null;
        throw cause;
      });
    }
    return this.prepared;
  }

  /** GitHub says what state the branch is in: one with an open PR is being
   * reviewed and keeps its commits; one whose PR merged or closed is rot, so
   * it starts again from the default branch's current head rather than
   * re-proposing what already landed; one that is gone is cut anew. */
  private async prepareBranch(): Promise<string> {
    const branch = `${BRANCH_PREFIX}${await this.whoami()}`;
    const open = await this.findOpenPr(branch);
    const existing = await this.call(refPath(branch));
    if (existing.status !== 200 && existing.status !== 404) {
      throw this.failure(existing, `cannot look up ${branch}`);
    }
    if (existing.status === 200 && open) return branch;

    const head = await this.defaultHead();
    if (existing.status === 200) await this.resetBranch(branch, head);
    else await this.createBranch(branch, head);
    return branch;
  }

  private async defaultHead(): Promise<string> {
    const base = await this.call(refPath(REPO.defaultBranch));
    const head = (base.body as Record<string, unknown>).object as
      | Record<string, unknown>
      | undefined;
    if (base.status !== 200 || typeof head?.sha !== "string") {
      throw this.failure(base, `cannot read ${REPO.defaultBranch}`);
    }
    return head.sha;
  }

  private async resetBranch(branch: string, head: string): Promise<void> {
    const reset = await this.call(updateRefPath(branch), {
      method: "PATCH",
      body: JSON.stringify({ sha: head, force: true }),
    });
    if (reset.status !== 200) {
      throw this.failure(reset, `cannot reset ${branch}`);
    }
    this.branchReset = true;
  }

  private async createBranch(branch: string, head: string): Promise<void> {
    const made = await this.call(`/repos/${REPO.owner}/${REPO.repo}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: head }),
    });
    // 422 means someone else just created it — that is the state we wanted.
    if (made.status !== 201 && made.status !== 422) {
      throw this.failure(made, `cannot create ${branch}`);
    }
  }

  /** The blob sha to write against. A reader falls back to the default branch
   * for a file the author's branch does not carry, so after that branch was
   * reset the sha in hand may name a file that is not there — and GitHub
   * answers a create-with-sha with a 422. Write it as a create instead. */
  private async baseOnBranch(
    path: string,
    branch: string,
    baseVersion: Version | null,
  ): Promise<Version | null> {
    if (baseVersion === null || !this.branchReset) return baseVersion;
    const onBranch = await this.contents(path, branch);
    return onBranch.status === 404 ? null : baseVersion;
  }

  /** The open PR for this branch as GitHub has it right now. The remembered
   * URL outlives a merge, so it is never an answer on its own. */
  private async findOpenPr(branch: string): Promise<string | null> {
    const open = await this.call(
      `/repos/${REPO.owner}/${REPO.repo}/pulls?state=open&head=${REPO.owner}:${branch}`,
    );
    const first = Array.isArray(open.body) ? open.body[0] : undefined;
    const found = (first as Record<string, unknown> | undefined)?.html_url;
    if (typeof found === "string") {
      this.rememberPr(found);
      return found;
    }
    this.forgetPr();
    return null;
  }

  /** The branch now has something to review, so see that a PR is open for it.
   * GitHub is asked every save — the remembered URL outlives the merge that
   * ends it, and a session outlives both — while two saves at once share the
   * one attempt, so this opens a second PR for nobody. */
  private ensurePullRequest(branch: string): Promise<void> {
    if (!this.opening) {
      this.opening = this.openPullRequest(branch).finally(() => {
        this.opening = null;
      });
    }
    return this.opening;
  }

  private async openPullRequest(branch: string): Promise<void> {
    if (await this.findOpenPr(branch)) return;

    const made = await this.call(`/repos/${REPO.owner}/${REPO.repo}/pulls`, {
      method: "POST",
      body: JSON.stringify({
        title: `Manual edits from ${this.login}`,
        head: branch,
        base: REPO.defaultBranch,
        body: "Pages edited in the Grade10 Manual.",
      }),
    });
    const url = (made.body as Record<string, unknown>).html_url;
    if (typeof url === "string") {
      this.rememberPr(url);
      return;
    }
    // A PR that cannot be opened is not a failed save — say so loudly instead.
    console.warn("manual: the branch is written but no PR could be opened", {
      status: made.status,
      body: made.body,
    });
  }

  private rememberPr(url: string): void {
    if (this.pr === url) return;
    this.pr = url;
    this.storage.set(STORAGE.pr, url);
    this.onChange();
  }

  private forgetPr(): void {
    if (!this.pr) return;
    this.pr = null;
    this.storage.remove(STORAGE.pr);
    this.onChange();
  }

  private contents(path: string, ref?: string): Promise<Answer> {
    const at = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    return this.call(
      `/repos/${REPO.owner}/${REPO.repo}/contents/${encodePath(path)}${at}`,
    );
  }

  private async call(path: string, init?: RequestInit): Promise<Answer> {
    const headers: Record<string, string> = {
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
    };
    if (this.token) headers.authorization = `Bearer ${this.token}`;
    if (init?.body) headers["content-type"] = "application/json";

    const response = await this.http(`${GITHUB_API}${path}`, {
      ...init,
      headers,
    });
    const text = await response.text();
    let body: Answer["body"] = {};
    if (text.trim() !== "") {
      try {
        body = JSON.parse(text) as Answer["body"];
      } catch {
        body = { message: text };
      }
    }
    return { status: response.status, body };
  }

  private failure(answer: Answer, what: string): StoreError {
    const said = (answer.body as Record<string, unknown>).message;
    const detail = typeof said === "string" ? said : `HTTP ${answer.status}`;
    return new StoreError(answer.status, `${what}: ${detail}`);
  }
}

function refPath(branch: string): string {
  return `/repos/${REPO.owner}/${REPO.repo}/git/ref/heads/${encodePath(branch)}`;
}

/** Reading a ref is `git/ref`, moving one is `git/refs` — GitHub's spelling. */
function updateRefPath(branch: string): string {
  return `/repos/${REPO.owner}/${REPO.repo}/git/refs/heads/${encodePath(branch)}`;
}

function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}
