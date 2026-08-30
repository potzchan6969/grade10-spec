import {
  BRANCH_PREFIX,
  DEFAULT_WRITE_MODE,
  REPO,
  STORAGE,
  type WriteMode,
} from "./config";
import {
  type Answer,
  encodePath,
  githubCall,
  messageOf,
  refPath,
  repoPath,
  shaOfRef,
  updateRefPath,
} from "./github-api";
import {
  authorOf,
  changeDir,
  PROPOSAL,
  type ProposalFile,
  proposalPaths,
  withdrawProblem,
} from "./propose";
import {
  assertManualPath,
  assertProposal,
  base64FromBytes,
  type ContentStore,
  type Staleness,
  type StoredFile,
  StoreError,
  textFromBase64,
  utf8Bytes,
  type Version,
  type WriteOutcome,
} from "./store";

/**
 * The hosted transport, in one of two modes chosen in settings.
 *
 * `main` writes the base branch the deploy listens on, so a save is live in
 * about a minute; nothing branches, nothing is proposed, and the freshness
 * check is what keeps it honest. `branch` writes `manual/<login>` and keeps
 * its pull request open, so edits never rot on an unopened branch.
 *
 * The mode picks the ref for read and write together: a main-mode session
 * never loads a leftover personal branch and calls it main.
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

function noToken(mode: WriteMode): string {
  const needs =
    mode === "main"
      ? "contents:write"
      : "contents:write and pull_requests:write";
  return `Read-only: no GitHub token. Add a fine-grained token with ${needs} to save.`;
}

/** A push GitHub refused on a rule rather than on the blob sha in hand.
 * A sha mismatch never reads like this, so it stays a conflict. */
const PROTECTION =
  /protect|refusing to allow|not authorized|required status check|approving review/i;

export type GithubStoreOptions = {
  token: string | null;
  mode?: WriteMode;
  http?: typeof fetch;
  storage?: KeyStore;
  /** Called when the login or the pull request URL becomes known. */
  onChange?: () => void;
};

export class GithubStore implements ContentStore {
  readonly kind = "github" as const;
  readonly mode: WriteMode;

  private readonly token: string | null;
  private readonly http: typeof fetch;
  private readonly storage: KeyStore;
  private readonly onChange: () => void;
  private login: string | null;
  private pr: string | null;
  private asking: Promise<string> | null = null;
  private prepared: Promise<string> | null = null;
  private opening: Promise<void> | null = null;
  private branchReset = false;

  constructor(options: GithubStoreOptions) {
    this.token = options.token;
    this.mode = options.mode ?? DEFAULT_WRITE_MODE;
    this.http = options.http ?? fetch;
    this.storage = options.storage ?? browserKeyStore;
    this.onChange = options.onChange ?? (() => {});
    this.login = this.storage.get(STORAGE.login);
    this.pr = this.storage.get(STORAGE.pr);
  }

  get label(): string {
    const where =
      this.mode === "main"
        ? REPO.defaultBranch
        : this.login
          ? `${BRANCH_PREFIX}${this.login}`
          : "a branch";
    return `GitHub — ${REPO.owner}/${REPO.repo}, ${where}`;
  }

  get readOnly(): string | null {
    return this.token ? null : noToken(this.mode);
  }

  /** A main-mode save has no pull request, and the remembered one belongs to
   * another mode's edits. */
  get reviewUrl(): string | null {
    return this.mode === "main" ? null : this.pr;
  }

  /** The handle this session already learned, asking GitHub nothing. */
  get author(): string | null {
    return this.login;
  }

  identity(): Promise<string> {
    return this.whoami();
  }

  async read(path: string): Promise<StoredFile> {
    if (!this.token) throw new StoreError(401, noToken(this.mode));
    const answer = await this.readFrom(path);
    if (answer.status !== 200)
      throw this.failure(answer, `cannot read ${path}`);

    const body = answer.body as Record<string, unknown>;
    if (typeof body.content !== "string" || typeof body.sha !== "string") {
      throw new StoreError(answer.status, `${path} is not a readable file`);
    }
    return { source: textFromBase64(body.content), version: body.sha };
  }

