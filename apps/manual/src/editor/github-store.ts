import { dirOf } from "../api/paths";
import { REPO } from "./config";
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
  type PushConflict,
  type PushFile,
  type PushOutcome,
  type StagedRef,
  type StoredFile,
  StoreError,
  textFromBase64,
  utf8Bytes,
  type Version,
  type WriteOutcome,
} from "./store";
import { forgetVerdict, readVerdict, type TokenVerdict } from "./verify";

/**
 * The hosted transport. Every read and every write is the base branch the
 * deploy listens on: a push is live in about a minute, nothing branches, and
 * nothing is proposed for review — the health strip and the freshness checks
 * are what keep that honest.
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

const NO_TOKEN =
  "Read-only: not signed in. Sign in with GitHub in Settings to save.";

/** A token nobody has checked is a string. Signing in asks GitHub who it
 * belongs to and whether it reaches this repo, and write mode waits for both
 * answers rather than finding out inside someone's first save. */
const UNVERIFIED = `Read-only: GitHub has not confirmed this sign-in yet — open Settings to see what it said about ${REPO.owner}/${REPO.repo}.`;

/** A push GitHub refused on a rule rather than on the blob sha in hand.
 * A sha mismatch never reads like this, so it stays a conflict. */
const PROTECTION =
  /protect|refusing to allow|not authorized|required status check|approving review/i;

/** The ref grew a commit between reading its head and moving it. Nothing is
 * written — the push reads the head again and tries once more. */
const FAST_FORWARD = /fast[ -]forward/i;

export type GithubStoreOptions = {
  token: string | null;
  http?: typeof fetch;
  storage?: KeyStore;
  /** Called when the verdict this session holds changes. */
  onChange?: () => void;
};

export class GithubStore implements ContentStore {
  readonly kind = "github" as const;

  private readonly token: string | null;
  private readonly http: typeof fetch;
  private readonly storage: KeyStore;
  private readonly onChange: () => void;
  private login: string | null;
  private verdict: TokenVerdict | null;
  private asking: Promise<string> | null = null;

  constructor(options: GithubStoreOptions) {
    this.token = options.token;
    this.http = options.http ?? fetch;
    this.storage = options.storage ?? browserKeyStore;
    this.onChange = options.onChange ?? (() => {});
    this.verdict = readVerdict(this.storage, this.token);
    // Verification already asked GitHub who this is, so the author line and
    // the withdraw guard read it from there rather than asking again.
    this.login = this.verdict?.login ?? null;
  }

  get label(): string {
    return `GitHub — ${REPO.owner}/${REPO.repo}, ${REPO.defaultBranch}`;
  }

  get readOnly(): string | null {
    if (!this.token) return NO_TOKEN;
    return this.verdict ? null : UNVERIFIED;
  }

  /** What GitHub said about this token, once it has said it. */
  get verified(): TokenVerdict | null {
    return this.verdict;
  }

  /** The handle this session already learned, asking GitHub nothing. */
  get author(): string | null {
    return this.login;
  }

  identity(): Promise<string> {
    return this.whoami();
  }

  async read(path: string): Promise<StoredFile> {
    if (!this.token) throw new StoreError(401, NO_TOKEN);
    const answer = await this.contents(path, REPO.defaultBranch);
    if (answer.status !== 200)
      throw this.failure(answer, `cannot read ${path}`);

    const body = answer.body as Record<string, unknown>;
    if (typeof body.content !== "string" || typeof body.sha !== "string") {
      throw new StoreError(answer.status, `${path} is not a readable file`);
    }
    return { source: textFromBase64(body.content), version: body.sha };
  }

  async writeBinary(
    path: string,
    bytes: Uint8Array,
    baseVersion: Version | null,
  ): Promise<WriteOutcome> {
    assertManualPath(path);
    return this.put(path, bytes, baseVersion, `manual: upload ${path}`);
  }

