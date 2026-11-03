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

async function toDesk(request: Request, env: Env): Promise<Response> {
  const who = await identify(request.headers, env, certs);
  if ("error" in who)
    return Response.json({ error: who.error }, { status: who.status });
  const headers = new Headers(request.headers);
  headers.delete(DESK_EMAIL_HEADER);
  headers.set(DESK_EMAIL_HEADER, who.email);
  return env.DESK.fetch(new Request(request, { headers }));
}

export default {
  fetch(request, env) {
    return isDesk(new URL(request.url).pathname)
      ? toDesk(request, env)
      : env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
