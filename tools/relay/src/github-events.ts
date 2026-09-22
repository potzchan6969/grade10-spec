/**
 * The code host's side: the signature over the body as it arrived, the push
 * envelope read down to one move, and the deliveries that tell nobody.
 *
 * Nothing here holds state. The store the deployment names arrives as an
 * argument, so every rule can be read in a test. The calls the relay makes on
 * the host are `github.ts`'s; this is what the host sends.
 */
import { signedHmac, verifiedHmac } from "./bytes.ts";
import type { Push } from "./live-state.ts";

/** The one branch a page is told about. Every other branch is a draft. */
export const MAIN_REF = "refs/heads/main";

/** How the code host prefixes its signature. */
const PREFIX = "sha256=";

/** A commit, as the code host spells one: the sha a push names, and the sha a
 * landing asks the relay to move `main` to. A call naming anything else is
 * refused before the relay reads a thing. */
export const IS_SHA = /^[0-9a-f]{40}$/;

/** Why a delivery told nobody. A closed set, because the answer names it and
 * Operations reads that answer in the host's own delivery log. */
export type PushIgnored =
  | "not-a-push"
  | "another-repository"
  | "another-branch"
  | "no-commit";

export type GithubEvent =
  | { kind: "ping" }
  | { kind: "moved"; push: Push }
  | { kind: "ignored"; why: PushIgnored };

/**
 * The code host signs the raw body with the webhook secret and sends the HMAC
 * as `sha256=<hex>`. The body must be the bytes as they arrived: a body read as
 * JSON and written back has a different signature.
 */
export function verifyGithubSignature(
  secret: string,
  request: { signature: string | null; body: string },
): Promise<boolean> {
  return verifiedHmac(secret, PREFIX, request.signature, request.body);
}

/** The signature of a body, for a test's fixtures and for a delivery replayed
 * by hand. */
export function signGithubEvent(secret: string, body: string): Promise<string> {
  return signedHmac(secret, PREFIX, body);
}

interface PushEnvelope {
  ref?: string;
  after?: string;
  repository?: { full_name?: string };
  head_commit?: { message?: string } | null;
}

/** The first line of a commit's message, which is the subject a page shows. */
const firstLine = (message: string): string => message.split("\n")[0].trim();

/** A store's name, folded: the code host's owner and repository names are
 * case-insensitive, and `REPO` is typed into `wrangler.jsonc` by hand. */
const folded = (name: string): string => name.trim().toLowerCase();

/**
 * The delivery as one move, or the reason nothing is told. The webhook is
 * subscribed to `push` alone and the code host sends a `ping` the moment it is
 * saved, so those two are the whole of it: every other delivery is answered and
 * dropped.
 *
 * `repo` is the store the deployment names. A webhook pointed at this relay from
 * another repository tells nobody, because the head a page compares its own
 * snapshot with is this store's.
 */
export function parseGithubEvent(
  event: string | null,
  raw: unknown,
  repo: string,
): GithubEvent {
  if (event === "ping") return { kind: "ping" };
  if (event !== "push") return { kind: "ignored", why: "not-a-push" };
  const body = (raw ?? {}) as PushEnvelope;
  if (folded(String(body.repository?.full_name ?? "")) !== folded(repo))
    return { kind: "ignored", why: "another-repository" };
  if (String(body.ref ?? "") !== MAIN_REF)
    return { kind: "ignored", why: "another-branch" };
  const main = String(body.after ?? "");
  const commit = body.head_commit;
  // A branch deleted, and a push the host sends with nothing at its head, name
  // no commit a page could read.
  if (!IS_SHA.test(main) || !commit)
    return { kind: "ignored", why: "no-commit" };
  // The commit's own time is not read: what a page shows is how long ago the
  // move arrived, which the live object stamps from its own clock.
  return {
    kind: "moved",
    push: {
      main,
      // A commit written with no message still moved `main`: the page shows the
      // short sha, which reads back to the commit, rather than an empty line.
      subject: firstLine(String(commit.message ?? "")) || main.slice(0, 7),
    },
  };
}