  /**
   * The staged set, as one commit on the base branch.
   *
   * Reading the head first is what makes it atomic in the only sense that
   * matters here: every draft's base version is checked against that head
   * before a single blob is written, so a batch either lands whole or is
   * handed back as conflicts with nothing written. The ref move is not forced,
   * so a commit that landed between the check and the move cannot be lost —
   * the push reads the head again and tries once more, and says so if the ref
   * is moving faster than that.
   */
  async push(files: PushFile[], message: string): Promise<PushOutcome> {
    if (!this.token) throw new StoreError(401, NO_TOKEN);
    for (const file of files) assertManualPath(file.path);
    if (files.length === 0) throw new StoreError(400, "nothing is staged");

    const branch = REPO.defaultBranch;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const head = await this.headOf(branch);
      const conflicts = await this.mismatches(files, head);
      if (conflicts.length > 0) return { status: "conflicts", conflicts };

      const sha = await this.commitOn(
        head,
        files.map((file) => ({ path: file.path, content: file.source })),
        message,
      );
      if ((await this.moveRef(branch, sha)) === "ok") {
        return { status: "ok", head: sha };
      }
    }

    throw new StoreError(
      409,
      `${branch} is moving under this push — nothing was written. Try again.`,
    );
  }

  /** Which staged pages changed on the base branch. The same question the
   * push asks itself, asked in the background so the answer arrives before
   * the push does. */
  async movedSince(files: StagedRef[]): Promise<string[]> {
    const at = await this.versionsAt(files.map((file) => file.path));
    return files
      .filter((file) => hasMoved(file, at.get(file.path) ?? null))
      .map((file) => file.path);
  }

  /** Every staged page whose blob is no longer the one it was read at, with
   * the other side in hand. */
  private async mismatches(
    files: PushFile[],
    head: string,
  ): Promise<PushConflict[]> {
    const at = await this.versionsAt(
      files.map((file) => file.path),
      head,
    );
    const conflicts: PushConflict[] = [];
    for (const file of files) {
      if (!hasMoved(file, at.get(file.path) ?? null)) continue;
      conflicts.push({
        path: file.path,
        current: await this.currentOf(file.path, head),
      });
    }
    return conflicts;
  }

  /**
   * The blob of each path on a ref, `null` for one the ref does not carry.
   * One listing per directory rather than one read per file: a batch of pages
   * shares a handful of directories, and a listing answers for every page in
   * one at once — never more requests than reading them one by one, usually
   * far fewer.
   */
  async versionsAt(
    paths: string[],
    ref: string = REPO.defaultBranch,
  ): Promise<Map<string, Version | null>> {
    if (!this.token) throw new StoreError(401, NO_TOKEN);

    const byDir = new Map<string, string[]>();
    for (const path of paths) {
      const dir = dirOf(path);
      const held = byDir.get(dir);
      if (held) held.push(path);
      else byDir.set(dir, [path]);
    }

    const found = new Map<string, Version | null>();
    for (const [dir, held] of byDir) {
      const answer = await this.contents(dir, ref);
      if (answer.status === 404) {
        for (const path of held) found.set(path, null);
        continue;
      }
      if (answer.status !== 200 || !Array.isArray(answer.body)) {
        throw this.failure(answer, `cannot list ${dir}`);
      }
      const shas = new Map(
        answer.body.map((entry) => {
          const file = entry as Record<string, unknown>;
          return [
            String(file.path ?? ""),
            typeof file.sha === "string" ? file.sha : null,
          ] as const;
        }),
      );
      for (const path of held) found.set(path, shas.get(path) ?? null);
    }
    return found;
  }

  private async headOf(branch: string): Promise<string> {
    const ref = await this.call(refPath(branch));
    const head = shaOfRef(ref);
    if (ref.status !== 200 || head === null) {
      throw this.failure(ref, `cannot read ${branch}`);
    }
    return head;
  }

  /**
   * A proposal, as one commit on the base branch — a draft change simply is
   * what the store means by a proposal.
   *
   * The slug is checked before anything is sent, and the directory is looked
   * up before anything is built — a proposal never writes over a change that
   * already exists, whoever wrote it.
   */
  async propose(files: ProposalFile[]): Promise<{ id: string }> {
    const slug = assertProposal(files);
    if (!this.token) throw new StoreError(401, NO_TOKEN);

    const branch = REPO.defaultBranch;
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
    return { id: slug };
  }

  /** A proposal comes back out the way it went in — one commit removing the
   * two files it wrote. Only the author named in the proposal may, and only
   * while the directory still holds nothing but a proposal. */
  async withdraw(slug: string): Promise<void> {
    if (!this.token) throw new StoreError(401, NO_TOKEN);
    const branch = REPO.defaultBranch;

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
   * One commit through the Git Data API, landed. Nothing is visible until the
   * ref moves, so a failure halfway leaves the branch exactly as it was —
   * which is what makes a two-file proposal land or not land, never half-land.
   */
  private async commitTree(
    branch: string,
    changes: { path: string; content: string | null }[],
    message: string,
  ): Promise<string> {
    const head = await this.headOf(branch);
    const sha = await this.commitOn(head, changes, message);
    if ((await this.moveRef(branch, sha)) !== "ok") {
      throw new StoreError(
        409,
        `${branch} moved first — nothing was written. Try again.`,
      );
    }
    return sha;
  }

  /** A blob per file written, a null sha per file removed, one tree on the
   * head's own, one commit. None of it is on the branch until the ref moves. */
  private async commitOn(
    head: string,
    changes: { path: string; content: string | null }[],
    message: string,
  ): Promise<string> {
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
    return sha;
  }

  /** The ref move, never forced: `moved` means the branch grew a commit while
   * this one was being built, and the caller decides whether to try again. */
  private async moveRef(branch: string, sha: string): Promise<"ok" | "moved"> {
    const answer = await this.call(updateRefPath(branch), {
      method: "PATCH",
      body: JSON.stringify({ sha }),
    });
    const refused = this.protectionRefusal(answer);
    if (refused) throw refused;
    if (answer.status === 200) return "ok";
    if (FAST_FORWARD.test(messageOf(answer))) return "moved";
    throw this.failure(answer, `cannot move ${branch} — nothing was written`);
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
    if (!this.token) throw new StoreError(401, NO_TOKEN);
    const branch = REPO.defaultBranch;

    const answer = await this.call(repoPath(`contents/${encodePath(path)}`), {
      method: "PUT",
      body: JSON.stringify({
        message,
        content: base64FromBytes(bytes),
        branch,
        ...(baseVersion ? { sha: baseVersion } : {}),
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

    const content = (answer.body as Record<string, unknown>).content as
      | Record<string, unknown>
      | undefined;
    const version = content?.sha;
    if (typeof version !== "string") {
      throw new StoreError(answer.status, "GitHub answered without a blob sha");
    }
    return { status: "ok", version };
  }

  /** Branch protection said no. There is no fallback to fall back to: the
   * manual writes the base branch or it writes nothing, so a rule that blocks
   * it is an admin's to lift, and the refusal says so instead of retrying. */
  private protectionRefusal(answer: Answer): StoreError | null {
    const said = messageOf(answer);
    const refused =
      (answer.status === 403 && !/rate limit|saml/i.test(said)) ||
      ((answer.status === 409 || answer.status === 422) &&
        PROTECTION.test(said));
    if (!refused) return null;
    return new StoreError(
      answer.status,
      `${REPO.defaultBranch} refused this push: ${said} — the manual saves straight to ${REPO.defaultBranch}, so a protection rule that blocks it has to allow this app or be lifted by an admin.`,
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

  /** Who the token belongs to. A verified session already knows, from the
   * verdict; an unverified one asks once however many surfaces want to know,
   * because a board full of proposals must not be a board full of identical
   * requests. */
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
    this.onChange();
    return login;
  }

  private contents(path: string, ref?: string): Promise<Answer> {
    const at = ref ? `?ref=${encodeURIComponent(ref)}` : "";
    return this.call(repoPath(`contents/${encodePath(path)}${at}`));
  }

  private async call(path: string, init?: RequestInit): Promise<Answer> {
    const answer = await githubCall(this.http, this.token, path, init);
    if (answer.status === 401) this.refused();
    return answer;
  }

  /** GitHub has stopped recognising this token — expired, revoked, or
   * replaced. The verdict it was given no longer holds, so the session drops
   * back to read-only and says where to fix it, rather than failing again
   * inside the next save. */
  private refused(): void {
    if (!this.verdict) return;
    this.verdict = null;
    this.login = null;
    forgetVerdict(this.storage);
    this.onChange();
  }

  private failure(answer: Answer, what: string): StoreError {
    return new StoreError(answer.status, `${what}: ${messageOf(answer)}`);
  }
}

/** The draft was read at one blob and the base branch carries another —
 * including a page the branch no longer carries at all: on the branch every
 * read comes from, missing means deleted or renamed, which is worth stopping
 * for. */
function hasMoved(file: StagedRef, now: Version | null): boolean {
  return now !== file.baseVersion;
}
