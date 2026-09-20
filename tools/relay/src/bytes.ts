/**
 * The byte plumbing the signatures need: UTF-8, hex, base64url and a compare
 * that takes the same time whichever byte differs.
 *
 * WebCrypto is the only cryptography here, so every caller ends up holding an
 * ArrayBuffer and needing it as text. One module holds those four turns rather
 * than each caller writing its own.
 */

/** A byte-for-byte compare that does not stop at the first difference: a
 * compare that returns early tells an attacker how much of a signature it
 * guessed right. */
export function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let differences = 0;
  for (let i = 0; i < a.length; i += 1) differences |= a[i] ^ b[i];
  return differences === 0;
}

export function utf8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

export function fromUtf8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function fromHex(hex: string): Uint8Array {
  const clean = hex.length % 2 === 0 ? hex : "";
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = Number.parseInt(clean.slice(i * 2, i * 2 + 2), 16);
    if (Number.isNaN(byte)) return new Uint8Array();
    bytes[i] = byte;
  }
  return bytes;
}

/** base64url, because a wake token is a path segment: `+`, `/` and `=` all
 * mean something else in a URL. */
export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function fromBase64Url(text: string): Uint8Array {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/");
  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    // A token somebody edited is not base64 at all. The caller reads an empty
    // signature as a failed compare, which is the same refusal.
    return new Uint8Array();
  }
}

/** Plain base64, as the code host's contents API returns a file: wrapped in
 * newlines, which base64 decoders refuse. */
export function fromBase64(text: string): Uint8Array {
  return fromBase64Url(text.replace(/\s+/g, ""));
}

export async function hmacSha256(
  secret: string,
  message: string,
): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    utf8(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, utf8(message));
  return new Uint8Array(signature);
}
