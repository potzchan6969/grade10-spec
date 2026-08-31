import { STORAGE } from "./config";
import type { KeyStore } from "./github-store";

/**
 * The client half of signing in with GitHub. The worker under `/auth/*` does
 * the OAuth exchange and lands the token in this browser; what this module
 * owns is the renewal that comes with it — when the token is about to die,
 * whether the refresh token can still buy the next one, and the one call
 * that does. A token with no expiry never needs any of it.
 */

export type Renewal = {
  /** ISO time the access token dies, null for one that never does. */
  expiresAt: string | null;
  refreshToken: string | null;
  /** ISO time the refresh token itself dies, null for never. */
  refreshExpiresAt: string | null;
};

export type Grant = Renewal & { token: string };

/** Refresh this long before the token dies, so a push started near the end
 * of its life is never the thing that discovers the expiry. */
export const REFRESH_MARGIN_MS = 5 * 60 * 1000;

export function readRenewal(storage: KeyStore): Renewal | null {
  const held = storage.get(STORAGE.grant);
  if (!held) return null;
  let parsed: Partial<Renewal>;
  try {
    parsed = JSON.parse(held) as Partial<Renewal>;
  } catch {
    return null;
  }
  return {
    expiresAt: typeof parsed.expiresAt === "string" ? parsed.expiresAt : null,
    refreshToken:
      typeof parsed.refreshToken === "string" ? parsed.refreshToken : null,
    refreshExpiresAt:
      typeof parsed.refreshExpiresAt === "string"
        ? parsed.refreshExpiresAt
        : null,
  };
}

export function rememberRenewal(storage: KeyStore, renewal: Renewal): void {
  storage.set(
    STORAGE.grant,
    JSON.stringify({
      expiresAt: renewal.expiresAt,
      refreshToken: renewal.refreshToken,
      refreshExpiresAt: renewal.refreshExpiresAt,
    }),
  );
}

export function forgetRenewal(storage: KeyStore): void {
  storage.remove(STORAGE.grant);
}

/** The token is close enough to its end to renew now. A token that never
 * expires, or a renewal nobody stored, never needs it. */
export function needsRefresh(
  renewal: Renewal | null,
  at: number = Date.now(),
): boolean {
  if (!renewal?.expiresAt) return false;
  const dies = Date.parse(renewal.expiresAt);
  if (Number.isNaN(dies)) return false;
  return dies - at < REFRESH_MARGIN_MS;
}

/** Whether the refresh token can still buy the next access token. */
export function canRefresh(
  renewal: Renewal | null,
  at: number = Date.now(),
): boolean {
  if (!renewal?.refreshToken) return false;
  if (!renewal.refreshExpiresAt) return true;
  const dies = Date.parse(renewal.refreshExpiresAt);
  return Number.isNaN(dies) || dies > at;
}

/** Trade the refresh token for the next access token, through the worker
 * that holds the app secret. Throws with GitHub's reason when it refuses —
 * the caller decides whether that means signing in again. */
export async function renewGrant(
  renewal: Renewal,
  http: typeof fetch = fetch,
): Promise<Grant> {
  const answer = await http("/auth/refresh", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken: renewal.refreshToken }),
  });
  const body = (await answer.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;
  if (!answer.ok || typeof body.token !== "string") {
    const said = typeof body.message === "string" ? body.message : "";
    throw new Error(
      `the sign-in could not be renewed${said ? `: ${said}` : ` (HTTP ${answer.status})`}`,
    );
  }
  return {
    token: body.token,
    expiresAt: typeof body.expiresAt === "string" ? body.expiresAt : null,
    refreshToken:
      typeof body.refreshToken === "string" ? body.refreshToken : null,
    refreshExpiresAt:
      typeof body.refreshExpiresAt === "string" ? body.refreshExpiresAt : null,
  };
}

export type AuthAvailability = { enabled: boolean };

/** Whether the hosted site can sign anyone in — the worker says so once its
 * GitHub App credentials are configured. A site with no worker (a preview, a
 * fixture build) reads as disabled rather than as broken. */
export async function authAvailability(
  http: typeof fetch = fetch,
): Promise<AuthAvailability> {
  try {
    const answer = await http("/auth/config");
    if (!answer.ok) return { enabled: false };
    const body = (await answer.json()) as Record<string, unknown>;
    return { enabled: body.enabled === true };
  } catch {
    return { enabled: false };
  }
}

/** Where the sign-in starts, carrying the page to come back to. */
export function signInPath(back: string): string {
  return `/auth/login?back=${encodeURIComponent(back)}`;
}
