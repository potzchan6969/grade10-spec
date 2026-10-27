/** The port every editor surface writes through. `LocalStore` is the one
 * adapter: it talks to the dev server's `/api/*` endpoints, and `version` is
 * that transport's content hash — what turns two concurrent editors into a
 * rendered conflict instead of a silent overwrite.
 *
 * The manual is edited locally only: a session with no dev server behind it
 * has no store at all, and every editor surface hides itself rather than
 * rendering read-only. */

export type Version = string;

export type StoredFile = { source: string; version: Version };

export type WriteOutcome =
  | { status: "ok"; version: Version }
  | { status: "conflict"; current: StoredFile | null };

export type ContentStore = {
  /** Named in the editor chrome, so an author always knows where a save goes. */
  readonly label: string;

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

  deletePage(path: string, baseVersion: Version): Promise<void>;
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

/** Every write names a file under the manual's directory; the dev server
 * confines its own writes, but the check happens here too, before a path
 * becomes a request. */
export function assertManualPath(manualDir: string, path: string): void {
  const under = `${manualDir}/`;
  const refuse = (why: string) => {
    throw new StoreError(400, `\`${path}\` ${why}`);
  };
  // A leading `/` is an absolute path, and fails this first.
  if (!path.startsWith(under)) refuse(`is not under ${under}`);
  if (path === under) refuse("names no file");
  if (path.split("/").includes("..")) refuse(`walks out of ${under}`);
}

export function describeCause(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause);
}

export function base64FromBytes(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
