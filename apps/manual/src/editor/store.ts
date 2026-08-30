/** The port every editor surface writes through. Two adapters implement it:
 * `LocalStore` (the dev API) and `GithubStore` (the contents API). `version`
 * is whatever that transport uses for optimistic concurrency — a content hash
 * in dev, the blob sha on GitHub — and is what turns two concurrent editors
 * into a rendered conflict instead of a silent overwrite. */

export type Version = string;

export type StoredFile = { source: string; version: Version };

export type WriteOutcome =
  | { status: "ok"; version: Version }
  | { status: "conflict"; current: StoredFile | null };

export type DirtyState = { dirty: boolean; files: string[] };

export type CommitOutcome = { committed: boolean; sha?: string };

export type StoreKind = "local" | "github";

/** The branch a save lands on has moved past the snapshot the page was read
 * from — the page on screen may not be the page being written over. */
export type Staleness = { head: string };

export type ContentStore = {
  readonly kind: StoreKind;
  /** Named in the editor chrome, so an author always knows where a save goes. */
  readonly label: string;
  /** Null when the store can save; the reason it cannot, otherwise. */
  readonly readOnly: string | null;
  /** Where the edits end up for review, when that is a place — the PR. */
  readonly reviewUrl: string | null;

  read(path: string): Promise<StoredFile>;
  write(
    path: string,
    source: string,
    baseVersion: Version | null,
  ): Promise<WriteOutcome>;
  writeBinary(
    path: string,
    bytes: Uint8Array,
    baseVersion: Version | null,
  ): Promise<WriteOutcome>;

  /** Asked once per save attempt, never polled: has the branch this store
   * writes to moved past `storeHead`? Only a store saving to the branch the
   * snapshot was built from can answer. */
  staleness?(storeHead: string): Promise<Staleness | null>;

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
