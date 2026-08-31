import { REPO, STORAGE } from "./config";
import { type Answer, githubCall, messageOf, repoPath } from "./github-api";
import type { KeyStore } from "./github-store";

/**
 * A token in storage is not access.
 *
 * Every sign-in is asked two questions of GitHub — who the token belongs to,
 * and whether it can reach this repository's contents — and only both answers
 * together turn write mode on. The second is the one that fails in practice:
 * the GitHub App not installed on the repository, or a member the repository
 * does not know, and GitHub answers both with the same 404.
 *
 * The verdict is kept beside the token so a reload does not ask again, keyed
 * to the token it was given for, and torn up the moment GitHub answers 401.
 */

export type TokenVerdict = {
  /** Which token this verdict is about, without keeping a second copy of it. */
  fingerprint: string;
  login: string;
  /** What `github-authentication-token-expiration` said, when it said
   * anything — a classic token with no expiry sends no header. */
  expires: string | null;
};

export type VerifyResult =
  | { ok: true; verdict: TokenVerdict }
  | { ok: false; reason: string };

/** How close to the end a token has to be before the dialog says so loudly. */
export const EXPIRY_WARNING_DAYS = 7;

export const TOKEN_EXPIRY_HEADER = "github-authentication-token-expiration";

const DAY = 24 * 60 * 60 * 1000;

export function fingerprintOf(token: string): string {
  return `${token.length}:${token.slice(-6)}`;
}

/** The two calls, in order: a token nobody owns never reaches the second. */
export async function verifyToken(
  token: string,
  http: typeof fetch = fetch,
): Promise<VerifyResult> {
  const who = await githubCall(http, token, "/user");
  if (who.status === 401) {
    return {
      ok: false,
      reason:
        "GitHub refused this sign-in (401) — it has expired or been revoked. Sign in with GitHub again.",
    };
  }
  const login = (who.body as Record<string, unknown>).login;
  if (who.status !== 200 || typeof login !== "string") {
    return {
      ok: false,
      reason: `GitHub did not say who this token belongs to: ${messageOf(who)}`,
    };
  }

  const reach = await githubCall(http, token, repoPath("contents/"));
  const refusal = reachRefusal(reach);
  if (refusal) return { ok: false, reason: refusal };

  return {
    ok: true,
    verdict: {
      fingerprint: fingerprintOf(token),
      login,
      expires: expiryOf(who) ?? expiryOf(reach),
    },
  };
}

/** Why the repository read did not prove contents access. A 404 is named for
 * both of the things it can mean, because GitHub gives no way to tell them
 * apart and only one of them is the reader's own to fix. */
function reachRefusal(answer: Answer): string | null {
  const repo = `${REPO.owner}/${REPO.repo}`;
  if (answer.status === 200) return null;
  if (answer.status === 404) {
    return `No access to ${repo} (404), and GitHub says 404 for both of these: the Grade10 Manual GitHub App is not installed on ${repo} — an owner of ${REPO.owner} installs it once — or your GitHub account cannot see that repository at all.`;
  }
  if (answer.status === 403) {
    return `This sign-in reaches ${repo} but not its contents (403): ${messageOf(answer)}. The GitHub App needs Contents: read and write.`;
  }
  if (answer.status === 401) {
    return "GitHub refused this sign-in (401) on the repository read. Sign in with GitHub again.";
  }
  return `Cannot read ${repo}: ${messageOf(answer)}`;
}

export function expiryOf(answer: Answer): string | null {
  const said = answer.headers?.get(TOKEN_EXPIRY_HEADER)?.trim();
  return said ? said : null;
}

/** GitHub sends `2026-09-29 12:00:00 UTC`; a date is a date whichever way it
 * is spelled, and one that cannot be read is reported rather than assumed. */
export function daysUntil(
  expires: string | null,
  now: Date = new Date(),
): number | null {
  if (!expires) return null;
  const when = Date.parse(expires.replace(/\s+UTC$/i, "Z").replace(" ", "T"));
  if (Number.isNaN(when)) return null;
  return Math.ceil((when - now.getTime()) / DAY);
}

export type ExpiryNote = { text: string; urgent: boolean };

/** What the dialog says about the end of this token, and whether it says it
 * loudly. Silence when GitHub named no expiry — a token that never expires is
 * not news. */
export function expiryNote(
  expires: string | null,
  now: Date = new Date(),
): ExpiryNote | null {
  if (!expires) return null;
  const days = daysUntil(expires, now);
  const on = expires.slice(0, 10);
  if (days === null) return { text: `expires ${expires}`, urgent: false };
  if (days <= 0) return { text: `expired on ${on}`, urgent: true };
  if (days <= EXPIRY_WARNING_DAYS) {
    return {
      text: `expires on ${on}, in ${days} ${days === 1 ? "day" : "days"} — sign in again before it does`,
      urgent: true,
    };
  }
  return { text: `expires on ${on}`, urgent: false };
}

/** The verdict this token was given, or nothing. A verdict names the token it
 * was issued for, so a newly landed one is unverified until it passes on its
 * own. */
export function readVerdict(
  storage: KeyStore,
  token: string | null,
): TokenVerdict | null {
  if (!token) return null;
  const held = storage.get(STORAGE.verified);
  if (!held) return null;
  let parsed: Partial<TokenVerdict>;
  try {
    parsed = JSON.parse(held) as Partial<TokenVerdict>;
  } catch {
    return null;
  }
  if (
    parsed.fingerprint !== fingerprintOf(token) ||
    typeof parsed.login !== "string"
  ) {
    return null;
  }
  return {
    fingerprint: parsed.fingerprint,
    login: parsed.login,
    expires: typeof parsed.expires === "string" ? parsed.expires : null,
  };
}

export function rememberVerdict(
  storage: KeyStore,
  verdict: TokenVerdict,
): void {
  storage.set(STORAGE.verified, JSON.stringify(verdict));
}

export function forgetVerdict(storage: KeyStore): void {
  storage.remove(STORAGE.verified);
}
