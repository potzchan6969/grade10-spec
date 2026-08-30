/** The port every editor surface writes through. Two adapters implement it:
 * `LocalStore` (the dev API) and `GithubStore` (the Git Data API). `version`
 * is whatever that transport uses for optimistic concurrency — a content hash
 * in dev, the blob sha on GitHub — and is what turns two concurrent editors
 * into a rendered conflict instead of a silent overwrite.
 *
 * A save stages, it never pushes. The two transports stage in different
 * places, so each implements its own half: dev writes the working tree and
 * commits it, hosted stages in the browser and pushes the whole set at once. */

import { allowedProposal, type ProposalFile } from "./propose";

export type Version = string;

export type StoredFile = { source: string; version: Version };

export type WriteOutcome =
  | { status: "ok"; version: Version }
  | { status: "conflict"; current: StoredFile | null };

export type DirtyState = { dirty: boolean; files: string[] };

export type CommitOutcome = { committed: boolean; sha?: string };

export type StoreKind = "local" | "github";

/** A staged page, as the ref knows it: which page, and the blob the draft was
 * read at. */
export type StagedRef = { path: string; baseVersion: Version | null };

/** One staged page, as the push writes it. */
export type PushFile = StagedRef & { source: string };

/** A staged page whose blob moved on the ref before the push. The push carries
 * the other side back so the conflict can be read, not just reported. */
export type PushConflict = { path: string; current: StoredFile | null };

export type PushOutcome =
  | { status: "ok"; head: string }
  | { status: "conflicts"; conflicts: PushConflict[] };

export type ContentStore = {
  readonly kind: StoreKind;
  /** Named in the editor chrome, so an author always knows where a save goes. */
  readonly label: string;
  /** Null when the store can save; the reason it cannot, otherwise. */
  readonly readOnly: string | null;
  /** Where the edits end up for review, when that is a place — the PR. */
  readonly reviewUrl: string | null;

  read(path: string): Promise<StoredFile>;

  /** One new change directory, written as one commit. Refuses anything that
   * is not a proposal's own two files, and a slug that is already taken. */
  propose(files: ProposalFile[]): Promise<{ id: string }>;
  /** Take a proposal back. The transport decides who may: on GitHub, the
   * author named in `proposal.md`; in dev, whoever is at the keyboard. */
  withdraw(id: string): Promise<void>;
  /** Who is proposing, as the author line will name them. */
  identity?(): Promise<string>;
  /** The handle already known, asking nobody — null until something asked. */
  readonly author: string | null;

  /** Dev only: the working tree is the stage, so a save writes it. */
  write?(
    path: string,
    source: string,
    baseVersion: Version | null,
  ): Promise<WriteOutcome>;

  /**
   * Hosted only: the staged set, as one commit. Every draft's base version is
   * compared against the ref first — one page that moved makes the whole push
   * a set of conflicts, and nothing at all is written.
   */
  push?(files: PushFile[], message: string): Promise<PushOutcome>;

  /** Hosted only: which of these staged pages changed on the ref a push lands
   * on since the draft was read. Asked when the head moves, so the pending bar
   * can say it before a push turns it into a conflict. */
  movedSince?(files: StagedRef[]): Promise<string[]>;

  /** Immediate in both transports: a binary draft has no diff to review and no
   * place in localStorage. */
  writeBinary(
    path: string,
    bytes: Uint8Array,
    baseVersion: Version | null,
  ): Promise<WriteOutcome>;

  /** Dev only: what the working tree is holding, and how to land it. */
  dirty?(): Promise<DirtyState>;
  commit?(message: string): Promise<CommitOutcome>;
  deletePage?(path: string, baseVersion: Version): Promise<void>;
};

/** A transport that answered, and said no. */
export class StoreError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "StoreError";
    this.status = status;
  }
}

const MANUAL = "manual/";

/** Every write names a file under `manual/`. The dev server confines its own
 * writes, but the hosted transport carries a repo-wide token straight to the
 * contents API — so the confinement has to hold on this side of the wire too,
 * for both adapters, before a path becomes a request. */
export function assertManualPath(path: string): void {
  const refuse = (why: string) => {
    throw new StoreError(400, `\`${path}\` ${why}`);
  };
  // A leading `/` is an absolute path, and fails this first.
  if (!path.startsWith(MANUAL)) refuse(`is not under ${MANUAL}`);
  if (path === MANUAL) refuse("names no file");
  if (path.split("/").includes("..")) refuse(`walks out of ${MANUAL}`);
}

/** The same confinement, for the other tree a write can name. A proposal
 * writes one new change directory's own files, and the check happens here —
 * before a path becomes a request — for both adapters, exactly as
 * `assertManualPath` does for pages. */
export function assertProposal(files: ProposalFile[]): string {
  const answer = allowedProposal(files);
  if ("error" in answer) throw new StoreError(400, answer.error);
  return answer.slug;
}

export function describeCause(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

export function utf8Bytes(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function base64FromBytes(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function bytesFromBase64(base64: string): Uint8Array {
  const binary = atob(base64.replace(/\s+/g, ""));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function textFromBase64(base64: string): string {
  return new TextDecoder().decode(bytesFromBase64(base64));
}
