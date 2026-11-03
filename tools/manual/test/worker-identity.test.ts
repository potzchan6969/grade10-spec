import { describe, expect, test } from "vitest";
import { accessCerts, identify } from "../worker/identity.ts";

const TEAM = "grade10.cloudflareaccess.com";
const AUD = "aud-tag";
const NOW = Date.UTC(2026, 10, 3, 9, 0, 0);
const ALGORITHM = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as const;

const base64Url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
const encode = (value: unknown) =>
  base64Url(new TextEncoder().encode(JSON.stringify(value)));

async function teamKeys() {
  const pair = (await crypto.subtle.generateKey(
    {
      ...ALGORITHM,
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
    },
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
  const jwk = {
    ...(await crypto.subtle.exportKey("jwk", pair.publicKey)),
    kid: "k1",
  };
  let fetched = 0;
  const certs = accessCerts(async (url) => {
    expect(url).toBe(`https://${TEAM}/cdn-cgi/access/certs`);
    fetched++;
    return { keys: [jwk] };
  });
  const sign = async (
    claims: Record<string, unknown>,
    kid = "k1",
    key = pair.privateKey,
  ) => {
    const head = `${encode({ alg: "RS256", kid })}.${encode(claims)}`;
    const signature = await crypto.subtle.sign(
      ALGORITHM,
      key,
      new TextEncoder().encode(head),
    );
    return `${head}.${base64Url(new Uint8Array(signature))}`;
  };
  return { certs, sign, fetched: () => fetched };
}

const claims = (extra: Record<string, unknown> = {}) => ({
  aud: [AUD],
  iss: `https://${TEAM}`,
  exp: NOW / 1000 + 600,
  email: "tester@grade10.com",
  ...extra,
});

const verifying = { ACCESS_TEAM_DOMAIN: TEAM, ACCESS_AUD: AUD };
const noKeys = async () => new Map<string, CryptoKey>();
const at = () => NOW;

describe("the desk's identity, as Cloudflare Access names it", () => {
  test("without a team configured, nobody is named, whatever the request says", async () => {
    const unsigned = `${encode({ alg: "none" })}.${encode({ email: "forged@x" })}.AAAA`;
    for (const headers of [
      new Headers({ "cf-access-authenticated-user-email": "boss@x" }),
      new Headers({ "cf-access-jwt-assertion": unsigned }),
      new Headers(),
    ]) {
      expect(await identify(headers, {}, noKeys)).toMatchObject({
        status: 503,
        error: expect.stringMatching(/ACCESS_TEAM_DOMAIN and ACCESS_AUD/),
      });
    }
  });

  test("local dev stands in an e-mail of its own on localhost alone", async () => {
    const dev = { DESK_DEV_EMAIL: "dev@grade10.local" };
    expect(await identify(new Headers(), dev, noKeys, at, true)).toEqual({
      email: "dev@grade10.local",
    });
    expect(await identify(new Headers(), dev, noKeys, at, false)).toMatchObject(
      { status: 503 },
    );
  });

  test("with a team configured, a request with no token is refused with the reason", async () => {
    expect(await identify(new Headers(), verifying, noKeys, at)).toEqual({
      status: 403,
      error: "no Cloudflare Access token on the request",
    });
  });

  test("with a team configured, an unsigned token names nobody", async () => {
    const { certs } = await teamKeys();
    const unsigned = `${encode({ alg: "none" })}.${encode(claims())}.AAAA`;
    expect(
      await identify(
        new Headers({ "cf-access-jwt-assertion": unsigned }),
        verifying,
        certs,
        at,
      ),
    ).toMatchObject({ status: 403, error: expect.stringMatching(/RS256/) });
  });

  test("with a team configured, a token signed by the team's key names its holder", async () => {
    const { certs, sign, fetched } = await teamKeys();
    const person = new Headers({
      "cf-access-jwt-assertion": await sign(claims()),
    });
    expect(await identify(person, verifying, certs, at)).toEqual({
      email: "tester@grade10.com",
    });
    const service = new Headers({
      "cf-access-jwt-assertion": await sign(
        claims({ email: undefined, common_name: "release.access" }),
      ),
    });
    expect(await identify(service, verifying, certs, at)).toEqual({
      email: "service:release.access",
    });
    expect(fetched()).toBe(1);
  });

  test("with a team configured, the header alone is not enough", async () => {
    const { certs } = await teamKeys();
    const headers = new Headers({
      "cf-access-authenticated-user-email": "qa@grade10.com",
    });
    expect(await identify(headers, verifying, certs, at)).toMatchObject({
      status: 403,
    });
  });

  test.each([
    ["another key's signature", { forge: true }, /signature does not verify/],
    ["another application", { aud: ["other"] }, /another application/],
    [
      "another team",
      { iss: "https://other.cloudflareaccess.com" },
      /another team/,
    ],
    ["an expired token", { exp: NOW / 1000 - 1 }, /expired/],
    ["an unknown key", { kid: "k9" }, /key the team does not hold/],
  ])("refuses %s", async (_, change, reason) => {
    const { certs, sign } = await teamKeys();
    const { forge, kid, ...extra } = change as Record<string, unknown>;
    const other = forge
      ? (
          (await crypto.subtle.generateKey(
            {
              ...ALGORITHM,
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
            },
            true,
            ["sign", "verify"],
          )) as CryptoKeyPair
        ).privateKey
      : undefined;
    const token = await sign(claims(extra), (kid as string) ?? "k1", other);
    const answer = await identify(
      new Headers({ "cf-access-jwt-assertion": token }),
      verifying,
      certs,
      at,
    );
    expect(answer).toMatchObject({
      status: 403,
      error: expect.stringMatching(reason),
    });
  });
});
