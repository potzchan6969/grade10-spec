/**
 * Who is asking, as Cloudflare Access names them: a person's e-mail, or
 * `service:<common name>` for a service token, read only from an Access token
 * whose signature, audience, issuer and expiry check out against the team in
 * `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD`. Without them the desk refuses
 * everyone, so a missing var never trusts a header a client can write.
 */

export type AccessEnv = {
  /** `grade10.cloudflareaccess.com`. */
  ACCESS_TEAM_DOMAIN?: string;
  /** The Access application's audience tag. */
  ACCESS_AUD?: string;
  /** Local dev only, honoured on a localhost request alone: the identity
   * when no Access stands in front. */
  DESK_DEV_EMAIL?: string;
};

export type Identity = { email: string } | { status: 403 | 503; error: string };

type Claims = {
  email?: string;
  common_name?: string;
  aud?: string | string[];
  iss?: string;
  exp?: number;
  nbf?: number;
};

/** The team's signing keys by `kid`. */
export type KeySource = (team: string) => Promise<Map<string, CryptoKey>>;

const ALGORITHM = { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" } as const;

/** Keys fetched from the team's certs endpoint and held for an hour, or
 * fetched again at once when a token names a key not yet held. */
export function accessCerts(
  fetchJson: (url: string) => Promise<unknown> = async (url) => {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Access certs at ${url} answered ${response.status}`);
    return response.json();
  },
  now: () => number = Date.now,
): KeySource & { refresh: (team: string) => void } {
  const held = new Map<
    string,
    { at: number; keys: Promise<Map<string, CryptoKey>> }
  >();
  const load = async (team: string) => {
    const body = (await fetchJson(`https://${team}/cdn-cgi/access/certs`)) as {
      keys?: (JsonWebKey & { kid?: string })[];
    };
    const keys = new Map<string, CryptoKey>();
    for (const jwk of body.keys ?? []) {
      if (!jwk.kid || jwk.kty !== "RSA") continue;
      keys.set(
        jwk.kid,
        await crypto.subtle.importKey("jwk", jwk, ALGORITHM, false, ["verify"]),
      );
    }
    return keys;
  };
  const source = (team: string) => {
    const cached = held.get(team);
    if (cached && now() - cached.at < 3_600_000) return cached.keys;
    const keys = load(team);
    held.set(team, { at: now(), keys });
    keys.catch(() => held.delete(team));
    return keys;
  };
  return Object.assign(source, {
    refresh: (team: string) => held.delete(team),
  });
}

const refused = (error: string): Identity => ({ status: 403, error });

const fromBase64Url = (part: string): Uint8Array<ArrayBuffer> => {
  const text = atob(part.replaceAll("-", "+").replaceAll("_", "/"));
  return Uint8Array.from(text, (c) => c.charCodeAt(0));
};

function readToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return undefined;
  try {
    const decode = (part: string) =>
      JSON.parse(new TextDecoder().decode(fromBase64Url(part)));
    return {
      header: decode(parts[0]) as { alg?: string; kid?: string },
      claims: decode(parts[1]) as Claims,
      signed: new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
      signature: fromBase64Url(parts[2]),
    };
  } catch {
    return undefined;
  }
}

const named = (claims: Claims): Identity | undefined =>
  claims.email
    ? { email: claims.email }
    : claims.common_name
      ? { email: `service:${claims.common_name}` }
      : undefined;

export async function identify(
  headers: Headers,
  env: AccessEnv,
  keys: KeySource & { refresh?: (team: string) => void },
  now: () => number = Date.now,
  local = false,
): Promise<Identity> {
  if (local && env.DESK_DEV_EMAIL) return { email: env.DESK_DEV_EMAIL };
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD)
    return {
      status: 503,
      error:
        "the desk cannot check who is asking: ACCESS_TEAM_DOMAIN and ACCESS_AUD are not set on the manual's Worker",
    };
  const token = headers.get("cf-access-jwt-assertion");
  const read = token ? readToken(token) : undefined;
  if (!read) return refused("no Cloudflare Access token on the request");
  const team = env.ACCESS_TEAM_DOMAIN;
  const { header, claims } = read;
  if (header.alg !== "RS256" || !header.kid)
    return refused("the Access token is not signed RS256 with a key id");
  let key = (await keys(team)).get(header.kid);
  if (!key && keys.refresh) {
    keys.refresh(team);
    key = (await keys(team)).get(header.kid);
  }
  if (!key)
    return refused("the Access token names a key the team does not hold");
  const valid = await crypto.subtle.verify(
    ALGORITHM,
    key,
    read.signature,
    read.signed,
  );
  if (!valid) return refused("the Access token's signature does not verify");
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!audiences.includes(env.ACCESS_AUD))
    return refused("the Access token is for another application");
  if (claims.iss !== `https://${team}`)
    return refused("the Access token was issued by another team");
  const seconds = now() / 1000;
  if (claims.exp === undefined || claims.exp <= seconds)
    return refused("the Access token has expired: sign in again");
  if (claims.nbf !== undefined && claims.nbf > seconds + 60)
    return refused("the Access token is not valid yet");
  return named(claims) ?? refused("the Access token names nobody");
}
