import {
  createWorker,
  defineReferenceCaptures,
  watchDeploys,
} from "@grade10/ui-verification/worker";

const archiveWorker = createWorker();

// Reference captures run in this Durable Object, in a Cloudflare Browser
// Rendering browser. A session outlives one batch by its keep-alive, then
// closes; each batch opens its own.
export const ReferenceCaptures = defineReferenceCaptures({
  launch: async (env) => {
    const { launch } = await import("@cloudflare/playwright");
    return launch(env.BROWSER, { keep_alive: 120_000 });
  },
});

function unavailableResponse() {
  return new Response(
    JSON.stringify({
      error: "archive storage is unavailable",
      code: "ARCHIVE_UNAVAILABLE",
    }),
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      if (!env?.ARCHIVE) return unavailableResponse();

      const archiveEnv =
        env.ALLOWED_ORIGINS === undefined
          ? { ...env, ALLOWED_ORIGINS: url.origin }
          : env;
      return archiveWorker.fetch(request, archiveEnv);
    }

    return env.ASSETS.fetch(request);
  },

  // Each hour the Worker checks which build it serves; a new one starts a
  // full reference capture, held to one every six hours.
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(
      watchDeploys(env).catch((error) => {
        console.error("[ui-verification-captures] deploy watch failed", error);
        throw error;
      }),
    );
  },
};
