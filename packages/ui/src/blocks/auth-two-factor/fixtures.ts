/* Example enrollment content for the stories only. A consumer supplies its
 * own; nothing here is a default. The URI is the shape better-auth mints:
 * `otpauth://totp/<issuer>:<account>?secret=…&issuer=…`. */

const TOTP_URI =
  "otpauth://totp/Grade10:operator@example.com?secret=JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP&issuer=Grade10&digits=6&period=30";

const BACKUP_CODES = [
  "8f2a-91cd",
  "4b7e-30fa",
  "c015-6d92",
  "77ab-e4c3",
  "1d68-5b0f",
  "a293-cc71",
  "5e40-2fb8",
  "b8c1-07de",
  "3fa6-94b2",
  "e721-6a5d",
];

export { BACKUP_CODES, TOTP_URI };
