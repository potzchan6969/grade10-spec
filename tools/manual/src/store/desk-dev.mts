import type { IncomingMessage, ServerResponse } from "node:http";
import type { Connect, Plugin, ProxyOptions } from "vite";
import { DESK_BASE, DESK_EMAIL_HEADER } from "../api/desk.ts";

/**
 * The run desk in dev: `pnpm desk:dev` serves it locally and `DESK_DEV_URL`
 * points the manual's dev server at it, sockets included. The local desk
 * names its own dev identity, so a client's header never reaches it. With no
 * desk named, its paths answer 503 and say how to start one.
 */

export const isDeskPath = (path: string) =>
  path === DESK_BASE || path.startsWith(`${DESK_BASE}/`);

export function deskDevProxy(
  target = process.env.DESK_DEV_URL,
): Record<string, ProxyOptions> {
  if (!target) return {};
  return {
    [DESK_BASE]: {
      target,
      ws: true,
      changeOrigin: true,
      configure(proxy) {
        proxy.on("proxyReq", (req) => req.removeHeader(DESK_EMAIL_HEADER));
        proxy.on("proxyReqWs", (req) => req.removeHeader(DESK_EMAIL_HEADER));
      },
    },
  };
}

export function deskDevFallback(target = process.env.DESK_DEV_URL): Plugin {
  const noDesk: Connect.NextHandleFunction = (
    req: IncomingMessage,
    res: ServerResponse,
    next,
  ) => {
    if (!isDeskPath(new URL(req.url ?? "/", "http://manual.local").pathname))
      return next();
    res.statusCode = 503;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(
      JSON.stringify({
        error: "no desk in dev: run pnpm desk:dev and set DESK_DEV_URL",
      }),
    );
  };
  return {
    name: "run-desk-dev",
    configureServer(server) {
      if (!target) server.middlewares.use(noDesk);
    },
    configurePreviewServer(server) {
      if (!target) server.middlewares.use(noDesk);
    },
  };
}
