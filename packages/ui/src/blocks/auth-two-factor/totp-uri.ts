/** What an authenticator app saves when it reads an `otpauth://` URI. */
type TotpEnrollment = {
  /** The service the code belongs to — "Grade10". */
  issuer: string;
  /** The account within it, usually an email address. */
  account: string;
  /** The base32 shared secret, for typing in by hand. */
  secret: string;
};

/**
 * Reads the three things a person needs to see before trusting a QR code.
 *
 * `otpauth://` is a non-special scheme, so `URL` leaves the label in `pathname`
 * — `/Issuer:account` — while `secret` and `issuer` arrive as query parameters.
 * The query wins where both carry an issuer, which is what the spec says.
 *
 * A URI this cannot parse yields empty strings rather than throwing: the QR is
 * rendered from the raw URI and still scans, so a surprise here must cost a
 * row, never the screen.
 */
function parseTotpUri(uri: string): TotpEnrollment {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    return { issuer: "", account: "", secret: "" };
  }

  const label = decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  const separator = label.indexOf(":");
  const labelIssuer = separator === -1 ? "" : label.slice(0, separator);
  const account = separator === -1 ? label : label.slice(separator + 1);

  return {
    issuer: url.searchParams.get("issuer") ?? labelIssuer,
    account: account.trim(),
    secret: url.searchParams.get("secret") ?? "",
  };
}

export type { TotpEnrollment };
export { parseTotpUri };
