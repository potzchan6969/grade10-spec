import { describe, expect, it } from "vitest";
import { mintWakeToken, verifyWakeToken } from "../src/token.ts";

/** The wake token is the only credential a session holds, so it is checked for
 * what it claims, who signed it and how long it lives. */

const SECRET = "the-relay's-own-hmac-secret";
const NOW = 1_700_000_000_000;
const CLAIMS = {
  room: "7f9c0a1b2c3d4e5f60718293a4b5c6d7",
  wake: 2,
  exp: NOW + 30 * 60_000,
};

describe("the wake token", () => {
  it("verifies what it minted", async () => {
    const token = await mintWakeToken(SECRET, CLAIMS);
    expect(await verifyWakeToken(SECRET, token, NOW)).toEqual(CLAIMS);
  });

  it("is a path segment", async () => {
    const token = await mintWakeToken(SECRET, CLAIMS);
    expect(token).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  });

  it("refuses it after its expiry", async () => {
    const token = await mintWakeToken(SECRET, CLAIMS);
    expect(await verifyWakeToken(SECRET, token, CLAIMS.exp)).toBe(null);
    expect(await verifyWakeToken(SECRET, token, CLAIMS.exp - 1)).toEqual(
      CLAIMS,
    );
  });

  it("refuses a claim somebody changed", async () => {
    const token = await mintWakeToken(SECRET, CLAIMS);
    const [, signature] = token.split(".");
    const forged = await mintWakeToken(SECRET, { ...CLAIMS, wake: 3 });
    const claims = forged.split(".")[0];
    expect(await verifyWakeToken(SECRET, `${claims}.${signature}`, NOW)).toBe(
      null,
    );
  });

  it("refuses a signature somebody changed", async () => {
    const [claims] = (await mintWakeToken(SECRET, CLAIMS)).split(".");
    expect(
      await verifyWakeToken(SECRET, `${claims}.bm90LWEtc2lnbmF0dXJl`, NOW),
    ).toBe(null);
  });

  it("refuses another secret's token", async () => {
    const token = await mintWakeToken("another-secret", CLAIMS);
    expect(await verifyWakeToken(SECRET, token, NOW)).toBe(null);
  });

  it("refuses a token that is not two parts", async () => {
    expect(await verifyWakeToken(SECRET, "not-a-token", NOW)).toBe(null);
    expect(await verifyWakeToken(SECRET, "a.b.c", NOW)).toBe(null);
  });
});