  /** Main mode reads the base branch and only the base branch. Branch mode
   * prefers the author's own, falling back to a file it does not carry. */
  private async readFrom(path: string): Promise<Answer> {
    if (this.mode === "main") return this.contents(path, REPO.defaultBranch);
    const branch = `${BRANCH_PREFIX}${await this.whoami()}`;
    const onBranch = await this.contents(path, branch);
    return onBranch.status === 404 ? this.contents(path) : onBranch;
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

  /** Live head of the branch a save lands on, against the head the deployed
   * snapshot was built from. Only main mode has an answer: a personal branch
   * is not what the snapshot came from. */
  async staleness(storeHead: string): Promise<Staleness | null> {
    if (this.mode !== "main" || !this.token) return null;
    const head = await this.liveHead();
    return head === storeHead ? null : { head };
  }

  async liveHead(): Promise<string> {
    const base = await this.call(refPath(REPO.defaultBranch));
    const head = shaOfRef(base);
    if (base.status !== 200 || head === null) {
      throw this.failure(base, `cannot read ${REPO.defaultBranch}`);
    }
    return head;
  }

  /**
   * A proposal, as one commit on the ref this mode writes: main mode lands it
   * on the base branch, where a draft change simply is what the store means by
   * a proposal, and branch mode lands it on the author's branch and its PR.
   *
   * The slug is checked before anything is sent, and the directory is looked
   * up before anything is built — a proposal never writes over a change that
   * already exists, whoever wrote it.
   */
  async propose(files: ProposalFile[]): Promise<{ id: string }> {
    const slug = assertProposal(files);
    if (!this.token) throw new StoreError(401, noToken(this.mode));

    const main = this.mode === "main";
    const branch = main ? REPO.defaultBranch : await this.ensureBranch();
    if ((await this.listing(branch, slug)) !== null) {
      throw new StoreError(
        409,
        `\`${slug}\` already exists on ${branch} — pick another slug`,
      );
    }

    await this.commitTree(
      branch,
      files.map((file) => ({ path: file.path, content: file.content })),
      `manual: propose ${slug}`,
    );
    if (!main) await this.ensurePullRequest(branch);
    return { id: slug };
  }

  /** A proposal comes back out the way it went in — one commit removing the
   * two files it wrote. Only the author named in the proposal may, and only
   * while the directory still holds nothing but a proposal. */
  async withdraw(slug: string): Promise<void> {
    if (!this.token) throw new StoreError(401, noToken(this.mode));
    const branch =
      this.mode === "main" ? REPO.defaultBranch : await this.ensureBranch();

    const names = await this.listing(branch, slug);
    if (names === null) {
      throw new StoreError(404, `no change \`${slug}\` on ${branch}`);
    }
    const problem = withdrawProblem(slug, names);
    if (problem) throw new StoreError(409, problem);

    const proposal = await this.read(`${changeDir(slug)}/${PROPOSAL}`);
    const author = authorOf(proposal.source);
    const me = await this.whoami();
    if (author?.toLowerCase() !== me?.toLowerCase()) {
      throw new StoreError(
        403,
        `\`${slug}\` was proposed by ${author ? `@${author}` : "nobody named"} — only its author can withdraw it`,
      );
    }

    await this.commitTree(
      branch,
      proposalPaths(slug)
        .filter((path) => names.includes(path.split("/")[3]))
        .map((path) => ({ path, content: null })),
      `manual: withdraw ${slug}`,
    );
  }

  /** What a change directory holds on this ref, or null when it holds nothing
   * because it is not there. Anything else GitHub says is an error, not an
   * empty directory — a proposal must never be written over a 500. */
  private async listing(
    branch: string,
    slug: string,
  ): Promise<string[] | null> {
    const answer = await this.contents(changeDir(slug), branch);
    if (answer.status === 404) return null;
    if (answer.status !== 200 || !Array.isArray(answer.body)) {
      throw this.failure(answer, `cannot look up ${changeDir(slug)}`);
    }
    return answer.body.map((entry) =>
      String((entry as Record<string, unknown>).name ?? ""),
    );
  }

  /**
   * One commit through the Git Data API: a blob per file written, a null sha
   * per file removed, one tree on the branch's own, one commit, one ref move.
   * Nothing is visible until the ref moves, so a failure halfway leaves the
   * branch exactly as it was — which is what makes a two-file proposal land or
   * not land, never half-land.
   */
  private async commitTree(
    branch: string,
    changes: { path: string; content: string | null }[],
    message: string,
  ): Promise<string> {
    const ref = await this.call(refPath(branch));
    const head = shaOfRef(ref);
    if (ref.status !== 200 || head === null) {
      throw this.failure(ref, `cannot read ${branch}`);
    }

    const base = await this.call(repoPath(`git/commits/${head}`));
    const tree = (base.body as Record<string, unknown>).tree as
      | Record<string, unknown>
      | undefined;
    if (base.status !== 200 || typeof tree?.sha !== "string") {
      throw this.failure(base, `cannot read the tree of ${head}`);
    }

    const entries: {
      path: string;
      mode: string;
      type: string;
      sha: string | null;
    }[] = [];
    for (const change of changes) {
      entries.push({
        path: change.path,
        mode: "100644",
        type: "blob",
        sha: change.content === null ? null : await this.blob(change.content),
      });
    }

    const made = await this.call(repoPath("git/trees"), {
      method: "POST",
      body: JSON.stringify({ base_tree: tree.sha, tree: entries }),
    });
    const treeSha = (made.body as Record<string, unknown>).sha;
    if (made.status !== 201 || typeof treeSha !== "string") {
      throw this.failure(made, "cannot build the tree");
    }

    const commit = await this.call(repoPath("git/commits"), {
      method: "POST",
      body: JSON.stringify({ message, tree: treeSha, parents: [head] }),
    });
    const sha = (commit.body as Record<string, unknown>).sha;
    if (commit.status !== 201 || typeof sha !== "string") {
      throw this.failure(commit, "cannot make the commit");
    }

    const moved = await this.call(updateRefPath(branch), {
      method: "PATCH",
      body: JSON.stringify({ sha }),
    });
    const refused = this.protectionRefusal(moved);
    if (refused) throw refused;
    if (moved.status !== 200) {
      throw this.failure(moved, `cannot move ${branch} — nothing was written`);
    }
    return sha;
  }

  private async blob(content: string): Promise<string> {
    const made = await this.call(repoPath("git/blobs"), {
      method: "POST",
      body: JSON.stringify({
        content: base64FromBytes(utf8Bytes(content)),
        encoding: "base64",
      }),
    });
    const sha = (made.body as Record<string, unknown>).sha;
    if (made.status !== 201 || typeof sha !== "string") {
      throw this.failure(made, "cannot write the file");
    }
    return sha;
  }

  private async put(
    path: string,
    bytes: Uint8Array,
    baseVersion: Version | null,
    message: string,
  ): Promise<WriteOutcome> {
    if (!this.token) throw new StoreError(401, noToken(this.mode));
    const main = this.mode === "main";
    const branch = main ? REPO.defaultBranch : await this.ensureBranch();
    const sha = main
      ? baseVersion
      : await this.baseOnBranch(path, branch, baseVersion);

    const answer = await this.call(repoPath(`contents/${encodePath(path)}`), {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: base64FromBytes(bytes),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    const refused = this.protectionRefusal(answer);
    if (refused) throw refused;
    if (answer.status === 409 || answer.status === 422) {
      return {
        status: "conflict",
        current: await this.currentOf(path, branch),
      };
    }
    if (answer.status !== 200 && answer.status !== 201) {
      throw this.failure(answer, `cannot write ${path}`);
    }

    if (!main) await this.ensurePullRequest(branch);
    const content = (answer.body as Record<string, unknown>).content as
      | Record<string, unknown>
      | undefined;
    const version = content?.sha;
    if (typeof version !== "string") {
      throw new StoreError(answer.status, "GitHub answered without a blob sha");
    }
    return { status: "ok", version };
  }

  /** Branch protection said no. There is no fallback to fall back to — the
   * next move is the author's, and it is the other mode. */
  private protectionRefusal(answer: Answer): StoreError | null {
    if (this.mode !== "main") return null;
    const said = messageOf(answer);
    const refused =
      (answer.status === 403 && !/rate limit|saml/i.test(said)) ||
      ((answer.status === 409 || answer.status === 422) &&
        PROTECTION.test(said));
    if (!refused) return null;
    return new StoreError(
      answer.status,
      `${REPO.defaultBranch} refused this push: ${said} — switch to branch + PR mode in settings and this edit goes through a pull request instead.`,
    );
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

  /** Who the token belongs to, asked once a session however many surfaces
   * want to know — a board full of proposals must not be a board full of
   * identical requests. */
  private whoami(): Promise<string> {
    if (this.login) return Promise.resolve(this.login);
    if (!this.asking) {
      this.asking = this.askWhoami().finally(() => {
        this.asking = null;
      });
    }
    return this.asking;
  }

  private async askWhoami(): Promise<string> {
    if (!this.token) throw new StoreError(401, noToken(this.mode));

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

    const head = await this.liveHead();
    if (existing.status === 200) await this.resetBranch(branch, head);
    else await this.createBranch(branch, head);
    return branch;
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
    const made = await this.call(repoPath("git/refs"), {
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
      repoPath(`pulls?state=open&head=${REPO.owner}:${branch}`),
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

    const made = await this.call(repoPath("pulls"), {
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
    return this.call(repoPath(`contents/${encodePath(path)}${at}`));
  }

  private call(path: string, init?: RequestInit): Promise<Answer> {
    return githubCall(this.http, this.token, path, init);
  }

  private failure(answer: Answer, what: string): StoreError {
    return new StoreError(answer.status, `${what}: ${messageOf(answer)}`);
  }
}
