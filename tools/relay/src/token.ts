/**
 * The wake token: the only credential a session holds. It names the room, the
 * wake inside that room and the moment it stops working, and it is signed with
 * TOKEN_SECRET so a session cannot mint itself another room, another wake or a
 * longer life.
 *
 * `<claims>.<signature>`, both base64url, because the token is a path segment.
 * The claims travel in the clear on purpose: the relay reads the room off the
 * token rather than keeping a table of live tokens.
 */
import {
  equalBytes,
  fromBase64Url,
  fromUtf8,
  hmacSha256,
  toBase64Url,
  utf8,
} from "./bytes.ts";

export interface WakeClaims {
  /** The Durable Object id of the room, as a string. */
  room: string;
  /** Which wake of that room: a token outlives its wake only until `exp`, and
   * the room refuses a wake number that is not the one running. */
  wake: number;
  /** Wake start plus the budget, in milliseconds. */
  exp: number;
}

/** The claims as the bytes that get signed. Written by hand, in one order, so
 * mint and verify sign the same string whatever the key order was. */
function claimsText(claims: WakeClaims): string {
  return JSON.stringify({
    room: claims.room,
    wake: claims.wake,
    exp: claims.exp,
  });
}

export async function mintWakeToken(
  secret: string,
  claims: WakeClaims,
): Promise<string> {
  const text = claimsText(claims);
  const signature = await hmacSha256(secret, text);
  return `${toBase64Url(utf8(text))}.${toBase64Url(signature)}`;
}

/** The claims, or null: a token whose signature does not verify, whose claims
 * are not the three the relay signs, or whose `exp` has passed. */
export async function verifyWakeToken(
  secret: string,
  token: string,
  nowMs: number,
): Promise<WakeClaims | null> {
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra !== undefined) return null;
  const text = fromUtf8(fromBase64Url(encoded));
  const expected = await hmacSha256(secret, text);
  if (!equalBytes(fromBase64Url(signature), expected)) return null;
  let claims: Partial<WakeClaims>;
  try {
    claims = JSON.parse(text) as Partial<WakeClaims>;
  } catch {
    return null;
  }
  if (
    typeof claims.room !== "string" ||
    typeof claims.wake !== "number" ||
    typeof claims.exp !== "number"
  )
    return null;
  if (claims.exp <= nowMs) return null;
  return { room: claims.room, wake: claims.wake, exp: claims.exp };
}
