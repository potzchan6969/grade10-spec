import { DESK_BASE, DESK_EMAIL_HEADER } from "../src/api/desk.ts";
import { type AccessEnv, accessCerts, identify } from "./identity.ts";

/**
 * The manual's Worker: the built site as static assets, and the run desk
 * under /api/desk, reached through the DESK binding with the Access identity
 * named in the one header the desk trusts. WebSocket upgrades pass through.
 */

type Env = AccessEnv & {
  ASSETS: Fetcher;
  DESK: Fetcher;
};

const certs = accessCerts();

const isDesk = (path: string) =>
  path === DESK_BASE || path.startsWith(`${DESK_BASE}/`);

const LOCAL = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** A browser's request from another site, which only a forged form or a
 * foreign page's script sends; scripts with a service token send no Origin. */
export function crossSite(request: Request, url: URL): boolean {
  const origin = request.headers.get("origin");
  if (origin !== null && origin !== url.origin) return true;
  const site = request.headers.get("sec-fetch-site");
  return site !== null && site !== "same-origin" && site !== "none";
}

async function toDesk(request: Request, env: Env, url: URL): Promise<Response> {
  if (crossSite(request, url))
    return Response.json(
      { error: "the desk answers the manual's own pages only" },
      { status: 403 },
    );
  const who = await identify(
    request.headers,
    env,
    certs,
    Date.now,
    LOCAL.has(url.hostname),
  );
  if ("error" in who)
    return Response.json({ error: who.error }, { status: who.status });
  const headers = new Headers(request.headers);
  headers.delete(DESK_EMAIL_HEADER);
  headers.set(DESK_EMAIL_HEADER, who.email);
  return env.DESK.fetch(new Request(request, { headers }));
}

export default {
  fetch(request, env) {
    const url = new URL(request.url);
    return isDesk(url.pathname)
      ? toDesk(request, env, url)
      : env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
